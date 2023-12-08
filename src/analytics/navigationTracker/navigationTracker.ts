import { BaseTracker } from "../baseTracker/baseTracker";
import { NavigationEventInterface } from "./navigationTracker.interface";
import { validateParameter } from "../../utils/validateParameter";

export class NavigationTracker extends BaseTracker {
  eventName: string = "event_data";
  section: string = "undefined";

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

    let element: HTMLLinkElement = event.target as HTMLLinkElement;
    element = this.getParentElementIfSpecificClass(element, [
      "govuk-header__logotype",
    ]);

    /**
     * Navigation tracker is only for links
     */
    if (element.tagName !== "A") {
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
        section: this.section,
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
   * Returns the parent element of the given HTMLLinkElement if it has a specific class.
   *
   * @param {HTMLLinkElement} element - The HTMLLinkElement to check for a specific class.
   * @param {string[]} classes - An array of classes to check against the parent element's class.
   * @return {HTMLLinkElement} - The parent element of the parent element of the given HTMLLinkElement if it has a specific class, otherwise returns the original element.
   */
  getParentElementIfSpecificClass(
    element: HTMLLinkElement,
    classes: string[],
  ): HTMLLinkElement {
    if (
      element.parentElement &&
      classes.includes(element.parentElement.className) &&
      element.parentElement.parentElement?.tagName === "A"
    ) {
      return element.parentElement.parentElement as HTMLLinkElement;
    }
    return element;
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
   * @return {string} The type of link: "footer", "header menu bar", "generic link", or "undefined".
   */
  getLinkType(element: HTMLLinkElement): string {
    if (element.tagName === "A") {
      if (this.isFooterLink(element)) {
        return "footer";
      } else if (
        this.isHeaderMenuBarLink(element) ||
        this.isPhaseBannerLink(element)
      ) {
        return "header menu bar";
      } else if (element.classList.contains("govuk-button")) {
        return "generic button";
      } else if (this.isBackLink(element)) {
        return "back button";
      }
      return "generic link";
    }
    return "undefined"; // generic button
  }
  /**
   * Determines whether the given class name is a footer link.
   *
   * @param {string} element - The HTML link element to get the type of.
   * @return {boolean} Returns true if the footer tag contains this element, false otherwise.
   */
  isFooterLink(element: HTMLElement): boolean {
    const footer = document.getElementsByTagName("footer")[0];
    return footer && footer.contains(element);
  }

  /**
   * Determines if the given class name is a header menu bar link.
   *
   * @param {string} element - The HTML link element to get the type of.
   * @return {boolean} Returns true if the header tag contains this element, false otherwise.
   */
  isHeaderMenuBarLink(element: HTMLElement): boolean {
    const header = document.getElementsByTagName("header")[0];
    return header && header.contains(element);
  }

  isPhaseBannerLink(element: HTMLElement): boolean {
    const phaseBanner =
      document.getElementsByClassName("govuk-phase-banner")[0];
    return phaseBanner && phaseBanner.contains(element);
  }

  /**
   * Determines if the given element is a back button link.
   *
   * @param {string} element - The HTML link element to get the type of.
   * @return {boolean} Returns true if the class name of this element includes "govuk-back-link", false otherwise.
   */
  isBackLink(element: HTMLElement): boolean {
    const elementClassName: string = element.className as string;
    return elementClassName.includes("govuk-back-link");
  }
}
