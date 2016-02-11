var cwg = undefined;

$(document).ready(function() {

    function populate_variables(frequency) {
        var variables = climate_widget.variables(frequency);
        $("select#variable").empty();
        $(variables.map(function(v) {
            return ('<option value="' + v.id + '"' + '>'  + v.title + '</option>');
        }).join("")).appendTo($("select#variable"));
    }

    populate_variables($('#frequency').val());

    $('#frequency').change(function() {
        var freq = $('#frequency').val();
        if (freq === "annual") {
            $('#pagetitle').text("Annual timeseries");
        }
        if (freq === "monthly") {
            $('#pagetitle').text("Monthly timeseries");
        }
        if (freq === "seasonal") {
            $('#pagetitle').text("Seasonal timeseries");
        }
        populate_variables($('#frequency').val());
        cwg.update({
            frequency: freq,
            variable: $('#variable').val()
        });
    });

    $('#timeperiod').change(function() {
        cwg.update({
            timeperiod: $('#timeperiod').val()
        });
    });
    $('#county').change(function() {
        cwg.update({
            fips: $('#county').val()
        });
    });
    $('#variable').change(function() {
        cwg.update({
            variable: $('#variable').val()
        });
    });
    $('#scenario').change(function() {
        cwg.update({
            scenario: $('#scenario').val()
        });
    });
    $('#presentation').change(function() {
        cwg.update({
            presentation: $('#presentation').val()
        });
    });

    $('#download-button').click(function() {
        if (cwg) {
            var $ul = $('#download-panel').find('ul')
            $ul.empty();
            var dataurls = cwg.dataurls();
            if (dataurls.hist_obs) {
                $ul.append($("<li><a href='"+dataurls.hist_obs+"'>Observed Data</a></li>"));
            }
            if (dataurls.hist_mod) {
                $ul.append($("<li><a href='"+dataurls.hist_mod+"'>Historical Modeled Data</a></li>"));
            }
            if (dataurls.proj_mod) {
                $ul.append($("<li><a href='"+dataurls.proj_mod+"'>Projected Modeled Data</a></li>"));
            }
            $('#download-panel').removeClass("hidden");
        }
    });
    $('#download-dismiss-button').click(function() {
        $('#download-panel').addClass("hidden");
    });

    WebFont.load({
        google: {
            families: ['Pacifico', 'Roboto']
        },
        active: function() {
            cwg = climate_widget.graph({
                'div'           :  "div#widget",
                'dataprefix'    : 'http://climate-widget-data.nemac.org/data',
                'font'          : 'Roboto',
                'frequency'     : $('#frequency').val(),
                'timeperiod'    : $('#timeperiod').val(),
                'fips'          : $('#county').val(),
                'variable'      : $('#variable').val(),
                'scenario'      : $('#scenario').val(),
                'presentation'  : $('#presentation').val()
            });
        }
    });

});
