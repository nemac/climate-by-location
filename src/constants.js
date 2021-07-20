import {identity} from "../node_modules/lodash-es/lodash.js";
import {fahrenheit_to_celsius, fdd_to_cdd, inches_to_mm, is_ak_area, is_annual, is_conus_area, is_island_area} from './utils.js';

export const bool_options = ['show_historical_observed', 'show_historical_modeled', 'show_projected_rcp45', 'show_projected_rcp85'];
export const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
export const months_labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const monthly_timeperiods = [2025, 2050, 2075];
export const monthly_variables = ['tmax', 'tmin', 'pcpn'];

export const variables = [
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
      metric: fahrenheit_to_celsius,
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
    supports_frequency: () => true,
    supports_area: () => true,
    rounding_precision: 1
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
      metric: fahrenheit_to_celsius,
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
    supports_frequency:  () => true,
    supports_area: () => true,
    rounding_precision: 1
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
    supports_frequency: is_annual,
    supports_area: is_ak_area,
    rounding_precision: 1
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
    supports_frequency: is_annual,
    supports_area: is_ak_area,
    rounding_precision: 1
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
    supports_frequency: is_annual,
    supports_area: is_ak_area,
    rounding_precision: 1
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
    supports_frequency: is_annual,
    supports_area: is_ak_area
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
    supports_frequency: is_annual,
    supports_area: () => true,
    rounding_precision: 1
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
    supports_frequency: is_annual,
    supports_area: (area_id) => !is_ak_area(area_id),
    rounding_precision: 1
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
    supports_frequency: is_annual,
    supports_area: (area_id) => !is_ak_area(area_id),
    rounding_precision: 1
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
    supports_frequency: is_annual,
    supports_area: (area_id) => !is_ak_area(area_id),
    rounding_precision: 1
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
    supports_frequency: is_annual,
    supports_area: () => true,
    rounding_precision: 1
  },
  {
    id: "days_tmax_lt_50f",
    title: {
      english: "Days per year with max below 50°F",
      metric: "Days per year with max below 10°C"
    },
    acis_elements: {
      annual: {
        "name": "maxt",
        "interval": "yly",
        "duration": "yly",
        "reduce": "cnt_lt_50"

      }
    },
    unit_conversions: {
      metric: identity,
      english: identity
    },
    ytitles: {
      annual: {
        english: "Days per year with max below 50°F",
        metric: "Days per year with max below 10°C"
      }
    },
    supports_frequency: is_annual,
    supports_area: is_island_area,
    rounding_precision: 1
  },
  {
    id: "days_tmax_lt_65f",
    title: {
      english: "Days per year with max below 65°F",
      metric: "Days per year with max below 18.3°C"
    },
    acis_elements: {
      annual: {
        "name": "maxt",
        "interval": "yly",
        "duration": "yly",
        "reduce": "cnt_lt_65"

      }
    },
    unit_conversions: {
      metric: identity,
      english: identity
    },
    ytitles: {
      annual: {
        english: "Days per year with max below 65°F",
        metric: "Days per year with max below 18.3°C"
      }
    },
    supports_frequency: is_annual,
    supports_area: is_island_area,
    rounding_precision: 1
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
    supports_frequency: is_annual,
    supports_area: () => true,
    rounding_precision: 1
  },
  {
    id: "days_tmin_lt_65f",
    title: {
      english: "Days per year with min below 65°F",
      metric: "Days per year with min below 18.3°C"
    },
    acis_elements: {
      annual: {
        "name": "mint",
        "interval": "yly",
        "duration": "yly",
        "reduce": "cnt_lt_65"
      }
    },
    unit_conversions: {
      metric: identity,
      english: identity
    },
    ytitles: {
      annual: {
        english: "Days per year with min below 65°F",
        metric: "Days per year with min below 18.3°C"
      }
    },

    supports_frequency: is_annual,

    supports_area: is_island_area,
    rounding_precision: 1
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
    supports_frequency: is_annual,
    supports_area: is_ak_area,
    rounding_precision: 1
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
        "reduce": "cnt_gt_60"

      },
      monthly: {
        "name": "mint",
        "interval": "mly",
        "duration": "mly",
        "reduce": "cnt_gt_60"
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
    supports_frequency: is_annual,
    supports_area: is_ak_area,
    rounding_precision: 1
  },
  {
    id: "days_tmin_gt_75f",
    title: {
      english: "Days per year with min above 75°F",
      metric: "Days per year with min above 23.8°C"
    },
    acis_elements: {
      annual: {
        "name": "mint",
        "interval": "yly",
        "duration": "yly",
        "reduce": "cnt_gt_75"

      },
      monthly: {
        "name": "mint",
        "interval": "mly",
        "duration": "mly",
        "reduce": "cnt_gt_75"
      }
    },
    unit_conversions: {
      metric: identity,
      english: identity
    },
    ytitles: {
      annual: {
        english: "Days per year with min above 75°F",
        metric: "Days per year with min above 23.8°C"
      }
    },
    supports_frequency: is_annual,
    supports_area: is_island_area,
    rounding_precision: 1
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
    supports_frequency: is_annual,
    supports_area: (area_id) => !is_ak_area(area_id),
    rounding_precision: 1
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
    supports_frequency: is_annual,
    supports_area: (area_id) => !is_ak_area(area_id),
    rounding_precision: 1
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
      metric: fdd_to_cdd,
      english: identity
    },
    ytitles: {
      annual: {
        english: "Heating Degree Days (°F-days)",
        metric: "Heating Degree Days (°C-days)"
      }
    },
    supports_frequency: is_annual,
    supports_area: () => true,
    rounding_precision: -2
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
      metric: fdd_to_cdd,
      english: identity
    },
    ytitles: {
      annual: {
        english: "Cooling Degree Days (°F-days)",
        metric: "Cooling Degree Days (°C-days)"
      }
    },
    supports_frequency: is_annual,
    supports_area: () => true,
    rounding_precision: -2
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
    supports_frequency: is_annual,
    supports_area: () => true,
    rounding_precision: -2
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
    supports_frequency: is_annual,
    supports_area: (area_id) => is_conus_area(area_id) || is_island_area(area_id),
    rounding_precision: -2
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
      metric: fdd_to_cdd,
      english: identity
    },
    ytitles: {
      annual: {
        english: "Thawing Degree Days (°F-days)",
        metric: "Thawing Degree Days (°C-days)"
      }
    },
    supports_frequency: is_annual,
    supports_area: is_ak_area,
    rounding_precision: -2
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
      metric: fdd_to_cdd,
      english: identity
    },
    ytitles: {
      annual: {
        english: "Freezing Degree Days (°F-days)",
        metric: "Freezing Degree Days (°C-days)"
      }
    },
    supports_frequency: is_annual,
    supports_area: is_ak_area,
    rounding_precision: -2
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
      metric: inches_to_mm,
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
    supports_frequency:  () => true,
    supports_area: () => true,
    rounding_precision: 2
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
    supports_frequency: is_annual,
    supports_area: () => true,
    rounding_precision: 1
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
    supports_frequency: is_annual,
    supports_area: is_ak_area,
    rounding_precision: 1
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
    supports_frequency: is_annual,
    supports_area: () => true,
    rounding_precision: 1
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
    supports_frequency: is_annual,
    supports_area: () => true,
    rounding_precision: 1
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
    supports_frequency: is_annual,
    supports_area: () => true,
    rounding_precision: 1
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
    supports_frequency: is_annual,
    supports_area: (area_id) => !is_ak_area(area_id),
    rounding_precision: 1
  },
  {
    id: "days_pcpn_gt_5in",
    title: {
      english: "Days per year with more than 5in precip",
      metric: "Days per year with more than 127mm precip"
    },
    acis_elements: {
      annual: {
        "name": "pcpn",
        "interval": "yly",
        "duration": "yly",
        "reduce": "cnt_gt_5"
      }
    },
    unit_conversions: {
      metric: identity,
      english: identity
    },
    ytitles: {
      annual: {
        english: "Days per year with more than 5in precip",
        metric: "Days per year with more than 127mm precip"
      }
    },
    supports_frequency: is_annual,
    supports_area: is_island_area,
    rounding_precision: 1
  }
];

export const frequencies = [
  {
    id: 'annual',
    title: 'Annual',
    supports_area: () => true
  },
  {
    id: 'monthly',
    title: 'Monthly',
    supports_area: (area_id) => is_conus_area(area_id) || is_island_area(area_id)
  }
];

export let areas_json_url = window.climate_by_location_config && window.climate_by_location_config.areas_json_url ? window.climate_by_location_config.areas_json_url : 'all_areas.json';
export let data_api_url = window.climate_by_location_config && window.climate_by_location_config.data_api_url ? window.climate_by_location_config.data_api_url :  'https://grid2.rcc-acis.org/GridData';
export let island_data_url_template = window.climate_by_location_config && window.climate_by_location_config.island_data_url_template ? window.climate_by_location_config.island_data_url_template :  'https://climate-by-location.nemac.org/island_data/{area_id}.json';

export function set_areas_json_url(value) {
  areas_json_url = value
}