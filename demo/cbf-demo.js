export default ({env="prod", versions})=>`
<!doctype html>
<html class="no-js" lang="en-us">
<head>
  <meta charset="utf-8">
  <title>Climate by Forest</title>
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
  <script src="https://cdnjs.cloudflare.com/ajax/libs/plotly.js/1.54.7/plotly-basic.min.js" integrity="sha512-uWFGQaJgmsVg6uyMv7wQ9W0fvlqsK3cRIs/mVMc5Tox68S74OjdZI6Va/Pkc1+fLh6uh+fP8oO8My9n1AgWIAA==" crossorigin="anonymous"></script>
  <script src="vendor/jstat.min.js"></script>
  ${env === 'prod' ? `<script src="climate_by_location.climate_by_location.bundle.js"></script>`:`
   <script type="module" src="src/bundles/climate_by_location.climate_by_location.bundle.js"></script>
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
     <!-- <div class="row">
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
          </select>
        </div>
      </div>
      <div class="row">
        <label for="other_areas">Island states and territories</label>
        <select name="" id="other_areas" class="u-full-width">
          <option value="" selected></option>
        </select> 
      </div>-->
      <div class="row">
        <!--<div class="eight columns" style="min-width: 6rem;">-->
        <label for="forest">National Forest</label>
        <select id="forest" class="u-full-width">
          <option value="" selected></option>
          <option value="allegheny_national_forest">Allegheny National Forest</option>
          <option value="angeles_national_forest">Angeles National Forest</option>
          <option value="apache-sitgreaves_national_forests">Apache-Sitgreaves National Forests</option>
          <option value="arapaho_and_roosevelt_national_forests">Arapaho and Roosevelt National Forests</option>
          <option value="ashley_national_forest">Ashley National Forest</option>
          <option value="beaverhead-deerlodge_national_forest">Beaverhead-Deerlodge National Forest</option>
          <option value="bighorn_national_forest">Bighorn National Forest</option>
          <option value="bitterroot_national_forest">Bitterroot National Forest</option>
          <option value="black_hills_national_forest">Black Hills National Forest</option>
          <option value="boise_national_forest">Boise National Forest</option>
          <option value="bridger-teton_national_forest">Bridger-Teton National Forest</option>
          <option value="caribou-targhee_national_forest">Caribou-Targhee National Forest</option>
          <option value="carson_national_forest">Carson National Forest</option>
          <option value="chattahoochee-oconee_national_forests">Chattahoochee-Oconee National Forests</option>
          <option value="chequamegon-nicolet_national_forest">Chequamegon-Nicolet National Forest</option>
          <option value="cherokee_national_forest">Cherokee National Forest</option>
          <option value="chippewa_national_forest">Chippewa National Forest</option>
          <option value="cibola_national_forest">Cibola National Forest</option>
          <option value="cleveland_national_forest">Cleveland National Forest</option>
          <option value="coconino_national_forest">Coconino National Forest</option>
          <option value="columbia_river_gorge_national_scenic_area">Columbia River Gorge National Scenic Area</option>
          <option value="colville_national_forest">Colville National Forest</option>
          <option value="coronado_national_forest">Coronado National Forest</option>
          <option value="custer_national_forest">Custer National Forest</option>
          <option value="dakota_prairie_grasslands">Dakota Prairie Grasslands</option>
          <option value="daniel_boone_national_forest">Daniel Boone National Forest</option>
          <option value="deschutes_national_forest">Deschutes National Forest</option>
          <option value="dixie_national_forest">Dixie National Forest</option>
          <option value="eldorado_national_forest">Eldorado National Forest</option>
          <option value="fishlake_national_forest">Fishlake National Forest</option>
          <option value="flathead_national_forest">Flathead National Forest</option>
          <option value="francis_marion_and_sumter_national_forests">Francis Marion and Sumter National Forests</option>
          <option value="fremont-winema_national_forests">Fremont-Winema National Forests</option>
          <option value="gallatin_national_forest">Gallatin National Forest</option>
          <option value="george_washington_and_jefferson_national_forest">George Washington and Jefferson National Forest</option>
          <option value="gifford_pinchot_national_forest">Gifford Pinchot National Forest</option>
          <option value="gila_national_forest">Gila National Forest</option>
          <option value="grand_mesa,_uncompahgre_and_gunnison_national_forests">Grand Mesa, Uncompahgre and Gunnison National Forests</option>
          <option value="green_mountain_and_finger_lakes_national_forests">Green Mountain and Finger Lakes National Forests</option>
          <option value="helena_national_forest">Helena National Forest</option>
          <option value="hiawatha_national_forest">Hiawatha National Forest</option>
          <option value="hoosier_national_forest">Hoosier National Forest</option>
          <option value="humboldt-toiyabe_national_forest">Humboldt-Toiyabe National Forest</option>
          <option value="huron-manistee_national_forest">Huron-Manistee National Forest</option>
          <option value="idaho_panhandle_national_forests">Idaho Panhandle National Forests</option>
          <option value="inyo_national_forest">Inyo National Forest</option>
          <option value="kaibab_national_forest">Kaibab National Forest</option>
          <option value="kisatchie_national_forest">Kisatchie National Forest</option>
          <option value="klamath_national_forest">Klamath National Forest</option>
          <option value="kootenai_national_forest">Kootenai National Forest</option>
          <option value="lake_tahoe_basin_management_unit">Lake Tahoe Basin Management Unit</option>
          <option value="land_between_the_lakes">Land Between the Lakes</option>
          <option value="lassen_national_forest">Lassen National Forest</option>
          <option value="lewis_and_clark_national_forest">Lewis and Clark National Forest</option>
          <option value="lincoln_national_forest">Lincoln National Forest</option>
          <option value="lolo_national_forest">Lolo National Forest</option>
          <option value="los_padres_national_forest">Los Padres National Forest</option>
          <option value="malheur_national_forest">Malheur National Forest</option>
          <option value="manti-lasal_national_forest">Manti-Lasal National Forest</option>
          <option value="mark_twain_national_forest">Mark Twain National Forest</option>
          <option value="medicine_bow-routt_national_forest">Medicine Bow-Routt National Forest</option>
          <option value="mendocino_national_forest">Mendocino National Forest</option>
          <option value="midewin_national_tallgrass_prairie">Midewin National Tallgrass Prairie</option>
          <option value="modoc_national_forest">Modoc National Forest</option>
          <option value="monongahela_national_forest">Monongahela National Forest</option>
          <option value="mt_baker-snoqualmie_national_forest">Mt Baker-Snoqualmie National Forest</option>
          <option value="mt._hood_national_forest">Mt. Hood National Forest</option>
          <option value="national_forests_in_alabama">National Forests in Alabama</option>
          <option value="national_forests_in_florida">National Forests in Florida</option>
          <option value="national_forests_in_mississippi">National Forests in Mississippi</option>
          <option value="national_forests_in_north_carolina">National Forests in North Carolina</option>
          <option value="national_forests_in_texas">National Forests in Texas</option>
          <option value="nebraska_national_forest">Nebraska National Forest</option>
          <option value="nez_perce-clearwater_national_forest">Nez Perce-Clearwater National Forest</option>
          <option value="ochoco_national_forest">Ochoco National Forest</option>
          <option value="okanogan-wenatchee_national_forest">Okanogan-Wenatchee National Forest</option>
          <option value="olympic_national_forest">Olympic National Forest</option>
          <option value="ottawa_national_forest">Ottawa National Forest</option>
          <option value="ouachita_national_forest">Ouachita National Forest</option>
          <option value="ozark-st._francis_national_forest">Ozark-St. Francis National Forest</option>
          <option value="payette_national_forest">Payette National Forest</option>
          <option value="pike_and_san_isabel_national_forests">Pike and San Isabel National Forests</option>
          <option value="plumas_national_forest">Plumas National Forest</option>
          <option value="prescott_national_forest">Prescott National Forest</option>
          <option value="rio_grande_national_forest">Rio Grande National Forest</option>
          <option value="rogue_river-siskiyou_national_forests">Rogue River-Siskiyou National Forests</option>
          <option value="salmon-challis_national_forest">Salmon-Challis National Forest</option>
          <option value="san_bernardino_national_forest">San Bernardino National Forest</option>
          <option value="san_juan_national_forest">San Juan National Forest</option>
          <option value="santa_fe_national_forest">Santa Fe National Forest</option>
          <option value="savannah_river_site">Savannah River Site</option>
          <option value="sawtooth_national_forest">Sawtooth National Forest</option>
          <option value="sequoia_national_forest">Sequoia National Forest</option>
          <option value="shasta-trinity_national_forest">Shasta-Trinity National Forest</option>
          <option value="shawnee_national_forest">Shawnee National Forest</option>
          <option value="shoshone_national_forest">Shoshone National Forest</option>
          <option value="sierra_national_forest">Sierra National Forest</option>
          <option value="siuslaw_national_forest">Siuslaw National Forest</option>
          <option value="six_rivers_national_forest">Six Rivers National Forest</option>
          <option value="stanislaus_national_forest">Stanislaus National Forest</option>
          <option value="superior_national_forest">Superior National Forest</option>
          <option value="tahoe_national_forest">Tahoe National Forest</option>
          <option value="tonto_national_forest">Tonto National Forest</option>
          <option value="uinta-wasatch-cache_national_forest">Uinta-Wasatch-Cache National Forest</option>
          <option value="umatilla_national_forest">Umatilla National Forest</option>
          <option value="umpqua_national_forest">Umpqua National Forest</option>
          <option value="wallowa-whitman_national_forest">Wallowa-Whitman National Forest</option>
          <option value="wayne_national_forest">Wayne National Forest</option>
          <option value="white_mountain_national_forest">White Mountain National Forest</option>
          <option value="white_river_national_forest">White River National Forest</option>
          <option value="willamette_national_forest">Willamette National Forest</option>
        </select>
        <!--</div>-->
      </div>
      <div class="row">
        <!--<div class="eight columns" style="min-width: 6rem;">-->
        <label for="ecoregion">Ecoregion</label>
        <select id="ecoregion" class="u-full-width">
          <option value="" selected></option>
        </select>
        <!--</div>-->
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
  <div class="outlinebox" style="flex-basis: 70%; flex-shrink:1; border-top-right-radius: 0; overflow: hidden; padding: 2rem;">
  <a href="https://docs.google.com/forms/d/e/1FAIpQLSf7LYXmzRVvSJngjZHQ0rQRTJ1PIInCSw3ud5q2mAg7JDrqlA/viewform" target="_blank" rel="noopener" title="Submit feedback" class="feedback-button" aria-label="Submit feedback"><i class="fa fa-comment"></i></a>
    <div id="areasearch_container">
      <div style="width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <div style="max-width:100%;">
            <h3>Please enter an ecoregion name to begin</h3>
            <input id="areasearch" type="search" placeholder="Southern Blue Ridge Mountains" style="width:40em; max-width: 100%;">
            <p style="margin-top: 1em;">This interactive graph shows modeled RCP 8.5 and RCP 4.5 data for forest ecoregions.<br> Downscaled modeled data: LOCA. Historical observed data: Livneh.</p>
          </div>
        </div>
    </div>
    <div id="widget" style="display: none">
      

    </div>

    <div id="slider-range"></div>
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
        <a id="download_significance_report-button" class="btn" title="Download statistical significance report (annual only)">
          <i class="fa fa-balance-scale" style="color: #555;" aria-label="Download statistical significance report (annual only)"></i></a>
        <button class="btn" id="download-button" title="Download Data"><i
            class="fa fa-download"
            aria-label="Download Data"></i></button>
        <a id="download-image-link" class="btn" title="Download Image"><i class="fa fa-picture-o" aria-label="Download Image"></i></a>
      </div>

    </div>
  </div>
