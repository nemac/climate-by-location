import View from "./view_base.js";
import {filter, map, max, mean, min, range as lodash_range, round} from "../../node_modules/lodash-es/lodash.js";
import {compute_decadal_means, compute_rolling_window_means,  format_export_data, rgba} from "../utils.js";
import {get_historical_annual_loca_model_data, get_historical_observed_livneh_data, get_projected_loca_model_data} from "../io.js";
import {data_api_url} from "../constants.js";
/* globals jQuery, window, Plotly,jStat, fetch */

// noinspection DuplicatedCode
export default class ConusYearView extends View {
  /**
   * Creates/updates an annual graph for the CONUS.
   * @return {Promise<void>}
   * @private
   */
  async request_update() {
    const {
      colors, show_decadal_means, hover_decadal_means, show_projected_rcp85, show_projected_rcp45, show_historical_modeled,
      show_rolling_window_means, show_historical_observed, rolling_window_mean_years, plotly_layout_defaults, show_legend, variable,
      data_api_url} = this.parent.options;

    const _options = Object.assign({area: this.parent.get_area(), variable_config: this.parent.get_variable_config()}, this.parent.options)
    const [hist_obs_data, hist_mod_data, proj_mod_data] = await Promise.all([
      get_historical_observed_livneh_data(_options),
      get_historical_annual_loca_model_data(_options),
      get_projected_loca_model_data(_options)
    ])

    // prepare a function to compute significance, but don't do it yet.

    this._download_callbacks = {
      hist_obs: async () => format_export_data(['year', variable], hist_obs_data),
      hist_mod: async () => format_export_data(['year', 'weighted_mean', 'min', 'max'], hist_mod_data),
      proj_mod: async () => format_export_data(['year', 'rcp45_weighted_mean', 'rcp45_min', 'rcp45_max', 'rcp85_weighted_mean', 'rcp85_min', 'rcp85_max'], proj_mod_data),
      departure_significance: async () => this.get_departure_significance_stats(hist_mod_data, proj_mod_data)
    }

    const hist_mod_base_means = [];

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
    const precision = 1;


    let decadal_means_traces = [];
    let hist_decadal_data = [];
    let rcp45_decadal_data = [];
    let rcp85_decadal_data = [];
    if (show_decadal_means || hover_decadal_means) {
      const hist_stat_annual_values = [...hist_mod_data.map((a) => [a[0], null, null, null, a[1], a[2], a[3]]), ...proj_mod_data.slice(0, 4)];
      const scenario_stat_annual_values = [...hist_mod_data.slice(-6).map((a) => [a[0], a[1], a[2], a[3], a[1], a[2], a[3]]), ...proj_mod_data];
      for (let i = 0; i < (proj_mod_data.length); i++) {
        chart_data['proj_year_decade'][i] = Math.trunc(proj_mod_data[i][0] / 10) * 10
      }
      for (let i = 0; i < (hist_mod_data.length); i++) {
        chart_data['hist_year_decade'][i] = Math.trunc(hist_mod_data[i][0] / 10) * 10
      }
      // compute decadal averages for proj
      for (const [scenario, scenario_col_offset] of [['rcp45', 0], ['rcp85', 3]]) {
        for (const [stat, col_offset] of [['mean', 1], ['min', 2], ['max', 3]]) {
          const decadal_means = compute_decadal_means(scenario_stat_annual_values, 0, scenario_col_offset + col_offset, 2005, 2099);
          for (let i = 0; i < (proj_mod_data.length + 1); i++) {
            chart_data[scenario + '_decadal_' + stat][i] = decadal_means[Math.floor(((10 + i - 5) / 10))];
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
        rcp45_decadal_data.unshift(hist_decadal_data.slice(-1)[0]);
        rcp85_decadal_data = lodash_range(proj_mod_data.length).map((i) => [
          chart_data['proj_year_decade'][i],
          chart_data['rcp85_decadal_mean'][i],
          chart_data['rcp85_decadal_min'][i],
          chart_data['rcp85_decadal_max'][i],
        ]);
        rcp85_decadal_data.unshift(hist_decadal_data.slice(-1)[0])
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
            hovertemplate: '%{y:.1f}'
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
            hovertemplate: '%{y:.1f}'
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
            hovertemplate: '%{y:.1f}'
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
            hovertemplate: '%{y:.1f}'
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
            hovertemplate: '%{y:.1f}'
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
            hovertemplate: '%{y:.1f}'
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
            hovertemplate: '%{y:.1f}'
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
            hovertemplate: '%{y:.1f}'
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
            hovertemplate: '%{y:.1f}'
          }
        ]
      }
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
          hovertemplate: '%{y:.1f}'
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
          hovertemplate: '%{y:.1f}'
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
          hovertemplate: '%{y:.1f}'
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
          hovertemplate: '%{y:.1f}'
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
          hovertemplate: '%{y:.1f}'
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
          hovertemplate: '%{y:.1f}'
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
          hovertemplate: '%{y:.1f}'
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
          hovertemplate: '%{y:.1f}'
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
          hovertemplate: '%{y:.1f}'
        }
      ]
    }


    for (let i = 0; i < hist_obs_data.length; i++) {
      chart_data['hist_obs_year'].push(round(hist_obs_data[i][0], precision));
      chart_data['hist_obs'].push(round(hist_obs_data[i][1], precision));
      if (1961 <= hist_obs_data[i][0] && hist_obs_data[i][0] <= 1990) {
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
      round(hist_mod_data[hist_mod_data.length - 1][3], precision)])

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
          // hovertemplate: "%{text}",
          hoverlabel: {namelength: 0},
          text: chart_data['hist_year'].map((year, i) => `Range of hindcast values for the ${Math.trunc(year / 10)}0s: <b>${round(chart_data['hist_decadal_min'][i], 1)}</b> - <b>${round(chart_data['hist_decadal_max'][i], 1)}</b>`),
          // hoverinfo: 'text',
          customdata: hover_decadal_means ? hist_decadal_data : hist_mod_data,
          hovertemplate: hover_decadal_means ? "Range of hindcast values for %{customdata[0]}s: <b>%{customdata[2]:.1f}</b> - <b>%{customdata[3]:.1f}</b>" : "Range of hindcast values for %{customdata[0]}: <b>%{customdata[2]:.1f}</b> - <b>%{customdata[3]:.1f}</b>"
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
          // customdata: null,
          // hovertemplate: "<extra></extra>",
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
          // customdata: proj_mod_data,
          // hovertemplate: "(%{customdata[2]:.1f} - %{customdata[3]:.1f})<extra></extra>"
          hoverlabel: {namelength: 0},
          // text: chart_data['proj_year'].map((year, i) => `Range of projections for lower emissions for ${Math.trunc(year / 10)}0s: <b>${round(chart_data['rcp45_decadal_min'][i], 1)}</b> - <b>${round(chart_data['rcp45_decadal_max'][i], 1)}</b>`),
          // hoverinfo: 'text',
          customdata: hover_decadal_means ? rcp45_decadal_data : proj_mod_data,
          hovertemplate: hover_decadal_means ? "Range of projections for lower emissions for %{customdata[0]}s: <b>%{customdata[2]:.1f}</b> - <b>%{customdata[3]:.1f}</b>" : "Range of projections for lower emissions for %{customdata[0]}: <b>%{customdata[2]:.1f}</b> - <b>%{customdata[3]:.1f}</b>"
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
          // customdata: null,
          // hovertemplate: "<extra></extra>",
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
          // customdata: proj_mod_data,
          // hovertemplate: "(%{customdata[5]:.1f} - %{customdata[6]:.1f})<extra></extra>"
          hoverlabel: {namelength: 0},
          // text: chart_data['proj_year'].map((year, i) => `Range of projections for higher emissions for ${Math.trunc(year / 10)}0s: <b>${round(chart_data['rcp85_decadal_min'][i], 1)}</b> - <b>${round(chart_data['rcp85_decadal_max'][i], 1)}</b>`),
          // hoverinfo: 'text',
          customdata: hover_decadal_means ? rcp85_decadal_data : proj_mod_data,
          hovertemplate: hover_decadal_means ? "Range of projections for higher emissions for %{customdata[0]}s: <b>%{customdata[2]:.1f}</b> - <b>%{customdata[3]:.1f}</b>" : "Range of projections for higher emissions for %{customdata[0]}: <b>%{customdata[5]:.1f}</b> - <b>%{customdata[6]:.1f}</b>"
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
          hovertemplate: `Observed average for %{x}: <b>%{y:.1f}</b><br>Average from 1961-1990: <b>${round(hist_obs_bar_base, 1)}</b>`,
          hoverlabel: {namelength: 0},
          // text: chart_data['hist_year'].map((year, i)=>`Observed average for ${year}: ${round(chart_data['rcp85_decadal_min'][i],1)} - ${round(chart_data['rcp85_decadal_max'][i],1)}`),
          // hoverinfo: 'text',
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
          // customdata: null,
          // hovertemplate: "RCP 4.5: <b>%{y:.1f}</b><extra></extra>"
          hoverlabel: {namelength: 0},
          // text: chart_data['proj_year'].map((year, i) => `Projected average for lower emissions for ${Math.trunc(year / 10)}0s: <b>${round(chart_data['rcp45_decadal_mean'][i], 1)}</b>`),
          // hoverinfo: 'text',

          customdata: hover_decadal_means ? rcp45_decadal_data : proj_mod_data,
          hovertemplate: hover_decadal_means ? "Range of projections for lower emissions for %{customdata[0]}s: <b>%{customdata[1]:.1f}</b>" : "Projected average for lower emissions for %{customdata[0]}: <b>%{customdata[1]:.1f}</b>"
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
          // customdata: null,
          // hovertemplate: "RCP 8.5: <b>%{y:.1f}</b><extra></extra>"
          hoverlabel: {namelength: 0},
          // text: chart_data['proj_year'].map((year, i) => `Projected average for higher emissions for ${Math.trunc(year / 10)}0s: <b>${round(chart_data['rcp45_decadal_mean'][i], 1)}</b>`),
          // hoverinfo: 'text',

          customdata: hover_decadal_means ? rcp85_decadal_data : proj_mod_data,
          hovertemplate: hover_decadal_means ? "Projected average for higher emissions for %{customdata[0]}s: <b>%{customdata[1]:.1f}</b>" : "Projected average for higher emissions for %{customdata[0]}: <b>%{customdata[1]:.1f}</b>"

        },
        ...decadal_means_traces,
        ...rolling_means_traces
      ],
      // layout
      Object.assign({}, plotly_layout_defaults,
        {
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
          }
        }),
      // options
      this.parent._get_plotly_options()
    );
    this._update_visibility = () => {
      let visible_traces = [
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
      Plotly.restyle(this.element, {
        visible: visible_traces
      })
    }
    this._when_chart = new Promise((resolve) => {
      this.element.once('plotly_afterplot', (gd) => {
        resolve(gd)
      })
    });
    await this._when_chart
    this.parent._hide_spinner()


  }



  async request_style_update() {
    const {show_historical_modeled,show_projected_rcp45,show_projected_rcp85,show_historical_observed,show_rolling_window_means} = this.parent.options;
    let visible_traces = [
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
    Plotly.restyle(this.element, {
      visible: visible_traces
    })
  }




  get_departure_significance_stats(hist_mod_data, proj_mod_data, hist_start_year = 1961, hist_end_year = 1990, proj_start_year = 2036, proj_end_year = 2065) {
    const {area_id, variable} = this.parent.options;
    const p = 0.05 // 95% CI
    const n = 30;
    let result = [] // scenario, stat, change, CI, significance
    if ((hist_end_year - hist_start_year + 1) !== 30) {
      throw new Error('Historical year range must be exactly 30 years.')
    }
    if ((proj_end_year - proj_start_year + 1) !== 30) {
      throw new Error('Projected year range must be exactly 30 years.')
    }
    const t_score = 2.002; // t-score for two 30-sample series (df = (n_a - 1) + (n_b - 1))
    for (const [i, stat] of ['mean', 'min', 'max'].entries()) {
      const hist_col_offset = 1;
      const hist_series = map(filter(hist_mod_data, (r) => r[0] >= hist_start_year && r[0] <= hist_end_year), v => round(v[i + hist_col_offset], 4))
      const hist_mean = mean(hist_series);
      const hist_var = jStat.variance(hist_series, true);
      for (const scenario of ['rcp45', 'rcp85']) {
        const proj_col_offset = (scenario === 'rcp45' ? 1 : 4)
        // compute mean
        const proj_series = map(filter(proj_mod_data, (r) => r[0] >= proj_start_year && r[0] <= proj_end_year), v => round(v[i + proj_col_offset], 4))
        const proj_mean = mean(proj_series);
        const proj_var = jStat.variance(proj_series, true);

        // compute change stat
        const change = proj_mean - hist_mean;
        // compute CI
        const ci = (Math.sqrt(2 * ((hist_var + proj_var) / 2) / n)) * t_score; // I understand this line least, but it's consistent with the output I expect.
        // F-test (larger variance as numerator to get right-sided
        const f = 2 * jStat.ftest(Math.max(hist_var, proj_var) / Math.min(hist_var, proj_var), n - 1, n - 1);
        // compute significance
        const t_equal_variance = jStat.ttest(hist_series, proj_series, true, 2);
        const t_unequal_variance = jStat.ttest(hist_series, proj_series, false, 2);
        const significant = ((f < p) && t_equal_variance < p) || (f >= p && t_unequal_variance < p)
        result.push([area_id, variable, scenario, stat, round(hist_mean, 1), round(proj_mean, 1), round(change, 1), round(ci, 5), round(f, 5), round(t_equal_variance, 5), round(t_unequal_variance, 5), significant ? 'S' : 'NS'])
      }
    }

    return format_export_data(['area_id', 'variable', 'scenario', 'stat', 'hist_mean', 'proj_mean', 'change', 'CI', 'ftest', 'ttest_ev', 'ttest_uv', 'significance'], result, ['Statistical Significance Tests Technical Documentation:', 'https://climate-by-forest.nemac.org/docs/Climate%20By%20Forest%20Statistical%20Significance%20Documentation.pdf'])
  }


  async request_downloads() {
    const {get_area_label, frequency, variable} = this.parent.options;
    const downloads =  [
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
        label: 'Departure from natural range of variation report (1961-1990 compared to 2036-2065) ',
        icon: 'balance-scale',
        attribution: 'ACIS: LOCA (CMIP 5)',
        when_data: this._download_callbacks['departure_significance'],
        filename:  [
          get_area_label.bind(this)().toLowerCase(),
          frequency,
          variable,
          "departure_significance"
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
        }, filename: [
          get_area_label.bind(this)(),
          frequency,
          variable,
          "graph"
        ].join('-').replace(/[^A-Za-z0-9\-]/g, '_') + '.png'
      },
    ]
    if (!jStat){
      // remove departure significance if jStat is not available.
      downloads.splice(3,1);
    }

    return downloads
  }

}