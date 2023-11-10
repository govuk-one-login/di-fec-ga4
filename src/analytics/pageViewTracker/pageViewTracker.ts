import { BaseTracker } from "../baseTracker/baseTracker";
import { PageViewParametersInterface } from "./pageViewTracker.interface";

export class PageViewTracker extends BaseTracker {
  eventName: string = "page_view_ga4";

  constructor() {
    super();
  }

  trackOnPageLoad(parameters: PageViewParametersInterface): void {
    console.log("running trackOnPageLoad");
    this.pushToDataLayer({
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
    });
  }
}
