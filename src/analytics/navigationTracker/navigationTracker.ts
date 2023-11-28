import { BaseTracker } from "../baseTracker/baseTracker";
import { NavigationEventInterface } from "./navigationTracker.interface";
import { validateParameter } from "../../utils/validateParameter";

export class NavigationTracker extends BaseTracker {
  eventName: string = "event_data";

  constructor() {
    super();
    this.initialiseEventListener();
  }

  /**
   * Initialises the event listener for the document click event.
   *
   * @param {type} None
   * @return {type} None
   */
  initialiseEventListener() {
    document.addEventListener("click", this.trackNavigation.bind(this), false);
  }

  /**
   * Tracks the page load event and sends the relevant data to the data layer.
   *
   * @param {PageViewParametersInterface} parameters - The parameters for the page view event.
   * @return {boolean} Returns true if the event was successfully tracked, false otherwise.
   */
  trackNavigation(event: Event): boolean {
    if (!window.DI.analyticsGa4.cookie.consent) {
      return false;
    }

    const element: HTMLLinkElement = event.target as HTMLLinkElement;
    /**
     * Navigation tracker is only for links and buttons
     */
    if (element.tagName !== "A" && element.tagName !== "BUTTON") {
      return false;
    }
    // Ignore links that don't have an inbound or outbound href
    if (
      !element.href ||
      !element.href.length ||
      element.href === "#" ||
      element.href === window.location.href + "#"
    ) {
      return false;
    }

    const navigationTrackerEvent: NavigationEventInterface = {
      event: this.eventName,
      event_data: {
        event_name: "navigation",
        type: this.getLinkType(element),
        url: validateParameter(element.href, 100),
        text: element.textContent
          ? validateParameter(element.textContent.trim(), 100)
          : "undefined",
        section: "undefined",
        action: "undefined",
        external: this.isExternalLink(element.href) ? "true" : "false",
      },
    };

    try {
      this.pushToDataLayer(navigationTrackerEvent);
      return true;
    } catch (err) {
      console.error("Error in trackNavigation", err);
      return false;
    }
  }

  /**
   * Determines if the given URL is an external link.
   *
   * @param {string} url - The URL to check.
   * @return {boolean} Returns true if the URL is an external link, false otherwise.
   */
  isExternalLink(url: string): boolean {
    if (!url) {
      return false;
    }

    if (url.includes(window.location.hostname)) {
      return false;
    }
    return true;
  }

  /**
   * Returns the type of link based on the given HTML link element.
   *
   * @param {HTMLLinkElement} element - The HTML link element to get the type of.
   * @return {string} The type of link: "footer", "header menu bar", "generic link", "generic button", or "undefined".
   */
  getLinkType(element: HTMLLinkElement): string {
    if (element.tagName === "A") {
      if (this.isFooterLink(element.className)) {
        return "footer";
      } else if (this.isHeaderMenuBarLink(element.className)) {
        return "header menu bar";
      }
      return "generic link";
    } else if (element.tagName === "BUTTON") {
      return "generic button";
    }
    return "undefined"; // generic button
  }

  /**
   * Determines whether the given class name is a footer link.
   *
   * @param {string} className - The class name to check.
   * @return {boolean} Returns true if the class name contains "govuk-footer__link", otherwise returns false.
   */
  isFooterLink(className: string): boolean {
    return className.includes("govuk-footer__link");
  }

  /**
   * Determines if the given class name is a header menu bar link.
   *
   * @param {string} className - The class name to check.
   * @return {boolean} Returns true if the class name includes "header__navigation", false otherwise.
   */
  isHeaderMenuBarLink(className: string): boolean {
    return className.includes("header__navigation");
  }
}
