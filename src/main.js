'use strict';
// This file defines the single global name "climate_widget" which contains the following functions:
//   climate_widget.graph(OPTIONS)
//   climate_widget.variables(FREQUENCY)
// See the file README.md for more details.

/* globals jQuery */

// String.endsWith() polyfill for browsers that don't implement it
if (!String.prototype.endsWith) {
  String.prototype.endsWith = function (searchString, position) {
    var subjectString = this.toString();
    if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
      position = subjectString.length;
    }
    position -= searchString.length;
    var lastIndex = subjectString.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  };
}


(function ($) {

  // "KeyObj" is a kind of nested index object that we use to store
// references to all the Plot objects in the graph.  A KeyObj
// object (constructed via new KeyObj() defined below) is just
// like a plain old JS object, in the sense that it can arbitrary
// properties and values, except that it has a prototype that
// defines arbitrary-depth setter and getter methods (set_in &
// get_in), and a method call each_keys for iterating over
// multiple levels of nesting in a single loop.
  function KeyObj() {
  }

  KeyObj.prototype = {
    set_in: function (keys, value) {
      // Set a property value in a nested KeyObj corresponding to successive levels of nesting.
      // For example:
      //    x = new KeyObj();
      //    x.set_in(["foo", "bar", "bat"], 42)
      // results in
      //    x = { foo: { bar: { bat: 42 } } }
      // (where each {} indicates a KeyObj object)
      var p = this;
      keys.slice(0, -1).forEach(function (key) {
        if (key in p) {
          p = p[key];
          if (!p.set_in) {
            throw new Error("set_in: cannot drill into non-KeyObj object");
          }
        } else {
          p[key] = new KeyObj();
          p = p[key];
        }
      });
      p[keys[keys.length - 1]] = value;
    },

    get_in: function (keys) {
      // Return a property value in a nested KeyObj; keys is an array of property names
      // corresponding to successive levels of nesting.  If at any level the element of
      // the keys array is undefined, or the object at that level does not contain a property
      // with the given name, the value of the object at that level is returned.
      var i = 0, obj = this;
      while (this.get_in && (i < keys.length) && (keys[i] !== undefined) && (keys[i] in obj)) {
        obj = obj[keys[i]];
        ++i;
      }
      return obj;
    },

    each_keys: function (levels, f, k) {
      // each_keys provides a concise way of looping over the contents
      // of a arbitrary-depth nested KeyObj.
      //
      // each_keys(levels,f) takes an array "levels"
      // of "level names", and a 1-arg function f.  The "levels" array
      // determines the depth of the nesting in "obj" to be traversed.
      // f will be called once for each combination of
      // nested properties corresponding to the given levels.  The argument
      // to f is an object whose properties are the level names, and
      // whose values are the corresponding property names.  For example,
      // if the object x is defined by:
      //     x = new KeyObj();
      //     x.set_in(["med", "rcp45"], "one");
      //     x.set_in(["med", "rcp85"], "two");
      //     x.set_in(["max", "rcp45"], "three");
      //     x.set_in(["max", "rcp65"], "four");
      //     x.set_in(["max", "rcp85"], "five");
      //     x.set_in(["min"],          "six");
      // then
      //     x.each_keys(["stat", "scenario"], function(k) {
      //       console.log(k);
      //     });
      // will result in the output:
      //     { stat: 'med', scenario: 'rcp45' }
      //     { stat: 'med', scenario: 'rcp85' }
      //     { stat: 'max', scenario: 'rcp45' }
      //     { stat: 'max', scenario: 'rcp65' }
      //     { stat: 'max', scenario: 'rcp85' }
      //     { stat: 'min' }
      // whereas
      //     x.each_keys(["stat"], function(k) {
      //       console.log(k);
      //     });
      // will result in the output:
      //     { stat: 'med' }
      //     { stat: 'max' }
      //     { stat: 'min' }
      // Note that traversal of the nested structure stops, and
      // results in a call to the callback function f, either
      // when all the levels in the keys array have been
      // traversed, or when an object is reached that is not a
      // KeyObj. Note also that the callback function f does not
      // receive a reference to the KeyObj or the values stored
      // in it --- it just receives an object giving the names of
      // the property values down to the given number of levels.
      //
      // Note that the 3rd arg to each_keys is only used internally -- calls
      // to each_keys from outside its own implementation should only
      // pass in 2 args.
      if (k === undefined) {
        this.each_keys(levels, f, {});
        return;
      }
      if (levels.length === 0) {
        return;
      }
      var level = levels[0];
      var that = this;
      Object.keys(this).forEach(function (keyValue) {
        if (!that.hasOwnProperty(keyValue)) {
          return;
        }
        var d = {};
        d[level] = keyValue;
        k = $.extend({}, k, d);
        if (!that[keyValue].each_keys || levels.length === 1) {
          f(k);
        } else {
          that[keyValue].each_keys(levels.slice(1), f, k);
        }
      });
    }
  };

  function fahrenheit_to_celsius(f) {
    return (5 / 9) * (f - 32)
  }

  function fdd_to_cdd(fdd) {
    return fdd / 9 * 5;
  }

  function inches_to_mm (inches) {
    return inches * 25.4;
  }

  function no_conversion (x) {
    return x;
  }
  
  
  if (!$.hasOwnProperty('widget')) {
    console.error("jQuery Widget not found.");
    return
  }

  $.widget("nemac.climate_by_location", {


//        'county'         : selectedCounty,       // 5-character fips code for county
//        'frequency'    : selectedFrequency,    // time frequency of graph to display ("annual", "monthly", or "seasonal")
//        'timeperiod'   : selectedTimePeriod,   // time period center for monthly/seasonal graphs ("2025", "2050", or "2075"); only
//                                                  relevant for monthly or seasonal frequency)
//        'variable'     : selectedVariable,     // name of variable to display; see climate-widget-graph.js for list of variables
//        'scenario'     : selectedScenario,     // name of scenario to display: "both", "rcp45", or "rcp85"
//        'presentation' : selectedPresentation  // name of presentation; "absolute" or "anomaly" (only relevant for annual frequency)

//        'div'           :  "div#widget",         // jquery-style selector for the dom element that you want the graph to appear in
//        'dataprefix'    : 'http://climate-widget-data.nemac.org/data',
//        'font'          : 'Roboto',
//        'frequency'     :  $('#frequency').val(),    // time frequency of graph to display ("annual", "monthly", or "seasonal")
//        'timeperiod'    :  selectedTimePeriod,   // time period center for monthly/seasonal graphs ("2025", "2050", or "2075")
//        'county'          :  selectedCounty,       // 5-character fips code for county (as a string)
//        'state'          :  selectedState,       // 2-character abbreviation code for state (as a string)
//        'variable'      :  selectedVariable,     // name of variable to display; see climate-widget-graph.js for list of variables
//        'scenario'      :  selectedScenario,     // name of scenario to display; both, rcp45, or rcp85
//        'presentation'  :  selectedPresentation  // name of presentation; absolute or anomaly with respect to a baseline value

// required:
//   dataprefix
//   state or county
//
// optional, but no default provided:
//   font  (defaults to whatever the browser's default canvas font is)
//
// optional, with defaults provided:
//   unitsystem        ("english")
//   frequency         ("annual")
//   variable          ("tmax")
//   presentation      ("absolute")
//   scenario          ("both")
//   timeperiod        ("2025")
    options: {
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
      //dataprefix:  no default for this one; it's required
      county: null,
      state: null,
      get_region_label: null,
      // Data ranges will get scaled by this factor when setting y axis ranges.
      // Previously was 1.1, but set to 1 now to avoid awkard negative values for
      // things that can never be negative.
      yAxisRangeScaleFactor: 1
    },
    variables: [
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
        }
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
        }
      },
      {
        id: "days_tmax_gt_90f",
        title: {
          english: " Days per year with max above 90°F",
          metric: " Days per year with max above 90°F"
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
              english: " Days per year with max above 90°F",
              metric: " Days per year with max above 90°F"
            },
            anomaly: {
              english: " Days per year with max above 90°F",
              metric: " Days per year with max above 90°F"
            }
          }
        }
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
              metric: "Days per year with max above 95°C"
            },
            anomaly: {
              english: "Days per year with max above 95°F departure",
              metric: "Days per year with max above 95°C departure"
            }
          }
        }
      },
      {
        id: "days_tmax_gt_100f",
        title: {
          english: "Days per year with max above 100°F",
          metric: "Days per year with max above 100°F"
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
              metric: "Days per year with max above 100°F"
            },
            anomaly: {
              english: " Days per year with max above 100°F",
              metric: " Days per year with max above 100°F"
            }
          }
        }
      },
      {
        id: "days_tmax_gt_105f",
        title: {
          english: "Days per year with max above 105°F",
          metric: "Days per year with max above 105°F"
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
              metric: "Days per year with max above 105°F"
            },
            anomaly: {
              english: "Days per year with max above 105°F departure",
              metric: "Days per year with max above 105°F departure"
            }
          }
        }
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
        }
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
        }
      },
      {
        id: "days_tmin_gt_80f",
        title: {
          english: "Days per year with min above 80°F",
          metric: "Days per year with min above 80°F"
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
              metric: "Days per year with min above 80°F"
            },
            anomaly: {
              english: "Days per year with min above 80°F departure",
              metric: "Days per year with min above 80°F departure"
            }
          }
        }
      },
      {
        id: "days_tmin_gt_90f",
        title: {
          english: "Days per year with min above 90°F",
          metric: "Days per year with min above 90°F"
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
              metric: "Days per year with min above 90°F"
            },
            anomaly: {
              english: "Days per year with min above 90°F departure",
              metric: "Days per year with min above 90°F departure"
            }
          }
        }
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
        }
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
        }
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
        }
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
        }
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
        }
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
        }
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

        }
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

        }
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
        }
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
        }
      }
    ],
    element: null,

    _create: function (options) {
      this.convertArray = window.multigraph.core.ArrayData.stringArrayToDataValuesArray;
      if (!this.options.get_region_label){
        this.options.get_region_label = this.get_region_value;
      }
      this.mugl = {
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
              {format: "%1d", spacing: [10000, 5000, 2000, 1000, 500, 200, 100, 50, 20, 10, 5, 2, 1]},
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
        plots: [
          //
          // annual plots:
          //
          this.band_plot("x_annual", "annual_hist_mod_x", "y", "annual_hist_mod_min", "annual_hist_mod_max", this.options.colors.grays.outerBand, this.options.colors.opacities.ann_hist_minmax),
          this.band_plot("x_annual", "annual_hist_mod_x", "y", "annual_hist_mod_p10", "annual_hist_mod_p90", this.options.colors.grays.innerBand, this.options.colors.opacities.ann_hist_1090),
          this.band_plot("x_annual", "annual_proj_mod_x", "y", "annual_proj_mod_min_rcp45", "annual_proj_mod_max_rcp45", this.options.colors.blues.outerBand, this.options.colors.opacities.ann_proj_minmax),
          this.band_plot("x_annual", "annual_proj_mod_x", "y", "annual_proj_mod_p10_rcp45", "annual_proj_mod_p90_rcp45", this.options.colors.blues.innerBand, this.options.colors.opacities.ann_proj_1090),
          this.band_plot("x_annual", "annual_proj_mod_x", "y", "annual_proj_mod_min_rcp85", "annual_proj_mod_max_rcp85", this.options.colors.reds.outerBand, this.options.colors.opacities.ann_proj_minmax),
          this.band_plot("x_annual", "annual_proj_mod_x", "y", "annual_proj_mod_p10_rcp85", "annual_proj_mod_p90_rcp85", this.options.colors.reds.innerBand, this.options.colors.opacities.ann_proj_1090),
          this.bar_plot_based_at("x_annual", "annual_hist_obs_x", "y", "annual_hist_obs_y", 0),
          this.line_plot("x_annual", "annual_hist_mod_x", "y", "annual_hist_mod_med", "#000000"),
          this.line_plot("x_annual", "annual_proj_mod_x", "y", "annual_proj_mod_med_rcp45", this.options.colors.blues.line),
          this.line_plot("x_annual", "annual_proj_mod_x", "y", "annual_proj_mod_med_rcp85", this.options.colors.reds.line),
          //
          // monthly plots:
          //
          this.line_plot("x_monthly", "monthly_hist_obs_x", "y", "monthly_hist_obs_med", "#000000"),
          // Hiding historical range for now
          //line_plot("x_monthly", "monthly_hist_obs_x", "y", "monthly_hist_obs_p10", "#000000", true)
          //line_plot("x_monthly", "monthly_hist_obs_x", "y", "monthly_hist_obs_p90", "#000000", true)

          this.band_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_min_rcp45_2025", "monthly_proj_mod_max_rcp45_2025", this.options.colors.blues.innerBand, this.options.colors.opacities.mon_proj_minmax),
          this.band_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_min_rcp85_2025", "monthly_proj_mod_max_rcp85_2025", this.options.colors.reds.innerBand, this.options.colors.opacities.mon_proj_minmax),
          this.band_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_p10_rcp45_2025", "monthly_proj_mod_p90_rcp45_2025", this.options.colors.blues.innerBand, this.options.colors.opacities.mon_proj_1090),
          this.band_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_p10_rcp85_2025", "monthly_proj_mod_p90_rcp85_2025", this.options.colors.reds.innerBand, this.options.colors.opacities.mon_proj_1090),
          this.line_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_med_rcp45_2025", this.options.colors.blues.outerBand),
          this.line_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_med_rcp85_2025", this.options.colors.reds.line),

          this.band_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_min_rcp45_2050", "monthly_proj_mod_max_rcp45_2050", this.options.colors.blues.innerBand, this.options.colors.opacities.mon_proj_minmax),
          this.band_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_min_rcp85_2050", "monthly_proj_mod_max_rcp85_2050", this.options.colors.reds.innerBand, this.options.colors.opacities.mon_proj_minmax),
          this.band_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_p10_rcp45_2050", "monthly_proj_mod_p90_rcp45_2050", this.options.colors.blues.innerBand, this.options.colors.opacities.mon_proj_1090),
          this.band_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_p10_rcp85_2050", "monthly_proj_mod_p90_rcp85_2050", this.options.colors.reds.innerBand, this.options.colors.opacities.mon_proj_1090),
          this.line_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_med_rcp45_2050", this.options.colors.blues.outerBand),
          this.line_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_med_rcp85_2050", this.options.colors.reds.line),

          this.band_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_min_rcp45_2075", "monthly_proj_mod_max_rcp45_2075", this.options.colors.blues.innerBand, this.options.colors.opacities.mon_proj_minmax),
          this.band_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_min_rcp85_2075", "monthly_proj_mod_max_rcp85_2075", this.options.colors.reds.innerBand, this.options.colors.opacities.mon_proj_minmax),
          this.band_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_p10_rcp45_2075", "monthly_proj_mod_p90_rcp45_2075", this.options.colors.blues.innerBand, this.options.colors.opacities.mon_proj_1090),
          this.band_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_p10_rcp85_2075", "monthly_proj_mod_p90_rcp85_2075", this.options.colors.reds.innerBand, this.options.colors.opacities.mon_proj_1090),
          this.line_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_med_rcp45_2075", this.options.colors.blues.outerBand),
          this.line_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_med_rcp85_2075", this.options.colors.reds.line),

          //
          // seasonal plots
          //
          // Hiding historical range for now
          //range_bar_plot("x_seasonal", "seasonal_hist_obs_x", "y", "seasonal_hist_obs_p10", "seasonal_hist_obs_p90",  "#cccccc", "#cccccc", 0.5, 0.7);
          this.range_bar_plot("x_seasonal", "seasonal_proj_mod_x", "y", "seasonal_proj_mod_min_rcp45_2025", "seasonal_proj_mod_max_rcp45_2025", this.options.colors.blues.innerBand, this.options.colors.blues.innerBand, 0.25, 0.4),
          this.range_bar_plot("x_seasonal", "seasonal_proj_mod_x", "y", "seasonal_proj_mod_min_rcp85_2025", "seasonal_proj_mod_max_rcp85_2025", this.options.colors.reds.innerBand, this.options.colors.reds.innerBand, 0.0, 0.4),
          this.range_bar_plot("x_seasonal", "seasonal_proj_mod_x", "y", "seasonal_proj_mod_p10_rcp45_2025", "seasonal_proj_mod_p90_rcp45_2025", this.options.colors.blues.innerBand, this.options.colors.blues.innerBand, 0.25, 0.4),
          this.range_bar_plot("x_seasonal", "seasonal_proj_mod_x", "y", "seasonal_proj_mod_p10_rcp85_2025", "seasonal_proj_mod_p90_rcp85_2025", this.options.colors.reds.innerBand, this.options.colors.reds.innerBand, 0.0, 0.4),
          this.range_bar_plot("x_seasonal", "seasonal_proj_mod_x", "y", "seasonal_proj_mod_min_rcp45_2050", "seasonal_proj_mod_max_rcp45_2050", this.options.colors.blues.innerBand, this.options.colors.blues.innerBand, 0.25, 0.4),
          this.range_bar_plot("x_seasonal", "seasonal_proj_mod_x", "y", "seasonal_proj_mod_min_rcp85_2050", "seasonal_proj_mod_max_rcp85_2050", this.options.colors.reds.innerBand, this.options.colors.reds.innerBand, 0.0, 0.4),
          this.range_bar_plot("x_seasonal", "seasonal_proj_mod_x", "y", "seasonal_proj_mod_p10_rcp45_2050", "seasonal_proj_mod_p90_rcp45_2050", this.options.colors.blues.innerBand, this.options.colors.blues.innerBand, 0.25, 0.4),
          this.range_bar_plot("x_seasonal", "seasonal_proj_mod_x", "y", "seasonal_proj_mod_p10_rcp85_2050", "seasonal_proj_mod_p90_rcp85_2050", this.options.colors.reds.innerBand, this.options.colors.reds.innerBand, 0.0, 0.4),
          this.range_bar_plot("x_seasonal", "seasonal_proj_mod_x", "y", "seasonal_proj_mod_min_rcp45_2075", "seasonal_proj_mod_max_rcp45_2075", this.options.colors.blues.innerBand, this.options.colors.blues.innerBand, 0.25, 0.4),
          this.range_bar_plot("x_seasonal", "seasonal_proj_mod_x", "y", "seasonal_proj_mod_min_rcp85_2075", "seasonal_proj_mod_max_rcp85_2075", this.options.colors.reds.innerBand, this.options.colors.reds.innerBand, 0.0, 0.4),
          this.range_bar_plot("x_seasonal", "seasonal_proj_mod_x", "y", "seasonal_proj_mod_p10_rcp45_2075", "seasonal_proj_mod_p90_rcp45_2075", this.options.colors.blues.innerBand, this.options.colors.blues.innerBand, 0.25, 0.4),
          this.range_bar_plot("x_seasonal", "seasonal_proj_mod_x", "y", "seasonal_proj_mod_p10_rcp85_2075", "seasonal_proj_mod_p90_rcp85_2075", this.options.colors.reds.innerBand, this.options.colors.reds.innerBand, 0.0, 0.4),

          this.range_bar_plot("x_seasonal", "seasonal_hist_obs_x", "y", "seasonal_hist_obs_med", "seasonal_hist_obs_med", "#000000", "#000000", 0.5, 1.0),

          this.range_bar_plot("x_seasonal", "seasonal_proj_mod_x", "y", "seasonal_proj_mod_med_rcp45_2025", "seasonal_proj_mod_med_rcp45_2025", "#0000ff", "#0000ff", 0.25, 1.0),
          this.range_bar_plot("x_seasonal", "seasonal_proj_mod_x", "y", "seasonal_proj_mod_med_rcp85_2025", "seasonal_proj_mod_med_rcp85_2025", this.options.colors.reds.line, this.options.colors.reds.line, 0.0, 1.0),
          this.range_bar_plot("x_seasonal", "seasonal_proj_mod_x", "y", "seasonal_proj_mod_med_rcp45_2050", "seasonal_proj_mod_med_rcp45_2050", "#0000ff", "#0000ff", 0.25, 1.0),
          this.range_bar_plot("x_seasonal", "seasonal_proj_mod_x", "y", "seasonal_proj_mod_med_rcp85_2050", "seasonal_proj_mod_med_rcp85_2050", this.options.colors.reds.line, this.options.colors.reds.line, 0.0, 1.0),
          this.range_bar_plot("x_seasonal", "seasonal_proj_mod_x", "y", "seasonal_proj_mod_med_rcp45_2075", "seasonal_proj_mod_med_rcp45_2075", "#0000ff", "#0000ff", 0.25, 1.0),
          this.range_bar_plot("x_seasonal", "seasonal_proj_mod_x", "y", "seasonal_proj_mod_med_rcp85_2075", "seasonal_proj_mod_med_rcp85_2075", this.options.colors.reds.line, this.options.colors.reds.line, 0.0, 1.0)
        ],
        data: [{
          variables: [{id: "annual_hist_obs_x"},
            {id: "annual_hist_obs_y"}],
          values: [[-9999, 0]]
        }, {
          variables: [{id: "annual_hist_mod_x"},
            {id: "annual_hist_mod_med"},
            {id: "annual_hist_mod_min"},
            {id: "annual_hist_mod_max"},
            {id: "annual_hist_mod_p10"},
            {id: "annual_hist_mod_p90"}],
          values: [[-9999, 0, 0, 0, 0, 0, 0]]
        }, {
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
        }, {
          variables: [{id: "monthly_hist_obs_x"},
            {id: "monthly_hist_obs_mean30"},
            {id: "monthly_hist_obs_med"}],
          values: [[-9999, 0, 0]],
          repeat: {period: 12}
        }, {
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
        }, {
          variables: [{id: "seasonal_hist_obs_x"},
            {id: "seasonal_hist_obs_mean30"},
            {id: "seasonal_hist_obs_med"}],
          values: [[-9999, 0, 0]],
          repeat: {period: 4}
        }, {
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
        }]
      };
      if (!this.options.dataprefix) {
        throw new Error("climate_widget_graph: property 'dataprefix' is missing");
      }
      if (this.options.dataprefix.endsWith("/")) {
        this.options.dataprefix = this.options.dataprefix.replace(/\/$/, "");
      }
      $(this.element).empty();
      $('.errorDisplayDetails').remove();
      $(this.element).append("<div class='graph' style='width: 100%; height: 100%;'></div>");
      this.$graphdiv = $(this.element).find('div.graph');
      this.$graphdiv.multigraph({muglString: this.mugl, noscroll: true});
      $(window).resize(this.resize.bind(this));
      this.$graphdiv.multigraph('done', (function (m) {
        this.m = m;
        this.axes = {
          x_annual: this.m.graphs().at(0).axes().at(this.starti()),
          x_monthly: this.m.graphs().at(0).axes().at(this.nexti()),
          x_seasonal: this.m.graphs().at(0).axes().at(this.nexti()),
          y: this.m.graphs().at(0).axes().at(this.nexti())
        };

        this.axes.x_annual.addListener('dataRangeSet', function (e) {
          if (this.options.xrangefunc) {
            var min = Math.ceil(e.min.getRealValue());
            var max = Math.floor(e.max.getRealValue());
            this.options.xrangefunc(min, max);
          }
        }.bind(this));


        this.plots = new KeyObj();
        this.plots.set_in(["annual", "hist_mod", "minmax"], this.m.graphs().at(0).plots().at(this.starti()));
        this.plots.set_in(["annual", "hist_mod", "p1090"], this.m.graphs().at(0).plots().at(this.nexti()));
        this.plots.set_in(["annual", "proj_mod", "minmax", "rcp45"], this.m.graphs().at(0).plots().at(this.nexti()));
        this.plots.set_in(["annual", "proj_mod", "p1090", "rcp45"], this.m.graphs().at(0).plots().at(this.nexti()));
        this.plots.set_in(["annual", "proj_mod", "minmax", "rcp85"], this.m.graphs().at(0).plots().at(this.nexti()));
        this.plots.set_in(["annual", "proj_mod", "p1090", "rcp85"], this.m.graphs().at(0).plots().at(this.nexti()));
        this.plots.set_in(["annual", "hist_obs"], this.m.graphs().at(0).plots().at(this.nexti()));
        this.plots.set_in(["annual", "hist_mod", "med"], this.m.graphs().at(0).plots().at(this.nexti()));
        this.plots.set_in(["annual", "proj_mod", "med", "rcp45"], this.m.graphs().at(0).plots().at(this.nexti()));
        this.plots.set_in(["annual", "proj_mod", "med", "rcp85"], this.m.graphs().at(0).plots().at(this.nexti()));

        this.plots.set_in(["monthly", "hist_obs", "med"], this.m.graphs().at(0).plots().at(this.nexti()));
        this.plots.set_in(["monthly", "proj_mod", "minmax", "rcp45", "2025"], this.m.graphs().at(0).plots().at(this.nexti()));
        this.plots.set_in(["monthly", "proj_mod", "minmax", "rcp85", "2025"], this.m.graphs().at(0).plots().at(this.nexti()));
        this.plots.set_in(["monthly", "proj_mod", "p1090", "rcp45", "2025"], this.m.graphs().at(0).plots().at(this.nexti()));
        this.plots.set_in(["monthly", "proj_mod", "p1090", "rcp85", "2025"], this.m.graphs().at(0).plots().at(this.nexti()));
        this.plots.set_in(["monthly", "proj_mod", "med", "rcp45", "2025"], this.m.graphs().at(0).plots().at(this.nexti()));
        this.plots.set_in(["monthly", "proj_mod", "med", "rcp85", "2025"], this.m.graphs().at(0).plots().at(this.nexti()));
        this.plots.set_in(["monthly", "proj_mod", "minmax", "rcp45", "2050"], this.m.graphs().at(0).plots().at(this.nexti()));
        this.plots.set_in(["monthly", "proj_mod", "minmax", "rcp85", "2050"], this.m.graphs().at(0).plots().at(this.nexti()));
        this.plots.set_in(["monthly", "proj_mod", "p1090", "rcp45", "2050"], this.m.graphs().at(0).plots().at(this.nexti()));
        this.plots.set_in(["monthly", "proj_mod", "p1090", "rcp85", "2050"], this.m.graphs().at(0).plots().at(this.nexti()));
        this.plots.set_in(["monthly", "proj_mod", "med", "rcp45", "2050"], this.m.graphs().at(0).plots().at(this.nexti()));
        this.plots.set_in(["monthly", "proj_mod", "med", "rcp85", "2050"], this.m.graphs().at(0).plots().at(this.nexti()));
        this.plots.set_in(["monthly", "proj_mod", "minmax", "rcp45", "2075"], this.m.graphs().at(0).plots().at(this.nexti()));
        this.plots.set_in(["monthly", "proj_mod", "minmax", "rcp85", "2075"], this.m.graphs().at(0).plots().at(this.nexti()));
        this.plots.set_in(["monthly", "proj_mod", "p1090", "rcp45", "2075"], this.m.graphs().at(0).plots().at(this.nexti()));
        this.plots.set_in(["monthly", "proj_mod", "p1090", "rcp85", "2075"], this.m.graphs().at(0).plots().at(this.nexti()));
        this.plots.set_in(["monthly", "proj_mod", "med", "rcp45", "2075"], this.m.graphs().at(0).plots().at(this.nexti()));
        this.plots.set_in(["monthly", "proj_mod", "med", "rcp85", "2075"], this.m.graphs().at(0).plots().at(this.nexti()));

        this.plots.set_in(["seasonal", "proj_mod", "minmax", "rcp45", "2025"], this.m.graphs().at(0).plots().at(this.nexti()));
        this.plots.set_in(["seasonal", "proj_mod", "minmax", "rcp85", "2025"], this.m.graphs().at(0).plots().at(this.nexti()));
        this.plots.set_in(["seasonal", "proj_mod", "p1090", "rcp45", "2025"], this.m.graphs().at(0).plots().at(this.nexti()));
        this.plots.set_in(["seasonal", "proj_mod", "p1090", "rcp85", "2025"], this.m.graphs().at(0).plots().at(this.nexti()));
        this.plots.set_in(["seasonal", "proj_mod", "minmax", "rcp45", "2050"], this.m.graphs().at(0).plots().at(this.nexti()));
        this.plots.set_in(["seasonal", "proj_mod", "minmax", "rcp85", "2050"], this.m.graphs().at(0).plots().at(this.nexti()));
        this.plots.set_in(["seasonal", "proj_mod", "p1090", "rcp45", "2050"], this.m.graphs().at(0).plots().at(this.nexti()));
        this.plots.set_in(["seasonal", "proj_mod", "p1090", "rcp85", "2050"], this.m.graphs().at(0).plots().at(this.nexti()));
        this.plots.set_in(["seasonal", "proj_mod", "minmax", "rcp45", "2075"], this.m.graphs().at(0).plots().at(this.nexti()));
        this.plots.set_in(["seasonal", "proj_mod", "minmax", "rcp85", "2075"], this.m.graphs().at(0).plots().at(this.nexti()));
        this.plots.set_in(["seasonal", "proj_mod", "p1090", "rcp45", "2075"], this.m.graphs().at(0).plots().at(this.nexti()));
        this.plots.set_in(["seasonal", "proj_mod", "p1090", "rcp85", "2075"], this.m.graphs().at(0).plots().at(this.nexti()));
        this.plots.set_in(["seasonal", "hist_obs", "med"], this.m.graphs().at(0).plots().at(this.nexti()));
        this.plots.set_in(["seasonal", "proj_mod", "med", "rcp45", "2025"], this.m.graphs().at(0).plots().at(this.nexti()));
        this.plots.set_in(["seasonal", "proj_mod", "med", "rcp85", "2025"], this.m.graphs().at(0).plots().at(this.nexti()));
        this.plots.set_in(["seasonal", "proj_mod", "med", "rcp45", "2050"], this.m.graphs().at(0).plots().at(this.nexti()));
        this.plots.set_in(["seasonal", "proj_mod", "med", "rcp85", "2050"], this.m.graphs().at(0).plots().at(this.nexti()));
        this.plots.set_in(["seasonal", "proj_mod", "med", "rcp45", "2075"], this.m.graphs().at(0).plots().at(this.nexti()));
        this.plots.set_in(["seasonal", "proj_mod", "med", "rcp85", "2075"], this.m.graphs().at(0).plots().at(this.nexti()));
        this.data = {
          annual_hist_obs: this.m.graphs().at(0).data().at(this.starti()),
          annual_hist_mod: this.m.graphs().at(0).data().at(this.nexti()),
          annual_proj_mod: this.m.graphs().at(0).data().at(this.nexti()),
          monthly_hist_obs: this.m.graphs().at(0).data().at(this.nexti()),
          monthly_proj_mod: this.m.graphs().at(0).data().at(this.nexti()),
          seasonal_hist_obs: this.m.graphs().at(0).data().at(this.nexti()),
          seasonal_proj_mod: this.m.graphs().at(0).data().at(this.nexti())
        };
        this.update();
      }).bind(this));
    },

    _setOptions: function (options) {
      var old_options = Object.assign({}, this.options);
      this._super(options);

      if (typeof options.pmedian === "string") {
        options.pmedian = options.pmedian.toLowerCase() === "true";
      }
      if (typeof options.hmedian === "string") {
        options.hmedian = options.hmedian.toLowerCase() === "true";
      }
      if (typeof options.histobs === "string") {
        options.histobs = options.histobs.toLowerCase() === "true";
      }
      if (typeof options.histmod === "string") {
        options.histmod = options.histmod.toLowerCase() === "true";
      }
      if (typeof options.yzoom === "string") {
        options.yzoom = options.yzoom.toLowerCase() === "true";
      }
      if (typeof options.ypan === "string") {
        options.ypan = options.ypan.toLowerCase() === "true";
      }

      this.set_plot_visibilities();

      if (this.options.yzoom !== old_options.yzoom) {
        //console.log('yzoom changed');
        this.axes.y.zoom().allowed(this.options.yzoom);
        //console.log(this.axes.y.zoom().allowed());
      }
      if (this.options.ypan !== old_options.ypan) {
        //console.log('ypan changed');
        this.axes.y.pan().allowed(this.options.ypan);
        //console.log(this.axes.y.pan().allowed());
      }

      // if font changed, set it in all the relevant places
      if (this.options.font !== old_options.font) {
        var i, j;
        for (i = 0; i < this.m.graphs().at(0).axes().size(); ++i) {
          var axis = this.m.graphs().at(0).axes().at(i);
          if (axis.title()) {
            axis.title().font("14px " + this.options.font);
          }
          for (j = 0; j < axis.labelers().size(); ++j) {
            axis.labelers().at(j).font("12px " + this.options.font);
          }
        }
      }

      // if frequency, state, county, or variable changed, load data:
      if (this.options.frequency !== old_options.frequency ||
        this.options.state !== old_options.state ||
        this.options.county !== old_options.county ||
        this.options.presentation !== old_options.presentation ||
        this.options.variable !== old_options.variable) {
        this.update();
      }
      else{
        this.m.render();
      }

      return this;
    },

    update: function(){
      if (this.options.frequency === "annual") {

        this.axes.x_annual.visible(true);
        this.axes.x_monthly.visible(false);
        this.axes.x_seasonal.visible(false);

        this.each_plot(this.plots, function (plot) {
          plot.visible(false);
        });

        this.dataurls = {
          hist_obs: '',
          hist_mod: '',
          proj_mod: ''
        };
        this.show_spinner();
        //cancel previous (if any) requests


        return $.when.apply($, [
          this.get_historical_observed_data(),
          this.get_historical_model_data(),
          this.get_projected_model_data()
        ])
          .then((function (hist_obs_data, hist_mod_data, proj_mod_data) {
            this.hide_spinner();

            var convfunc = this.variable_config(this.options.variable).dataconverters[this.options.unitsystem];
            hist_obs_data = this.transform_data(hist_obs_data, convfunc);
            hist_mod_data = this.transform_data(hist_mod_data, convfunc);
            proj_mod_data = this.transform_data(proj_mod_data, convfunc);

            var avg = this.average(hist_obs_data, 1961, 1990);
            if (this.options.presentation === "anomaly") {
              if (this.options.variable === "pcpn") {
                hist_obs_data = this.percent_anomalies(hist_obs_data, avg);
                hist_mod_data = this.percent_anomalies(hist_mod_data, avg);
                proj_mod_data = this.percent_anomalies(proj_mod_data, avg);
              } else {
                hist_obs_data = this.anomalies(hist_obs_data, avg);
                hist_mod_data = this.anomalies(hist_mod_data, avg);
                proj_mod_data = this.anomalies(proj_mod_data, avg);
              }
            }

            var range = this.scale_range(this.datas_range([hist_obs_data, hist_mod_data, proj_mod_data]), this.options.yAxisRangeScaleFactor);
            this.axes.y.setDataRange(range.min, range.max);
            this.axes.y.title().content().string(
              this.variable_config(this.options.variable).ytitles.annual[this.options.presentation][this.options.unitsystem]
            );

            this.data.annual_hist_obs.array(this.convertArray(this.attr_list_array(this.data.annual_hist_obs.columns()), hist_obs_data));
            this.data.annual_hist_mod.array(this.convertArray(this.attr_list_array(this.data.annual_hist_mod.columns()), hist_mod_data));
            this.data.annual_proj_mod.array(this.convertArray(this.attr_list_array(this.data.annual_proj_mod.columns()), proj_mod_data));

            this.set_plot_visibilities();

            {
              // Set the base level for the annual hist_obs bar plot --- this is the y-level
              // at which the bars are based ("barbase" plot option), as well as the level
              // that determines the colors of the bars ("min"/"max" property of the "fillcolor"
              // option -- above this level is red, below it is green).
              var ref = avg;
              if (this.options.presentation === "anomaly") {
                if (this.options.variable === "pcpn") {
                  ref = 100;
                } else {
                  ref = 0;
                }
              }
              var number_val = new window.multigraph.core.NumberValue(ref);
              this.plots.annual.hist_obs.renderer().options().barbase().at(0).value(number_val);
              var j;
              for (j = 1; j < this.plots.annual.hist_obs.renderer().options().fillcolor().size(); ++j) {
                if (this.plots.annual.hist_obs.renderer().options().fillcolor().at(j).min()) {
                  this.plots.annual.hist_obs.renderer().options().fillcolor().at(j).min(number_val);
                }
                if (this.plots.annual.hist_obs.renderer().options().fillcolor().at(j).max()) {
                  this.plots.annual.hist_obs.renderer().options().fillcolor().at(j).max(number_val);
                }
              }
            }

            this.m.render();

          }).bind(this));

      }
      else if (this.options.frequency === "monthly") {
        this.axes.x_annual.visible(false);
        this.axes.x_monthly.visible(true);
        this.axes.x_seasonal.visible(false);

        this.each_plot(this.plots, function (plot) {
          plot.visible(false);
        });

        this.dataurls = {};
        this.show_spinner();

        return $.when.apply($, [
          this.get_historical_observed_data(),
          this.get_projected_model_data()
        ])
          .then(function (hist_obs_data, proj_mod_data) {
            this.hide_spinner();
            var convfunc = this.variable_config(this.options.variable).dataconverters[this.options.unitsystem];
            hist_obs_data = this.transform_data(hist_obs_data, convfunc);
            proj_mod_data = this.transform_data(proj_mod_data, convfunc);
            var range = this.scale_range(this.datas_range([hist_obs_data, proj_mod_data]), this.options.yAxisRangeScaleFactor);
            this.axes.y.setDataRange(range.min, range.max);
            this.axes.y.title().content().string(this.variable_config(this.options.variable).ytitles.monthly[this.options.unitsystem]);
            this.data.monthly_hist_obs.array(this.convertArray(this.attr_list_array(this.data.monthly_hist_obs.columns()), hist_obs_data));
            this.data.monthly_proj_mod.array(this.convertArray(this.attr_list_array(this.data.monthly_proj_mod.columns()), proj_mod_data));
            this.set_plot_visibilities();
            this.m.render();
          }.bind(this));


      }
      else if (this.options.frequency === "seasonal") {
        this.axes.x_annual.visible(false);
        this.axes.x_monthly.visible(false);
        this.axes.x_seasonal.visible(true);

        this.each_plot(this.plots, function (plot) {
          plot.visible(false);
        });

        this.dataurls = {};
        this.show_spinner();
        $.when.apply($, [
          this.get_historical_observed_data(),
          this.get_projected_model_data()
        ]).then((function (hist_obs_data, proj_mod_data) {
          this.hide_spinner();
          // The incoming data has month values 1,4,7,10.  Here we replace these with the values 0,1,2,3:
          hist_obs_data.forEach(function (v) {
            v[0] = Math.floor(v[0] / 3);
          });
          proj_mod_data.forEach(function (v) {
            v[0] = Math.floor(v[0] / 3);
          });
          var convfunc = this.variable_config(this.options.variable).dataconverters[this.options.unitsystem];
          hist_obs_data = this.transform_data(hist_obs_data, convfunc);
          proj_mod_data = this.transform_data(proj_mod_data, convfunc);
          var range = this.scale_range(this.datas_range([hist_obs_data, proj_mod_data]), this.options.yAxisRangeScaleFactor);
          this.axes.y.setDataRange(range.min, range.max);
          this.axes.y.title().content().string(this.variable_config(this.options.variable).ytitles.seasonal[this.options.unitsystem]);
          this.data.seasonal_hist_obs.array(this.convertArray(this.attr_list_array(this.data.seasonal_hist_obs.columns()), hist_obs_data));
          this.data.seasonal_proj_mod.array(this.convertArray(this.attr_list_array(this.data.seasonal_proj_mod.columns()), proj_mod_data));
          this.set_plot_visibilities();
          this.m.render();
        }).bind(this));
      }
      this.m.render();
    },

    get_region_reduction: function () {
      if (this.options.county) {
        return {'area_reduce': 'county_mean'}
      }
      if (this.options.state) {
        return {'area_reduce': 'state_mean'}
      }
    },

    get_region_value: function () {
      if (this.options.county) {
        return this.options.county
      }
      if (this.options.state) {
        return this.options.state
      }
    },

    get_region_parameters: function () {
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
    },

    variable_config: function (id) {
      var i;
      for (i = 0; i < this.variables.length; ++i) {
        if (this.variables[i].id === id) {
          return this.variables[i];
        }
      }
      return undefined;
    },

    get_variables: function (frequency, unitsystem) {
      unitsystem = unitsystem || this.options.unitsystem;
      return this.variables.filter(function (v) {
        return frequency in v.ytitles;
      }).map(function (v) {
        return {id: v.id, title: v.title[unitsystem]};
      });
    },

    transform_data: function (data, f) {
      // Takes a 2D data array, and modifies it in-place by replacing each y value
      // with the result of passing that y value to the function f.  The "y" values
      // consist of all values on every row EXCEPT for the 1st column.
      var i, j;
      for (i = 0; i < data.length; ++i) {
        for (j = 1; j < data[i].length; ++j) {
          data[i][j] = f(data[i][j]);
        }
      }
      return data;
    },

    datas_range: function (datas) {
      // Takes an array of data arrays, and returns a JS object giving the min and max
      // values present in all the data.  Each element of the incoming datas array
      // is a 2D array whose first column is an x value, and all the remaining columns
      // are "y" columns.  This function returns the min and max of all the y column
      // in all the data arrays.
      var min = datas[0][0][1];
      var max = datas[0][0][1];
      datas.forEach(function (data) {
        data.forEach(function (row) {
          row.slice(1).forEach(function (value) {
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
    },

    scale_range: function (range, factor) {
      // Take an object of the form returned by datas_range() above, and scale its
      // min and max values by a factor, returning a new object of the same form.
      var r = (range.max - range.min) / 2;
      var c = (range.max + range.min) / 2;
      return {
        min: c - r * factor,
        max: c + r * factor
      };
    },

    starti: function (v) {
      this._i = v || 0;
      return this._i;
    },
    nexti: function () {
      return ++this._i;
    },

    // The following function takes a jermaine attr_list instance and returns
    // a plain JS array containing all its values
    attr_list_array: function (attr_list) {
      var a = [], i;
      for (i = 0; i < attr_list.size(); ++i) {
        a.push(attr_list.at(i));
      }
      return a;
    },

    each_plot: function (plots, fn) {
      // Takes a JS object "plots", and a function "fn" which is assumed to take
      // a single argument which is a multigraph Plot object, and traverses
      // (recursively) all the properties inside obj, calling fn with every
      // Plot value it finds.
      Object.keys(plots).forEach((function (key) {
        if (plots[key] instanceof window.multigraph.core.Plot) {
          fn(plots[key]);
        } else if (typeof (plots[key]) === "object") {
          this.each_plot(plots[key], fn);
        }
      }).bind(this));
    },


    get_historical_observed_data: function () {
      var freq = (this.options.frequency === 'annual') ? 'annual' : 'monthly';
      var elems = [$.extend(this.variable_config(this.options.variable)['acis_elements'][freq], this.get_region_reduction())];
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
          "grid": "livneh",
          "elems": elems
        }, this.get_region_parameters()))
      })
        .then((function (response) {

          var data;

          if (this.options.frequency === 'annual') {
            data = [];
            response.data.forEach((function (record) {
              if (undefined !== record[1][this.get_region_value()] && String(record[1][this.get_region_value()]) !== '-999' && String(record[1][this.get_region_value()]) !== '') {
                data.push([record[0], Math.round((record[1][this.get_region_value()]) * 10) / 10]);
              }
            }).bind(this));
            this.dataurls.hist_obs = 'data:text/csv;base64,' + window.btoa(('year,' + this.variable_config(this.options.variable).id + '\n' + data.join('\n')));
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
            response.data.forEach((function (record) {
              if (undefined !== record[1][this.get_region_value()]) {
                data[record[0].slice(-2)].push(parseFloat(record[1][this.get_region_value()]));
              }
            }).bind(this));
            //group monthly data by season
            if (this.options.frequency === 'seasonal') {
              var seasons = {
                "01": ["12", "01", "02"],
                "04": ["03", "04", "05"],
                "07": ["06", "07", "08"],
                "10": ["09", "10", "11"]
              };
              data = Object.keys(seasons).reduce(function (acc, season) {
                acc[season] = [].concat(data[seasons[season][0]], data[seasons[season][1]], data[seasons[season][2]]);
                return acc;
              }, {});
            }
            var mean = Object.keys(data).reduce(function (acc, key) {
              acc[key] = Math.round((data[key].reduce(function (a, b) {
                return a + b;
              }) / data[key].length) * 10) / 10;
              return acc;
            }, {});
            // var median = Object.keys(data).reduce(function (acc, key) {
            //   data[key].sort(function (a, b) {
            //     return a - b;
            //   });
            //   var half = Math.floor(data[key].length / 2);
            //   if (data[key].length % 2)
            //     acc[key] = Math.round(data[key][half]* 10) / 10;
            //   else
            //     acc[key] = Math.round(((data[key][half - 1] + data[key][half]) / 2.0) * 10) / 10;
            //   return acc;
            // }, {});
            //return [[month, weighted mean]]
            var export_data = [];
            data = Object.keys(data).reduce(function (acc, key) {
              acc.push([parseInt(key), null, mean[key]]);
              export_data.push([parseInt(key), mean[key]]);
              return acc;
            }, []).sort(function (a, b) {
              return parseInt(a[0]) - parseInt(b[0])
            });
            export_data.sort(function (a, b) {
              return parseInt(a[0]) - parseInt(b[0])
            });
            this.dataurls.hist_obs = 'data:text/csv;base64,' + window.btoa(('month,weighted_mean\n' + export_data.join('\n')));
            return data;

          }
        }).bind(this));
    },

    get_loca_data: function (grid, sdate, edate) {

      var freq = (this.options.frequency === 'annual') ? 'annual' : 'monthly';
      var elems = [$.extend(this.variable_config(this.options.variable)['acis_elements'][freq], this.get_region_reduction())];

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
        }, this.get_region_parameters()))
      })
        .then((function (response) {
          var data = {};
          response.data.forEach((function (record) {
            if (undefined !== record[1][this.get_region_value()] && String(record[1][this.get_region_value()]) !== '-999' && String(record[1][this.get_region_value()]) !== '') {
              data[record[0]] = record[1][this.get_region_value()]
            }
          }).bind(this));
          return data;
        }).bind(this));
    },

    get_historical_model_data: function () {
      // var edate = (String(new Date().getFullYear())) + '-01-01';
      var edate = '2006-12-31';
      return $.when.apply($, [
        this.get_loca_data('loca:wMean:rcp85', '1950-01-01', edate),
        this.get_loca_data('loca:allMin:rcp85', '1950-01-01', edate),
        this.get_loca_data('loca:allMax:rcp85', '1950-01-01', edate)
      ])
        .then((function (wMean, min, max) {
          var data = [];
          var export_data = [];
          for (var key = 1950; key <= 2006; key++) {
            var values = {};
            values.wMean = wMean.hasOwnProperty(key) ? Math.round(wMean[key] * 10) / 10 : null;
            values.min = min.hasOwnProperty(key) ? Math.round(min[key] * 10) / 10 : null;
            values.max = max.hasOwnProperty(key) ? Math.round(max[key] * 10) / 10 : null;
            //year,mean,min,max,?,?
            data.push([String(key), values.wMean, values.min, values.max, null, null]);
            export_data.push([String(key), values.wMean, values.min, values.max])
          }
          // Sort before returning
          data.sort(function (a, b) {
            return (a[0] > b[0]) - (a[0] < b[0])
          });
          export_data.sort(function (a, b) {
            return parseInt(a[0]) - parseInt(b[0])
          });
          this.dataurls.hist_mod = 'data:text/csv;base64,' + window.btoa(('year,weighted_mean,min,max' + '\n' + export_data.join('\n')));
          return data
        }).bind(this));
    },

    get_projected_model_data: function () {
      var sdate;

      if (this.options.frequency === 'annual') {
        // sdate = (String(new Date().getFullYear())) + '-01-01';
        sdate = '2006-01-01';
      } else {
        sdate = '2010-01-01';
      }

      return $.when.apply($, [
        this.get_loca_data('loca:wMean:rcp45', sdate, '2099-12-31'),
        this.get_loca_data('loca:allMin:rcp45', sdate, '2099-12-31'),
        this.get_loca_data('loca:allMax:rcp45', sdate, '2099-12-31'),
        this.get_loca_data('loca:wMean:rcp85', sdate, '2099-12-31'),
        this.get_loca_data('loca:allMin:rcp85', sdate, '2099-12-31'),
        this.get_loca_data('loca:allMax:rcp85', sdate, '2099-12-31')
      ])
        .then((function (wMean45, min45, max45, wMean85, min85, max85) {
          var data, export_data;
          var seasons = {
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
            export_data = [];
            // Extract values
            for (var key = 2006; key < 2100; key++) {
              var values = {};
              values.wMean45 = wMean45.hasOwnProperty(key) ? Math.round(wMean45[key] * 10) / 10 : null;
              values.min45 = min45.hasOwnProperty(key) ? Math.round(min45[key] * 10) / 10 : null;
              values.max45 = max45.hasOwnProperty(key) ? Math.round(max45[key] * 10) / 10 : null;
              values.wMean85 = wMean85.hasOwnProperty(key) ? Math.round(wMean85[key] * 10) / 10 : null;
              values.min85 = min85.hasOwnProperty(key) ? Math.round(min85[key] * 10) / 10 : null;
              values.max85 = max85.hasOwnProperty(key) ? Math.round(max85[key] * 10) / 10 : null;
              //year,rcp45mean,rcp45min,rcp45max,rcp45p10,rcp45p90,rcp85mean,rcp85min,rcp85max,rcp85p10,rcp85p90
              data.push([String(key), values.wMean45, values.min45, values.max45, null, null, values.wMean85, values.min85, values.max85, null, null]);
              export_data.push([String(key), values.wMean45, values.min45, values.max45, values.wMean85, values.min85, values.max85]);
            }
            // Sort before returning
            data.sort(function (a, b) {
              return (a[0] > b[0]) - (a[0] < b[0])
            });
            export_data.sort(function (a, b) {
              return parseInt(a[0]) - parseInt(b[0])
            });
            this.dataurls.proj_mod = 'data:text/csv;base64,' + window.btoa(('year,' + 'rcp45_weighted_mean,rcp45_min,rcp45_max,rcp85_weighted mean,rcp85_min,rcp85_max' + '\n' + export_data.join('\n')));
            export_data = [];
            return data
          } else if (this.options.frequency === 'monthly' || this.options.frequency === 'seasonal') {
            data = {};
            [2025, 2050, 2075].forEach((function (yearRange) {
              data[yearRange] = {};
              ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
                .forEach((function (month) {
                  var season_month = month;
                  if (this.options.frequency === 'seasonal') {
                    //for seasonal group by season, not month.
                    season_month = seasons[month];
                  }
                  if (undefined === data[yearRange][season_month]) {
                    data[yearRange][season_month] = {};
                  }
                  var datasets = {
                    'wMean45': wMean45,
                    'wMean85': wMean85,
                    'min45': min45,
                    'max45': max45,
                    'min85': min85,
                    'max85': max85
                  };
                  Object.keys(datasets).forEach(function (dataset) {
                    if (undefined === data[yearRange][season_month][dataset]) {
                      data[yearRange][season_month][dataset] = [];
                    }
                    for (var year = yearRange - 15; year < yearRange + 15; year++) {
                      var year_month = String(year) + '-' + String(month);
                      if (datasets[dataset].hasOwnProperty(year_month)) {
                        data[yearRange][season_month][dataset].push(datasets[dataset][year_month]);
                      }
                    }
                  });
                }).bind(this));
            }).bind(this));
            // mean values by month
            Object.keys(data).forEach(function (yearRange) {
              Object.keys(data[yearRange]).forEach(function (month) {
                ['wMean45', 'wMean85', 'min45', 'min85', 'max45', 'max85'].forEach(function (valueName) {
                  var length = data[yearRange][month][valueName].length;
                  var sum = data[yearRange][month][valueName].reduce(function (acc, value) {
                    return acc + value;
                  }, 0);
                  data[yearRange][month][valueName] = sum / length;
                });
              });
            });
            // reformat to expected output
            // [ month,2025rcp45_max,2025rcp45_weighted_mean,2025rcp45_min,2025rcp45_p10,2025rcp45_p90,2025rcp85_max,2025rcp85_weighted_mean,2025rcp85_min,2025rcp85_p10,2025rcp85_p90,2050rcp45_max,2050rcp45_weighted_mean,2050rcp45_min,2050rcp45_p10,2050rcp45_p90,2050rcp85_max,2050rcp85_weighted_mean,2050rcp85_min,2050rcp85_p10,2050rcp85_p90,2075rcp45_max,2075rcp45_weighted_mean,2075rcp45_min,2075rcp45_p10,2075rcp45_p90,2075rcp85_max,2075rcp85_weighted_mean,2075rcp85_min,2075rcp85_p10,2075rcp85_p90 ]
            var dataByMonth = {};
            var months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
            if (this.options.frequency === 'seasonal') {
              months = ['01', '04', '07', '10']
            }
            months.forEach(function (month) {
              dataByMonth[month] = {};
              [2025, 2050, 2075].forEach(function (yearRange) {
                ['45', '85'].forEach(function (scenario) {
                  ['max', 'wMean', 'min'].forEach(function (valueName) {
                    dataByMonth[month][String(yearRange) + 'rcp' + String(scenario) + '_' + String(valueName)] = data[yearRange][month][String(valueName) + String(scenario)];
                  });
                });
              });
            });
            export_data = [];
            var result = [];
            Object.keys(dataByMonth).forEach(function (month) {
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
              export_data.push([month,
                Math.round(dataByMonth[month]['2025rcp45_max'] * 10) / 10,
                Math.round(dataByMonth[month]['2025rcp45_wMean'] * 10) / 10,
                Math.round(dataByMonth[month]['2025rcp45_min'] * 10) / 10,
                Math.round(dataByMonth[month]['2025rcp85_max'] * 10) / 10,
                Math.round(dataByMonth[month]['2025rcp85_wMean'] * 10) / 10,
                Math.round(dataByMonth[month]['2025rcp85_min'] * 10) / 10,
                Math.round(dataByMonth[month]['2050rcp45_max'] * 10) / 10,
                Math.round(dataByMonth[month]['2050rcp45_wMean'] * 10) / 10,
                Math.round(dataByMonth[month]['2050rcp45_min'] * 10) / 10,
                Math.round(dataByMonth[month]['2050rcp85_max'] * 10) / 10,
                Math.round(dataByMonth[month]['2050rcp85_wMean'] * 10) / 10,
                Math.round(dataByMonth[month]['2050rcp85_min'] * 10) / 10,
                Math.round(dataByMonth[month]['2075rcp45_max'] * 10) / 10,
                Math.round(dataByMonth[month]['2075rcp45_wMean'] * 10) / 10,
                Math.round(dataByMonth[month]['2075rcp45_min'] * 10) / 10,
                Math.round(dataByMonth[month]['2075rcp85_max'] * 10) / 10,
                Math.round(dataByMonth[month]['2075rcp85_wMean'] * 10) / 10,
                Math.round(dataByMonth[month]['2075rcp85_min'] * 10) / 10
              ]);
            });

            // Sort before returning
            result.sort(function (a, b) {
              return (a[0] > b[0]) - (a[0] < b[0])
            });
            export_data.sort(function (a, b) {
              return parseInt(a[0]) - parseInt(b[0])
            });
            this.dataurls.proj_mod = 'data:text/csv;base64,' + window.btoa((
              'month,2025_rcp45_max,2025_rcp45_weighted_mean,2025_rcp45_min,2025_rcp85_max,2025_rcp85_weighted_mean,2025_rcp85_min,2050_rcp45_max,2050_rcp45_weighted_mean,2050_rcp45_min,2050_rcp85_max,2050_rcp85_weighted_mean,2050_rcp85_min,2075_rcp45_max,2075_rcp45_weighted_mean,2075_rcp45_min,2075_rcp85_max,2075_rcp85_weighted_mean,2075_rcp85_min\n' + export_data.join('\n')));
            return result
          }
        }).bind(this));
    },


    average: function (data, first_year, last_year) {
      //    [[1921,1.3,33.5,2.5,...],
      //     [1922,1.3,33.5,2.5,...],
      //     ...]
      var sum = 0;
      var n = 0;
      data.forEach(function (row) {
        if (row[0] >= first_year && row[0] <= last_year) {
          sum += row[1];
          ++n;
        }
      });
      return sum / n;
    },

    anomalies: function (data, ref) {
      return data.map(function (row) {
        var arow = [row[0]];
        var i;
        for (i = 1; i < row.length; ++i) {
          if (row[i] === null) {
            arow[i] = row[i];
            continue;
          }
          arow[i] = row[i] - ref;
        }
        return arow;
      });
    },

    percent_anomalies: function (data, ref) {
      return data.map(function (row) {
        var arow = [row[0]];
        var i;
        for (i = 1; i < row.length; ++i) {
          if (row[i] === null) {
            arow[i] = row[i];
            continue;
          }
          arow[i] = 100 * row[i] / ref;
        }
        return arow;
      });
    },

    band_plot: function (x_axis, x, y_axis, y0, y1, fill_color, fill_opacity) {
      var plot = {
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
    },

    bar_plot_based_at: function (x_axis, x, y_axis, y, ref) {
      // (colors are hard-coded in this one, but not for any good reason)
      var plot = {
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
    },

    line_plot: function (x_axis, x, y_axis, y, line_color, dashed) {
      var plot = {
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
    },

    range_bar_plot: function (x_axis, x, y_axis, y0, y1, bar_color, line_color, baroffset, fillopacity) {
      var plot = {
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
    },


    show_spinner: function () {
      this.hide_spinner();
      var style = "<style>.cwg-spinner { margin-top: -2.5rem; border-radius: 100%;border-style: solid;border-width: 0.25rem;height: 5rem;width: 5rem;animation: basic 1s infinite linear; border-color: rgba(0, 0, 0, 0.2);border-top-color: rgba(0, 0, 0, 1); }@keyframes basic {0%   { transform: rotate(0); }100% { transform: rotate(359.9deg); }} .cwg-spinner-wrapper {display:flex; align-items: center; justify-content: center; }</style>";
      $("<div class='cwg-spinner-wrapper'><div class='cwg-spinner'></div></div>").css({
        position: "absolute",
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
        zIndex: 1000000
      }).append(style).appendTo($(this.element).css("position", "relative"));
    },

    hide_spinner: function () {
      $(this.element).find('.cwg-spinner-wrapper').remove();
    },

    is_plot_visible: function (opts, frequency, regime, stat, scenario, timeperiod) {
      if (opts.frequency !== frequency) {
        return false;
      }
      if (frequency === "annual") {
        if (regime === "hist_obs") {
          return opts.histobs;
        }
        if (regime === "hist_mod") {
          if (stat === "med") {
            return opts.histmod && opts.hmedian;
          } else {
            if (opts.hrange !== stat && opts.hrange !== "both") {
              return false;
            }
            return opts.histmod;
          }
        }
        // frequency==="annual" && regime==="proj_mod":
        if (opts.scenario !== scenario && opts.scenario !== "both") {
          return false;
        }
        if (stat === "med") {
          return opts.pmedian;
        }
        return !(opts.prange !== stat && opts.prange !== "both");

      } else {
        if (regime === "hist_obs") {
          return opts.histobs;
        }
        if (regime === "hist_mod") {
          return false;
        }
        // frequency==="monthly/seasonal" && regime==="proj_mod":
        if (opts.timeperiod !== timeperiod) {
          return false;
        }
        if (opts.scenario !== scenario && opts.scenario !== "both") {
          return false;
        }
        if (stat === "med") {
          return opts.pmedian;
        }
        return !(opts.prange !== stat && opts.prange !== "both");

      }
    },

    set_plot_visibilities: function () {
      this.plots.each_keys(["frequency", "regime", "stat", "scenario", "timeperiod"], function (k) {
        this.plots.get_in([k['frequency'], k['regime'], k['stat'], k['scenario'], k['timeperiod']]).visible(
          !!(this.is_plot_visible(this.options, k['frequency'], k['regime'], k['stat'], k['scenario'], k['timeperiod']))
        );
      }.bind(this));
    },


    download_image: function (link) {
      link.href = this.$graphdiv.find('canvas')[0].toDataURL('image/png');
      link.download = [
        this.options.get_region_label.bind(this)(),
        this.options.frequency,
        this.options.variable,
        "graph"
      ].join('-').replace(/ /g, '_') + '.png';
    },

    download_hist_obs_data: function (link) {
      link.href = this.dataurls.hist_obs;
      link.download = [
        this.options.get_region_label.bind(this)(),
        this.options.frequency,
        "hist_obs",
        this.options.variable
      ].join('-').replace(/ /g, '_') + '.csv';
    },

    download_hist_mod_data: function (link) {
      link.href = this.dataurls.hist_mod;
      link.download = [
        this.options.get_region_label.bind(this)(),
        this.options.frequency,
        "hist_mod",
        this.options.variable
      ].join('-').replace(/ /g, '_') + '.csv';
    },
    download_proj_mod_data: function (link) {
      link.href = this.dataurls.proj_mod;
      link.download = [
        this.options.get_region_label.bind(this)(),
        this.options.frequency,
        "proj_mod",
        this.options.variable
      ].join('-').replace(/ /g, '_') + '.csv';
    },

    setRange: function (axis, min, max) {
      var pan = axis.pan();
      var panMin = pan ? pan.min().getRealValue() : null;
      var panMax = pan ? pan.max().getRealValue() : null;
      var zoom = axis.zoom();
      var zoomMin = zoom ? zoom.min().getRealValue() : null;
      var zoomMax = zoom ? zoom.max().getRealValue() : null;
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
      this.m.render();
      return true;
    },

    setXRange: function (min, max) {
      return this.setRange(this.axes.x_annual, min, max);
    },

    resize: function () {
      if (this.m) {
        this.m.resize();
      }
    }
  });

})(jQuery);