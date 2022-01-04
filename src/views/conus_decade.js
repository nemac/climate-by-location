import View from "./view_base.js";
import {max, mean, min, partial, range as lodash_range, round} from "../../node_modules/lodash-es/lodash.js";
import {compute_decadal_means, compute_rolling_window_means, format_export_data, rgba} from "../utils.js";
import {get_historical_annual_loca_model_data, get_historical_observed_livneh_data, get_projected_loca_model_data} from "../io.js";


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
    this._style = `#${this.parent.element.id} .legendtitletext{ display: none; }`
    parent._styles.push(this._style)
    this.parent._update_styles();

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
      unitsystem,
      font
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
      proj_mod: async () => format_export_data(['year', 'rcp45_weighted_mean', 'rcp45_min', 'rcp45_max', 'rcp85_weighted_mean', 'rcp85_min', 'rcp85_max', 'NOTE: This file contains annual projection values produced by global climate models. Decadal averages of these values (as shown in the Climate Explorer) are a more appropriate temporal scale for using projections.'], proj_mod_data, null, precision)
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
            // hoverinfo: 'skip'
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
            // hoverinfo: 'skip'
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
            // hoverinfo: 'skip'
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
            // hoverinfo: 'skip'
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
            // hoverinfo: 'skip'
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
            // hoverinfo: 'skip'
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
            // hoverinfo: 'skip'
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
            // hoverinfo: 'skip'
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
            // hoverinfo: 'skip'
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
          // hoverinfo: 'skip'
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
          // hoverinfo: 'skip'
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
          // hoverinfo: 'skip'
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
          // hoverinfo: 'skip'
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
          // hoverinfo: 'skip'
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
          // hoverinfo: 'skip'
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
          // hoverinfo: 'skip'
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
          // hoverinfo: 'skip'
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
          // hoverinfo: 'skip'
        }
      ]
    }


    for (let i = 0; i < hist_obs_data.length; i++) {
      chart_data['hist_obs_year'].push(hist_obs_data[i][0]);
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
      chart_data['hist_year'].push(hist_mod_data[i][0] + '-01-01');
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
      chart_data['proj_year'].push(proj_mod_data[i][0] + '-01-01');
      chart_data['rcp45_mean'].push(round(proj_mod_data[i][1], precision));
      chart_data['rcp45_min'].push(round(proj_mod_data[i][2], precision));
      chart_data['rcp45_max'].push(round(proj_mod_data[i][3], precision));
      chart_data['rcp85_mean'].push(round(proj_mod_data[i][4], precision));
      chart_data['rcp85_min'].push(round(proj_mod_data[i][5], precision));
      chart_data['rcp85_max'].push(round(proj_mod_data[i][6], precision));
    }
    const [x_range_min, x_range_max, y_range_min, y_range_max] = this.parent._update_axes_ranges(
      1950,
      2099,
      min([min(chart_data['hist_min']), min(chart_data['rcp45_min']), min(chart_data['rcp85_min'])]),
      max([max(chart_data['hist_max']), max(chart_data['rcp45_max']), max(chart_data['rcp85_max'])]),
      true
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
          font: {color: colors.hist.bar, size: this.parent.options.smaller_labels ? 8 : 10}
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
            color: rgba(colors.hist.bar, (colors.opacity.hist_obs / 1.5)),
            width: 1,
            opacity: 1,
            dash: 'dot'
          },
          visible: !!show_historical_observed ? true : 'legendonly',
          // hoverinfo: 'skip'
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
          // hoverinfo: 'skip'
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
          // hoverinfo: 'skip'
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
          // hoverinfo: 'skip'
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
          // hoverinfo: 'skip'
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
          // hoverinfo: 'skip'
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
          // hoverinfo: 'skip'
        },
        {
          x: chart_data['hist_obs_year'],
          y: chart_data['hist_obs_diff'],
          type: 'bar',
          yaxis: 'y2',
          base: hist_obs_bar_base,
          name: 'Historical Observed',
          line: {
            color: colors.hist.line,
            width: 3
          },
          marker: {
            color: rgba(colors.hist.bar, (colors.opacity.hist_obs / 1.5))
          },
          legendgroup: 'histobs',
          visible: !!show_historical_observed ? true : 'legendonly',
          // hoverinfo: 'skip'
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
          // hoverinfo: 'skip'
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
          // hoverinfo: 'skip'
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
              family: `${font || 'roboto'}, monospace`,
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
      this._hover_handler = partial(this._request_show_popover.bind(this), false, chart_data, hover_decadal_means, show_decadal_means, colors, precision, show_rolling_window_means, rolling_window_mean_years, variable_config, unitsystem, hist_obs_bar_base);
      this.element.on('plotly_hover', this._hover_handler);
      this._click_handler = partial(this._request_show_popover.bind(this), true, chart_data, hover_decadal_means, show_decadal_means, colors, precision, show_rolling_window_means, rolling_window_mean_years, variable_config, unitsystem, hist_obs_bar_base);
      this.element.on('plotly_click', this._click_handler);
      this._relayout_handler = partial(this.sync_y_axis_ranges.bind(this), hist_obs_bar_base, [y_range_min, y_range_max]);
      this.element.on('plotly_relayout', this._relayout_handler)

    });
    await this._when_chart
    this.parent._hide_spinner()
  }

  async _request_show_popover(pinned, chart_data, hover_decadal_means, show_decadal_means, colors, precision, show_rolling_window_means, rolling_window_mean_years, variable_config, unitsystem, hist_obs_bar_base, event_data) {
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
        // language=HTML
        decadal_content = `
        <div  class="label1">${year_decade}s projection</div>
         ${year >= 2000 ? `
           <div class="bg-rcp85 label2" >Higher Emissions</div>
          <div class="bg-rcp85" style="grid-column: 1; padding-bottom: 0.25rem; display: flex; align-items: center;">
          
            <span style="width: 1.25rem; margin: 0 .3rem 0 .3rem; border-top: 0.15rem solid ${rgba(colors.rcp85.line, colors.opacity.proj_line)};"></span>
            
            <div title="${year_decade}s higher emissions weighted mean" class="legend-line" style="font-size: 1.1rem; margin: 0 0 0 .3rem;">${round(chart_data['rcp85_decadal_mean'][proj_year_idx], precision)}</div>
          </div>
          <div class="bg-rcp85" style=" grid-column: 2; padding-bottom: 0.25rem; display: flex; align-items: center;">
                
            <span style="width: 1.25rem; margin: 0 .3rem 0 .3rem; border-top: 0.35rem solid ${rgba(colors.rcp85.outerBand, colors.opacity.ann_proj_minmax)};"></span>
            
            <div title="${year_decade}s higher emissions range"  class="legend-area" style="font-size: 0.8rem; margin: 0 0 0 .3rem;"><span>${round(chart_data['rcp85_decadal_min'][proj_year_idx], precision)}</span><span>&mdash;</span><span>${round(chart_data['rcp85_decadal_max'][proj_year_idx], precision)}</span></div>
          </div>
         
          <div class="bg-rcp45 label2" >Lower Emissions</div>
          
          <div class="bg-rcp45"  style="grid-column: 1;  padding-bottom: 0.25rem; display: flex; align-items: center;">
            <span style="width: 1.25rem; margin: 0 .3rem 0 .3rem; border-top: 0.15rem solid ${rgba(colors.rcp45.line, colors.opacity.proj_line)};"></span>
            
            <div title="${year_decade}s lower emissions weighted mean" class="legend-line" style=" font-size: 1.1rem; margin: 0 0 0 .3rem;">${round(chart_data['rcp45_decadal_mean'][proj_year_idx], precision)}</div>
          </div>
          
          <div class="bg-rcp45"  style="grid-column: 2;  padding-bottom: 0.25rem; display: flex; align-items: center;">
            <span style="width: 1.25rem; margin: 0 .3rem 0 .3rem; border-top: 0.35rem solid ${rgba(colors.rcp45.outerBand, colors.opacity.ann_proj_minmax)};"></span>
            
            <div title="${year_decade}s lower emissions range" class="legend-area" style=" font-size: 0.8rem; margin: 0 0 0 .3rem;">${round(chart_data['rcp45_decadal_min'][proj_year_idx], precision)}</span><span>&mdash;</span><span>${round(chart_data['rcp45_decadal_max'][proj_year_idx], precision)}</div>
          </div>
        ` : `
        <div  class="label2 bg-hist">Historic range</div>
        <div style="grid-column: 1 / span 2; background-color: ${rgba(colors.hist.outerBand, 0.1)}; padding-bottom: 0.25rem;">
          <div style="display: flex; align-items: center;"> 
            <span style="width: 1.25rem; margin: 0 .3rem 0 .3rem; border-top: 0.35rem solid ${rgba(colors.hist.outerBand, colors.opacity.ann_proj_minmax)};"></span>
            <div title="${year_decade}s historic range" class="legend-area" style="font-size: 0.8rem; margin: 0 0 0 .3rem;"><span>${round(chart_data['hist_decadal_min'][hist_year_idx], precision)}</span><span>&mdash;</span><span>${round(chart_data['hist_decadal_max'][hist_year_idx], precision)}</span></div>
          </div>
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
            <div title="${year_start}&mdash;${year} higher emissions weighted mean" class="legend-line" style="font-size: 1.1rem; border-left-color:${rgba(colors.rcp85.line, colors.opacity.proj_line)}; ">${round(chart_data['rcp85_rolling_mean'][proj_year_idx], precision)}</div>
          </div>
          <div class="bg-rcp85" style=" grid-column: 2; padding-bottom: 0.25rem;">
            <div title="${year_start}&mdash;${year} higher emissions range" class="legend-area" style=" font-size: 0.8rem; border-left-color: ${rgba(colors.rcp85.outerBand, colors.opacity.ann_proj_minmax)}; "><span>${round(chart_data['rcp85_rolling_min'][proj_year_idx], precision)}</span><span>&mdash;</span><span>${round(chart_data['rcp85_rolling_max'][proj_year_idx], precision)}</span></div>
          </div>
         
          <div class="bg-rcp45 label2" >Lower Emissions</div>
          <div class="bg-rcp45"  style="grid-column: 1;  padding-bottom: 0.25rem;">
            <div title="${year_start}&mdash;${year} lower emissions weighted mean" class="legend-line" style="font-size: 1.1rem; border-left-color:${rgba(colors.rcp45.line, colors.opacity.proj_line)};  ">${round(chart_data['rcp45_rolling_mean'][proj_year_idx], precision)}</div>
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
            <div class="bg-rcp85" style=" grid-column: 1; padding-bottom: 0.25rem; display: flex; align-items: center;">
              <span style="width: 1.25rem; margin: 0 .3rem 0 .3rem; border-top: 0.15rem solid ${rgba(colors.rcp85.line, colors.opacity.proj_line)};"></span>
              <div title="${year} higher emissions weighted mean" class="legend-line" style="font-size: 1.1rem; margin: 0 0 0 .3rem;">${round(chart_data['rcp85_mean'][proj_year_idx], precision)}</div>
            </div>
            
            <div  class="bg-rcp85" style=" grid-column: 2; padding-bottom: 0.25rem; display: flex; align-items: center;">
              <span style="width: 1.25rem; margin: 0 .3rem 0 .3rem; border-top: 0.35rem solid ${rgba(colors.rcp85.outerBand, colors.opacity.ann_proj_minmax)};"></span>
              <div title="${year} higher emissions range" class="legend-area" style=" font-size: 0.8rem; margin: 0 0 0 .3rem;"><span>${round(chart_data['rcp85_min'][proj_year_idx], precision)}</span><span>&mdash;</span><span>${round(chart_data['rcp85_max'][proj_year_idx], precision)}</span></div>
            </div>
         
          <div class="bg-rcp45 label2" >Lower Emissions</div>
          
          <div class="bg-rcp45" style="grid-column: 1;  padding-bottom: 0.25rem; display: flex; align-items: center;">
            <span style="width: 1.25rem; margin: 0 .3rem 0 .3rem; border-top: 0.35rem solid ${rgba(colors.rcp45.line, colors.opacity.proj_line)};"></span>
            <div title="${year} lower emissions weighted mean"  class="legend-line" style="font-size: 1.1rem; margin: 0 0 0 .3rem;">${round(chart_data['rcp45_mean'][proj_year_idx], precision)}</div>
          </div>
          <div class="bg-rcp45"  style="grid-column: 2;  padding-bottom: 0.25rem; display: flex; align-items: center;">
            <span style="width: 1.25rem; margin: 0 .3rem 0 .3rem; border-top: 0.35rem solid ${rgba(colors.rcp45.outerBand, colors.opacity.ann_proj_minmax)};"></span>
            <div title="${year} lower emissions range" class="legend-area" style=" font-size: 0.8rem; margin: 0 0 0 .3rem;">${round(chart_data['rcp45_min'][proj_year_idx], precision)}</span><span>&mdash;</span><span>${round(chart_data['rcp45_max'][proj_year_idx], precision)}</div>
          </div>
        ` : `
        <div class="label2 bg-hist">Historic range</div>   
          <div style="display: flex; align-items: center;"> 
            <span style="width: 1.25rem; margin: 0 .3rem 0 .3rem; border-top: 0.35rem solid ${rgba(colors.hist.outerBand, colors.opacity.ann_proj_minmax)};"></span>
            <div title="${year} historic range" class="legend-area" style="font-size: 0.8rem; margin: 0 0 0 .3rem;"><span>${round(chart_data['hist_min'][hist_year_idx], precision)}</span><span>&mdash;</span><span>${round(chart_data['hist_max'][hist_year_idx], precision)}</span></div>
          </div>
        </div>
        `}
        `
      }
      annual_content += `${hist_year_idx < chart_data['hist_obs'].length ? `
        <div  class="label1" style="font-size: 0.8rem;">${year} observed</div>
        <div style="grid-column: 1 / span 2; display: flex; align-items: center;">
        <span style="width: 1.25rem; margin: 0 .3rem 0 .3rem; border-top: 0.15rem solid ${rgba(colors.hist.bar, 0.75)};"></span>
          <div title="${year} observed" class="legend-line" style="font-size: 0.8rem; margin: 0 0 0 .3rem;">${round(chart_data['hist_obs'][hist_year_idx], precision)}</div>
        </div>
        ` : ''}`

      return this.parent._request_show_popover('xaxes' in event_data ? event_data.xaxes[0].l2p(event_data.xvals[0]) : null, null, `
        <div style="display: grid; grid-template-columns: auto auto;">
         ${decadal_content}
        ${rolling_content}
        ${annual_content}
        
        <div class="label1" style="font-size: 0.8rem;">1961&mdash;1990 observed average</div>
        <div style="grid-column: 1 / span 2; display: flex; align-items: center;">
          <span style="width: 1.25rem; margin: 0 .3rem 0 .3rem; border-top: 0.15rem dashed ${rgba(colors.hist.bar, colors.opacity.hist_obs)};"></span>
          <div title="1961&mdash;1990 observed average" class="legend-line" style="font-size: 0.8rem; margin: 0 0 0 .3rem;">${round(hist_obs_bar_base, precision)}</div>
        </div>
        </div>
        `, pinned, variable_config.ytitles['annual'][unitsystem]);
    } catch (e) {
      console.error(e)
      return this.parent.request_hide_popover(pinned);
    }
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
      if (this.element && this.element.removeListener) {
        this.element.removeListener('plotly_relayout', this._relayout_handler);
        this.element.removeListener('plotly_hover', this._hover_handler);
        this.element.removeListener('plotly_click', this._click_handler);
      }
    } catch {
      // do nothing
    }
  }
}
