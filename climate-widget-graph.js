function celsius_to_fahrenheit(c) {
    return c * 9/5 + 32.0;
}

function cdd_to_fdd(cdd) {
    return cdd * 9/5;
}

function mm_to_inches(mm) {
    return mm / 25.4;
}

function identity(x) { return x; }

var variables = [

     {
         id:       "tasmax",
         title: {
             english: "Mean Daily Maximum Temperature",
             metric: "Mean Daily Maximum Temperature"
         },
         dataconverters: {
             metric: identity,
             english: celsius_to_fahrenheit
         },
         ytitles: {
             annual: {
                 absolute: {
                     english: "Mean Daily Maximum Temperature (°F)",
                     metric:  "Mean Daily Maximum Temperature (°C)"
                 },
                 anomaly:  {
                     english: "Mean Daily Maximum Temperature Departure (°F)",
                     metric:  "Mean Daily Maximum Temperature Departure (°C)"
                 }
             },
             monthly:  {
                 english: "Mean Daily Maximum Temperature (°F)",
                 metric:  "Mean Daily Maximum Temperature (°C)"
             },
             seasonal: {
                 english: "Mean Daily Maximum Temperature (°F)",
                 metric:  "Mean Daily Maximum Temperature (°C)"
             }
         }
     },

     {
         id:       "tasmin",
         title: {
             english: "Mean Daily Minimum Temperature",
             metric: "Mean Daily Minimum Temperature"
         },
         dataconverters: {
             metric: identity,
             english: celsius_to_fahrenheit
         },
         ytitles: {
             annual: {
                 absolute: {
                     english: "Mean Daily Minimum Temperature (°F)",
                     metric:  "Mean Daily Minimum Temperature (°C)"
                 },
                 anomaly:  {
                   english: "Mean Daily Minimum Temperature Departure (°F)",
                   metric:  "Mean Daily Minimum Temperature Departure (°C)"
                 }
             },
             monthly:  {
                 english: "Mean Daily Minimum Temperature (°F)",
                 metric:  "Mean Daily Minimum Temperature (°C)"
             },
             seasonal: {
                 english: "Mean Daily Minimum Temperature (°F)",
                 metric:  "Mean Daily Minimum Temperature (°C)"
             }
         }
     },


     {
         id:       "pr",
         title: {
             english: "Mean Daily Average Precipitation",
             metric: "Mean Daily Average Precipitation"
         },
         dataconverters: {
             metric: identity,
             english: mm_to_inches
         },
         ytitles: {
             annual: {
                 absolute: {
                     english: "Mean Daily Average Precipitation (in/d)",
                     metric: "Mean Daily Average Precipitation (mm/d)"
                 },
                 anomaly:  {
                   english: "Mean Daily Average Precipitation Departure (%)",
                   metric: "Mean Daily Average Precipitation Departure (%)"
                 }
             },
             monthly:  {
                 english: "Mean Daily Average Precipitation (in/d)",
                 metric: "Mean Daily Average Precipitation (mm/d)"
             },
             seasonal: {
                 english: "Mean Daily Average Precipitation (in/d)",
                 metric: "Mean Daily Average Precipitation (mm/d)"
             }
         }
     },


     {
         id:       "days_tmax_abv_35.0",
         title: {
             english: "Days with Maximum Temperature Above 95 °F",
             metric: "Days with Maximum Temperature Above 35 °C"
         },
         dataconverters: {
             metric: identity,
             english: identity
         },
         ytitles: {
             annual: {
                 absolute: {
                     english: "Days with Maximum Temperature Above 95 °F (d)",
                     metric:  "Days with Maximum Temperature Above 95 °C (d)"
                 },
                 anomaly:  {
                     english: "Days with Maximum Temperature Above 95 °F Departure (d)",
                     metric:  "Days with Maximum Temperature Above 95 °C Departure (d)"
                 }
             }
         }
     },

     {
         id:       "days_tmin_blw_0.0",
         title: {
             english: "Days with Minimum Temperature Below 32 °F",
             metric: "Days with Minimum Temperature Below 0 °C"
         },
         dataconverters: {
             metric: identity,
             english: identity
         },
         ytitles: {
             annual: {
                 absolute: {
                     english: "Days with Minimum Temperature Below 32 °F (d)",
                     metric:  "Days with Minimum Temperature Below 0 °C (d)"
                 },
                 anomaly:  {
                     english: "Days with Minimum Temperature Below 32 °F (d)",
                     metric:  "Days with Minimum Temperature Below 0 °C (d)"
                 }
             }
         }
     },

     {
         id:       "heating_degree_day_18.3",
         title: {
             english: "Heating Degree Days",
             metric: "Heating Degree Days"
         },
         dataconverters: {
             metric: identity,
             english: cdd_to_fdd
         },
         ytitles: {
             annual: {
                 absolute: {
                     english: "Heating Degree Days (HDD)",
                     metric:  "Heating Degree Days (HDD)"
                 },
                 anomaly:  {
                     english: "Heating Degree Days Departure (HDD)",
                     metric:  "Heating Degree Days Departure (HDD)"
                 }
             }
         }
     },

     {
         id:       "cooling_degree_day_18.3",
         title: {
             english: "Cooling Degree Days",
             metric: "Cooling Degree Days"
         },
         dataconverters: {
             metric: identity,
             english: cdd_to_fdd
         },
         ytitles: {
             annual: {
                 absolute: {
                     english: "Cooling Degree Days (CDD)",
                     metric:  "Cooling Degree Days (CDD)"
                 },
                 anomaly:  {
                     english: "Cooling Degree Days Departure (CDD)",
                     metric:  "Cooling Degree Days Departure (CDD)"
                 }
             }
         }
     },

     {
         id:       "days_prcp_abv_25.3",
         title: {
             english: "Days of Precipitation Above 1 in",
             metric: "Days of Precipitation Above 25.3 mm"
         },
         dataconverters: {
             metric: identity,
             english: identity
         },
         ytitles: {
             annual: {
                 absolute: {
                     english: "Days of Precipitation Above 1 in (d)",
                     metric:  "Days of Precipitation Above 25.3 mm (d)"
                 },
                 anomaly:  {
                     english: "Days of Precipitation Above 1 in Departure (d)",
                     metric:  "Days of Precipitation Above 25.3 mm Departure (d)"
                 }
             }
         }
     }
];

