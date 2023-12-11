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

  test("getType with checkbox field should return the type checkbox", () => {
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

  test("getType with text field should return the type free text field", () => {
    const instance = new FormErrorTracker();

    document.body.innerHTML =
      '<form action="/test-url" method="post">' +
      '  <label for="username">test label username</label>' +
      '  <p id="organisationType-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> Select one option</p>' +
      '  <input type="text" id="username" name="username" value="test value"/>' +
      '  <button id="button" type="submit">submit</button>' +
      "</form>";

    const form = document.forms[0];
    expect(instance.getType(form)).toEqual("free text field");
  });

  test("getType with textarea field should return the type free text field", () => {
    const instance = new FormErrorTracker();

    document.body.innerHTML =
      '<form action="/test-url" method="post">' +
      '  <label for="username">test label username</label>' +
      '  <p id="organisationType-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> Select one option</p>' +
      '  <textarea id="username" name="username" value="test value"/>test value</textarea>' +
      '  <button id="button" type="submit">submit</button>' +
      "</form>";

    const form = document.forms[0];
    expect(instance.getType(form)).toEqual("free text field");
  });

  test("getType with select field should return the type dropdown-list", () => {
    const instance = new FormErrorTracker();

    document.body.innerHTML =
      '<form action="/test-url" method="post">' +
      '  <label for="username">test label username</label>' +
      '  <p id="organisationType-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> Select one option</p>' +
      '  <select id="username" name="username"><option value="test value">test value</option><option value="test value2" selected>test value2</option></select>' +
      '  <button id="button" type="submit">submit</button>' +
      "</form>";

    const form = document.forms[0];
    expect(instance.getType(form)).toEqual("drop-down list");
  });

  test("getType with radio buttons field should return the type radio buttons", () => {
    const instance = new FormErrorTracker();

    document.body.innerHTML =
      '<form action="/test-url" method="post">' +
      "  <legend>test label questions</legend>" +
      '  <p id="organisationType-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> Select one option</p>' +
      '  <label for="male">test label male</label>' +
      '  <input type="radio" id="male" name="male" value="Male" checked/>' +
      '  <label for="female">test label female</label>' +
      '  <input type="radio" id="female" name="female" value="Male"/>' +
      '  <button id="button" type="submit">submit</button>' +
      "</form>";

    const form = document.forms[0];
    expect(instance.getType(form)).toEqual("radio buttons");
  });
});
