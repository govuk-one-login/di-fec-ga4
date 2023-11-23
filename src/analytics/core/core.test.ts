import { describe, expect, test } from "@jest/globals";
import { Analytics } from "./core";
import { PageViewTracker } from "../pageViewTracker/pageViewTracker";

window.DI = { analyticsGa4: { cookie: { consent: true } } };

describe("should initialize the ga4 class", () => {
  const gtmId = "GTM-XXXX";
  const newInstance = new Analytics(gtmId);

  test("gtmId property", () => {
    expect(newInstance.gtmId).toEqual(gtmId);
  });

  test("pageViewTracker property", () => {
    expect(newInstance.pageViewTracker).toBeInstanceOf(PageViewTracker);
  });

  test("tag manager script not added to document if no consent", () => {
    expect(document.getElementsByTagName("script")[0]).toBe(undefined);
  });

  test("tag manager script added to document", () => {
    newInstance.loadGtmScript();
    expect(document.getElementsByTagName("script")[0].src).toEqual(
      "https://www.googletagmanager.com/gtm.js?id=GTM-XXXX",
    );
  });
});
