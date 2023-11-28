import { BaseTracker } from "../baseTracker/baseTracker";
import {
  PageViewParametersInterface,
  PageViewEventInterface,
} from "./pageViewTracker.interface";
import { validateParameter } from "../../utils/validateParameter";

export class PageViewTracker extends BaseTracker {
  eventName: string = "page_view_ga4";
  disableGa4Tracking: boolean = false;
  constructor(options: { disableGa4Tracking?: boolean } = {}) {
    super();
    this.disableGa4Tracking = options.disableGa4Tracking || false;
  }

  /**
   * Tracks the page load event and sends the relevant data to the data layer.
   *
   * @param {PageViewParametersInterface} parameters - The parameters for the page view event.
   * @return {boolean} Returns true if the event was successfully tracked, false otherwise.
   */
  trackOnPageLoad(parameters: PageViewParametersInterface): boolean {
    if (this.disableGa4Tracking) {
      return false;
    }
    if (!window.DI.analyticsGa4.cookie.consent) {
      return false;
    }

    const pageViewTrackerEvent: PageViewEventInterface = {
      event: this.eventName,
      page_view: {
        language: this.getLanguage(),
        location: this.getLocation(),
        organisations: this.organisations,
        primary_publishing_organisation: this.primary_publishing_organisation,
        referrer: this.getReferrer(),
        status_code: validateParameter(parameters.statusCode.toString(), 3),
        title: validateParameter(parameters.englishPageTitle, 300),
        taxonomy_level1: validateParameter(parameters.taxonomy_level1, 100),
        taxonomy_level2: validateParameter(parameters.taxonomy_level2, 100),
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
