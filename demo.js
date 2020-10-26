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
    update_frequency_options(!!area ? area['area_id'] : null, cbl_instance.options['frequency'], cbl_instance.options['monthly_timeperiod']);
    update_variable_options(cbl_instance.options['frequency'], !!area ? area['area_id'] : null, cbl_instance.options['variable']);

    // update the slider when the chart range changes
    $(cbl_instance.element).on('x_axis_range_change', (e) => {
      update_year_slider(e.detail[0], e.detail[1], e.detail[2], e.detail[3])
    });
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
      'monthly_timeperiod': $('#timeperiod').val(),
      'area_id': $('#other_areas').val() || $('#county').val() || $('#state').val(),
      'variable': $('#variable').val(),
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

  function update_frequency_options(area_id, frequency = null, monthly_timeperiod) {
    ClimateByLocationWidget.when_frequencies(area_id).then((frequencies) => {
      $("select#frequency").empty();
      $(frequencies.map(v => (`<option value="${v.id}">${v.title}</option>`)).join("")).appendTo($("select#frequency"));
      if (!!frequency) {
        $("select#frequency").val(frequency)
      }
      if (!!monthly_timeperiod) {
        $("select#timeperiod").val(monthly_timeperiod)
      }

      frequency = $('#frequency').val();
      if (frequency === "annual") {
        $('#timeperiod-wrapper').hide();
        $('#slider-range').show();
      }
      if (frequency === "monthly") {
        $('#timeperiod-wrapper').show();
        $('#slider-range').hide();
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
      if ($('#state').val() !== '') {
        $('#state').trigger('change')
      }
      return;
    }

    if (!cbl_instance) {
      init_climate_by_location();
    } else {
      cbl_instance.update({
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
      cbl_instance.update({
        area_id: $('#other_areas').val()
      });
    }
    update_controls();
  });

  ClimateByLocationWidget.when_areas().then((areas) => {
    $("#countysearch").autocomplete({
      source: areas.map((area) => ({label: area.area_label, value: area.area_id})),
      select: function (event, ui) {
        const area = ClimateByLocationWidget.find_area(null, null, ui.item.value);
        if (area['area_type'] === 'state') {
          $('#state option[value="' + area['area_id'] + '"]').prop('selected', 'selected');
          update_county_options()
          init_climate_by_location();
        } else if (area['area_type'] === 'county') {
          $('#state option[value="' + area['state'] + '"]').prop('selected', 'selected');
          update_county_options().then(() => {
            $('#county option[value="' + area['area_id'] + '"]').prop('selected', 'selected');
            init_climate_by_location();
          });
        } else if (area['area_type'] === 'island') {
          $('#state option[value=""]').prop('selected', 'selected');
          $('#other_areas option[value="' + area['area_id'] + '"]').prop('selected', 'selected');
          init_climate_by_location();
        }
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
      cbl_instance.update({
        area_id: $('#state').val()
      });
    }
    update_controls();
  });

  $('#frequency').change(function () {
    if (!cbl_instance) {
      return;
    }
    cbl_instance.update({
      frequency: $('#frequency').val(),
      variable: $('#variable').val()
    });
    update_controls();
  });


  $('#timeperiod').change(function () {
    if (!cbl_instance) {
      return;
    }
    cbl_instance.update({
      monthly_timeperiod: $('#timeperiod').val()
    });
    update_controls();
  });

  $('#variable').change(() => {
    if (!cbl_instance) {
      return;
    }
    cbl_instance.update({
      variable: $('#variable').val()
    });
    update_controls();
  });
  $('#histmod, #histobs, #rcp85, #rcp45').change(() => {
    if (!cbl_instance) {
      return;
    }
    cbl_instance.update({
      show_historical_observed: $('#histobs').prop('checked'),
      show_historical_modeled: $('#histmod').prop('checked'),
      show_projected_rcp45: $('#rcp45').prop('checked'),
      show_projected_rcp85: $('#rcp85').prop('checked')
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
    cbl_instance.download_image();
    e.preventDefault();
  });
  $('#download_hist_obs_data').click(function (e) {
    if (!cbl_instance) {
      return;
    }
    if (!cbl_instance.download_hist_obs_data(this)) {
      e.preventDefault()
      $('#download_error').text('There is no historical observed data available for the current selection.').show(200)
      window.setTimeout(() => {
        $('#download_error').hide(750)
      }, 3000)
    }
  });
  $('#download_hist_mod_data').click(function (e) {
    if (!cbl_instance) {
      return;
    }
    if (!cbl_instance.download_hist_mod_data(this)) {
      e.preventDefault()
      $('#download_error').text('There is no historical modeled data available for the current selection.').show()
      window.setTimeout(() => {
        $('#download_error').hide()
      }, 3000)
    }
  });
  $('#download_proj_mod_data').click(function (e) {
    if (!cbl_instance) {
      return;
    }
    if (!cbl_instance.download_proj_mod_data(this)) {
      e.preventDefault()
      $('#download_error').text('There is no projected modeled data available for the current selection.').show()
      window.setTimeout(() => {
        $('#download_error').hide()
      }, 3000)
    }
  });


  function update_year_slider(min = 1950, max = 2099, current_min = 1950, current_max = 2099) {
    $("#slider-range").slider({
      range: true,
      min: min,
      max: max,
      values: [current_min, current_max],
      slide: function (event, ui) {
        // return the return value returned by set_x_axis_range, to keep
        // the slider thumb(s) from moving into a disallowed range
        return cbl_instance.set_x_axis_range(ui.values[0], ui.values[1]);
      }
    });
  }

  // init slider defaults
  update_year_slider();


})
;
