import { PageViewTrackerInterface } from "../pageViewTracker/pageViewTracker.interface";

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export class BaseTracker {
  public organisations: string = "OT1056";
  public primary_publishing_organisation: string =
    "Government Digital Service - Digital Identity";

  pushToDataLayer(event: PageViewTrackerInterface) {
    console.log("running pushToDataLayer");
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(event);
  }

  getLanguage(): string {
    const languageCode =
      document.querySelector("html") &&
      document.querySelector("html")?.getAttribute("lang");
    return languageCode?.toLowerCase() || "en";
  }

  getLocation(): string {
    return document.location.href?.toLowerCase() || "undefined";
  }

  getReferrer(): string {
    return document.referrer.length
      ? document.referrer?.toLowerCase()
      : "undefined";
  }
}