</div>
<div id="download-panel" class="hidden">
  <div class="download-inner">
    <p>Use the following links to download this graph's data:</p>
    <ul id="download-list">
      
    </ul>
    <div id="download_error" class="error" style="display: none; color: red; font-size: 1.2em; margin:1rem 0;"></div>
    <div class="center">
      <button id="download-dismiss-button">Dismiss</button>
    </div>
  </div>
</div>

<a href="https://github.com/nemac/climate-by-location" target="_blank" class="github-corner" aria-label="View source on GitHub" style="position: absolute; top: 0; border: 0; right: 0; pointer-events: none"><svg width="80" height="80" viewBox="0 0 250 250" style="fill:#151513; color:#fff;" aria-hidden="true" pointer-events="none"><path pointer-events="all" d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path  d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg></a><style>.github-corner:hover .octo-arm{animation:octocat-wave 560ms ease-in-out}@keyframes octocat-wave{0%,100%{transform:rotate(0)}20%,60%{transform:rotate(-25deg)}40%,80%{transform:rotate(10deg)}}@media (max-width:500px){.github-corner:hover .octo-arm{animation:none}.github-corner .octo-arm{animation:octocat-wave 560ms ease-in-out}}</style>

<script >
if ((new URL(window.location)).hostname === 'climate-by-location.nemac.org'){
  if (new URL(window.location).pathname.replace(/[/]/g,'') === ''){
    document.querySelector('#version_select').style.display = 'inline-block';
  } else{
    document.querySelector('#latest_version_button').style.display = 'inline-flex';
  }
}
</script>

<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-5SS6C1PS3D"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-5SS6C1PS3D');
</script>

</body>
</html>
`;