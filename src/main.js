'use strict';
import 'unfetch/polyfill'
import "regenerator-runtime/runtime";
import {find, get, identity, isEqual, max, mean, merge, min, range as lodash_range, round} from 'lodash-es';


// a couple module-level variables
let all_areas = null;
let when_areas = null;
/* globals jQuery, window, Plotly, fetch */
export default class ClimateByLocationWidget {
  /**
   * @param {Element|string|jQuery} element as jquery object, string query selector, or element object
   * @param {Object} options
   * @param {string|number} options.area_id - // Id obtained from available areas (use ClimateByLocationWidget.when_areas() to lookup areas)
   * @param {string} options.frequency - time frequency of graph to display ("annual", "monthly")
   * @param {string} options.variable - name of variable to display (use ClimateByLocationWidget.when_variables() to lookup options)
   * @param {number} options.monthly_timeperiod - time period center for monthly graphs ("2025", "2050", or "2075")
   * @param {number} options.unitsystem - unit system to use for data presentation ("english", "metric")
   * @param {array<number, number>} options.x_axis_range - Sets the range of the x-axis.
   * @param {array<number, number>} options.y_axis_range - Sets the range of the y-axis.
   * @param {string} options.font - Defaults to 'Roboto'.
   * @param {boolean} options.show_legend - Whether or not to show the built-in legend. Defaults to false.
   * @param {boolean} options.show_historical_observed - Whether or not to show historical observed data if available.
   * @param {boolean} options.show_historical_modeled - Whether or not to show historical modeled data if available.
   * @param {boolean} options.show_projected_rcp45 - Whether or not to show projected modeled RCP4.5 data if available.
   * @param {boolean} options.show_projected_rcp85 - Whether or not to show projected modeled RCP8.5 data if available.
   * @param {boolean} options.responsive - Whether or not to listen to window resize events and auto-resize the graph. Can only be set on instantiation.
   */
  constructor(element, options = {}) {
    this.options = {
      // default values:
      area_id: null,
      unitsystem: "english",
      variable: "tmax",
      frequency: "annual",
      monthly_timeperiod: "2025",
      x_axis_range: null,
      y_axis_range: null,
      data_api_endpoint: 'https://grid2.rcc-acis.org/GridData',
      island_data_url_template: 'island_data/{area_id}.json',
      colors: {
        rcp85: {
          line: 'rgb(245,68,45)',
          innerBand: 'rgb(246,86,66)',
          outerBand: 'rgb(247,105,86)'
        },
        rcp45: {
          line: 'rgb(0,88,207)',
          innerBand: 'rgb(25,104,211)',
          outerBand: 'rgb(50,121,216)'
        },
        hist: {
          innerBand: "rgb(170,170,170)",
          outerBand: "rgb(187,187,187)",
          line: 'rgb(0,0,0)',
          bar: 'rgb(119,119,119)'
        },
        opacity: {
          ann_hist_minmax: 0.6,
          ann_proj_minmax: 0.5,
          mon_proj_minmax: 0.5,
          hist_obs: 1,
          proj_line: 1,
        }
      },
      get_area_label: this.get_area_label.bind(this),
      show_historical_observed: true,
      show_historical_modeled: true,
      show_projected_rcp45: true,
      show_projected_rcp85: true,
      show_legend: false,
      responsive: true,
    };
    this.options = merge(this.options, options);

    if (typeof element === "string") {
      element = document.querySelector(this.element);
    } else if (!!jQuery && element instanceof jQuery) {
      element = element[0]
    }
    this.element = element;

    if (!this.element) {
      console.log('Climate By Location widget created with no element. Nothing will be displayed.');
    }

    this.downloadable_dataurls = null;

    this.element.innerHTML = `<div class='graph' style='width: 100%; height: 100%;'></div>`;
    this.graphdiv = this.element.querySelector('div.graph');
    /** @type {function} */
    this._update_visibility = null;
    /** @var _when_chart {Promise} - Promise for the most recent plotly graph. */
    this._when_chart = null;
    this.update();
    if (this.options.responsive) {
      window.addEventListener('resize', this.resize.bind(this));
    }
  }

  /*
   * Public instance methods
   */

  /**
   * Gets the variable config object for the currently selected variable.
   * @return {*}
   */
  get_variable_config() {
    return find(ClimateByLocationWidget._variables, (c) => c.id === this.options.variable);
  }


  /**
   * Gets the county or state that is currently selected.
   */
  get_area_label() {
    return get(this.get_area(), 'area_label', null) || this.options.area_id;
  }

  /**
   * Gets the area object for the area that is currently selected.
   * @return {{area_id, area_label, area_type, state}}
   */
  get_area() {
    return get(ClimateByLocationWidget.get_areas(null, null, this.options.area_id), 0, null)
  }


  set_options(options) {
    let old_options = Object.assign({}, this.options);
    this.options = merge({}, old_options, options);
    ClimateByLocationWidget._bool_options.forEach((option) => {
      if (typeof options[option] === "string") {
        options[option] = options[option].toLowerCase() === "true";
      }
    });
    if (!get(ClimateByLocationWidget, ['_frequencies', this.options.frequency, 'supports_area'], () => true)(this.options.area_id)) {
      this.options.frequency = ClimateByLocationWidget.get_variables(this.options.area_id)[0].id
    }
    if (!get(ClimateByLocationWidget, ['variables', this.options.variable, 'supports_area'], () => true)(this.options.area_id)) {
      this.options.variable = ClimateByLocationWidget.get_variables(this.options.frequency, null, this.options.area_id)[0].id
    }

    // if frequency, state, county, or variable changed, trigger a larger update cycle (new data + plots maybe changed):
    if (this.options.frequency !== old_options.frequency
        || this.options.area_id !== old_options.area_id
        || this.options.variable !== old_options.variable
        || this.options.monthly_timeperiod !== old_options.monthly_timeperiod
    ) {
      this.update();
    } else {
      if ((this.options.show_projected_rcp45 !== old_options.show_projected_rcp45
          || this.options.show_projected_rcp85 !== old_options.show_projected_rcp85
          || this.options.show_historical_observed !== old_options.show_historical_observed
          || this.options.show_historical_modeled !== old_options.show_historical_modeled) && this._update_visibility !== null) {
        this._update_visibility();
      }
      if (this.options.x_axis_range !== old_options.x_axis_range) {
        this.set_x_axis_range(...this.options.x_axis_range)
      }
    }
    return this;
  }

  /**
   * This function will set the range of data visible on the graph's x-axis without refreshing the rest of the graph.
   *
   * @param min
   * @param max
   * @returns {boolean}
   */
  set_x_axis_range(min, max) {
    return (this.options.x_axis_range = [min, max]) && (Plotly.relayout(this.graphdiv, {'xaxis.range': this.options.x_axis_range}) && this.options.x_axis_range)
  }


  /**
   * Requests the widget update according to its current options. Use `set_options()` to change options instead.
   * @returns {Promise<void>}
   */
  async update() {
    this._show_spinner();
    this._reset_downloadable_dataurls();
    // todo re-implement plot clearing?
    // this.hide_all_plots();
    if (!!this.options.area_id && !!this.options.variable && !!this.options.frequency) {
      if (this.options.frequency === "annual") {
        if (ClimateByLocationWidget.is_ak_area(this.options.area_id)) {
          await this._update_annual_ak()
        } else if (ClimateByLocationWidget.is_island_area(this.options.area_id)) {
          await this._update_annual_island();
        } else {
          await this._update_annual_conus();
        }
      } else if (this.options.frequency === "monthly") {
        if (ClimateByLocationWidget.is_ak_area(this.options.area_id)) {
          // do nothing
        } else if (ClimateByLocationWidget.is_island_area(this.options.area_id)) {
          await this._update_monthly_island();
        } else {
          await this._update_monthly_conus();
        }
      }
    }
  }

  /**
   * Registers an event handler for the specified event. Equivalent to `instance.element.addEventListener(type, listener)`
   */
  on(type, listener) {
    return this.element.addEventListener(type, listener);
  }


  /**
   * Forces chart to resize.
   */
  resize() {
    window.requestAnimationFrame(() => {
      Plotly.relayout(this.graphdiv, {
        'xaxis.autorange': true,
        'yaxis.autorange': true
      });
    })
  }


  /**
   * Generates an image of the chart and downloads it.
   * @returns {Promise}
   */
  download_image() {
    let {width, height} = window.getComputedStyle(this.element);
    width = Number.parseFloat(width) * 1.2;
    height = Number.parseFloat(height) * 1.2;
    return Plotly.downloadImage(this.graphdiv, {
      format: 'png', width: width, height: height, filename: [
        this.options.get_area_label.bind(this)(),
        this.options.frequency,
        this.options.variable,
        "graph"
      ].join('-').replace(/[^A-Za-z0-9\-]/g, '_') + '.png'
    });
  }

  /**
   * Transform an anchor element to download the historic observed data. Return false on failure / no data.
   * @param link
   * @returns {boolean}
   */
  download_hist_obs_data(link) {
    if (!this.downloadable_dataurls.hist_obs) {
      link.href = '#nodata';
      return false;
    }
    link.href = this.downloadable_dataurls.hist_obs;
    link.download = [
      this.options.get_area_label.bind(this)(),
      this.options.frequency,
      "hist_obs",
      this.options.variable
    ].join('-').replace(/ /g, '_') + '.csv';
    return true;
  }

  /**
   * Transform an anchor element to download the historic modelled data. Return false on failure / no data.
   * @param link
   * @returns {boolean}
   */
  download_hist_mod_data(link) {
    if (!this.downloadable_dataurls.hist_mod) {
      link.href = '#nodata';
      return false;
    }
    link.href = this.downloadable_dataurls.hist_mod;
    link.download = [
      this.options.get_area_label.bind(this)(),
      this.options.frequency,
      "hist_mod",
      this.options.variable
    ].join('-').replace(/ /g, '_') + '.csv';
    return true;
  }

  /**
   * Transform an anchor element to download the projected modelled data. Return false on failure / no data.
   * @param link
   * @returns {boolean}
   */
  download_proj_mod_data(link) {
    if (!this.downloadable_dataurls.proj_mod) {
      link.href = '#nodata';
      return false;
    }
    link.href = this.downloadable_dataurls.proj_mod;
    link.download = [
      this.options.get_area_label.bind(this)(),
      this.options.frequency,
      "proj_mod",
      this.options.variable
    ].join('-').replace(/ /g, '_') + '.csv';
    return true;
  }


  /*
   * Private methods
   */

