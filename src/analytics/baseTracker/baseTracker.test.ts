import { describe, expect, test } from "@jest/globals";
import { BaseTracker } from "./baseTracker";
import { PageViewEventInterface } from "../pageViewTracker/pageViewTracker.interface";

describe("should push to dataLayer", () => {
  test("Push", () => {
    const pageViewTrackerDataLayerEvent: PageViewEventInterface = {
      event: "page_view_ga4",
      page_view: {
        language: "en",
        location: "http://localhost:3000/",
        organisations: "<OT1056>",
        primary_publishing_organisation:
          "government digital service - digital identity",
        referrer: "http://localhost:4000/",
        status_code: "200",
        title: "Home",
        taxonomy_level1: "taxo1",
        taxonomy_level2: "taxo2",
        content_id: "<e4a3603d-2d3c-4ff1-9b80-d72c1e6b7a58>",
        logged_in_status: "logged in",
        dynamic: "true",
        first_published_at: "2022-09-01T00:00:00.000Z",
        updated_at: "2022-09-01T00:00:00.000Z",
        relying_party: "Relying Party",
      },
    };
    BaseTracker.pushToDataLayer(pageViewTrackerDataLayerEvent);
    expect(pageViewTrackerDataLayerEvent).toEqual(window.dataLayer[0]);
  });
});

describe("should return the good parameter values", () => {
  test("Get Language from html tag", () => {
    document.documentElement.lang = "ws";
    const languageCode = BaseTracker.getLanguage();
    expect(languageCode).toEqual(document.documentElement.lang);
  });

  test("Get en as a default Language", () => {
    document.documentElement.lang = "";
    const languageCode = BaseTracker.getLanguage();
    expect(languageCode).toEqual("undefined");
  });

  test("Get location from DOM", () => {
    Object.defineProperty(window, "location", {
      value: new URL("http://localhost/"),
      configurable: true,
    });
    const location = BaseTracker.getLocation();
    expect(location).toEqual(window.location.href);
  });

  test("Get referrer from DOM", () => {
    Object.defineProperty(window, "referrer", {
      value: new URL("http://localhost/"),
      configurable: true,
    });
    const location = BaseTracker.getLocation();
    expect(location).toEqual(window.location.href);
  });

  test("Get domain from element url", () => {
    const location = BaseTracker.getDomain(
      "https://signin.account.gov.uk/enter-email-create",
    );
    expect(location).toEqual("https://signin.account.gov.uk");
  });

  test("Getdomain needs to return undefined if url = undefined", () => {
    const location = BaseTracker.getDomain("undefined");
    expect(location).toEqual("undefined");
  });

  test("Get url path from 0 to 500 max from element url", () => {
    const location = BaseTracker.getDomainPath(
      "https://signin.account.gov.uk/enter-email-create",
      0,
    );
    expect(location).toEqual("/enter-email-create");
  });

  test("Get domain path needs to return undefined if url = undefined", () => {
    const location = BaseTracker.getDomainPath("undefined", 0);
    expect(location).toEqual("undefined");
  });

  test("Get undefined if url path part is not found from element url", () => {
    const location = BaseTracker.getDomainPath(
      "https://signin.account.gov.uk/enter-email-create",
      1,
    );
    expect(location).toEqual("undefined");
  });
});

describe("should check for changeLink", () => {
  test("should return true if element is a change link", () => {
    const href = document.createElement("a");
    href.setAttribute("href", "http://localhost?edit=true");
    expect(BaseTracker.isChangeLink(href)).toBe(true);
  });
  test("should return false if element is not a change link", () => {
    const href = document.createElement("a");
    href.setAttribute("href", "http://localhost");
    expect(BaseTracker.isChangeLink(href)).toBe(false);
  });
});
