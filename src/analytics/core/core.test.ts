import { describe, expect, test } from "@jest/globals";
import { Analytics } from "./core";

describe("should initialize the ga4 class", () => {
  const gtmId = "GTM-XXXX";
  const newInstance = new Analytics(gtmId);
  test("gtmId property", () => {
    expect(newInstance.gtmId).toEqual(gtmId);
  });
  test("tag manager script added to document", () => {
    expect(document.getElementsByTagName("script")[0].src).toEqual(
      "https://www.googletagmanager.com/gtm.js?id=GTM-XXXX",
    );
  });
});
