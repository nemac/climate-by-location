// This file defines a single function, `climate_widget_graph`, which
// creates a Climate Widget data graph.  It takes a single argument
// which should be a JavaScript object with three properties:
//
//     climate_widget_graph({
//         'variable'     : VARIABLE_NAME,
//         'scenario'     : SCENARIO_NAME,
//         'presentation' : PRESENTATION_NAME,
//         'fips'         : COUNTY_FIPS_CODE,
//         'div'          : DIV
//     });
//
// VARIABLE_NAME should be one of the following:
//
//    US_Counties_cooling_degree_day_cmip5
//    US_Counties_days_tmax_abv_35_cmip5
//    US_Counties_days_tmin_blw_0_cmip5
//    US_Counties_growing_season_lngth_cmip5
//    US_Counties_heating_degree_day_cmip5
//    US_Counties_longest_run_prcp_blw_cmip5
//
// SCENARIO_NAME should be one of the following:
//
//    rcp45
//    rcp85
//    both
//
//  note:
//  "both" displays rcp45 and rcp85 simultaneously
//
// PRESENTATION should be one of the following:
//
//    absolute
//    anomaly
//
//  note:
//  "absolute" will display the raw underlying values
//  "anomaly" will present the data as a deviance from a derived baseline
//
// COUNTY_FIPS_CODE should be the 5-digit fips code of a US county, as a
// string.  (Note that 4-digit fips codes should be left-padded with a 0
// to make 5 digits.)
//
// DIV should be the div where you want the graph to appear; it can be
// either (a) a selector string, (b) a DOM element, or (c) a JQuery
// object.
//
// For example, the following will populate the div whose id is
// "climateWidgetGraph" with a graph showing the variable
// "US_Counties_longest_run_prcp_blw_cmip5" for Buncombe county NC:
//
//     climate_widget_graph({
//         'variable': "US_Counties_longest_run_prcp_blw_cmip5",
//         'fips'    : "37021",
//         'div'     : "div#climateWidgetGraph"
//     });
//
// IMPORTANT: the speicfied div must have been previously inserted
// into the DOM and sized -- the graph will be sized to completely
// fill that div.  It is the responsibility of the caller to make
// sure that the div has a size before calling `climate_widget_graph`.

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
}

var include_rcp = {
    rcp85: true,
    rcp60: false,
    rcp45: true,
    rcp26: false
};

function translateRcps(str) {
    return {
        rcp85: str === 'rcp85' || str === 'both',
        rcp60: false,
        rcp45: str === 'rcp45' || str === 'both',
        rcp26: false
    };
}

