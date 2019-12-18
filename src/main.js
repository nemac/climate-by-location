'use strict';
import "core-js/stable";
import "regenerator-runtime/runtime";
import {
  find,
  get,
  max,
  mean,
  merge,
  min,
  range as lodash_range,
  round
} from 'lodash-es';


/* globals jQuery, window */
export default class ClimateByLocationWidget {
  /**
   *
   *
   * 'county'         : selectedCounty,       // 5-character fips code for county
   * 'frequency'    : selectedFrequency,    // time frequency of graph to display ("annual", "monthly", or "seasonal")
   * 'timeperiod'   : selectedTimePeriod,   // time period center for monthly/seasonal graphs ("2025", "2050", or "2075"); only
   * relevant for monthly or seasonal frequency)
   * 'variable'     : selectedVariable,     // name of variable to display; see climate-by-location.js for list of variables
   * 'scenario'     : selectedScenario,     // name of scenario to display: "both", "rcp45", or "rcp85"
   * 'presentation' : selectedPresentation  // name of presentation; "absolute" or "anomaly" (only relevant for annual frequency)
   * 'div'           :  "div#widget",         // jquery-style selector for the dom element that you want the graph to appear in
   * 'font'          : 'Roboto',
   * 'frequency'     :  $('#frequency').val(),    // time frequency of graph to display ("annual", "monthly", or "seasonal")
   * 'timeperiod'    :  selectedTimePeriod,   // time period center for monthly/seasonal graphs ("2025", "2050", or "2075")
   * 'county'          :  selectedCounty,       // 5-character fips code for county (as a string)
   * 'state'          :  selectedState,       // 2-character abbreviation code for state (as a string)
   * 'variable'      :  selectedVariable,     // name of variable to display; see climate-by-location.js for list of variables
   * 'scenario'      :  selectedScenario,     // name of scenario to display; both, rcp45, or rcp85
   * 'presentation'  :  selectedPresentation  // name of presentation; absolute or anomaly with respect to a baseline value
   * required:
   * state or county
   *
   * optional, but no default provided:
   * font  (defaults to whatever the browser's default canvas font is)
   *
   * optional, with defaults provided:
   * unitsystem        ("english")
   * frequency         ("annual")
   * variable          ("tmax")
   * presentation      ("absolute")
   * scenario          ("both")
   * timeperiod        ("2025")
   *
   * @param element
   * @param options
   */
  constructor(element, options = {}) {
    this.options = merge({}, this.config_default, options);
    this.element = element;
    this.$element = $(this.element);
    if (!element) {
      console.log('Climate By Location widget created with no element. Nothing will be displayed.');
    }
    this.dataurls = null;
    this.multigraph = null;
    this.multigraph_config = merge(this.multigraph_config_default, {
      plots: this.plots_config.map((c) => c.plot_config),
      data: this._data_layout_config.map((c) => c.data_config)
    });
    this.$element.html(`<div class='graph' style='width: 100%; height: 100%;'></div>`);
    $('.errorDisplayDetails').remove();
    this.$graphdiv = this.$element.find('div.graph');
    this.$graphdiv.multigraph({
      muglString: this.multigraph_config,
      noscroll: true
    });
    $(window).resize(this.resize.bind(this));
    this.resolve_multigraph = null;
    this.when_multigraph = new Promise((resolve) => {
      this.resolve_multigraph = resolve;
    });
    this.$graphdiv.multigraph('done', ((multigraph) => {
      this.multigraph = multigraph;
      this.resolve_multigraph(multigraph)
    }).bind(this));

    this.when_multigraph.then(() => {
      this.axes = {
        x_annual: this.multigraph.graphs().at(0).axes().at(0),
        x_monthly: this.multigraph.graphs().at(0).axes().at(1),
        x_seasonal: this.multigraph.graphs().at(0).axes().at(2),
        y: this.multigraph.graphs().at(0).axes().at(3)
      };

      this.axes.x_annual.addListener('dataRangeSet', ((e) => {
        if (this.options.xrangefunc) {
          let min = Math.ceil(e.min.getRealValue());
          let max = Math.floor(e.max.getRealValue());
          this.options.xrangefunc(min, max);
        }
      }).bind(this));
      this.update();
    });
  }

