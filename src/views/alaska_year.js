import View from "./view_base.js";
import {isEqual, max, min, round} from "../../node_modules/lodash-es/lodash.js";
import {format_export_data, rgba, rolling_window_average} from "../utils.js";
import {fetch_acis_data} from "../io.js";
import {data_api_url} from "../constants.js";

/* globals jQuery, window, Plotly, fetch */

// noinspection DuplicatedCode
export default class AlaskaYearView extends View {
  constructor(parent, element) {
    super(parent, element);
    this._style = `#${this.parent.element.id} .legendtitletext{ display: none; }`
    parent._styles.splice(parent._styles.indexOf(`#${this.parent.element.id} .hoverlayer .legend {display: none !important;}`), 1)
    parent._styles.push(this._style)
    this.parent._update_styles()
  }

  async request_update() {
    // get data for GFDL-CM3 and NCAR-CCSM4
    const {
      colors,
      data_api_url,
      frequency,
      plotly_layout_defaults,
      rolling_window_mean_years,
      show_historical_modeled,
      show_legend,
      show_projected_rcp85,
      unitsystem,
      variable,
    } = this.parent.options;
    const area = this.parent.get_area();
    const variable_config = this.parent.get_variable_config();
    let hist_sdate_year = 1970;
    // let hist_sdate = hist_sdate_year + '-01-01';
    let hist_edate_year = 2005;
    // let hist_edate = hist_edate_year + '-12-31';
    let proj_edate_year = 2099;

    const precision = variable_config.rounding_precision || 1;
    const d3_precision = precision > 0 ? precision : 0; // d3 format can't round to 10s, 100s, etc
    const unit_conversion_fn = variable_config.unit_conversions[unitsystem];

    const [[gfdl_cm3_rcp85_years, gfdl_cm3_rcp85],
      [ncar_ccsm4_rcp85_years, ncar_ccsm4_rcp85]] = await Promise.all([
      fetch_acis_data({grid: 'snap:GFDL-CM3:rcp85', sdate: hist_sdate_year, edate: proj_edate_year, variable: variable, frequency: frequency, area: area, data_api_url: data_api_url, variable_config, unitsystem}),
      fetch_acis_data({grid: 'snap:NCAR-CCSM4:rcp85', sdate: hist_sdate_year, edate: proj_edate_year, variable: variable, frequency: frequency, area: area, data_api_url: data_api_url, variable_config, unitsystem}),
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

    for (let i = 0; i < hist_edate_year - hist_sdate_year + 1; i++) {
      //year,gfdl_cm3_rcp85,ncar_ccsm4_rcp85
      hist_mod_data.push([i + hist_sdate_year, rolling_window_average(gfdl_cm3_rcp85, i, rolling_window_mean_years), rolling_window_average(ncar_ccsm4_rcp85, i, rolling_window_mean_years), i + hist_sdate_year - rolling_window_mean_years]);
    }

    for (let i = hist_edate_year - hist_sdate_year; i <= proj_edate_year - hist_sdate_year + 1; i++) {
      //year,gfdl_cm3_rcp85,ncar_ccsm4_rcp85
      proj_mod_data.push([i + hist_sdate_year, rolling_window_average(gfdl_cm3_rcp85, i, rolling_window_mean_years), rolling_window_average(ncar_ccsm4_rcp85, i, rolling_window_mean_years), i + hist_sdate_year - rolling_window_mean_years]);
    }

    this._download_callbacks = {
      hist_mod: async () => format_export_data(['year', 'gfdl_cm3_rcp85', 'ncar_ccsm4_rcp85', `*Note that the values shown have had a ${rolling_window_mean_years}-year rolling window average applied.`], hist_mod_data),
      proj_mod: async () => format_export_data(['year', 'gfdl_cm3_rcp85', 'ncar_ccsm4_rcp85', `*Note that the values shown have had a ${rolling_window_mean_years}-year rolling window average applied.`], proj_mod_data)
    };


    const chart_data = {
      'hist_year': [],
      'hist_min': [],
      'hist_max': [],
      'proj_year': [],
      'rcp85_min': [],
      'rcp85_max': []
    };
    for (let i = 0; i < hist_mod_data.length; i++) {
      chart_data['hist_year'].push(hist_mod_data[i][0]);
      chart_data['hist_min'].push(round(Math.min(hist_mod_data[i][1], hist_mod_data[i][2]), precision));
      chart_data['hist_max'].push(round(Math.max(hist_mod_data[i][1], hist_mod_data[i][2]), precision));
    }

    // repeat 2005 data point to fill gap
    // chart_data['proj_year'].push(hist_mod_data[hist_mod_data.length - 1][0]);
    // chart_data['rcp85_min'].push(round(Math.min(hist_mod_data[hist_mod_data.length - 1][1], hist_mod_data[hist_mod_data.length - 1][2]), precision));
    // chart_data['rcp85_max'].push(round(Math.max(hist_mod_data[hist_mod_data.length - 1][1], hist_mod_data[hist_mod_data.length - 1][2]), precision));

    for (let i = 0; i < proj_mod_data.length; i++) {
      chart_data['proj_year'].push(proj_mod_data[i][0]);
      chart_data['rcp85_min'].push(round(Math.min(proj_mod_data[i][1], proj_mod_data[i][2]), precision));
      chart_data['rcp85_max'].push(round(Math.max(proj_mod_data[i][1], proj_mod_data[i][2]), precision));
    }

    const [x_range_min, x_range_max, y_range_min, y_range_max] = this.parent._update_axes_ranges(
      min([min(chart_data['hist_year']), min(chart_data['proj_year'])]),
      max([max(chart_data['hist_year']), max(chart_data['proj_year'])]),
      min([min(chart_data['hist_min']), min(chart_data['rcp45_min']), min(chart_data['rcp85_min'])]),
      max([max(chart_data['hist_max']), max(chart_data['rcp45_max']), max(chart_data['rcp85_max'])]),
    );

    Plotly.react(
      this.parent.view_container,
      [
        {
          name: 'Modeled minimum (historical)',
          x: chart_data['hist_year'],
          y: chart_data['hist_min'],
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          line: {
            color: rgba(colors.hist.outerBand, colors.opacity.ann_hist_minmax),
            width: 0,
            opacity: colors.opacity.ann_hist_minmax
          },
          legendgroup: 'hist',
          visible: !!show_historical_modeled ? true : 'legendonly',
          customdata: null,
          hovertemplate: "<extra></extra>"
        },
        {
          x: chart_data['hist_year'],
          y: chart_data['hist_max'],
          name: 'Modeled maximum (historical)',
          type: 'scatter',
          mode: 'lines',
          fill: 'tonexty',
          fillcolor: rgba(colors.hist.outerBand, 1),
          line: {color: rgba(colors.hist.outerBand, colors.opacity.ann_hist_minmax), width: 0, opacity: 1},
          legendgroup: 'hist',
          visible: !!show_historical_modeled ? true : 'legendonly',
          customdata: hist_mod_data,
          hovertemplate: `%{customdata[3]}&#8211;%{customdata[0]} modeled averages:<br>GFDL-CM3: %{customdata[1]:.${d3_precision}f}<br>NCAR-CCSM4: %{customdata[2]:.${d3_precision}f}`,
          hoverlabel: {namelength: 0},
        },
        {
          x: chart_data['proj_year'],
          y: chart_data['rcp85_min'],
          name: 'Modeled minimum (RCP 8.5)',
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          fillcolor: rgba(colors.rcp85.outerBand, colors.opacity.ann_proj_minmax),
          line: {color: rgba(colors.rcp85.outerBand, colors.opacity.ann_proj_minmax), width: 0, opacity: 1},
          legendgroup: 'rcp85',
          visible: show_projected_rcp85 ? true : 'legendonly',
          showlegend: false,
          hoverinfo: 'skip'
        },
        {
          x: chart_data['proj_year'],
          y: chart_data['rcp85_max'],
          name: 'Modeled maximum (RCP 8.5)',
          fill: 'tonexty',
          type: 'scatter',
          mode: 'lines',
          fillcolor: rgba(colors.rcp85.outerBand, colors.opacity.ann_proj_minmax),
          line: {color: rgba(colors.rcp85.outerBand, colors.opacity.ann_proj_minmax), width: 0, opacity: 1},
          legendgroup: 'rcp85',
          visible: show_projected_rcp85 ? true : 'legendonly',
          customdata: proj_mod_data,
          hovertemplate: `%{customdata[3]}&#8211;%{customdata[0]} higher emissions average projections:<br>GFDL-CM3: %{customdata[1]:.${d3_precision}f}<br>NCAR-CCSM4: %{customdata[2]:.${d3_precision}f}`,
          hoverlabel: {namelength: 0},
        },
      ],
      // layout
      Object.assign({},
        plotly_layout_defaults,
        {
          showlegend: show_legend,
          legend: {"orientation": "h"},
          xaxis: this.parent._get_x_axis_layout(x_range_min, x_range_max),
          yaxis: this.parent._get_y_axis_layout(y_range_min, y_range_max, variable_config)
        }),
      // options
      this.parent._get_plotly_options(),
    );


    this._when_chart = new Promise((resolve) => {
      this.element.once('plotly_afterplot', (gd) => {
        resolve(gd)
      })
    });
    await this._when_chart
    this.parent._hide_spinner()

  }

  async request_style_update() {
    const {show_historical_modeled, show_projected_rcp85} = this.parent.options;
    Plotly.restyle(this.parent.view_container, {
      visible: [
        !!show_historical_modeled ? true : 'legendonly',
        !!show_historical_modeled ? true : 'legendonly',
        !!show_projected_rcp85 ? true : 'legendonly',
        !!show_projected_rcp85 ? true : 'legendonly',
      ]
    })
  }

  async request_downloads() {
    const {get_area_label, frequency, variable} = this.parent.options;
    return [

      {
        label: 'Historical Modeled Data',
        icon: 'area-chart',
        attribution: 'ACIS: GFDL-CM3 and NCAR-CCSM4',
        when_data: this._download_callbacks['hist_mod'],
        filename: [
          get_area_label.bind(this)(),
          frequency,
          "hist_mod",
          variable
        ].join('-').replace(/ /g, '_') + '.csv'
      },
      {
        label: 'Projected Modeled Data',
        icon: 'area-chart',
        attribution: 'ACIS: GFDL-CM3 and NCAR-CCSM4',
        when_data: this._download_callbacks['proj_mod'],
        filename: [
          get_area_label.bind(this)(),
          frequency,
          "proj_mod",
          variable
        ].join('-').replace(/ /g, '_') + '.csv'
      },
      {
        label: 'Chart image',
        icon: 'picture-o',
        attribution: 'ACIS: GFDL-CM3 and NCAR-CCSM4',
        when_data: async () => {
          let {width, height} = window.getComputedStyle(this.element);
          width = Number.parseFloat(width) * 1.2;
          height = Number.parseFloat(height) * 1.2;
          return await Plotly.toImage(this.element, {
            format: 'png', width: width, height: height
          });
        },
        filename: [
          get_area_label.bind(this)(),
          frequency,
          variable,
          "graph"
        ].join('-').replace(/[^A-Za-z0-9\-]/g, '_') + '.png'
      },
    ]
  }

  /**
   * Options which force re-evaluation of which traces are visible within the current view.
   * @return {string[]}
   * @private
   */
  get style_option_names() {
    return [
      'show_projected_rcp85',
      'show_historical_modeled'
    ]
  }


  destroy() {
    super.destroy();
    //cleanup style
    const _style_idx = this.parent._styles.indexOf(this._style);
    if (_style_idx > -1) {
      this.parent._styles.splice(_style_idx, 1);
    }
    this.parent._styles.push(`#${this.parent.element.id} .hoverlayer .legend {display: none !important;}`);
    this.parent._update_styles();
  }

}