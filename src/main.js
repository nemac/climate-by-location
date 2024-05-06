'use strict';
import '../node_modules/unfetch/polyfill/index.js'
import {find, get, merge,} from '../node_modules/lodash-es/lodash.js';
import {is_monthly, save_file, rgba} from './utils.js';
import {areas_json_url, set_areas_json_url, frequencies, variables, bool_options, data_api_url, monthly_variables, island_data_url_template} from "./constants.js";

// a couple module-level variables
let _all_areas = null;
/** @type Promise */
let _when_areas = null;


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


   * @param {boolean} options.show_legend - Whether to show the built-in legend. Defaults to false.
   * @param {boolean} options.show_historical_observed - Whether to show historical observed data, if available.
   * @param {boolean} options.show_historical_modeled - Whether to show historical modeled data, if available.
   * @param {boolean} options.show_projected_rcp45 - Whether to show projected modeled RCP4.5 data, if available.
   * @param {boolean} options.show_projected_rcp85 - Whether to show projected modeled RCP8.5 data, if available.
   * @param {boolean} options.show_decadal_means - Whether to show decadal means of modeled data, if available.
   * @param {boolean} options.hover_decadal_means - Whether to show decadal means instead of annual values of modeled data, if available.
   * @param {boolean} options.show_rolling_window_means - Whether or not to show rolling window means of modeled data, if available.
   * @param {number} options.rolling_window_mean_years - The number of years to include in the rolling window, defaults to 10.
   * @param {string} options.font - Defaults to 'Roboto'.
   * @param {boolean} options.smaller_labels - Shrink label sizes in the graph for a more compact display. Defaults to false.
   * @param {boolean} options.responsive - Whether  to listen to window resize events and auto-resize the graph. Can only be set on instantiation.
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
      plotly_layout_defaults: {
        hoverdistance: 50,
        autosize: true,
        margin: {l: 50, t: 12, r: 12, b: 60},
        hovermode: 'x unified',
        legend: {"orientation": "h"},
      },
      hover_decadal_means: true,
      show_decadal_means: false,
      show_annual_values: true,
      show_rolling_window_means: false,
      rolling_window_mean_years: 10,
      data_api_url: data_api_url,
      island_data_url_template: island_data_url_template,
      // these options get used during init, and therefore must be available immediately.
      font: !!options && !!options.font ? options.font : 'Roboto',
      smaller_labels: !!options && !!options.smaller_labels || false,
    };
    if (this.options.smaller_labels){
      this.options.plotly_layout_defaults.margin = {l: 32, t: 8, r: 10, b: 32}
    }
    // this.options = merge(this.options, options);
    this.view = null;

    if (typeof element === "string") {
      element = document.querySelector(this.element);
    } else if (!!jQuery && element instanceof jQuery) {
      element = element[0]
    }
    this.element = element;

    if (!this.element) {
      console.log('Climate By Location widget created with no element. Nothing will be displayed.');
    }
    if (!this.element.id) {
      this.element.id = 'climatebylocation-' + Math.floor(Math.random() * Math.floor(100));
    }
    this._styles = [
      `#${this.element.id} {position: relative; display: flex; flex-flow: column nowrap;}`,
      `#${this.element.id} .climate_by_location_view {width: 100%; height: 100%; flex: 1 1 auto;}`,
    ];
    this.view_container = document.createElement('div');
    this.view_container.classList.add('climate_by_location_view');
    this.element.append(this.view_container);

    this._style_el = document.createElement('style');
    this.element.append(this._style_el);
    /** @type {function} */
    this._update_visibility = null;
    /** @var _when_chart {Promise} - Promise for the most recent plotly graph. */
    this._when_chart = null;
    this._init_popover();

    this._update_styles();
    ClimateByLocationWidget.when_areas().then(() => {
      this.update(options);
    });
    if (this.options.responsive) {
      window.addEventListener('resize', this.resize.bind(this));
    }
  }

  _update_styles() {
    if (this._style_el) {
      this._style_el.innerHTML = this._styles.join('\n');
    }
  }

  _init_popover() {
    this._styles = [...this._styles,
      `#${this.element.id} .hoverlayer .legend {display: none !important;}`,
      `#${this.element.id} .climate_by_location_popover {
            z-index: 9999;
            display: none;
            position:absolute;
            background: rgba(252,253,255,0.825);
            pointer-events: none;
            min-height: ${this.options.smaller_labels? '3' : '3.75'}rem;
            flex-flow: column nowrap;
            height: fit-content;
            width: ${this.options.smaller_labels? '11.5' : '15'}rem;
            box-shadow: 2px 1px 5px rgb(0 0 0 / 50%);
            border: solid 1.3px rgba(0, 0, 0, 0.3);
            padding: 0.45rem 0.55rem;
            font-size: ${this.options.smaller_labels? '0.75' : '1'}rem;
            font-weight: 500;
            line-height: ${this.options.smaller_labels? '1.15' : '1.5'}rem;
       }`,
      `#${this.element.id} .climate_by_location_popover .bg-rcp85 { background-color: ${rgba(this.options.colors.rcp85.outerBand, 0.1)}; }`,
      `#${this.element.id} .climate_by_location_popover .bg-rcp45 { background-color: ${rgba(this.options.colors.rcp45.outerBand, 0.1)}; }`,
      `#${this.element.id} .climate_by_location_popover .bg-hist { background: ${rgba(this.options.colors.hist.outerBand, 0.1)}; }`,
      `#${this.element.id} .climate_by_location_popover .label1 { font-size: 1em; font-weight: 700; line-height: 1.5em; grid-column: 1 / span 2; }`,
      `#${this.element.id} .climate_by_location_popover .label2 { font-size: 0.7em; padding-left: 0.3rem; line-height: 1em; grid-column: 1 / span 2; }`,
      // `#${this.element.id} .climate_by_location_popover .legend-area { margin-left: 0.5rem; border-left-width: 0.4rem; border-left-style: solid;  padding-left: 0.5rem;}`,
      // `#${this.element.id} .climate_by_location_popover .legend-line { margin-left: 0.5rem; border-left-width: 0.15rem; border-left-style: solid; padding-left: 0.5rem; }`,

      `#${this.element.id} .climate_by_location_popover .popover-header { display: flex; flex-flow: row nowrap; align-items: center;}`,
      `#${this.element.id}.popover-pinned .climate_by_location_popover { pointer-events: all; background: rgba(252,253,255,0.95); left: 60px !important; top: 15px !important; }`,
      `#${this.element.id}.popover-open .climate_by_location_popover { display: flex;   }`


    ];
    this._popover = document.createElement("span");
    this._popover.classList.add('climate_by_location_popover');
    this.element.append(this._popover);
  }

  /*
   * Public instance methods
   */


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
    return get(ClimateByLocationWidget.get_areas({type: null, state: null, area_id: this.options.area_id}), 0, null)
  }


  update(options) {
    let old_options = Object.assign({}, this.options);

    let old_view_class = null;
    try {
      old_view_class = this.get_view_class();
    } catch {
    }
    this.options = merge({}, old_options, options);
    bool_options.forEach((option) => {
      if (typeof options[option] === "string") {
        options[option] = options[option].toLowerCase() === "true";
      }
    });
    // catch cases where user was on monthly and switched to AK
    if (!find(frequencies, (frequency) => frequency.id === this.options.frequency && frequency.supports_area(this.options.area_id))) {
      this.options.frequency = frequencies[0].id
    }
    // catch cases where user was on annual for a non-monthly variable and switched to monthly
    if (is_monthly(this.options.frequency) && !monthly_variables.includes(this.options.variable)) {
      this.options.variable = ClimateByLocationWidget.get_variables({frequency: this.options.frequency, unitsystem: null, area_id: this.options.area_id})[0].id
    }
    // catch cases where the user was on a variable for only certain area and switched to a non-supported areas.
    const variable_config = this.get_variable_config();
    if (variable_config && variable_config.supports_area && !variable_config.supports_area(this.options.area_id)) {
      this.options.variable = ClimateByLocationWidget.get_variables({frequency: this.options.frequency, unitsystem: null, area_id: this.options.area_id})[0].id
    }

    // if frequency, state, county, or variable changed, trigger a larger update cycle (new data + plots maybe changed):
    if (this.options.frequency !== old_options.frequency
      || this.options.area_id !== old_options.area_id
      || this.options.variable !== old_options.variable
      || this.options.monthly_timeperiod !== old_options.monthly_timeperiod
      || (!!this.options.show_decadal_means && this.options.show_decadal_means !== old_options.show_decadal_means)
      || (!!this.options.show_rolling_window_means && this.options.show_rolling_window_means !== old_options.show_rolling_window_means)
      || (!!this.options.show_rolling_window_means && this.options.rolling_window_mean_years !== old_options.rolling_window_mean_years)
    ) {
      if (old_view_class !== this.get_view_class() && this.view) {
        this.view.destroy();
        this.view = null;
      }
      this.request_hide_popover(true);
      this._update();
    } else {
      if (this.view !== null && this.view.style_option_names.some(k => this.options[k] !== old_options[k])) {
        this.view.request_style_update();
      }
      if (this.options.x_axis_range !== old_options.x_axis_range) {
        this.set_x_axis_range(...this.options.x_axis_range)
      }
    }

    return this;
  }

  get_variable_config() {
    return find(variables, (c) => c.id === this.options.variable);
  }

  /**
   * Options which force re-evaluation of which view class should be used and request that view to fully update.
   * @return {string[]}
   * @private
   */
  get _view_selection_option_names() {
    return ['frequency', 'area_id', 'variable', 'monthly_timeperiod', 'show_decadal_means', 'show_rolling_window_means', 'rolling_window_mean_years']
  }

  /**
   * @returns View
   */
  get_view_class() {
    throw new Error('Not Implemented!');
  }

  /**
   * This function will set the range of data visible on the graph's x-axis without refreshing the rest of the graph.
   *
   * @param min
   * @param max
   * @returns {boolean}
   */
  set_x_axis_range(min, max) {
    this.options.x_axis_range = [min, max]
    if (this.options.frequency === 'annual') {
      Plotly.relayout(this.view_container, {'xaxis.range': this.options.x_axis_range})
    }
    return this.options.x_axis_range
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
      try {
        Plotly.relayout(this.view_container, {
          'xaxis.autorange': true,
          'yaxis.autorange': true
        });
      } catch {
        // do nothing
      }
    })
  }

  /**
   * Gets the available downloads for the current view.
   * @return {Promise<*[]>}
   */
  async request_downloads() {
    if (this.view) {
      return (await this.view.request_downloads()).map((d) => new Proxy(
        d,
        {
          get: (target, prop) => {
            if (prop === 'download') {
              return async () => {
                try {
                  const url = await target.when_data();

                  return await save_file(url, target['filename'])
                } catch (e) {
                  console.log('Failed download with message', e)
                  throw new Error('Failed to download ' + target['label'])
                }
              }
            }
            return target[prop]
          }
        }));
    }
    return [];
  }

  /*
   * Private methods
   */

  /**
   * Requests the widget update according to its current options. Use `set_options()` to change options instead.
   * @returns {Promise<void>}
   */
  async _update() {
    this._show_spinner();
    await ClimateByLocationWidget.when_areas({})
    try {
      if (this.view === null) {
        this.view = new (this.get_view_class())(this, this.view_container);
      }
      await this.view.request_update();
      this.element.addEventListener('mouseleave', () => this.request_hide_popover(false));
    } catch (e) {
      console.error(e);
      this._show_spinner_error();
    }
  }

  async _request_show_popover(x, y, content, pinned = false, title = '') {
    if (!pinned && this.element.classList.contains('popover-pinned')) {
      return Promise.resolve()
    }

    this.element.classList.add('popover-open');
    if (pinned) {
      this.element.classList.add('popover-pinned');
    }
    this._popover_hide_pending = false;
    let x_position, y_position;
    if (x != null) {
      x_position = x + this.options.plotly_layout_defaults.margin.l + 7;
      if ((x_position + this._popover.offsetWidth + 25) >= this.element.offsetWidth) {
        x_position -= this._popover.offsetWidth + 14;
      }
    } else {
      x_position = ((this.element.offsetWidth - 50) / 2 - (this._popover.offsetWidth / 2) + 7);
    }

    if (y != null) {
      y_position = y + this.options.plotly_layout_defaults.margin.t - this._popover.offsetHeight;
      if ((y_position - 20) < 0) {
        y_position += this._popover.offsetHeight;
      }
    } else {
      y_position = (this.element.offsetHeight - 60) / 2 - (this._popover.offsetHeight / 2);
    }

    this._popover.style.top = `${y_position}px`;
    this._popover.style.left = `${x_position}px`;
    this._popover.innerHTML = `<div class="popover-header"><span
      class="climate_by_location-popover-title">${title}</span>${pinned ? '<button style="background: none; margin-left: auto; margin-right: 0.156rem; height: fit-content; padding: 0.062rem; font-size: 0.781rem; border: none;" data-popover-action="hide" title="Close"><span aria-hidden="true">&#x2715</span></button>' : ''}
    </div>
    <div>${content}</div>`;
    if (pinned) {
      this._popover.querySelectorAll('[data-popover-action="hide"]').forEach((el) => {
        el.addEventListener('click', () => {
          this.request_hide_popover(true)
        })
      });
    }
    return Promise.resolve();
  }

  async request_hide_popover(hide_pinned = false) {
    if (!hide_pinned && this.element.classList.contains('popover-pinned')) {
      return Promise.resolve()
    }
    // requests the popover be hidden, with a 5ms debounce delay during which a request to show can cancel the hiding, thereby reducing flicker.
    this._popover_hide_pending = true;
    return new Promise((resolve, reject) => {
      window.setTimeout(() => {
        if (this._popover_hide_pending) {
          this.element.classList.remove('popover-open', 'popover-pinned');
          resolve();
        } else {
          reject();
        }
      }, 10);
    });
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
  _update_axes_ranges(x_range_min, x_range_max, y_range_min, y_range_max, xannual = false) {
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
    if (xannual) {
      return [...(this.options.x_axis_range || [x_range_min, x_range_max]).map((a) => a + '-01-01'), ...(this.options.y_axis_range || [y_range_min, y_range_max])];
    }
    return [...(this.options.x_axis_range || [x_range_min, x_range_max]), ...(this.options.y_axis_range || [y_range_min, y_range_max])];
  }

  _get_y_axis_layout(y_range_min, y_range_max, variable_config) {

    return {
      type: 'linear',
      range: y_range_min === 0 && y_range_max === 0 ? [0, 20] : [y_range_min, y_range_max],
      showline: true,
      showgrid: true,
      linecolor: 'rgb(0,0,0)',
      linewidth: 1,
      tickcolor: 'rgb(0,0,0)',
      tickfont: {
        // size: this.options.smaller_labels ? 12 : 14,
        size: 20,
        family: `${this.options.font || 'roboto'}, serif`,
        color: 'rgb(0,0,0)'
      },
      // nticks: this.options.smaller_labels ? 16 : 25,
      nticks: 15,
      tickangle: 0,
      automargin: true,
      title: {
        text: variable_config['ytitles']['annual'][this.options.unitsystem],
        standoff: 10,
        font: {
          family: `${this.options.font || 'roboto'}, serif`,
          // size: this.options.smaller_labels ? 15 : 15,
          size: 20,
          color: '#494949'
        }
      }
    };
  }

  _get_x_axis_layout(x_range_min, x_range_max, annual = false) {
    let annual_options = {}
    if (annual) {
      annual_options = {
        // dtick: "M24",
        nticks: 10,
        tickformat: "%Y",
        ticklabelmode: "period",
        type: 'date',
        range: (this.options.x_axis_range || [x_range_min, x_range_max]).map((a) => a + '-01-01'),
        tickfont: {
          // size: this.options.smaller_labels ? 12 : 14,
          size: 20,
          family: `${this.options.font || 'roboto'}, serif`,
          color: 'rgb(0,0,0)'
        }
      }
    }
    return {
      type: 'linear',
      range: (this.options.x_axis_range || [x_range_min, x_range_max]),
      showline: true,
      linecolor: 'rgb(0,0,0)',
      linewidth: 1,
      // dtick: 5,
      nticks: this.options.smaller_labels ? 11 : 15,
      tickcolor: 'rgb(0,0,0)',
      tickfont: {
        size: this.options.smaller_labels ? 10 : 12,
        family: `${this.options.font || 'roboto'}, serif`,
        color: 'rgb(0,0,0)'
      },
      tickangle: 0,
      ...annual_options
    };
  }


  _get_plotly_options() {
    return {displaylogo: false, modeBarButtonsToRemove: ['toImage', 'lasso2d', 'select2d', 'resetScale2d']};
  }


  _show_spinner() {
    this._hide_spinner();
    const styles = [
      '.climatebylocation-spinner { margin-top: -1.562rem; border-radius: 100%;border-style: solid;border-width: 0.156rem;height: 3.125rem;width: 3.125rem;animation: basic 1s infinite linear; border-color: rgba(0, 0, 0, 0.2);border-top-color: rgba(0, 0, 0, 1); }', '@keyframes basic {0%   { transform: rotate(0); }100% { transform: rotate(359.9deg); }}',
      '.climatebylocation-spinner-container {display:flex; flex-flow: column; align-items: center; justify-content: center; background-color: rgba(255,255,255, 0.4); }',
      'climatebylocation-spinner-error span { opacity: 1 !important;} .climatebylocation-spinner-error .climatebylocation-spinner {border-color: red !important; animation: none;}'
    ];
    this.element.style.position = 'relative';
    const spinner_el = document.createElement('div');
    spinner_el.classList.add('climatebylocation-spinner-container');
    spinner_el.style.position = 'absolute';
    spinner_el.style.width = "100%";
    spinner_el.style.height = "100%";
    spinner_el.style.left = '0px';
    spinner_el.style.top = '0px';
    spinner_el.style.zIndex = '1000000';
    spinner_el.innerHTML = `<div class='climatebylocation-spinner'></div><span style="opacity: 0; color: red; margin: 0.625rem;">Failed to retrieve data. Please try again.</span><style>${styles.join('')}</style>`;
    this.element.appendChild(spinner_el)
  }

  _hide_spinner() {
    if (this.element) {
      const spinner_el = this.element.querySelector('.climatebylocation-spinner-container')
      if (spinner_el) {
        this.element.removeChild(spinner_el);
      }
    }
  }

  _show_spinner_error() {
    if (this.element) {
      const spinner_el = this.element.querySelector('.climatebylocation-spinner-container');
      if (spinner_el) {
        spinner_el.classList.add('climatebylocation-spinner-error');
      }
    }
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
  static when_variables({frequency, unitsystem, area_id} = {}) {
    return ClimateByLocationWidget.when_areas({}).then(ClimateByLocationWidget.get_variables.bind(this, {frequency, unitsystem, area_id}))
  }

  /**
   * Gets available variable options for a specified combination of frequency and area_id. If areas are not loaded, returns empty
   *
   * @param frequency
   * @param unitsystem
   * @param area_id
   * @returns {{id: *, title: *}[]}
   */
  static get_variables({frequency, unitsystem, area_id} = {}) {
    unitsystem = unitsystem || 'english';
    let _variables = variables;
    if (frequency && is_monthly(frequency)) {
      _variables = _variables.filter((v) => monthly_variables.includes(v.id))
    }

    return _variables.filter((v) => frequency in v.ytitles && ((typeof v.supports_area === "function" ? v.supports_area(area_id) : true))).map((v) => {
      return {id: v.id, title: v.title[unitsystem]};
    });
  }

  /**
   * Generates an image of the chart and downloads it.
   * @returns {Promise}
   */
  download_image() {
    return new Promise((resolve, reject) => {
      this.request_downloads().then((downloads) => {
        const download = downloads.find((d) => d['filename'].slice(-3) === 'png')
        if (!download) {
          return reject(new Error('Chart image is not available for download'));
        }
        download.download().then(() => resolve())
      })
    });
  }

  /**
   * Download the historic observed data.
   * @returns {Promise<void>}
   */
  download_hist_obs_data() {
    return new Promise((resolve, reject) => {
      this.request_downloads().then((downloads) => {
        const download = downloads.find((d) => d['label'] === 'Observed Data')
        if (!download) {
          return reject(new Error('Observed Data is not available for download'));
        }
        download.download().then(() => resolve())
      })
    });
  }

  /**
   * Download the historic modelled data.
   * @returns {Promise<void>}
   */
  download_hist_mod_data() {
    return new Promise((resolve, reject) => {
      this.request_downloads().then((downloads) => {
        const download = downloads.find((d) => d['label'] === 'Historical Modeled Data')
        if (!download) {
          return reject(new Error('Historical Modeled Data is not available for download'));
        }
        download.download().then(() => resolve())
      })
    });
  }

  /**
   * Download the projected modelled data.
   * @returns {Promise<void>}
   */
  download_proj_mod_data() {
    return new Promise((resolve, reject) => {
      this.request_downloads().then((downloads) => {
        const download = downloads.find((d) => d['label'] === 'Projected Modeled Data')
        if (!download) {
          return reject(new Error('Projected Modeled Data is not available for download'));
        }
        download.download().then(() => resolve())
      })
    });
  }


  /**
   * Gets available frequency options for a specified area.
   *
   * @param area_id
   * @returns {promise<{id: (string), title: (string)}[]>}
   */
  static when_frequencies(area_id) {
    return ClimateByLocationWidget.when_areas({}).then(ClimateByLocationWidget.get_frequencies.bind(this, area_id))
  }

  /**
   * Gets available frequency options for a specified area.
   *
   * @param area_id
   * @returns {{id: (string), title: (string)}[]}
   */
  static get_frequencies(area_id) {
    return frequencies.filter((f) => ((typeof f.supports_area === "function" ? f.supports_area(area_id) : true))).map((v) => {
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
  static when_areas({type = null, state = null, area_id = null} = {}) {
    if (ClimateByLocationWidget._all_areas === null && ClimateByLocationWidget._when_areas === null) {
      ClimateByLocationWidget._when_areas = fetch(ClimateByLocationWidget.areas_json_url).then((response) => response.json()).then(data => {
        if (!data) {
          throw new Error("Failed to retrieve areas!");
        }
        ClimateByLocationWidget._all_areas = data;
      });
    }
    return ClimateByLocationWidget._when_areas.then(ClimateByLocationWidget.get_areas.bind(this, {type, state, area_id}))
  }

  /**
   * Gets available areas based on type or the state they belong to (counties only). If called before areas are loaded, returns empty.
   * @param type {string|null} Area type to filter by. Any of 'state', 'county', 'island'.
   * @param state {string|null} Two-digit abbreviation of state to filter by. Implies type='state'
   * @param area_id {string|null} Area id to filter by. Will never return more than 1 result.
   * @returns array<{area_id, area_label, area_type, state}>
   */
  static get_areas({type = null, state = null, area_id = null} = {}) {
    if (!ClimateByLocationWidget._all_areas) {
      console.error('Areas not yet loaded! Use when_areas() for async access to areas.')
      return [];
    }
    if (!!area_id) {
      area_id = String(area_id).toLowerCase();
      return ClimateByLocationWidget._all_areas.filter((area) => String(area.area_id).toLowerCase() === area_id)
    }
    if (!!state) {
      state = String(state).toUpperCase();
      return ClimateByLocationWidget._all_areas.filter((area) => area['area_type'] === 'county' && area.state === state);
    }
    if (!!type) {
      type = String(type).toLowerCase();
      if (!['state', 'county', 'island', 'forest', 'ecoregion'].includes(type)) {
        throw Error(`Invalid area type "${type}", valid types are 'state','county', 'island', 'forest', and 'ecoregion'`);
      }
      return ClimateByLocationWidget._all_areas.filter((area) => area['area_type'] === type)
    }
    return ClimateByLocationWidget._all_areas;
  }

  /**
   * Gets available areas based on type or the state they belong to (counties only). Returns first area. If called before areas are loaded, returns empty.
   * @param type {string|null} Area type to filter by. Any of 'state', 'county', 'island'.
   * @param state {string|null} Two-digit abbreviation of state to filter by. Implies type='state'
   * @param area_id {string|null} Area id to filter by. Will never return more than 1 result.
   * @returns {area_id, area_label, area_type, state}
   */
  static find_area({type = null, state = null, area_id = null} = {}) {
    const areas = ClimateByLocationWidget.get_areas({type: type, state: state, area_id: area_id});
    return areas.length > 0 ? areas[0] : null;
  }

  /*
   * Private static methods
   */
  static get areas_json_url() {
    return areas_json_url
  }

  static set areas_json_url(value) {
    set_areas_json_url(value)
  }

  static get _when_areas() {
    return _when_areas
  }

  static set _when_areas(value) {
    _when_areas = value
  }

  static get _all_areas() {
    return _all_areas
  }

  static set _all_areas(value) {
    _all_areas = value
  }

  destroy() {
    if (this.view) {
      this.view.destroy();
    }
  }

}

