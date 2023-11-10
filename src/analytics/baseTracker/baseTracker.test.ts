import { describe, expect, test } from "@jest/globals";
import { BaseTracker } from "./baseTracker";
import { PageViewTrackerInterface } from "../pageViewTracker/pageViewTracker.interface";

describe("should push to dataLayer", () => {
  const newInstance = new BaseTracker();
  test("Push", () => {
    const pageViewTrackerDataLayerEvent: PageViewTrackerInterface = {
      event: "page_view_ga4",
      page_view: {
        language: "en",
        location: "http://localhost:3000/",
        organisations: "OT1056",
        primary_publishing_organisation:
          "Government Digital Service - Digital Identity",
        referrer: "http://localhost:4000/",
        status_code: "200",
        title: "Home",
        taxonomy_level1: "taxo1",
        taxonomy_level2: "taxo2",
      },
    };
    newInstance.pushToDataLayer(pageViewTrackerDataLayerEvent);
    expect(pageViewTrackerDataLayerEvent).toEqual(window.dataLayer[0]);
  });
});

describe("should return the good parameter values", () => {
  const newInstance = new BaseTracker();

  test("Get Language from html tag", () => {
    document.documentElement.lang = "ws";
    const languageCode = newInstance.getLanguage();
    expect(languageCode).toEqual(document.documentElement.lang);
  });

  test("Get en as a default Language", () => {
    document.documentElement.lang = "";
    const languageCode = newInstance.getLanguage();
    expect(languageCode).toEqual("en");
  });

  test("Get location from DOM", () => {
    Object.defineProperty(window, "location", {
      value: new URL("http://localhost/"),
      configurable: true,
    });
    const location = newInstance.getLocation();
    expect(location).toEqual(window.location.href);
  });

  test("Get referrer from DOM", () => {
    Object.defineProperty(window, "referrer", {
      value: new URL("http://localhost/"),
      configurable: true,
    });
    const location = newInstance.getLocation();
    expect(location).toEqual(window.location.href);
  });
});
