import {months} from "./constants.js";
import {get} from "../node_modules/lodash-es/lodash.js";

/* globals jQuery, window, Plotly,jStat, fetch */

export async function get_historical_observed_livneh_data({frequency, unitsystem, data_api_url, variable, variable_config, area}) {
  const {area_id, area_type, area_bbox} = area;
  const unit_conversion_fn = variable_config.unit_conversions[unitsystem];
  const area_params = !!area_bbox ? {bbox: area_bbox} : {[area_type]: area_id}
  const elems = [Object.assign(
    variable_config['acis_elements'][(frequency === 'annual') ? 'annual' : 'monthly'],
    {"area_reduce": !!area_bbox ? 'bbox_mean' : area_type + '_mean'}
  )];
  const response = await (await fetch(data_api_url,
    {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        "sdate": "1950-01-01",
        "edate": "2013-12-31",
        "grid": 'livneh',
        "elems": elems,
        ...area_params
      })
    })).json()
  if (!response) {
    throw new Error(`Failed to retrieve ${frequency} livneh data for ${variable} and area ${area_id}`)
  }

  // transform data
  if (frequency === 'annual') {
    let values = [];
    for (const [key, value] of response.data) {
      if (undefined !== value[area_id] && String(value[area_id]) !== '-999' && String(value[area_id]) !== '') {
        values.push([key, unit_conversion_fn(value[area_id])]);
      }
    }

    return values
  }

  // monthly

  // build output of [month, [values...]].
  let month_values = Object.fromEntries(months.map(m => [m, []]));
  for (const [key, value] of response.data) {
    if (undefined !== value[area_id]) {
      let v = parseFloat(value[area_id]);
      if (v === -999 || !Number.isFinite(v)) {
        v = 0;
      }
      month_values[key.slice(-2)].push([Number.parseInt(key.slice(0, 4)), unit_conversion_fn(v)]);
    }
  }

  return month_values
}


export async function get_historical_annual_loca_model_data({frequency, unitsystem, data_api_url, variable, variable_config, area}) {
  const sdate_year = 1950;
  const edate_year = 2006;

  const sdate = sdate_year + '-01-01';
  const edate = edate_year + '-12-31';
  const unit_conversion_fn = variable_config.unit_conversions[unitsystem]

  const data = await Promise.all([
    fetch_acis_data({grid: 'loca:wMean:rcp85', sdate, edate, frequency, area, data_api_url,  unitsystem, variable_config}),
    fetch_acis_data({grid: 'loca:allMin:rcp85', sdate, edate, frequency, area, data_api_url, unitsystem,  variable_config}),
    fetch_acis_data({grid: 'loca:allMax:rcp85', sdate, edate, frequency, area, data_api_url, unitsystem,  variable_config})
  ]);
  let values = [];
  for (let i = 0; i < edate_year - sdate_year; i++) {
    values.push([i + sdate_year, data[0][1][i], data[1][1][i], data[2][1][i]]);
  }

  return values
}

export async function get_projected_loca_model_data({frequency, unitsystem, data_api_url, variable, variable_config, area}) {
  const sdate_year = frequency === 'monthly' ? 2010 : 2006;
  const sdate = sdate_year + '-01-01';
  const edate_year = 2099;
  const edate = edate_year + '-12-31';


  const data = await Promise.all([
    fetch_acis_data({grid: 'loca:wMean:rcp45', sdate, edate, frequency, area, data_api_url, variable_config, unitsystem}),
    fetch_acis_data({grid: 'loca:allMin:rcp45', sdate, edate, frequency, area, data_api_url, variable_config, unitsystem}),
    fetch_acis_data({grid: 'loca:allMax:rcp45', sdate, edate, frequency, area, data_api_url, variable_config, unitsystem}),
    fetch_acis_data({grid: 'loca:wMean:rcp85', sdate, edate, frequency, area, data_api_url, variable_config, unitsystem}),
    fetch_acis_data({grid: 'loca:allMin:rcp85', sdate, edate, frequency, area, data_api_url, variable_config, unitsystem}),
    fetch_acis_data({grid: 'loca:allMax:rcp85', sdate, edate, frequency, area, data_api_url, variable_config, unitsystem}),
  ]);


  if (frequency === 'annual') {
    for (const [keys, _] of data) {
      if (keys.length !== (edate_year - sdate_year) + 1) {
        throw new Error('Missing years in projected loca data!')
      }
    }

    let values = [];

    for (let i = 0; i < (edate_year - sdate_year) + 1; i++) {
      values.push([i + sdate_year, data[0][1][i], data[1][1][i], data[2][1][i], data[3][1][i], data[4][1][i], data[5][1][i]]);
    }

    return values;
  }

  // monthly

  // build output of {month: [year, rcp45_mean, rcp45_min, rcp45_max, rcp85_mean, rcp85_min, rcp85_max]}.
  let monthly_values = Object.fromEntries(months.map(m => [m, []]));
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
 * @param area
 * @param data_api_url
 * @param variable_config
 * @param unitsystem
 * @return {Promise<[][]>}
 * @private
 */
export async function fetch_acis_data({grid, sdate, edate, frequency, area, data_api_url, variable_config, unitsystem}) {
  const {area_id, area_type, area_bbox} = area;
  const unit_conversion_fn = variable_config.unit_conversions[unitsystem]
  const elems = [Object.assign(
    variable_config['acis_elements'][(frequency === 'annual') ? 'annual' : 'monthly'],
    {"area_reduce": !!area_bbox ? 'bbox_mean' : area_type + '_mean'}
  )];
  const area_params = !!area_bbox ? {bbox: area_bbox} : {[area_type]: area_id}
  const response = await (await fetch(data_api_url, {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(
      {
        "grid": grid,
        "sdate": String(sdate),
        "edate": String(edate),
        "elems": elems,
        ...area_params
      }
    )
  })).json();
  let keys = [];
  let values = [];
  for (const [key, value] of get(response, 'data', [])) {
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
export async function fetch_island_data(variable, area, island_data_url_template) {
  const {area_id} = area;
  const response = await (await fetch(island_data_url_template.replace('{area_id}', area_id), {
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
    // noinspection SpellCheckingInspection
    variable = 'dryday'
  } else if (variable.startsWith('days_t')) {
    variable = variable.replace(/days_(.+?)_.+?_([0-9]+)f/, "$1$2F")
  } else if (variable.startsWith('days_pcpn')) {
    variable = variable.replace(/.+?([0-9]+)in/, "pr$1in")
  } else if (variable.endsWith('_65f')) {
    variable = variable.replace('_65f', '');
  } else if (variable === 'gddmod') {
    // noinspection SpellCheckingInspection
    variable = 'mgdd';
  } else if (variable === 'pcpn') {
    variable = 'precipitation';
  }
  return response.data.filter((series) => series.area_id === area_id && series.variable === variable)
}
