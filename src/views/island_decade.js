import View from "./view_base.js";
import {max, min, partial, range as lodash_range, round} from "../../node_modules/lodash-es/lodash.js";
import {compute_decadal_means, compute_rolling_window_means, format_export_data, rgba} from "../utils.js";
import {fetch_island_data} from "../io.js";

/* globals jQuery, window, Plotly, fetch, jStat */


// noinspection DuplicatedCode

/**
 * Creates/updates an annual graph (with a focus on decadal data) for islands and other areas outside CONUS.
 * @return {Promise<void>}
 * @private
 */
export default class IslandDecadeView extends View {

  constructor(parent, element) {
    super(parent, element);
    this._style = `#${this.parent.element.id} .legendtitletext{ display: none; }`
    parent._styles.push(this._style)
    this.parent._update_styles()
  }

  async request_update() {
    const {
      colors,
      hover_decadal_means,
      island_data_url_template,
      plotly_layout_defaults,
      rolling_window_mean_years,
      show_decadal_means,
      show_historical_modeled,
      show_legend,
      show_projected_rcp45,
      show_projected_rcp85,
      show_rolling_window_means,
      unitsystem,
      variable,
    } = this.parent.options;
    const area = this.parent.get_area();
    const variable_config = this.parent.get_variable_config();
    let data = await fetch_island_data(variable, area, island_data_url_template);

    let hist_mod_series = data.find((series) => series.scenario === 'historical')
    let rcp45_mod_series = data.find((series) => series.scenario === 'rcp45')
    let rcp85_mod_series = data.find((series) => series.scenario === 'rcp85')
    const unit_conversion_fn = variable_config.unit_conversions[unitsystem];

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


    const precision = variable_config.rounding_precision || 1;
    const d3_precision = precision > 0 ? precision : 0; // d3 format can't round to 10s, 100s, etc
    // format download data.
    this._download_callbacks = {
      hist_mod: async () => format_export_data(['year', 'mean', 'min', 'max', 'NOTE: This file contains annual projection values produced by global climate models. Decadal averages of these values (as shown in the Climate Explorer) are a more appropriate temporal scale for using projections.'], hist_mod_data, null, precision),
      proj_mod: async () => format_export_data(['year', 'rcp45_mean', 'rcp45_min', 'rcp45_max', 'rcp85_mean', 'rcp85_min', 'rcp85_max', 'NOTE: This file contains annual projection values produced by global climate models. Decadal averages of these values (as shown in the Climate Explorer) are a more appropriate temporal scale for using projections.'], proj_mod_data, null, precision)
    };
    // unpack arrays
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
      'rcp85_max': [],
      'hist_year_decade': [],
      'hist_decadal_mean': [],
      'hist_decadal_min': [],
      'hist_decadal_max': [],
      'proj_year_decade': [],
      'rcp45_decadal_mean': [],
      'rcp45_decadal_min': [],
      'rcp45_decadal_max': [],
      'rcp85_decadal_mean': [],
      'rcp85_decadal_min': [],
      'rcp85_decadal_max': [],
      'hist_rolling_mean': [],
      'hist_rolling_min': [],
      'hist_rolling_max': [],
      'rcp45_rolling_mean': [],
      'rcp45_rolling_min': [],
      'rcp45_rolling_max': [],
      'rcp85_rolling_mean': [],
      'rcp85_rolling_min': [],
      'rcp85_rolling_max': []
    };
    let decadal_means_traces = [];
    if (show_decadal_means || hover_decadal_means) {
      const hist_stat_annual_values = [...hist_mod_data.map((a) => [a[0], null, null, null, a[1], a[2], a[3]]), ...proj_mod_data.slice(0, 4)];
      const scenario_stat_annual_values = [...hist_mod_data.slice(-6).map((a) => [a[0], a[1], a[2], a[3], a[1], a[2], a[3]]), ...proj_mod_data];
      scenario_stat_annual_values.pop() // remove 2100 from decadals

      // compute decadal averages
      for (let i = 0; i < (proj_mod_data.length); i++) {
        chart_data['proj_year_decade'][i] = Math.trunc(proj_mod_data[i][0] / 10) * 10
      }
      for (let i = 0; i < (hist_mod_data.length); i++) {
        chart_data['hist_year_decade'][i] = Math.trunc(hist_mod_data[i][0] / 10) * 10
      }
      for (const [scenario, scenario_col_offset] of [['rcp45', 0], ['rcp85', 3]]) {
        for (const [stat, col_offset] of [['mean', 1], ['min', 2], ['max', 3]]) {
          const decadal_means = compute_decadal_means(scenario_stat_annual_values, 0, scenario_col_offset + col_offset, 2005, 2099);
          for (let i = 0; i < proj_mod_data.length; i++) {
            chart_data[scenario + '_decadal_' + stat][i] = decadal_means[Math.floor(((i + 6) / 10))];
          }
          // compute decadal averages for hist using extra values from rcp85
          if (scenario === 'rcp85') {
            const hist_decadal_means = compute_decadal_means(hist_stat_annual_values, 0, scenario_col_offset + col_offset, 1950, 2004);
            for (let i = 0; i < hist_mod_data.length; i++) {
              chart_data['hist_decadal_' + stat][i] = hist_decadal_means[Math.floor(i / 10)];
            }
          }
        }
      }
      chart_data['proj_year_decade'].unshift(2000) // repeat 2005
      chart_data['rcp45_decadal_mean'].unshift(chart_data['rcp45_decadal_mean'][0])
      chart_data['rcp45_decadal_min'].unshift(chart_data['rcp45_decadal_min'][0])
      chart_data['rcp45_decadal_max'].unshift(chart_data['rcp45_decadal_max'][0])
      chart_data['rcp85_decadal_mean'].unshift(chart_data['rcp85_decadal_mean'][0])
      chart_data['rcp85_decadal_min'].unshift(chart_data['rcp85_decadal_min'][0])
      chart_data['rcp85_decadal_max'].unshift(chart_data['rcp85_decadal_max'][0])
      if (show_decadal_means) {
        decadal_means_traces = [
          {
            name: 'Modeled maximum (historical decadal mean)',
            x: chart_data['hist_year'],
            y: chart_data['hist_decadal_max'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {color: rgba(colors.hist.outerBand, 1), width: 1.3, opacity: 1},
            visible: !!show_historical_modeled ? true : 'legendonly',
          },
          {
            name: 'Modeled mean (historical decadal mean)',
            x: chart_data['hist_year'],
            y: chart_data['hist_decadal_mean'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {color: rgba(colors.hist.outerBand, 1), width: 1.3, opacity: 1},
            visible: !!show_historical_modeled ? true : 'legendonly',
          },

          {
            name: 'Modeled minimum (historical decadal mean)',
            x: chart_data['hist_year'],
            y: chart_data['hist_decadal_min'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {color: rgba(colors.hist.outerBand, 1), width: 1.3, opacity: 1},
            visible: !!show_historical_modeled ? true : 'legendonly',
          },
          {
            name: 'Modeled maximum (RCP 4.5 decadal mean)',
            x: chart_data['proj_year'],
            y: chart_data['rcp45_decadal_max'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {color: rgba(colors.rcp45.outerBand, 1), width: 1.3, opacity: 1},
            visible: !!show_projected_rcp45 ? true : 'legendonly',
          },
          {
            name: 'Modeled minimum (RCP 4.5 decadal mean)',
            x: chart_data['proj_year'],
            y: chart_data['rcp45_decadal_min'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {color: rgba(colors.rcp45.outerBand, 1), width: 1.3, opacity: 1},
            visible: !!show_projected_rcp45 ? true : 'legendonly',
          },
          {
            name: 'Modeled mean (RCP 4.5 decadal mean)',
            x: chart_data['proj_year'],
            y: chart_data['rcp45_decadal_mean'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {color: rgba(colors.rcp45.outerBand, 1), width: 1.3, opacity: 1},
            visible: !!show_projected_rcp45 ? true : 'legendonly',
          },
          {
            name: 'Modeled maximum (RCP 8.5 decadal mean)',
            x: chart_data['proj_year'],
            y: chart_data['rcp85_decadal_max'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {color: rgba(colors.rcp85.outerBand, 1), width: 1.3, opacity: 1},
            visible: !!show_projected_rcp85 ? true : 'legendonly',
          },
          {
            name: 'Modeled minimum (RCP 8.5 decadal mean)',
            x: chart_data['proj_year'],
            y: chart_data['rcp85_decadal_min'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {color: rgba(colors.rcp85.outerBand, 1), width: 1.3, opacity: 1},
            visible: !!show_projected_rcp85 ? true : 'legendonly',
          },
          {
            name: 'Modeled mean (RCP 8.5 decadal mean)',
            x: chart_data['proj_year'],
            y: chart_data['rcp85_decadal_mean'],
            type: 'scatter',
            mode: 'lines',
            fill: 'none',
            line: {color: rgba(colors.rcp85.outerBand, 1), width: 1.3, opacity: 1},
            visible: !!show_projected_rcp85 ? true : 'legendonly',
          }
        ]
      }
      chart_data['proj_year_decade'].unshift(2005) // repeat 2005
      // chart_data['proj_year_decade'].push(2100) // 2100
    }
    let rolling_means_traces = [];
    if (show_rolling_window_means) {
      const hist_stat_annual_values = [...lodash_range(rolling_window_mean_years).map((x) => [1950 - (rolling_window_mean_years - x), Number.NaN, Number.NaN, Number.NaN, Number.NaN, Number.NaN, Number.NaN]), ...hist_mod_data.map((a) => [a[0], null, null, null, a[1], a[2], a[3]])];
      const scenario_stat_annual_values = [...hist_mod_data.slice(-rolling_window_mean_years - 1).map((a) => [a[0], a[1], a[2], a[3], a[1], a[2], a[3]]), ...proj_mod_data];
      scenario_stat_annual_values.pop() // remove 2100 from rolling means
      // compute rolling window means for proj
      for (const [scenario, scenario_col_offset] of [['rcp45', 0], ['rcp85', 3]]) {
        for (const [stat, col_offset] of [['mean', 1], ['min', 2], ['max', 3]]) {
          chart_data[scenario + '_rolling_' + stat] = compute_rolling_window_means(scenario_stat_annual_values, 0, scenario_col_offset + col_offset, 2005, 2099, rolling_window_mean_years).slice(rolling_window_mean_years);
          if (scenario === 'rcp85') {
            chart_data['hist_rolling_' + stat] = compute_rolling_window_means(hist_stat_annual_values, 0, scenario_col_offset + col_offset, 1950, 2004, rolling_window_mean_years).slice(rolling_window_mean_years);
          }
        }
      }
      rolling_means_traces = [
        {
          name: `Modeled maximum (historical ${rolling_window_mean_years}-yr rolling window mean)`,
          x: chart_data['hist_year'],
          y: chart_data['hist_rolling_max'],
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          line: {color: rgba(colors.hist.outerBand, 1), width: 1.3, opacity: 1},
          visible: !!show_historical_modeled ? true : 'legendonly',
        },
        {
          name: `Modeled mean (historical ${rolling_window_mean_years}-yr rolling window mean)`,
          x: chart_data['hist_year'],
          y: chart_data['hist_rolling_mean'],
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          line: {color: rgba(colors.hist.outerBand, 1), width: 1.3, opacity: 1},
          visible: !!show_historical_modeled ? true : 'legendonly',
        },

        {
          name: `Modeled minimum (historical ${rolling_window_mean_years}-yr rolling window mean)`,
          x: chart_data['hist_year'],
          y: chart_data['hist_rolling_min'],
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          line: {color: rgba(colors.hist.outerBand, 1), width: 1.3, opacity: 1},
          visible: !!show_historical_modeled ? true : 'legendonly',
        },
        {
          name: `Modeled maximum (RCP 4.5 ${rolling_window_mean_years}-yr rolling window mean)`,
          x: chart_data['proj_year'],
          y: chart_data['rcp45_rolling_max'],
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          line: {color: rgba(colors.rcp45.outerBand, 1), width: 1.3, opacity: 1},
          visible: !!show_projected_rcp45 ? true : 'legendonly',
        },
        {
          name: `Modeled minimum (RCP 4.5 ${rolling_window_mean_years}-yr rolling window mean)`,
          x: chart_data['proj_year'],
          y: chart_data['rcp45_rolling_min'],
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          line: {color: rgba(colors.rcp45.outerBand, 1), width: 1.3, opacity: 1},
          visible: !!show_projected_rcp45 ? true : 'legendonly',
        },
        {
          name: `Modeled mean (RCP 4.5 ${rolling_window_mean_years}-yr rolling window mean)`,
          x: chart_data['proj_year'],
          y: chart_data['rcp45_rolling_mean'],
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          line: {color: rgba(colors.rcp45.outerBand, 1), width: 1.3, opacity: 1},
          visible: !!show_projected_rcp45 ? true : 'legendonly',
        },
        {
          name: `Modeled maximum (RCP 8.5 ${rolling_window_mean_years}-yr rolling window mean)`,
          x: chart_data['proj_year'],
          y: chart_data['rcp85_rolling_max'],
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          line: {color: rgba(colors.rcp85.outerBand, 1), width: 1.3, opacity: 1},
          visible: !!show_projected_rcp85 ? true : 'legendonly',
        },
        {
          name: `Modeled minimum (RCP 8.5 ${rolling_window_mean_years}-yr rolling window mean)`,
          x: chart_data['proj_year'],
          y: chart_data['rcp85_rolling_min'],
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          line: {color: rgba(colors.rcp85.outerBand, 1), width: 1.3, opacity: 1},
          visible: !!show_projected_rcp85 ? true : 'legendonly',
        },
        {
          name: `Modeled mean (RCP 8.5 ${rolling_window_mean_years}-yr rolling window mean)`,
          x: chart_data['proj_year'],
          y: chart_data['rcp85_rolling_mean'],
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          line: {color: rgba(colors.rcp85.outerBand, 1), width: 1.3, opacity: 1},
          visible: !!show_projected_rcp85 ? true : 'legendonly',
        }
      ]
    }


    for (let i = 0; i < hist_mod_data.length; i++) {
      chart_data['hist_year'].push(hist_mod_data[i][0] + '-01-01');
      chart_data['hist_mean'].push(round(hist_mod_data[i][1], precision));
      chart_data['hist_min'].push(round(hist_mod_data[i][2], precision));
      chart_data['hist_max'].push(round(hist_mod_data[i][3], precision));
    }
    // repeat 2005 data point to fill gap
    proj_mod_data.unshift([
      hist_mod_data[hist_mod_data.length - 1][0],
      round(hist_mod_data[hist_mod_data.length - 1][1], precision),
      round(hist_mod_data[hist_mod_data.length - 1][2], precision),
      round(hist_mod_data[hist_mod_data.length - 1][3], precision),
      round(hist_mod_data[hist_mod_data.length - 1][1], precision),
      round(hist_mod_data[hist_mod_data.length - 1][2], precision),
      round(hist_mod_data[hist_mod_data.length - 1][3], precision),
    ]);
    for (let i = 0; i < proj_mod_data.length; i++) {
      chart_data['proj_year'].push(proj_mod_data[i][0] + '-01-01');
      chart_data['rcp45_mean'].push(round(proj_mod_data[i][1], precision));
      chart_data['rcp45_min'].push(round(proj_mod_data[i][2], precision));
      chart_data['rcp45_max'].push(round(proj_mod_data[i][3], precision));
      chart_data['rcp85_mean'].push(round(proj_mod_data[i][4], precision));
      chart_data['rcp85_min'].push(round(proj_mod_data[i][5], precision));
      chart_data['rcp85_max'].push(round(proj_mod_data[i][6], precision));
    }


    const [x_range_min, x_range_max, y_range_min, y_range_max] = this.parent._update_axes_ranges(
      min([min(chart_data['hist_year']), min(chart_data['proj_year'])]),
      max([max(chart_data['hist_year']), max(chart_data['proj_year'])]),
      min([min(chart_data['hist_min']), min(chart_data['rcp45_min']), min(chart_data['rcp85_min'])]),
      max([max(chart_data['hist_max']), max(chart_data['rcp45_max']), max(chart_data['rcp85_max'])]),
    );


    Plotly.react(
      this.element,
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
        },
        {
          x: chart_data['hist_year'],
          // y: chart_data['hist_max_diff'],
          y: chart_data['hist_max'],
          name: 'Modeled maximum (historical)',
          type: 'scatter',
          mode: 'lines',
          fill: 'tonexty',
          fillcolor: rgba(colors.hist.outerBand, colors.opacity.ann_hist_minmax),
          line: {
            color: rgba(colors.hist.outerBand, colors.opacity.ann_hist_minmax),
            width: 0,
            opacity: colors.opacity.ann_hist_minmax
          },
          legendgroup: 'hist',
          visible: !!show_historical_modeled ? true : 'legendonly',
        },
        // {
        //   x: chart_data['hist_year'],
        //   y: chart_data['hist_mean'],
        //   type: 'scatter',
        //   mode: 'lines',
        //   name: 'Historical Mean',
        //   line: {color: '#000000'},
        //   legendgroup: 'hist',
        //   visible: !!show_historical_modeled ? true : 'legendonly',
        // },

        {
          x: chart_data['proj_year'],
          y: chart_data['rcp45_min'],
          name: 'Modeled minimum (RCP 4.5 projection)',
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          fillcolor: rgba(colors.rcp45.outerBand, colors.opacity.ann_proj_minmax),
          line: {
            color: rgba(colors.rcp45.outerBand, colors.opacity.ann_proj_minmax),
            width: 0,
            opacity: colors.opacity.ann_proj_minmax
          },
          legendgroup: 'rcp45',
          visible: show_projected_rcp45 ? true : 'legendonly',
        },
        {
          x: chart_data['proj_year'],
          y: chart_data['rcp45_max'],
          name: 'Modeled maximum (RCP 4.5 projection)',
          fill: 'tonexty',
          type: 'scatter',
          mode: 'lines',
          fillcolor: rgba(colors.rcp45.outerBand, colors.opacity.ann_proj_minmax),
          line: {
            color: rgba(colors.rcp45.outerBand, colors.opacity.ann_proj_minmax),
            width: 0,
            opacity: colors.opacity.ann_proj_minmax
          },
          legendgroup: 'rcp45',
          visible: show_projected_rcp45 ? true : 'legendonly',
        },
        {
          x: chart_data['proj_year'],
          y: chart_data['rcp85_min'],
          name: 'Modeled minimum (RCP 8.5 projection)',
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          fillcolor: rgba(colors.rcp85.outerBand, colors.opacity.ann_proj_minmax),
          line: {
            color: rgba(colors.rcp85.outerBand, colors.opacity.ann_proj_minmax),
            width: 0,
            opacity: colors.opacity.ann_proj_minmax
          },
          legendgroup: 'rcp85',
          visible: show_projected_rcp85 ? true : 'legendonly',
          showlegend: false,
        },
        {
          x: chart_data['proj_year'],
          y: chart_data['rcp85_max'],
          name: 'Modeled maximum (RCP 8.5 projection)',
          fill: 'tonexty',
          type: 'scatter',
          mode: 'lines',
          fillcolor: rgba(colors.rcp85.outerBand, colors.opacity.ann_proj_minmax),
          line: {
            color: rgba(colors.rcp85.outerBand, colors.opacity.ann_proj_minmax),
            width: 0,
            opacity: colors.opacity.ann_proj_minmax
          },
          legendgroup: 'rcp85',
          visible: show_projected_rcp85 ? true : 'legendonly',
        },
        {
          x: chart_data['proj_year'],
          y: chart_data['rcp45_mean'],
          type: 'scatter',
          mode: 'lines',
          name: 'RCP 4.5 projections (mean)',
          line: {color: rgba(colors.rcp45.line, colors.opacity.proj_line)},
          visible: show_projected_rcp45 ? true : 'legendonly',
          legendgroup: 'rcp45',
          yaxis: 'y3',
        },
        {
          x: chart_data['proj_year'],
          y: chart_data['rcp85_mean'],
          type: 'scatter',
          mode: 'lines',
          name: 'Modeled mean (RCP 8.5 projections)',
          visible: show_projected_rcp85 ? true : 'legendonly',
          line: {color: rgba(colors.rcp85.line, colors.opacity.proj_line)},
          legendgroup: 'rcp85',
          yaxis: 'y3',

        },
        ...decadal_means_traces,
        ...rolling_means_traces
      ],
      // layout
      Object.assign({},
        plotly_layout_defaults,
        {
          showlegend: show_legend,
          hoverlabel: {
            namelength: -1
          },
          xaxis: this.parent._get_x_axis_layout(x_range_min, x_range_max, true),
          yaxis: this.parent._get_y_axis_layout(y_range_min, y_range_max, variable_config),
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
          }
        }
      ),
      // options
      this.parent._get_plotly_options(),
    );

    this._when_chart = new Promise((resolve) => {
      this.element.once('plotly_afterplot', (gd) => {
        resolve(gd)
      });

      this._hover_handler = partial(this._request_show_popover.bind(this), false, chart_data, hover_decadal_means, show_decadal_means, colors, precision, show_rolling_window_means, rolling_window_mean_years, variable_config, unitsystem);
      this.element.on('plotly_hover', this._hover_handler);
      this._click_handler = partial(this._request_show_popover.bind(this), true, chart_data, hover_decadal_means, show_decadal_means, colors, precision, show_rolling_window_means, rolling_window_mean_years, variable_config, unitsystem);
      this.element.on('plotly_click', this._click_handler);
    });
    await this._when_chart
    this.parent._hide_spinner()


  }


  async _request_show_popover(pinned, chart_data, hover_decadal_means, show_decadal_means, colors, precision, show_rolling_window_means, rolling_window_mean_years, variable_config, unitsystem, event_data) {
    try {
      const year = parseInt(event_data.points[0].x.slice(0, 4));
      let proj_year_idx = year - 2005;
      if (proj_year_idx < 0) {
        proj_year_idx = 0;
      }
      if (proj_year_idx > chart_data['proj_year'].length) {
        proj_year_idx = chart_data['proj_year'].length - 1;
      }
      let decadal_content = '';
      let rolling_content = '';
      let annual_content = '';
      const hist_year_idx = year - 1950;
      if (hover_decadal_means || show_decadal_means) {
        const year_decade = Math.trunc(year / 10) * 10;
        decadal_content = `
        <div  class="label1">${year_decade}s projection</div>
         ${year >= 2000 ? `
           <div class="bg-rcp85 label2" >Higher Emissions</div>
          <div class="bg-rcp85" style="grid-column: 1; padding-bottom: 0.25rem;">
            <div title="${year_decade}s higher emissions mean" class="legend-line" style="font-size: 1.1rem; border-left-color:${rgba(colors.rcp85.line, colors.opacity.proj_line)}; ">${round(chart_data['rcp85_decadal_mean'][proj_year_idx], precision)}</div>
          </div>
          <div class="bg-rcp85" style=" grid-column: 2; padding-bottom: 0.25rem;">
            <div title="${year_decade}s higher emissions range"  class="legend-area" style=" font-size: 0.8rem; border-left-color: ${rgba(colors.rcp85.outerBand, colors.opacity.ann_proj_minmax)}; "><span>${round(chart_data['rcp85_decadal_min'][proj_year_idx], precision)}</span><span>&mdash;</span><span>${round(chart_data['rcp85_decadal_max'][proj_year_idx], precision)}</span></div>
          </div>
         
          <div class="bg-rcp45 label2" >Lower Emissions</div>
          <div class="bg-rcp45"  style="grid-column: 1;  padding-bottom: 0.25rem;">
            <div title="${year_decade}s lower emissions mean" class="legend-line" style="font-size: 1.1rem; border-left-color:${rgba(colors.rcp45.line, colors.opacity.proj_line)};  ">${round(chart_data['rcp45_decadal_mean'][proj_year_idx], precision)}</div>
          </div>
          <div class="bg-rcp45"  style="grid-column: 2;  padding-bottom: 0.25rem;">
            <div title="${year_decade}s lower emissions range" class="legend-area" style=" font-size: 0.8rem;  border-left-color: ${rgba(colors.rcp45.outerBand, colors.opacity.ann_proj_minmax)}; ">${round(chart_data['rcp45_decadal_min'][proj_year_idx], precision)}</span><span>&mdash;</span><span>${round(chart_data['rcp45_decadal_max'][proj_year_idx], precision)}</div>
          </div>
        ` : `
        <div  class="label2 bg-hist">Historic range</div>
        <div style="grid-column: 1 / span 2; background-color: ${rgba(colors.hist.outerBand, 0.1)}; padding-bottom: 0.25rem; ">
          <div title="${year_decade}s historic range" class="legend-area" style="font-size: 0.8rem;  border-left-color: ${rgba(colors.hist.outerBand, colors.opacity.ann_proj_minmax)}; "><span>${round(chart_data['hist_decadal_min'][hist_year_idx], precision)}</span><span>&mdash;</span><span>${round(chart_data['hist_decadal_max'][hist_year_idx], precision)}</span></div>
        </div>
        `}
        `;
      }
      if (show_rolling_window_means) {
        const year_start = year - rolling_window_mean_years;
        if (year_start - 1950 > 0) {
          rolling_content = `
        <div  class="label1">${year_start}&mdash;${year} projection</div>
         ${year >= 2000 ? `
           <div class="bg-rcp85 label2" >Higher Emissions</div>
          <div class="bg-rcp85" style=" grid-column: 1; padding-bottom: 0.25rem;">
            <div title="${year_start}&mdash;${year} higher emissions mean" class="legend-line" style="font-size: 1.1rem; border-left-color:${rgba(colors.rcp85.line, colors.opacity.proj_line)}; ">${round(chart_data['rcp85_rolling_mean'][proj_year_idx], precision)}</div>
          </div>
          <div class="bg-rcp85" style=" grid-column: 2; padding-bottom: 0.25rem;">
            <div title="${year_start}&mdash;${year} higher emissions range" class="legend-area" style=" font-size: 0.8rem; border-left-color: ${rgba(colors.rcp85.outerBand, colors.opacity.ann_proj_minmax)}; "><span>${round(chart_data['rcp85_rolling_min'][proj_year_idx], precision)}</span><span>&mdash;</span><span>${round(chart_data['rcp85_rolling_max'][proj_year_idx], precision)}</span></div>
          </div>
         
          <div class="bg-rcp45 label2" >Lower Emissions</div>
          <div class="bg-rcp45"  style="grid-column: 1;  padding-bottom: 0.25rem;">
            <div title="${year_start}&mdash;${year} lower emissions mean" class="legend-line" style="font-size: 1.1rem; border-left-color:${rgba(colors.rcp45.line, colors.opacity.proj_line)};  ">${round(chart_data['rcp45_rolling_mean'][proj_year_idx], precision)}</div>
          </div>
          <div class="bg-rcp45"  style="grid-column: 2;  padding-bottom: 0.25rem;">
            <div title="${year_start}&mdash;${year} lower emissions range" class="legend-area" style=" font-size: 0.8rem;  border-left-color: ${rgba(colors.rcp45.outerBand, colors.opacity.ann_proj_minmax)}; ">${round(chart_data['rcp45_rolling_min'][proj_year_idx], precision)}</span><span>&mdash;</span><span>${round(chart_data['rcp45_rolling_max'][proj_year_idx], precision)}</div>
          </div>
        ` : `
        <div  class="label2 bg-hist" >Historic range</div>
        <div style="grid-column: 1 / span 2; background-color: ${rgba(colors.hist.outerBand, 0.1)}; padding-bottom: 0.25rem; ">
          <div title="${year_start}&mdash;${year} historic range" class="legend-area" style="font-size: 0.8rem;  border-left-color: ${rgba(colors.hist.outerBand, colors.opacity.ann_proj_minmax)}; "><span>${round(chart_data['hist_rolling_min'][hist_year_idx], precision)}</span><span>&mdash;</span><span>${round(chart_data['hist_rolling_max'][hist_year_idx], precision)}</span></div>
        </div>
        `}
        `;
        }
      }
      if (!hover_decadal_means) {
        annual_content = `
        <div class="label1">${year} projection</div>
         ${year >= 2000 ? `
           <div class="bg-rcp85 label2" >Higher Emissions</div>
          <div class="bg-rcp85" style=" grid-column: 1; padding-bottom: 0.25rem;">
            <div title="${year} higher emissions mean" class="legend-line" style="font-size: 1.1rem; border-left-color:${rgba(colors.rcp85.line, colors.opacity.proj_line)}; ">${round(chart_data['rcp85_mean'][proj_year_idx], precision)}</div>
          </div>
          <div  class="bg-rcp85" style=" grid-column: 2; padding-bottom: 0.25rem;">
            <div title="${year} higher emissions range" class="legend-area" style=" font-size: 0.8rem; border-left-color: ${rgba(colors.rcp85.outerBand, colors.opacity.ann_proj_minmax)}; "><span>${round(chart_data['rcp85_min'][proj_year_idx], precision)}</span><span>&mdash;</span><span>${round(chart_data['rcp85_max'][proj_year_idx], precision)}</span></div>
          </div>
         
          <div class="bg-rcp45 label2" >Lower Emissions</div>
          <div class="bg-rcp45" style="grid-column: 1;  padding-bottom: 0.25rem;">
            <div title="${year} lower emissions mean"  class="legend-line"  style="font-size: 1.1rem; border-left-color:${rgba(colors.rcp45.line, colors.opacity.proj_line)};  ">${round(chart_data['rcp45_mean'][proj_year_idx], precision)}</div>
          </div>
          <div class="bg-rcp45"  style="grid-column: 2;  padding-bottom: 0.25rem;">
            <div title="${year} lower emissions range" class="legend-area" style=" font-size: 0.8rem;  border-left-color: ${rgba(colors.rcp45.outerBand, colors.opacity.ann_proj_minmax)}; ">${round(chart_data['rcp45_min'][proj_year_idx], precision)}</span><span>&mdash;</span><span>${round(chart_data['rcp45_max'][proj_year_idx], precision)}</div>
          </div>
        ` : `
        <div class="label2 bg-hist">Historic range</div>
        <div style="grid-column: 1 / span 2; background-color: ${rgba(colors.hist.outerBand, 0.1)}; padding-bottom: 0.25rem; ">
          <div title="${year} historic range" class="legend-area" style="font-size: 0.8rem;  border-left-color: ${rgba(colors.hist.outerBand, colors.opacity.ann_proj_minmax)}; "><span>${round(chart_data['hist_min'][hist_year_idx], precision)}</span><span>&mdash;</span><span>${round(chart_data['hist_max'][hist_year_idx], precision)}</span></div>
        </div>
        `}
        `
      }

      return this.parent._request_show_popover('xaxes' in event_data ? event_data.xaxes[0].l2p(event_data.xvals[0]) : null, null, `
        <div style="display: grid; grid-template-columns: auto auto;">
         ${decadal_content}
        ${rolling_content}
        ${annual_content}
        `, pinned, variable_config.ytitles['annual'][unitsystem]);
    } catch (e) {
      console.error(e)
      return this.parent.request_hide_popover(pinned);
    }
  }

  async request_style_update() {
    const {
      show_decadal_means,
      show_historical_modeled,
      show_projected_rcp45,
      show_projected_rcp85,
      show_rolling_window_means,
    } = this.parent.options;

    let visible_traces = [
      !!show_historical_modeled ? true : 'legendonly',
      !!show_historical_modeled ? true : 'legendonly',
      // !!show_historical_modeled ? true : 'legendonly',
      !!show_projected_rcp45 ? true : 'legendonly',
      !!show_projected_rcp45 ? true : 'legendonly',
      !!show_projected_rcp85 ? true : 'legendonly',
      !!show_projected_rcp85 ? true : 'legendonly',
      !!show_projected_rcp45 ? true : 'legendonly',
      !!show_projected_rcp85 ? true : 'legendonly',
    ];
    if (show_decadal_means) {
      visible_traces.push(
        !!show_historical_modeled ? true : 'legendonly',
        !!show_historical_modeled ? true : 'legendonly',
        !!show_historical_modeled ? true : 'legendonly',
        !!show_projected_rcp45 ? true : 'legendonly',
        !!show_projected_rcp45 ? true : 'legendonly',
        !!show_projected_rcp45 ? true : 'legendonly',
        !!show_projected_rcp85 ? true : 'legendonly',
        !!show_projected_rcp85 ? true : 'legendonly',
        !!show_projected_rcp85 ? true : 'legendonly',
      )
    }
    // cleanup hidden decadal traces
    else if (!!this.element && !!this.element.data && this.element.data.find((trace) => trace['name'].includes('decadal'))) {
      visible_traces.push(false, false, false, false, false, false, false, false, false);
    }
    if (show_rolling_window_means) {
      visible_traces.push(
        !!show_historical_modeled ? true : 'legendonly',
        !!show_historical_modeled ? true : 'legendonly',
        !!show_historical_modeled ? true : 'legendonly',
        !!show_projected_rcp45 ? true : 'legendonly',
        !!show_projected_rcp45 ? true : 'legendonly',
        !!show_projected_rcp45 ? true : 'legendonly',
        !!show_projected_rcp85 ? true : 'legendonly',
        !!show_projected_rcp85 ? true : 'legendonly',
        !!show_projected_rcp85 ? true : 'legendonly',
      )
    }
    // cleanup hidden rolling window traces
    else if (!!this.element && !!this.element.data && this.element.data.find((trace) => trace['name'].includes('rolling'))) {
      visible_traces.push(false, false, false, false, false, false, false, false, false);
    }
    Plotly.restyle(this.element, {
      visible: visible_traces
    });
  }

  /**
   * Options which force re-evaluation of which traces are visible within the current view.
   * @return {string[]}
   * @private
   */
  get style_option_names() {
    return [
      'show_projected_rcp45',
      'show_projected_rcp85',
      'show_historical_modeled',
      'show_decadal_means',
      'show_rolling_window_means',
    ]
  }

  async request_downloads() {
    const {get_area_label, frequency, variable} = this.parent.options;
    return [
      {
        label: 'Historical Modeled Data',
        icon: 'area-chart',
        attribution: 'ACIS: LOCA (CMIP 5)',
        when_data: this._download_callbacks['hist_mod'],
        filename: [
          get_area_label.bind(this)(),
          frequency,
          "hist_mod",
          variable
        ].join('-').replace(/ /g, '_') + '.csv'
      },
      {
        label: 'Historical Modeled Data',
        icon: 'area-chart',
        attribution: 'ACIS: LOCA (CMIP 5)',
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
        attribution: 'ACIS: LOCA (CMIP 5)',
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
        attribution: 'ACIS: Livneh & LOCA (CMIP 5)',
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


  destroy() {
    super.destroy();
    try {
      //cleanup style
      const _style_idx = this.parent._styles.indexOf(this._style);
      if (_style_idx > -1) {
        this.parent._styles.splice(_style_idx, 1);
      }
      this.parent._update_styles();

      // remove event handlers
      if (this.element && this.element.removeListener) {
        this.element.removeListener('plotly_hover', this._hover_handler);
        this.element.removeListener('plotly_click', this._click_handler);
      }
    } catch {
      // do nothing
    }
  }
}