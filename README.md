# Climate Widget (Climate in Your Location) Library

This library defines functions that can create and manage interactive climate
widget graphs.

## Prerequisite

This library depends on jQuery. You should make sure that a copy of jQuery has
been loaded in your page before including any of the `<script>` tags below.

## Installation

To use this library, include the following two script tag in your HTML file (after
loading jQuery):

```html
<script src="climate-widget-graph.js"></script>
```

Both of these `.js` files are included in the project, and they are the only two
files from the project that are needed 

// This file defines the single global name "climate_widget" which has the following
// functions:
// 
//   climate_widget.graph(OPTIONS)
//     Creates a graph according to OPTIONS, which should be an object with some or
//     all of the following properties:
//       {
//         div           : a string which is a CSS-style selector identifying a div
//                         where the graph should be drawn; this div must already
//                         be layed out and sized by the browser --- the graph will
//                         exactly fill the div. Required.
//         dataprefix    : A URL from which the data can be downloaded.  Required.
//         fips          : a 5-character fips code of a US county, as a string.  Required.
//         variable      : the id of the variable to display; see climate_widget.variables()
//                         below for a way to get a list of variable ids.  Optional; defaults
//                         to "tasmax".
//         frequency     : One of the strings "annual", "monthly", or "seasonal", indicating which
//                         type of data to display.  Optional; defaults to "annual".
//         scenario      : One of the strings "rcp45", "rcp85", or "both", indicating which
//                         scenario(s) to display for projection data.  Optional; defaults to "both".
//         presentation  : One of the strings "absolute" or "anomaly", indicating which
//                         presentation should be used in setting the graph's y axis scale.   Only
//                         relevant for annual data; ignored for monthly or seasonal. Optional;
//                         defaults to "absolute".
//         timeperiod    : One of the strings "2025", "2050", or "2075" (strings not numbers!),
//                         indicating which 30-year period of projection data to show for
//                         monthly or seasonal data.  Ignored for annual data.  Optional;
//                         defaults to "2025".
//         font          : A string giving the font-family to be used for all text in the graph.
//                         Optional; defaults to the browser's default canvas font (depends on
//                         the browser).



This directory contains the file `climate-widget-graph.js` which
defines the function `climate_widget_graph()` for displaying a climate
widget graph in an arbitrary DOM element.

The file demo.html is a sample web page (and associated embedded JavaScript code)
that illustrates how to use the function.  You should be able to view that file
in your browser to see the code in action.  Also see the comments in that file
for more detailed instructions.

Note that the data for the graphs is currently hosted at the location
http://climate-widget.nemac.org; this is a temporary hosting
arrangement for use during development only.  Ultimately, the data
will be hosted on climate.gov along with the widget itself.  When
deploying to climate.gov, we can reconfigure the graph code to access
the data from the new location; for now, the default location of
http://climate-widget.nemac.org is hard-wired into the code.

