import logger from "loglevel";
import { BaseTracker } from "../baseTracker/baseTracker";
import {
  PageViewParametersInterface,
  PageViewEventInterface,
} from "./pageViewTracker.interface";
import { validateParameter } from "../../utils/validateParameter";
import { FormErrorTracker } from "../formErrorTracker/formErrorTracker";
import { OptionsInterface } from "../core/core.interface";

export class PageViewTracker extends BaseTracker {
  eventName: string = "page_view_ga4";
  enableGa4Tracking: boolean;
  enableFormErrorTracking: boolean;
  enablePageViewTracking: boolean;

  constructor(options: OptionsInterface) {
    super();
    this.enableGa4Tracking = options.enableGa4Tracking ?? false;
    this.enableFormErrorTracking = options.enableFormErrorTracking ?? true;
    this.enablePageViewTracking = options.enablePageViewTracking ?? true;
  }

  /**
   * Tracks the page load event and sends the relevant data to the data layer.
   *
   * @param {PageViewParametersInterface} parameters - The parameters for the page view event.
   * @return {boolean} Returns true if the event was successfully tracked, false otherwise.
   */
  trackOnPageLoad(parameters: PageViewParametersInterface): boolean {
    if (
      window.DI.analyticsGa4.cookie.hasCookie &&
      !window.DI.analyticsGa4.cookie.consent
    ) {
      return false;
    }
    if (!this.enableGa4Tracking) {
      return false;
    }

    // trigger form error tracking if pageView is enabled
    const errorTrigger = document.getElementsByClassName("govuk-error-message");

    if (errorTrigger.length) {
      if (this.enableFormErrorTracking) {
        const formErrorTracker = new FormErrorTracker();
        formErrorTracker.trackFormError();
      }
      return false;
    }

    if (!this.enablePageViewTracking) {
      return false;
    }

    // check for persisted taxonomies
    let taxonomyLevel2: string = parameters.taxonomy_level2;
    if (taxonomyLevel2 === "persisted from previous page") {
      taxonomyLevel2 = localStorage.getItem("taxonomyLevel2")!;
    } else {
      // if taxonomy is not "persisted from...", then store this into localStorage
      localStorage.setItem("taxonomyLevel2", taxonomyLevel2);
    }

    const pageViewTrackerEvent: PageViewEventInterface = {
      event: this.eventName,
      page_view: {
        language: BaseTracker.getLanguage(),
        location: BaseTracker.getLocation(),
        organisations: this.organisations,
        primary_publishing_organisation: this.primary_publishing_organisation,
        referrer: BaseTracker.getReferrer(),
        status_code: validateParameter(parameters.statusCode.toString(), 3),
        title: validateParameter(parameters.englishPageTitle, 300),
        taxonomy_level1: validateParameter(parameters.taxonomy_level1, 100),
        taxonomy_level2: validateParameter(taxonomyLevel2, 100),
        content_id: validateParameter(parameters.content_id, 100),
        logged_in_status: PageViewTracker.getLoggedInStatus(
          parameters.logged_in_status,
        ),
        dynamic: parameters.dynamic.toString(),
        first_published_at: PageViewTracker.getFirstPublishedAt(),
        updated_at: PageViewTracker.getUpdatedAt(),
        relying_party: PageViewTracker.getRelyingParty(),
      },
    };

    try {
      BaseTracker.pushToDataLayer(pageViewTrackerEvent);
      return true;
    } catch (err) {
      logger.error("Error in trackOnPageLoad", err);
      return false;
    }
  }

  /**
   * Returns a string representing the logged in status.
   *
   * @param {boolean} loggedInStatus - The logged in status.
   * @return {string} The string representation of the logged in status.
   */
  static getLoggedInStatus(loggedInStatus: boolean | undefined): string {
    if (loggedInStatus === undefined) {
      return "undefined";
    }

    return loggedInStatus ? "logged in" : "logged out";
  }

  /**
   * Returns the value of the 'govuk:first-published-at' meta tag attribute, if it exists.
   *
   * @return {string} The value of the 'govuk:first-published-at' meta tag attribute, or "undefined" if it does not exist.
   */
  static getFirstPublishedAt(): string {
    return (
      document
        .querySelector('meta[name="govuk:first-published-at"]')
        ?.getAttribute("content") ?? "undefined"
    );
  }

  /**
   * Retrieves the value of the 'govuk:updated-at' meta tag attribute from the document.
   *
   * @return {string} The value of the 'govuk:updated-at' meta tag attribute, or "undefined" if it is not found.
   */
  static getUpdatedAt(): string {
    return (
      document
        .querySelector('meta[name="govuk:updated-at"]')
        ?.getAttribute("content") ?? "undefined"
    );
  }

  /**
   * Returns the hostname of the current document location.
   *
   * @return {string} The hostname of the current document location.
   */
  static getRelyingParty(): string {
    return document.location.hostname;
  }
}
