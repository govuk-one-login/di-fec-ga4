import { describe, expect, jest, test } from "@jest/globals";
import { FormResponseTracker } from "./formResponseTracker";
import { FormEventInterface } from "../formTracker/formTracker.interface";
window.DI = { analyticsGa4: { cookie: { consent: true } } };

describe("FormResponseTracker", () => {
  const action = new Event("submit", {
    bubbles: true,
    cancelable: true,
  });

  const spy = jest.spyOn(FormResponseTracker.prototype, "pushToDataLayer");
  const constructorSpy = jest.spyOn(
    FormResponseTracker.prototype,
    "initialiseEventListener",
  );

  test("new instance should call initialiseEventListener", () => {
    const instance = new FormResponseTracker();
    expect(instance.initialiseEventListener).toBeCalled();
  });
});

describe("form with input checkbox", () => {
  const action = new Event("submit", {
    bubbles: true,
    cancelable: true,
  });

  const spy = jest.spyOn(FormResponseTracker.prototype, "pushToDataLayer");

  test("datalayer event should be defined", () => {
    const instance = new FormResponseTracker();
    document.body.innerHTML = "";
    document.body.innerHTML =
      '<form action="/test-url" method="post">' +
      "  <legend>test label questions</legend>" +
      '  <label for="question-1">test label question 1</label>' +
      '  <input type="checkbox" id="question-1" name="question-1" value="test value" checked/>' +
      '  <label for="question-2">test label question 2</label>' +
      '  <input type="checkbox" id="question-2" name="question-2" value="test value"/>' +
      '  <button id="button" type="submit">submit</button>' +
      "</form>";
    document.dispatchEvent(action);

    const dataLayerEvent: FormEventInterface = {
      event: "event_data",
      event_data: {
        event_name: "form_response",
        type: "checkbox",
        url: "undefined",
        text: "test label question 1",
        section: "test label questions",
        action: "undefined",
        external: "undefined",
      },
    };
    expect(instance.pushToDataLayer).toBeCalledWith(dataLayerEvent);
  });
});
describe("form with input text", () => {
  const action = new Event("submit", {
    bubbles: true,
    cancelable: true,
  });

  const spy = jest.spyOn(FormResponseTracker.prototype, "pushToDataLayer");

  test("datalayer event should be defined", () => {
    const instance = new FormResponseTracker();
    document.body.innerHTML =
      '<form action="/test-url" method="post">' +
      '  <label for="username">test label username</label>' +
      '  <input type="text" id="username" name="username" value="test value"/>' +
      '  <button id="button" type="submit">submit</button>' +
      "</form>";
    document.dispatchEvent(action);

    const dataLayerEvent: FormEventInterface = {
      event: "event_data",
      event_data: {
        event_name: "form_response",
        type: instance.FREE_TEXT_FIELD_TYPE,
        url: "undefined",
        text: "test value",
        section: "test label username",
        action: "undefined",
        external: "undefined",
      },
    };
    expect(instance.pushToDataLayer).toBeCalledWith(dataLayerEvent);
  });
});

describe("test disable free text tracking option", () => {
  const action = new Event("submit", {
    bubbles: true,
    cancelable: true,
  });

  const spy = jest.spyOn(FormResponseTracker.prototype, "trackFormResponse");

  test("pushToDataLayer should not be called with free text value", () => {
    const instance = new FormResponseTracker({ disableFreeTextTracking: true });
    document.body.innerHTML =
      '<form action="/test-url" method="post">' +
      '  <label for="username">test label username</label>' +
      '  <input type="text" id="username" name="username" value="test no value"/>' +
      '  <button id="button" type="submit">submit</button>' +
      "</form>";
    document.dispatchEvent(action);
    expect(instance.trackFormResponse).toReturnWith(false);
  });
});

describe("form with input textarea", () => {
  const action = new Event("submit", {
    bubbles: true,
    cancelable: true,
  });

  const spy = jest.spyOn(FormResponseTracker.prototype, "pushToDataLayer");

  test("datalayer event should be defined", () => {
    const instance = new FormResponseTracker();
    document.body.innerHTML =
      '<form action="/test-url" method="post">' +
      '  <label for="username">test label username</label>' +
      '  <textarea id="username" name="username" value="test value"/>test value</textarea>' +
      '  <button id="button" type="submit">submit</button>' +
      "</form>";
    document.dispatchEvent(action);

    const dataLayerEvent: FormEventInterface = {
      event: "event_data",
      event_data: {
        event_name: "form_response",
        type: instance.FREE_TEXT_FIELD_TYPE,
        url: "undefined",
        text: "test value",
        section: "test label username",
        action: "undefined",
        external: "undefined",
      },
    };
    expect(instance.pushToDataLayer).toBeCalledWith(dataLayerEvent);
  });
});

describe("form with dropdown", () => {
  const action = new Event("submit", {
    bubbles: true,
    cancelable: true,
  });

  const spy = jest.spyOn(FormResponseTracker.prototype, "pushToDataLayer");

  test("datalayer event should be defined", () => {
    const instance = new FormResponseTracker();
    document.body.innerHTML =
      '<form action="/test-url" method="post">' +
      '  <label for="username">test label username</label>' +
      '  <select id="username" name="username"><option value="test value">test value</option><option value="test value2" selected>test value2</option></select>' +
      '  <button id="button" type="submit">submit</button>' +
      "</form>";
    document.dispatchEvent(action);

    const dataLayerEvent: FormEventInterface = {
      event: "event_data",
      event_data: {
        event_name: "form_response",
        type: "drop-down list",
        url: "undefined",
        text: "test value2",
        section: "test label username",
        action: "undefined",
        external: "undefined",
      },
    };
    expect(instance.pushToDataLayer).toBeCalledWith(dataLayerEvent);
  });
});

describe("Cookie Management", () => {
  const action = new Event("submit", {
    bubbles: true,
    cancelable: true,
  });
  const spy = jest.spyOn(FormResponseTracker.prototype, "trackFormResponse");
  const instance = new FormResponseTracker();

  test("trackFormResponse should return false if not cookie consent", () => {
    window.DI.analyticsGa4.cookie.consent = false;
    document.body.innerHTML =
      '<form action="/test-url" method="post">' +
      '  <label for="username">test label username</label>' +
      '  <select id="username" name="username"><option value="test value">test value</option><option value="test value2" selected>test value2</option></select>' +
      '  <button id="button" type="submit">submit</button>' +
      "</form>";
    document.dispatchEvent(action);

    expect(instance.trackFormResponse).toReturnWith(false);
  });
});
