import { describe, expect, test } from "@jest/globals";
import { Analytics } from "./core";
import { PageViewTracker } from "../pageViewTracker/pageViewTracker";

describe("should initialize the ga4 class", () => {
  const gtmId = "GTM-XXXX";
  const newInstance = new Analytics(gtmId);
  test("gtmId property", () => {
    expect(newInstance.gtmId).toEqual(gtmId);
  });
  test("pageViewTracker property", () => {
    expect(newInstance.pageViewTracker).toBeInstanceOf(PageViewTracker);
  });

  test("tag manager script added to document", () => {
    expect(document.getElementsByTagName("script")[0].src).toEqual(
      "https://www.googletagmanager.com/gtm.js?id=GTM-XXXX",
    );
  });
});