  async _update_annual_conus() {
    const [hist_obs_data, hist_mod_data, proj_mod_data] = await Promise.all([
      this._get_historical_observed_livneh_data(),
      this._get_historical_annual_loca_model_data(),
      this._get_projected_loca_model_data()
    ])

    const variable_config = this.get_variable_config();

    this.downloadable_dataurls.hist_obs = this._format_export_data(['year', variable_config.id], hist_obs_data);
    this.downloadable_dataurls.hist_mod = this._format_export_data(['year', 'weighted_mean', 'min', 'max'], hist_mod_data);
    this.downloadable_dataurls.proj_mod = this._format_export_data(['year', 'rcp45_weighted_mean', 'rcp45_min', 'rcp45_max', 'rcp85_weighted_mean', 'rcp85_min', 'rcp85_max'], proj_mod_data);

    // unpack arrays
    const chart_data = {
      'hist_obs_base': [],
      'hist_obs_year': [],
      'hist_obs': [],
      'hist_obs_diff': [],
      'hist_year': [],
      'hist_mean': [],
      'hist_min': [],
      'hist_max': [],
      'hist_max_diff': [],
      'proj_year': [],
      'rcp45_mean': [],
      'rcp45_min': [],
      'rcp45_max': [],
      'rcp85_mean': [],
      'rcp85_min': [],
      'rcp85_max': []
    };
    const precision = 1;
    for (let i = 0; i < hist_obs_data.length; i++) {
      chart_data['hist_obs_year'].push(round(hist_obs_data[i][0], precision));
      chart_data['hist_obs'].push(round(hist_obs_data[i][1], precision));
      if (1961 <= hist_obs_data[i][0] <= 1990) {
        chart_data['hist_obs_base'].push(round(hist_obs_data[i][1], precision));
      }
    }

    const hist_obs_bar_base = mean(chart_data['hist_obs_base'])

    for (let i = 0; i < hist_obs_data.length; i++) {
      chart_data['hist_obs_diff'].push(round(hist_obs_data[i][1] - hist_obs_bar_base, precision));
    }

    for (let i = 0; i < hist_mod_data.length; i++) {
      chart_data['hist_year'].push(hist_mod_data[i][0]);
      chart_data['hist_mean'].push(round(hist_mod_data[i][1], precision));
      chart_data['hist_min'].push(round(hist_mod_data[i][2], precision));
      chart_data['hist_max'].push(round(hist_mod_data[i][3], precision));
    }

    // repeat 2005 data point to fill gap
    chart_data['proj_year'].push(hist_mod_data[hist_mod_data.length - 1][0]);
    chart_data['rcp45_mean'].push(round(hist_mod_data[hist_mod_data.length - 1][1], precision));
    chart_data['rcp45_min'].push(round(hist_mod_data[hist_mod_data.length - 1][2], precision));
    chart_data['rcp45_max'].push(round(hist_mod_data[hist_mod_data.length - 1][3], precision));
    chart_data['rcp85_mean'].push(round(hist_mod_data[hist_mod_data.length - 1][1], precision));
    chart_data['rcp85_min'].push(round(hist_mod_data[hist_mod_data.length - 1][2], precision));
    chart_data['rcp85_max'].push(round(hist_mod_data[hist_mod_data.length - 1][3], precision));

    for (let i = 0; i < proj_mod_data.length; i++) {
      chart_data['proj_year'].push(proj_mod_data[i][0]);
      chart_data['rcp45_mean'].push(round(proj_mod_data[i][1], precision));
      chart_data['rcp45_min'].push(round(proj_mod_data[i][2], precision));
      chart_data['rcp45_max'].push(round(proj_mod_data[i][3], precision));
      chart_data['rcp85_mean'].push(round(proj_mod_data[i][4], precision));
      chart_data['rcp85_min'].push(round(proj_mod_data[i][5], precision));
      chart_data['rcp85_max'].push(round(proj_mod_data[i][6], precision));
    }
    const [x_range_min, x_range_max, y_range_min, y_range_max] = this._update_axes_ranges(
        min([min(chart_data['hist_year']), min(chart_data['proj_year'])]),
        max([max(chart_data['hist_year']), max(chart_data['proj_year'])]),
        min([min(chart_data['hist_min']), min(chart_data['rcp45_min']), min(chart_data['rcp85_min'])]),
        max([max(chart_data['hist_max']), max(chart_data['rcp45_max']), max(chart_data['rcp85_max'])]),
    );

    Plotly.react(
        this.graphdiv,
        [
          {
            name: 'Modeled minimum (historical)',
            x: chart_data['hist_year'],
            y: chart_data['hist_min'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {color: ClimateByLocationWidget._rgba(this.options.colors.hist.outerBand, this.options.colors.opacity.ann_hist_minmax), width: 0, opacity: this.options.colors.opacity.ann_hist_minmax},
            legendgroup: 'hist',
            visible: !!this.options.show_historical_modeled ? true : 'legendonly',
          },
          {
            x: chart_data['hist_year'],
            // y: chart_data['hist_max_diff'],
            y: chart_data['hist_max'],
            // text: chart_data['hist_max'],
            // hoverinfo: 'text',
            name: 'Modeled maximum (historical)',
            type: 'scatter',
            mode: 'lines',
            fill: 'tonexty',
            fillcolor: ClimateByLocationWidget._rgba(this.options.colors.hist.outerBand, this.options.colors.opacity.ann_hist_minmax),
            line: {color: ClimateByLocationWidget._rgba(this.options.colors.hist.outerBand, this.options.colors.opacity.ann_hist_minmax), width: 0, opacity: this.options.colors.opacity.ann_hist_minmax},
            legendgroup: 'hist',
            visible: !!this.options.show_historical_modeled ? true : 'legendonly',
          },
          // {
          //   x: chart_data['hist_year'],
          //   y: chart_data['hist_mean'],
          //   type: 'scatter',
          //   mode: 'lines',
          //   name: 'Historical Mean',
          //   line: {color: '#000000'},
          //   legendgroup: 'hist',
          //   visible: !!this.options.show_historical_modeled ? true : 'legendonly',
          // },
          {
            x: chart_data['proj_year'],
            y: chart_data['rcp45_min'],
            name: 'Modeled minimum (RCP 4.5 projection)',
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            fillcolor: ClimateByLocationWidget._rgba(this.options.colors.rcp45.outerBand, this.options.colors.opacity.ann_proj_minmax),
            line: {color: ClimateByLocationWidget._rgba(this.options.colors.rcp45.outerBand, this.options.colors.opacity.ann_proj_minmax), width: 0, opacity: this.options.colors.opacity.ann_proj_minmax},
            legendgroup: 'rcp45',
            visible: this.options.show_projected_rcp45 ? true : 'legendonly',
          },
          {
            x: chart_data['proj_year'],
            y: chart_data['rcp45_max'],
            name: 'Modeled maximum (RCP 4.5 projection)',
            fill: 'tonexty',
            type: 'scatter',
            mode: 'lines',
            fillcolor: ClimateByLocationWidget._rgba(this.options.colors.rcp45.outerBand, this.options.colors.opacity.ann_proj_minmax),
            line: {color: ClimateByLocationWidget._rgba(this.options.colors.rcp45.outerBand, this.options.colors.opacity.ann_proj_minmax), width: 0, opacity: this.options.colors.opacity.ann_proj_minmax},
            legendgroup: 'rcp45',
            visible: this.options.show_projected_rcp45 ? true : 'legendonly',
          },
          {
            x: chart_data['proj_year'],
            y: chart_data['rcp85_min'],
            name: 'Modeled minimum (RCP 8.5 projection)',
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            fillcolor: ClimateByLocationWidget._rgba(this.options.colors.rcp85.outerBand, this.options.colors.opacity.ann_proj_minmax),
            line: {color: ClimateByLocationWidget._rgba(this.options.colors.rcp85.outerBand, this.options.colors.opacity.ann_proj_minmax), width: 0, opacity: this.options.colors.opacity.ann_proj_minmax},
            legendgroup: 'rcp85',
            visible: this.options.show_projected_rcp85 ? true : 'legendonly',
          },
          {
            x: chart_data['proj_year'],
            y: chart_data['rcp85_max'],
            name: 'Modeled maximum (RCP 8.5 projection)',
            fill: 'tonexty',
            type: 'scatter',
            mode: 'lines',
            fillcolor: ClimateByLocationWidget._rgba(this.options.colors.rcp85.outerBand, this.options.colors.opacity.ann_proj_minmax),
            line: {color: ClimateByLocationWidget._rgba(this.options.colors.rcp85.outerBand, this.options.colors.opacity.ann_proj_minmax), width: 0, opacity: this.options.colors.opacity.ann_proj_minmax},

            legendgroup: 'rcp85',
            visible: this.options.show_projected_rcp85 ? true : 'legendonly',
          },
          {
            x: chart_data['hist_obs_year'],
            y: chart_data['hist_obs_diff'],
            type: 'bar',
            yaxis: 'y2',
            base: hist_obs_bar_base,
            name: 'Historical Observed',
            line: {color: this.options.colors.hist.line, width: 0.5},
            marker: {color: ClimateByLocationWidget._rgba(this.options.colors.hist.bar, this.options.colors.opacity.hist_obs)},
            legendgroup: 'histobs',
            visible: !!this.options.show_historical_observed ? true : 'legendonly',
          },
          {
            x: chart_data['proj_year'],
            y: chart_data['rcp45_mean'],
            type: 'scatter',
            mode: 'lines',
            name: 'Modeled mean (RCP 4.5 projections, weighted)',
            line: {color: ClimateByLocationWidget._rgba(this.options.colors.rcp45.line, this.options.colors.opacity.proj_line)},
            visible: this.options.show_projected_rcp45 ? true : 'legendonly',
            legendgroup: 'rcp45',
            yaxis: 'y3'
          },
          {
            x: chart_data['proj_year'],
            y: chart_data['rcp85_mean'],
            type: 'scatter',
            mode: 'lines',
            name: 'Modeled mean (RCP 8.5 projections, weighted)',
            visible: this.options.show_projected_rcp85 ? true : 'legendonly',
            line: {color: ClimateByLocationWidget._rgba(this.options.colors.rcp85.line, this.options.colors.opacity.proj_line)},
            legendgroup: 'rcp85',
            yaxis: 'y3'
          },
        ],
        // layout
        {
          autosize: true,
          margin: {l: 50, t: 12, r: 12, b: 60},
          showlegend: this.options.show_legend,
          legend: {"orientation": "h"},
          xaxis: this._get_x_axis_layout(x_range_min, x_range_max),
          yaxis: this._get_y_axis_layout(y_range_min, y_range_max, variable_config),
          yaxis2: {
            type: 'linear',
            matches: 'y',
            overlaying: 'y',
            showline: false,
            showgrid: false,
            showticklabels: false,
            nticks: 0
          },
          yaxis3: {
            type: 'linear',
            matches: 'y',
            overlaying: 'y',

            showline: false,
            showgrid: false,
            showticklabels: false,
            nticks: 0
          },
        },
        // options
        this._get_plotly_options()
    );
    this._update_visibility = () => {
      Plotly.restyle(this.graphdiv, {
        visible: [
          !!this.options.show_historical_modeled ? true : 'legendonly',
          !!this.options.show_historical_modeled ? true : 'legendonly',
          // !!this.options.show_historical_modeled ? true : 'legendonly',
          !!this.options.show_projected_rcp45 ? true : 'legendonly',
          !!this.options.show_projected_rcp45 ? true : 'legendonly',
          !!this.options.show_projected_rcp85 ? true : 'legendonly',
          !!this.options.show_projected_rcp85 ? true : 'legendonly',
          !!this.options.show_historical_observed ? true : 'legendonly',
          !!this.options.show_projected_rcp45 ? true : 'legendonly',
          !!this.options.show_projected_rcp85 ? true : 'legendonly',
        ]
      })
    }
    this._when_chart = new Promise((resolve) => {
      this.graphdiv.on('plotly_afterplot', (gd) => {
        resolve(gd)
      })
    });

    this._when_chart.then(this._hide_spinner.bind(this));

  }


  async _update_annual_ak() {
    // get data for GFDL-CM3 and NCAR-CCSM4

    let hist_sdate_year = 1970;
    // let hist_sdate = hist_sdate_year + '-01-01';
    let hist_edate_year = 2005;
    // let hist_edate = hist_edate_year + '-12-31';
    let proj_edate_year = 2099;

    const variable_config = this.get_variable_config();
    const {variable, frequency, area_id} = this.options;
    const unit_conversion_fn = variable_config.unit_conversions[this.options.unitsystem];

    const [[gfdl_cm3_rcp85_years, gfdl_cm3_rcp85],
      [ncar_ccsm4_rcp85_years, ncar_ccsm4_rcp85]] = await Promise.all([
      this._fetch_acis_data('snap:GFDL-CM3:rcp85', hist_sdate_year, proj_edate_year, variable, frequency, area_id, unit_conversion_fn),
      this._fetch_acis_data('snap:NCAR-CCSM4:rcp85', hist_sdate_year, proj_edate_year, variable, frequency, area_id, unit_conversion_fn),
    ])
    if (!(isEqual(gfdl_cm3_rcp85_years, ncar_ccsm4_rcp85_years))
        || Number.parseInt(gfdl_cm3_rcp85_years[0]) !== hist_sdate_year
        || Number.parseInt(ncar_ccsm4_rcp85_years[0]) !== hist_sdate_year
        || Number.parseInt(gfdl_cm3_rcp85_years[gfdl_cm3_rcp85_years.length - 1]) !== proj_edate_year
        || Number.parseInt(ncar_ccsm4_rcp85_years[ncar_ccsm4_rcp85_years.length - 1]) !== proj_edate_year
    ) {
      throw new Error("Unexpected annual data!")
    }

    // split into hist mod vs proj mod
    let hist_mod_data = [];
    let proj_mod_data = [];
    const rolling_window = 10;

    for (let i = 0; i < hist_edate_year - hist_sdate_year + 1; i++) {
      //year,gfdl_cm3_rcp85,ncar_ccsm4_rcp85
      hist_mod_data.push([i + hist_sdate_year, ClimateByLocationWidget._rolling_window_average(gfdl_cm3_rcp85, i), ClimateByLocationWidget._rolling_window_average(ncar_ccsm4_rcp85, i)]);
    }

    for (let i = hist_edate_year - hist_sdate_year; i <= proj_edate_year - hist_sdate_year + 1; i++) {
      //year,gfdl_cm3_rcp85,ncar_ccsm4_rcp85
      proj_mod_data.push([i + hist_sdate_year, ClimateByLocationWidget._rolling_window_average(gfdl_cm3_rcp85, i), ClimateByLocationWidget._rolling_window_average(ncar_ccsm4_rcp85, i)]);
    }

    this.downloadable_dataurls.hist_mod = this._format_export_data(['year', 'gfdl_cm3_rcp85', 'ncar_ccsm4_rcp85', `*Note that the values shown have had a ${rolling_window}-year rolling window average applied.`], hist_mod_data);
    this.downloadable_dataurls.proj_mod = this._format_export_data(['year', 'gfdl_cm3_rcp85', 'ncar_ccsm4_rcp85', `*Note that the values shown have had a ${rolling_window}-year rolling window average applied.`], proj_mod_data);


    const chart_data = {
      'hist_year': [],
      'hist_min': [],
      'hist_max': [],
      'proj_year': [],
      'rcp85_min': [],
      'rcp85_max': []
    };
    const precision = 1;
    for (let i = 0; i < hist_mod_data.length; i++) {
      chart_data['hist_year'].push(hist_mod_data[i][0]);
      chart_data['hist_min'].push(round(Math.min(hist_mod_data[i][1], hist_mod_data[i][2]), precision));
      chart_data['hist_max'].push(round(Math.max(hist_mod_data[i][1], hist_mod_data[i][2]), precision));
    }

    // repeat 2005 data point to fill gap
    chart_data['proj_year'].push(hist_mod_data[hist_mod_data.length - 1][0]);
    chart_data['rcp85_min'].push(round(Math.min(hist_mod_data[hist_mod_data.length - 1][1], hist_mod_data[hist_mod_data.length - 1][2]), precision));
    chart_data['rcp85_max'].push(round(Math.max(hist_mod_data[hist_mod_data.length - 1][1], hist_mod_data[hist_mod_data.length - 1][2]), precision));

    for (let i = 0; i < proj_mod_data.length; i++) {
      chart_data['proj_year'].push(proj_mod_data[i][0]);
      chart_data['rcp85_min'].push(round(Math.min(proj_mod_data[i][1], proj_mod_data[i][2]), precision));
      chart_data['rcp85_max'].push(round(Math.max(proj_mod_data[i][1], proj_mod_data[i][2]), precision));
    }

    const [x_range_min, x_range_max, y_range_min, y_range_max] = this._update_axes_ranges(
        min([min(chart_data['hist_year']), min(chart_data['proj_year'])]),
        max([max(chart_data['hist_year']), max(chart_data['proj_year'])]),
        min([min(chart_data['hist_min']), min(chart_data['rcp45_min']), min(chart_data['rcp85_min'])]),
        max([max(chart_data['hist_max']), max(chart_data['rcp45_max']), max(chart_data['rcp85_max'])]),
    )

    Plotly.react(
        this.graphdiv,
        [
          {
            name: 'Modeled minimum (historical)',
            x: chart_data['hist_year'],
            y: chart_data['hist_min'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {color: ClimateByLocationWidget._rgba(this.options.colors.hist.outerBand, this.options.colors.opacity.ann_hist_minmax), width: 0, opacity: this.options.colors.opacity.ann_hist_minmax},
            legendgroup: 'hist',
            visible: !!this.options.show_historical_modeled ? true : 'legendonly',
          },
          {
            x: chart_data['hist_year'],
            y: chart_data['hist_max'],
            name: 'Modeled maximum (historical)',
            type: 'scatter',
            mode: 'lines',
            fill: 'tonexty',
            fillcolor: ClimateByLocationWidget._rgba(this.options.colors.hist.outerBand, 1),
            line: {color: ClimateByLocationWidget._rgba(this.options.colors.hist.outerBand, this.options.colors.opacity.ann_hist_minmax), width: 0, opacity: 1},
            legendgroup: 'hist',
            visible: !!this.options.show_historical_modeled ? true : 'legendonly',
          },
          {
            x: chart_data['proj_year'],
            y: chart_data['rcp85_min'],
            name: 'Modeled minimum (RCP 8.5)',
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            fillcolor: ClimateByLocationWidget._rgba(this.options.colors.rcp85.outerBand, 1),
            line: {color: ClimateByLocationWidget._rgba(this.options.colors.rcp85.outerBand, this.options.colors.opacity.ann_proj_minmax), width: 0, opacity: 1},
            legendgroup: 'rcp85',
            visible: this.options.show_projected_rcp85 ? true : 'legendonly',
          },
          {
            x: chart_data['proj_year'],
            y: chart_data['rcp85_max'],
            name: 'Modeled maximum (RCP 8.5)',
            fill: 'tonexty',
            type: 'scatter',
            mode: 'lines',
            fillcolor: ClimateByLocationWidget._rgba(this.options.colors.rcp85.outerBand, 1),
            line: {color: ClimateByLocationWidget._rgba(this.options.colors.rcp85.outerBand, this.options.colors.opacity.ann_proj_minmax), width: 0, opacity: 1},
            legendgroup: 'rcp85',
            visible: this.options.show_projected_rcp85 ? true : 'legendonly',
          },

        ],
        // layout
        {
          autosize: true,
          margin: {l: 50, t: 12, r: 12, b: 60},
          showlegend: this.options.show_legend,
          legend: {"orientation": "h"},
          xaxis: this._get_x_axis_layout(x_range_min, x_range_max),
          yaxis: this._get_y_axis_layout(y_range_min, y_range_max, variable_config)
        },
        // options
        this._get_plotly_options(),
    );
    this._update_visibility = () => {
      Plotly.restyle(this.graphdiv, {
        visible: [
          !!this.options.show_historical_modeled ? true : 'legendonly',
          !!this.options.show_historical_modeled ? true : 'legendonly',
          !!this.options.show_projected_rcp85 ? true : 'legendonly',
          !!this.options.show_projected_rcp85 ? true : 'legendonly',
        ]
      })
    }

    this._when_chart = new Promise((resolve) => {
      this.graphdiv.on('plotly_afterplot', (gd) => {
        resolve(gd)
      })
    });

    this._when_chart.then(this._hide_spinner.bind(this));

  }


  async _update_annual_island() {
    let data = await this._fetch_island_data(this.options.variable, this.options.area_id);

    let hist_mod_series = data.find((series) => series.scenario === 'historical')
    let rcp45_mod_series = data.find((series) => series.scenario === 'rcp45')
    let rcp85_mod_series = data.find((series) => series.scenario === 'rcp85')
    const variable_config = this.get_variable_config();
    const unit_conversion_fn = variable_config.unit_conversions[this.options.unitsystem];

    // reshape hist data to an array of [[year,mean,min,max], ...] (to match how update_annual_conus shapes it's data)
    const hist_sdate_year = Number.parseInt(hist_mod_series.sdate.substr(0, 4));

    let hist_mod_data = hist_mod_series.annual_data.all_mean.reduce((_data, v, i) => {
      _data.push([
        hist_sdate_year + i,
        unit_conversion_fn(v),
        unit_conversion_fn(hist_mod_series.annual_data.all_min[i]),
        unit_conversion_fn(hist_mod_series.annual_data.all_max[i])
      ])
      return _data;
    }, [])
    // reshape proj data to an array of [[year,rcp45mean,rcp45min,rcp45max,rcp85mean,rcp85min,rcp85max], ...] (to match how update_annual_conus shapes it's data)
    const proj_sdate_year = Number.parseInt(rcp45_mod_series.sdate.substr(0, 4));
    let proj_mod_data = rcp45_mod_series.annual_data.all_mean.reduce((_data, v, i) => {
      _data.push([
        proj_sdate_year + i,
        unit_conversion_fn(v),
        unit_conversion_fn(rcp45_mod_series.annual_data.all_min[i]),
        unit_conversion_fn(rcp45_mod_series.annual_data.all_max[i]),
        unit_conversion_fn(rcp85_mod_series.annual_data.all_mean[i]),
        unit_conversion_fn(rcp85_mod_series.annual_data.all_min[i]),
        unit_conversion_fn(rcp85_mod_series.annual_data.all_max[i])
      ])
      return _data;
    }, [])


    // format download data.
    this.downloadable_dataurls.hist_mod = this._format_export_data(['year', 'mean', 'min', 'max'], hist_mod_data);
    this.downloadable_dataurls.proj_mod = this._format_export_data(['year', 'rcp45_mean', 'rcp45_min', 'rcp45_max', 'rcp85_mean', 'rcp85_min', 'rcp85_max'], proj_mod_data);

    const chart_data = {
      'hist_year': [],
      'hist_mean': [],
      'hist_min': [],
      'hist_max': [],
      'hist_max_diff': [],
      'proj_year': [],
      'rcp45_mean': [],
      'rcp45_min': [],
      'rcp45_max': [],
      'rcp85_mean': [],
      'rcp85_min': [],
      'rcp85_max': []
    };
    const precision = 1;
    for (let i = 0; i < hist_mod_data.length; i++) {
      chart_data['hist_year'].push(hist_mod_data[i][0]);
      chart_data['hist_mean'].push(hist_mod_data[i][1]);
      chart_data['hist_min'].push(hist_mod_data[i][2]);
      chart_data['hist_max'].push(hist_mod_data[i][3]);
    }
    // repeat 2005 data point to fill gap
    chart_data['proj_year'].push(hist_mod_data[hist_mod_data.length - 1][0]);
    chart_data['rcp45_mean'].push(round(hist_mod_data[hist_mod_data.length - 1][1], precision));
    chart_data['rcp45_min'].push(round(hist_mod_data[hist_mod_data.length - 1][2], precision));
    chart_data['rcp45_max'].push(round(hist_mod_data[hist_mod_data.length - 1][3], precision));
    chart_data['rcp85_mean'].push(round(hist_mod_data[hist_mod_data.length - 1][1], precision));
    chart_data['rcp85_min'].push(round(hist_mod_data[hist_mod_data.length - 1][2], precision));
    chart_data['rcp85_max'].push(round(hist_mod_data[hist_mod_data.length - 1][3], precision));

    for (let i = 0; i < proj_mod_data.length; i++) {
      chart_data['proj_year'].push(proj_mod_data[i][0]);
      chart_data['rcp45_mean'].push(round(proj_mod_data[i][1], precision));
      chart_data['rcp45_min'].push(round(proj_mod_data[i][2], precision));
      chart_data['rcp45_max'].push(round(proj_mod_data[i][3], precision));
      chart_data['rcp85_mean'].push(round(proj_mod_data[i][4], precision));
      chart_data['rcp85_min'].push(round(proj_mod_data[i][5], precision));
      chart_data['rcp85_max'].push(round(proj_mod_data[i][6], precision));
    }


    const [x_range_min, x_range_max, y_range_min, y_range_max] = this._update_axes_ranges(
        min([min(chart_data['hist_year']), min(chart_data['proj_year'])]),
        max([max(chart_data['hist_year']), max(chart_data['proj_year'])]),
        min([min(chart_data['hist_min']), min(chart_data['rcp45_min']), min(chart_data['rcp85_min'])]),
        max([max(chart_data['hist_max']), max(chart_data['rcp45_max']), max(chart_data['rcp85_max'])]),
    );


    Plotly.react(
        this.graphdiv,
        [
          {
            name: 'Modeled minimum (historical)',
            x: chart_data['hist_year'],
            y: chart_data['hist_min'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {color: ClimateByLocationWidget._rgba(this.options.colors.hist.outerBand, this.options.colors.opacity.ann_hist_minmax), width: 0, opacity: this.options.colors.opacity.ann_hist_minmax},
            legendgroup: 'hist',
            visible: !!this.options.show_historical_modeled ? true : 'legendonly',
          },
          {
            x: chart_data['hist_year'],
            // y: chart_data['hist_max_diff'],
            y: chart_data['hist_max'],
            // text: chart_data['hist_max'],
            // hoverinfo: 'text',
            name: 'Modeled maximum (historical)',
            type: 'scatter',
            mode: 'lines',
            fill: 'tonexty',
            fillcolor: ClimateByLocationWidget._rgba(this.options.colors.hist.outerBand, this.options.colors.opacity.ann_hist_minmax),
            line: {color: ClimateByLocationWidget._rgba(this.options.colors.hist.outerBand, this.options.colors.opacity.ann_hist_minmax), width: 0, opacity: this.options.colors.opacity.ann_hist_minmax},
            legendgroup: 'hist',
            visible: !!this.options.show_historical_modeled ? true : 'legendonly',
          },
          // {
          //   x: chart_data['hist_year'],
          //   y: chart_data['hist_mean'],
          //   type: 'scatter',
          //   mode: 'lines',
          //   name: 'Historical Mean',
          //   line: {color: '#000000'},
          //   legendgroup: 'hist',
          //   visible: !!this.options.show_historical_modeled ? true : 'legendonly',
          // },
          {
            x: chart_data['proj_year'],
            y: chart_data['rcp45_min'],
            name: 'Modeled minimum (RCP 4.5 projection)',
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            fillcolor: ClimateByLocationWidget._rgba(this.options.colors.rcp45.outerBand, this.options.colors.opacity.ann_proj_minmax),
            line: {color: ClimateByLocationWidget._rgba(this.options.colors.rcp45.outerBand, this.options.colors.opacity.ann_proj_minmax), width: 0, opacity: this.options.colors.opacity.ann_proj_minmax},
            legendgroup: 'rcp45',
            visible: this.options.show_projected_rcp45 ? true : 'legendonly',
          },
          {
            x: chart_data['proj_year'],
            y: chart_data['rcp45_max'],
            name: 'Modeled maximum (RCP 4.5 projection)',
            fill: 'tonexty',
            type: 'scatter',
            mode: 'lines',
            fillcolor: ClimateByLocationWidget._rgba(this.options.colors.rcp45.outerBand, this.options.colors.opacity.ann_proj_minmax),
            line: {color: ClimateByLocationWidget._rgba(this.options.colors.rcp45.outerBand, this.options.colors.opacity.ann_proj_minmax), width: 0, opacity: this.options.colors.opacity.ann_proj_minmax},
            legendgroup: 'rcp45',
            visible: this.options.show_projected_rcp45 ? true : 'legendonly',
          },
          {
            x: chart_data['proj_year'],
            y: chart_data['rcp85_min'],
            name: 'Modeled minimum (RCP 8.5 projection)',
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            fillcolor: ClimateByLocationWidget._rgba(this.options.colors.rcp85.outerBand, this.options.colors.opacity.ann_proj_minmax),
            line: {color: ClimateByLocationWidget._rgba(this.options.colors.rcp85.outerBand, this.options.colors.opacity.ann_proj_minmax), width: 0, opacity: this.options.colors.opacity.ann_proj_minmax},
            legendgroup: 'rcp85',
            visible: this.options.show_projected_rcp85 ? true : 'legendonly',
          },
          {
            x: chart_data['proj_year'],
            y: chart_data['rcp85_max'],
            name: 'Modeled maximum (RCP 8.5 projection)',
            fill: 'tonexty',
            type: 'scatter',
            mode: 'lines',
            fillcolor: ClimateByLocationWidget._rgba(this.options.colors.rcp85.outerBand, this.options.colors.opacity.ann_proj_minmax),
            line: {color: ClimateByLocationWidget._rgba(this.options.colors.rcp85.outerBand, this.options.colors.opacity.ann_proj_minmax), width: 0, opacity: this.options.colors.opacity.ann_proj_minmax},

            legendgroup: 'rcp85',
            visible: this.options.show_projected_rcp85 ? true : 'legendonly',
          },
          {
            x: chart_data['proj_year'],
            y: chart_data['rcp45_mean'],
            type: 'scatter',
            mode: 'lines',
            name: 'Modeled mean (RCP 4.5 projection)',
            line: {color: ClimateByLocationWidget._rgba(this.options.colors.rcp45.line, this.options.colors.opacity.proj_line)},
            visible: this.options.show_projected_rcp45 ? true : 'legendonly',
            legendgroup: 'rcp45',
          },
          {
            x: chart_data['proj_year'],
            y: chart_data['rcp85_mean'],
            type: 'scatter',
            mode: 'lines',
            name: 'Modeled mean (RCP 8.5 projection)',
            visible: this.options.show_projected_rcp85 ? true : 'legendonly',
            line: {color: ClimateByLocationWidget._rgba(this.options.colors.rcp85.line, this.options.colors.opacity.proj_line)},
            legendgroup: 'rcp85',
          }
        ],
        // layout
        {
          autosize: true,
          margin: {l: 50, t: 12, r: 12, b: 60},
          showlegend: this.options.show_legend,
          legend: {"orientation": "h"},
          xaxis: this._get_x_axis_layout(x_range_min, x_range_max),
          yaxis: this._get_y_axis_layout(y_range_min, y_range_max, variable_config)
        },
        // options
        this._get_plotly_options(),
    );
    this._update_visibility = () => {
      Plotly.restyle(this.graphdiv, {
        visible: [
          !!this.options.show_historical_modeled ? true : 'legendonly',
          !!this.options.show_historical_modeled ? true : 'legendonly',
          // !!this.options.show_historical_modeled ? true : 'legendonly',
          !!this.options.show_projected_rcp45 ? true : 'legendonly',
          !!this.options.show_projected_rcp45 ? true : 'legendonly',
          !!this.options.show_projected_rcp85 ? true : 'legendonly',
          !!this.options.show_projected_rcp85 ? true : 'legendonly',
          !!this.options.show_projected_rcp45 ? true : 'legendonly',
          !!this.options.show_projected_rcp85 ? true : 'legendonly']
      })
    }
    this._when_chart = new Promise((resolve) => {
      this.graphdiv.on('plotly_afterplot', (gd) => {
        resolve(gd)
      })
    });

    this._when_chart.then(this._hide_spinner.bind(this));

  }

  async _update_monthly_conus() {
    const [hist_obs_month_values, proj_mod_month_values] = await Promise.all([
      this._get_historical_observed_livneh_data(),
      this._get_projected_loca_model_data()
    ])

    const variable_config = this.get_variable_config();
    const hist_obs_sdate_year = hist_obs_month_values['01'][0][0];
    const hist_obs_edate_year = hist_obs_month_values['01'][hist_obs_month_values['01'].length - 1][0];
    let hist_obs_data = [];
    for (const month of ClimateByLocationWidget._months) {
      hist_obs_data.push([month, mean(hist_obs_month_values[month].map(a => a[1]))]);
    }

    // reshape from {month: [year, rcp45_mean, rcp45_min, rcp45_max, rcp85_mean, rcp85_min, rcp85_max]} to ['month', '2025_rcp45_mean', '2025_rcp45_min', '2025_rcp45_max', '2025_rcp85_mean', '2025_rcp85_min', '2025_rcp85_max', '2050_rcp45_mean', '2050_rcp45_min', '2050_rcp45_max', '2050_rcp85_mean', '2050_rcp85_min', '2050_rcp85_max', '2075_rcp45_mean', '2075_rcp45_min', '2075_rcp45_max', '2075_rcp85_mean', '2075_rcp85_min', '2075_rcp85_max']
    const proj_sdate_year = proj_mod_month_values['01'][0][0];
    // const proj_edate_year = proj_mod_month_values['01'][proj_mod_month_values['01'].length - 1][0];
    let proj_mod_data = [];
    for (const month of ClimateByLocationWidget._months) {
      let _month_data = [];
      for (const year_range of ClimateByLocationWidget._monthly_timeperiods) {
        let year_range_min_idx = year_range - 15 - proj_sdate_year;
        for (const scenario_column_offset of [0, 3]) { // rcp45, rcp85
          for (const value_i of [0, 1, 2]) { //mean, min, max
            _month_data.push(mean(proj_mod_month_values[month].slice(year_range_min_idx, year_range_min_idx + 30).map(a => a[1 + scenario_column_offset + value_i])))
          }
        }
      }
      proj_mod_data.push([month, ..._month_data]);
    }

    this.downloadable_dataurls.hist_obs = this._format_export_data(['month', 'mean', `* Note that the mean is based on monthly data for years  ${hist_obs_sdate_year}-${hist_obs_edate_year}`], hist_obs_data);

    this.downloadable_dataurls.proj_mod = this._format_export_data(['month', '2025_rcp45_mean', '2025_rcp45_min', '2025_rcp45_max', '2025_rcp85_mean', '2025_rcp85_min', '2025_rcp85_max', '2050_rcp45_mean', '2050_rcp45_min', '2050_rcp45_max', '2050_rcp85_mean', '2050_rcp85_min', '2050_rcp85_max', '2075_rcp45_mean', '2075_rcp45_min', '2075_rcp45_max', '2075_rcp85_mean', '2075_rcp85_min', '2075_rcp85_max'], proj_mod_data);


    const chart_data = {
      'month': [],
      'month_label': [],
      'hist_obs': [],
      'rcp45_mean': [],
      'rcp45_min': [],
      'rcp45_max': [],
      'rcp85_mean': [],
      'rcp85_min': [],
      'rcp85_max': []
    };
    const precision = 1;
    const monthly_timeperiod = Number.parseInt(this.options.monthly_timeperiod);
    const col_offset = 1 + (ClimateByLocationWidget._monthly_timeperiods.indexOf(monthly_timeperiod) * 6)
    // for some reason unknown to me, the following month cycle is shown.
    const month_indexes = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

    for (const m of month_indexes) {
      const _m = m % 12;
      chart_data['month'].push(m);
      chart_data['month_label'].push(ClimateByLocationWidget._months_labels[_m]);
      chart_data['hist_obs'].push(round(hist_obs_data[_m][1], precision));
      chart_data['rcp45_mean'].push(round(proj_mod_data[_m][col_offset], precision));
      chart_data['rcp45_min'].push(round(proj_mod_data[_m][1 + col_offset], precision));
      chart_data['rcp45_max'].push(round(proj_mod_data[_m][2 + col_offset], precision));
      chart_data['rcp85_mean'].push(round(proj_mod_data[_m][3 + col_offset], precision));
      chart_data['rcp85_min'].push(round(proj_mod_data[_m][4 + col_offset], precision));
      chart_data['rcp85_max'].push(round(proj_mod_data[_m][5 + col_offset], precision));
    }

    const [x_range_min, x_range_max, y_range_min, y_range_max] = this._update_axes_ranges(
        month_indexes,
        month_indexes[month_indexes.length - 1],
        min([min(chart_data['hist_obs']), min(chart_data['rcp45_min']), min(chart_data['rcp85_min'])]),
        max([max(chart_data['hist_obs']), max(chart_data['rcp45_max']), max(chart_data['rcp85_max'])]),
    );
    Plotly.react(
        this.graphdiv,
        [
          {
            x: chart_data['month'],
            y: chart_data['rcp45_min'],
            name: 'Modeled minimum (RCP 4.5 projection)',
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            fillcolor: ClimateByLocationWidget._rgba(this.options.colors.rcp45.outerBand, this.options.colors.opacity.ann_proj_minmax),
            line: {color: ClimateByLocationWidget._rgba(this.options.colors.rcp45.outerBand, this.options.colors.opacity.ann_proj_minmax), width: 0, opacity: this.options.colors.opacity.ann_proj_minmax},
            legendgroup: 'rcp45',
            visible: this.options.show_projected_rcp45 ? true : 'legendonly',
          },
          {
            x: chart_data['month'],
            y: chart_data['rcp45_max'],
            name: 'Modeled maximum (RCP 4.5 projection)',
            fill: 'tonexty',
            type: 'scatter',
            mode: 'lines',
            fillcolor: ClimateByLocationWidget._rgba(this.options.colors.rcp45.outerBand, this.options.colors.opacity.ann_proj_minmax),
            line: {color: ClimateByLocationWidget._rgba(this.options.colors.rcp45.outerBand, this.options.colors.opacity.ann_proj_minmax), width: 0, opacity: this.options.colors.opacity.ann_proj_minmax},
            legendgroup: 'rcp45',
            visible: this.options.show_projected_rcp45 ? true : 'legendonly',
          },
          {
            x: chart_data['month'],
            y: chart_data['rcp85_min'],
            name: 'Modeled minimum (RCP 8.5 projection)',
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            fillcolor: ClimateByLocationWidget._rgba(this.options.colors.rcp85.outerBand, this.options.colors.opacity.ann_proj_minmax),
            line: {color: ClimateByLocationWidget._rgba(this.options.colors.rcp85.outerBand, this.options.colors.opacity.ann_proj_minmax), width: 0, opacity: this.options.colors.opacity.ann_proj_minmax},
            legendgroup: 'rcp85',
            visible: this.options.show_projected_rcp85 ? true : 'legendonly',
          },
          {
            x: chart_data['month'],
            y: chart_data['rcp85_max'],
            name: 'Modeled maximum (RCP 8.5 projection)',
            fill: 'tonexty',
            type: 'scatter',
            mode: 'lines',
            fillcolor: ClimateByLocationWidget._rgba(this.options.colors.rcp85.outerBand, this.options.colors.opacity.ann_proj_minmax),
            line: {color: ClimateByLocationWidget._rgba(this.options.colors.rcp85.outerBand, this.options.colors.opacity.ann_proj_minmax), width: 0, opacity: this.options.colors.opacity.ann_proj_minmax},
            legendgroup: 'rcp85',
            visible: this.options.show_projected_rcp85 ? true : 'legendonly',
          },
          {
            x: chart_data['month'],
            y: chart_data['hist_obs'],
            type: 'scatter',
            mode: 'lines',
            name: `Observed History (${hist_obs_sdate_year}-${hist_obs_edate_year} monthly mean)`,
            line: {color: this.options.colors.hist.line},
            legendgroup: 'histobs',
            visible: !!this.options.show_historical_observed ? true : 'legendonly',
          },
          {
            x: chart_data['month'],
            y: chart_data['rcp45_mean'],
            type: 'scatter',
            mode: 'lines',
            name: 'Modeled mean (RCP 4.5 projection)',
            line: {color: ClimateByLocationWidget._rgba(this.options.colors.rcp45.line, this.options.colors.opacity.proj_line)},
            visible: this.options.show_projected_rcp45 ? true : 'legendonly',
            legendgroup: 'rcp45',
          },
          {
            x: chart_data['month'],
            y: chart_data['rcp85_mean'],
            type: 'scatter',
            mode: 'lines',
            name: 'Modeled mean (RCP 8.5 projection)',
            visible: this.options.show_projected_rcp85 ? true : 'legendonly',
            line: {color: ClimateByLocationWidget._rgba(this.options.colors.rcp85.line, this.options.colors.opacity.proj_line)},
            legendgroup: 'rcp85',
          }
        ],
        // layout
        {
          autosize: true,
          margin: {l: 50, t: 12, r: 12, b: 60},
          showlegend: this.options.show_legend,
          legend: {"orientation": "h"},
          xaxis: Object.assign(this._get_x_axis_layout(x_range_min, x_range_max), {tickmode: 'array', tickvals: month_indexes, ticktext: chart_data['month_label']}),
          yaxis: this._get_y_axis_layout(y_range_min, y_range_max, variable_config)
        },
        // options
        this._get_plotly_options(),
    );
    this._update_visibility = () => {
      Plotly.restyle(this.graphdiv, {
        visible: [
          !!this.options.show_historical_modeled ? true : 'legendonly',
          !!this.options.show_historical_modeled ? true : 'legendonly',
          !!this.options.show_projected_rcp45 ? true : 'legendonly',
          !!this.options.show_projected_rcp45 ? true : 'legendonly',
          !!this.options.show_projected_rcp85 ? true : 'legendonly',
          !!this.options.show_projected_rcp85 ? true : 'legendonly',
          !!this.options.show_projected_rcp45 ? true : 'legendonly',
          !!this.options.show_projected_rcp85 ? true : 'legendonly']
      })
    }
    this._when_chart = new Promise((resolve) => {
      this.graphdiv.on('plotly_afterplot', (gd) => {
        resolve(gd)
      })
    });

    this._when_chart.then(this._hide_spinner.bind(this));

  }

  async _update_monthly_island() {
    let data = await this._fetch_island_data(this.options.variable, this.options.area_id);

    let hist_mod_series = data.find((series) => series.scenario === 'historical')
    let rcp45_mod_series = data.find((series) => series.scenario === 'rcp45')
    let rcp85_mod_series = data.find((series) => series.scenario === 'rcp85')

    const variable_config = this.get_variable_config();
    const unit_conversion_fn = variable_config.unit_conversions[this.options.unitsystem];


    let hist_mod_data = [];
    for (const month of ClimateByLocationWidget._months) {
      //year,mean,min,max
      hist_mod_data.push([month, unit_conversion_fn(mean(hist_mod_series.monthly_data.all_mean[month])), unit_conversion_fn(mean(hist_mod_series.monthly_data.all_min[month])), unit_conversion_fn(mean(hist_mod_series.monthly_data.all_max[month]))])
    }

    const proj_sdate_year = Number.parseInt(rcp85_mod_series.sdate.substr(0, 4));
    let proj_mod_data = [];
    for (const month of ClimateByLocationWidget._months) {
      let _month_data = [];
      for (const year_range of ClimateByLocationWidget._monthly_timeperiods) {
        let year_range_min_idx = year_range - 15 - proj_sdate_year;
        for (const scenario_monthly_data of [rcp45_mod_series.monthly_data, rcp85_mod_series.monthly_data]) {
          for (const value_name of ['mean', 'min', 'max']) {
            _month_data.push(unit_conversion_fn(mean(scenario_monthly_data['all_' + value_name][month].slice(year_range_min_idx, year_range_min_idx + 30))))
          }
        }
      }
      proj_mod_data.push([month, ..._month_data]);
    }

    this.downloadable_dataurls.hist_mod = this._format_export_data(['year', 'mean', 'min', 'max'], hist_mod_data);

    this.downloadable_dataurls.proj_mod = this._format_export_data(['month', '2025_rcp45_mean', '2025_rcp45_min', '2025_rcp45_max', '2025_rcp85_mean', '2025_rcp85_min', '2025_rcp85_max', '2050_rcp45_mean', '2050_rcp45_min', '2050_rcp45_max', '2050_rcp85_mean', '2050_rcp85_min', '2050_rcp85_max', '2075_rcp45_mean', '2075_rcp45_min', '2075_rcp45_max', '2075_rcp85_mean', '2075_rcp85_min', '2075_rcp85_max'], proj_mod_data);

    const chart_data = {
      'month': [],
      'month_label': [],
      'hist_min': [],
      'hist_max': [],
      'rcp45_mean': [],
      'rcp45_min': [],
      'rcp45_max': [],
      'rcp85_mean': [],
      'rcp85_min': [],
      'rcp85_max': []
    };

    const precision = 1;
    const monthly_timeperiod = Number.parseInt(this.options.monthly_timeperiod);
    const col_offset = 1 + (ClimateByLocationWidget._monthly_timeperiods.indexOf(monthly_timeperiod) * 6)
    // for some reason unknown to me, the following month cycle is shown.
    const month_indexes = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

    for (const m of month_indexes) {
      const _m = m % 12;
      chart_data['month'].push(m);
      chart_data['month_label'].push(ClimateByLocationWidget._months_labels[_m]);
      chart_data['hist_min'].push(round(hist_mod_data[_m][1], precision));
      chart_data['hist_max'].push(round(hist_mod_data[_m][2], precision));
      chart_data['rcp45_mean'].push(round(proj_mod_data[_m][col_offset], precision));
      chart_data['rcp45_min'].push(round(proj_mod_data[_m][1 + col_offset], precision));
      chart_data['rcp45_max'].push(round(proj_mod_data[_m][2 + col_offset], precision));
      chart_data['rcp85_mean'].push(round(proj_mod_data[_m][3 + col_offset], precision));
      chart_data['rcp85_min'].push(round(proj_mod_data[_m][4 + col_offset], precision));
      chart_data['rcp85_max'].push(round(proj_mod_data[_m][5 + col_offset], precision));
    }

    const [x_range_min, x_range_max, y_range_min, y_range_max] = this._update_axes_ranges(
        month_indexes,
        month_indexes[month_indexes.length - 1],
        min([min(chart_data['hist_min']), min(chart_data['rcp45_min']), min(chart_data['rcp85_min'])]),
        max([max(chart_data['hist_max']), max(chart_data['rcp45_max']), max(chart_data['rcp85_max'])]),
    );


    Plotly.react(
        this.graphdiv,
        [
          {
            name: 'Modeled minimum (historical)',
            x: chart_data['month'],
            y: chart_data['hist_min'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {color: ClimateByLocationWidget._rgba(this.options.colors.hist.outerBand, this.options.colors.opacity.ann_hist_minmax), width: 0, opacity: this.options.colors.opacity.ann_hist_minmax},
            legendgroup: 'hist',
            visible: !!this.options.show_historical_modeled ? true : 'legendonly',
          },
          {
            x: chart_data['month'],
            // y: chart_data['hist_max_diff'],
            y: chart_data['hist_max'],
            // text: chart_data['hist_max'],
            // hoverinfo: 'text',
            name: 'Modeled maximum (historical)',
            type: 'scatter',
            mode: 'lines',
            fill: 'tonexty',
            fillcolor: ClimateByLocationWidget._rgba(this.options.colors.hist.outerBand, this.options.colors.opacity.ann_hist_minmax),
            line: {color: ClimateByLocationWidget._rgba(this.options.colors.hist.outerBand, this.options.colors.opacity.ann_hist_minmax), width: 0, opacity: this.options.colors.opacity.ann_hist_minmax},
            legendgroup: 'hist',
            visible: !!this.options.show_historical_modeled ? true : 'legendonly',
          },
          // {
          //   x: chart_data['hist_year'],
          //   y: chart_data['hist_mean'],
          //   type: 'scatter',
          //   mode: 'lines',
          //   name: 'Historical Mean',
          //   line: {color: '#000000'},
          //   legendgroup: 'hist',
          //   visible: !!this.options.show_historical_modeled ? true : 'legendonly',
          // },
          {
            x: chart_data['month'],
            y: chart_data['rcp45_min'],
            name: 'Modeled minimum (RCP 4.5 projection)',
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            fillcolor: ClimateByLocationWidget._rgba(this.options.colors.rcp45.outerBand, this.options.colors.opacity.ann_proj_minmax),
            line: {color: ClimateByLocationWidget._rgba(this.options.colors.rcp45.outerBand, this.options.colors.opacity.ann_proj_minmax), width: 0, opacity: this.options.colors.opacity.ann_proj_minmax},
            legendgroup: 'rcp45',
            visible: this.options.show_projected_rcp45 ? true : 'legendonly',
          },
          {
            x: chart_data['month'],
            y: chart_data['rcp45_max'],
            name: 'Modeled maximum (RCP 4.5 projection)',
            fill: 'tonexty',
            type: 'scatter',
            mode: 'lines',
            fillcolor: ClimateByLocationWidget._rgba(this.options.colors.rcp45.outerBand, this.options.colors.opacity.ann_proj_minmax),
            line: {color: ClimateByLocationWidget._rgba(this.options.colors.rcp45.outerBand, this.options.colors.opacity.ann_proj_minmax), width: 0, opacity: this.options.colors.opacity.ann_proj_minmax},
            legendgroup: 'rcp45',
            visible: this.options.show_projected_rcp45 ? true : 'legendonly',
          },
          {
            x: chart_data['month'],
            y: chart_data['rcp85_min'],
            name: 'Modeled minimum (RCP 8.5 projection)',
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            fillcolor: ClimateByLocationWidget._rgba(this.options.colors.rcp85.outerBand, this.options.colors.opacity.ann_proj_minmax),
            line: {color: ClimateByLocationWidget._rgba(this.options.colors.rcp85.outerBand, this.options.colors.opacity.ann_proj_minmax), width: 0, opacity: this.options.colors.opacity.ann_proj_minmax},
            legendgroup: 'rcp85',
            visible: this.options.show_projected_rcp85 ? true : 'legendonly',
          },
          {
            x: chart_data['month'],
            y: chart_data['rcp85_max'],
            name: 'Modeled maximum (RCP 8.5 projection)',
            fill: 'tonexty',
            type: 'scatter',
            mode: 'lines',
            fillcolor: ClimateByLocationWidget._rgba(this.options.colors.rcp85.outerBand, this.options.colors.opacity.ann_proj_minmax),
            line: {color: ClimateByLocationWidget._rgba(this.options.colors.rcp85.outerBand, this.options.colors.opacity.ann_proj_minmax), width: 0, opacity: this.options.colors.opacity.ann_proj_minmax},

            legendgroup: 'rcp85',
            visible: this.options.show_projected_rcp85 ? true : 'legendonly',
          },
          {
            x: chart_data['month'],
            y: chart_data['rcp45_mean'],
            type: 'scatter',
            mode: 'lines',
            name: 'Modeled mean (RCP 4.5 projection)',
            line: {color: ClimateByLocationWidget._rgba(this.options.colors.rcp45.line, this.options.colors.opacity.proj_line)},
            visible: this.options.show_projected_rcp45 ? true : 'legendonly',
            legendgroup: 'rcp45',
          },
          {
            x: chart_data['month'],
            y: chart_data['rcp85_mean'],
            type: 'scatter',
            mode: 'lines',
            name: 'Modeled mean (RCP 8.5 projection)',
            visible: this.options.show_projected_rcp85 ? true : 'legendonly',
            line: {color: ClimateByLocationWidget._rgba(this.options.colors.rcp85.line, this.options.colors.opacity.proj_line)},
            legendgroup: 'rcp85',
          }
        ],
        // layout
        {
          autosize: true,
          margin: {l: 50, t: 12, r: 12, b: 60},
          showlegend: this.options.show_legend,
          legend: {"orientation": "h"},
          xaxis: Object.assign(this._get_x_axis_layout(x_range_min, x_range_max), {tickmode: 'array', tickvals: month_indexes, ticktext: chart_data['month_label']}),
          yaxis: this._get_y_axis_layout(y_range_min, y_range_max, variable_config)
        },
        // options
        this._get_plotly_options(),
    );
    this._update_visibility = () => {
      Plotly.restyle(this.graphdiv, {
        visible: [
          !!this.options.show_historical_modeled ? true : 'legendonly',
          !!this.options.show_historical_modeled ? true : 'legendonly',
          !!this.options.show_projected_rcp45 ? true : 'legendonly',
          !!this.options.show_projected_rcp45 ? true : 'legendonly',
          !!this.options.show_projected_rcp85 ? true : 'legendonly',
          !!this.options.show_projected_rcp85 ? true : 'legendonly',
          !!this.options.show_projected_rcp45 ? true : 'legendonly',
          !!this.options.show_projected_rcp85 ? true : 'legendonly']
      })
    }
    this._when_chart = new Promise((resolve) => {
      this.graphdiv.on('plotly_afterplot', (gd) => {
        resolve(gd)
      })
    });

    this._when_chart.then(this._hide_spinner.bind(this));

  }

  async _get_historical_observed_livneh_data() {
    const freq = (this.options.frequency === 'annual') ? 'annual' : 'monthly';
    const variable_config = this.get_variable_config();
    const unit_conversion_fn = variable_config.unit_conversions[this.options.unitsystem];
    const area = this.get_area();
    const elems = [Object.assign(
        variable_config['acis_elements'][freq],
        {'area_reduce': area.area_type + '_mean'}
    )];
    const response = await (await fetch(this.options.data_api_endpoint,
        {
          method: "POST",
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            "sdate": "1950-01-01",
            "edate": "2013-12-31",
            "grid": 'livneh',
            "elems": elems,
            [area.area_type]: area.area_id
          })
        })).json()
    if (!response) {
      throw new Error(`Failed to retrieve ${freq} livneh data for ${this.options.variable} and area ${area.area_id}`)
    }

    // transform data
    if (this.options.frequency === 'annual') {
      let values = [];
      for (const [key, value] of response.data) {
        if (undefined !== value[this.options.area_id] && String(value[this.options.area_id]) !== '-999' && String(value[this.options.area_id]) !== '') {
          values.push([key, unit_conversion_fn(value[this.options.area_id])]);
        }
      }

      return values
    }

    // monthly

    // build output of [month, [values...]].
    let month_values = Object.fromEntries(ClimateByLocationWidget._months.map(m => [m, []]));
    for (const [key, value] of response.data) {
      if (undefined !== value[area.area_id]) {
        let v = parseFloat(value[area.area_id]);
        if (v === -999 || !Number.isFinite(v)) {
          v = 0;
        }
        month_values[key.slice(-2)].push([Number.parseInt(key.slice(0, 4)), unit_conversion_fn(v)]);
      }
    }

    return month_values
  }


  async _get_historical_annual_loca_model_data() {
    const sdate_year = 1950;
    const edate_year = 2006;

    const sdate = sdate_year + '-01-01';
    const edate = edate_year + '-12-31';
    const unit_conversion_fn = this.get_variable_config().unit_conversions[this.options.unitsystem]
    const {variable, frequency, area_id} = this.options;

    const data = await Promise.all([
      this._fetch_acis_data('loca:wMean:rcp85', sdate, edate, variable, frequency, area_id, unit_conversion_fn),
      this._fetch_acis_data('loca:allMin:rcp85', sdate, edate, variable, frequency, area_id, unit_conversion_fn),
      this._fetch_acis_data('loca:allMax:rcp85', sdate, edate, variable, frequency, area_id, unit_conversion_fn)
    ]);
    let values = [];
    for (let i = 0; i < edate_year - sdate_year; i++) {
      values.push([i + sdate_year, data[0][1][i], data[1][1][i], data[2][1][i]]);
    }

    return values
  }

  async _get_projected_loca_model_data() {
    const sdate_year = this.options.frequency === 'monthly' ? 2010 : 2006;
    const sdate = sdate_year + '-01-01';
    const edate_year = 2099;
    const edate = edate_year + '-12-31';
    const unit_conversion_fn = this.get_variable_config().unit_conversions[this.options.unitsystem]
    const {variable, frequency, area_id} = this.options;


    const data = await Promise.all([
      this._fetch_acis_data('loca:wMean:rcp45', sdate, edate, variable, frequency, area_id, unit_conversion_fn),
      this._fetch_acis_data('loca:allMin:rcp45', sdate, edate, variable, frequency, area_id, unit_conversion_fn),
      this._fetch_acis_data('loca:allMax:rcp45', sdate, edate, variable, frequency, area_id, unit_conversion_fn),
      this._fetch_acis_data('loca:wMean:rcp85', sdate, edate, variable, frequency, area_id, unit_conversion_fn),
      this._fetch_acis_data('loca:allMin:rcp85', sdate, edate, variable, frequency, area_id, unit_conversion_fn),
      this._fetch_acis_data('loca:allMax:rcp85', sdate, edate, variable, frequency, area_id, unit_conversion_fn),
    ]);


    if (this.options.frequency === 'annual') {
      for (const [keys, _] of data) {
        if (keys.length !== (edate_year - sdate_year) + 1) {
          throw new Error('Missing years in projected loca data!')
        }
      }

      let values = [];

      for (let i = 0; i < edate_year - sdate_year; i++) {
        values.push([i + sdate_year, data[0][1][i], data[1][1][i], data[2][1][i], data[3][1][i], data[4][1][i], data[5][1][i]]);
      }

      return values;
    }

    // monthly

    // build output of {month: [year, rcp45_mean, rcp45_min, rcp45_max, rcp85_mean, rcp85_min, rcp85_max]}.
    let monthly_values = Object.fromEntries(ClimateByLocationWidget._months.map(m => [m, []]));
    const _get_val = (array, idx) => {
      if (undefined !== array[idx]) {
        let v = parseFloat(array[idx]);
        if (v === -999) {
          v = Number.NaN
        }
        return v
      }
      return Number.NaN
    }
    for (let i = 0; i < data[0][0].length; i++) {
      monthly_values[data[0][0][i].slice(-2)].push([Number.parseInt(data[0][0][i].slice(0, 4)), _get_val(data[0][1], i), _get_val(data[1][1], i), _get_val(data[2][1], i), _get_val(data[3][1], i), _get_val(data[4][1], i), _get_val(data[5][1], i)]);
    }
    return monthly_values
  }

  /**
   * Retrieves data from ACIS.
   * @param grid
   * @param sdate
   * @param edate
   * @param variable
   * @param frequency
   * @param area_id
   * @param unit_conversion_fn
   * @return {Promise<[][]>}
   * @private
   */
  async _fetch_acis_data(grid, sdate, edate, variable, frequency, area_id, unit_conversion_fn) {
    const area = ClimateByLocationWidget.get_areas(null, null, area_id)[0];
    const elems = [Object.assign(
        this.get_variable_config()['acis_elements'][(frequency === 'annual') ? 'annual' : 'monthly'],
        {"area_reduce": area.area_type + '_mean'}
    )];
    const response = await (await fetch(this.options.data_api_endpoint, {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(
          {
            "grid": grid,
            "sdate": String(sdate),
            "edate": String(edate),
            "elems": elems,
            [area.area_type]: area.area_id
          }
      )
    })).json();
    let keys = [];
    let values = [];
    for (const [key, value] of get(response, 'data', {})) {
      if (undefined !== value[area_id] && String(value[area_id]) !== '-999' && String(value[area_id]) !== '') {
        keys.push(key)
        values.push(unit_conversion_fn(value[area_id]))
      }
    }
    return [keys, values];
  }

  /**
   * Retrieves island data and pre-filters it to just the variable we're interested in.
   * @return {Promise<array<{area_id,scenario,sdate,area_label,gcm_coords,area_type,variable,annual_data:{all_max, all_mean,all_min}, monthly_data:{all_max, all_mean,all_min}}>>}
   * @private
   */
  async _fetch_island_data(variable, area_id) {
    const response = await (await fetch(this.options.island_data_url_template.replace('{area_id}', area_id), {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      },
    })).json();
    if (!response) {
      throw new Error(`No data found for area "${area_id}" and variable "${variable}"`)
    }
    // variable names are slightly different in the island data
    if (variable === 'days_dry_days') {
      variable = 'dryday'
    } else if (variable.startsWith('days_t')) {
      variable = variable.replace(/days_(.+?)_.+?_([0-9]+)f/, "$1$2F")
    } else if (variable.startsWith('days_pcpn')) {
      variable = variable.replace(/.+?([0-9]+)in/, "pr$1in")
    } else if (variable.endsWith('_65f')) {
      variable = variable.replace('_65f', '');
    } else if (variable === 'gddmod') {
      variable = 'mgdd';
    } else if (variable === 'pcpn') {
      variable = 'precipitation';
    }
    return response.data.filter((series) => series.area_id === this.options.area_id && series.variable === variable)
  }


  _transform_acis_loca_monthly(wMean45, min45, max45, wMean85, min85, max85) {
    // TODO completely revise this!
    let data = {};
    [2025, 2050, 2075].forEach((yearRange) => {
      data[yearRange] = {};
      ClimateByLocationWidget._months.forEach((month) => {
        let season_month = month;

        if (undefined === data[yearRange][season_month]) {
          data[yearRange][season_month] = {};
        }
        let datasets = {
          'wMean45': wMean45,
          'wMean85': wMean85,
          'min45': min45,
          'max45': max45,
          'min85': min85,
          'max85': max85
        };
        Object.keys(datasets).forEach((dataset) => {
          if (undefined === data[yearRange][season_month][dataset]) {
            data[yearRange][season_month][dataset] = [];
          }
          for (let year = yearRange - 15; year < yearRange + 15; year++) {
            let year_month = String(year) + '-' + String(month);
            if (datasets[dataset].hasOwnProperty(year_month)) {
              data[yearRange][season_month][dataset].push(datasets[dataset][year_month]);
            }
          }
        });
      });
    });
    // mean values by month
    Object.keys(data).forEach((yearRange) => {
      Object.keys(data[yearRange]).forEach((month) => {
        ['wMean45', 'wMean85', 'min45', 'min85', 'max45', 'max85'].forEach((valueName) => {
          let length = data[yearRange][month][valueName].length;
          let sum = data[yearRange][month][valueName].reduce((acc, value) => {
            return acc + value;
          }, 0);
          data[yearRange][month][valueName] = sum / length;
        });
      });
    });
    // reformat to expected output
    // [ month,2025rcp45_max,2025rcp45_weighted_mean,2025rcp45_min,2025rcp85_max,2025rcp85_weighted_mean,2025rcp85_min,2050rcp45_max,2050rcp45_weighted_mean,2050rcp45_min,2050rcp85_max,2050rcp85_weighted_mean,2050rcp85_min,2075rcp45_max,2075rcp45_weighted_mean,2075rcp45_min,2075rcp85_max,2075rcp85_weighted_mean,2075rcp85_min ]
    let dataByMonth = {};

    ClimateByLocationWidget._months.forEach((month) => {
      dataByMonth[month] = {};
      ClimateByLocationWidget._monthly_timeperiods.forEach((yearRange) => {
        ['45', '85'].forEach((scenario) => {
          ['max', 'wMean', 'min'].forEach((valueName) => {
            dataByMonth[month][String(yearRange) + 'rcp' + String(scenario) + '_' + String(valueName)] = data[yearRange][month][String(valueName) + String(scenario)];
          });
        });
      });
    });
    let result = [];
    Object.keys(dataByMonth).forEach((month) => {
      result.push([month,
        dataByMonth[month]['2025rcp45_wMean'],
        dataByMonth[month]['2025rcp45_min'],
        dataByMonth[month]['2025rcp45_max'],
        dataByMonth[month]['2025rcp85_wMean'],
        dataByMonth[month]['2025rcp85_min'],
        dataByMonth[month]['2025rcp85_max'],
        dataByMonth[month]['2050rcp45_wMean'],
        dataByMonth[month]['2050rcp45_min'],
        dataByMonth[month]['2050rcp45_max'],
        dataByMonth[month]['2050rcp85_wMean'],
        dataByMonth[month]['2050rcp85_min'],
        dataByMonth[month]['2050rcp85_max'],
        dataByMonth[month]['2075rcp45_wMean'],
        dataByMonth[month]['2075rcp45_min'],
        dataByMonth[month]['2075rcp45_max'],
        dataByMonth[month]['2075rcp85_wMean'],
        dataByMonth[month]['2075rcp85_min'],
        dataByMonth[month]['2075rcp85_max'],
      ]);
    });

    // Sort before returning
    result.sort((a, b) => {
      return (a[0] > b[0]) - (a[0] < b[0])
    });

    this.downloadable_dataurls.proj_mod = this._format_export_data(['month', '2025_rcp45_weighted_mean', '2025_rcp45_min', '2025_rcp45_max', '2025_rcp85_weighted_mean', '2025_rcp85_min', '2025_rcp85_max', '2050_rcp45_weighted_mean', '2050_rcp45_min', '2050_rcp45_max', '2050_rcp85_weighted_mean', '2050_rcp85_min', '2050_rcp85_max', '2075_rcp45_max', '2075_rcp45_weighted_mean', '2075_rcp45_min', '2075_rcp45_max', '2075_rcp85_weighted_mean', '2075_rcp85_min', '2075_rcp85_max'], result);
    return result;
  }

  /**
   * Updates this.options.xrange and this.options.yrange (if they are not null) based on new ranges computed from data and emits range events.
   * @param x_range_min
   * @param x_range_max
   * @param y_range_min
   * @param y_range_max
   * @return {*[]}
   * @private
   */
  _update_axes_ranges(x_range_min, x_range_max, y_range_min, y_range_max) {
    if (!!this.options.x_axis_range) {
      this.options.x_axis_range = [Math.max(x_range_min, get(this.options, ['x_axis_range', 0], x_range_min)), Math.min(x_range_max, get(this.options, ['x_axis_range', 1], x_range_max))];
    }
    if (!!this.options.y_axis_range) {
      this.options.y_axis_range = [Math.max(y_range_min, get(this.options, ['y_axis_range', 0], y_range_min)), Math.min(y_range_max, get(this.options, ['y_axis_range', 1], y_range_max))];
    }
    if (Number.isFinite(x_range_min) && Number.isFinite(x_range_max)) {
      window.setTimeout(() => {
        this.element.dispatchEvent(new CustomEvent('x_axis_range_change', {detail: [x_range_min, x_range_max, get(this.options, ['x_axis_range', 0], x_range_min), get(this.options, ['x_axis_range', 1], x_range_max)]}));
        this.element.dispatchEvent(new CustomEvent('y_axis_range_change', {detail: [y_range_min, y_range_max, get(this.options, ['y_axis_range', 0], y_range_min), get(this.options, ['y_axis_range', 1], y_range_max)]}));
      });
    }
    return [...(this.options.x_axis_range || [x_range_min, x_range_max]), ...(this.options.y_axis_range || [y_range_min, y_range_max])];
  }

  _get_y_axis_layout(y_range_min, y_range_max, variable_config) {
    return {
      type: 'linear',
      range: [y_range_min, y_range_max],
      showline: true,
      showgrid: true,
      linecolor: 'rgb(0,0,0)',
      linewidth: 1,
      tickcolor: 'rgb(0,0,0)',
      tickfont: {
        size: 10,
        family: 'roboto, monospace',
        color: 'rgb(0,0,0)'
      },
      nticks: 25,
      tickangle: 0,
      title: {
        text: variable_config['ytitles']['annual'][this.options.unitsystem],
        font: {
          family: 'roboto, monospace',
          size: 12,
          color: '#494949'
        }
      }
    };
  }

  _get_x_axis_layout(x_range_min, x_range_max) {
    return {
      type: 'linear',
      range: this.options.x_axis_range || [x_range_min, x_range_max],
      showline: true,
      linecolor: 'rgb(0,0,0)',
      linewidth: 1,
      // dtick: 5,
      nticks: 15,
      tickcolor: 'rgb(0,0,0)',
      tickfont: {
        size: 12,
        family: 'roboto, monospace',
        color: 'rgb(0,0,0)'
      },
      tickangle: 0,
      // title: {
      //   text: 'Year',
      //   font: {
      //     family: 'roboto, monospace',
      //     size: 13,
      //     color: '#494949'
      //   }
      // },
    };
  }


  _get_plotly_options() {
    return {displaylogo: false, modeBarButtonsToRemove: ['toImage', 'lasso2d', 'select2d']};
  }

  _show_spinner() {
    this._hide_spinner();
    let style = "<style>.cwg-spinner { margin-top: -2.5rem; border-radius: 100%;border-style: solid;border-width: 0.25rem;height: 5rem;width: 5rem;animation: basic 1s infinite linear; border-color: rgba(0, 0, 0, 0.2);border-top-color: rgba(0, 0, 0, 1); }@keyframes basic {0%   { transform: rotate(0); }100% { transform: rotate(359.9deg); }} .cwg-spinner-wrapper {display:flex; align-items: center; justify-content: center; }</style>";
    this.element.style.position = 'relative';
    const spinner_el = document.createElement('div');
    spinner_el.classList.add('cwg-spinner-wrapper');
    spinner_el.style.position = 'absolute';
    spinner_el.style.width = "100%";
    spinner_el.style.height = "100%";
    spinner_el.style.left = '0px';
    spinner_el.style.top = '0px';
    spinner_el.style.zIndex = '1000000';
    spinner_el.innerHTML = style + `<div class='cwg-spinner'></div>`;
    this.element.appendChild(spinner_el)
  }

  _hide_spinner() {
    if (this.element && this.element.querySelector('.cwg-spinner-wrapper')) {
      this.element.removeChild(this.element.querySelector('.cwg-spinner-wrapper'));
    }
  }

  _format_export_data(column_labels, data) {
    let export_data = data.map((row) => row.filter((cell) => cell !== null));
    export_data.unshift(column_labels);
    return 'data:text/csv;base64,' + window.btoa(export_data.map((a) => a.join(', ')).join('\n'));

  }


  _reset_downloadable_dataurls() {
    this.downloadable_dataurls = {
      hist_obs: '',
      hist_mod: '',
      proj_mod: ''
    };
  }

  /*
   * Public static methods
   */

  /**
   * Gets available variable options for a specified combination of frequency and area_id.
   *
   * @param frequency
   * @param unitsystem
   * @param area_id
   * @returns {promise<{id: *, title: *}[]>}
   */
  static when_variables(frequency, unitsystem, area_id) {
    return ClimateByLocationWidget.when_areas().then(ClimateByLocationWidget.get_variables.bind(this, frequency, unitsystem, area_id))
  }

  /**
   * Gets available variable options for a specified combination of frequency and area_id. If areas are not loaded, returns empty
   *
   * @param frequency
   * @param unitsystem
   * @param area_id
   * @returns {{id: *, title: *}[]}
   */
  static get_variables(frequency, unitsystem, area_id) {
    unitsystem = unitsystem || 'english';
    return ClimateByLocationWidget._variables.filter((v) => frequency in v.ytitles && ((typeof v.supports_area === "function" ? v.supports_area(area_id) : true))).map((v) => {
      return {id: v.id, title: v.title[unitsystem]};
    });
  }

  /**
   * Gets available frequency options for a specified area.
   *
   * @param area_id
   * @returns {promise<{id: (string), title: (string)}[]>}
   */
  static when_frequencies(area_id) {
    return ClimateByLocationWidget.when_areas().then(ClimateByLocationWidget.get_frequencies.bind(this, area_id))
  }

  /**
   * Gets available frequency options for a specified area.
   *
   * @param area_id
   * @returns {{id: (string), title: (string)}[]}
   */
  static get_frequencies(area_id) {
    return ClimateByLocationWidget._frequencies.filter((f) => ((typeof f.supports_area === "function" ? f.supports_area(area_id) : true))).map((v) => {
      return {id: v.id, title: v.title};
    });
  }

  /**
   * Gets available areas based on type or the state they belong to (counties only).
   * @param type {string|null} Area type to filter by. Any of 'state', 'county', 'island'.
   * @param state {string|null} Two-digit abbreviation of state to filter by. Implies type='state'
   * @param area_id {string|null} Area id to filter by. Will never return more than 1 result.
   * @returns Promise<array<{area_id, area_label, area_type, state}>>
   */
  static when_areas(type = null, state = null, area_id = null) {
    if (all_areas === null && when_areas === null) {
      when_areas = fetch(ClimateByLocationWidget._areas_json_url).then((response) => response.json()).then(data => {
        if (!data) {
          throw new Error("Failed to retrieve areas!");
        }
        all_areas = data;
      });
    }
    return when_areas.then(ClimateByLocationWidget.get_areas.bind(this, type, state, area_id))
  }

  /**
   * Gets available areas based on type or the state they belong to (counties only). If called before areas are loaded, returns empty.
   * @param type {string|null} Area type to filter by. Any of 'state', 'county', 'island'.
   * @param state {string|null} Two-digit abbreviation of state to filter by. Implies type='state'
   * @param area_id {string|null} Area id to filter by. Will never return more than 1 result.
   * @returns array<{area_id, area_label, area_type, state}>
   */
  static get_areas(type = null, state = null, area_id = null) {
    if (!all_areas) {
      console.warn('Areas not yet loaded! Use when_areas() for async access to areas.')
      return [];
    }
    if (!!area_id) {
      area_id = String(area_id).toLowerCase();
      return all_areas.filter((area) => String(area.area_id).toLowerCase() === area_id)
    }
    if (!!state) {
      state = String(state).toUpperCase();
      return all_areas.filter((area) => area['area_type'] === 'county' && area.state === state);
    }
    if (!!type) {
      type = String(type).toLowerCase();
      if (!['state', 'county', 'island'].includes(type)) {
        throw Error(`Invalid area type "${type}", valid types are 'state','county', and 'island'`);
      }
      return all_areas.filter((area) => area['area_type'] === type)
    }
    return all_areas;
  }

  /**
   * Gets available areas based on type or the state they belong to (counties only). Returns first area. If called before areas are loaded, returns empty.
   * @param type {string|null} Area type to filter by. Any of 'state', 'county', 'island'.
   * @param state {string|null} Two-digit abbreviation of state to filter by. Implies type='state'
   * @param area_id {string|null} Area id to filter by. Will never return more than 1 result.
   * @returns array<{area_id, area_label, area_type, state}>
   */
  static find_area(type = null, state = null, area_id = null) {
    const areas = ClimateByLocationWidget.get_areas(type, state, area_id);
    return areas.length > 0 ? areas[0] : null;
  }

  /**
   * This function is used to toggle features based on whether the selected area_id is in Alaska or not.
   *
   * @param area_id
   * @returns {boolean}
   */
  static is_ak_area(area_id) {
    return String(area_id).startsWith('02') || area_id === 'AK'
  }

  /**
   * This function is used to toggle features based on whether the selected area_id is an island or other non-conus area.
   *
   * @param area_id
   * @returns {boolean}
   */
  static is_island_area(area_id) {
    return get(ClimateByLocationWidget.get_areas(null, null, area_id), [0, 'area_type']) === 'island'
  }

  /**
   * This function is used to toggle features based on whether the selected area_id is a CONUS area.
   *
   * @param area_id
   * @returns {boolean}
   */
  static is_conus_area(area_id) {
    const non_conus_states = ['HI', 'AK'];
    if (non_conus_states.includes(area_id)) {
      return false
    }
    const area = ClimateByLocationWidget.get_areas(null, null, area_id);
    return (!(get(area, [0, 'area_type']) === 'island') && !(get(area, [0, 'area_type']) === 'county' && non_conus_states.includes(get(area, [0, 'state']))))
  }

  /*
   * Private static properties and methods
   */
  static _areas_json_url = 'areas.json';

  static get _variables() {
    return [
      {
        id: "tmax",
        title: {
          english: "Average Daily Max Temp",
          metric: "Average Daily Max Temp"
        },
        acis_elements: {
          annual: {
            "name": "maxt",
            "units": "degreeF",
            "interval": "yly",
            "duration": "yly",
            "reduce": "mean"

          },
          monthly: {
            "name": "maxt",
            "units": "degreeF",
            "interval": "mly",
            "duration": "mly",
            "reduce": "mean"
          }
        },
        unit_conversions: {
          metric: ClimateByLocationWidget._fahrenheit_to_celsius,
          english: identity
        },
        ytitles: {
          annual: {
            english: "Average Daily Max Temp (°F)",
            metric: "Average Daily Max Temp (°C)"
          },
          monthly: {
            english: "Average Daily Max Temp (°F)",
            metric: "Average Daily Max Temp (°C)"
          }
        },
        supports_area: () => true
      },
      {
        id: "tmin",
        title: {
          english: "Average Daily Min Temp",
          metric: "Average Daily Min Temp"
        },
        acis_elements: {
          annual: {
            "name": "mint",
            "units": "degreeF",
            "interval": "yly",
            "duration": "yly",
            "reduce": "mean"
          },
          monthly: {
            "name": "mint",
            "units": "degreeF",
            "interval": "mly",
            "duration": "mly",
            "reduce": "mean"
          }
        },
        unit_conversions: {
          metric: ClimateByLocationWidget._fahrenheit_to_celsius,
          english: identity
        },
        ytitles: {
          annual: {
            english: "Average Daily Min Temp (°F)",
            metric: "Average Daily Min Temp (°C)"
          },
          monthly: {
            english: "Average Daily Min Temp (°F)",
            metric: "Average Daily Min Temp (°C)"
          }
        },
        supports_area: () => true
      },
      {
        id: "days_tmax_gt_50f",
        title: {
          english: "Days per year with max above 50°F",
          metric: "Days per year with max above 10°C"
        },
        acis_elements: {
          annual: {
            "name": "maxt",
            "interval": "yly",
            "duration": "yly",
            "reduce": "cnt_gt_50"

          }
        },
        unit_conversions: {
          metric: identity,
          english: identity
        },
        ytitles: {
          annual: {
            english: "Days per year with max above 50°F",
            metric: "Days per year with max above 10°C"
          }
        },
        supports_area: ClimateByLocationWidget.is_ak_area
      },
      {
        id: "days_tmax_gt_60f",
        title: {
          english: "Days per year with max above 60°F",
          metric: "Days per year with max above 15.5°C"
        },
        acis_elements: {
          annual: {
            "name": "maxt",
            "interval": "yly",
            "duration": "yly",
            "reduce": "cnt_gt_60"

          }
        },
        unit_conversions: {
          metric: identity,
          english: identity
        },
        ytitles: {
          annual: {
            english: "Days per year with max above 60°F",
            metric: "Days per year with max above 15.5°C"
          }
        },
        supports_area: ClimateByLocationWidget.is_ak_area
      },
      {
        id: "days_tmax_gt_70f",
        title: {
          english: "Days per year with max above 70°F",
          metric: "Days per year with max above 21.1°C"
        },
        acis_elements: {
          annual: {
            "name": "maxt",
            "interval": "yly",
            "duration": "yly",
            "reduce": "cnt_gt_70"
          }
        },
        unit_conversions: {
          metric: identity,
          english: identity
        },
        ytitles: {
          annual: {
            english: "Days per year with max above 70°F",
            metric: "Days per year with max above 21.1°C"
          }
        },
        supports_area: ClimateByLocationWidget.is_ak_area
      },
      {
        id: "days_tmax_gt_80f",
        title: {
          english: "Days per year with max above 80°F",
          metric: "Days per year with max above 26.6°C"
        },
        acis_elements: {
          annual: {
            "name": "maxt",
            "interval": "yly",
            "duration": "yly",
            "reduce": "cnt_gt_80"

          }
        },
        unit_conversions: {
          metric: identity,
          english: identity
        },
        ytitles: {
          annual: {
            english: "Days per year with max above 80°F",
            metric: "Days per year with max above 26.6°C"
          }
        },
        supports_area: ClimateByLocationWidget.is_ak_area
      },
      {
        id: "days_tmax_gt_90f",
        title: {
          english: "Days per year with max above 90°F",
          metric: "Days per year with max above 32.2°C"
        },
        acis_elements: {
          annual: {
            "name": "maxt",
            "interval": "yly",
            "duration": "yly",
            "reduce": "cnt_gt_90"

          }
        },
        unit_conversions: {
          metric: identity,
          english: identity
        },
        ytitles: {
          annual: {
            english: "Days per year with max above 90°F",
            metric: "Days per year with max above 32.2°C"
          }
        },
        supports_area: () => true
      },
      {
        id: "days_tmax_gt_95f",
        title: {
          english: "Days per year with max above 95°F",
          metric: "Days per year with max above 35°C"
        },
        acis_elements: {
          annual: {
            "name": "maxt",
            "interval": "yly",
            "duration": "yly",
            "reduce": "cnt_gt_95"

          }
        },
        unit_conversions: {
          metric: identity,
          english: identity
        },
        ytitles: {
          annual: {
            english: "Days per year with max above 95°F",
            metric: "Days per year with max above 35°C"
          }
        },
        supports_area: (area_id) => !ClimateByLocationWidget.is_ak_area(area_id)
      },
      {
        id: "days_tmax_gt_100f",
        title: {
          english: "Days per year with max above 100°F",
          metric: "Days per year with max above 37.7°C"
        },
        acis_elements: {
          annual: {
            "name": "maxt",
            "interval": "yly",
            "duration": "yly",
            "reduce": "cnt_gt_100"

          }
        },
        unit_conversions: {
          metric: identity,
          english: identity
        },
        ytitles: {
          annual: {
            english: "Days per year with max above 100°F",
            metric: "Days per year with max above 37.7°C"
          }
        },
        supports_area: (area_id) => !ClimateByLocationWidget.is_ak_area(area_id)
      },
      {
        id: "days_tmax_gt_105f",
        title: {
          english: "Days per year with max above 105°F",
          metric: "Days per year with max above 40.5°C"
        },
        acis_elements: {
          annual: {
            "name": "maxt",
            "interval": "yly",
            "duration": "yly",
            "reduce": "cnt_gt_105"

          }
        },
        unit_conversions: {
          metric: identity,
          english: identity
        },
        ytitles: {
          annual: {
            english: "Days per year with max above 105°F",
            metric: "Days per year with max above 40.5°C"
          }
        },
        supports_area: (area_id) => !ClimateByLocationWidget.is_ak_area(area_id)
      },
      {
        id: "days_tmax_lt_32f",
        title: {
          english: "Days per year with max below 32°F (Icing days)",
          metric: "Days per year with max below 0°C (Icing days)"
        },
        acis_elements: {
          annual: {
            "name": "maxt",
            "interval": "yly",
            "duration": "yly",
            "reduce": "cnt_lt_32"

          }
        },
        unit_conversions: {
          metric: identity,
          english: identity
        },
        ytitles: {
          annual: {
            english: "Days per year with max below 32°F (Icing days)",
            metric: "Days per year with max below 0°C (Icing days)"
          }
        },
        supports_area: () => true
      },
      {
        id: "days_tmin_lt_32f",
        title: {
          english: "Days per year with min below 32°F (frost days)",
          metric: "Days per year with min below 0°C (frost days)"
        },
        acis_elements: {
          annual: {
            "name": "mint",
            "interval": "yly",
            "duration": "yly",
            "reduce": "cnt_lt_32"

          }
        },
        unit_conversions: {
          metric: identity,
          english: identity
        },
        ytitles: {
          annual: {
            english: "Days per year with min below 32°F (frost days)",
            metric: "Days per year with min below 0°C (frost days)"
          }
        },
        supports_area: () => true
      },
      {
        id: "days_tmin_lt_minus_40f",
        title: {
          english: "Days per year with min below -40°F",
          metric: "Days per year with min below -40°C"
        },
        acis_elements: {
          annual: {
            "name": "mint",
            "interval": "yly",
            "duration": "yly",
            "reduce": "cnt_lt_-40"

          }
        },
        unit_conversions: {
          metric: identity,
          english: identity
        },
        ytitles: {
          annual: {
            english: "Days per year with min below -40°F",
            metric: "Days per year with min below -40°C"
          }
        },
        supports_area: ClimateByLocationWidget.is_ak_area
      },
      {
        id: "days_tmin_gt_60f",
        title: {
          english: "Days per year with min above 60°F",
          metric: "Days per year with min above 15.5°C"
        },
        acis_elements: {
          annual: {
            "name": "mint",
            "interval": "yly",
            "duration": "yly",
            "reduce": "cnt_gt_80"

          },
          monthly: {
            "name": "mint",
            "interval": "mly",
            "duration": "mly",
            "reduce": "cnt_gt_80"

          }
        },
        unit_conversions: {
          metric: identity,
          english: identity
        },
        ytitles: {
          annual: {
            english: "Days per year with min above 60°F",
            metric: "Days per year with min above 15.5°C"
          }
        },
        supports_area: ClimateByLocationWidget.is_ak_area
      },
      {
        id: "days_tmin_gt_80f",
        title: {
          english: "Days per year with min above 80°F",
          metric: "Days per year with min above 26.6°C"
        },
        acis_elements: {
          annual: {
            "name": "mint",
            "interval": "yly",
            "duration": "yly",
            "reduce": "cnt_gt_80"

          },
          monthly: {
            "name": "mint",
            "interval": "mly",
            "duration": "mly",
            "reduce": "cnt_gt_80"

          }
        },
        unit_conversions: {
          metric: identity,
          english: identity
        },
        ytitles: {
          annual: {
            english: "Days per year with min above 80°F",
            metric: "Days per year with min above 26.6°C"
          }
        },
        supports_area: (area_id) => !ClimateByLocationWidget.is_ak_area(area_id)
      },
      {
        id: "days_tmin_gt_90f",
        title: {
          english: "Days per year with min above 90°F",
          metric: "Days per year with min above 32.2°C"
        },
        acis_elements: {
          annual: {
            "name": "mint",
            "interval": "yly",
            "duration": "yly",
            "reduce": "cnt_gt_90"

          },
          monthly: {
            "name": "mint",
            "interval": "mly",
            "duration": "mly",
            "reduce": "cnt_gt_90"

          }
        },
        unit_conversions: {
          metric: identity,
          english: identity
        },
        ytitles: {
          annual: {
            english: "Days per year with min above 90°F",
            metric: "Days per year with min above 32.2°C"
          }
        },
        supports_area: (area_id) => !ClimateByLocationWidget.is_ak_area(area_id)
      },
      {
        id: "hdd_65f",
        title: {
          english: "Heating Degree Days",
          metric: "Heating Degree Days"
        },
        acis_elements: {
          annual: {
            "name": "hdd",
            "interval": "yly",
            "duration": "yly",
            "reduce": "sum"

          }
        },
        unit_conversions: {
          metric: ClimateByLocationWidget._fdd_to_cdd,
          english: identity
        },
        ytitles: {
          annual: {
            english: "Heating Degree Days (°F-days)",
            metric: "Heating Degree Days (°C-days)"
          }
        },
        supports_area: () => true
      },
      {
        id: "cdd_65f",
        title: {
          english: "Cooling Degree Days",
          metric: "Cooling Degree Days"
        },
        acis_elements: {
          annual: {
            "name": "cdd",
            "interval": "yly",
            "duration": "yly",
            "reduce": "sum"

          }
        },
        unit_conversions: {
          metric: ClimateByLocationWidget._fdd_to_cdd,
          english: identity
        },
        ytitles: {
          annual: {
            english: "Cooling Degree Days (°F-days)",
            metric: "Cooling Degree Days (°C-days)"
          }
        },
        supports_area: () => true
      },
      {
        id: "gdd",
        title: {
          english: "Growing Degree Days",
          metric: "Growing Degree Days"
        },
        acis_elements: {
          annual: {
            "name": "gdd",
            "interval": "yly",
            "duration": "yly",
            "reduce": "sum"
          }
        },
        unit_conversions: {
          metric: identity,
          english: identity
        },
        ytitles: {
          annual: {
            english: "Growing Degree Days (°F-days)",
            metric: "Growing Degree Days (°C-days)"
          }
        },
        supports_area: () => true
      },
      {
        id: "gddmod",
        title: {
          english: "Modified Growing Degree Days",
          metric: "Modified Growing Degree Days"
        },
        acis_elements: {
          annual: {
            "name": "gdd",
            "duration": "yly",
            "limit": [86, 50],
            "interval": "yly",
            "reduce": "sum"
          }
        },
        unit_conversions: {
          metric: identity,
          english: identity
        },
        ytitles: {
          annual: {
            english: "Modified Growing Degree Days (°F-days)",
            metric: "Modified Growing Degree Days (°C-days)"
          }
        },
        supports_area: () => true
      },
      {
        id: "gdd_32f",
        title: {
          english: "Thawing Degree Days",
          metric: "Thawing Degree Days"
        },
        acis_elements: {
          annual: {
            "name": "gdd32",
            "interval": "yly",
            "duration": "yly",
            "reduce": "sum"
          }
        },
        unit_conversions: {
          metric: ClimateByLocationWidget._fdd_to_cdd,
          english: identity
        },
        ytitles: {
          annual: {
            english: "Thawing Degree Days (°F-days)",
            metric: "Thawing Degree Days (°C-days)"
          }
        },
        supports_area: ClimateByLocationWidget.is_ak_area
      },
      {
        id: "hdd_32f",
        title: {
          english: "Freezing Degree Days",
          metric: "Freezing Degree Days"
        },
        acis_elements: {
          annual: {
            "name": "hdd32",
            "interval": "yly",
            "duration": "yly",
            "reduce": "sum"
          }
        },
        unit_conversions: {
          metric: ClimateByLocationWidget._fdd_to_cdd,
          english: identity
        },
        ytitles: {
          annual: {
            english: "Freezing Degree Days (°F-days)",
            metric: "Freezing Degree Days (°C-days)"
          }
        },
        supports_area: ClimateByLocationWidget.is_ak_area
      },
      {
        id: "pcpn",
        title: {
          english: "Total Precipitation",
          metric: "Total Precipitation"
        },
        acis_elements: {
          annual: {
            "name": "pcpn",
            "interval": "yly",
            "duration": "yly",
            "reduce": "sum",
            "units": "inch"

          },
          monthly: {
            "name": "pcpn",
            "interval": "mly",
            "duration": "mly",
            "reduce": "sum",
            "units": "inch"

          }
        },
        unit_conversions: {
          metric: ClimateByLocationWidget._inches_to_mm,
          english: identity
        },
        ytitles: {
          annual: {
            english: "Total Precipitation (in.)",
            metric: "Total Precipitation"
          },
          monthly: {
            english: "Total Precipitation (in.)",
            metric: "Total Precipitation"
          }

        },
        supports_area: () => true
      },
      {
        id: "days_dry_days",
        title: {
          english: "Dry Days",
          metric: "Dry Days"
        },
        acis_elements: {
          annual: {
            "name": "pcpn",
            "interval": "yly",
            "duration": "yly",
            "reduce": "cnt_lt_0.01"
          },
          monthly: {

            "name": "pcpn",
            "interval": "mly",
            "duration": "mly",
            "reduce": "cnt_lt_0.01"

          }
        },
        unit_conversions: {
          metric: identity,
          english: identity
        },
        ytitles: {
          annual: {
            english: "Dry Days (days/period)",
            metric: "Dry Days (days/period)"
          },

        },
        supports_area: () => true
      },
      {
        id: "days_pcpn_gt_0_25in",
        title: {
          english: "Days per year with more than 0.25in precipitation",
          metric: "Days per year with more than 6.35mm precipitation"
        },
        acis_elements: {
          annual: {
            "name": "pcpn",
            "interval": "yly",
            "duration": "yly",
            "reduce": "cnt_gt_1"

          }
        },
        unit_conversions: {
          metric: identity,
          english: identity
        },
        ytitles: {
          annual: {
            english: "Days per year with more than 0.25in precipitation",
            metric: "Days per year with more than 6.35mm precipitation"
          }

        },
        supports_area: ClimateByLocationWidget.is_ak_area
      },
      {
        id: "days_pcpn_gt_1in",
        title: {
          english: "Days per year with more than 1in precip",
          metric: "Days per year with more than 25.3mm precip"
        },
        acis_elements: {
          annual: {
            "name": "pcpn",
            "interval": "yly",
            "duration": "yly",
            "reduce": "cnt_gt_1"

          }
        },
        unit_conversions: {
          metric: identity,
          english: identity
        },
        ytitles: {
          annual: {
            english: "Days per year with more than 1in precip",
            metric: "Days per year with more than 25.3mm precip"
          }

        },
        supports_area: () => true
      },
      {
        id: "days_pcpn_gt_2in",
        title: {
          english: "Days per year with more than 2in precip",
          metric: "Days per year with more than 50.8mm precip"
        },
        acis_elements: {
          annual: {
            "name": "pcpn",
            "interval": "yly",
            "duration": "yly",
            "reduce": "cnt_gt_2"

          }

        },
        unit_conversions: {
          metric: identity,
          english: identity
        },
        ytitles: {
          annual: {
            english: "Days per year with more than 2in precip",
            metric: "Days of Precipitation Above 50.8mm"
          }

        },
        supports_area: () => true
      },
      {
        id: "days_pcpn_gt_3in",
        title: {
          english: "Days per year with more than 3in precip",
          metric: "Days per year with more than 76.2mm precip"
        },
        acis_elements: {
          annual: {
            "name": "pcpn",
            "interval": "yly",
            "duration": "yly",
            "reduce": "cnt_gt_3"

          }
        },
        unit_conversions: {
          metric: identity,
          english: identity
        },
        ytitles: {
          annual: {
            english: "Days per year with more than 3in precip",
            metric: "Days per year with more than 76.2mm precip"
          }
        },
        supports_area: () => true
      },
      {
        id: "days_pcpn_gt_4in",
        title: {
          english: "Days per year with more than 4in precip",
          metric: "Days per year with more than 101.6mm precip"
        },
        acis_elements: {
          annual: {
            "name": "pcpn",
            "interval": "yly",
            "duration": "yly",
            "reduce": "cnt_gt_4"

          }
        },
        unit_conversions: {
          metric: identity,
          english: identity
        },
        ytitles: {
          annual: {
            english: "Days per year with more than 4in precip",
            metric: "Days per year with more than 101.6mm precip"
          }
        },
        supports_area: (area_id) => !ClimateByLocationWidget.is_ak_area(area_id)
      }
    ];
  }

  static get _frequencies() {
    return [
      {
        id: 'annual',
        title: 'Annual',
        supports_area: () => true
      },
      {
        id: 'monthly',
        title: 'Monthly',
        supports_area: (area_id) => ClimateByLocationWidget.is_conus_area(area_id) || ClimateByLocationWidget.is_island_area(area_id)
      }
    ]
  }

  static _bool_options = ['show_historical_observed', 'show_historical_modeled', 'show_projected_rcp45', 'show_projected_rcp85'];

  static _months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  static _months_labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  static _monthly_timeperiods = [2025, 2050, 2075];

  /**
   * Performs a rolling window average using the given array, returning a single value.
   * @param collection
   * @param year
   * @param window_size
   * @return {number}
   * @private
   */
  static _rolling_window_average(collection, year, window_size = 10) {
    return mean(lodash_range(window_size).map((x) => get(collection, year - x)).filter((y) => !!y))
  }


  /**
   * Utility function to convert F to C
   * @param f
   * @return {number}
   */
  static _fahrenheit_to_celsius(f) {
    return (5 / 9) * (f - 32)
  }

  /**
   * Utility function to convert F degree days to C degree days
   * @param fdd
   * @return {number}
   */
  static _fdd_to_cdd(fdd) {
    return fdd / 9 * 5;
  }

  /**
   * Utility function inches to mm
   * @param inches
   * @return {number}
   */
  static _inches_to_mm(inches) {
    return inches * 25.4;
  }

  /**
   * Utility function to add an alpha channel to an rgb color. Doesn't play nice with hex colors.
   * @param rgb
   * @param opacity
   * @return {string}
   * @private
   */
  static _rgba(rgb, opacity) {
    const [r, g, b] = rgb.split('(').splice(-1)[0].split(')')[0].split(',').slice(0, 3)
    return `rgba(${r},${g},${b},${opacity})`
  }
}


