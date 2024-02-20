import { PageViewEventInterface } from "../pageViewTracker/pageViewTracker.interface";
import { NavigationEventInterface } from "../navigationTracker/navigationTracker.interface";
import { FormEventInterface } from "../formTracker/formTracker.interface";

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export class BaseTracker {
  public organisations: string = "<OT1056>";
  public primary_publishing_organisation: string =
    "government digital service - digital identity";

  /**
   * Pushes an event to the data layer.
   *
   * @param {PageViewEventInterface} event - The event to be pushed to the data layer.
   * @return {boolean} Returns true if the event was successfully tracked, false otherwise.
   */
  pushToDataLayer(
    event:
      | PageViewEventInterface
      | NavigationEventInterface
      | FormEventInterface,
  ): boolean {
    console.log("running pushToDataLayer");
    window.dataLayer = window.dataLayer || [];
    try {
      window.dataLayer.push(event);
      return true;
    } catch (err) {
      console.error("Error in pushToDataLayer", err);
      return false;
    }
  }

  /**
   * Retrieves the language code from the HTML document and returns it in lowercase.
   *
   * @return {string} The language code. Defaults to "en" if no language code is found.
   */
  getLanguage(): string {
    const languageCode = document.querySelector("html")?.getAttribute("lang");
    return languageCode?.toLowerCase() || "undefined";
  }

  /**
   * Returns the current location URL as a lowercase string.
   *
   * @return {string} The current location URL as a lowercase string, or "undefined" if not available.
   */
  getLocation(): string {
    return document.location.href?.toLowerCase() || "undefined";
  }

  /**
   * Retrieves the referrer of the current document.
   *
   * @return {string} The referrer as a lowercase string, or "undefined" if it is empty.
   */
  getReferrer(): string {
    return document.referrer.length
      ? document.referrer?.toLowerCase()
      : "undefined";
  }

  getDomain(url: string): string {
    if (url === "undefined") {
      return "undefined";
    }
    const newUrl = new URL(url);
    return `${newUrl.protocol}//${newUrl.host}`;
  }

  getDomainPath(url: string, part: number): string {
    if (url === "undefined") {
      return "undefined";
    }

    const start = part * 500;
    const end = start + 500;
    const newUrl = new URL(url);
    const domainPath = newUrl.pathname.substring(start, end);
    return domainPath.length ? domainPath : "undefined";
  }
}