function variable_config(id) {
    var i;
    for (i=0; i<variables.length; ++i) {
        if (variables[i].id === id) {
            return variables[i];
        }
    }
    return undefined;
}

function climate_widget_variables(frequency) {
    return variables.filter(function(v) {
        return frequency in v.ytitles;
    });
}

function transform_data(data, f) {
    // Takes a 2D data array, and modifies it in-place by replacing each y value
    // with the result of passing that y value to the function f.  The "y" values
    // consist of all values on every row EXCEPT for the 1st column.
    var i, j;
    for (i=0; i<data.length; ++i) {
        for (j=1; j<data[i].length; ++j) {
            data[i][j] = f(data[i][j]);
        }
    }
    return data;
}

function datas_range(datas) {
    // Takes an array of data arrays, and returns a JS object giving the min and max
    // values present in all the data.  Each element of the incoming datas array
    // is a 2D array whose first column is an x value, and all the remaining columns
    // are "y" columns.  This function returns the min and max of all the y column
    // in all the data arrays.
    var min = datas[0][0][1];
    var max = datas[0][0][1];
    datas.forEach(function(data) {
        data.forEach(function(row) {
            row.slice(1).forEach(function(value) {
                if (value < min) { min = value; }
                if (value > max) { max = value; }
            });
        });
    });
    return { min: min, max: max };
}

function scale_range(range, factor) {
    // Take an object of the form returned by datas_range() above, and scale its
    // min and max values by a factor, returning a new object of the same form.
    var r = (range.max - range.min)/2;
    var c = (range.max + range.min)/2;
    return {
        min: c - r*factor,
        max: c + r*factor
    };
}

var _i = 0;
var starti = function(v) { _i = v||0; return _i; };
var nexti = function() { return ++_i; };

// The following function takes a jermaine attr_list instance and returns
// a plain JS array containing all its values
function attr_list_array(attr_list) {
    var a = [], i;
    for (i=0; i<attr_list.size(); ++i) {
        a.push(attr_list.at(i));
    }
    return a;
}

function set_in(obj, keys, value) {
    // Take a JS object "obj", an array of string key names "keys", and a "value",
    // and sets the nested property in obj accessed by that sequence of keys
    // to the given value, creating objects along the way as necessary.
    // For example:
    //    x = {};
    //    set_in(x, ["foo", "bar", "bat"], 42)
    // results in
    //    x = { foo: { bar: { bat: 42 } } }
    var p = obj;
    keys.slice(0,-1).forEach(function(key) {
        if (key in p) {
            p = p[key];
            if (typeof(p) !== "object") {
                throw new Error("set_in: cannot drill into non-object value");
            }
        } else {
            p[key] = {};
            p = p[key];
        }
    });
    p[keys[keys.length-1]] = value;
}

function each_plot(obj, f) {
    // Takes a JS object "obj", and a function "f" which is assumed to take
    // a single argument which is a multigraph Plot object, and traverses
    // (recursively) all the properties inside obj, calling f with every
    // Plot value it finds.
    Object.keys(obj).forEach(function(key) {
        if (obj[key] instanceof window.multigraph.core.Plot) {
            f(obj[key]);
        } else if (typeof(obj[key]) === "object") {
            each_plot(obj[key],f);
        }
    });
}

function each_key(obj, f) {
    Object.keys(obj).forEach(f);
}

// each_keys provides a concise way of looping over the contents
// of a arbitrary-depth nested JS object.
//
// each_keys(obj,levels,f) takes a JS object "obj", an array "levels"
// of "level names", and a 1-arg function f.  The "levels" array
// determines the depth of the nesting in "obj" to be traversed.
// f will be called once for each combination of
// nested properties in obj corresponding to the given levels.  The argument
// to f is an object whose properties are the level names, and
// whose values are the corresponding property names in obj.  For example,
//     each_keys({
//                 med: {
//                  rcp45: "one",
//                  rcp85: "two"
//                 },
//                 max: {
//                  rcp45: "three",
//                  rcp65: "four",
//                  rcp85: "five"
//                 }
//               },
//               ["stat", "scenario"],
//               function(k) {
//                  console.log(k);
//               });
// will result in the output:
//     {stat: "med", "scenario": "rcp45"}
//     {stat: "med", "scenario": "rcp85"}
//     {stat: "max", "scenario": "rcp45"}
//     {stat: "max", "scenario": "rcp65"}
//     {stat: "max", "scenario": "rcp85"}
// whereas
//     each_keys({
//                 med: {
//                  rcp45: "one",
//                  rcp85: "two"
//                 },
//                 max: {
//                  rcp45: "three",
//                  rcp65: "four",
//                  rcp85: "five"
//                 }
//               },
//               ["stat"],
//               function(k) {
//                  console.log(k);
//               });
// will result in the output:
//     {stat: "med"}
//     {stat: "max"}
// Note that the traversed depth is determined by the length of
// the levels array, not by the actual depth of the structure of
// "obj".  Note also that the function f does not receive a reference
// to "obj", or the values stored in "obj" --- it just recives an
// object giving the names of the property values down to the given
// number of levels.
//
// Note that the 4th arg to each_keys is only used internally -- calls
// to each_keys from outside its own implementation should only
// pass in 3 args.
function each_keys(obj, levels, f, k) {
    if (k === undefined) {
        each_keys(obj, levels, f, {});
        return;
    }
    if (levels.length === 0) {
        f(k);
        return;
    }
    var level = levels[0];
    Object.keys(obj).forEach(function(keyValue) {
        k[level] = keyValue;
        each_keys(obj[keyValue], levels.slice(1), f, k);
    });
}

