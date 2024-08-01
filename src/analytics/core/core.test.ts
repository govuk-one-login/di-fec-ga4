import { describe, expect, test } from "@jest/globals";
import { Analytics } from "./core";
import { PageViewTracker } from "../pageViewTracker/pageViewTracker";
import { OptionsInterface } from "../core/core.interface";

window.DI = { analyticsGa4: { cookie: { consent: true } } };

describe("should initialize the ga4 class", () => {
  const options: OptionsInterface = {
    disableGa4Tracking: false,
    disableUaTracking: false,
    cookieDomain: "localhost",
    enableFormChangeTracking: true,
    enableFormErrorTracking: true,
    enableFormResponseTracking: true,
    enableNavigationTracking: true,
    enablePageViewTracking: true,
    enableSelectContentTracking: true,
  };
  const gtmId = "GTM-XXXX";

  test("gtmId property", () => {
    const newInstance = new Analytics(gtmId, options);
    expect(newInstance.gtmId).toEqual(gtmId);
  });

  test("pageViewTracker property", () => {
    const newInstance = new Analytics(gtmId, options);
    expect(newInstance.pageViewTracker).toBeInstanceOf(PageViewTracker);
  });

  test("tag manager script not added to document if no consent", () => {
    expect(document.getElementsByTagName("script")[0]).toBe(undefined);
  });

  test("tag manager script added to document", () => {
    const newInstance = new Analytics(gtmId, options);
    newInstance.loadGtmScript(newInstance.gtmId);
    expect(document.getElementsByTagName("script")[0].src).toEqual(
      "https://www.googletagmanager.com/gtm.js?id=GTM-XXXX",
    );
  });

  test("tag manager script not added to document", () => {
    document.body = document.createElement("body");
    const newInstance = new Analytics(gtmId, {
      ...options,
      disableGa4Tracking: true,
    });
    expect(document.getElementsByTagName("script").length).toEqual(0);
  });

  test("GA4 trackers not initialized", () => {
    document.body = document.createElement("body");
    const newInstance = new Analytics(gtmId, {
      ...options,
      disableGa4Tracking: true,
    });
    expect(newInstance.navigationTracker).toEqual(undefined);
    expect(newInstance.formResponseTracker).toEqual(undefined);
  });
});