var variables = [

    { selected: true,
      id:       "tasmax",
      title:    "Mean Daily Maximum Temperature",
      absolute: { min:  15,  max:   27 },
      anomaly:  { min:  -8,  max:    8 } },

    { id:       "tasmin",
      title:    "Mean Daily Minimum Temperature",
      absolute: { min:  -20,  max:   20 },
      anomaly:  { min:  -8,   max:    8 } },

    { id:       "pr",
      title:    "Mean Daily Average Precipitation",
      absolute: { min:  1, max:   7 },
      anomaly:  { min:  0, max:   200 } },
/*
    { id:       "days_tmax_abv_32.2",
      title:    "Days with Maximum Temperature Above 32.2",
      absolute: { min:  0,   max:  100 },
      anomaly:  { min:  -8,  max:    8 } },
*/
    { id:       "days_tmax_abv_35.0",
      title:    "Days with Maximum Temperature Above 95° F",
      absolute: { min:  0,  max:  100 },
      anomaly:  { min:  0,  max:  100 } },
/*
    { id:       "days_tmax_abv_37.7",
      title:    "Days with Maximum Temperature Above 37.7",
      absolute: { min:  0,   max:  100 },
      anomaly:  { min:  -8,  max:    8 } },
*/
    { id:       "days_tmin_blw_0.0",
      title:    "Days with Minimum Temperature Below 32° F",
      absolute: { min:  0,   max:  140 },
      anomaly:  { min:  -95, max:   30 } },
/*
    { id:       "days_tmin_blw_-12.2",
      title:    "Days with Minimum Temperature Below -12.1",
      absolute: { min:  0,   max:  100 },
      anomaly:  { min:  -8,  max:    8 } },

    { id:       "days_tmin_blw_-17.7",
      title:    "Days with Minimum Temperature Below -17.7",
      absolute: { min:  0,   max:  100 },
      anomaly:  { min:  -8,  max:    8 } },
*/
    { id:       "growing_season_lngth_0.0",
      title:    "Growing Season Length",
      absolute: { min: 240,  max:  380 },
      anomaly:  { min:  -60,  max:  80 } },

    { id:       "heating_degree_day_18.3",
      title:    "Heating Degree Days",
      absolute: { min:  1000,   max:  3500 },
      anomaly:  { min:  -1700,  max:    800 } },

    { id:       "cooling_degree_day_18.3",
      title:    "Cooling Degree Days",
      absolute: { min:  100,   max:  1600 },
      anomaly:  { min:  -160,  max:  1300 } },
/*
    { id:       "days_prcp_abv_101.5",
      title:    "Days with Precipitation Above 101.5",
      absolute: { min:  0,   max:  100 },
      anomaly:  { min:  -8,  max:    8 } },
*/
    { id:       "days_prcp_abv_25.3",
      title:    "Days of Precipitation Above 1in",
      absolute: { min:  0,   max:  25 },
      anomaly:  { min:  -10,  max: 15 } },
/*
    { id:       "days_prcp_abv_50.7",
      title:    "Days with Precipitation Above 50.7",
      absolute: { min:  0,   max:  100 },
      anomaly:  { min:  -8,  max:    8 } },

    { id:       "days_prcp_abv_76.1",
      title:    "Days with Precipitation Above 76.1",
      absolute: { min:  0,   max:  100 },
      anomaly:  { min:  -8,  max:    8 } },

    { id:       "growing_degree_day_15.5",
      title:    "Growing Degree Days",
      absolute: { min:  0,   max:  100 },
      anomaly:  { min:  -8,  max:    8 } },
*/
    { id:       "longest_run_prcp_blw_76.1",
      title:    "Consecutive Days of Precipitation Below 3mm",
      absolute: { min:  0,   max:  100 },
      anomaly:  { min:  -8,  max:    8 } },
/*
    { id:       "longest_run_tmax_abv_32.2",
      title:    "Longest Run with Maximum Temperature Above 32.2",
      absolute: { min:  0,   max:  100 },
      anomaly:  { min:  -8,  max:    8 } },

    { id:       "longest_run_tmax_abv_35.0",
      title:    "Longest Run with Maximum Temperature Above 35.0",
      absolute: { min:  0,   max:  100 },
      anomaly:  { min:  -8,  max:    8 } },

    { id:       "longest_run_tmax_abv_37.7",
      title:    "Longest Run with Maximum Temperature Above 37.7",
      absolute: { min:  0,   max:  100 },
      anomaly:  { min:  -8,  max:    8 } }
*/
];

// monthly/seasonal variables:
var ms_variables = [
    { selected: true,
      id:       "tasmax",
      title:    "Mean Daily Maximum Temperature",
      absolute: { min:  0,  max:   35 },
      anomaly:  { min:  0,  max:   35 } },

    { id:       "tasmin",
      title:    "Mean Daily Minimum Temperature",
      absolute: { min:  -20,  max:   20 },
      anomaly:  { min:  0,  max:   35 } },

    { id:       "pr",
      title:    "Mean Daily Average Precipitation",
      absolute: { min:  1, max:   7 },
      anomaly:  { min:  0, max:   200 } }
];


yrange = variables.reduce(function(m,v) { m[v.id] = v; return m; }, {});
ms_yrange = ms_variables.reduce(function(m,v) { m[v.id] = v; return m; }, {});

$(document).ready(function() {
    $(variables.map(function(v) {
        return ('<option value="' + v.id + '"'
                + (v.selected ? ' selected="selected"' : '')
                + '>'  + v.title + '</option>');
    }).join("")).appendTo($("select#variable"));
    configureAndLaunchGraph();
});


