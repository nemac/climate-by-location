import View from "./view_base.js";
import {max, mean, min, round, partial} from "../../node_modules/lodash-es/lodash.js";
import {format_export_data, rgba} from "../utils.js";
import {monthly_timeperiods, months, months_labels} from "../constants.js";
import {fetch_island_data} from "../io.js";

/* globals jQuery, window, Plotly, fetch, jStat */
// noinspection DuplicatedCode
export default class IslandMonthView extends View {
  async request_update() {
    const {
      colors,
      island_data_url_template,
      monthly_timeperiod,
      plotly_layout_defaults,
      show_historical_modeled,
      show_legend,
      variable,
      show_projected_rcp45,
      show_projected_rcp85,
      unitsystem
    } = this.parent.options;
    const area = this.parent.get_area();
    const variable_config = this.parent.get_variable_config();
    let data = await fetch_island_data(variable, area, island_data_url_template);

    let hist_mod_series = data.find((series) => series.scenario === 'historical')
    let rcp45_mod_series = data.find((series) => series.scenario === 'rcp45')
    let rcp85_mod_series = data.find((series) => series.scenario === 'rcp85')

    const unit_conversion_fn = variable_config.unit_conversions[unitsystem];


    let hist_mod_data = [];
    for (const month of months) {
      //year,mean,min,max
      hist_mod_data.push([month, unit_conversion_fn(mean(hist_mod_series.monthly_data.all_mean[month])), unit_conversion_fn(mean(hist_mod_series.monthly_data.all_min[month])), unit_conversion_fn(mean(hist_mod_series.monthly_data.all_max[month]))])
    }

    const proj_sdate_year = Number.parseInt(rcp85_mod_series.sdate.substr(0, 4));
    let proj_mod_data = [];
    for (const month of months) {
      let _month_data = [];
      for (const year_range of monthly_timeperiods) {
        let year_range_min_idx = year_range - 15 - proj_sdate_year;
        for (const scenario_monthly_data of [rcp45_mod_series.monthly_data, rcp85_mod_series.monthly_data]) {
          for (const value_name of ['mean', 'min', 'max']) {
            _month_data.push(unit_conversion_fn(mean(scenario_monthly_data['all_' + value_name][month].slice(year_range_min_idx, year_range_min_idx + 30))))
          }
        }
      }
      proj_mod_data.push([month, ..._month_data]);
    }
    const precision = variable_config.rounding_precision || 1;
    const d3_precision = precision > 0 ? precision : 0; // d3 format can't round to 10s, 100s, etc
    this._download_callbacks = {
      hist_mod: async () => format_export_data(['month', 'mean', 'min', 'max'], hist_mod_data, null, precision),
      proj_mod: async () => format_export_data(['month', '2025_rcp45_mean', '2025_rcp45_min', '2025_rcp45_max', '2025_rcp85_mean', '2025_rcp85_min', '2025_rcp85_max', '2050_rcp45_mean', '2050_rcp45_min', '2050_rcp45_max', '2050_rcp85_mean', '2050_rcp85_min', '2050_rcp85_max', '2075_rcp45_mean', '2075_rcp45_min', '2075_rcp45_max', '2075_rcp85_mean', '2075_rcp85_min', '2075_rcp85_max'], proj_mod_data, null, precision)
    };

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


    const _monthly_timeperiod = Number.parseInt(monthly_timeperiod);
    const col_offset = 1 + (monthly_timeperiods.indexOf(_monthly_timeperiod) * 6)
    // for some reason unknown to me, the following month cycle is shown.
    const month_indexes = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    const hist_mod_customdata = [];
    const proj_mod_customdata = [];
    for (const m of month_indexes) {
      const _m = m % 12;
      chart_data['month'].push(m);
      chart_data['month_label'].push(months_labels[_m]);
      chart_data['hist_min'].push(round(hist_mod_data[_m][1], precision));
      chart_data['hist_max'].push(round(hist_mod_data[_m][2], precision));
      chart_data['rcp45_mean'].push(round(proj_mod_data[_m][col_offset], precision));
      chart_data['rcp45_min'].push(round(proj_mod_data[_m][1 + col_offset], precision));
      chart_data['rcp45_max'].push(round(proj_mod_data[_m][2 + col_offset], precision));
      chart_data['rcp85_mean'].push(round(proj_mod_data[_m][3 + col_offset], precision));
      chart_data['rcp85_min'].push(round(proj_mod_data[_m][4 + col_offset], precision));
      chart_data['rcp85_max'].push(round(proj_mod_data[_m][5 + col_offset], precision));

      const l = chart_data['rcp45_mean'].length - 1;
      proj_mod_customdata.push([chart_data['month'][l], chart_data['rcp45_mean'][l], chart_data['rcp45_min'][l], chart_data['rcp45_max'][l], chart_data['rcp85_mean'][l], chart_data['rcp85_min'][l], chart_data['rcp85_max'][l]])
      hist_mod_customdata.push([chart_data['month'][l], chart_data['hist_min'][l], chart_data['hist_max'][l]])
    }

    const [x_range_min, x_range_max, y_range_min, y_range_max] = this.parent._update_axes_ranges(
      month_indexes,
      month_indexes[month_indexes.length - 1],
      min([min(chart_data['hist_min']), min(chart_data['rcp45_min']), min(chart_data['rcp85_min'])]),
      max([max(chart_data['hist_max']), max(chart_data['rcp45_max']), max(chart_data['rcp85_max'])]),
    );


    Plotly.react(
      this.element,
      [
        {
          name: 'Modeled minimum (historical)',
          x: chart_data['month'],
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
          x: chart_data['month'],
          // y: chart_data['hist_max_diff'],
          y: chart_data['hist_max'],
          // text: chart_data['hist_max'],
          // hoverinfo: 'text',
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
          customdata: hist_mod_customdata,
          hovertemplate: `1961-1990 modeled range: %{customdata[1]:.${d3_precision}f}&#8211;%{customdata[2]:.${d3_precision}f}`,
          hoverlabel: {namelength: 0},
        },
        {
          x: chart_data['month'],
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
          x: chart_data['month'],
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
          customdata: proj_mod_customdata,
          hovertemplate: `range: %{customdata[2]:.${d3_precision}f}&#8211;%{customdata[3]:.${d3_precision}f}`
        },
        {
          x: chart_data['month'],
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
          x: chart_data['month'],
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
          customdata: proj_mod_customdata,
          hovertemplate: `range: %{customdata[5]:.${d3_precision}f}&#8211;%{customdata[6]:.${d3_precision}f}`
        },
        {
          x: chart_data['month'],
          y: chart_data['rcp45_mean'],
          type: 'scatter',
          mode: 'lines',
          name: 'Modeled mean (RCP 4.5 projection)',
          line: {color: rgba(colors.rcp45.line, colors.opacity.proj_line)},
          visible: show_projected_rcp45 ? true : 'legendonly',
          legendgroup: 'rcp45',
          hoverlabel: {namelength: 0},
          hovertemplate: `lower emissions average projection: <b>%{y:.${d3_precision}f}</b>`
        },
        {
          x: chart_data['month'],
          y: chart_data['rcp85_mean'],
          type: 'scatter',
          mode: 'lines',
          name: 'Modeled mean (RCP 8.5 projection)',
          visible: show_projected_rcp85 ? true : 'legendonly',
          line: {color: rgba(colors.rcp85.line, colors.opacity.proj_line)},
          legendgroup: 'rcp85',
          hoverlabel: {namelength: 0},
          hovertemplate: `higher emissions average projection: <b>%{y:.${d3_precision}f}</b>`
        }
      ],
      // layout
      Object.assign({}, plotly_layout_defaults,
        {
          showlegend: show_legend,
          xaxis: Object.assign(this.parent._get_x_axis_layout(x_range_min, x_range_max), {tickmode: 'array', tickvals: month_indexes, ticktext: chart_data['month_label']}),
          yaxis: this.parent._get_y_axis_layout(y_range_min, y_range_max, variable_config)
        }),
      // options
      this.parent._get_plotly_options(),
    );

    this._when_chart = new Promise((resolve) => {
      this.element.once('plotly_afterplot', (gd) => {
        resolve(gd)
      })
      this._hover_handler = partial(this._request_show_popover.bind(this), false, chart_data, colors, precision, variable_config, unitsystem);
      this.element.on('plotly_hover', this._hover_handler);
      this._click_handler = partial(this._request_show_popover.bind(this), true, chart_data, colors, precision, variable_config, unitsystem);
      this.element.on('plotly_click', this._click_handler);
    });
    await this._when_chart
    this.parent._hide_spinner()
  }



