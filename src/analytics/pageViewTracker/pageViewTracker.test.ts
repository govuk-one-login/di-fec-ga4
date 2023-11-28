import { describe, expect, jest, test } from "@jest/globals";
import { PageViewTracker } from "./pageViewTracker";
import {
  PageViewParametersInterface,
  PageViewEventInterface,
} from "./pageViewTracker.interface";

window.DI = { analyticsGa4: { cookie: { consent: true } } };

describe("pageViewTracker", () => {
  const newInstance = new PageViewTracker();
  const spy = jest.spyOn(PageViewTracker.prototype, "pushToDataLayer");

  const parameters: PageViewParametersInterface = {
    statusCode: 200,
    englishPageTitle: "home",
    taxonomy_level1: "taxo1",
    taxonomy_level2: "taxo2",
  };

  test("pushToDataLayer is called", () => {
    newInstance.trackOnPageLoad(parameters);
    expect(newInstance.pushToDataLayer).toBeCalled();
  });

  test("pushToDataLayer is called with the good data", () => {
    const dataLayerEvent: PageViewEventInterface = {
      event: newInstance.eventName,
      page_view: {
        language: newInstance.getLanguage(),
        location: newInstance.getLocation(),
        organisations: newInstance.organisations,
        primary_publishing_organisation:
          newInstance.primary_publishing_organisation,
        referrer: newInstance.getReferrer(),
        status_code: parameters.statusCode.toString(),
        title: parameters.englishPageTitle,
        taxonomy_level1: parameters.taxonomy_level1,
        taxonomy_level2: parameters.taxonomy_level2,
      },
    };
    newInstance.trackOnPageLoad(parameters);
    expect(newInstance.pushToDataLayer).toBeCalledWith(dataLayerEvent);
  });
});

describe("Cookie Management", () => {
  const spy = jest.spyOn(PageViewTracker.prototype, "trackOnPageLoad");
  const parameters: PageViewParametersInterface = {
    statusCode: 200,
    englishPageTitle: "home",
    taxonomy_level1: "taxo1",
    taxonomy_level2: "taxo2",
  };
  test("trackOnPageLoad should return false if not cookie consent", () => {
    window.DI.analyticsGa4.cookie.consent = false;
    const instance = new PageViewTracker();
    const dataLayerEvent: PageViewEventInterface = {
      event: instance.eventName,
      page_view: {
        language: instance.getLanguage(),
        location: instance.getLocation(),
        organisations: instance.organisations,
        primary_publishing_organisation:
          instance.primary_publishing_organisation,
        referrer: instance.getReferrer(),
        status_code: parameters.statusCode.toString(),
        title: parameters.englishPageTitle,
        taxonomy_level1: parameters.taxonomy_level1,
        taxonomy_level2: parameters.taxonomy_level2,
      },
    };
    instance.trackOnPageLoad(parameters);
    expect(instance.trackOnPageLoad).toReturnWith(false);
  });
});
