export default ({env="prod", versions})=>`
<!doctype html>
<html class="no-js" lang="en-us">
<head>
  <meta charset="utf-8">
  <title>Climate by Location</title>
  <!-- demo dependencies, not required for the widget itself. -->
  <link rel="stylesheet" href="vendor/skeleton.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.css"
        integrity="sha256-uHu2MAd1LvCOVEAhvMld4LpJi7dUGS7GVzvG/5B3hlo=" crossorigin="anonymous"/>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"
          integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.css"
        integrity="sha256-rByPlHULObEjJ6XQxW/flG2r+22R5dKiAoef+aXWfik=" crossorigin="anonymous"/>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.js"
          integrity="sha256-T0Vest3yCU7pafRw9r+settMBX6JkKN06dqBnpQ8d30=" crossorigin="anonymous"></script>
  <link rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/jquery-autocomplete/1.0.7/jquery.auto-complete.min.css"
        integrity="sha256-MFTTStFZmJT7CqZBPyRVaJtI2P9ovNBbwmr0/KErfEc=" crossorigin="anonymous"/>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-autocomplete/1.0.7/jquery.auto-complete.min.js"
          integrity="sha256-zs4Ql/EnwyWVY+mTbGS2WIMLdfYGtQOhkeUtOawKZVY=" crossorigin="anonymous"></script>
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
  <link rel="stylesheet" href="demo.css">
  <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/core-js/2.6.11/core.min.js" integrity="sha512-TfdDRAa9DmMqSYW/UwWmezKavKBwQO1Ek/JKDTnh7dLdU3kAw31zUS2rtl6ulgvGJWkMEPaR5Heu5nA/Aqb49g==" crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/plotly.js/1.58.4/plotly-basic.min.js" integrity="sha512-7S1p+6A2VVIWu+EevZqeqXWos1Tn+mroZxpkZ9THWipecJkL7TLg2myv5cIAShu9j3+fjHyCvEh/d7BKegMY1g==" crossorigin="anonymous"></script>
  <script >
  window.climate_by_location_config = {areas_json_url:'/ce_areas.json'}
</script>
  ${env === 'prod' ? `<script src="climate_by_location.climate_explorer.bundle.js"></script>`:`
   <script type="module" src="src/bundles/climate_by_location.climate_explorer.bundle.js"></script>
  `}
  <script src="demo.js"></script>
</head>
<body>
<!--[if IE]>
    <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience and security. <button onclick="$('.browserupgrade').remove()"></button></p>
<![endif]-->
<p class="browserupgrade" style="display: none">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience and security. <button onclick="$('.browserupgrade').remove()">&times;</button></p>
<div class="content">
  <div class="outlinebox" style="flex-basis: 30%; flex-shrink: 0;">
    <div style="position: relative;">
    <button id="reset_btn" style="position: absolute;top: 0;left: 0;background:none;width: 1em;height: 1em;border: none;display: block;margin: 0;padding: 0;" title="Reset options"><i class="fa fa-sm fa-refresh" style="
"></i></button>
      <h1>Climate by Location
       <span id="latest_version_button" style="display:none; text-align: left; flex-flow: column; vertical-align: top;"><span style="font-size: 1.5rem;font-family: serif;">(${versions[0]})</span><a style="font-size: 1.6rem;margin: 0.4rem; margin-left: 1.4rem;" href="https://climate-by-location.nemac.org/"><i class="fa fa-arrow-left fa-sm" style="margin-right: 0.5rem"></i>Latest</a></span><select id="version_select" style="display: none; margin-left: 1rem; padding: 0.1rem 0.2rem; font-size: 1.5rem; font-family: serif; max-width: 10rem; border:none;" title="Select a previous version of the tool" onchange="!!this.value && (window.location.href = this.value);"><option value="/archive/${versions[0]}/">${versions[0]} (latest)</option>${versions.slice(1).map((version)=>`<option value="/archive/${version}/">${version}</option>`).join('')}</select>
      </h1>
    </div>
    <form onsubmit="return false;">
      <div class="row">
        <div class="four columns" style="min-width: 6rem;">
          <label for="state">State</label>
          <select id="state" class="u-full-width">
            <option value="" selected></option>
            <option value="AL">AL</option>
            <option value="AK">AK</option>
            <option value="AZ">AZ</option>
            <option value="AR">AR</option>
            <option value="CA">CA</option>
            <option value="CO">CO</option>
            <option value="CT">CT</option>
            <option value="DE">DE</option>
            <option value="FL">FL</option>
            <option value="GA">GA</option>
            <option value="HI" disabled title="See options in &quot;Island states and territories&quot;">HI</option>
            <option value="ID">ID</option>
            <option value="IL">IL</option>
            <option value="IN">IN</option>
            <option value="IA">IA</option>
            <option value="KS">KS</option>
            <option value="KY">KY</option>
            <option value="LA">LA</option>
            <option value="ME">ME</option>
            <option value="MD">MD</option>
            <option value="MA">MA</option>
            <option value="MI">MI</option>
            <option value="MN">MN</option>
            <option value="MS">MS</option>
            <option value="MO">MO</option>
            <option value="MT">MT</option>
            <option value="NE">NE</option>
            <option value="NV">NV</option>
            <option value="NH">NH</option>
            <option value="NJ">NJ</option>
            <option value="NM">NM</option>
            <option value="NY">NY</option>
            <option value="NC">NC</option>
            <option value="ND">ND</option>
            <option value="OH">OH</option>
            <option value="OK">OK</option>
            <option value="OR">OR</option>
            <option value="PA">PA</option>
            <option value="RI">RI</option>
            <option value="SC">SC</option>
            <option value="SD">SD</option>
            <option value="TN">TN</option>
            <option value="TX">TX</option>
            <option value="UT">UT</option>
            <option value="VT">VT</option>
            <option value="VA">VA</option>
            <option value="WA">WA</option>
            <option value="WV">WV</option>
            <option value="WI">WI</option>
            <option value="WY">WY</option>
          </select>

        </div>
        <div class="eight columns" style="min-width: 15rem;">
          <label for="county">County</label>
          <select id="county" class="u-full-width">
            <option value="" selected></option>
            <!--
             <option value="37021" selected="selected">Buncombe County, NC</option>
             <option value="41003">Benton County, OR</option>
             <option value="04027">Yuma County, AZ</option>
             <option value="53009">Clallam County, WA</option>
             <option value="27077">Lake of the Woods County, MN</option>
             <option value="30009">Lewis and Clark County, MT</option>
            -->
          </select>
        </div>
      </div>
      <div class="row">
        <label for="other_areas">Island states and territories</label>
        <select name="" id="other_areas" class="u-full-width">
          <option value="" selected></option>
        </select>
      </div>
      <div class="row">
        <label for="variable">Variable</label>
        <select id="variable" class="u-full-width">
        </select>
      </div>
      <div class="row">
        <label for="frequency">Frequency</label>
        <select id="frequency" class="u-full-width">
          <option value="annual" selected="selected">Annual</option>
          <option value="monthly">Monthly</option>
          <option value="seasonal">Seasonal</option>
        </select>
      </div>
      <!--        deprecated
                  <div class="row" id="presentation-wrapper">
                      <label for="presentation">Presentation</label>
                      <select id="presentation" class="u-full-width">
                          <option value="absolute" selected="selected">Absolute</option>
                          <option value="anomaly">Anomaly</option>
                      </select>
                  </div>-->
      <div class="row hidden" id="timeperiod-wrapper">
        <label for="timeperiod">Time Period</label>
        <select id="timeperiod" class="u-full-width">
          <option value="2025" selected="selected">30 Years Centered on 2025</option>
          <option value="2050">30 Years Centered on 2050</option>
          <option value="2075">30 Years Centered on 2075</option>
        </select>
      </div>
    </form>
    <a href="https://nemacfernleaf.com/" class="nemac-logo" target="_blank"><img src="https://nemacfernleaf.com/resources/images/NF_logo.png" alt="NEMAC+Fernleaf"></a>
  </div>
  <div class="outlinebox" style="flex-basis: 70%; flex-shrink:1;">
    <div id="areasearch_container">
      <div style="width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <div>
            <h3>Please enter a state or county to begin</h3>
            <input id="areasearch" type="search" placeholder="Autauga County, AL" style="width:30em;">
            <p style="margin-top: 1em;">This interactive graph shows modeled RCP 8.5 and RCP 4.5 data for your
              county.</p>
          </div>
        </div>
    </div>
    <div id="widget" style="display: none">
    </div>
    <div class="buttons-wrapper">
      <input type="checkbox" name="histmod" id="histmod" checked>
      <label for="histmod" class="btn" style="background-color: #d3d3d3;"><i class="fa fa-area-chart" aria-hidden="true"></i>Modeled History</label>
      <input type="checkbox" name="histobs" id="histobs" checked>
      <label for="histobs" class="btn" style="background-color: #ffffff;"><i class="fa fa-bar-chart" aria-hidden="true"></i>Observed History</label>
      <input type="checkbox" name="rcp85" id="rcp85" checked>
      <label for="rcp85" class="btn"><i class="fa fa-area-chart" aria-hidden="true"></i>RCP 8.5</label>
      <input type="checkbox" name="rcp45" id="rcp45" checked>
      <label for="rcp45" class="btn"><i class="fa fa-area-chart" aria-hidden="true"></i>RCP 4.5</label>
<!--      <input type="checkbox" name="decadal" id="decadal">-->
<!--      <label for="decadal" class="btn">Decadal Avg</label>-->
<!--      <input type="checkbox" name="rolling" id="rolling">-->
<!--      <label for="rolling" class="btn"><input type="number" value="10" min="0" max="30" step="1" id="rolling_years" name="rolling_years">-yr Moving Avg</label>-->
      <div style="margin-left: auto; flex; display: flex; flex-direction: row;">
        <button class="btn" id="download-button" title="Download Data"><i
            class="fa fa-download"
            aria-label="Download Data"></i></button>
        <button class="btn"><a id="download-image-link" title="Download Image"><i class=" fa fa-picture-o"
                                                                                  aria-label="Download Image"></i></a>
        </button>
      </div>

    </div>
  </div>
</div>
<div id="download-panel" class="hidden">
  <div class="download-inner">
    <p>Use the following links to download this graph's data:</p>
    <ul>
      <li><a href="" id="download_hist_obs_data">Observed Data</a></li>
      <li id="download_hist_mod_data_li"><a href="" id="download_hist_mod_data">Historical Modeled Data</a></li>
      <li><a href="" id="download_proj_mod_data">Projected Modeled Data</a></li>
    </ul>
    <div id="download_error" class="error" style="display: none; color: red; font-size: 1.2em; margin:1rem 0;"></div>
    <div class="center">
      <button id="download-dismiss-button">Dismiss</button>
    </div>
  </div>
</div>

<a href="https://github.com/nemac/climate-by-location" target="_blank" class="github-corner" aria-label="View source on GitHub" style="position: absolute; top: 0; border: 0; right: 0; pointer-events: none"><svg width="55" height="55" viewBox="0 0 250 250" style="fill:#151513; color:#fff;" aria-hidden="true" pointer-events="none"><path pointer-events="all" d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path  d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg></a><style>.github-corner:hover .octo-arm{animation:octocat-wave 560ms ease-in-out}@keyframes octocat-wave{0%,100%{transform:rotate(0)}20%,60%{transform:rotate(-25deg)}40%,80%{transform:rotate(10deg)}}@media (max-width:500px){.github-corner:hover .octo-arm{animation:none}.github-corner .octo-arm{animation:octocat-wave 560ms ease-in-out}}</style>

<script >
if ((new URL(window.location)).hostname === 'climate-by-location.nemac.org'){
  if (new URL(window.location).pathname.replace(/[/]/g,'') === ''){
    document.querySelector('#version_select').style.display = 'inline-block';
  } else{
    document.querySelector('#latest_version_button').style.display = 'inline-flex';
  }
}
</script>

</body>
</html>
`;