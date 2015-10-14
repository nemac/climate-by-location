# Climate Widget
Climate Widget is a jQuery UI Widget that can be declared on a div that in turn creates a Climate Widget data graph.

## Dependencies
- jQuery
- jQuery UI

## Use
The minified script needs to be included after jQuery and jQuery UI.

The only public interface is provided on construction that takes a single argument:

```javascript
$('#divId').climateWidget({
  'fips': COUNTY_FIPS_CODE,
  'variable': VARIABLE_NAME,
  'dataDir': DATA_PATH_BASE_URL // (optional override)
});
```

*VARIABLE_NAME* should be one of the following:
- "US_Counties_cooling_degree_day_cmip5"
- "US_Counties_heating_degree_day_cmip5"
- "US_Counties_days_prcp_abv_cmip5"
- "US_Counties_days_tmax_abv_cmip5"
- "US_Counties_days_tmin_blw_cmip5"
- "US_Counties_growing_degree_day_cmip5"
- "US_Counties_growing_season_lngth_cmip5"
- "US_Counties_longest_run_prcp_blw_cmip5"
- "US_Counties_longest_run_tmax_abv_cmip5"

*COUNTY_FIPS_CODE* should be the 5-digit fips code of a US county, as a string. (Note that 4-digit fips codes should be left-padded with a 0 to make 5 digits.)

IMPORTANT: the speicfied div must have been previously inserted into the DOM and sized -- the graph will be sized to completely fill that div.  It is the responsibility of the caller to make sure that the div has a size before declaring the widget.
