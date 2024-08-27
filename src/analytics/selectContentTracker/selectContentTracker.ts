import logger from "loglevel";
import { BaseTracker } from "../baseTracker/baseTracker";
import { SelectContentEventInterface } from "./selectContentTracker.interface";

export class SelectContentTracker extends BaseTracker {
  eventName: string = "select_content";
  eventType: string = "event_data";
  enableSelectContentTracking: boolean;

  constructor(enableSelectContentTracking: boolean) {
    super();
    this.enableSelectContentTracking = enableSelectContentTracking;
    this.initialiseEventListener();
  }

  /**
   * Initialises the event listener for the document click event.
   *
   * @param {type} None
   * @return {type} None
   */
  initialiseEventListener() {
    const detailsElements = document.querySelectorAll("details");
    detailsElements.forEach((detailsElement) => {
      detailsElement.addEventListener(
        "toggle",
        this.trackSelectContent.bind(this),
        false,
      );
    });
  }

  /**
   * Tracks the form response and sends the data to the analytics platform.
   *
   * @param {Event} event - The toggle event triggered by clicking on details element.
   * @return {boolean} Returns true if the event is successfully tracked, otherwise false.
   */
  trackSelectContent(event: Event): boolean {
    if (!window.DI.analyticsGa4.cookie.consent) {
      return false;
    }
    if (!this.enableSelectContentTracking) {
      return false;
    }

    const element: HTMLDetailsElement = event.target as HTMLDetailsElement;

    const SelectContentEvent: SelectContentEventInterface = {
      event: this.eventType,
      event_data: {
        event_name: "select_content",
        type: "details ui",
        url: "undefined",
        text: SelectContentTracker.getSummaryText(element),
        section: "undefined",
        action: SelectContentTracker.getActionValue(element),
        external: "undefined",
        link_domain: "undefined",
        "link_path_parts.1": "undefined",
        "link_path_parts.2": "undefined",
        "link_path_parts.3": "undefined",
        "link_path_parts.4": "undefined",
        "link_path_parts.5": "undefined",
      },
    };
    try {
      BaseTracker.pushToDataLayer(SelectContentEvent);
      return true;
    } catch (err) {
      logger.error("Error in trackSelectContent", err);
      return false;
    }
  }

  /**
   * Retrieves the text of span inside details element with class of govuk-details__summary-text .
   *
   * @param {HTMLDetailsElement} element - The details element being toggled.
   * @return {string} The text content of the span inside details element.
   */
  static getSummaryText(element: HTMLDetailsElement): string {
    return (
      element
        ?.querySelector(".govuk-details__summary-text")
        ?.textContent?.trim() || "undefined"
    );
  }

  /**
   * Returns the state of the details element.
   *
   * @param {HTMLDetailsElement} element - The details element being toggled.
   * @return {string} State of details element: "open", "closed".
   */
  static getActionValue(element: HTMLDetailsElement): string {
    return element.open ? "opened" : "closed";
  }
}
