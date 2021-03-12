/**
 * A base class for CBL views
 */
export default class View{
  constructor(parent, element) {
    this.parent = parent;
    this.element = element;
    this._download_callbacks = {};
  }

  /**
   * Prompt the view to update itself, requesting data and creating dom elements as needed.
   * @return {Promise<void>}
   */
  async request_update(){}
  /**
   * Prompt the view to update its styles, without requesting data or creating dom elements.
   * @return {Promise<void>}
   */
  async request_style_update(){}

  /**
   * Get the list of data that can be downloaded in the view.
   * @return {Promise<array<object>>}
   */
  async request_downloads(){
    return []
  }

  /**
   * Clean up any data, dom nodes, etc.
   */
  destroy(){

  }

  /**
   * Options which force re-evaluation of which traces are visible within the current view.
   * @return {string[]}
   * @private
   */
  get style_option_names(){
    return [
      'show_projected_rcp45',
      'show_projected_rcp85',
      'show_historical_observed',
      'show_historical_modeled',
    ]
  }


}