import { BaseTracker } from "../baseTracker/baseTracker";
import {
  PageViewParametersInterface,
  PageViewEventInterface,
} from "./pageViewTracker.interface";

export class PageViewTracker extends BaseTracker {
  eventName: string = "page_view_ga4";

  constructor() {
    super();
  }

  /**
   * Tracks the page load event and sends the relevant data to the data layer.
   *
   * @param {PageViewParametersInterface} parameters - The parameters for the page view event.
   * @return {boolean} Returns true if the event was successfully tracked, false otherwise.
   */
  trackOnPageLoad(parameters: PageViewParametersInterface): boolean {
    console.log("running trackOnPageLoad");
    const pageViewTrackerEvent: PageViewEventInterface = {
      event: this.eventName,
      page_view: {
        language: this.getLanguage(),
        location: this.getLocation(),
        organisations: this.organisations,
        primary_publishing_organisation: this.primary_publishing_organisation,
        referrer: this.getReferrer(),
        status_code: parameters.statusCode.toString(),
        title: parameters.englishPageTitle,
        taxonomy_level1: parameters.taxonomy_level1,
        taxonomy_level2: parameters.taxonomy_level2,
      },
    };

    try {
      this.pushToDataLayer(pageViewTrackerEvent);
      return true;
    } catch (err) {
      console.error("Error in trackOnPageLoad", err);
      return false;
    }
  }
}