function string_to_data(s) {
    // Takes a multiline string of the form
    //
    //   name1,name2,name3,...
    //   1921,1.3,33.5,2.5,...
    //   1922,1.3,33.5,2.5,...
    //
    // and returns a structure like this:
    //
    //   {
    //     names: ["name1","name2","name3",...],
    //     values: [[1921,1.3,33.5,2.5,...],
    //              [1922,1.3,33.5,2.5,...],
    //              ...]
    //   }
    var names = undefined, values = [];
    s.split("\n")
        .filter(function(line) {
            return line.match(/\S/); // filter out blanks lines
        })
        .forEach(function(line) {
            if (names === undefined) {
                names = line.split(",");
            } else {
                values.push(line.split(",").map(function(s) { return Number(s); }));
            }
        });
    return {
        names: names,
        values: values
    };
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

function get_data(variable, data_dir, suffix, fips, success) {
    $.ajax({
        url: data_dir + variable + "_" + suffix + "/" + fips + ".csv",
        dataType: "text",
        success: function(data) {
            success(string_to_data(data));
        }
    });
}

function get_proj_and_hist_data(variable, data_dir, fips, success) {
    get_data(variable, data_dir, "der", fips, function(proj_data) {
        get_data(variable, data_dir, "hist_der", fips, function(hist_data) {
            success(proj_data, hist_data);
        });
    });
}

var mugl = {
    legend: false,
    horizontalaxis: {
        id: "x",
        min: 1950,
        max: 2099,
        title: false,
        labels: {
            label: [
                { format: "%1d", spacing: [100, 50, 20, 10, 5, 2, 1] }
            ]
        }
    },
    verticalaxis: {
        id: "y",
        min: 0,
        max: 2000,
        title: false,
        labels: {
            label: [
                { format: "%1d", spacing: [10000, 5000, 2000, 1000, 500, 200, 100, 50, 20, 10, 5, 2, 1] }
            ]
        }
    }
};

function band_plot(x, y0, y1, fill_color, fill_opacity) {
    return {
        horizontalaxis: { x: x },
        verticalaxis:   { y: [y0, y1 ] },
        style: "band",
        options: {
            fillcolor: fill_color,
            fillopacity: fill_opacity,
            linewidth: 0
        }
    };
}

function line_plot(x, y, line_color, dashed) {
    return {
        horizontalaxis: { x: x },
        verticalaxis:   { y: y },
        style: "line",
        options: {
            linecolor: line_color,
            linestroke: dashed ? "dashed" : "solid",
            linewidth: 2
        }
    };
}

function bar_plot(x, y, bar_color, line_color) {
    return {
        horizontalaxis: { x: x },
        verticalaxis:   { y: y },
        style: "bar",
        options: {
            fillcolor: bar_color,
            barwidth: 1,
            baroffset: 0.5,
            linecolor: line_color
        }
    };
}

function range_bar_plot(x, y0, y1, bar_color, line_color, baroffset, fillopacity) {
    return {
        horizontalaxis: { x: x },
        verticalaxis:   { y: [y0,y1] },
        style: "rangebar",
        options: {
            fillcolor: bar_color,
            fillopacity: fillopacity,
            barwidth: 0.5,
            baroffset: baroffset,
            linecolor: line_color
        }
    };
}

function bar_plot_based_at(x, y, ref) {
    // (colors are hard-coded in this one, but not for any good reason)
    return {
        horizontalaxis: { x: x },
        verticalaxis:   { y: y },
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
}


function make_annual_mugl(hist_obs_data, hist_mod_data, proj_mod_data, yrange, options) {

    var avg = average(hist_obs_data.values, 1960, 1989);
    if (options.presentation === "anomaly") {
        if (options.variable === "pr") {
            hist_obs_data.values = percent_anomalies(hist_obs_data.values, avg);
            hist_mod_data.values = percent_anomalies(hist_mod_data.values, avg);
            proj_mod_data.values = percent_anomalies(proj_mod_data.values, avg);
        } else {
            hist_obs_data.values = anomalies(hist_obs_data.values, avg);
            hist_mod_data.values = anomalies(hist_mod_data.values, avg);
            proj_mod_data.values = anomalies(proj_mod_data.values, avg);
        }
    }
    var data = [{
        variables: hist_obs_data.names.map(function(name) { return { id: name }; }),
        values: hist_obs_data.values
    }, {
        variables: hist_mod_data.names.map(function(name) { return { id: name }; }),
        values: hist_mod_data.values
    }, {
        variables: proj_mod_data.names.map(function(name) { return { id: name }; }),
        values: proj_mod_data.values
    }];
    var prefixes = ["hist_obs_", "hist_mod_", "proj_mod_"];
    data.forEach(function(d,i) {
        d.variables.forEach(function(v) {
            v.id = prefixes[i] + v.id;
        });
    });

    var plots = [];

    plots.push(band_plot("hist_mod_year", "hist_mod_min", "hist_mod_max", "#cccccc", 0.7));
    plots.push(band_plot("hist_mod_year", "hist_mod_p10", "hist_mod_p90", "#999999", 0.5));

    if (options.scenario === "rcp45" || options.scenario === "both") {
        plots.push(band_plot("proj_mod_year", "proj_mod_rcp45min", "proj_mod_rcp45max", colors.blues.outerBand, 0.3));
        plots.push(band_plot("proj_mod_year", "proj_mod_rcp45p10", "proj_mod_rcp45p90", colors.blues.innerBand, 0.3));
    }
    if (options.scenario === "rcp85" || options.scenario === "both") {
        plots.push(band_plot("proj_mod_year", "proj_mod_rcp85min", "proj_mod_rcp85max", colors.reds.outerBand, 0.3));
        plots.push(band_plot("proj_mod_year", "proj_mod_rcp85p10", "proj_mod_rcp85p90", colors.reds.innerBand, 0.3));
    }

    //var hist_obs_name = "hist_obs_" + options.variable;
    var hist_obs_name = "hist_obs_y";

    if (options.presentation === "anomaly") {
        if (options.variable === "pr") {
            plots.push(bar_plot_based_at("hist_obs_year", hist_obs_name, 100));
        } else {
            plots.push(bar_plot_based_at("hist_obs_year", hist_obs_name, 0));
        }
    } else {
        plots.push(bar_plot_based_at("hist_obs_year", hist_obs_name, avg));
    }

    plots.push(line_plot("hist_mod_year", "hist_mod_median",      "#000000"));
    if (options.scenario === "rcp45" || options.scenario === "both") {
        plots.push(line_plot("proj_mod_year", "proj_mod_rcp45median", colors.blues.line));
    }
    if (options.scenario === "rcp85" || options.scenario === "both") {
        plots.push(line_plot("proj_mod_year", "proj_mod_rcp85median", colors.reds.line));
    }

//    if (include_rcp["rcp85"]) { plots.push(band_plot("year", "rcp85_min", "rcp85_max", "#ffcccc", 1.0)); }
//    if (include_rcp["rcp60"]) { plots.push(band_plot("year", "rcp60_min", "rcp60_max", "#ffccff", 0.5)); }
//    if (include_rcp["rcp45"]) { plots.push(band_plot("year", "rcp45_min", "rcp45_max", "#ccccff", 0.5)); }
//    if (include_rcp["rcp26"]) { plots.push(band_plot("year", "rcp26_min", "rcp26_max", "#ccffcc", 0.5)); }
//
//    plots.push(line_plot("historical_year", "historical_mean", "#000000"));
//    if (include_rcp["rcp85"]) { plots.push(line_plot("year", "rcp85_mean", "#ff0000")); }
//    if (include_rcp["rcp60"]) { plots.push(line_plot("year", "rcp60_mean", "#ff66ff")); }
//    if (include_rcp["rcp45"]) { plots.push(line_plot("year", "rcp45_mean", "#0000ff")); }
//    if (include_rcp["rcp26"]) { plots.push(line_plot("year", "rcp26_mean", "#00ff00")); }

    // window style
    var this_mugl = $.extend({}, mugl, {
        data: data,
        plots: plots,
        "window": {
          "border": 0,
          "padding": 0,
          "margin": 0
        }
    });
    this_mugl.verticalaxis.min = yrange[options.presentation].min;
    this_mugl.verticalaxis.max = yrange[options.presentation].max;

    return this_mugl;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////

function make_monthly_mugl(hist_obs_data, proj_mod_data, yrange, options) {

// hist_obs:
//month,mean30,max,median,min,p10,p90
//1,7.038,14.478,7.276,0.650,4.789,11.219
//2,8.973,15.572,9.877,3.502,6.993,12.166
//3,13.880,18.031,13.806,5.189,10.953,16.392
//4,19.072,22.037,18.867,14.860,16.904,21.308
//5,22.948,26.940,23.167,20.050,21.310,24.890
//6,26.316,30.676,26.560,23.347,24.706,27.921
//7,27.793,31.057,27.846,25.071,26.484,29.370
//8,27.287,30.689,27.453,24.474,26.150,29.013
//9,24.086,28.160,24.059,21.741,22.755,25.864
//10,19.230,22.589,19.305,15.648,17.636,21.055
//11,13.858,18.187,13.713,9.964,11.599,16.405
//12,8.943,14.673,8.996,3.508,6.193,11.568

// proj_mod:
//month,2025rcp45_max,2025rcp45_median,2025rcp45_min,2025rcp45_p10,2025rcp45_p90,2025rcp85_max...
//1,10.097,8.619,7.609,7.885,9.687,9.986,8.729,7.353,7.951,9.617,10.422,9.294,7.891,8.291,10.2...
//2,12.073,10.480,9.170,9.503,11.155,11.904,10.546,9.123,9.669,11.301,13.285,11.195,9.399,10.1...
//3,15.941,14.607,13.508,14.137,15.332,15.821,14.569,13.495,13.766,15.394,16.319,15.256,14.334...
//4,21.163,20.346,19.429,19.704,20.974,21.231,20.238,19.256,19.777,20.989,22.238,20.924,19.708...
//5,25.717,24.464,23.587,23.993,25.201,25.945,24.620,23.806,24.111,25.337,26.116,25.400,24.766...
//6,28.597,27.812,27.092,27.383,28.369,28.756,27.902,27.228,27.410,28.552,29.298,28.788,27.962...
//7,30.353,29.570,28.705,28.949,30.074,30.499,29.727,28.793,29.160,30.211,31.136,30.507,29.714...
//8,29.659,29.089,28.209,28.480,29.537,30.159,29.161,28.274,28.711,29.780,30.431,29.960,28.971...
//9,26.915,25.928,25.334,25.500,26.628,27.600,26.249,25.233,25.583,26.698,27.447,26.900,25.794...
//10,21.630,20.803,20.095,20.342,21.394,22.098,21.025,20.300,20.660,21.754,22.242,21.604,20.63...
//11,16.058,15.133,14.174,14.450,15.644,15.934,15.068,13.879,14.381,15.671,16.544,15.651,14.80...
//12,11.294,10.056,8.706,9.480,10.807,11.237,10.181,8.662,9.351,10.685,11.790,10.711,9.785,10....

    var data = [{
        variables: hist_obs_data.names.map(function(name) { return { id: name }; }),
        values: hist_obs_data.values,
        repeat: { period: 12 }
    }, {
        variables: proj_mod_data.names.map(function(name) { return { id: name }; }),
        values: proj_mod_data.values,
        repeat: { period: 12 }
    }];
    var prefixes = ["hist_obs_", "proj_mod_"];
    data.forEach(function(d,i) {
        d.variables.forEach(function(v) {
            v.id = prefixes[i] + v.id;
        });
    });

    var plots = [];

    plots.push(line_plot("hist_obs_month", "hist_obs_median",              "#000000"));
    plots.push(line_plot("hist_obs_month", "hist_obs_p10",                 "#000000", true));
    plots.push(line_plot("hist_obs_month", "hist_obs_p90",                 "#000000", true));

    var prefix = "proj_mod_" + options.timeperiod;

    if (options.scenario === "rcp45" || options.scenario === "both") {
        plots.push(band_plot("proj_mod_month", prefix+"rcp45_p10", prefix+"rcp45_p90", colors.blues.innerBand, 0.3));
    }
    if (options.scenario === "rcp85" || options.scenario === "both") {
        plots.push(band_plot("proj_mod_month", prefix+"rcp85_p10", prefix+"rcp85_p90", colors.reds.innerBand, 0.3));
    }


    if (options.scenario === "rcp45" || options.scenario === "both") {
        plots.push(line_plot("proj_mod_month", prefix+"rcp45_median", colors.blues.outerBand));
    }
    if (options.scenario === "rcp85" || options.scenario === "both") {
        plots.push(line_plot("proj_mod_month", prefix+"rcp85_median", colors.reds.line));
    }

    var this_mugl = {
        window: {
            border: 0,
            padding: 0,
            margin: 0
        },
        legend: false,
        horizontalaxis: {
            id: "x",
            min: -2,
            max: 12,
            title: false,
            labels: {
                label: [ { format: ["Dec","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov"],
                           spacing: [1] } ]
            }
        },
        verticalaxis: {
            id: "y",
            min: yrange[options.presentation].min,
            max: yrange[options.presentation].max,
            title: false,
            labels: {
                label: [
                    { format: "%1d",
                      spacing: [10000, 5000, 2000, 1000, 500, 200, 100, 50, 20, 10, 5, 2, 1],
                      densityfactor: 0.5  } ]
            }
        },
        data: data,
        plots: plots
    };
    return this_mugl;
}

function make_seasonal_mugl(hist_obs_data, proj_mod_data, yrange, options) {

    // proj_mod:
    // month,2025rcp45_max,2025rcp45_median,2025rcp45_min,2025rcp45_p10,2025rcp45_p90,2025rcp85_max...
    // 1,10.870,9.725,8.698,9.206,10.365,10.713,9.795,8.539,9.140,10.390,11.594,10.308,9.468,9.908,...
    // 4,20.730,19.818,19.140,19.495,20.265,20.699,19.812,19.055,19.454,20.413,21.320,20.502,19.820...
    // 7,29.448,28.844,28.151,28.328,29.282,29.734,28.973,28.222,28.458,29.570,30.249,29.784,28.909...
    // 10,21.335,20.559,20.157,20.214,21.122,21.639,20.692,20.096,20.381,21.312,22.023,21.398,20.66...

    // hist_obs:
    // month,mean30,max,median,min,p10,p90
    // 1,8.348,12.128,8.665,5.444,6.688,10.646
    // 4,18.629,20.366,18.697,15.793,17.119,19.893
    // 7,27.141,29.467,27.262,25.093,26.244,28.377
    // 10,19.060,21.666,19.002,16.873,17.910,20.348

    // The incoming data has month values 1,4,7,10.  Here we replace these
    // with the values 0,1,2,3:
    hist_obs_data.values.forEach(function(v) {
        v[0] = Math.floor(v[0]/3);
    });
    proj_mod_data.values.forEach(function(v) {
        v[0] = Math.floor(v[0]/3);
    });


    var data = [{
        variables: hist_obs_data.names.map(function(name) { return { id: name }; }),
        values: hist_obs_data.values,
        repeat: { period: 4 }
    }, {
        variables: proj_mod_data.names.map(function(name) { return { id: name }; }),
        values: proj_mod_data.values,
        repeat: { period: 4 }
    }];
    var prefixes = ["hist_obs_", "proj_mod_"];
    data.forEach(function(d,i) {
        d.variables.forEach(function(v) {
            v.id = prefixes[i] + v.id;
        });
    });

    var plots = [];

    plots.push(range_bar_plot("hist_obs_month", "hist_obs_p10", "hist_obs_p90",  "#cccccc", "#cccccc", 0.5, 0.7));

    var prefix = "proj_mod_" + options.timeperiod;

    if (options.scenario === "rcp45" || options.scenario === "both") {
        plots.push(range_bar_plot("proj_mod_month", prefix+"rcp45_p10", prefix+"rcp45_p90", colors.blues.innerBand, colors.blues.innerBand, 0.25, 0.4));
    }
    if (options.scenario === "rcp85" || options.scenario === "both") {
        plots.push(range_bar_plot("proj_mod_month", prefix+"rcp85_p10", prefix+"rcp85_p90", colors.reds.innerBand, colors.reds.innerBand, 0.0, 0.4));
    }


    plots.push(range_bar_plot("hist_obs_month", "hist_obs_median", "hist_obs_median",  "#000000", "#000000", 0.5, 1.0));
    if (options.scenario === "rcp45" || options.scenario === "both") {
        plots.push(range_bar_plot("proj_mod_month", prefix+"rcp45_median", prefix+"rcp45_median", "#0000ff", "#0000ff", 0.25, 1.0));
    }
    if (options.scenario === "rcp85" || options.scenario === "both") {
        plots.push(range_bar_plot("proj_mod_month", prefix+"rcp85_median", prefix+"rcp85_median", colors.reds.line, colors.reds.line, 0.0, 1.0));
    }

    var this_mugl = {
        window: {
            border: 0,
            padding: 0,
            margin: 0
        },
        legend: false,
        horizontalaxis: {
            id: "x",
            min: -0.5,
            max: 3.5,
            title: false,
            labels: {
                label: [ { format: ["Winter", "Spring", "Summer", /* or */ "Fall"],
                           /*        all you have to do is call... */
                           spacing: [1] } ]
            }
        },
        verticalaxis: {
            id: "y",
            min: yrange[options.presentation].min,
            max: yrange[options.presentation].max,
            title: false,
            labels: {
                label: [
                    { format: "%1d",
                      spacing: [10000, 5000, 2000, 1000, 500, 200, 100, 50, 20, 10, 5, 2, 1],
                      densityfactor: 0.5  } ]
            }
        },
        data: data,
        plots: plots
    };
    return this_mugl;
}


///////////////////////////////////////////////////////////////////////////////////////////////////////
climate_widget_graph = function(options) {
    //var data_dir = options.data_dir ? options.data_dir : "http://climate-widget.nemac.org/data/county-data/10dayrolling/";
    //if (options.scenario) include_rcp = translateRcps(options.scenario);
    //console.log(options.presentation);

    function dataReq(dir, element) {
        var url = dir + '/' + element + '.csv';
        return $.ajax({url: url, dataType: 'text'});
    }

    if (options.frequency === "annual") {

        $.when.apply($, [
            dataReq('data/02-final/37021/annual/hist-obs', options.variable),
            dataReq('data/02-final/37021/annual/hist-mod/stats', options.variable),
            dataReq('data/02-final/37021/annual/proj-mod/stats', options.variable),
        ]).done(function(hist_obs,hist_mod,proj_mod) {
            $(options.div).empty();
            hist_obs_data = string_to_data( hist_obs[0] );
            hist_obs_data.names[1] = "y";
            hist_mod_data = string_to_data( hist_mod[0] );
            proj_mod_data = string_to_data( proj_mod[0] );
            var gmugl = make_annual_mugl(hist_obs_data, hist_mod_data, proj_mod_data,
                                         yrange[options.variable], options);
            $('.errorDisplayDetails').remove();
            $(options.div).append("<div class='graph' style='width: 100%; height: 100%;'></div>");
            $(options.div).find('div.graph').multigraph({muglString: gmugl});
        });

    } else if (options.frequency === "monthly") {

        $.when.apply($, [
            dataReq('data/02-final/37021/monthly/hist-obs/stats', options.variable),
            dataReq('data/02-final/37021/monthly/proj-mod/stats', options.variable),
        ]).done(function(hist_obs,proj_mod) {
            $(options.div).empty();
            hist_obs_data = string_to_data( hist_obs[0] );
            proj_mod_data = string_to_data( proj_mod[0] );
            var gmugl = make_monthly_mugl(hist_obs_data, proj_mod_data,
                                         ms_yrange[options.variable], options);
            $('.errorDisplayDetails').remove();
            $(options.div).append("<div class='graph' style='width: 100%; height: 100%;'></div>");
            $(options.div).find('div.graph').multigraph({muglString: gmugl});
        });

    } else if (options.frequency === "seasonal") {
        $.when.apply($, [
            dataReq('data/02-final/37021/seasonal/hist-obs/stats', options.variable),
            dataReq('data/02-final/37021/seasonal/proj-mod/stats', options.variable),
        ]).done(function(hist_obs,proj_mod) {
            $(options.div).empty();
            hist_obs_data = string_to_data( hist_obs[0] );
            proj_mod_data = string_to_data( proj_mod[0] );
            var gmugl = make_seasonal_mugl(hist_obs_data, proj_mod_data,
                                           ms_yrange[options.variable], options);
            $('.errorDisplayDetails').remove();
            $(options.div).append("<div class='graph' style='width: 100%; height: 100%;'></div>");
            $(options.div).find('div.graph').multigraph({muglString: gmugl});
        });
    }
};
