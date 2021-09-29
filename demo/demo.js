let cbl_instance = undefined;
/* global ClimateByLocationWidget, jQuery */
jQuery(document).ready(function ($) {


  /**
   * Update control values based on the widget's internal state.
   * This allows for changes in frequency/region/etc which may conflict
   * with previous settings to be propagated back to the ui.
   */
  function update_controls() {
    try {
      if (!cbl_instance) { // already inited
        return
      }

      const area = cbl_instance.get_area();
      if (!!area) {
        if (area['area_type'] === 'state') {
          $('#state').val(area['area_id']);
          $('#county').val('');
          $('#other_areas').val('');
          update_county_options();
        } else if (area['area_type'] === 'county') {
          if ($('#county option[value="' + area['area_id'] + '"').length < 1) {
            $('#county').append($("<option></option>")
              .attr("value", area['area_id']).text(area['area_label']));

          }
          $('#county').val(area['area_id']);
          $('#state').val(area['state']);
          $('#other_areas').val('');
          update_county_options(area['area_id']);
        } else if (area['area_type'] === 'forest') {
          $('#forest').val(area['area_id']);
          $('#county').val('');
          $('#other_areas').val('');
        } else if (area['area_type'] === 'ecoregion') {
          $('#ecoregion').val(area['area_id']);
          $('#forest').val(area['forests'][0]);
          $('#other_areas').val('');
        } else if (area['area_type'] === 'island') {
          $('#other_areas').val(area['area_id']);
          $('#state').val('');
          $('#county').val('');
          $('#forest').val('');
          $('#ecoregion').val('');
        }
      }
      update_frequency_options(!!area ? area['area_id'] : null,  cbl_instance.options['frequency'] || null, cbl_instance.options['monthly_timeperiod'] || null);
      update_variable_options(cbl_instance.options['frequency'], !!area ? area['area_id'] : null, cbl_instance.options['variable'] || null);
      if (cbl_instance) {
        // update the slider when the chart range changes
        $(cbl_instance.element).on('x_axis_range_change', (e) => {
          update_year_slider(e.detail[0], e.detail[1], e.detail[2], e.detail[3])
        });
      }
    } catch {
      // do nothing
    }
  }

  /**
   * Create the widget instance
   */
  function init_climate_by_location(area_id=null, frequency=null, monthly_timeperiod=null, variable=null) {

    $('#areasearch_container').hide()
    $('#widget').show()
    if (!!cbl_instance) { // already inited
      return
    }
    cbl_instance = new ClimateByLocationWidget($('div#widget')[0], {
      'font': 'Roboto',
      'frequency': frequency || $('#frequency').val(),
      'monthly_timeperiod': monthly_timeperiod || $('#timeperiod').val(),
      'area_id': area_id || $('#other_areas').val() || $('#county').val() || $('#state').val() || $('#ecoregion').val(),
      'variable':  variable || $('#variable').val(),
      'smaller_labels': false
    });
  }


  function update_variable_options(frequency = null, area_id = null, variable = null) {
    ClimateByLocationWidget.when_variables({
      frequency: frequency || $('#frequency').val(),
      unitsystem: null,
      area_id: area_id || $('#other_areas').val() || $('#county').val() || $('#state').val() || $('#ecoregion').val() || null
    }).then((variables) => {
      $("select#variable").empty();
      $(variables.map(v => (`<option value="${v.id}">${v.title}</option>`)).join("")).appendTo($("select#variable"));

      $("select#variable").val(!!variable ? variable : (variables.length > 0 ? variables[0].id : ''))
    });
  }

  function update_frequency_options(area_id = null, frequency = null, monthly_timeperiod = null) {
    if (!area_id) {
      $('#timeperiod-wrapper').hide();
      $('#slider-range').show();
    }

    ClimateByLocationWidget.when_frequencies(area_id).then((frequencies) => {
      $("select#frequency").empty();
      $(frequencies.map(v => (`<option value="${v.id}">${v.title}</option>`)).join("")).appendTo($("select#frequency"));
      $("select#frequency").val(!!frequency ? frequency : (frequencies.length > 0 ? frequencies[0].id : ''))
      if (!!monthly_timeperiod) {
        $("select#timeperiod").val(monthly_timeperiod)
      }

      frequency = $('#frequency').val();
      if (frequency === "annual") {
        $('#timeperiod-wrapper').hide();
        $('#slider-range').show();
        $('#download_significance_report-button').show()
        $('label[for="histmod"]').show()
      }
      if (frequency === "monthly") {
        $('#timeperiod-wrapper').show();
        $('#slider-range').hide();
        $('#download_significance_report-button').hide();
        $('label[for="histmod"]').hide()
      }
    });
  }

  //load initial options for frequency and variable
  update_frequency_options();
  update_variable_options();

  function update_county_options(area_id=null) {
    return ClimateByLocationWidget.when_areas({type: 'county', state: $('#state').val()}).then((state_counties) => {
      let $el = $("#county");
      $el.empty();
      $el.append($('<option value=""></option>'));
      state_counties.forEach(function (area) {
        $el.append($("<option></option>")
          .attr("value", area['area_id']).text(area['area_label']));
      });
      $el.val(area_id || '')
    });
  }

  function update_ecoregion_options() {
    return ClimateByLocationWidget.when_areas({type: 'ecoregion', forest: $('#forest').val()}).then((forest_ecoregions) => {
      let $el = $("#ecoregion");
      $el.empty();
      $el.append($('<option value=""  selected></option>'));
      forest_ecoregions.forEach(function (area) {
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

  $('#ecoregion').change(() => {
    if ($('#ecoregion').val() === '') {
      if ($('#forest').val() !== '') {
        $('#forest').trigger('change')
      }
      return;
    }

    if (!cbl_instance) {
      init_climate_by_location();
    } else {
      cbl_instance.update({
        area_id: $('#ecoregion').val()
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
    $("#areasearch").autocomplete({
      source: areas.map((area) => ({label: area.area_label, value: area.area_id})),
      select: function (event, ui) {
        const area = ClimateByLocationWidget.find_area( { area_id: ui.item.value});
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
        } else if (area['area_type'] === 'forest') {
          $('#forest option[value="' + area['area_id'] + '"]').prop('selected', 'selected');
          update_ecoregion_options()
          init_climate_by_location();
        } else if (area['area_type'] === 'ecoregion') {
          $('#forest option[value="' + area['forests'][0] + '"]').prop('selected', 'selected');
          update_ecoregion_options().then(() => {
            $('#ecoregion option[value="' + area['area_id'] + '"]').prop('selected', 'selected');
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

  ClimateByLocationWidget.when_areas( {type: 'island'}).then((areas) => {
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

  $('#forest').change(function () {
    if ($('#forest').val() === '') {
      return;
    }
    update_ecoregion_options();

    // if (!cbl_instance) {
    //   init_climate_by_location();
    // } else {
    //   cbl_instance.update({
    //     area_id: $('#forest').val()
    //   });
    // }
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
  $('#histmod, #histobs, #rcp85, #rcp45, #decadal, #rolling, #rolling_years').change(() => {
    if (!cbl_instance) {
      return;
    }
    cbl_instance.update({
      show_historical_observed: $('#histobs').prop('checked'),
      show_historical_modeled: $('#histmod').prop('checked'),
      show_projected_rcp45: $('#rcp45').prop('checked'),
      show_projected_rcp85: $('#rcp85').prop('checked'),
      show_decadal_means: $('#decadal').prop('checked'),
      show_rolling_window_means: $('#rolling').prop('checked'),
      rolling_window_mean_years: parseInt($('#rolling_years').val())
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
    cbl_instance.download_image().catch(()=>{
      $('#download_error').text('There is no chart image available for the current selection.').show()
      window.setTimeout(() => {
        $('#download_error').hide()
      }, 3000)
    });
    e.preventDefault();
  });
  $('#download_hist_obs_data').click(function (e) {
    if (!cbl_instance) {
      return;
    }
    e.preventDefault();
    cbl_instance.download_hist_obs_data().catch(()=>{
      $('#download_error').text('There is no historical observed data available for the current selection.').show(200)
      window.setTimeout(() => {
        $('#download_error').hide(750)
      }, 3000)
    });
  });
  $('#download_hist_mod_data').click(function (e) {
    if (!cbl_instance) {
      return;
    }
    e.preventDefault();
    cbl_instance.download_hist_mod_data().catch(()=>{
      $('#download_error').text('There is no historical modeled data available for the current selection.').show()
      window.setTimeout(() => {
        $('#download_error').hide()
      }, 3000)
    });
  });
  $('#download_proj_mod_data').click(function (e) {
    if (!cbl_instance) {
      return;
    }
    e.preventDefault();
    cbl_instance.download_proj_mod_data().catch(()=>{
      $('#download_error').text('There is no projected modeled data available for the current selection.').show()
      window.setTimeout(() => {
        $('#download_error').hide()
      }, 3000)
    });
  });

  $('#download_significance_report,#download_significance_report-button').click(function (e) {
    if (!cbl_instance) {
      return;
    }
    if (!cbl_instance.download_significance(this)) {
      e.preventDefault()
      $('#download_error').text('Failed to compute significance for the current parameters.').show()
      window.setTimeout(() => {
        $('#download_error').hide()
      }, 3000)
    }
  });


  $('#reset_btn').click(function (e) {
    $('#widget').hide();
    $('#areasearch_container').show();
    if (cbl_instance) {
      cbl_instance.destroy();
      cbl_instance = null;
    }
    update_variable_options();
    update_frequency_options();
    $('#state,#county,#other_areas').val('');
    window.history.pushState(null, window.title, new URL(window.location.href.replace(window.location.search, '')));
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


  Promise.allSettled([ClimateByLocationWidget.when_areas(), ClimateByLocationWidget.when_variables()]).then(
    () => {
      // reload state from url
      const url_params = new URL(window.location).searchParams;
      if (url_params && !cbl_instance && url_params.get('area_id') && url_params.get('variable')) {
        init_climate_by_location(url_params.get('area_id'), url_params.get('frequency'), url_params.get('monthly_timeperiod'), url_params.get('variable'))
        update_controls();
      }

      // queue up periodic saving of state to url
      setInterval(function () {
        if (cbl_instance) {
          const url = new URL(window.location);
          cbl_instance.options.area_id ? url.searchParams.set('area_id', cbl_instance.options.area_id) : url.searchParams.delete('area_id');
          cbl_instance.options.frequency ? url.searchParams.set('frequency', cbl_instance.options.frequency || '') : url.searchParams.delete('frequency');
          cbl_instance.options.variable ? url.searchParams.set('variable', cbl_instance.options.variable || '') : url.searchParams.delete('variable');
          cbl_instance.options.monthly_timeperiod && cbl_instance.options.frequency === 'monthly' ? url.searchParams.set('monthly_timeperiod', cbl_instance.options.monthly_timeperiod || '') : url.searchParams.delete('monthly_timeperiod');
          window.history.replaceState(null, window.title, url);
        }
      }, 750);

    }
  )


});
