/**
 * Modules and customizations bundled for Climate Explorer
 */

import ClimateByLocationWidget from "../main.js";

import ConusDecadeView from "../views/conus_decade.js";
import AlaskaYearView from "../views/alaska_year.js";
import IslandMonthView from "../views/island_month.js";
import ConusMonthView from "../views/conus_month.js";
import {is_ak_area, is_conus_area, is_island_area} from "../utils.js";
import IslandDecadeView from "../views/island_decade.js";

class ClimateByLocationWidgetCE extends ClimateByLocationWidget {
  get_view_class() {
    if (!!this.options.area_id && !!this.options.variable && !!this.options.frequency) {
      if (this.options.frequency === "annual") {
        if (is_ak_area(this.options.area_id)) {
          return AlaskaYearView;
        } else if (is_island_area(this.options.area_id)) {
            return IslandDecadeView;
        } else if (is_conus_area(this.options.area_id)) {
            return ConusDecadeView;
        }
      }
      if (this.options.frequency === "monthly") {
        if (is_ak_area(this.options.area_id)) {
          // do nothing
        } else if (is_island_area(this.options.area_id)) {
          return IslandMonthView
        } else if (is_conus_area(this.options.area_id)) {
          return ConusMonthView
        }
      }
    }
    throw new Error('Invalid Climate By Location configuration! No view matches the current configuration.')
  }

  /**
   * Options which force re-evaluation of which view class should be used and request that view to fully update.
   * @return {string[]}
   * @private
   */
  get _view_selection_option_names(){
    return ['frequency','area_id','variable','monthly_timeperiod']
  }
}

export default ClimateByLocationWidgetCE

if (typeof window.ClimateByLocationWidget === "undefined"){
  window.ClimateByLocationWidget = ClimateByLocationWidgetCE
}