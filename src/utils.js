/**
 * Performs a rolling window average using the given array, returning a single value.
 * @param collection
 * @param year
 * @param window_size
 * @return {number}
 * @private
 */
import {find, get, mean, range as lodash_range, round} from "../node_modules/lodash-es/lodash.js";

export function rolling_window_average(collection, year, window_size = 10, ignore_nans = true) {
  let _values = lodash_range(window_size).map((x) => get(collection, year - x, Math.NaN))
  if (ignore_nans) {
    _values = _values.filter((y) => Number.isFinite(y))
  }
  return mean(_values)
}


/**
 * Utility function to convert F to C
 * @param f
 * @return {number}
 */
export function fahrenheit_to_celsius(f) {
  return (5 / 9) * (f - 32)
}

/**
 * Utility function to convert F degree days to C degree days
 * @param fdd
 * @return {number}
 */
export function fdd_to_cdd(fdd) {
  return fdd / 9 * 5;
}

/**
 * Utility function inches to mm
 * @param inches
 * @return {number}
 */
export function inches_to_mm(inches) {
  return inches * 25.4;
}

/**
 * Utility function to add an alpha channel to an rgb color. Doesn't play nice with hex colors.
 * @param rgb
 * @param opacity
 * @return {string}
 * @private
 */
export function rgba(rgb, opacity) {
  const [r, g, b] = rgb.split('(').splice(-1)[0].split(')')[0].split(',').slice(0, 3)
  return `rgba(${r},${g},${b},${opacity})`
}


/**
 * This function is used to toggle features based on whether the selected area_id is in Alaska or not.
 *
 * @param area_id
 * @returns {boolean}
 */
export function is_ak_area(area_id) {
  return String(area_id).startsWith('02') || area_id === 'AK'
}

/**
 * This function is used to toggle features based on whether the selected area_id is an island or other non-conus area.
 *
 * @param area_id
 * @returns {boolean}
 */
export function is_island_area(area_id) {
  return get(ClimateByLocationWidget.get_areas({type: null, state: null, area_id: area_id}), [0, 'area_type']) === 'island'
}

export function is_usfs_forest_area(area_id) {
  const area = ClimateByLocationWidget.get_areas({type: null, state: null, area_id: area_id});
  return get(area, [0, 'area_type']) === 'forest'
}

export function is_usfs_forest_ecoregion_area(area_id) {
  const area = ClimateByLocationWidget.get_areas({type: null, state: null, area_id: area_id});
  return get(area, [0, 'area_type']) === 'ecoregion'
}

/**
 * This function is used to toggle features based on whether the selected area_id is a CONUS area.
 *
 * @param area_id
 * @returns {boolean}
 */
export function is_conus_area(area_id) {
  const non_conus_states = ['HI', 'AK'];
  if (non_conus_states.includes(area_id)) {
    return false
  }
  const area = ClimateByLocationWidget.get_areas({type: null, state: null, area_id: area_id});
  return (!(get(area, [0, 'area_type']) === 'island') && !(get(area, [0, 'area_type']) === 'county' && non_conus_states.includes(get(area, [0, 'state']))))
}

export function is_annual(frequency, area_id = null) {
  return frequency === 'annual' || frequency === 'yearly' || frequency === 'decadal'
}

export function is_monthly(frequency, area_id = null) {
  return frequency === 'monthly' || frequency === 'seasonal'
}


export function compute_decadal_means(data, year_col_idx, stat_col_idx, min_year, max_year) {
  min_year = min_year - (min_year % 10);
  max_year = max_year + (10 - (max_year % 10));
  // 2d array for values
  const decadal_values = lodash_range(Math.floor((max_year - min_year) / 10)).map(() => []);
  for (let i = 0; i < data.length; i++) {
    if (data[i][year_col_idx] >= min_year && data[i][year_col_idx] <= max_year) {
      // console.log(data[i][year_col_idx])
      decadal_values[Math.floor((data[i][year_col_idx] - min_year) / 10)].push(data[i][stat_col_idx]);
    }
  }
  return decadal_values.map((_decadal_values) => mean(_decadal_values))
}

