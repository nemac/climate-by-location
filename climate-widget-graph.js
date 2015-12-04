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

var yrange = {
    "tasmax": {
        "absolute": { min:  15,  max:   27 },
        "anomaly":  { min:  -8,  max:    8 }
    },
    "pr":  {
        "absolute": { min:  1, max:   7 },
        "anomaly":  { min:  0, max:   200 }
    }
};

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
        id: "year",
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
        id: "temp",
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

function band_plot(year_name, min_name, max_name, fill_color, fill_opacity) {
    return {
        horizontalaxis: { year: year_name },
        verticalaxis:   { temp: [min_name, max_name ] },
        style: "band",
        options: {
            fillcolor: fill_color,
            fillopacity: fill_opacity,
            linewidth: 0
        }
    };
}

function line_plot(year_name, var_name, line_color) {
    return {
        horizontalaxis: { year: year_name },
        verticalaxis:   { temp: var_name },
        style: "line",
        options: {
            linecolor: line_color,
            linewidth: 2
        }
    };
}

function bar_plot(year_name, var_name, bar_color, line_color) {
    return {
        horizontalaxis: { year: year_name },
        verticalaxis:   { temp: var_name },
        style: "bar",
        options: {
            fillcolor: bar_color,
            barwidth: 1,
            baroffset: 0.5,
            linecolor: line_color
        }
    };
}

function bar_plot_based_at(year_name, var_name, ref) {
    // (colors are hard-coded in this one, but not for any good reason)
    return {
        horizontalaxis: { year: year_name },
        verticalaxis:   { temp: var_name },
        style: "bar",
        options: {
            barbase: ref,
            fillcolor: [ {"value": "0xCD6760", "min": ref},
                         {"value": "0x6194C8", "max": ref} ],
            barwidth: 1,
            baroffset: 0.5,
            linecolor: "#000000",
+            hidelines: 999
        }
    };
}


function make_mugl(hist_obs_data, hist_mod_data, proj_mod_data, yrange, options) {

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
        plots.push(band_plot("proj_mod_year", "proj_mod_rcp45min", "proj_mod_rcp45max", "#0000cc", 0.3));
        plots.push(band_plot("proj_mod_year", "proj_mod_rcp45p10", "proj_mod_rcp45p90", "#000099", 0.3));
    }
    if (options.scenario === "rcp85" || options.scenario === "both") {
        plots.push(band_plot("proj_mod_year", "proj_mod_rcp85min", "proj_mod_rcp85max", "#cc0000", 0.3));
        plots.push(band_plot("proj_mod_year", "proj_mod_rcp85p10", "proj_mod_rcp85p90", "#990000", 0.3));
    }

    var hist_obs_name = "hist_obs_" + options.variable;

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
        plots.push(line_plot("proj_mod_year", "proj_mod_rcp45median", "#0000cc"));
    }
    if (options.scenario === "rcp85" || options.scenario === "both") {
        plots.push(line_plot("proj_mod_year", "proj_mod_rcp85median", "#cc0000"));
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

climate_widget_graph = function(options) {
    //var data_dir = options.data_dir ? options.data_dir : "http://climate-widget.nemac.org/data/county-data/10dayrolling/";
    //if (options.scenario) include_rcp = translateRcps(options.scenario);
    //console.log(options.presentation);

    // TODO generalize the following later
    var reqUrlPrefixes = [
      'data/02-B/37021/US_Counties_gmo_averages_annual/',
      'data/02-B/37021/US_Counties_hist_averages_annual/stats/',
      'data/02-B/37021/US_Counties_rcp_averages_annual/stats/'
    ];

    var reqs = reqUrlPrefixes.map(function(req) {
      return $.ajax({
        url: req + options.variable + '.csv',
        dataType: 'text'
      });
    });

    $.when.apply($, reqs).done(function(data1,data2,data3) {
        hist_obs_data = string_to_data( data1[0] );
        hist_mod_data = string_to_data( data2[0] );
        proj_mod_data = string_to_data( data3[0] );
        var gmugl = make_mugl(hist_obs_data, hist_mod_data, proj_mod_data, yrange[options.variable], options);
        //console.log(JSON.stringify(gmugl));
        //var gmugl = make_mugl(proj_data, hist_data, yrange[options.variable]);
        $('.errorDisplayDetails').remove();
        $(options.div).empty();
        $(options.div).append("<div class='graph' style='width: 100%; height: 100%;'></div>");
        $(options.div).find('div.graph').multigraph({muglString: gmugl});
    });
};
