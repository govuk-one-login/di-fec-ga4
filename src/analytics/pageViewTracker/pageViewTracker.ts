import { BaseTracker } from "../baseTracker/baseTracker";
import {
  PageViewParametersInterface,
  PageViewEventInterface,
} from "./pageViewTracker.interface";
import { validateParameter } from "../../utils/validateParameter";
import { FormChangeTracker } from "../formChangeTracker/formChangeTracker";
import { FormErrorTracker } from "../formErrorTracker/formErrorTracker";

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

    if (
      window.DI.analyticsGa4.cookie.hasCookie &&
      !window.DI.analyticsGa4.cookie.consent
    ) {
      return false;
    }

    //trigger form error tracking
    const errorTrigger = document.getElementsByClassName("govuk-error-message");
    if (errorTrigger.length) {
      const formErrorTracker = new FormErrorTracker();
      formErrorTracker.trackFormError();
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
        content_id: validateParameter(parameters.content_id, 100),
        logged_in_status: this.getLoggedInStatus(parameters.logged_in_status),
        dynamic: parameters.dynamic.toString(),
        first_published_at: this.getFirstPublishedAt(),
        updated_at: this.getUpdatedAt(),
        relying_party: this.getRelyingParty(),
      },
    };

    //trigger form change tracking
    if (document.location.href.includes("edit=true")) {
      const formChangeTracker = new FormChangeTracker();
      formChangeTracker.trackFormChange();
    }

    try {
      this.pushToDataLayer(pageViewTrackerEvent);
      return true;
    } catch (err) {
      console.error("Error in trackOnPageLoad", err);
      return false;
    }
  }

  /**
   * Returns a string representing the logged in status.
   *
   * @param {boolean} loggedInStatus - The logged in status.
   * @return {string} The string representation of the logged in status.
   */
  getLoggedInStatus(loggedInStatus: boolean | undefined): string {
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
  getFirstPublishedAt(): string {
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
  getUpdatedAt(): string {
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
  getRelyingParty(): string {
    return document.location.hostname;
  }
}