  async _request_show_popover(pinned, chart_data, colors, precision, variable_config, unitsystem, event_data) {
    try {
      const month_idx = chart_data['month'].indexOf(parseInt(event_data.points[0].x));
      let month = chart_data['month_label'][month_idx];
      const monthly_content = `
        <div class="label1">${month} projection</div>
           <div class="bg-rcp85 label2">Higher Emissions</div>
          <div  class="bg-rcp85" style="grid-column: 1; padding-bottom: 0.25rem; display: flex; align-items: center;">
            <span style="width: 1.25rem; margin: 0 .3rem 0 .3rem; border-top: 0.15rem solid ${rgba(colors.rcp85.line, colors.opacity.proj_line)};"></span>
            <div title="${month} higher emissions mean" class="legend-line" style="font-size: 1.1rem; margin: 0 0 0 .3rem;">${round(chart_data['rcp85_mean'][month_idx], precision)}</div>
          </div>
          <div class="bg-rcp85" style="grid-column: 2; padding-bottom: 0.25rem; display: flex; align-items: center;">
            <span style="width: 1.25rem; margin: 0 .3rem 0 .3rem; border-top: 0.35rem solid ${rgba(colors.rcp85.outerBand, colors.opacity.ann_proj_minmax)};"></span>
            <div title="${month} higher emissions range" class="legend-area"  style=" font-size: 0.8rem; margin: 0 0 0 .3rem;"><span>${round(chart_data['rcp85_min'][month_idx], precision)}</span><span>&mdash;</span><span>${round(chart_data['rcp85_max'][month_idx], precision)}</span></div>
          </div>
         
          <div class="bg-rcp45 label2">Lower Emissions</div>
          <div class="bg-rcp45" style="grid-column: 1; padding-bottom: 0.25rem; display: flex; align-items: center;">
            <span style="width: 1.25rem; margin: 0 .3rem 0 .3rem; border-top: 0.15rem solid ${rgba(colors.rcp45.line, colors.opacity.proj_line)};"></span>
            <div title="${month} lower emissions mean" class="legend-line" style="font-size: 1.1rem; margin: 0 0 0 .3rem;">${round(chart_data['rcp45_mean'][month_idx], precision)}</div>
          </div>
          <div class="bg-rcp45" style="grid-column: 2; padding-bottom: 0.25rem; display: flex; align-items: center;">
            <span style="width: 1.25rem; margin: 0 .3rem 0 .3rem; border-top: 0.35rem solid ${rgba(colors.rcp45.outerBand, colors.opacity.ann_proj_minmax)};"></span>
            <div title="${month} lower emissions range" class="legend-area"  style=" font-size: 0.8rem; margin: 0 0 0 .3rem;">${round(chart_data['rcp45_min'][month_idx], precision)}</span><span>&mdash;</span><span>${round(chart_data['rcp45_max'][month_idx], precision)}</div>
          </div>
          <div class="label1 bg-hist" style="font-size: 0.8rem;">1961&mdash;1990 historical range</div>
          <div class="bg-hist" style="grid-column: 1 / span 2; padding-bottom: 0.25rem; display: flex; align-items: center;">
            <span style="width: 1.25rem; margin: 0 .3rem 0 .3rem; border-top: 0.35rem solid ${rgba(colors.hist.outerBand, colors.opacity.ann_proj_minmax)};"></span>
            <div title="${month} historical range" class="legend-area"  style="font-size: 0.8rem; margin: 0 0 0 .3rem;">${round(chart_data['hist_min'][month_idx], precision)}</span><span>&mdash;</span><span>${round(chart_data['hist_max'][month_idx], precision)}</div>
          </div>
        `;

      return this.parent._request_show_popover(event_data.points[0].xaxis.l2p(event_data.points[0].x), null, `
        <div style="display: grid; grid-template-columns: auto auto;">
        ${monthly_content}
        </div>
        `, pinned, variable_config.ytitles['annual'][unitsystem]);
    } catch (e) {
      console.error(e)
      return this.parent.request_hide_popover(pinned);
    }
  }

  async request_style_update() {
    const {show_projected_rcp45, show_projected_rcp85, show_historical_modeled} = this.parent.options;
    Plotly.restyle(this.element, {
      visible: [
        !!show_historical_modeled ? true : 'legendonly',
        !!show_historical_modeled ? true : 'legendonly',
        !!show_projected_rcp45 ? true : 'legendonly',
        !!show_projected_rcp45 ? true : 'legendonly',
        !!show_projected_rcp85 ? true : 'legendonly',
        !!show_projected_rcp85 ? true : 'legendonly',
        !!show_projected_rcp45 ? true : 'legendonly',
        !!show_projected_rcp85 ? true : 'legendonly']
    })
  }


  async request_downloads() {
    const {get_area_label, frequency, variable} = this.parent.options
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