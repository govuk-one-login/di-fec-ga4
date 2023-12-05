import { describe, expect, jest, test } from "@jest/globals";
import { FormErrorTracker } from "./formErrorTracker";
import { FormEventInterface } from "../formTracker/formTracker.interface";

window.DI = { analyticsGa4: { cookie: { consent: true } } };

describe("FormErrorTracker", () => {
  const spy = jest.spyOn(FormErrorTracker.prototype, "pushToDataLayer");
  const trackFormErrorSpy = jest.spyOn(
    FormErrorTracker.prototype,
    "trackFormError",
  );

  test("trackFormError should return false if not cookie consent", () => {
    window.DI.analyticsGa4.cookie.consent = false;
    const instance = new FormErrorTracker();
    instance.trackFormError();
    expect(instance.trackFormError).toReturnWith(false);
  });

  test("datalayer event should be defined", () => {
    window.DI.analyticsGa4.cookie.consent = true;
    const instance = new FormErrorTracker();
    document.body.innerHTML = "";
    document.body.innerHTML =
      '<form action="/test-url" method="post">' +
      "  <legend>test label questions</legend>" +
      '  <p id="organisationType-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> Select one option</p>' +
      '  <label for="question-1">test label question 1</label>' +
      '  <input type="checkbox" id="question-1" name="question-1" value="test value" checked/>' +
      '  <label for="question-2">test label question 2</label>' +
      '  <input type="checkbox" id="question-2" name="question-2" value="test value"/>' +
      '  <button id="button" type="submit">submit</button>' +
      "</form>";

    const dataLayerEvent: FormEventInterface = {
      event: "event_data",
      event_data: {
        event_name: "form_error",
        type: "checkbox",
        url: "undefined",
        text: "error: select one option",
        section: "test label questions",
        action: "error",
        external: "undefined",
      },
    };

    instance.trackFormError();
    expect(instance.pushToDataLayer).toBeCalledWith(dataLayerEvent);
  });

  test("getErrorMessage should return error message", () => {
    const instance = new FormErrorTracker();
    document.body.innerHTML =
      '<form action="/test-url" method="post">' +
      "  <legend>test label questions</legend>" +
      '  <p id="organisationType-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> Select one option</p>' +
      '  <label for="question-1">test label question 1</label>' +
      '  <input type="checkbox" id="question-1" name="question-1" value="test value" checked/>' +
      '  <label for="question-2">test label question 2</label>' +
      '  <input type="checkbox" id="question-2" name="question-2" value="test value"/>' +
      '  <button id="button" type="submit">submit</button>' +
      "</form>";
    expect(instance.getErrorMessage()).toEqual("Error: Select one option");
  });

  test("getType should return the type", () => {
    const instance = new FormErrorTracker();
    document.body.innerHTML =
      '<form action="/test-url" method="post">' +
      "  <legend>test label questions</legend>" +
      '  <p id="organisationType-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> Select one option</p>' +
      '  <label for="question-1">test label question 1</label>' +
      '  <input type="checkbox" id="question-1" name="question-1" value="test value" checked/>' +
      '  <label for="question-2">test label question 2</label>' +
      '  <input type="checkbox" id="question-2" name="question-2" value="test value"/>' +
      '  <button id="button" type="submit">submit</button>' +
      "</form>";
    const form = document.forms[0];
    expect(instance.getType(form)).toEqual("checkbox");
  });
});