function dataurl(prefix, fips, dir, variable) {
    return prefix + "/" + fips + "/" + dir + "/" + fips + "-" + dir.replace(/\//g,"-") + "-" + variable + ".csv";
}

function string_to_data(s) {
    // Takes a multiline string of the form
    //
    //   name1,name2,name3,...
    //   1921,1.3,33.5,2.5,...
    //   1922,1.3,33.5,2.5,...
    //
    // and returns a 2D array like this:
    //
    //   [
    //    [1921,1.3,33.5,2.5,...],
    //    [1922,1.3,33.5,2.5,...],
    //    ...
    //   ]

    var first = true, values = [];
    s.split("\n")
        .filter(function(line) {
            return line.match(/\S/); // filter out blanks lines
        })
        .forEach(function(line) {
            if (first) {
                first = false; // skip first line
            } else {
                values.push(line.split(",").map(function(s) { return Number(s); }));
            }
        });
    return values;
}


function average(data, first_year, last_year) {
    //    [[1921,1.3,33.5,2.5,...],
    //     [1922,1.3,33.5,2.5,...],
    //     ...]
    var sum = 0;
    var n = 0;
    data.forEach(function(row) {
        if (row[0] >= first_year && row[0] <= last_year) {
            sum += row[1];
            ++n;
        }
    });
    return sum/n;
}

function anomalies(data, ref) {
    var anomalies = data.map(function(row) {
        var arow = [ row[0] ];
        var i;
        for (i=1; i<row.length; ++i) {
            arow[i] = row[i] - ref;
        }
        return arow;
    });
    return anomalies;
}

function percent_anomalies(data, ref) {
    var anomalies = data.map(function(row) {
        var arow = [ row[0] ];
        var i;
        for (i=1; i<row.length; ++i) {
            arow[i] = 100 * row[i] / ref;
        }
        return arow;
    });
    return anomalies;
}

var colors = {
  reds: {
    line: '#f5442d',
    innerBand: '#f65642',
    outerBand: '#f76956'
  },
  blues: {
    line: '#0058cf',
    innerBand: '#1968d3',
    outerBand: '#3279d8'
  }
};

function band_plot(x_axis, x, y_axis, y0, y1, fill_color, fill_opacity) {
    var obj = {
        visible: false,
        horizontalaxis: {}, // populated below
        verticalaxis:   {}, // populated below
        style: "band",
        options: {
            fillcolor: fill_color,
            fillopacity: fill_opacity,
            linewidth: 0
        }
    };
    // must use [] notation here since keys are variables:
    obj.horizontalaxis[x_axis] = x;
    obj.verticalaxis[y_axis] = [y0, y1 ];
    return obj;
}

function bar_plot_based_at(x_axis, x, y_axis, y, ref) {
    // (colors are hard-coded in this one, but not for any good reason)
    var obj = {
        visible: false,
        horizontalaxis: {}, // populated below
        verticalaxis:   {}, // populated below
        style: "bar",
        options: {
            barbase: ref,
            fillcolor: [ {"value": "0xCD6760", "min": ref},
                         {"value": "0x6194C8", "max": ref} ],
            barwidth: 1,
            baroffset: 0.5,
            linecolor: "#000000",
            hidelines: 999
        }
    };
    // must use [] notation here since keys are variables:
    obj.horizontalaxis[x_axis] = x;
    obj.verticalaxis[y_axis] = y;
    return obj;
}

function line_plot(x_axis, x, y_axis, y, line_color, dashed) {
    var obj = {
        visible: false,
        horizontalaxis: {}, // populated below
        verticalaxis:   {}, // populated below
        style: "line",
        options: {
            linecolor: line_color,
            linestroke: dashed ? "dashed" : "solid",
            linewidth: 2
        }
    };
    // must use [] notation here since keys are variables:
    obj.horizontalaxis[x_axis] = x;
    obj.verticalaxis[y_axis] = y;
    return obj;
}

function range_bar_plot(x_axis, x, y_axis, y0, y1, bar_color, line_color, baroffset, fillopacity) {
    var obj = {
        horizontalaxis: {}, // populated below
        verticalaxis:   {}, // populated below
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
    obj.horizontalaxis[x_axis] = x;
    obj.verticalaxis[y_axis] = [y0, y1 ];
    return obj;
}


var mugl = {
    legend: false,
    window: {
        border:  0,
        padding: 0,
        margin:  0
    },
    plotarea: {
       marginleft: 55
    },
    horizontalaxis: [{
        id: "x_annual",
        min: 1950,
        max: 2099,
        title: { text: "Year" },
        visible: true,
        labels: {
            label: [
                { format: "%1d", spacing: [100, 50, 20, 10, 5, 2, 1] }
            ]
        }
    },{
        id: "x_monthly",
        min: -2,
        max: 12,
        title: false,
        title: { text: "Month" },
        visible: false,
        labels: {
            label: [ { format: ["Dec","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov"],
                       spacing: [1] } ]
        }
    }, {
        id: "x_seasonal",
        min: -0.5,
        max: 3.5,
        title: { text: "Season" },
        visible: false,
        labels: {
            label: [ { format: ["Winter", "Spring", "Summer", /* or */ "Fall"],
                       /*        all you have to do is call... */
                       spacing: [1] } ]
        }
    }],
    verticalaxis: {
        id: "y",
        min: 0,
        max: 2000,
        title: { text: " ", angle: 90, anchor: [0,-1], position: [-40,0] },
        visible: true,
        labels: {
            label: [
                { format: "%1d",  spacing: [10000, 5000, 2000, 1000, 500, 200, 100, 50, 20, 10, 5, 2, 1] },
                { format: "%.1f", spacing: [0.5, 0.2, 0.1] },
                { format: "%.2f", spacing: [0.05, 0.02, 0.01] }
            ]
        }
    },
    plots: [
        //
        // annual plots:
        //
        band_plot("x_annual", "annual_hist_mod_x", "y", "annual_hist_mod_min",       "annual_hist_mod_max",       "#cccccc",              0.7),
        band_plot("x_annual", "annual_hist_mod_x", "y", "annual_hist_mod_p10",       "annual_hist_mod_p90",       "#999999",              0.5),
        band_plot("x_annual", "annual_proj_mod_x", "y", "annual_proj_mod_min_rcp45", "annual_proj_mod_max_rcp45", colors.blues.outerBand, 0.3),
        band_plot("x_annual", "annual_proj_mod_x", "y", "annual_proj_mod_p10_rcp45", "annual_proj_mod_p90_rcp45", colors.blues.innerBand, 0.3),
        band_plot("x_annual", "annual_proj_mod_x", "y", "annual_proj_mod_min_rcp85", "annual_proj_mod_max_rcp85", colors.reds.outerBand,  0.3),
        band_plot("x_annual", "annual_proj_mod_x", "y", "annual_proj_mod_p10_rcp85", "annual_proj_mod_p90_rcp85", colors.reds.innerBand,  0.3),
        bar_plot_based_at("x_annual", "annual_hist_obs_x", "y", "annual_hist_obs_y", 0),
        line_plot("x_annual", "annual_hist_mod_x", "y", "annual_hist_mod_med",       "#000000"),
        line_plot("x_annual", "annual_proj_mod_x", "y", "annual_proj_mod_med_rcp45", colors.blues.line),
        line_plot("x_annual", "annual_proj_mod_x", "y", "annual_proj_mod_med_rcp85", colors.reds.line),
        //
        // monthly plots:
        //
        line_plot("x_monthly", "monthly_hist_obs_x", "y", "monthly_hist_obs_med",  "#000000"),
        // Hiding historical range for now
        //line_plot("x_monthly", "monthly_hist_obs_x", "y", "monthly_hist_obs_p10", "#000000", true)
        //line_plot("x_monthly", "monthly_hist_obs_x", "y", "monthly_hist_obs_p90", "#000000", true)

        band_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_p10_rcp45_2025", "monthly_proj_mod_p90_rcp45_2025", colors.blues.innerBand, 0.3),
        band_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_p10_rcp85_2025", "monthly_proj_mod_p90_rcp85_2025", colors.reds.innerBand, 0.3),
        line_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_med_rcp45_2025", colors.blues.outerBand),
        line_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_med_rcp85_2025", colors.reds.line),

        band_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_p10_rcp45_2050", "monthly_proj_mod_p90_rcp45_2050", colors.blues.innerBand, 0.3),
        band_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_p10_rcp85_2050", "monthly_proj_mod_p90_rcp85_2050", colors.reds.innerBand, 0.3),
        line_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_med_rcp45_2050", colors.blues.outerBand),
        line_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_med_rcp85_2050", colors.reds.line),

        band_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_p10_rcp45_2075", "monthly_proj_mod_p90_rcp45_2075", colors.blues.innerBand, 0.3),
        band_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_p10_rcp85_2075", "monthly_proj_mod_p90_rcp85_2075", colors.reds.innerBand, 0.3),
        line_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_med_rcp45_2075", colors.blues.outerBand),
        line_plot("x_monthly", "monthly_proj_mod_x", "y", "monthly_proj_mod_med_rcp85_2075", colors.reds.line),

        //
        // seasonal plots
        //
        // Hiding historical range for now
        //range_bar_plot("x_seasonal", "seasonal_hist_obs_x", "y", "seasonal_hist_obs_p10", "seasonal_hist_obs_p90",  "#cccccc", "#cccccc", 0.5, 0.7);
        range_bar_plot("x_seasonal", "seasonal_proj_mod_x",
                       "y", "seasonal_proj_mod_p10_rcp45_2025", "seasonal_proj_mod_p90_rcp45_2025", colors.blues.innerBand, colors.blues.innerBand, 0.25, 0.4),
        range_bar_plot("x_seasonal", "seasonal_proj_mod_x",
                       "y", "seasonal_proj_mod_p10_rcp85_2025", "seasonal_proj_mod_p90_rcp85_2025", colors.reds.innerBand, colors.reds.innerBand, 0.0, 0.4),
        range_bar_plot("x_seasonal", "seasonal_proj_mod_x",
                       "y", "seasonal_proj_mod_p10_rcp45_2050", "seasonal_proj_mod_p90_rcp45_2050", colors.blues.innerBand, colors.blues.innerBand, 0.25, 0.4),
        range_bar_plot("x_seasonal", "seasonal_proj_mod_x",
                       "y", "seasonal_proj_mod_p10_rcp85_2050", "seasonal_proj_mod_p90_rcp85_2050", colors.reds.innerBand, colors.reds.innerBand, 0.0, 0.4),
        range_bar_plot("x_seasonal", "seasonal_proj_mod_x",
                       "y", "seasonal_proj_mod_p10_rcp45_2075", "seasonal_proj_mod_p90_rcp45_2075", colors.blues.innerBand, colors.blues.innerBand, 0.25, 0.4),
        range_bar_plot("x_seasonal", "seasonal_proj_mod_x",
                       "y", "seasonal_proj_mod_p10_rcp85_2075", "seasonal_proj_mod_p90_rcp85_2075", colors.reds.innerBand, colors.reds.innerBand, 0.0, 0.4),

        range_bar_plot("x_seasonal", "seasonal_hist_obs_x",
                       "y", "seasonal_hist_obs_med", "seasonal_hist_obs_med",  "#000000", "#000000", 0.5, 1.0),

        range_bar_plot("x_seasonal", "seasonal_proj_mod_x",
                       "y", "seasonal_proj_mod_med_rcp45_2025", "seasonal_proj_mod_med_rcp45_2025", "#0000ff", "#0000ff", 0.25, 1.0),
        range_bar_plot("x_seasonal", "seasonal_proj_mod_x",
                       "y", "seasonal_proj_mod_med_rcp85_2025", "seasonal_proj_mod_med_rcp85_2025", colors.reds.line, colors.reds.line, 0.0, 1.0),
        range_bar_plot("x_seasonal", "seasonal_proj_mod_x",
                       "y", "seasonal_proj_mod_med_rcp45_2050", "seasonal_proj_mod_med_rcp45_2050", "#0000ff", "#0000ff", 0.25, 1.0),
        range_bar_plot("x_seasonal", "seasonal_proj_mod_x",
                       "y", "seasonal_proj_mod_med_rcp85_2050", "seasonal_proj_mod_med_rcp85_2050", colors.reds.line, colors.reds.line, 0.0, 1.0),
        range_bar_plot("x_seasonal", "seasonal_proj_mod_x",
                       "y", "seasonal_proj_mod_med_rcp45_2075", "seasonal_proj_mod_med_rcp45_2075", "#0000ff", "#0000ff", 0.25, 1.0),
        range_bar_plot("x_seasonal", "seasonal_proj_mod_x",
                       "y", "seasonal_proj_mod_med_rcp85_2075", "seasonal_proj_mod_med_rcp85_2075", colors.reds.line, colors.reds.line, 0.0, 1.0)
    ],
    data: [{
        variables: [{id: "annual_hist_obs_x"},
                    {id: "annual_hist_obs_y"}],
        values: [[-9999,0]]
    }, {
        variables: [{id: "annual_hist_mod_x"},
                    {id: "annual_hist_mod_med"},
                    {id: "annual_hist_mod_min"},
                    {id: "annual_hist_mod_max"},
                    {id: "annual_hist_mod_p10"},
                    {id: "annual_hist_mod_p90"}],
        values: [[-9999,0,0,0,0,0,0]]
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
        values: [[-9999,0,0,0,0,0,0,0,0,0,0]]
    },{
        variables: [{id: "monthly_hist_obs_x"},
                    {id: "monthly_hist_obs_mean30"},
                    {id: "monthly_hist_obs_max"},
                    {id: "monthly_hist_obs_med"},
                    {id: "monthly_hist_obs_min"},
                    {id: "monthly_hist_obs_p10"},
                    {id: "monthly_hist_obs_p90"}],
        values: [[-9999,0,0,0,0,0,0]],
        repeat: { period: 12 }
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
        values: [[-9999,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],
        repeat: { period: 12 }
    },{
        variables: [{id: "seasonal_hist_obs_x"},
                    {id: "seasonal_hist_obs_mean30"},
                    {id: "seasonal_hist_obs_max"},
                    {id: "seasonal_hist_obs_med"},
                    {id: "seasonal_hist_obs_min"},
                    {id: "seasonal_hist_obs_p10"},
                    {id: "seasonal_hist_obs_p90"}],
        values: [[-9999,0,0,0,0,0,0]],
        repeat: { period: 4 }
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
        values: [[-9999,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],
        repeat: { period: 4 }
    }]
};

//        'div'          : "div#widget",         // jquery-style selector for the dom element that you want the graph to appear in
//        'fips'         : selectedCounty,       // 5-character fips code for county
//        'frequency'    : selectedFrequency,    // time frequency of graph to display ("annual", "monthly", or "seasonal")
//        'timeperiod'   : selectedTimePeriod,   // time period center for monthly/seasonal graphs ("2025", "2050", or "2075"); only
//                                                  relevant for monthly or seasonal frequency)
//        'variable'     : selectedVariable,     // name of variable to display; see climate-widget-graph.js for list of variables
//        'scenario'     : selectedScenario,     // name of scenario to display: "both", "rcp45", or "rcp85"
//        'presentation' : selectedPresentation  // name of presentation; "absolute" or "anomaly" (only relevant for annual frequency)

function changed(prop, obj, delta) {
    // return true iff delta contains a property named prop, and its value
    // is different from obj[prop] (if delta contains prop, and obj does
    // not, true is returned):
    return ((prop in delta) && (delta[prop] !== obj[prop]));
}

var climate_widget_graph = function(orig_options) {
    var convertArray = window.multigraph.core.ArrayData.stringArrayToDataValuesArray;
    var obj = {
        orig_options: $.extend({}, orig_options),
        options: {},
        $div: $(orig_options.div)
    };
    if (!obj.orig_options.dataprefix) {
        throw new Error("climate_widget_graph: property 'dataprefix' is missing");
    }
    if (obj.orig_options.dataprefix.endsWith("/")) {
        obj.orig_options.dataprefix = obj.orig_options.dataprefix.replace(/\/$/, "");
    }
    obj.$div.empty();
    $('.errorDisplayDetails').remove();
    obj.$div.append("<div class='graph' style='width: 100%; height: 100%;'></div>");
    obj.$graphdiv = obj.$div.find('div.graph');
    obj.$graphdiv.multigraph({muglString: mugl});
    obj.update = function(delta) {
        var old_options = $.extend({}, obj.options);
        obj.options = $.extend({}, obj.options, delta || {});

        // if font changed, set it in all the relevant places
        if (obj.options.font != old_options.font) {
            var i,j;
            for (i=0; i<obj.m.graphs().at(0).axes().size(); ++i) {
                var axis = obj.m.graphs().at(0).axes().at(i);
                if (axis.title()) {
                    axis.title().font("14px " + obj.options.font);
                }
                for (j=0; j<axis.labelers().size(); ++j) {
                    axis.labelers().at(j).font("12px " + obj.options.font);
                }
            }
        }

        // if scenario changed, set which plots are visible
        if (obj.options.scenario != old_options.scenario) {
            if (obj.options.frequency === "annual") {
                each_keys(obj.plots.annual.proj_mod, ["stat", "scenario"], function(k) {
                    obj.plots.annual.proj_mod[k.stat][k.scenario].visible(obj.options.scenario === k.scenario || obj.options.scenario === "both");
                });
            } else if (obj.options.frequency === "monthly") {
                each_keys(obj.plots.monthly.proj_mod, ["stat", "scenario", "timeperiod"], function(k) {
                    obj.plots.monthly.proj_mod[k.stat][k.scenario][k.timeperiod].visible(
                        obj.options.timeperiod === k.timeperiod && (obj.options.scenario === k.scenario || obj.options.scenario === "both")
                    );
                });
            } else if (obj.options.frequency === "seasonal") {
                each_keys(obj.plots.seasonal.proj_mod, ["stat", "scenario", "timeperiod"], function(k) {
                    obj.plots.seasonal.proj_mod[k.stat][k.scenario][k.timeperiod].visible(
                        obj.options.timeperiod === k.timeperiod && (obj.options.scenario === k.scenario || obj.options.scenario === "both")
                    );
                });
            }

        }

        // if timeperiod changed, set which plots are visible
        if (obj.options.timeperiod != old_options.timeperiod) {
            if (obj.options.frequency === "monthly") {
                each_keys(obj.plots.monthly.proj_mod, ["stat", "scenario", "timeperiod"], function(k) {
                    obj.plots.monthly.proj_mod[k.stat][k.scenario][k.timeperiod].visible(
                        obj.options.timeperiod === k.timeperiod && (obj.options.scenario === k.scenario || obj.options.scenario === "both")
                    );
                });
            } else if (obj.options.frequency === "seasonal") {
                each_keys(obj.plots.seasonal.proj_mod, ["stat", "scenario", "timeperiod"], function(k) {
                    obj.plots.seasonal.proj_mod[k.stat][k.scenario][k.timeperiod].visible(
                        obj.options.timeperiod === k.timeperiod && (obj.options.scenario === k.scenario || obj.options.scenario === "both")
                    );
                });
            }
        }

        // if frequency, fips, or variable changed, load data:
        if (obj.options.frequency    !== old_options.frequency ||
            obj.options.fips         !== old_options.fips ||
            obj.options.presentation !== old_options.presentation ||
            obj.options.variable     !== old_options.variable) {
            if (obj.options.frequency === "annual") {

                obj.axes.x_annual.visible(true);
                obj.axes.x_monthly.visible(false);
                obj.axes.x_seasonal.visible(false);

                each_plot(obj.plots, function(plot) { plot.visible(false); });

                obj.data_urls = {
                    hist_obs: dataurl(obj.options.dataprefix, obj.options.fips, 'annual/hist-obs',         obj.options.variable),
                    hist_mod: dataurl(obj.options.dataprefix, obj.options.fips, 'annual/hist-mod/stats', obj.options.variable),
                    proj_mod: dataurl(obj.options.dataprefix, obj.options.fips, 'annual/proj-mod/stats', obj.options.variable)
                };
                $.when.apply($, [
                    $.ajax({url: obj.data_urls.hist_obs, dataType: 'text'}),
                    $.ajax({url: obj.data_urls.hist_mod, dataType: 'text'}),
                    $.ajax({url: obj.data_urls.proj_mod, dataType: 'text'})
                ]).done(function(hist_obs,hist_mod,proj_mod) {
                    var hist_obs_data = string_to_data( hist_obs[0] );
                    var hist_mod_data = string_to_data( hist_mod[0] );
                    var proj_mod_data = string_to_data( proj_mod[0] );

                    var convfunc = variable_config(obj.options.variable).dataconverters[obj.options.unitsystem];
                    hist_obs_data = transform_data(hist_obs_data, convfunc);
                    hist_mod_data = transform_data(hist_mod_data, convfunc);
                    proj_mod_data = transform_data(proj_mod_data, convfunc);

                    var avg = average(hist_obs_data, 1960, 1989);
                    if (obj.options.presentation === "anomaly") {
                        if (obj.options.variable === "pr") {
                            hist_obs_data = percent_anomalies(hist_obs_data, avg);
                            hist_mod_data = percent_anomalies(hist_mod_data, avg);
                            proj_mod_data = percent_anomalies(proj_mod_data, avg);
                        } else {
                            hist_obs_data = anomalies(hist_obs_data, avg);
                            hist_mod_data = anomalies(hist_mod_data, avg);
                            proj_mod_data = anomalies(proj_mod_data, avg);
                        }
                    }

                    var range = scale_range(datas_range([hist_obs_data, hist_mod_data, proj_mod_data]), 1.10);
                    obj.axes.y.setDataRange(range.min, range.max);
                    obj.axes.y.title().content().string(
                        variable_config(obj.options.variable).ytitles.annual[obj.options.presentation][obj.options.unitsystem]
                    );

                    obj.data.annual_hist_obs.array(convertArray(attr_list_array(obj.data.annual_hist_obs.columns()), hist_obs_data));
                    obj.data.annual_hist_mod.array(convertArray(attr_list_array(obj.data.annual_hist_mod.columns()), hist_mod_data));
                    obj.data.annual_proj_mod.array(convertArray(attr_list_array(obj.data.annual_proj_mod.columns()), proj_mod_data));

                    obj.plots.annual.hist_obs.visible(true);
                    each_plot(obj.plots.annual.hist_mod, function(plot) { plot.visible(true); });
                    each_keys(obj.plots.annual.proj_mod, ["stat", "scenario"], function(k) {
                        obj.plots.annual.proj_mod[k.stat][k.scenario].visible(obj.options.scenario === k.scenario || obj.options.scenario === "both");
                    });

                    {
                        // Set the base level for the annual hist_obs bar plot --- this is the y-level
                        // at which the bars are based ("barbase" plot option), as well as the level
                        // that determines the colors of the bars ("min"/"max" property of the "fillcolor"
                        // option -- above this level is red, below it is green).
                        var ref = avg;
                        if (obj.options.presentation === "anomaly") {
                            if (obj.options.variable === "pr") {
                                ref = 100;
                            } else {
                                ref = 0;
                            }
                        }
                        var number_val = new window.multigraph.core.NumberValue(ref);
                        obj.plots.annual.hist_obs.renderer().options().barbase().at(0).value(number_val);
                        var j;
                        for (j=1; j<obj.plots.annual.hist_obs.renderer().options().fillcolor().size(); ++j) {
                            if (obj.plots.annual.hist_obs.renderer().options().fillcolor().at(j).min()) {
                                obj.plots.annual.hist_obs.renderer().options().fillcolor().at(j).min(number_val);
                            }
                            if (obj.plots.annual.hist_obs.renderer().options().fillcolor().at(j).max()) {
                                obj.plots.annual.hist_obs.renderer().options().fillcolor().at(j).max(number_val);
                            }
                        }
                    }

                    obj.m.render();

                });

            } else if (obj.options.frequency === "monthly") {
                obj.axes.x_annual.visible(false);
                obj.axes.x_monthly.visible(true);
                obj.axes.x_seasonal.visible(false);

                each_plot(obj.plots, function(plot) { plot.visible(false); });

                obj.data_urls = {
                    hist_obs: dataurl(obj.options.dataprefix, obj.options.fips, 'monthly/hist-obs/stats', obj.options.variable),
                    proj_mod: dataurl(obj.options.dataprefix, obj.options.fips, 'monthly/proj-mod/stats', obj.options.variable)
                };
                $.when.apply($, [
                    $.ajax({url: obj.data_urls.hist_obs, dataType: 'text'}),
                    $.ajax({url: obj.data_urls.proj_mod, dataType: 'text'})
                ]).done(function(hist_obs,proj_mod) {
                    var hist_obs_data = string_to_data( hist_obs[0] );
                    var proj_mod_data = string_to_data( proj_mod[0] );
                    var convfunc = variable_config(obj.options.variable).dataconverters[obj.options.unitsystem];
                    hist_obs_data = transform_data(hist_obs_data, convfunc);
                    proj_mod_data = transform_data(proj_mod_data, convfunc);
                    var range = scale_range(datas_range([hist_obs_data, proj_mod_data]), 1.10);
                    obj.axes.y.setDataRange(range.min, range.max);
                    obj.axes.y.title().content().string(variable_config(obj.options.variable).ytitles.monthly[obj.options.unitsystem]);
                    obj.data.monthly_hist_obs.array(convertArray(attr_list_array(obj.data.monthly_hist_obs.columns()), hist_obs_data));
                    obj.data.monthly_proj_mod.array(convertArray(attr_list_array(obj.data.monthly_proj_mod.columns()), proj_mod_data));
                    obj.plots.monthly.hist_obs.med.visible(true);
                    each_keys(obj.plots.monthly.proj_mod, ["stat", "scenario", "timeperiod"], function(k) {
                        obj.plots.monthly.proj_mod[k.stat][k.scenario][k.timeperiod].visible(
                            obj.options.timeperiod === k.timeperiod && (obj.options.scenario === k.scenario || obj.options.scenario === "both")
                        );
                    });
                    obj.m.render();
                });


            } else if (obj.options.frequency === "seasonal") {
                obj.axes.x_annual.visible(false);
                obj.axes.x_monthly.visible(false);
                obj.axes.x_seasonal.visible(true);

                each_plot(obj.plots, function(plot) { plot.visible(false); });

                obj.data_urls = {
                    hist_obs: dataurl(obj.options.dataprefix, obj.options.fips, 'seasonal/hist-obs/stats', obj.options.variable),
                    proj_mod: dataurl(obj.options.dataprefix, obj.options.fips, 'seasonal/proj-mod/stats', obj.options.variable)
                };
                $.when.apply($, [
                    $.ajax({url: obj.data_urls.hist_obs, dataType: 'text'}),
                    $.ajax({url: obj.data_urls.proj_mod, dataType: 'text'})
                ]).done(function(hist_obs,proj_mod) {
                    var hist_obs_data = string_to_data( hist_obs[0] );
                    var proj_mod_data = string_to_data( proj_mod[0] );
                    // The incoming data has month values 1,4,7,10.  Here we replace these with the values 0,1,2,3:
                    hist_obs_data.forEach(function(v) { v[0] = Math.floor(v[0]/3); });
                    proj_mod_data.forEach(function(v) { v[0] = Math.floor(v[0]/3); });
                    var convfunc = variable_config(obj.options.variable).dataconverters[obj.options.unitsystem];
                    hist_obs_data = transform_data(hist_obs_data, convfunc);
                    proj_mod_data = transform_data(proj_mod_data, convfunc);
                    var range = scale_range(datas_range([hist_obs_data, proj_mod_data]), 1.10);
                    obj.axes.y.setDataRange(range.min, range.max);
                    obj.axes.y.title().content().string(variable_config(obj.options.variable).ytitles.seasonal[obj.options.unitsystem]);
                    obj.data.seasonal_hist_obs.array(convertArray(attr_list_array(obj.data.seasonal_hist_obs.columns()), hist_obs_data));
                    obj.data.seasonal_proj_mod.array(convertArray(attr_list_array(obj.data.seasonal_proj_mod.columns()), proj_mod_data));
                    obj.plots.seasonal.hist_obs.med.visible(true);
                    each_keys(obj.plots.seasonal.proj_mod, ["stat", "scenario", "timeperiod"], function(k) {
                        obj.plots.seasonal.proj_mod[k.stat][k.scenario][k.timeperiod].visible(
                            obj.options.timeperiod === k.timeperiod && (obj.options.scenario === k.scenario || obj.options.scenario === "both")
                        );
                    });
                    obj.m.render();
                });


            }

        }
        obj.m.render();
    };
    obj.$graphdiv.multigraph('done', function(m) {
        obj.m = m;
//xyzzy
//window.mg = m;
        obj.axes = {
            x_annual   : m.graphs().at(0).axes().at(starti()),
            x_monthly  : m.graphs().at(0).axes().at(nexti()),
            x_seasonal : m.graphs().at(0).axes().at(nexti()),
            y          : m.graphs().at(0).axes().at(nexti())
        };

        obj.plots = {};
        set_in(obj.plots, ["annual",  "hist_mod", "minmax"                 ], m.graphs().at(0).plots().at(starti()));
        set_in(obj.plots, ["annual",  "hist_mod", "p1090"                  ], m.graphs().at(0).plots().at(nexti()));
        set_in(obj.plots, ["annual",  "proj_mod", "minmax", "rcp45"        ], m.graphs().at(0).plots().at(nexti()));
        set_in(obj.plots, ["annual",  "proj_mod", "p1090",  "rcp45"        ], m.graphs().at(0).plots().at(nexti()));
        set_in(obj.plots, ["annual",  "proj_mod", "minmax", "rcp85"        ], m.graphs().at(0).plots().at(nexti()));
        set_in(obj.plots, ["annual",  "proj_mod", "p1090",  "rcp85"        ], m.graphs().at(0).plots().at(nexti()));
        set_in(obj.plots, ["annual",  "hist_obs"                           ], m.graphs().at(0).plots().at(nexti()));
        set_in(obj.plots, ["annual",  "hist_mod", "med"                    ], m.graphs().at(0).plots().at(nexti()));
        set_in(obj.plots, ["annual",  "proj_mod", "med",    "rcp45"        ], m.graphs().at(0).plots().at(nexti()));
        set_in(obj.plots, ["annual",  "proj_mod", "med",    "rcp85"        ], m.graphs().at(0).plots().at(nexti()));

        set_in(obj.plots, ["monthly", "hist_obs", "med"                    ], m.graphs().at(0).plots().at(nexti()));
        set_in(obj.plots, ["monthly", "proj_mod", "p1090",  "rcp45", "2025"], m.graphs().at(0).plots().at(nexti()));
        set_in(obj.plots, ["monthly", "proj_mod", "p1090",  "rcp85", "2025"], m.graphs().at(0).plots().at(nexti()));
        set_in(obj.plots, ["monthly", "proj_mod", "med",    "rcp45", "2025"], m.graphs().at(0).plots().at(nexti()));
        set_in(obj.plots, ["monthly", "proj_mod", "med",    "rcp85", "2025"], m.graphs().at(0).plots().at(nexti()));
        set_in(obj.plots, ["monthly", "proj_mod", "p1090",  "rcp45", "2050"], m.graphs().at(0).plots().at(nexti()));
        set_in(obj.plots, ["monthly", "proj_mod", "p1090",  "rcp85", "2050"], m.graphs().at(0).plots().at(nexti()));
        set_in(obj.plots, ["monthly", "proj_mod", "med",    "rcp45", "2050"], m.graphs().at(0).plots().at(nexti()));
        set_in(obj.plots, ["monthly", "proj_mod", "med",    "rcp85", "2050"], m.graphs().at(0).plots().at(nexti()));
        set_in(obj.plots, ["monthly", "proj_mod", "p1090",  "rcp45", "2075"], m.graphs().at(0).plots().at(nexti()));
        set_in(obj.plots, ["monthly", "proj_mod", "p1090",  "rcp85", "2075"], m.graphs().at(0).plots().at(nexti()));
        set_in(obj.plots, ["monthly", "proj_mod", "med",    "rcp45", "2075"], m.graphs().at(0).plots().at(nexti()));
        set_in(obj.plots, ["monthly", "proj_mod", "med",    "rcp85", "2075"], m.graphs().at(0).plots().at(nexti()));

        set_in(obj.plots, ["seasonal","proj_mod", "p1090",  "rcp45", "2025"], m.graphs().at(0).plots().at(nexti()));
        set_in(obj.plots, ["seasonal","proj_mod", "p1090",  "rcp85", "2025"], m.graphs().at(0).plots().at(nexti()));
        set_in(obj.plots, ["seasonal","proj_mod", "p1090",  "rcp45", "2050"], m.graphs().at(0).plots().at(nexti()));
        set_in(obj.plots, ["seasonal","proj_mod", "p1090",  "rcp85", "2050"], m.graphs().at(0).plots().at(nexti()));
        set_in(obj.plots, ["seasonal","proj_mod", "p1090",  "rcp45", "2075"], m.graphs().at(0).plots().at(nexti()));
        set_in(obj.plots, ["seasonal","proj_mod", "p1090",  "rcp85", "2075"], m.graphs().at(0).plots().at(nexti()));
        set_in(obj.plots, ["seasonal","hist_obs", "med"                    ], m.graphs().at(0).plots().at(nexti()));
        set_in(obj.plots, ["seasonal","proj_mod", "med",    "rcp45", "2025"], m.graphs().at(0).plots().at(nexti()));
        set_in(obj.plots, ["seasonal","proj_mod", "med",    "rcp85", "2025"], m.graphs().at(0).plots().at(nexti()));
        set_in(obj.plots, ["seasonal","proj_mod", "med",    "rcp45", "2050"], m.graphs().at(0).plots().at(nexti()));
        set_in(obj.plots, ["seasonal","proj_mod", "med",    "rcp85", "2050"], m.graphs().at(0).plots().at(nexti()));
        set_in(obj.plots, ["seasonal","proj_mod", "med",    "rcp45", "2075"], m.graphs().at(0).plots().at(nexti()));
        set_in(obj.plots, ["seasonal","proj_mod", "med",    "rcp85", "2075"], m.graphs().at(0).plots().at(nexti()));

        obj.data = {
            annual_hist_obs  : m.graphs().at(0).data().at(starti()),
            annual_hist_mod  : m.graphs().at(0).data().at(nexti()),
            annual_proj_mod  : m.graphs().at(0).data().at(nexti()),
            monthly_hist_obs : m.graphs().at(0).data().at(nexti()),
            monthly_proj_mod : m.graphs().at(0).data().at(nexti()),
            seasonal_hist_obs : m.graphs().at(0).data().at(nexti()),
            seasonal_proj_mod : m.graphs().at(0).data().at(nexti())
        };
        obj.update(obj.orig_options);
    });
    obj.dataurls = function() {
        return $.extend({}, obj.data_urls);
    };
    return obj;
};