export function compute_rolling_window_means(data, year_col_idx, stat_col_idx, min_year, max_year, rolling_window_years) {
  //expand the years to be an exact number of rolling windows
  const _data = data.map(a => a[stat_col_idx])
  const rolling_means = lodash_range(_data.length).map((year_idx) => rolling_window_average(_data, year_idx, rolling_window_years, false));
  // rolling_means.unshift(...lodash_range(rolling_window_years - 1).map(()=>Number.NaN))
  return rolling_means
}

export function format_export_data(column_labels, data, message_row=null, rounding_precision=null) {
  const export_data = [];
  if (message_row !== null){
    export_data.push(message_row);
  }
  if (column_labels !== null){
    export_data.push(column_labels);
  }
  const round_fn = rounding_precision ===null ? (v)=>v : (v)=>round(v, rounding_precision)
  for (const row of data) {
    export_data.push([row[0], row.slice(1).map(round_fn)])
  }

  // return 'data:text/csv;base64,' + window.btoa(export_data.map((a) => a.join(', ')).join('\n'));
  return export_data.map((a) => a.join(', ')).join('\n');
}

export function confidence_interval(n, s) {
  const z = 1.96 // 95% confidence
  s = s / 100;
  return round(z * Math.sqrt((s * (1 - s)) / n) * 100, 1);
}


/**
 * Helper function which handles saving dataurls as files in several browsers.
 *
 * Copied from plotly.js with minimal tweaks https://github.com/plotly/plotly.js/blob/master/src/snapshot/filesaver.js (MIT licensed)
 * Originally based on FileSaver.js  https://github.com/eligrey/FileSaver.js (MIT licensed)
 *
 * @param url
 * @param filename
 */
export async function save_file(url, filename) {
  const saveLink = document.createElement('a');
  const canUseSaveLink = 'download' in saveLink;
  const format = filename.split('.').slice(-1)[0]

  let blob;
  let objectUrl;

  // Copied from https://bl.ocks.org/nolanlawson/0eac306e4dac2114c752
  function fixBinary(b) {
    var len = b.length;
    var buf = new ArrayBuffer(len);
    var arr = new Uint8Array(buf);
    for (var i = 0; i < len; i++) {
      arr[i] = b.charCodeAt(i);
    }
    return buf;
  }

  const IS_DATA_URL_REGEX = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;

  // Copied from https://github.com/plotly/plotly.js/blob/master/src/snapshot/helpers.js

  const createBlob = function (url, format) {
    if (format === 'svg') {
      return new window.Blob([url], {type: 'image/svg+xml;charset=utf-8'});
    } else if (format === 'full-json') {
      return new window.Blob([url], {type: 'application/json;charset=utf-8'});
    } else if (format === 'csv') {
      return new window.Blob([url], {type: 'text/csv;charset=utf-8'});
    } else {
      const binary = fixBinary(window.atob(url));
      return new window.Blob([binary], {type: 'image/' + format});
    }
  };

  const octetStream = function (s) {
    document.location.href = 'data:application/octet-stream' + s;
  };

  const IS_SAFARI_REGEX = /Version\/[\d\.]+.*Safari/;
  // Safari doesn't allow downloading of blob urls
  if (IS_SAFARI_REGEX.test(window.navigator.userAgent)) {
    const prefix = format === 'svg' ? ',' : ';base64,';
    octetStream(prefix + encodeURIComponent(url));
    return filename;
  }

  // IE 10+ (native saveAs)
  if (typeof window.navigator.msSaveBlob !== 'undefined' && !url.match(IS_DATA_URL_REGEX)) {
    // At this point we are only dealing with a decoded SVG as
    // a data URL (since IE only supports SVG)
    blob = createBlob(url, format);
    window.navigator.msSaveBlob(blob, filename);
    blob = null;
    return filename;
  }

  const DOM_URL = window.URL || window.webkitURL;

  if (canUseSaveLink) {
    if (!!url.match(IS_DATA_URL_REGEX)){
      objectUrl = url
    }else {
      blob = createBlob(url, format);
      objectUrl = DOM_URL.createObjectURL(blob)
    }
    saveLink.href = objectUrl;
    saveLink.download = filename;
    document.body.appendChild(saveLink);
    saveLink.click();

    document.body.removeChild(saveLink);
    DOM_URL.revokeObjectURL(objectUrl);
    blob = null;

    return filename;
  }
  throw new Error('download error')

}