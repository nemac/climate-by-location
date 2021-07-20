import View from "./view_base.js";
import {max, mean, min, partial, range as lodash_range, round} from "../../node_modules/lodash-es/lodash.js";
import {compute_decadal_means, compute_rolling_window_means, format_export_data, rgba} from "../utils.js";
import {get_historical_annual_loca_model_data, get_historical_observed_livneh_data, get_projected_loca_model_data} from "../io.js";
import {data_api_url} from "../constants.js";


/* globals jQuery, window, Plotly, fetch, jStat */
// noinspection DuplicatedCode
/**
 * Creates/updates an annual graph (with a focus on decadal data) for the CONUS.
 * @return {Promise<void>}
 * @private
 */
export default class ConusDecadeView extends View {


  constructor(parent, element) {
    super(parent, element);
    this._style = '#' + this.parent.element.id + ` .legendtitletext{ display: none; }`
    parent._styles.push(this._style)
    this.parent._update_styles()
  }

  async request_update() {
    const {
      colors,
      hover_decadal_means,
      plotly_layout_defaults,
      rolling_window_mean_years,
      show_decadal_means,
      show_historical_modeled,
      show_historical_observed,
      show_legend,
      show_projected_rcp45,
      show_projected_rcp85,
      show_rolling_window_means,
    } = this.parent.options;
    const area = this.parent.get_area();
    const variable_config = this.parent.get_variable_config();
    const _options = Object.assign({area, variable_config}, this.parent.options)
    const [hist_obs_data, hist_mod_data, proj_mod_data] = await Promise.all([
      get_historical_observed_livneh_data(_options),
      get_historical_annual_loca_model_data(_options),
      get_projected_loca_model_data(_options)
    ])
    const precision = variable_config.rounding_precision || 1;
    const d3_precision = precision > 0 ? precision : 0; // d3 format can't round to 10s, 100s, etc
    this._download_callbacks = {
      hist_obs: async () => format_export_data(['year', variable_config.id], hist_obs_data, null, precision),
      hist_mod: async () => format_export_data(['year', 'weighted_mean', 'min', 'max', 'NOTE: This file contains annual projection values produced by global climate models. Decadal averages of these values (as shown in the Climate Explorer) are a more appropriate temporal scale for using projections.'], hist_mod_data, null, precision),
      proj_mod: async () => format_export_data(['year', 'rcp45_weighted_mean', 'rcp45_min', 'rcp45_max', 'rcp85_weighted_mean', 'rcp85_min', 'rcp85_max','NOTE: This file contains annual projection values produced by global climate models. Decadal averages of these values (as shown in the Climate Explorer) are a more appropriate temporal scale for using projections.'], proj_mod_data, null, precision)
    };

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
    let hist_decadal_data = [];
    let rcp45_decadal_data = [];
    let rcp85_decadal_data = [];

    if (show_decadal_means || hover_decadal_means) {
      const hist_stat_annual_values = [...hist_mod_data.map((a) => [a[0], null, null, null, a[1], a[2], a[3]]), ...proj_mod_data.slice(0, 4)];
      const scenario_stat_annual_values = [...hist_mod_data.slice(-6).map((a) => [a[0], a[1], a[2], a[3], a[1], a[2], a[3]]), ...proj_mod_data];
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
      if (hover_decadal_means) {
        hist_decadal_data = lodash_range(hist_mod_data.length).map((i) => [
          chart_data['hist_year_decade'][i],
          chart_data['hist_decadal_mean'][i],
          chart_data['hist_decadal_min'][i],
          chart_data['hist_decadal_max'][i],
        ]);

        rcp45_decadal_data = lodash_range(proj_mod_data.length).map((i) => [
          chart_data['proj_year_decade'][i],
          chart_data['rcp45_decadal_mean'][i],
          chart_data['rcp45_decadal_min'][i],
          chart_data['rcp45_decadal_max'][i],
        ]);
        rcp45_decadal_data.unshift(hist_decadal_data.slice(-1)[0]); // repeat 2005
        rcp85_decadal_data = lodash_range(proj_mod_data.length).map((i) => [
          chart_data['proj_year_decade'][i],
          chart_data['rcp85_decadal_mean'][i],
          chart_data['rcp85_decadal_min'][i],
          chart_data['rcp85_decadal_max'][i],
        ]);
        rcp85_decadal_data.unshift(hist_decadal_data.slice(-1)[0]); // repeat 2005
      }
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
            customdata: null,
            hovertemplate: `%{y:.${d3_precision}f}`
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
            customdata: null,
            hovertemplate: `%{y:.${d3_precision}f}`
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
            customdata: null,
            hovertemplate: `%{y:.${d3_precision}f}`
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
            customdata: null,
            hovertemplate: `%{y:.${d3_precision}f}`
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
            customdata: null,
            hovertemplate: `%{y:.${d3_precision}f}`
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
            customdata: null,
            hovertemplate: `%{y:.${d3_precision}f}`
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
            customdata: null,
            hovertemplate: `%{y:.${d3_precision}f}`
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
            customdata: null,
            hovertemplate: `%{y:.${d3_precision}f}`
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
            customdata: null,
            hovertemplate: `%{y:.${d3_precision}f}`
          }
        ]
      }
      chart_data['proj_year_decade'].unshift(2005) // repeat 2005
    }
    let rolling_means_traces = [];
    if (show_rolling_window_means) {
      const hist_stat_annual_values = [...lodash_range(rolling_window_mean_years).map((x) => [1950 - (rolling_window_mean_years - x), Number.NaN, Number.NaN, Number.NaN, Number.NaN, Number.NaN, Number.NaN]), ...hist_mod_data.map((a) => [a[0], null, null, null, a[1], a[2], a[3]])];
      const scenario_stat_annual_values = [...hist_mod_data.slice(-rolling_window_mean_years - 1).map((a) => [a[0], a[1], a[2], a[3], a[1], a[2], a[3]]), ...proj_mod_data];
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
          customdata: null,
          hovertemplate: `%{y:.${d3_precision}f}`
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
          customdata: null,
          hovertemplate: `%{y:.${d3_precision}f}`
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
          customdata: null,
          hovertemplate: `%{y:.${d3_precision}f}`
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
          customdata: null,
          hovertemplate: `%{y:.${d3_precision}f}`
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
          customdata: null,
          hovertemplate: `%{y:.${d3_precision}f}`
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
          customdata: null,
          hovertemplate: `%{y:.${d3_precision}f}`
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
          customdata: null,
          hovertemplate: `%{y:.${d3_precision}f}`
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
          customdata: null,
          hovertemplate: `%{y:.${d3_precision}f}`
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
          customdata: null,
          hovertemplate: `%{y:.${d3_precision}f}`
        }
      ]
    }


    for (let i = 0; i < hist_obs_data.length; i++) {
      chart_data['hist_obs_year'].push(hist_obs_data[i][0]);
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
    proj_mod_data.unshift([hist_mod_data[hist_mod_data.length - 1][0],
      round(hist_mod_data[hist_mod_data.length - 1][1], precision),
      round(hist_mod_data[hist_mod_data.length - 1][2], precision),
      round(hist_mod_data[hist_mod_data.length - 1][3], precision),
      round(hist_mod_data[hist_mod_data.length - 1][1], precision),
      round(hist_mod_data[hist_mod_data.length - 1][2], precision),
      round(hist_mod_data[hist_mod_data.length - 1][3], precision),
    ]);

    for (let i = 0; i < proj_mod_data.length; i++) {
      chart_data['proj_year'].push(proj_mod_data[i][0]);
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


    if (!(round(y_range_min, 1) === 0 && round(hist_obs_bar_base, 1) === 0)) {
      this._annotations = [
        {
          visible: show_historical_observed,
          x: 1,
          y: hist_obs_bar_base,
          xref: 'paper',
          yref: 'y',
          xanchor: 'right',
          yanchor: (hist_obs_bar_base - ((y_range_max - y_range_min) * 0.1) - y_range_min) > 0 ? 'top' : 'bottom',
          text: '1961-1990 observed average',
          showarrow: false,
          font: {color: colors.hist.bar}
        }
      ];
    } else {
      this._annotations = [];
    }

    Plotly.react(
      this.element,
      [
        {
          name: '1961-1990 observed average',
          x: [1950, 2099],
          y: [0, 0],
          yaxis: 'y4',
          type: 'scatter',
          mode: 'lines',
          fill: 'none',
          connectgaps: false,
          line: {
            color: rgba(colors.hist.bar, colors.opacity.hist_obs),
            width: 1,
            opacity: 1,
            dash: 'dot'
          },
          visible: !!show_historical_observed ? true : 'legendonly',
          hoverinfo: 'skip'
        },
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
          hoverinfo: 'skip'
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
          hoverlabel: {namelength: 0},
          // hoverinfo: 'text',
          customdata: hover_decadal_means ? hist_decadal_data : hist_mod_data,
          hovertemplate: `%{customdata[0]}${hover_decadal_means ? 's' : ''} modeled range: %{customdata[2]:.${d3_precision}f}&#8211;%{customdata[3]:.${d3_precision}f}`
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
          hoverinfo: 'skip'
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
          hoverlabel: {namelength: 0},
          customdata: hover_decadal_means ? rcp45_decadal_data : proj_mod_data,
          hovertemplate: `range: %{customdata[2]:.${d3_precision}f}&#8211;%{customdata[3]:.${d3_precision}f}`
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
          hoverinfo: 'skip'
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
          hoverlabel: {namelength: 0},
          customdata: hover_decadal_means ? rcp85_decadal_data : proj_mod_data,
          hovertemplate: `range: %{customdata[2]:.${d3_precision}f}&#8211;%{customdata[3]:.${d3_precision}f}`
        },
        {
          x: chart_data['hist_obs_year'],
          y: chart_data['hist_obs_diff'],
          type: 'bar',
          yaxis: 'y2',
          base: hist_obs_bar_base,
          name: 'Historical Observed',
          line: {color: colors.hist.line, width: 0.5},
          marker: {color: rgba(colors.hist.bar, colors.opacity.hist_obs)},
          legendgroup: 'histobs',
          visible: !!show_historical_observed ? true : 'legendonly',
          customdata: null,
          hovertemplate: `%{x} observed: <b>%{y:.${d3_precision}f}</b><br>1961-1990 observed average: <b>${round(hist_obs_bar_base, d3_precision)}</b>`,
          hoverlabel: {namelength: 0},
        },
        {
          x: chart_data['proj_year'],
          y: chart_data['rcp45_mean'],
          type: 'scatter',
          mode: 'lines',
          name: 'RCP 4.5 projections (weighted mean)',
          line: {color: rgba(colors.rcp45.line, colors.opacity.proj_line)},
          visible: show_projected_rcp45 ? true : 'legendonly',
          legendgroup: 'rcp45',
          yaxis: 'y3',
          hoverlabel: {namelength: 0},
          customdata: hover_decadal_means ? rcp45_decadal_data : proj_mod_data,
          hovertemplate: `%{customdata[0]}${hover_decadal_means ? 's' : ''} lower emissions average projection: <b>%{customdata[1]:.${d3_precision}f}</b>`
        },
        {
          x: chart_data['proj_year'],
          y: chart_data['rcp85_mean'],
          type: 'scatter',
          mode: 'lines',
          name: 'Modeled mean (RCP 8.5 projections, weighted)',
          visible: show_projected_rcp85 ? true : 'legendonly',
          line: {color: rgba(colors.rcp85.line, colors.opacity.proj_line)},
          legendgroup: 'rcp85',
          yaxis: 'y3',
          hoverlabel: {namelength: 0},

          customdata: hover_decadal_means ? rcp85_decadal_data : proj_mod_data,
          hovertemplate: `%{customdata[0]}${hover_decadal_means ? 's' : ''} higher emissions average projection: <b>%{customdata[1]:.${d3_precision}f}</b>`

        },
        ...decadal_means_traces,
        ...rolling_means_traces
      ],
      // layout
      Object.assign({}, plotly_layout_defaults,
        {
          margin: Object.assign({}, plotly_layout_defaults.margin, {r: 34}),
          showlegend: show_legend,
          hoverlabel: {
            namelength: -1
          },
          xaxis: this.parent._get_x_axis_layout(x_range_min, x_range_max),

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
          },
          yaxis4: {
            type: 'linear',
            range: [y_range_min - hist_obs_bar_base, y_range_max - hist_obs_bar_base],
            overlaying: 'y',
            autorange: false,
            scaleratio: 1,
            showline: true,
            // linecolor: '#494949',
            linecolor: 'rgb(0,0,0)',
            linewidth: 1,
            showgrid: false,
            zeroline: false,
            side: 'right',
            ticks: 'outside',
            tickcolor: 'rgb(0,0,0)',
            tickfont: {
              size: 9,
              family: 'roboto, monospace',
              color: '#494949'
            },
            nticks: 12,
            tickangle: 0,
            title: {
              text: 'Difference from Observed Average',
              font: {
                family: 'roboto, monospace',
                size: 10,
                color: '#494949'
              }
            }
          },
          annotations: this._annotations || []
        }),
      // options
      this.parent._get_plotly_options()
    );

    this._when_chart = new Promise((resolve) => {
      this.element.once('plotly_afterplot', (gd) => {
        resolve(gd)
      })
      if (this._relayout_handler && this.element && this.element.removeListener) {
        // this.element.removeEventListener('plotly_relayout',this._relayout_handler);
        this.element.removeListener('plotly_relayout', this._relayout_handler);
      }

      this._relayout_handler = partial(this.sync_y_axis_ranges.bind(this), hist_obs_bar_base, [y_range_min, y_range_max]);
      this.element.on('plotly_relayout', this._relayout_handler)

    });
    await this._when_chart
    this.parent._hide_spinner()


  }

  sync_y_axis_ranges(offset, y_range_default, eventdata) {
    // keep secondary y-axis in sync
    const y_min_range = eventdata['yaxis.range[0]'];
    const y_max_range = eventdata['yaxis.range[1]'];
    const y4_min_range = eventdata['yaxis4.range[0]'];
    const y4_max_range = eventdata['yaxis4.range[1]'];

    console.log(eventdata);

    if (Number.isFinite(y_min_range) && Number.isFinite(y_max_range)) {
      if (y_min_range - offset !== y4_min_range || y_max_range - offset !== y4_max_range) {
        Plotly.relayout(this.element, {
          'yaxis4.range': [y_min_range - offset, y_max_range - offset]
        });
      }
    } else if (Number.isFinite(y4_min_range) && Number.isFinite(y4_max_range)) {
      if (y_min_range - offset !== y4_min_range || y_max_range - offset !== y4_max_range) {
        Plotly.relayout(this.element, {
          'yaxis.range': [y4_min_range + offset, y4_max_range + offset]
        });
      }
    } else if (eventdata['yaxis.autorange'] || eventdata['yaxis4.autorange']) {

      //yaxis4.range throws an error in console when window is resized in the Y direction.

      Plotly.relayout(this.element, {
        'yaxis.range': [y_range_default[0], y_range_default[1]],
        'yaxis4.range': [y_range_default[0] - offset, y_range_default[1] - offset]
      });
    }

  }

  async request_style_update() {
    const {
      show_decadal_means,
      show_historical_modeled,
      show_historical_observed,
      show_projected_rcp45,
      show_projected_rcp85,
      show_rolling_window_means,
    } = this.parent.options;
    let visible_traces = [
      !!show_historical_observed ? true : 'legendonly',
      !!show_historical_modeled ? true : 'legendonly',
      !!show_historical_modeled ? true : 'legendonly',
      // !!show_historical_modeled ? true : 'legendonly',
      !!show_projected_rcp45 ? true : 'legendonly',
      !!show_projected_rcp45 ? true : 'legendonly',
      !!show_projected_rcp85 ? true : 'legendonly',
      !!show_projected_rcp85 ? true : 'legendonly',
      !!show_historical_observed ? true : 'legendonly',
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
    if (this._annotations && this._annotations.length > 0) {
      this._annotations[0].visible = show_historical_observed
    }
    Plotly.update(this.element, {
        visible: visible_traces
      },
      {annotations: this._annotations || []}
    )
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
      'show_historical_observed',
      'show_historical_modeled',
      'show_decadal_means',
      'show_rolling_window_means',
    ]
  }


  async request_downloads() {
    const {get_area_label, frequency, variable} = this.parent.options;
    return [
      {
        label: 'Observed Data',
        icon: 'bar-chart',
        attribution: 'ACIS: livneh',
        when_data: this._download_callbacks['hist_obs'],
        filename: [
          get_area_label.bind(this)(),
          frequency,
          "hist_obs",
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

      // remove y-axis sync event handler
      if (this._relayout_handler && this.element && this.element.removeListener) {
        this.element.removeListener('plotly_relayout', this._relayout_handler);
      }
    } catch {
      // do nothing
    }
  }
}
