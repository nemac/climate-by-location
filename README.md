# Climate Widget (Climate in Your Location) Graph Library

This library defines functions that create and manage interactive climate
widget graphs.

## Prerequisite

This library depends on jQuery. You should make sure that a copy of jQuery has
been loaded in your page before including the `<script>` tag below.

## Installation

To use this library, include the following script tag in your HTML file (after
loading jQuery):

```html
<script src="climate-widget-graph.js"></script>
```

The file `climate-widget-graph.js` is included in this project, in the top-level
directory, and is the only file that is needed for deployment; all other files
in this directory are only used in development, or for examples or documentation.

## Usage

The file `climate-widget-graph.js` defines the single global name "climate_widget"
which has the following function properties:

### `climate_widget.graph(OPTIONS)`

This function creates a graph according to `OPTIONS`, which should be an object with some or
all of the following properties:

  * `div`

    a string which is a CSS-style selector identifying a div
    where the graph should be drawn; this div must already
    be layed out and sized by the browser --- the graph will
    exactly fill the div. Required.

  * `dataprefix`

    A URL from which the data can be downloaded.  Required.

  * `fips`

    A 5-character fips code of a US county, as a string.  Required.

  * `variable`

    The id of the variable to display; see climate_widget.variables()
    below for a way to get a list of variable ids.  Optional; defaults
    to "tasmax".

  * `frequency`

    One of the strings "annual", "monthly", or "seasonal", indicating which
    type of data to display.  Optional; defaults to "annual".

  * `scenario`

    One of the strings "rcp45", "rcp85", or "both", indicating which
    scenario(s) to display for projection data.  Optional; defaults to "both".

  * `presentation`

    One of the strings "absolute" or "anomaly", indicating which
    presentation should be used in setting the graph's y axis scale.   Only
    relevant for annual data; ignored for monthly or seasonal. Optional;
    defaults to "absolute".

  * `timeperiod`

    One of the strings "2025", "2050", or "2075" (strings not numbers!),
    indicating which 30-year period of projection data to show for
    monthly or seasonal data.  Ignored for annual data.  Optional;
    defaults to "2025".

  * `prange`

    One of the strings "minmax", "p1090", or "both", indicating which
    range band to show for model projection data.

  * `hrange`

    One of the strings "minmax", "p1090", or "both", indicating which
    range band to show for model historical data.

  * `pmedian`

    true or false, indicating whether to show the median line(s) for
    model projection data

  * `hmedian`

    true or false, indicating whether to show the median line(s) for
    annual historical model data (applies to annual data only; there
    is no historical model data for monthly or seasonal data)

  * `histobs`
  
    true or false, indicating whether to show historical observed data

  * `histmod`
  
    true or false, indicating whether to show annual historical model data
    (applies to annual data only; there is no historical model data for
    monthly or seasonal data)

  * `yzoom`

    true or false, indicating whether to allow the user to zoom along
    the graph's y-axis; defaults to true

  * `ypan`

    true or false, indicating whether to allow the user to pan along
    the graph's y-axis; defaults to true

  * `font`

    A string giving the font-family to be used for all text in the graph.
    Optional; defaults to the browser's default canvas font (depends on
    the browser).
    
  * `xrangefunc`
  
    A function to be called whenever the user changes the scale on the
    horizontal annual data axis (horizontal scale changes are not allowed in the
    monthly or seasonal graphs).  This function will receive two arguments,
    which are the new minimum and maximum values along the axis.

The `climate_widget.graph()` function returns an object which
represents the graph just created.  This object has three properties:

   1. `update` is a function that can be used to modify the graph. The `update()`
      function takes an OPTIONS object with the same properties described above
      for `climate_widget.graph()`, except that the `div` setting cannot be changed
      once a graph has been created.

   2. `dataurls` is a function that returns an object with the urls for the time
      series data that drives the graph. The object may have up to three keys:

      `hist_obs` for historical observed data

      `hist_mod` for historical modeled data

      `proj_mod` for projected modeled data

      Note that not all presentations use all datasets, so there may be graphs
      that when `dataurls()` is called do not return an object with all three keys.

   3. `downloadImage` is a function that the contaiming application may call
      in its click-event-handling code for an `<a>` element, in order to modify that
      `<a>` element so that clicking on it will download the current canvas image.
      The `downloadImage` function takes two arguments.  The first argument
      should be the `<a>` element -- i.e. it should be the value of `this` inside
      the click-event-handler function for an `<a>` tag.  The second argument
      gives the name that will be used for the downloaded file.
      
      For example:

      ```javascript
      $('a#download-image-link-id').click(function() {
          // cwg is the object returned by the climate_widget.graph constructor
          cwg.downloadImage(this, 'nameOfDownloadedImage.png');
          // note that the 'this' argument is important as this function modifies
          // the <a> tag
      });
      ```
      
   4. `setXRange` is a function that will set the range of data visible on the
      graph's x-axis when an annual data graph is displayed (monthly and seasonal
      data graphs have fixed x-axes).  It takes two arguments, which are the
      desired minimum and maximum values for the axis.  `setXRange` returns either
      true or false, depending on whether the specified range is allowed according
      to whatever pan and/or zoom limits have been specified for the axis:  if
      the specified range is allowed, the axis is adjusted and true is returned;
      if the specified range is not allowed, the axis is unchanged and false is
      returned.
      
   5. `resize` is a function that will cause the graph to resize itself to fit
      the `<div>` that contains it; you can call this function to adjust the size
      of the graph if the `<div>` changes size after the graph has been displayed.
      `resize` takes no arguments; just call it like `cwg.resize()` and the
      graph will adjust to fit its container.

### `climate_widget.variables(FREQUENCY)`

The function `climate_widget.variables(FREQUENCY)` will return an
array giving the ids and the titles of all the climate variables for
the given frequency; FREQUENCY should be one of the strings "annual",
"monthly", or "seasonal".

## Examples

The following will create a graph in the div with id "widget", showing
annual average daily minimum temperature for Buncombe county NC, showing
the rcp85 scenario for the projection data:

```javascript
var cwg = climate_widget.graph({
    div        : "div#widget",
    dataprefix : "http://climate-widget-data.nemac.org/data",
    font       : "Roboto",
    frequency  : "annual",
    fips       : "37021",
    variable   : "tasmin",
    scenario   : "rcp85"
});
```

The following will modify the above graph to show both the rcp45 and rcp85
scenarios:

```javascript
cwg.update({
    scenario : "both"
});
```

The following will modify the above graph to show annual average daily precipitation:

```javascript
cwg.update({
    variable : "pr"
});
```

For a more complete example, see the files `demo.html` and `demo.js` in this
directory.
