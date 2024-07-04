import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import "jest-localstorage-mock";
import { PageViewTracker } from "./pageViewTracker";
import {
  PageViewParametersInterface,
  PageViewEventInterface,
} from "./pageViewTracker.interface";
import { FormErrorTracker } from "../formErrorTracker/formErrorTracker";
import { OptionsInterface } from "../core/core.interface";

window.DI = { analyticsGa4: { cookie: { consent: true } } };

const parameters: PageViewParametersInterface = {
  statusCode: 200,
  englishPageTitle: "home",
  taxonomy_level1: "taxo1",
  taxonomy_level2: "taxo2",
  content_id: "<e4a3603d-2d3c-4ff1-9b80-d72c1e6b7a58>",
  logged_in_status: true,
  dynamic: true,
};
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

describe("pageViewTracker", () => {
  const newInstance = new PageViewTracker(options);
  const spy = jest.spyOn(PageViewTracker.prototype, "pushToDataLayer");
  test("pageView is deactivated", () => {
    const instance = new PageViewTracker({
      ...options,
      enablePageViewTracking: false,
    });
    instance.trackOnPageLoad(parameters);
    expect(instance.trackOnPageLoad).toReturnWith(false);
  });

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
        content_id: parameters.content_id,
        logged_in_status: newInstance.getLoggedInStatus(
          parameters.logged_in_status,
        ),
        dynamic: parameters.dynamic.toString(),
        first_published_at: newInstance.getFirstPublishedAt(),
        updated_at: newInstance.getUpdatedAt(),
        relying_party: newInstance.getRelyingParty(),
      },
    };
    newInstance.trackOnPageLoad(parameters);
    expect(newInstance.pushToDataLayer).toBeCalledWith(dataLayerEvent);
  });

  test("getLoggedInStatus returns the good data if logged in", () => {
    const status = newInstance.getLoggedInStatus(true);
    expect(status).toBe("logged in");
  });

  test("getLoggedInStatus returns the good data if logged out", () => {
    const status = newInstance.getLoggedInStatus(false);
    expect(status).toBe("logged out");
  });

  test("getLoggedInStatus returns the good data if loggedinstatus is undefined", () => {
    const status = newInstance.getLoggedInStatus(undefined);
    expect(status).toBe("undefined");
  });

  test("getRelyingParty returns the good data", () => {
    const relyingParty = newInstance.getRelyingParty();
    expect(relyingParty).toBe("localhost");
  });

  test("getFirstPublishedAt returns undefined if first published-at tag doesn't exists", () => {
    const firstPublishedAt = newInstance.getFirstPublishedAt();
    expect(firstPublishedAt).toBe("undefined");
  });

  test("getFirstPublishedAt returns the good data if first published-at tag exists", () => {
    const newTag = document.createElement("meta");
    newTag.setAttribute("name", "govuk:first-published-at");
    newTag.setAttribute("content", "2022-09-01T00:00:00.000Z");
    document.head.appendChild(newTag);
    const firstPublishedAt = newInstance.getFirstPublishedAt();
    expect(firstPublishedAt).toBe("2022-09-01T00:00:00.000Z");
  });

  test("getUpdatedAt returns undefined if updated-at tag doesn't exists", () => {
    const updatedAt = newInstance.getUpdatedAt();
    expect(updatedAt).toBe("undefined");
  });

  test("getUpdatedAt returns the good data if updated-at tag exists", () => {
    const newTag = document.createElement("meta");
    newTag.setAttribute("name", "govuk:updated-at");
    newTag.setAttribute("content", "2022-09-02T00:00:00.000Z");
    document.head.appendChild(newTag);
    const updatedAt = newInstance.getUpdatedAt();
    expect(updatedAt).toBe("2022-09-02T00:00:00.000Z");
  });
});

