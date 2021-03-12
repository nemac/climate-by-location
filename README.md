# Climate By Location

This library defines functions that create and manage interactive climate graphs. [View the demo at climate-by-location.nemac.org](climate-by-location.nemac.org)

## Powered by ACIS
This module relies on the data services provided by the [Applied Climate Information System (ACIS)](http://www.rcc-acis.org/index.html).

## Installation
1. Load the widget and dependencies:

```html
<link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/core-js/2.6.11/core.min.js" integrity="sha512-TfdDRAa9DmMqSYW/UwWmezKavKBwQO1Ek/JKDTnh7dLdU3kAw31zUS2rtl6ulgvGJWkMEPaR5Heu5nA/Aqb49g==" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/plotly.js/1.54.7/plotly-basic.min.js" integrity="sha512-uWFGQaJgmsVg6uyMv7wQ9W0fvlqsK3cRIs/mVMc5Tox68S74OjdZI6Va/Pkc1+fLh6uh+fP8oO8My9n1AgWIAA==" crossorigin="anonymous"></script>

<script src="climate-by-location.js"></script>
```

2.  Call the widget with desired options on a container element:
   
```javascript
   let cbl_instance = new ClimateByLocationWidget(my_element, {
        'area_id': '', // The id for the county, state, or other area to visualize. Use ClimateByLocationWidget.when_areas() to get available areas.
        'variable': 'tmax', // The id of the variable to display; see climate_widget.variables() below for a way to get a list of variable ids. Optional; defaults to "tmax".
        'frequency': 'annual', // One of the strings "annual" or "monthly", indicating which type of data to display. Optional; defaults to "annual".
        'monthly_timeperiod': '2025', //One of the strings "2025", "2050", or "2075", indicating which 30-year period of projection data to show for monthly or seasonal data. Ignored for annual data.
        'unitsystem': 'english', // Unit system to use for data presentation ("english", "metric")
        'show_legend': false, // Whether or not to show the built-in legend. Defaults to false.
        'show_historical_observed': true, // Whether or not to show historical observed data if available.
        'show_historical_modeled': true, // Whether or not to show historical modeled data if available.
        'show_projected_rcp45': true, // Whether or not to show projected modeled RCP4.5 data if available.
        'show_projected_rcp85': true, // Whether or not to show projected modeled RCP8.5 data if available.
        'responsive': true // Whether or not to listen to window resize events and auto-resize the graph. Can only be set on instantiation.
      });
```

4. Update options by calling `cbl_instance.set_options({some_option: new_value})`.
 
If some options conflicted, you can check for the resolution using `cbl_instance.options`
 
For a more complete example, see the files `index.html` and `demo.js` in this
directory.

### Widget Methods

#### `ClimateByLocationWidget.when_areas(area_type, state, area_id)` (static)

This method returns a promise which resolves with an array of objects like `{ "area_id": "37021", "area_type": "county", "area_label": "Buncombe County", "state": "NC" }`. For non-county areas the `state` value is not present. The `area_type` parameter may be one of 'county', 'state', or 'island', or null. The `state` parameter may be a two-letter state abbreviation, or none. The `area_id` parameter may be any single id for an area (useful when looking up labels / states for a specific area).

Note that HI is not available as a 'state' and is instead broken into two 'island' areas.

#### `ClimateByLocationWidget.when_variables(frequency, unitsystem, area_id)` (static)

This method returns a promise which resolves with an array of the ids and titles of all the climate variables for
the given frequency in the given region; `frequency` should be one of the strings 'annual',
'monthly', or 'seasonal', unitsystem should be "metric" or "english", and `area_id` should be an id from an area obtained via `ClimateByLocationWidget.when_areas()`.

#### `ClimateByLocationWidget.when_frequencies(area_id)` (static)

This method returns a promise which resolves with an array of the ids and titles of all frequencies ('annual, 'monthly', or 'seasonal') for the given area, as not all areas support all frequencies.

#### `cbl_instance.request_downloads()` (instance)
 
 This function returns a promise which resolves with an array of download options available for the current view. `download_item.when_data()` returns a promise which resolves with the data that may be downloaded, and `download_item.download()` attempts to have the browser initiate the download (may be blocked if not called within a click event handler).
 Example downloads:

```js
[
  {"label":"Observed Data",
    "icon":"bar-chart",
    "attribution":"ACIS: livneh",
    "filename":"Buncombe_County-annual-hist_obs-tmax.csv",
    "when_data": async ()=>{return 'CSV DATA'},
    "download": async ()=>{ when_data.then(doDownload) }
  },
  {
    "label":"Chart image",
    "icon":"picture-o",
    "attribution":"ACIS: Livneh & LOCA (CMIP 5)",
    "filename":"Buncombe_County-annual-tmax-graph.png",
    "when_data": async ()=>{return 'png blob'},
    "download": async ()=>{ when_data.then(doDownload) }
  }
]
```
      
#### `cbl_instance.set_x_axis_range(min, max)` (instance)
 
This function will set the range of data visible on the graph's x-axis without refreshing the rest of the graph. Note that "annual" and "monthly" have different ranges. 

Add a listener to `x_axis_range_change`
 
 #### `cbl_instance.set_y_axis_range(min, max)` (instance)
  
Same basic function as `set_x_axis_range`, except that 
      
#### `cbl_instance.resize()` (instance)
 This function will cause the graph to resize itself to fit the `<div>` that contains it; you can call this function to adjust the size of the graph if the `<div>` changes size after the graph has been displayed. `resize` takes no arguments; just call it like `cwg.resize()` and the graph will adjust to fit its container.

#### Variables

Depending on the current frequency and region these variables may be available:

| Variable            | Description                                              |
|:--------------------|:---------------------------------------------------------|
| tmax                | mean daily maximum temperature (°F)                      |
| tmin                | mean daily minimum temperature (°F)                      |
| days_tmax_gt_90f    | count of days with maximum temperature over 90°F (days)  |
| days_tmax_gt_95f    | count of days with maximum temperature over 95°F (days)  |
| days_tmax_gt_100f   | count of days with maximum temperature over 100°F (days) |
| days_tmax_gt_105f   | count of days with maximum temperature over 105°F (days) |
| days_tmax_lt_32f    | count of days with maximum temperature below 32°F (days) |
| days_tmin_lt_32f    | days with minimum temps below 32°F (days)                |
| days_tmin_gt_80f    | count of days with minimum temperature above 80°F (days) |
| days_tmin_gt_90f    | count of days with minimum temperature above 90°F (days) |
| hdd_65f             | days * degrees below 65°F (°F-days)                      |
| cdd_65f             | days * degrees above 65°F (°F-days)                      |
| gdd                 | growing degree days (°F-days)                            |
| gddmod              | modified growing degree days (°F-days)                   |
| days_dry_days       | dry days (days)                                          |
| pcpn                | total precipitation (inches)                             |
| days_pcpn_gt_1in    | days with more than 1 inch of precipitation (days)       |
| days_pcpn_gt_2in    | days with more than 2 inch of precipitation (days)       |
| days_pcpn_gt_3in    | days with more than 3 inch of precipitation (days)       |
| days_pcpn_gt_4in    | days with more than 4 inch of precipitation (days)       |

Note that outside the contiguous US, some of these variables may be shown differently according to the data or models available. For example, areas in Alaska will give a single red band showing the range of data from the GFDL-CM3 and NCAR-CCSM4 for RCP8.5.


## Changelog
(3.1.0):
- Refactored monolithic widget code into a more-modularized view-based structure.
- More hover label improvements for decadal views.
- Added better error handling when the given options result in an invalid state.
- Refactored various download methods (e.g. download_image, download_hist_obs_data, download_proj_mod_data, download_hist_mod_data) into a single function `request_downloads`. Old functions still exist, but are deprecated and now return Promise<void> instead of boolean.
- Now lazily-generating csv downloads (where previously they were being eagerly generated as soon as we had data).
- Added basic url parameters / state handling to the demo.
- Added new decadal-focused views for all area types. The decadal view is now the default.
- Merged features from Climate By Forest which generate statistical reports for departure from natural range of variation. This is disabled by for Climate Explorer versions of CBL at this time.
- Added alternate bundle for Climate By Forest (still a work in progress).
- Improved browser support for downloading CSVs.
- Fixed issue where monthly historical modeled data for islands could not be downloaded.
- Fixed issue where reloading the browser at the right time could result in invalid state.

(3.0.2):
- Added decadal means and rolling-window means for annual view (`options.show_decadal_means` and `options.show_rolling_window_means`)
- Improved hover tooltips to show decadal means (can be disabled using `options.hover_decadal_means = false`)
- Added version selector to demo page to organize past versions
- Moved island_data default directory to climate-by-location.nemac.org/island_data/ with plans to update in place instead of maintaining multiple copies
- Moved demo page code to a dedicated folder  

(3.0.1):
- Improved hover tooltips
- Fixed browser compatibility issue with static properties

(3.0.0):
- Replaced MultiGraph with [Plotly](https://plotly.com/javascript/)!
- Added support for built-in legend via `show_legend` (defaults to `false`).
- Added hover interactions to show values under mouse cursor!
- Removed dependency on jQuery. 
- Removed jQuery API.
- Added recommended dependency [core-js](https://github.com/zloirock/core-js) to provide more backwards compatibility with older browsers.
- Added new event `x_axis_range_change` to facilitate update range controls.
- Split option 'scenario' to two boolean options 'show_projected_rcp45' and 'show_projected_rcp85'.
- Renamed options for better readability : 'histobs' -> 'show_historical_observed', 'histmod'-> 'show_historical_modeled', 'timeperiod'->'monthly_timeperiod'
- Fixed an issue when downloading AK data where values from GFDL-CM3 and NCAR-CCSM4 were being conflated.
- Lots of code cleanup following the removal of jQuery and MultiGraph.

(2.3.0):
- Added support for island states and territories, in addition to CONUS and Alaska areas already supported.
- Added new `when_areas()` to facilitate listing of areas / area ids by type or (for counties) state. 
- Deprecated the `state` and `county` options. Use `area_id` instead.

(2.2.0) Dec 2019:
- Revamped API to use more ES6 / native JS.
- Deprecated the jQuery UI based API.
- Added new pattern for region-specific functionality.
- Added support for new Alaska variables.
- Fixed several state-breaking bugs around plot visibility.
- Added new pattern for resolving conflicting settings.
- Some preparations for a future change from multigraph to an alternate chart library.
- Renamed `climate-widget-graph.js` to `climate-by-location.js`.

(2.1.0) Jan 2019:
- Refactored to jQuery UI and somewhat modernized codebase

(1.X.X) 2015-2017