  static get variables() {
    return [
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
        dataconverters: {
          metric: fahrenheit_to_celsius,
          english: no_conversion
        },
        ytitles: {
          annual: {
            absolute: {
              english: "Average Daily Max Temp (°F)",
              metric: "Average Daily Max Temp (°C)"
            },
            anomaly: {
              english: "Average Daily Max Temp departure (°F)",
              metric: "Average Daily Max Temp departure (°C)"
            }
          },
          monthly: {
            english: "Average Daily Max Temp (°F)",
            metric: "Average Daily Max Temp (°C)"
          },
          seasonal: {
            english: "Average Daily Max Temp (°F)",
            metric: "Average Daily Max Temp (°C)"
          }
        },
        supports_region: () => true
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
        dataconverters: {
          metric: fahrenheit_to_celsius,
          english: no_conversion
        },
        ytitles: {
          annual: {
            absolute: {
              english: "Average Daily Min Temp (°F)",
              metric: "Average Daily Min Temp (°C)"
            },
            anomaly: {
              english: "Average Daily Min Temp departure (°F)",
              metric: "Average Daily Min Temp departure (°C)"
            }
          },
          monthly: {
            english: "Average Daily Min Temp (°F)",
            metric: "Average Daily Min Temp (°C)"
          },
          seasonal: {
            english: "Average Daily Min Temp (°F)",
            metric: "Average Daily Min Temp (°C)"
          }
        },
        supports_region: () => true
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
        dataconverters: {
          metric: no_conversion,
          english: no_conversion
        },
        ytitles: {
          annual: {
            absolute: {
              english: "Days per year with max above 50°F",
              metric: "Days per year with max above 10°C"
            },
            anomaly: {
              english: "Days per year with max above 50°F",
              metric: "Days per year with max above 10°C"
            }
          }
        },
        supports_region: ClimateByLocationWidget.is_ak_region
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
        dataconverters: {
          metric: no_conversion,
          english: no_conversion
        },
        ytitles: {
          annual: {
            absolute: {
              english: "Days per year with max above 60°F",
              metric: "Days per year with max above 15.5°C"
            },
            anomaly: {
              english: "Days per year with max above 60°F",
              metric: "Days per year with max above 15.5°C"
            }
          }
        },
        supports_region: ClimateByLocationWidget.is_ak_region
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
        dataconverters: {
          metric: no_conversion,
          english: no_conversion
        },
        ytitles: {
          annual: {
            absolute: {
              english: "Days per year with max above 70°F",
              metric: "Days per year with max above 21.1°C"
            },
            anomaly: {
              english: "Days per year with max above 70°F",
              metric: "Days per year with max above 21.1°C"
            }
          }
        },
        supports_region: ClimateByLocationWidget.is_ak_region
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
        dataconverters: {
          metric: no_conversion,
          english: no_conversion
        },
        ytitles: {
          annual: {
            absolute: {
              english: "Days per year with max above 80°F",
              metric: "Days per year with max above 26.6°C"
            },
            anomaly: {
              english: "Days per year with max above 80°F",
              metric: "Days per year with max above 26.6°C"
            }
          }
        },
        supports_region: ClimateByLocationWidget.is_ak_region
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
        dataconverters: {
          metric: no_conversion,
          english: no_conversion
        },
        ytitles: {
          annual: {
            absolute: {
              english: "Days per year with max above 90°F",
              metric: "Days per year with max above 32.2°C"
            },
            anomaly: {
              english: "Days per year with max above 90°F",
              metric: "Days per year with max above 32.2°C"
            }
          }
        },
        supports_region: () => true
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
        dataconverters: {
          metric: no_conversion,
          english: no_conversion
        },
        ytitles: {
          annual: {
            absolute: {
              english: "Days per year with max above 95°F",
              metric: "Days per year with max above 35°C"
            },
            anomaly: {
              english: "Days per year with max above 95°F departure",
              metric: "Days per year with max above 35°C departure"
            }
          }
        },
        supports_region: (region) => !ClimateByLocationWidget.is_ak_region(region)
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
        dataconverters: {
          metric: no_conversion,
          english: no_conversion
        },
        ytitles: {
          annual: {
            absolute: {
              english: "Days per year with max above 100°F",
              metric: "Days per year with max above 37.7°C"
            },
            anomaly: {
              english: "Days per year with max above 100°F",
              metric: "Days per year with max above 37.7°C"
            }
          }
        },
        supports_region: (region) => !ClimateByLocationWidget.is_ak_region(region)
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
        dataconverters: {
          metric: no_conversion,
          english: no_conversion
        },
        ytitles: {
          annual: {
            absolute: {
              english: "Days per year with max above 105°F",
              metric: "Days per year with max above 40.5°C"
            },
            anomaly: {
              english: "Days per year with max above 105°F departure",
              metric: "Days per year with max above 40.5°C departure"
            }
          }
        },
        supports_region: (region) => !ClimateByLocationWidget.is_ak_region(region)
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
        dataconverters: {
          metric: no_conversion,
          english: no_conversion
        },
        ytitles: {
          annual: {
            absolute: {
              english: "Days per year with max below 32°F (Icing days)",
              metric: "Days per year with max below 0°C (Icing days)"
            },
            anomaly: {
              english: "Days per year with max below 32°F departure",
              metric: "Days per year with max below 0°C departure"
            }
          }
        },
        supports_region: () => true
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
        dataconverters: {
          metric: no_conversion,
          english: no_conversion
        },
        ytitles: {
          annual: {
            absolute: {
              english: "Days per year with min below 32°F (frost days)",
              metric: "Days per year with min below 0°C (frost days)"
            },
            anomaly: {
              english: "Days per year with min below 32°F (frost days)",
              metric: "Days per year with min below 0°C (frost days)"
            }
          }
        },
        supports_region: () => true
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
        dataconverters: {
          metric: no_conversion,
          english: no_conversion
        },
        ytitles: {
          annual: {
            absolute: {
              english: "Days per year with min below -40°F",
              metric: "Days per year with min below -40°C"
            },
            anomaly: {
              english: "Days per year with min below -40°F",
              metric: "Days per year with min below -40°C"
            }
          }
        },
        supports_region: ClimateByLocationWidget.is_ak_region
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
            "reduce": "cnt_gt_80"

          },
          monthly: {
            "name": "mint",
            "interval": "mly",
            "duration": "mly",
            "reduce": "cnt_gt_80"

          }
        },
        dataconverters: {
          metric: no_conversion,
          english: no_conversion
        },
        ytitles: {
          annual: {
            absolute: {
              english: "Days per year with min above 60°F",
              metric: "Days per year with min above 15.5°C"
            },
            anomaly: {
              english: "Days per year with min above 60°F departure",
              metric: "Days per year with min above 15.5°C departure"
            }
          }
        },
        supports_region: ClimateByLocationWidget.is_ak_region
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
        dataconverters: {
          metric: no_conversion,
          english: no_conversion
        },
        ytitles: {
          annual: {
            absolute: {
              english: "Days per year with min above 80°F",
              metric: "Days per year with min above 26.6°C"
            },
            anomaly: {
              english: "Days per year with min above 80°F departure",
              metric: "Days per year with min above 26.6°C departure"
            }
          }
        },
        supports_region: (region) => !ClimateByLocationWidget.is_ak_region(region)
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
        dataconverters: {
          metric: no_conversion,
          english: no_conversion
        },
        ytitles: {
          annual: {
            absolute: {
              english: "Days per year with min above 90°F",
              metric: "Days per year with min above 32.2°C"
            },
            anomaly: {
              english: "Days per year with min above 90°F departure",
              metric: "Days per year with min above 32.2°C departure"
            }
          }
        },
        supports_region: (region) => !ClimateByLocationWidget.is_ak_region(region)
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
        dataconverters: {
          metric: fdd_to_cdd,
          english: no_conversion
        },
        ytitles: {
          annual: {
            absolute: {
              english: "Heating Degree Days (°F-days)",
              metric: "Heating Degree Days (°C-days)"
            },
            anomaly: {
              english: "Heating Degree Days departure (°F-days)",
              metric: "Heating Degree Days departure (°C-days)"
            }
          }
        },
        supports_region: () => true
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
        dataconverters: {
          metric: fdd_to_cdd,
          english: no_conversion
        },
        ytitles: {
          annual: {
            absolute: {
              english: "Cooling Degree Days (°F-days)",
              metric: "Cooling Degree Days (°C-days)"
            },
            anomaly: {
              english: "Cooling Degree Days departure (°F-days)",
              metric: "Cooling Degree Days departure (°C-days)"
            }
          }
        },
        supports_region: () => true
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
        dataconverters: {
          metric: no_conversion,
          english: no_conversion
        },
        ytitles: {
          annual: {
            absolute: {
              english: "Growing Degree Days (°F-days)",
              metric: "Growing Degree Days (°C-days)"
            },
            anomaly: {
              english: "Growing Degree Days departure (°F-days)",
              metric: "Growing Degree Days departure (°C-days)"
            }
          }
        },
        supports_region: () => true
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
        dataconverters: {
          metric: no_conversion,
          english: no_conversion
        },
        ytitles: {
          annual: {
            absolute: {
              english: "Modified Growing Degree Days (°F-days)",
              metric: "Modified Growing Degree Days (°C-days)"
            },
            anomaly: {
              english: "Modified Growing Degree Days departure (°F-days)",
              metric: "Modified Growing Degree Days departure (°C-days)"
            }
          }
        },
        supports_region: () => true
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
        dataconverters: {
          metric: fdd_to_cdd,
          english: no_conversion
        },
        ytitles: {
          annual: {
            absolute: {
              english: "Thawing Degree Days (°F-days)",
              metric: "Thawing Degree Days (°C-days)"
            },
            anomaly: {
              english: "Thawing Degree Days departure (°F-days)",
              metric: "Thawing Degree Days departure (°C-days)"
            }
          }
        },
        supports_region: ClimateByLocationWidget.is_ak_region
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
        dataconverters: {
          metric: fdd_to_cdd,
          english: no_conversion
        },
        ytitles: {
          annual: {
            absolute: {
              english: "Freezing Degree Days (°F-days)",
              metric: "Freezing Degree Days (°C-days)"
            },
            anomaly: {
              english: "Freezing Degree Days departure (°F-days)",
              metric: "Freezing Degree Days departure (°C-days)"
            }
          }
        },
        supports_region: ClimateByLocationWidget.is_ak_region
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
        dataconverters: {
          metric: inches_to_mm,
          english: no_conversion
        },
        ytitles: {
          annual: {
            absolute: {
              english: "Total Precipitation (in.)",
              metric: "Total Precipitation"
            },
            anomaly: {
              english: "Total Precipitation departure (%)",
              metric: "Total Precipitation departure (%)"
            }
          },
          monthly: {
            english: "Total Precipitation (in.)",
            metric: "Total Precipitation"
          },
          seasonal: {
            english: "Total Precipitation (in.)",
            metric: "Total Precipitation"
          }
        },
        supports_region: () => true
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
        dataconverters: {
          metric: no_conversion,
          english: no_conversion
        },
        ytitles: {
          annual: {
            absolute: {
              english: "Dry Days (days/period)",
              metric: "Dry Days (days/period)"
            },
            anomaly: {
              english: "Dry Days (days/period)",
              metric: "Dry Days (days/period)"
            }
          },
          seasonal: {
            english: "Dry Days (days/period)",
            metric: "Dry Days (days/period)"
          }
        },
        supports_region: () => true
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
        dataconverters: {
          metric: no_conversion,
          english: no_conversion
        },
        ytitles: {
          annual: {
            absolute: {
              english: "Days per year with more than 0.25in precipitation",
              metric: "Days per year with more than 6.35mm precipitation"
            },
            anomaly: {
              english: "Days per year with more than 0.25in precipitation departure",
              metric: "Days per year with more than 6.35mm precipitation departure"
            }
          }

        },
        supports_region: ClimateByLocationWidget.is_ak_region
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
        dataconverters: {
          metric: no_conversion,
          english: no_conversion
        },
        ytitles: {
          annual: {
            absolute: {
              english: "Days per year with more than 1in precip",
              metric: "Days per year with more than 25.3mm precip"
            },
            anomaly: {
              english: "Days per year with more than 1in precip departure",
              metric: "Days per year with more than 25.3mm precip departure"
            }
          }

        },
        supports_region: () => true
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
        dataconverters: {
          metric: no_conversion,
          english: no_conversion
        },
        ytitles: {
          annual: {
            absolute: {
              english: "Days per year with more than 2in precip",
              metric: "Days of Precipitation Above 50.8mm"
            },
            anomaly: {
              english: "Days per year with more than 2in precip departure",
              metric: "Days of Precipitation Above 50.8mm departure"
            }
          }

        },
        supports_region: () => true
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
        dataconverters: {
          metric: no_conversion,
          english: no_conversion
        },
        ytitles: {
          annual: {
            absolute: {
              english: "Days per year with more than 3in precip",
              metric: "Days per year with more than 76.2mm precip"
            },
            anomaly: {
              english: "Days per year with more than 3in precip departure",
              metric: "Days per year with more than 76.2mm precip departure"
            }
          }
        },
        supports_region: () => true
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
        dataconverters: {
          metric: no_conversion,
          english: no_conversion
        },
        ytitles: {
          annual: {
            absolute: {
              english: "Days per year with more than 4in precip",
              metric: "Days per year with more than 101.6mm precip"
            },
            anomaly: {
              english: "Days per year with more than 4in precip departure",
              metric: "Days per year with more than 101.6mm precip departure"
            }
          }
        },
        supports_region: (region) => !ClimateByLocationWidget.is_ak_region(region)
      }
    ];
  }

  static get frequencies() {
    return [
      {
        id: 'annual',
        title: 'Annual',
        supports_region: () => true
      },
      {
        id: 'monthly',
        title: 'Monthly',
        supports_region: (region) => !ClimateByLocationWidget.is_ak_region(region)
      },
      {
        id: 'seasonal',
        title: 'Seasonal',
        supports_region: (region) => !ClimateByLocationWidget.is_ak_region(region)
      },
    ]
  }

  get _bool_options() {
    return ['pmedian', 'hmedian', 'histobs', 'histmod', 'yzoom', 'ypan']
  }

  /**
   * The default config for the widget
   */
  get config_default() {
    return {
      // default values:
      unitsystem: "english",
      variable: "tmax",
      frequency: "annual",
      scenario: "both",
      timeperiod: "2025",
      presentation: "absolute",
      hrange: "minmax", // deprecated
      prange: "minmax", // deprecated
      pmedian: false,
      hmedian: false,
      histobs: true,
      histmod: true,
      yzoom: true,
      ypan: true,
      data_api_endpoint: 'https://grid2.rcc-acis.org/GridData',
      colors: {
        reds: {
          line: '#f5442d',
          innerBand: '#f65642',
          outerBand: '#f76956'
        },
        blues: {
          line: '#0058cf',
          innerBand: '#1968d3',
          outerBand: '#3279d8'
        },
        grays: {
          innerBand: "#aaaaaa",
          outerBand: "#bbbbbb"
          //original hard-coded values
          //innerBand: "#999999",
          //outerBand: "#cccccc"
        },
        opacities: {
          ann_hist_1090: 0.6,
          ann_hist_minmax: 0.6,
          ann_proj_1090: 0.5,
          ann_proj_minmax: 0.5,
          mon_proj_1090: 0.5,
          mon_proj_minmax: 0.5
          //original hard-coded values
          //ann_hist_1090: 0.5,
          //ann_hist_minmax: 0.7,
          //ann_proj_1090: 0.3,
          //ann_proj_minmax: 0.3,
          //mon_proj_1090: 0.3,
          //mon_proj_minmax: 0.3,
        }
      },
      //font: no default for this one; defaults to canvas's default font
      county: null,
      state: null,
      get_region_label: this.get_region_value.bind(this),
      // Data ranges will get scaled by this factor when setting y axis ranges.
      // Previously was 1.1, but set to 1 now to avoid awkard negative values for
      // things that can never be negative.
      yAxisRangeScaleFactor: 1
    };
  }

  /**
   * The default config template for multigraph
   */
  get multigraph_config_default() {
    return {
      legend: false,
      window: {
        border: 0,
        padding: 0,
        margin: 0
      }, /*
        background: {
            img : {
               src: "demo.png",
               anchor: [0, 0],
               base: [0, 0],
               frame: "padding"
          }
        }, */
      plotarea: {
        marginleft: 55,
        marginright: 0
      },
      horizontalaxis: [{
        id: "x_annual",
        min: 1949.5,
        max: 2099.5,
        title: false, // { text: "Year" },
        visible: true,
        labels: {
          label: [
            {format: "%1d", spacing: [100, 50, 20, 10, 5, 2, 1]}
          ]
        },
        pan: {
          min: 1949.5,
          max: 2099.5
        },
        zoom: {
          min: "10Y",
          max: "151Y"
        },
        grid: true
      }, {
        id: "x_monthly",
        min: -2,
        max: 12,
        title: false, // { text: "Month" },
        visible: false,
        labels: {
          label: [{
            format: ["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"],
            spacing: [1]
          }]
        },
        pan: {
          allowed: "no"
        },
        zoom: {
          allowed: "no"
        },
        grid: true
      }, {
        id: "x_seasonal",
        min: -0.5,
        max: 3.5,
        title: false, // { text: "Season" },
        visible: false,
        labels: {
          label: [{
            format: ["Winter", "Spring", "Summer", /* or */ "Fall"],
            /*        all you have to do is call... */
            spacing: [1]
          }]
        },
        pan: {
          allowed: "no"
        },
        zoom: {
          allowed: "no"
        }
        /*            pan: {
                      min: -0.5,
                      max: 3.5
                    },
                    zoom: {
                      min: 1,
                      max: 4
                    }
        */
      }],
      verticalaxis: {
        id: "y",
        min: 0,
        max: 2000,
        grid: true,
        title: {text: " ", angle: 90, anchor: [0, -1], position: [-40, 0]},
        visible: true,
        labels: {
          label: [
            {
              format: "%1d",
              spacing: [10000, 5000, 2000, 1000, 500, 200, 100, 50, 20, 10, 5, 2, 1]
            },
            {format: "%.1f", spacing: [0.5, 0.2, 0.1]},
            {format: "%.2f", spacing: [0.05, 0.02, 0.01]}
          ]
        },
        pan: {
          allowed: "yes",
          min: -7500.5,
          max: 10000.5
        },
        zoom: {
          allowed: "yes",
          min: 0.05,
          max: 10000
        }
      },
      plots: [],
      data: []
    };
  }

  /**
   * Gets configuration for plots in the form [{frequency, regime, stat, scenario, timeperiod, plot_index,  plot_config}...]
   * @returns {*[]|*}
   */
  get plots_config() {
    if (!this._plots_config) {
      // shorthand to create a band plot config
      function band_plot(x_axis, x, y_axis, y0, y1, fill_color, fill_opacity) {
        let plot = {
          visible: false,
          horizontalaxis: {}, // populated below
          verticalaxis: {}, // populated below
          style: "band",
          options: {
            fillcolor: fill_color,
            fillopacity: fill_opacity,
            linewidth: 0
          }
        };
        // must use [] notation here since keys are variables:
        plot.horizontalaxis[x_axis] = x;
        plot.verticalaxis[y_axis] = [y0, y1];
        return plot;
      }

      // shorthand for a bar plot config at a specified y reference line
      function bar_plot_based_at(x_axis, x, y_axis, y, ref) {
        // (colors are hard-coded in this one, but not for any good reason)
        let plot = {
          visible: false,
          horizontalaxis: {}, // populated below
          verticalaxis: {}, // populated below
          style: "bar",
          options: {
            barbase: ref,
            fillcolor: [{"value": "0x777777", "min": ref},
              {"value": "0x777777", "max": ref}],
            barwidth: 1,
            baroffset: 0.5,
            linecolor: "#000000",
            hidelines: 999
          }
        };
        // must use [] notation here since keys are variables:
        plot.horizontalaxis[x_axis] = x;
        plot.verticalaxis[y_axis] = y;
        return plot;
      }

      // shorthand to create a line plot config
      function line_plot(x_axis, x, y_axis, y, line_color, dashed) {
        let plot = {
          visible: false,
          horizontalaxis: {}, // populated below
          verticalaxis: {}, // populated below
          style: "line",
          options: {
            linecolor: line_color,
            linestroke: dashed ? "dashed" : "solid",
            linewidth: 2
          }
        };
        // must use [] notation here since keys are variables:
        plot.horizontalaxis[x_axis] = x;
        plot.verticalaxis[y_axis] = y;
        return plot;
      }

      // shorthand to create a range bar plot config
      function range_bar_plot(x_axis, x, y_axis, y0, y1, bar_color, line_color, baroffset, fillopacity) {
        let plot = {
          horizontalaxis: {}, // populated below
          verticalaxis: {}, // populated below
          style: "rangebar",
          options: {
            fillcolor: bar_color,
            fillopacity: fillopacity,
            barwidth: 0.5,
            baroffset: baroffset,
            linecolor: line_color
          }
        };
        // must use [] notation here since keys are variables:
        plot.horizontalaxis[x_axis] = x;
        plot.verticalaxis[y_axis] = [y0, y1];
        return plot;
      }

      // shorthand to create a plot config record
      function p(plot_config, frequency = null, regime = null, stat = null, scenario = null, timeperiod = null, region = null, plot_index = -1) {
        return {
          plot_config: plot_config,
          frequency: frequency,
          regime: regime,
          stat: stat,
          scenario: scenario,
          timeperiod: timeperiod,
          region: region,
          plot_index: plot_index
        }
      }

      this._plots_config = [
        //
        // annual CONUS plots:
        //
        p(band_plot("x_annual", "annual_hist_mod_x", "y", "annual_hist_mod_min", "annual_hist_mod_max", this.options.colors.grays.outerBand, this.options.colors.opacities.ann_hist_minmax), "annual", "hist_mod", "minmax"),
        p(band_plot("x_annual", "annual_hist_mod_x", "y", "annual_hist_mod_p10", "annual_hist_mod_p90", this.options.colors.grays.innerBand, this.options.colors.opacities.ann_hist_1090), "annual", "hist_mod", "p1090"),
        p(band_plot("x_annual", "annual_proj_mod_x", "y", "annual_proj_mod_min_rcp45", "annual_proj_mod_max_rcp45", this.options.colors.blues.outerBand, this.options.colors.opacities.ann_proj_minmax), "annual", "proj_mod", "minmax", "rcp45"),
        p(band_plot("x_annual", "annual_proj_mod_x", "y", "annual_proj_mod_p10_rcp45", "annual_proj_mod_p90_rcp45", this.options.colors.blues.innerBand, this.options.colors.opacities.ann_proj_1090), "annual", "proj_mod", "p1090", "rcp45"),
        p(band_plot("x_annual", "annual_proj_mod_x", "y", "annual_proj_mod_min_rcp85", "annual_proj_mod_max_rcp85", this.options.colors.reds.outerBand, this.options.colors.opacities.ann_proj_minmax), "annual", "proj_mod", "minmax", "rcp85"),
        p(band_plot("x_annual", "annual_proj_mod_x", "y", "annual_proj_mod_p10_rcp85", "annual_proj_mod_p90_rcp85", this.options.colors.reds.innerBand, this.options.colors.opacities.ann_proj_1090), "annual", "proj_mod", "p1090", "rcp85"),
        p(bar_plot_based_at("x_annual", "annual_hist_obs_x", "y", "annual_hist_obs_y", 0), "annual", "hist_obs"),
        p(line_plot("x_annual", "annual_hist_mod_x", "y", "annual_hist_mod_med", "#000000"), "annual", "hist_mod", "med"),
        p(line_plot("x_annual", "annual_proj_mod_x", "y", "annual_proj_mod_med_rcp45", this.options.colors.blues.line), "annual", "proj_mod", "med", "rcp45"),
        p(line_plot("x_annual", "annual_proj_mod_x", "y", "annual_proj_mod_med_rcp85", this.options.colors.reds.line), "annual", "proj_mod", "med", "rcp85"),


        //
        // monthly CONUS plots:
        //
        p(line_plot("x_monthly", "monthly_hist_obs_x", "y", "monthly_hist_obs_med", "#000000"), "monthly", "hist_obs", "med"),
        p(band_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_min_rcp45_2025", "monthly_proj_mod_max_rcp45_2025", this.options.colors.blues.innerBand, this.options.colors.opacities.mon_proj_minmax), "monthly", "proj_mod", "minmax", "rcp45", "2025"),
        p(band_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_min_rcp85_2025", "monthly_proj_mod_max_rcp85_2025", this.options.colors.reds.innerBand, this.options.colors.opacities.mon_proj_minmax), "monthly", "proj_mod", "minmax", "rcp85", "2025"),
        p(band_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_p10_rcp45_2025", "monthly_proj_mod_p90_rcp45_2025", this.options.colors.blues.innerBand, this.options.colors.opacities.mon_proj_1090), "monthly", "proj_mod", "p1090", "rcp45", "2025"),
        p(band_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_p10_rcp85_2025", "monthly_proj_mod_p90_rcp85_2025", this.options.colors.reds.innerBand, this.options.colors.opacities.mon_proj_1090), "monthly", "proj_mod", "p1090", "rcp85", "2025"),
        p(line_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_med_rcp45_2025", this.options.colors.blues.outerBand), "monthly", "proj_mod", "med", "rcp45", "2025"),
        p(line_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_med_rcp85_2025", this.options.colors.reds.line), "monthly", "proj_mod", "med", "rcp85", "2025"),
        p(band_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_min_rcp45_2050", "monthly_proj_mod_max_rcp45_2050", this.options.colors.blues.innerBand, this.options.colors.opacities.mon_proj_minmax), "monthly", "proj_mod", "minmax", "rcp45", "2050"),
        p(band_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_min_rcp85_2050", "monthly_proj_mod_max_rcp85_2050", this.options.colors.reds.innerBand, this.options.colors.opacities.mon_proj_minmax), "monthly", "proj_mod", "minmax", "rcp85", "2050"),
        p(band_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_p10_rcp45_2050", "monthly_proj_mod_p90_rcp45_2050", this.options.colors.blues.innerBand, this.options.colors.opacities.mon_proj_1090), "monthly", "proj_mod", "p1090", "rcp45", "2050"),
        p(band_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_p10_rcp85_2050", "monthly_proj_mod_p90_rcp85_2050", this.options.colors.reds.innerBand, this.options.colors.opacities.mon_proj_1090), "monthly", "proj_mod", "p1090", "rcp85", "2050"),
        p(line_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_med_rcp45_2050", this.options.colors.blues.outerBand), "monthly", "proj_mod", "med", "rcp45", "2050"),
        p(line_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_med_rcp85_2050", this.options.colors.reds.line), "monthly", "proj_mod", "med", "rcp85", "2050"),
        p(band_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_min_rcp45_2075", "monthly_proj_mod_max_rcp45_2075", this.options.colors.blues.innerBand, this.options.colors.opacities.mon_proj_minmax), "monthly", "proj_mod", "minmax", "rcp45", "2075"),
        p(band_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_min_rcp85_2075", "monthly_proj_mod_max_rcp85_2075", this.options.colors.reds.innerBand, this.options.colors.opacities.mon_proj_minmax), "monthly", "proj_mod", "minmax", "rcp85", "2075"),
        p(band_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_p10_rcp45_2075", "monthly_proj_mod_p90_rcp45_2075", this.options.colors.blues.innerBand, this.options.colors.opacities.mon_proj_1090), "monthly", "proj_mod", "p1090", "rcp45", "2075"),
        p(band_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_p10_rcp85_2075", "monthly_proj_mod_p90_rcp85_2075", this.options.colors.reds.innerBand, this.options.colors.opacities.mon_proj_1090), "monthly", "proj_mod", "p1090", "rcp85", "2075"),
        p(line_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_med_rcp45_2075", this.options.colors.blues.outerBand), "monthly", "proj_mod", "med", "rcp45", "2075"),
        p(line_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_med_rcp85_2075", this.options.colors.reds.line), "monthly", "proj_mod", "med", "rcp85", "2075"),
        //
        // seasonal CONUS plots
        //
        // Uncomment to show historical ranges
        //range_bar_plot("x_seasonal", "seasonal_hist_obs_x", "y", "seasonal_hist_obs_p10", "seasonal_hist_obs_p90",  "#cccccc", "#cccccc", 0.5, 0.7);
        p(range_bar_plot("x_seasonal", "seasonal_proj_mod_x", "y", "seasonal_proj_mod_min_rcp45_2025", "seasonal_proj_mod_max_rcp45_2025", this.options.colors.blues.innerBand, this.options.colors.blues.innerBand, 0.25, 0.4), "seasonal", "proj_mod", "minmax", "rcp45", "2025"),
        p(range_bar_plot("x_seasonal", "seasonal_proj_mod_x", "y", "seasonal_proj_mod_min_rcp85_2025", "seasonal_proj_mod_max_rcp85_2025", this.options.colors.reds.innerBand, this.options.colors.reds.innerBand, 0.0, 0.4), "seasonal", "proj_mod", "minmax", "rcp85", "2025"),
        p(range_bar_plot("x_seasonal", "seasonal_proj_mod_x", "y", "seasonal_proj_mod_p10_rcp45_2025", "seasonal_proj_mod_p90_rcp45_2025", this.options.colors.blues.innerBand, this.options.colors.blues.innerBand, 0.25, 0.4), "seasonal", "proj_mod", "p1090", "rcp45", "2025"),
        p(range_bar_plot("x_seasonal", "seasonal_proj_mod_x", "y", "seasonal_proj_mod_p10_rcp85_2025", "seasonal_proj_mod_p90_rcp85_2025", this.options.colors.reds.innerBand, this.options.colors.reds.innerBand, 0.0, 0.4), "seasonal", "proj_mod", "p1090", "rcp85", "2025"),
        p(range_bar_plot("x_seasonal", "seasonal_proj_mod_x", "y", "seasonal_proj_mod_min_rcp45_2050", "seasonal_proj_mod_max_rcp45_2050", this.options.colors.blues.innerBand, this.options.colors.blues.innerBand, 0.25, 0.4), "seasonal", "proj_mod", "minmax", "rcp45", "2050"),
        p(range_bar_plot("x_seasonal", "seasonal_proj_mod_x", "y", "seasonal_proj_mod_min_rcp85_2050", "seasonal_proj_mod_max_rcp85_2050", this.options.colors.reds.innerBand, this.options.colors.reds.innerBand, 0.0, 0.4), "seasonal", "proj_mod", "minmax", "rcp85", "2050"),
        p(range_bar_plot("x_seasonal", "seasonal_proj_mod_x", "y", "seasonal_proj_mod_p10_rcp45_2050", "seasonal_proj_mod_p90_rcp45_2050", this.options.colors.blues.innerBand, this.options.colors.blues.innerBand, 0.25, 0.4), "seasonal", "proj_mod", "p1090", "rcp45", "2050"),
        p(range_bar_plot("x_seasonal", "seasonal_proj_mod_x", "y", "seasonal_proj_mod_p10_rcp85_2050", "seasonal_proj_mod_p90_rcp85_2050", this.options.colors.reds.innerBand, this.options.colors.reds.innerBand, 0.0, 0.4), "seasonal", "proj_mod", "p1090", "rcp85", "2050"),
        p(range_bar_plot("x_seasonal", "seasonal_proj_mod_x", "y", "seasonal_proj_mod_min_rcp45_2075", "seasonal_proj_mod_max_rcp45_2075", this.options.colors.blues.innerBand, this.options.colors.blues.innerBand, 0.25, 0.4), "seasonal", "proj_mod", "minmax", "rcp45", "2075"),
        p(range_bar_plot("x_seasonal", "seasonal_proj_mod_x", "y", "seasonal_proj_mod_min_rcp85_2075", "seasonal_proj_mod_max_rcp85_2075", this.options.colors.reds.innerBand, this.options.colors.reds.innerBand, 0.0, 0.4), "seasonal", "proj_mod", "minmax", "rcp85", "2075"),
        p(range_bar_plot("x_seasonal", "seasonal_proj_mod_x", "y", "seasonal_proj_mod_p10_rcp45_2075", "seasonal_proj_mod_p90_rcp45_2075", this.options.colors.blues.innerBand, this.options.colors.blues.innerBand, 0.25, 0.4), "seasonal", "proj_mod", "p1090", "rcp45", "2075"),
        p(range_bar_plot("x_seasonal", "seasonal_proj_mod_x", "y", "seasonal_proj_mod_p10_rcp85_2075", "seasonal_proj_mod_p90_rcp85_2075", this.options.colors.reds.innerBand, this.options.colors.reds.innerBand, 0.0, 0.4), "seasonal", "proj_mod", "p1090", "rcp85", "2075"),
        p(range_bar_plot("x_seasonal", "seasonal_hist_obs_x", "y", "seasonal_hist_obs_med", "seasonal_hist_obs_med", "#000000", "#000000", 0.5, 1.0), "seasonal", "hist_obs", "med"),
        p(range_bar_plot("x_seasonal", "seasonal_proj_mod_x", "y", "seasonal_proj_mod_med_rcp45_2025", "seasonal_proj_mod_med_rcp45_2025", "#0000ff", "#0000ff", 0.25, 1.0), "seasonal", "proj_mod", "med", "rcp45", "2025"),
        p(range_bar_plot("x_seasonal", "seasonal_proj_mod_x", "y", "seasonal_proj_mod_med_rcp85_2025", "seasonal_proj_mod_med_rcp85_2025", this.options.colors.reds.line, this.options.colors.reds.line, 0.0, 1.0), "seasonal", "proj_mod", "med", "rcp85", "2025"),
        p(range_bar_plot("x_seasonal", "seasonal_proj_mod_x", "y", "seasonal_proj_mod_med_rcp45_2050", "seasonal_proj_mod_med_rcp45_2050", "#0000ff", "#0000ff", 0.25, 1.0), "seasonal", "proj_mod", "med", "rcp45", "2050"),
        p(range_bar_plot("x_seasonal", "seasonal_proj_mod_x", "y", "seasonal_proj_mod_med_rcp85_2050", "seasonal_proj_mod_med_rcp85_2050", this.options.colors.reds.line, this.options.colors.reds.line, 0.0, 1.0), "seasonal", "proj_mod", "med", "rcp85", "2050"),
        p(range_bar_plot("x_seasonal", "seasonal_proj_mod_x", "y", "seasonal_proj_mod_med_rcp45_2075", "seasonal_proj_mod_med_rcp45_2075", "#0000ff", "#0000ff", 0.25, 1.0), "seasonal", "proj_mod", "med", "rcp45", "2075"),
        p(range_bar_plot("x_seasonal", "seasonal_proj_mod_x", "y", "seasonal_proj_mod_med_rcp85_2075", "seasonal_proj_mod_med_rcp85_2075", this.options.colors.reds.line, this.options.colors.reds.line, 0.0, 1.0), "seasonal", "proj_mod", "med", "rcp85", "2075"),


        // annual AK plots:
        p(band_plot("x_annual", "annual_hist_mod_ak_x", "y", "annual_hist_mod_gfdl_cm3_y", "annual_hist_mod_ncar_ccsm4_y", this.options.colors.grays.outerBand), "annual", "hist_mod", "minmax", null, null, 'ak'),
        p(band_plot("x_annual", "annual_proj_mod_ak_x", "y", "annual_proj_mod_gfdl_cm3_rcp85_y", "annual_proj_mod_ncar_ccsm4_rcp85_y", this.options.colors.reds.outerBand), "annual", "annual_proj", "minmax", "rcp85", null, 'ak'),
        // p(line_plot("x_annual", "annual_hist_mod_ak_x", "y", "annual_hist_mod_gfdl_cm3_y", this.options.colors.grays.outerBand), "annual", "annual_ak", "minmax"),
        // p(line_plot("x_annual", "annual_hist_mod_ak_x", "y", "annual_hist_mod_ncar_ccsm4_y", this.options.colors.grays.outerBand), "annual", "annual_ak", "minmax"),
        // p(line_plot("x_annual", "annual_proj_mod_ak_x", "y", "annual_proj_mod_gfdl_cm3_rcp85_y", this.options.colors.reds.line), "annual", "annual_ak", "minmax"),
        // p(line_plot("x_annual", "annual_proj_mod_ak_x", "y", "annual_proj_mod_gfdl_cm3_rcp45_y", this.options.colors.blues.line), "annual", "annual_ak", "minmax"),
        // p(line_plot("x_annual", "annual_proj_mod_ak_x", "y", "annual_proj_mod_ncar_ccsm4_rcp85_y", this.options.colors.reds.line), "annual", "annual_ak", "minmax"),
        // p(line_plot("x_annual", "annual_proj_mod_ak_x", "y", "annual_proj_mod_ncar_ccsm4_rcp45_y", this.options.colors.blues.line), "annual", "annual_ak", "minmax"),
      ];
      // assign indexes based on array position.
      this._plots_config = this._plots_config.map((plot_config, idx) => {
        plot_config.plot_index = idx;
        return plot_config;
      });
    }
    return this._plots_config;
  }

  get _data_layout_config() {
    if (!this._data_config) {
      function _data_layout_record(id = null, data_config = null, data_entry_idx = -1) {
        return {
          id: id,
          data_config: data_config,
          data_config_idx: data_entry_idx
        }
      }

      this._data_config = [
        _data_layout_record('annual_hist_obs', {
          variables: [{id: "annual_hist_obs_x"},
            {id: "annual_hist_obs_y"}],
          values: [[-9999, 0]]
        }),
        _data_layout_record('annual_hist_mod',
          {
            variables: [{id: "annual_hist_mod_x"},
              {id: "annual_hist_mod_med"},
              {id: "annual_hist_mod_min"},
              {id: "annual_hist_mod_max"},
              {id: "annual_hist_mod_p10"},
              {id: "annual_hist_mod_p90"}],
            values: [[-9999, 0, 0, 0, 0, 0, 0]]
          }),

        _data_layout_record('annual_proj_mod',
          {
            variables: [{id: "annual_proj_mod_x"},
              {id: "annual_proj_mod_med_rcp45"},
              {id: "annual_proj_mod_min_rcp45"},
              {id: "annual_proj_mod_max_rcp45"},
              {id: "annual_proj_mod_p10_rcp45"},
              {id: "annual_proj_mod_p90_rcp45"},
              {id: "annual_proj_mod_med_rcp85"},
              {id: "annual_proj_mod_min_rcp85"},
              {id: "annual_proj_mod_max_rcp85"},
              {id: "annual_proj_mod_p10_rcp85"},
              {id: "annual_proj_mod_p90_rcp85"}],
            values: [[-9999, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
          }),
        _data_layout_record('monthly_hist_obs', {
          variables: [{id: "monthly_hist_obs_x"},
            {id: "monthly_hist_obs_mean30"},
            {id: "monthly_hist_obs_med"}],
          values: [[-9999, 0, 0]],
          repeat: {period: 12}
        }),
        _data_layout_record('monthly_proj_mod', {
          variables: [{id: "monthly_proj_mod_x"},
            {id: "monthly_proj_mod_max_rcp45_2025"},
            {id: "monthly_proj_mod_med_rcp45_2025"},
            {id: "monthly_proj_mod_min_rcp45_2025"},
            {id: "monthly_proj_mod_p10_rcp45_2025"},
            {id: "monthly_proj_mod_p90_rcp45_2025"},
            {id: "monthly_proj_mod_max_rcp85_2025"},
            {id: "monthly_proj_mod_med_rcp85_2025"},
            {id: "monthly_proj_mod_min_rcp85_2025"},
            {id: "monthly_proj_mod_p10_rcp85_2025"},
            {id: "monthly_proj_mod_p90_rcp85_2025"},
            {id: "monthly_proj_mod_max_rcp45_2050"},
            {id: "monthly_proj_mod_med_rcp45_2050"},
            {id: "monthly_proj_mod_min_rcp45_2050"},
            {id: "monthly_proj_mod_p10_rcp45_2050"},
            {id: "monthly_proj_mod_p90_rcp45_2050"},
            {id: "monthly_proj_mod_max_rcp85_2050"},
            {id: "monthly_proj_mod_med_rcp85_2050"},
            {id: "monthly_proj_mod_min_rcp85_2050"},
            {id: "monthly_proj_mod_p10_rcp85_2050"},
            {id: "monthly_proj_mod_p90_rcp85_2050"},
            {id: "monthly_proj_mod_max_rcp45_2075"},
            {id: "monthly_proj_mod_med_rcp45_2075"},
            {id: "monthly_proj_mod_min_rcp45_2075"},
            {id: "monthly_proj_mod_p10_rcp45_2075"},
            {id: "monthly_proj_mod_p90_rcp45_2075"},
            {id: "monthly_proj_mod_max_rcp85_2075"},
            {id: "monthly_proj_mod_med_rcp85_2075"},
            {id: "monthly_proj_mod_min_rcp85_2075"},
            {id: "monthly_proj_mod_p10_rcp85_2075"},
            {id: "monthly_proj_mod_p90_rcp85_2075"}],
          values: [[-9999, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
          repeat: {period: 12}
        }),
        _data_layout_record('seasonal_hist_obs', {
          variables: [{id: "seasonal_hist_obs_x"},
            {id: "seasonal_hist_obs_mean30"},
            {id: "seasonal_hist_obs_med"}],
          values: [[-9999, 0, 0]],
          repeat: {period: 4}
        }),
        _data_layout_record('seasonal_proj_mod', {
          variables: [{id: "seasonal_proj_mod_x"},
            {id: "seasonal_proj_mod_max_rcp45_2025"},
            {id: "seasonal_proj_mod_med_rcp45_2025"},
            {id: "seasonal_proj_mod_min_rcp45_2025"},
            {id: "seasonal_proj_mod_p10_rcp45_2025"},
            {id: "seasonal_proj_mod_p90_rcp45_2025"},
            {id: "seasonal_proj_mod_max_rcp85_2025"},
            {id: "seasonal_proj_mod_med_rcp85_2025"},
            {id: "seasonal_proj_mod_min_rcp85_2025"},
            {id: "seasonal_proj_mod_p10_rcp85_2025"},
            {id: "seasonal_proj_mod_p90_rcp85_2025"},
            {id: "seasonal_proj_mod_max_rcp45_2050"},
            {id: "seasonal_proj_mod_med_rcp45_2050"},
            {id: "seasonal_proj_mod_min_rcp45_2050"},
            {id: "seasonal_proj_mod_p10_rcp45_2050"},
            {id: "seasonal_proj_mod_p90_rcp45_2050"},
            {id: "seasonal_proj_mod_max_rcp85_2050"},
            {id: "seasonal_proj_mod_med_rcp85_2050"},
            {id: "seasonal_proj_mod_min_rcp85_2050"},
            {id: "seasonal_proj_mod_p10_rcp85_2050"},
            {id: "seasonal_proj_mod_p90_rcp85_2050"},
            {id: "seasonal_proj_mod_max_rcp45_2075"},
            {id: "seasonal_proj_mod_med_rcp45_2075"},
            {id: "seasonal_proj_mod_min_rcp45_2075"},
            {id: "seasonal_proj_mod_p10_rcp45_2075"},
            {id: "seasonal_proj_mod_p90_rcp45_2075"},
            {id: "seasonal_proj_mod_max_rcp85_2075"},
            {id: "seasonal_proj_mod_med_rcp85_2075"},
            {id: "seasonal_proj_mod_min_rcp85_2075"},
            {id: "seasonal_proj_mod_p10_rcp85_2075"},
            {id: "seasonal_proj_mod_p90_rcp85_2075"}],
          values: [[-9999, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
          repeat: {period: 4}
        }),
        _data_layout_record('annual_hist_mod_ak', {
          variables: [
            {id: "annual_hist_mod_ak_x"},
            {id: "annual_hist_mod_gfdl_cm3_y"},
            {id: "annual_hist_mod_ncar_ccsm4_y"}
          ],
          values: [[-9999, 0, 0]]
        }),
        _data_layout_record('annual_proj_mod_ak', {
          variables: [
            {id: "annual_proj_mod_ak_x"},
            {id: "annual_proj_mod_gfdl_cm3_rcp85_y"},
            {id: "annual_proj_mod_gfdl_cm3_rcp45_y"},
            {id: "annual_proj_mod_ncar_ccsm4_rcp85_y"},
            {id: "annual_proj_mod_ncar_ccsm4_rcp45_y"}
          ],
          values: [[-9999, 0, 0, 0, 0]]
        }),
      ];

      this._data_config = this._data_config.map((_data_config, idx) => {
        _data_config.data_config_idx = idx;
        return _data_config;
      })
    }
    return this._data_config;
  }

  get _months() {
    return ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  }

  get _model_edate() {
    return '2099-12-31'
  }

  /**
   * Gets available variable options for a specified combination of frequency and region.
   *
   * @param frequency
   * @param unitsystem
   * @param region
   * @returns {{id: *, title: *}[]}
   */
  static get_variables(frequency, unitsystem, region) {
    unitsystem = unitsystem || 'english';
    return ClimateByLocationWidget.variables.filter((v) => frequency in v.ytitles && ((typeof v.supports_region === "function" ? v.supports_region(region) : true))).map((v) => {
      return {id: v.id, title: v.title[unitsystem]};
    });
  }

  /**
   * Gets available frequency options for a specified region.
   *
   * @param region
   * @returns {{id: (string), title: (string)}[]}
   */
  static get_frequencies(region) {
    return ClimateByLocationWidget.frequencies.filter((f) => ((typeof f.supports_region === "function" ? f.supports_region(region) : true))).map((v) => {
      return {id: v.id, title: v.title};
    });
  }

  /**
   * This function is used to toggle features based on whether the selected region is in Alaska or not.
   *
   * @param region
   * @returns {boolean}
   */
  static is_ak_region(region) {
    return String(region).startsWith('02') || region === 'AK'
  }

  set_options(options) {
    let old_options = Object.assign({}, this.options);
    this.options = merge({}, old_options, options);
    if (this.options.state !== old_options.state && this.options.county === old_options.county) {
      this.options.county = null;
    }
    this._bool_options.forEach((option) => {
      if (typeof options[option] === "string") {
        options[option] = options[option].toLowerCase() === "true";
      }
    });
    if (!get(ClimateByLocationWidget, ['frequencies', this.options.frequency, 'supports_region'], () => true)(this.get_region_value())) {
      this.options.frequency = ClimateByLocationWidget.get_variables(this.get_region_value())[0].id
    }
    if (!get(ClimateByLocationWidget, ['variables', this.options.variable, 'supports_region'], () => true)(this.get_region_value())) {
      this.options.variable = ClimateByLocationWidget.get_variables(this.options.frequency, null, this.get_region_value())[0].id
    }

    this._update_plot_visibilities();

    if (this.options.yzoom !== old_options.yzoom) {
      this.axes.y.zoom().allowed(this.options.yzoom);
    }
    if (this.options.ypan !== old_options.ypan) {
      this.axes.y.pan().allowed(this.options.ypan)
    }

    // if font changed, set it in all the relevant places
    if (this.options.font !== old_options.font) {
      let i, j;
      for (i = 0; i < this.multigraph.graphs().at(0).axes().size(); ++i) {
        let axis = this.multigraph.graphs().at(0).axes().at(i);
        if (axis.title()) {
          axis.title().font("14px" + this.options.font);
        }
        for (j = 0; j < axis.labelers().size(); ++j) {
          axis.labelers().at(j).font("12px" + this.options.font);
        }
      }
    }

    // if frequency, state, county, or variable changed, trigger a larger update cycle (new data + plots maybe changed):
    if (this.options.frequency !== old_options.frequency ||
      this.options.state !== old_options.state ||
      this.options.county !== old_options.county ||
      this.options.presentation !== old_options.presentation ||
      this.options.variable !== old_options.variable) {
      this.update();
    } else {
      this.multigraph.render();
    }

    return this;
  }

  _reset_dataurls() {
    this.dataurls = {
      hist_obs: '',
      hist_mod: '',
      proj_mod: ''
    };
  }

  /**
   * Requests the widget update according to its current options. Use `set_options()` to changes options instead.
   * @returns {Promise<void>}
   */
  async update() {
    if (!!this.options.county || !!this.options.state) {
      if (this.options.frequency === "annual") {
        await this._update_annual();
      } else if (this.options.frequency === "monthly") {
        await this._update_monthly();
      } else if (this.options.frequency === "seasonal") {
        await this._update_seasonal();
      }
      // this.multigraph.render();
    }
  }

  async _update_annual() {
    this.axes.x_annual.visible(true);
    this.axes.x_monthly.visible(false);
    this.axes.x_seasonal.visible(false);

    this.hide_all_plots();

    this._reset_dataurls();
    this._show_spinner();
    if (!ClimateByLocationWidget.is_ak_region(this.get_region_value())) {
      return Promise.all([
        this._get_historical_observed_livneh_data(),
        this._get_historical_loca_model_data(),
        this._get_projected_loca_model_data()
      ])
        .then((([hist_obs_data, hist_mod_data, proj_mod_data]) => {
          this._hide_spinner();

          let variable_config = find(ClimateByLocationWidget.variables, (c) => c.id === this.options.variable);
          let convfunc = variable_config.dataconverters[this.options.unitsystem];
          hist_obs_data = this._map_2d_data(hist_obs_data, convfunc);
          hist_mod_data = this._map_2d_data(hist_mod_data, convfunc);
          proj_mod_data = this._map_2d_data(proj_mod_data, convfunc);

          let avg = this._average(hist_obs_data, 1961, 1990);
          if (this.options.presentation === "anomaly") {
            if (this.options.variable === "pcpn") {
              hist_obs_data = this._percent_anomalies(hist_obs_data, avg);
              hist_mod_data = this._percent_anomalies(hist_mod_data, avg);
              proj_mod_data = this._percent_anomalies(proj_mod_data, avg);
            } else {
              hist_obs_data = this._anomalies(hist_obs_data, avg);
              hist_mod_data = this._anomalies(hist_mod_data, avg);
              proj_mod_data = this._anomalies(proj_mod_data, avg);
            }
          }

          let range = this._scale_range(this._datas_range([hist_obs_data, hist_mod_data, proj_mod_data]), this.options.yAxisRangeScaleFactor);
          this.axes.y.setDataRange(range.min, range.max);
          this.axes.y.title().content().string(
            variable_config.ytitles.annual[this.options.presentation][this.options.unitsystem]
          );

          this._set_data_array('annual_hist_obs', hist_obs_data);
          this._set_data_array('annual_hist_mod', hist_mod_data);
          this._set_data_array('annual_proj_mod', proj_mod_data);

          this._update_plot_visibilities();

          this._update_hist_obs_bar_plot_base(avg);

          this.multigraph.render();

        }).bind(this));
    } else { // AK annual graphs
      return this._update_annual_ak()
    }
  }

  async _update_seasonal() {
    this.axes.x_annual.visible(false);
    this.axes.x_monthly.visible(false);
    this.axes.x_seasonal.visible(true);

    this.hide_all_plots();

    this._reset_dataurls();
    this._show_spinner();
    return Promise.all([
      this._get_historical_observed_livneh_data(),
      this._get_projected_loca_model_data()
    ]).then((([hist_obs_data, proj_mod_data]) => {
      this._hide_spinner();
      // The incoming data has month values 1,4,7,10.  Here we replace these with the values 0,1,2,3:
      hist_obs_data.forEach((v) => {
        v[0] = Math.floor(v[0] / 3);
      });
      proj_mod_data.forEach((v) => {
        v[0] = Math.floor(v[0] / 3);
      });
      let variable_config = find(ClimateByLocationWidget.variables, (c) => c.id === this.options.variable);
      let convfunc = variable_config.dataconverters[this.options.unitsystem];
      hist_obs_data = this._map_2d_data(hist_obs_data, convfunc);
      proj_mod_data = this._map_2d_data(proj_mod_data, convfunc);
      let range = this._scale_range(this._datas_range([hist_obs_data, proj_mod_data]), this.options.yAxisRangeScaleFactor);
      this.axes.y.setDataRange(range.min, range.max);
      this.axes.y.title().content().string(variable_config.ytitles.seasonal[this.options.unitsystem]);
      this._set_data_array('seasonal_hist_obs', hist_obs_data);
      this._set_data_array('seasonal_proj_mod', proj_mod_data);
      this._update_plot_visibilities();
      this.multigraph.render();
    }).bind(this));
  }

  async _update_monthly() {
    this.axes.x_annual.visible(false);
    this.axes.x_monthly.visible(true);
    this.axes.x_seasonal.visible(false);

    this.hide_all_plots();

    this._reset_dataurls();
    this._show_spinner();

    return Promise.all([
      this._get_historical_observed_livneh_data(),
      this._get_projected_loca_model_data()
    ])
      .then((([hist_obs_data, proj_mod_data]) => {
        this._hide_spinner();
        let variable_config = find(ClimateByLocationWidget.variables, (c) => c.id === this.options.variable);
        let convfunc = variable_config.dataconverters[this.options.unitsystem];
        hist_obs_data = this._map_2d_data(hist_obs_data, convfunc);
        proj_mod_data = this._map_2d_data(proj_mod_data, convfunc);
        let range = this._scale_range(this._datas_range([hist_obs_data, proj_mod_data]), this.options.yAxisRangeScaleFactor);
        this.axes.y.setDataRange(range.min, range.max);
        this.axes.y.title().content().string(variable_config.ytitles.monthly[this.options.unitsystem]);
        this._set_data_array('monthly_hist_obs', hist_obs_data);
        this._set_data_array('monthly_proj_mod', proj_mod_data);
        this._update_plot_visibilities();
        this.multigraph.render();
      }).bind(this));
  }

  async _update_annual_ak() {
    // get data for GFDL-CM3 and NCAR-CCSM4
    let hist_sdate = '1970-01-01';
    let hist_edate = '2005-12-31';
    let hist_sdate_year = parseInt(String(hist_sdate).slice(0, 4));
    let hist_edate_year = parseInt(String(hist_edate).slice(0, 4));
    let mod_edate_year = parseInt(String(this._model_edate).slice(0, 4));
    return Promise.all([
      this._fetch_acis_data('snap:GFDL-CM3:rcp85', hist_sdate_year, mod_edate_year),
      this._fetch_acis_data('snap:NCAR-CCSM4:rcp85', hist_sdate_year, mod_edate_year),
    ]).then(([
               gfdl_cm3_rcp85,
               ncar_ccsm4_rcp85,
             ]) => {
      // split into hist mod vs proj mod
      let hist_mod_data = [];
      let proj_mod_data = [];


      function _rolling_window_average(collection, year, window_size = 10) {
        return mean(lodash_range(window_size).map((x) => get(collection, year - x)).filter((y) => !!y))
      }

      for (let key = hist_sdate_year; key <= hist_edate_year; key++) {
        //year,gfdl_cm3_rcp85, gfdl_cm3_rcp45, ncar_ccsm4_rcp85, ncar_ccsm4_rcp45
        let y = [_rolling_window_average(gfdl_cm3_rcp85, key), _rolling_window_average(ncar_ccsm4_rcp85, key)];

        hist_mod_data.push([key, min(y), max(y)]);
      }
      let proj_edate_year = parseInt(String(this._model_edate).slice(0, 4));
      for (let key = hist_edate_year + 1; key <= mod_edate_year; key++) {
        //year,gfdl_cm3_rcp85, gfdl_cm3_rcp45, ncar_ccsm4_rcp85, ncar_ccsm4_rcp45
        let y = [_rolling_window_average(gfdl_cm3_rcp85, key), _rolling_window_average(ncar_ccsm4_rcp85, key)];
        proj_mod_data.push([key, min(y), null, max(y), null]);
      }

      hist_mod_data = this._round_2d_values(hist_mod_data, 1);
      proj_mod_data = this._round_2d_values(proj_mod_data, 1);
      // Sort by index before returning
      hist_mod_data.sort((a, b) => {
        return (a[0] > b[0]) - (a[0] < b[0])
      });
      proj_mod_data.sort((a, b) => {
        return (a[0] > b[0]) - (a[0] < b[0])
      });

      this.dataurls.hist_mod = this._format_export_data(['year', 'gfdl_cm3_rcp85', 'ncar_ccsm4_rcp85'], hist_mod_data);
      this.dataurls.proj_mod = this._format_export_data(['year', 'gfdl_cm3_rcp85', 'ncar_ccsm4_rcp85',], proj_mod_data);


      this._hide_spinner();

      let variable_config = find(ClimateByLocationWidget.variables, (c) => c.id === this.options.variable);
      let convfunc = variable_config.dataconverters[this.options.unitsystem];
      hist_mod_data = this._map_2d_data(hist_mod_data, convfunc);
      proj_mod_data = this._map_2d_data(proj_mod_data, convfunc);

      let range = this._scale_range(this._datas_range([hist_mod_data, proj_mod_data]), this.options.yAxisRangeScaleFactor);
      this.axes.y.setDataRange(range.min, range.max);
      this.axes.y.title().content().string(
        variable_config.ytitles.annual[this.options.presentation][this.options.unitsystem]
      );

      this._set_data_array('annual_hist_mod_ak', hist_mod_data);
      this._set_data_array('annual_proj_mod_ak', proj_mod_data);

      this._update_plot_visibilities();

      this.multigraph.render();

    });
  }

  _update_hist_obs_bar_plot_base(avg) {
    {
      // Set the base level for the annual hist_obs bar plot --- this is the y-level
      // at which the bars are based ("barbase" plot option), as well as the level
      // that determines the colors of the bars ("min"/"max" property of the "fillcolor"
      // option -- above this level is red, below it is green).
      let ref = avg;
      if (this.options.presentation === "anomaly") {
        if (this.options.variable === "pcpn") {
          ref = 100;
        } else {
          ref = 0;
        }
      }
      let number_val = new window.multigraph.core.NumberValue(ref);
      let plot = this.find_plot_instance(null, 'annual', 'hist_obs');
      if (!plot) {
        return
      }
      plot.renderer().options().barbase().at(0).value(number_val);
      let j;
      for (j = 1; j < plot.renderer().options().fillcolor().size(); ++j) {
        if (plot.renderer().options().fillcolor().at(j).min()) {
          plot.renderer().options().fillcolor().at(j).min(number_val);
        }
        if (plot.renderer().options().fillcolor().at(j).max()) {
          plot.renderer().options().fillcolor().at(j).max(number_val);
        }
      }
    }
  }

  /**
   * Updates the data that multigraph has for a given dataset
   * @param id the alias for the dataset
   * @param data the new data
   * @private
   */
  _set_data_array(id, data) {
    // The following function takes a jermaine attr_list instance and returns
    // a plain JS array containing all its values
    function attr_list_array(attr_list) {
      let a = [], i;
      for (i = 0; i < attr_list.size(); ++i) {
        a.push(attr_list.at(i));
      }
      return a;
    }

    // find the data object
    let data_obj = this.multigraph.graphs().at(0).data().at(find(this._data_layout_config, (c) => c.id === id).data_config_idx);
    // conform shape and set new data
    data_obj.array(window.multigraph.core.ArrayData.stringArrayToDataValuesArray(attr_list_array(data_obj.columns()), data))
  }

  find_plot_config(frequency = null, regime = null, stat = null, scenario = null, timeperiod = null) {
    return find(this.plots_config, (plot_config) => {
      return (
        (frequency === plot_config.frequency) &&
        (regime === plot_config.regime) &&
        (stat === plot_config.stat) &&
        (scenario === plot_config.scenario) &&
        (timeperiod === plot_config.timeperiod)
      )
    })
  }

  find_plot_instance(plot_index = null, frequency = null, regime = null, stat = null, scenario = null, timeperiod = null) {

    if (plot_index !== null) {
      try {
        return this.multigraph.graphs().at(0).plots().at(plot_index)
      } catch (e) {
        return null
      }

    }
    try {
      return this.multigraph.graphs().at(0).plots().at(get(this.find_plot_config(frequency, regime, stat, scenario, timeperiod), 'plot_index'))
    } catch (e) {
      return null
    }

  }

  /**
   * Hides all plots in the graph
   */
  hide_all_plots() {
    this.plots_config.forEach((plot_config) => {
      let plot = this.find_plot_instance(plot_config.plot_index);
      if (!!plot) {
        plot.visible(false);
      }
    });
  }

  _update_plot_visibilities() {
    let is_plot_visible = (plot_config) => {
      if (this.options.frequency !== plot_config.frequency) {
        return false;
      }

      if (plot_config.frequency === "annual") {
        // don't show ak plots for non-ak and don't show non-ak plots for ak.
        if (ClimateByLocationWidget.is_ak_region(this.get_region_value()) ? plot_config.region !== "ak" : plot_config.region === "ak") {
          return false
        }
        if (plot_config.regime === "hist_obs") {
          return this.options.histobs;
        }
        if (plot_config.regime === "hist_mod") {
          if (plot_config.stat === "med") {
            return this.options.histmod && this.options.hmedian;
          } else {
            if (this.options.hrange !== plot_config.stat && this.options.hrange !== "both") {
              return false;
            }
            return this.options.histmod;
          }
        }
        // frequency==="annual" && regime==="proj_mod":
        if (this.options.scenario !== plot_config.scenario && this.options.scenario !== "both") {
          return false;
        }
        if (plot_config.stat === "med") {
          return this.options.pmedian;
        }
        return !(this.options.prange !== plot_config.stat && this.options.prange !== "both");

      } else {
        if (plot_config.regime === "hist_obs") {
          return this.options.histobs;
        }
        if (plot_config.regime === "hist_mod") {
          return false;
        }
        if (this.options.timeperiod !== plot_config.timeperiod) {
          return false;
        }
        if (this.options.scenario !== plot_config.scenario && this.options.scenario !== "both") {
          return false;
        }
        if (plot_config.stat === "med") {
          return this.options.pmedian;
        }
        return !(this.options.prange !== plot_config.stat && this.options.prange !== "both");

      }
    };

    this.plots_config.forEach((plot_config) => {
      let plot = this.find_plot_instance(plot_config.plot_index);
      if (!!plot) {
        plot.visible(is_plot_visible(plot_config));
      }
    });
  }

  _get_region_reduction() {
    if (this.options.county) {
      return {'area_reduce': 'county_mean'}
    }
    if (this.options.state) {
      return {'area_reduce': 'state_mean'}
    }
  }

  /**
   * Gets the county or state that is currently selected.
   */
  get_region_value() {
    return this.options.county || this.options.state || null
  }

  _get_region_parameters() {
    if (this.options.county) {
      return {
        "county": this.options.county
      }
    }
    if (this.options.state) {
      return {"state": this.options.state}
    } else {
      throw new Error('county/state not valid')
    }
  }

  _map_2d_data(data, f) {
    // Takes a 2D data array, and modifies it in-place by replacing each y value
    // with the result of passing that y value to the function f.  The "y" values
    // consist of all values on every row EXCEPT for the 1st column.
    let i, j;
    for (i = 0; i < data.length; ++i) {
      for (j = 1; j < data[i].length; ++j) {
        data[i][j] = f(data[i][j]);
      }
    }
    return data;
  }

  _datas_range(datas) {
    // Takes an array of data arrays, and returns a JS object giving the min and max
    // values present in all the data.  Each element of the incoming datas array
    // is a 2D array whose first column is an x value, and all the remaining columns
    // are "y" columns.  This function returns the min and max of all the y column
    // in all the data arrays.
    let min = datas[0][0][1];
    let max = datas[0][0][1];
    datas.forEach((data) => {
      data.forEach((row) => {
        row.slice(1).forEach((value) => {
          if (value === null) {
            return
          }
          if (value < min) {
            min = value;
          }
          if (value > max) {
            max = value;
          }
        });
      });
    });
    return {min: min, max: max};
  }

  _scale_range(range, factor) {
    // Take an object of the form returned by _datas_range() above, and scale its
    // min and max values by a factor, returning a new object of the same form.
    let r = (range.max - range.min) / 2;
    let c = (range.max + range.min) / 2;
    return {
      min: c - r * factor,
      max: c + r * factor
    };
  }

  async _get_historical_observed_livneh_data() {
    let freq = (this.options.frequency === 'annual') ? 'annual' : 'monthly';
    let variableConfig = find(ClimateByLocationWidget.variables, (c) => c.id === this.options.variable);
    let elems = [$.extend(variableConfig['acis_elements'][freq], this._get_region_reduction())];
    return $.ajax({
      url: this.options.data_api_endpoint,
      type: "POST",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      timeout: 60000,
      data: JSON.stringify($.extend({
        "sdate": "1950-01-01",
        "edate": "2013-12-31",
        // "edate": (String(new Date().getFullYear() - 1)),
        "grid": 'livneh',
        "elems": elems
      }, this._get_region_parameters()))
    })
      .then(((response) => {

        let data;

        if (this.options.frequency === 'annual') {
          data = [];
          response.data.forEach(((record) => {
            if (undefined !== record[1][this.get_region_value()] && String(record[1][this.get_region_value()]) !== '-999' && String(record[1][this.get_region_value()]) !== '') {
              data.push([record[0], round((record[1][this.get_region_value()]), 1)]);
            }
          }).bind(this));
          this.dataurls.hist_obs = 'data:text/csv;base64,' + window.btoa(('year,' + find(ClimateByLocationWidget.variables, (c) => c.id === this.options.variable).id + '\n' + data.join('\n')));
          return data
        } else if (this.options.frequency === 'monthly' || this.options.frequency === 'seasonal') {
          //then build output of [[month(1-12), weighted mean]].
          data = {
            '01': [],
            '02': [],
            '03': [],
            '04': [],
            '05': [],
            '06': [],
            '07': [],
            '08': [],
            '09': [],
            '10': [],
            '11': [],
            '12': []
          };
          response.data.forEach(((record) => {
            if (undefined !== record[1][this.get_region_value()]) {
              data[record[0].slice(-2)].push(parseFloat(record[1][this.get_region_value()]));
            }
          }).bind(this));
          //group monthly data by season
          if (this.options.frequency === 'seasonal') {
            let seasons = {
              "01": ["12", "01", "02"],
              "04": ["03", "04", "05"],
              "07": ["06", "07", "08"],
              "10": ["09", "10", "11"]
            };
            data = Object.keys(seasons).reduce((acc, season) => {
              acc[season] = [].concat(data[seasons[season][0]], data[seasons[season][1]], data[seasons[season][2]]);
              return acc;
            }, {});
          }
          let mean = Object.keys(data).reduce((acc, key) => {
            acc[key] = round((data[key].reduce((a, b) => {
              return a + b;
            }) / data[key].length), 1);
            return acc;
          }, {});
          // let median = Object.keys(data).reduce( (acc, key) => {
          //   data[key].sort( (a, b) => {
          //     return a - b;
          //   });
          //   let half = Math.floor(data[key].length / 2);
          //   if (data[key].length % 2)
          //     acc[key] = Math.round(data[key][half]* 10) / 10;
          //   else
          //     acc[key] = round(((data[key][half - 1] + data[key][half]) / 2.0), 1);
          //   return acc;
          // }, {});
          //return [[month, weighted mean]]
          data = Object.keys(data).reduce((acc, key) => {
            acc.push([parseInt(key), null, mean[key]]);
            return acc;
          }, []).sort((a, b) => {
            return parseInt(a[0]) - parseInt(b[0])
          });

          this.dataurls.hist_obs = this._format_export_data(['month', 'weighted_mean'], data);
          return data;

        }
      }).bind(this));
  }

  async _fetch_acis_data(grid, sdate, edate) {

    let freq = (this.options.frequency === 'annual') ? 'annual' : 'monthly';

    let elems = [$.extend((find(ClimateByLocationWidget.variables, (c) => c.id === this.options.variable))['acis_elements'][freq], this._get_region_reduction())];

    return $.ajax({
      url: this.options.data_api_endpoint,
      type: "POST",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify($.extend({
        "grid": grid,
        "sdate": String(sdate),
        "edate": String(edate),
        "elems": elems
      }, this._get_region_parameters()))
    })
      .then(((response) => {
        let data = {};
        response.data.forEach(((record) => {
          if (undefined !== record[1][this.get_region_value()] && String(record[1][this.get_region_value()]) !== '-999' && String(record[1][this.get_region_value()]) !== '') {
            data[record[0]] = record[1][this.get_region_value()]
          }
        }).bind(this));
        return data;
      }).bind(this));
  }

  async _get_historical_loca_model_data() {
    // let edate = (String(new Date().getFullYear())) + '-01-01';
    let edate = '2006-12-31';
    return Promise.all([
      this._fetch_acis_data('loca:wMean:rcp85', '1950-01-01', edate),
      this._fetch_acis_data('loca:allMin:rcp85', '1950-01-01', edate),
      this._fetch_acis_data('loca:allMax:rcp85', '1950-01-01', edate)
    ])
      .then((([wMean, min, max]) => {
        let data = [];

        for (let key = 1950; key <= 2006; key++) {
          let values = {};
          values.wMean = wMean.hasOwnProperty(key) ? round(wMean[key], 1) : null;
          values.min = min.hasOwnProperty(key) ? round(min[key], 1) : null;
          values.max = max.hasOwnProperty(key) ? round(max[key], 1) : null;
          //year,mean,min,max,?,?
          data.push([String(key), values.wMean, values.min, values.max, null, null]);
        }
        // Sort before returning
        data.sort((a, b) => {
          return (a[0] > b[0]) - (a[0] < b[0])
        });
        this.dataurls.hist_mod = this._format_export_data(['year', 'weighted_mean', 'min', 'max'], data);
        return data
      }).bind(this));
  }

  async _get_projected_loca_model_data() {
    let sdate;

    if (this.options.frequency === 'annual') {
      // sdate = (String(new Date().getFullYear())) + '-01-01';
      sdate = '2006-01-01';
    } else {
      sdate = '2010-01-01';
    }

    return Promise.all([
      this._fetch_acis_data('loca:wMean:rcp45', sdate, this._model_edate),
      this._fetch_acis_data('loca:allMin:rcp45', sdate, this._model_edate),
      this._fetch_acis_data('loca:allMax:rcp45', sdate, this._model_edate),
      this._fetch_acis_data('loca:wMean:rcp85', sdate, this._model_edate),
      this._fetch_acis_data('loca:allMin:rcp85', sdate, this._model_edate),
      this._fetch_acis_data('loca:allMax:rcp85', sdate, this._model_edate)
    ])
      .then((([wMean45, min45, max45, wMean85, min85, max85]) => {
        let data;
        let months_seasons = {
          "01": "01",
          "02": "01",
          "03": "04",
          "04": "04",
          "05": "04",
          "06": "07",
          "07": "07",
          "08": "07",
          "09": "10",
          "10": "10",
          "11": "10",
          "12": "01"
        };
        if (this.options.frequency === 'annual') {
          data = [];
          // Extract values
          for (let key = 2006; key < 2100; key++) {
            let values = {};
            values.wMean45 = wMean45.hasOwnProperty(key) ? round(wMean45[key], 1) : null;
            values.min45 = min45.hasOwnProperty(key) ? round(min45[key], 1) : null;
            values.max45 = max45.hasOwnProperty(key) ? round(max45[key], 1) : null;
            values.wMean85 = wMean85.hasOwnProperty(key) ? round(wMean85[key], 1) : null;
            values.min85 = min85.hasOwnProperty(key) ? round(min85[key], 1) : null;
            values.max85 = max85.hasOwnProperty(key) ? round(max85[key], 1) : null;
            //year,rcp45mean,rcp45min,rcp45max,rcp45p10,rcp45p90,rcp85mean,rcp85min,rcp85max,rcp85p10,rcp85p90
            data.push([String(key), values.wMean45, values.min45, values.max45, null, null, values.wMean85, values.min85, values.max85, null, null]);
          }
          // Sort before returning
          data.sort((a, b) => {
            return (a[0] > b[0]) - (a[0] < b[0])
          });
          this.dataurls.proj_mod = this._format_export_data(['year', 'rcp45_weighted_mean', 'rcp45_min', 'rcp45_max', 'rcp85_weighted mean', 'rcp85_min', 'rcp85_max'], data);

          return data
        } else if (this.options.frequency === 'monthly' || this.options.frequency === 'seasonal') {
          data = {};
          [2025, 2050, 2075].forEach((yearRange) => {
            data[yearRange] = {};
            this._months.forEach((month) => {
              let season_month = month;
              if (this.options.frequency === 'seasonal') {
                //for seasonal group by season, not month.
                season_month = months_seasons[month];
              }
              if (undefined === data[yearRange][season_month]) {
                data[yearRange][season_month] = {};
              }
              let datasets = {
                'wMean45': wMean45,
                'wMean85': wMean85,
                'min45': min45,
                'max45': max45,
                'min85': min85,
                'max85': max85
              };
              Object.keys(datasets).forEach((dataset) => {
                if (undefined === data[yearRange][season_month][dataset]) {
                  data[yearRange][season_month][dataset] = [];
                }
                for (let year = yearRange - 15; year < yearRange + 15; year++) {
                  let year_month = String(year) + '-' + String(month);
                  if (datasets[dataset].hasOwnProperty(year_month)) {
                    data[yearRange][season_month][dataset].push(datasets[dataset][year_month]);
                  }
                }
              });
            });
          });
          // mean values by month
          Object.keys(data).forEach((yearRange) => {
            Object.keys(data[yearRange]).forEach((month) => {
              ['wMean45', 'wMean85', 'min45', 'min85', 'max45', 'max85'].forEach((valueName) => {
                let length = data[yearRange][month][valueName].length;
                let sum = data[yearRange][month][valueName].reduce((acc, value) => {
                  return acc + value;
                }, 0);
                data[yearRange][month][valueName] = sum / length;
              });
            });
          });
          // reformat to expected output
          // [ month,2025rcp45_max,2025rcp45_weighted_mean,2025rcp45_min,2025rcp45_p10,2025rcp45_p90,2025rcp85_max,2025rcp85_weighted_mean,2025rcp85_min,2025rcp85_p10,2025rcp85_p90,2050rcp45_max,2050rcp45_weighted_mean,2050rcp45_min,2050rcp45_p10,2050rcp45_p90,2050rcp85_max,2050rcp85_weighted_mean,2050rcp85_min,2050rcp85_p10,2050rcp85_p90,2075rcp45_max,2075rcp45_weighted_mean,2075rcp45_min,2075rcp45_p10,2075rcp45_p90,2075rcp85_max,2075rcp85_weighted_mean,2075rcp85_min,2075rcp85_p10,2075rcp85_p90 ]
          let dataByMonth = {};
          let months = this._months;
          if (this.options.frequency === 'seasonal') {
            months = ['01', '04', '07', '10']
          }
          months.forEach((month) => {
            dataByMonth[month] = {};
            [2025, 2050, 2075].forEach((yearRange) => {
              ['45', '85'].forEach((scenario) => {
                ['max', 'wMean', 'min'].forEach((valueName) => {
                  dataByMonth[month][String(yearRange) + 'rcp' + String(scenario) + '_' + String(valueName)] = data[yearRange][month][String(valueName) + String(scenario)];
                });
              });
            });
          });
          let result = [];
          Object.keys(dataByMonth).forEach((month) => {
            result.push([month,
              dataByMonth[month]['2025rcp45_max'],
              dataByMonth[month]['2025rcp45_wMean'],
              dataByMonth[month]['2025rcp45_min'],
              null,
              null,
              dataByMonth[month]['2025rcp85_max'],
              dataByMonth[month]['2025rcp85_wMean'],
              dataByMonth[month]['2025rcp85_min'],
              null,
              null,
              dataByMonth[month]['2050rcp45_max'],
              dataByMonth[month]['2050rcp45_wMean'],
              dataByMonth[month]['2050rcp45_min'],
              null,
              null,
              dataByMonth[month]['2050rcp85_max'],
              dataByMonth[month]['2050rcp85_wMean'],
              dataByMonth[month]['2050rcp85_min'],
              null,
              null,
              dataByMonth[month]['2075rcp45_max'],
              dataByMonth[month]['2075rcp45_wMean'],
              dataByMonth[month]['2075rcp45_min'],
              null,
              null,
              dataByMonth[month]['2075rcp85_max'],
              dataByMonth[month]['2075rcp85_wMean'],
              dataByMonth[month]['2075rcp85_min'],
              null,
              null]);
          });

          // Sort before returning
          result.sort((a, b) => {
            return (a[0] > b[0]) - (a[0] < b[0])
          });

          this.dataurls.proj_mod = this._format_export_data(['month', '2025_rcp45_max', '2025_rcp45_weighted_mean', '2025_rcp45_min', '2025_rcp85_max', '2025_rcp85_weighted_mean', '2025_rcp85_min', '2050_rcp45_max', '2050_rcp45_weighted_mean', '2050_rcp45_min', '2050_rcp85_max', '2050_rcp85_weighted_mean', '2050_rcp85_min', '2075_rcp45_max', '2075_rcp45_weighted_mean', '2075_rcp45_min', '2075_rcp85_max', '2075_rcp85_weighted_mean', '2075_rcp85_min'], result);
          return result
        }
      }).bind(this));
  }

  /**
   * Transform an anchor element to download the current graph as an image. Return false on failure / no data.
   * @param link
   * @returns {boolean}
   */
  download_image(link) {
    link.href = this.$graphdiv.find('canvas')[0].toDataURL('image/png');
    link.download = [
      this.options.get_region_label.bind(this)(),
      this.options.frequency,
      this.options.variable,
      "graph"
    ].join('-').replace(/ /g, '_') + '.png';
    return true;
  }

  /**
   * Transform an anchor element to download the historic observed data. Return false on failure / no data.
   * @param link
   * @returns {boolean}
   */
  download_hist_obs_data(link) {
    if (!this.dataurls.hist_obs) {
      link.href = '#nodata';
      return false;
    }
    link.href = this.dataurls.hist_obs;
    link.download = [
      this.options.get_region_label.bind(this)(),
      this.options.frequency,
      "hist_obs",
      this.options.variable
    ].join('-').replace(/ /g, '_') + '.csv';
    return true;
  }

  /**
   * Transform an anchor element to download the historic modelled data. Return false on failure / no data.
   * @param link
   * @returns {boolean}
   */
  download_hist_mod_data(link) {
    if (!this.dataurls.hist_mod) {
      link.href = '#nodata';
      return false;
    }
    link.href = this.dataurls.hist_mod;
    link.download = [
      this.options.get_region_label.bind(this)(),
      this.options.frequency,
      "hist_mod",
      this.options.variable
    ].join('-').replace(/ /g, '_') + '.csv';
    return true;
  }

  /**
   * Transform an anchor element to download the projected modelled data. Return false on failure / no data.
   * @param link
   * @returns {boolean}
   */
  download_proj_mod_data(link) {
    if (!this.dataurls.proj_mod) {
      link.href = '#nodata';
      return false;
    }
    link.href = this.dataurls.proj_mod;
    link.download = [
      this.options.get_region_label.bind(this)(),
      this.options.frequency,
      "proj_mod",
      this.options.variable
    ].join('-').replace(/ /g, '_') + '.csv';
    return true;
  }

  _set_range(axis, min, max) {
    let pan = axis.pan();
    let panMin = pan ? pan.min().getRealValue() : null;
    let panMax = pan ? pan.max().getRealValue() : null;
    let zoom = axis.zoom();
    let zoomMin = zoom ? zoom.min().getRealValue() : null;
    let zoomMax = zoom ? zoom.max().getRealValue() : null;
    if (panMax !== null && max > panMax) {
      return false;
    }
    if (panMin !== null && min < panMin) {
      return false;
    }
    if (zoomMax !== null && (max - min) > zoomMax) {
      return false;
    }
    if (zoomMin !== null && (max - min) < zoomMin) {
      return false;
    }
    axis.setDataRange(min - 0.5, max + 0.5);
    this.multigraph.render();
    return true;
  }

  /**
   * This function will set the range of data visible on the graph's x-axis when an annual data graph is displayed (monthly and seasonal data graphs have fixed x-axes).
   *
   * @param min
   * @param max
   * @returns {boolean}
   */
  set_x_axis_range(min, max) {
    return this._set_range(this.axes.x_annual, min, max);
  }

  /**
   * Forces multigraph to resize to its container
   */
  resize() {
    if (this.multigraph) {
      this.multigraph.resize();
    }
  }

  _average(data, first_year, last_year) {
    //    [[1921,1.3,33.5,2.5,...],
    //     [1922,1.3,33.5,2.5,...],
    //     ...]
    let sum = 0;
    let n = 0;
    data.forEach((row) => {
      if (row[0] >= first_year && row[0] <= last_year) {
        sum += row[1];
        ++n;
      }
    });
    return sum / n;
  }

  _anomalies(data, ref) {
    return data.map((row) => {
      let arow = [row[0]];
      let i;
      for (i = 1; i < row.length; ++i) {
        if (row[i] === null) {
          arow[i] = row[i];
          continue;
        }
        arow[i] = row[i] - ref;
      }
      return arow;
    });
  }

  _percent_anomalies(data, ref) {
    return data.map((row) => {
      let arow = [row[0]];
      let i;
      for (i = 1; i < row.length; ++i) {
        if (row[i] === null) {
          arow[i] = row[i];
          continue;
        }
        arow[i] = 100 * row[i] / ref;
      }
      return arow;
    });
  }

  _show_spinner() {
    this._hide_spinner();
    let style = "<style>.cwg-spinner { margin-top: -2.5rem; border-radius: 100%;border-style: solid;border-width: 0.25rem;height: 5rem;width: 5rem;animation: basic 1s infinite linear; border-color: rgba(0, 0, 0, 0.2);border-top-color: rgba(0, 0, 0, 1); }@keyframes basic {0%   { transform: rotate(0); }100% { transform: rotate(359.9deg); }} .cwg-spinner-wrapper {display:flex; align-items: center; justify-content: center; }</style>";
    $("<div class='cwg-spinner-wrapper'><div class='cwg-spinner'></div></div>").css({
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      zIndex: 1000000
    }).append(style).appendTo(this.$element.css("position", "relative"));
  }

  _hide_spinner() {
    this.$element.find('.cwg-spinner-wrapper').remove();
  }

  _format_export_data(column_labels, data, precision_digits = 1) {
    let export_data = data.map((row) => row.filter((cell) => cell !== null));
    export_data.unshift(column_labels);
    return 'data:text/csv;base64,' + window.btoa(export_data.map((a) => a.join(', ')).join('\n'));

  }

  _round_2d_values(data, ndigits = 1) {
    return data.map((row) => row.map((cell) => Number.isFinite(cell) ? round(cell, ndigits) : null));
  }

}

//
// legacy jQuery Widget api for ClimateByLocationWidget
//
(function ($) {
  if (!$.hasOwnProperty('widget')) {
    console.log("jQuery Widget not found, disabled support for Climate By Location jQuery api.");
    return
  }

  $.widget("nemac.climate_by_location", {
    element: null,
    climate_by_location_widget: null,
    _create: function () {
      this.climate_by_location_widget = new ClimateByLocationWidget(this.element, this.options)
    },
    _setOptions: function (options) {
      this.climate_by_location_widget.set_options(options);
      return this;
    },

    update: function () {
      this.climate_by_location_widget.update()
    },

    resize: function () {
      this.climate_by_location_widget.resize()
    },

    setXRange: function (min, max) {
      return this.climate_by_location_widget.set_x_axis_range(min, max);
    },

    get_variables: function (frequency, unitsystem, region) {
      return ClimateByLocationWidget.get_variables(frequency, unitsystem, region)
    },

    download_image: function (link) {
      this.climate_by_location_widget.download_image(link)
    },
    download_hist_obs_data: function (link) {
      this.climate_by_location_widget.download_hist_obs_data(link)
    },
    download_hist_mod_data: function (link) {
      this.climate_by_location_widget.download_hist_mod_data(link)
    },
    download_proj_mod_data: function (link) {
      this.climate_by_location_widget.download_proj_mod_data(link)
    }


  });
})(jQuery);

//
// Utility functions
//
function fahrenheit_to_celsius(f) {
  return (5 / 9) * (f - 32)
}

function fdd_to_cdd(fdd) {
  return fdd / 9 * 5;
}

function inches_to_mm(inches) {
  return inches * 25.4;
}

function no_conversion(x) {
  return x;
}