describe("pageViewTracker test disable ga4 tracking option", () => {
  const spy = jest.spyOn(PageViewTracker.prototype, "trackOnPageLoad");

  test("pushToDataLayer should not be called", () => {
    const instance = new PageViewTracker({
      ...options,
      disableGa4Tracking: true,
    });
    instance.trackOnPageLoad(parameters);
    expect(instance.trackOnPageLoad).toReturnWith(false);
  });
});

describe("Cookie Management", () => {
  jest.spyOn(PageViewTracker.prototype, "trackOnPageLoad");
  beforeEach(() => {
    window.DI.analyticsGa4.cookie.consent = true;
  });

  test("trackOnPageLoad should return false if visitor rejects cookie consent", () => {
    window.DI.analyticsGa4.cookie.consent = false;
    window.DI.analyticsGa4.cookie.hasCookie = true;
    const instance = new PageViewTracker(options);
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
        content_id: parameters.content_id,
        logged_in_status: instance.getLoggedInStatus(
          parameters.logged_in_status,
        ),
        dynamic: parameters.dynamic.toString(),
        first_published_at: instance.getFirstPublishedAt(),
        updated_at: instance.getUpdatedAt(),
        relying_party: instance.getRelyingParty(),
      },
    };
    instance.trackOnPageLoad(parameters);
    expect(instance.trackOnPageLoad).toReturnWith(false);
  });
});

describe("Form Error Tracker Trigger", () => {
  let instance: PageViewTracker;
  let formErrorTracker: FormErrorTracker;

  beforeEach(() => {
    jest.clearAllMocks();
    window.DI.analyticsGa4.cookie.consent = true;
    jest.spyOn(FormErrorTracker.prototype, "trackFormError");
    instance = new PageViewTracker(options);
    formErrorTracker = new FormErrorTracker();
  });

  test("trackOnPageLoad should called form error function and return false if form error message exists", () => {
    jest.spyOn(PageViewTracker.prototype, "trackOnPageLoad");

    document.body.innerHTML =
      '<p id="organisationType-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> Select one option</p>';
    instance.trackOnPageLoad(parameters);
    expect(instance.trackOnPageLoad).toReturnWith(false);
  });

  test("FormError tracker is activated", () => {
    document.body.innerHTML =
      '<p id="organisationType-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> Select one option</p>';

    instance.trackOnPageLoad(parameters);
    expect(formErrorTracker.trackFormError).toHaveBeenCalled();
  });
  test("FormError tracker is activated even if pageView is disabled", () => {
    document.body.innerHTML =
      '<p id="organisationType-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> Select one option</p>';
    const instance = new PageViewTracker({
      ...options,
      enablePageViewTracking: false,
    });

    instance.trackOnPageLoad(parameters);
    expect(formErrorTracker.trackFormError).toHaveBeenCalled();
  });

  test("FormError tracker is not triggered", () => {
    document.body.innerHTML = "";
    instance.trackOnPageLoad(parameters);
    expect(formErrorTracker.trackFormError).not.toBeCalled();
  });

  test("FormError tracker is deactivated", () => {
    document.body.innerHTML =
      '<p id="organisationType-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> Select one option</p>';

    const instance = new PageViewTracker({
      ...options,
      enableFormErrorTracking: false,
    });

    instance.trackOnPageLoad(parameters);
    expect(formErrorTracker.trackFormError).not.toHaveBeenCalled();
  });
});

describe("Persisting taxonomy level 2 values", () => {
  const instance = new PageViewTracker();
  test("Taxonomy level 2 is saved to localStorage", () => {
    instance.trackOnPageLoad(parameters);
    expect(localStorage.getItem("taxonomyLevel2")).toBe("taxo2");
  });

  test("Taxonomy level 2 is not saved to localStorage if value === 'persisted from previous page'", () => {
    parameters.taxonomy_level2 = "persisted from previous page";
    instance.trackOnPageLoad(parameters);
    expect(localStorage.getItem("taxonomyLevel2")).not.toBe(
      "persisted from previous page",
    );
  });
});
