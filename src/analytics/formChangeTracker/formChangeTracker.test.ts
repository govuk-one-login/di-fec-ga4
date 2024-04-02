import { describe, expect, jest, test } from "@jest/globals";
import { FormChangeTracker } from "./formChangeTracker";
import { FormEventInterface } from "../formTracker/formTracker.interface";

window.DI = { analyticsGa4: { cookie: { consent: true } } };

describe("FormChangeTracker", () => {
  const spy = jest.spyOn(FormChangeTracker.prototype, "pushToDataLayer");
  const trackFormChangeSpy = jest.spyOn(
    FormChangeTracker.prototype,
    "trackFormChange",
  );
  const getSubmitterTextSpy = jest.spyOn(
    FormChangeTracker.prototype,
    "getSubmitterText",
  );

  test("trackFormChange should return false if not cookie consent", () => {
    window.DI.analyticsGa4.cookie.consent = false;
    const instance = new FormChangeTracker();
    instance.trackFormChange();
    expect(instance.trackFormChange).toReturnWith(false);
  });

  test("datalayer event should be defined", () => {
    window.DI.analyticsGa4.cookie.consent = true;
    const instance = new FormChangeTracker();
    document.body.innerHTML = "";
    document.body.innerHTML =
      '<div id="main-content">' +
      '<form action="/test-url" method="post">' +
      "  <legend>test label questions</legend>" +
      '  <label for="question-1">test label question 1</label>' +
      '  <input type="checkbox" id="question-1" name="question-1" value="test value" checked/>' +
      '  <label for="question-2">test label question 2</label>' +
      '  <input type="checkbox" id="question-2" name="question-2" value="test value"/>' +
      '  <button id="button" type="submit">submit</button>' +
      "</form></div>";

    const dataLayerEvent: FormEventInterface = {
      event: "event_data",
      event_data: {
        event_name: "form_change_response",
        type: "undefined",
        url: "http://localhost/test-url",
        text: "change", //put static value. Waiting final documentation on form change tracker
        section: "test label questions",
        action: "change response",
        external: "false",
        link_domain: "http://localhost",
        "link_path_parts.1": "/test-url",
        "link_path_parts.2": "undefined",
        "link_path_parts.3": "undefined",
        "link_path_parts.4": "undefined",
        "link_path_parts.5": "undefined",
      },
    };

    instance.trackFormChange();
    expect(instance.pushToDataLayer).toBeCalledWith(dataLayerEvent);
  });

  test("getSubmitterText should return submit button text", () => {
    const instance = new FormChangeTracker();

    document.body.innerHTML =
      '<div id="main-content">' +
      '<form action="/test-url" method="post">' +
      "  <legend>test label questions</legend>" +
      '  <label for="question-1">test label question 1</label>' +
      '  <input type="checkbox" id="question-1" name="question-1" value="test value" checked/>' +
      '  <label for="question-2">test label question 2</label>' +
      '  <input type="checkbox" id="question-2" name="question-2" value="test value"/>' +
      '  <button id="button" type="submit">submit</button>' +
      "</form></div>";

    instance.getSubmitterText();
    expect(instance.getSubmitterText).toReturnWith("submit");
  });
});
