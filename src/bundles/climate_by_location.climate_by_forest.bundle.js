/**
 * Modules and customizations bundled for Climate Explorer
 */

import ClimateByLocationWidget from "../main.js";

import ConusMonthView from "../views/conus_month.js";
import ConusYearView from "../views/conus_year.js";
import { is_usfs_forest_area, is_usfs_forest_ecoregion_area} from "../utils.js";

export class ClimateByLocationCBF extends ClimateByLocationWidget {
  get_view_class() {
    if (!!this.options.area_id && !!this.options.variable && !!this.options.frequency) {
      if (this.options.frequency === "annual") {
       if (is_usfs_forest_area(this.options.area_id) || is_usfs_forest_ecoregion_area(this.options.area_id)) {
          return ConusYearView
        }
      }
      if (this.options.frequency === "monthly") {
        if( is_usfs_forest_area(this.options.area_id) || is_usfs_forest_ecoregion_area(this.options.area_id)) {
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

if (typeof window.ClimateByLocationWidget === "undefined") {
  window.ClimateByLocationWidget = ClimateByLocationCBF;
}

export default ClimateByLocationCBF
