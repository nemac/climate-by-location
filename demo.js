let cbl_instance = undefined;
/* global ClimateByLocationWidget */
jQuery(document).ready(function ($) {

  /**
   * Update control values based on the widget's internal state.
   * This allows for changes in frequency/region/etc which may conflict
   * with previous settings to be propagated back to the ui.
   */
  function update_controls() {
    if (!cbl_instance) { // already inited
      return
    }

    const area = cbl_instance.get_area();
    if (!!area) {
      if (area['area_type'] === 'state') {
        $('#state').val(area['area_id']);
        $('#county').val('');
        $('#other_areas').val('');
      } else if (area['area_type'] === 'county') {
        $('#county').val(area['area_id']);
        $('#state').val(area['state']);
        $('#other_areas').val('');
      } else if (area['area_type'] === 'island') {
        $('#other_areas').val(area['area_id']);
        $('#county').val('');
        $('#state').val('');
      }
    }
    update_frequency_options(!!area ? area['area_id'] : null, cbl_instance.options['frequency'], cbl_instance.options['timeperiod']);
    update_variable_options(cbl_instance.options['frequency'], !!area ? area['area_id'] : null, cbl_instance.options['variable']);
  }

  /**
   * Create the widget instance
   */
  function init_climate_by_location() {
    if (!!cbl_instance) { // already inited
      return
    }
    cbl_instance = new ClimateByLocationWidget($('div#widget')[0], {
      'font': 'Roboto',
      'frequency': $('#frequency').val(),
      'timeperiod': $('#timeperiod').val(),
      // 'presentation': $('#presentation').val(), // deprecated
      'area_id': $('#other_areas').val() || $('#county').val() || $('#state').val(),
      'variable': $('#variable').val(),
      'scenario': $('#scenario').val(),
      'xrangefunc': function (min, max) {
        // Force the slider thumbs to adjust to the appropriate place
        $("#slider-range").slider("option", "values", [min, max]);
      },
      'pmedian': true,
      'hmedian': true
    });
  }


  function update_variable_options(frequency = null, area_id = null, variable = null) {

    ClimateByLocationWidget.when_variables(frequency || $('#frequency').val(), null, area_id || $('#county').val() || $('#state').val()).then((variables) => {
      $("select#variable").empty();
      $(variables.map(v => (`<option value="${v.id}">${v.title}</option>`)).join("")).appendTo($("select#variable"));
      if (!!variable) {
        $("select#variable").val(variable)
      }
    });
  }

  function update_frequency_options(area_id, frequency = null, timeperiod) {
    ClimateByLocationWidget.when_frequencies(area_id).then((frequencies) => {
      $("select#frequency").empty();
      $(frequencies.map(v => (`<option value="${v.id}">${v.title}</option>`)).join("")).appendTo($("select#frequency"));
      if (!!frequency) {
        $("select#frequency").val(frequency)
      }
      if (!!timeperiod) {
        $("select#timeperiod").val(timeperiod)
      }

      frequency = $('#frequency').val();
      if (frequency === "annual") {
        $('#timeperiod-wrapper').hide();
        $('#slider-range').show();
        $('#x-axis-pan-note').hide();
        // $('#download_hist_mod_data_li').show();
        // $('#presentation-wrapper').show(); // deprecated
      }
      if (frequency === "monthly") {
        $('#timeperiod-wrapper').show();
        $('#slider-range').hide();
        $('#x-axis-pan-note').show();
        // $('#download_hist_mod_data_li').hide();
        // $('#presentation-wrapper').hide();  // deprecated
      }
      if (frequency === "seasonal") {
        $('#timeperiod-wrapper').show();
        $('#slider-range').hide();
        $('#x-axis-pan-note').show();
        // $('#download_hist_mod_data_li').hide();
        // $('#presentation-wrapper').hide(); // deprecated
      }
    });
  }

  //load initial options for frequency and variable
  update_frequency_options();
  update_variable_options();

  function update_county_options() {
    return ClimateByLocationWidget.when_areas('county', $('#state').val()).then((state_counties) => {
      let $el = $("#county");
      $el.empty();
      $el.append($('<option value=""  selected></option>'));
      state_counties.forEach(function (area) {
        $el.append($("<option></option>")
            .attr("value", area['area_id']).text(area['area_label']));
      });
    });
  }

  $('#county').change(() => {
    if ($('#county').val() === '') {
      return;
    }

    if (!cbl_instance) {
      init_climate_by_location();
    } else {
      cbl_instance.set_options({
        area_id: $('#county').val()
      });
    }
    update_controls();
  });


  $('#other_areas').change(() => {
    if ($('#other_areas').val() === '') {
      return;
    }

    if (!cbl_instance) {
      init_climate_by_location();
    } else {
      cbl_instance.set_options({
        area_id: $('#other_areas').val()
      });
    }
    update_controls();
  });

  ClimateByLocationWidget.when_areas().then((areas) => {
    $("#countysearch").autocomplete({
      source: areas.map((area) => ({label: area.area_label, value: area.area_id})),
      select: function (event, ui) {
        const area = ClimateByLocationWidget.get_areas(null, null, ui.item.value)
        if (area['area_type'] === 'state') {
          $('#state option[value="' + area['area_id'] + '"]').prop('selected', 'selected');
          update_county_options()
        } else if (area['area_type'] === 'county') {
          $('#state option[value="' + area['state'] + '"]').prop('selected', 'selected');
          update_county_options().then(() => {
            $('#county option[value="' + area['area_id'] + '"]').prop('selected', 'selected');
          });
        } else if (area['area_type'] === 'island') {
          $('#state option[value=""]').prop('selected', 'selected');
          $('#other_areas option[value="' + area['area_id'] + '"]').prop('selected', 'selected');
        }
        init_climate_by_location();
      }
    });
  });

  ClimateByLocationWidget.when_areas('island').then((areas) => {
    areas.forEach((area) => {
      $('#other_areas').append(`<option value="${area['area_id']}">${area['area_label']}</option>`)
    });
  });

  $('#state').change(function () {
    if ($('#state').val() === '') {
      return;
    }
    update_county_options();

    if (!cbl_instance) {
      init_climate_by_location();
    } else {
      cbl_instance.set_options({
        area_id: $('#state').val()
      });
    }
    update_controls();
  });

  $('#frequency').change(function () {
    if (!cbl_instance) {
      return;
    }
    cbl_instance.set_options({
      frequency: $('#frequency').val(),
      variable: $('#variable').val()
    });
    update_controls();
  });

// deprecated
// $('#presentation').change(function () {
//   if (cbl_instance) {
//     cbl_instance.set_options({presentation: $('#presentation').val()});
//   }
// });


  $('#timeperiod').change(function () {
    if (!cbl_instance) {
      return;
    }
    cbl_instance.set_options({
      timeperiod: $('#timeperiod').val()
    });
    update_controls();
  });

  $('#variable').change(() => {
    if (!cbl_instance) {
      return;
    }
    cbl_instance.set_options({
      variable: $('#variable').val()
    });
    update_controls();
  });
  $('#histmod, #histobs').change(() => {
    if (!cbl_instance) {
      return;
    }
    cbl_instance.set_options({
      histobs: $('#histobs').prop('checked'),
      histmod: $('#histmod').prop('checked')
    });
    update_controls();
  });

  $('#rcp85, #rcp45').change(() => {
    if (!cbl_instance) {
      return;
    }
    let scenario;
    if ($('#rcp85').prop('checked')) {
      if ($('#rcp45').prop('checked')) {
        scenario = 'both';
      } else {
        scenario = 'rcp85';
      }
    } else if ($('#rcp45').prop('checked')) {
      scenario = 'rcp45';
    } else {
      scenario = '';
    }
    cbl_instance.set_options({
      scenario: scenario
    });
    update_controls();
  });
  $('#download-button').click(function () {
    if (!cbl_instance) {
      return;
    }
    $('#download-panel').removeClass("hidden");
  });

  $('#download-dismiss-button').click(function () {
    $('#download-panel').addClass("hidden");
  });

// download hooks
  $('#download-image-link').click(function (e) {
    if (!cbl_instance) {
      return;
    }
    cbl_instance.download_image(this)
  });
  $('#download_hist_obs_data').click(function (e) {
    if (!cbl_instance) {
      return;
    }
    if (!cbl_instance.download_hist_obs_data(this)) {
      e.stopPropagation()
      $('#download_error').text('There is no historical observed data available for the current selection.').show(200)
      window.setTimeout(()=>{
        $('#download_error').hide(750)
      }, 3000)
    }
  });
  $('#download_hist_mod_data').click(function (e) {
    if (!cbl_instance) {
      return;
    }
    if (!cbl_instance.download_hist_mod_data(this)) {
      e.stopPropagation()
      $('#download_error').text('There is no historical modeled data available for the current selection.').show()
      window.setTimeout(()=>{
        $('#download_error').hide()
      }, 3000)
    }
  });
  $('#download_proj_mod_data').click(function (e) {
    if (!cbl_instance) {
      return;
    }
    if (!cbl_instance.download_proj_mod_data(this)) {
      e.stopPropagation()
      $('#download_error').text('There is no projected modeled data available for the current selection.').show()
      window.setTimeout(()=>{
        $('#download_error').hide()
      }, 3000)
    }
  });


  $("#slider-range").slider({
    range: true,
    min: 1950,
    max: 2099,
    values: [1950, 2099],
    slide: function (event, ui) {
      // return the return value returned by set_x_axis_range, to keep
      // the slider thumb(s) from moving into a disallowed range
      return cbl_instance.set_x_axis_range(ui.values[0], ui.values[1]);
    }
  });


  WebFont.load({
    google: {
      families: ['Pacifico', 'Roboto']
    }
  });


})
;
