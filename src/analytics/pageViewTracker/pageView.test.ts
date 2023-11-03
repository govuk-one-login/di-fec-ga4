import { describe, expect, test } from "@jest/globals";

import pageViewTracker from "./pageViewTracker";
import PageViewInterface from "./pageViewInterface";

describe("pageViewTracker", () => {
  test("dataLayer format", () => {
    const params: PageViewInterface = {
      location: "London",
      language: "en",
    };
    const expectedReturn = {
      event: "page_view",
      page_view: {
        language: "en",
        location: "London",
      },
    };
    expect(pageViewTracker(params)).toEqual(expectedReturn);
  });
});
