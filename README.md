# Climate By Location (formerly Climate Widget Graph)

This library defines functions that create and manage interactive climate graphs.

## Powered by ACIS
This module relies on the dataservices provided by the [Applied Climate Information System (ACIS)](http://www.rcc-acis.org/index.html).

## Dependencies

This library depends on jQuery 3.2+ and jQuery UI 1.12+ being loaded prior to `climate-widget-graph.js`. Using an older version of jQuery can result in unpredictable outputs.

## Installation
1. Load dependencies using the versions shown below(feel free to skip duplicate jquery dependencies):

    ```html
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.css" integrity="sha256-rByPlHULObEjJ6XQxW/flG2r+22R5dKiAoef+aXWfik=" crossorigin="anonymous"/>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.js" integrity="sha256-T0Vest3yCU7pafRw9r+settMBX6JkKN06dqBnpQ8d30=" crossorigin="anonymous"></script>
    ```

2. Load the widget:

    ```html
    <script src="climate-widget-graph.js"></script>
    ```

3.  Call the widget with desired options on a container element:
   
   	```javascript
   	$("#widget-div").climate_by_location({
      'county': '13005', // A 5-character fips code of a US county, as a string.  Required if `state` not specified.
      'state': null, // A 2-character state abbreviation code of a US state, as a string.  Required if `county` not specified. 
      'variable': 'tmax', // The id of the variable to display; see climate_widget.variables() below for a way to get a list of variable ids.  Optional; defaults to "tmax".
      'scenario': 'both', //  One of the strings "rcp45", "rcp85", or "both", indicating which scenario(s) to display for projection data.  Optional; defaults to "both".
      'frequency': 'annual', // One of the strings "annual", "monthly", or "seasonal", indicating which type of data to display.  Optional; defaults to "annual".
      'timeperiod': '2025', //One of the strings "2025", "2050", or "2075" (strings not numbers!), indicating which 30-year period of projection data to show for monthly or seasonal data.  Ignored for annual data.
      'pmedian': true, // true or false, indicating whether to show the median line(s) for model projection data 
      'hmedian': true, // true or false, indicating whether to show the median line(s) for annual historical model data (applies to annual data only; there is no historical model data for monthly or seasonal data)
      'histobs': true, // true or false, indicating whether to show historical observed data
      'histmod': true, // true or false, indicating whether to show annual historical model data (applies to annual data only; there is no historical model data for monthly or seasonal data) 
      'yzoom': true, // true or false, indicating whether to allow the user to zoom along the graph's y-axis; 
      'font': 'roboto', // A string giving the font-family to be used for all text in the graph.
      'xrangefunc': null, // Callback for when the user changes the scale on the horizontal annual data axis (horizontal scale changes are not allowed in the monthly or seasonal graphs).  This function will receive two arguments, which are the new minimum and maximum values along the axis. 
      'presentation': 'absolute', // "absolute" or "anomaly" views.
      'dataprefix': 'http://climate-widget-data.nemac.org/data' // The api endpoint from which to request data.
      });
    ```

4. Update options by calling the widget on the same container again with the new parameters:

    ```js
        $("#widget-div").climate_by_location({'county':'13077'});
    ```


For a more complete example, see the files `index.html` and `demo.js` in this
directory.

### Widget Methods

#### `$("#widget-div").climate_by_location("get_variables",  frequency)`

This method returns an array of the ids and titles of all the climate variables for
the given frequency; frequency should be one of the strings "annual",
"monthly", or "seasonal".

#### `download_image(anchor_el)` 
 
  This function that the containing application may call in its click-event-handling code for an `<a>` element, in order to modify that `<a>` element so that clicking on it will download the current canvas image. The first argument should be the `<a>` element to modify.
        
  For example:

  ```javascript
  $('a#download-image-link-id').click(function() {
      // cwg is the object returned by the climate_widget.graph constructor
      if (cwg) { // ensure widget exists
        cwg.download_image(this);
      }
      // note that the 'this' argument is important as this function modifies
      // the <a> tag
  });
  ```
    
#### `download_hist_obs_data(anchor_el)`, `download_hist_mod_data(anchor_el)`, and `download_proj_mod_data(anchor_el)`
 
  These functions modify an `<a>` element with data urls for the time series data that drives the graph. These functions behave the same as `download_image`. Note that monthly/seasonal presentations do not use historical modeled data, so calling `download_hist_mod_data` will do nothing.   
      
#### `setXRange(min, max)`
 
 This function will set the range of data visible on the graph's x-axis when an annual data graph is displayed (monthly and seasonal data graphs have fixed x-axes).  It takes two arguments, which are the desired minimum and maximum values for the axis. Returns either true or false, depending on whether the specified range is allowed according to whatever pan and/or zoom limits have been specified for the axis:  if the specified range is allowed, the axis is adjusted and true is returned; if the specified range is not allowed, the axis is unchanged and false is returned.
      
#### `resize()`
 This function will cause the graph to resize itself to fit the `<div>` that contains it; you can call this function to adjust the size of the graph if the `<div>` changes size after the graph has been displayed. `resize` takes no arguments; just call it like `cwg.resize()` and the graph will adjust to fit its container.

#### Variables

Depending on the current frequency these variables may be available:

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


