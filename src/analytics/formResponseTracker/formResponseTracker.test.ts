import { describe, expect, jest, test } from "@jest/globals";
import { FormResponseTracker } from "./formResponseTracker";
import { FormEventInterface } from "../formTracker/formTracker.interface";
window.DI = { analyticsGa4: { cookie: { consent: true } } };

describe("form with multiple fields", () => {
  const action = new Event("submit", {
    bubbles: true,
    cancelable: true,
  });

  const spy = jest.spyOn(FormResponseTracker.prototype, "pushToDataLayer");

  test("event fired and data layer defined for each of the fields", () => {
    const instance = new FormResponseTracker();
    document.body.innerHTML =
      '<form action= "/test-url" method= "post">' +
      "<fieldset>" +
      "  <legend>checked section</legend>" +
      '  <label for="question-1">checked value</label>' +
      '  <input type="checkbox" id="question-1" name="question-1" value="checked value" checked/>' +
      '  <label for="question-2">unchecked value</label>' +
      '  <input type="checkbox" id="question-2" name="question-2" value="unchecked value"/>' +
      "</fieldset>" +
      '  <label for="region">dropdown section</label>' +
      '  <select id="region" name="region"><option value="test value">test value</option><option value="test value2" selected>test value2</option></select>' +
      '  <label for="username">text input section</label>' +
      '  <input type="text" id="username" name="username" value="test value"/>' +
      "<fieldset>" +
      "  <legend>radio section</legend>" +
      '  <label for="male">radio value</label>' +
      '  <input type="radio" id="male" name="male" value="radio value" checked/>' +
      '  <label for="female">radio value 2</label>' +
      '  <input type="radio" id="female" name="female" value="radio value 2"/>' +
      "</fieldset>" +
      '  <label for="feedback">textarea section</label>' +
      '  <textarea id="feedback" name="feedback" value="test value"/>test value</textarea>' +
      '  <button id="button" type="submit">submit</button>' +
      "</form>";
    document.dispatchEvent(action);

    const dataLayerEventCheckbox: FormEventInterface = {
      event: "event_data",
      event_data: {
        event_name: "form_response",
        type: "checkbox",
        url: "http://localhost/test-url",
        text: "checked value",
        section: "checked section",
        action: "undefined",
        external: "undefined",
        link_domain: "http://localhost",
        "link_path_parts.1": "/test-url",
        "link_path_parts.2": "undefined",
        "link_path_parts.3": "undefined",
        "link_path_parts.4": "undefined",
        "link_path_parts.5": "undefined",
      },
    };

    const dataLayerEventDropdown: FormEventInterface = {
      event: "event_data",
      event_data: {
        event_name: "form_response",
        type: "drop-down list",
        url: "http://localhost/test-url",
        text: "test value2",
        section: "dropdown section",
        action: "undefined",
        external: "undefined",
        link_domain: "http://localhost",
        "link_path_parts.1": "/test-url",
        "link_path_parts.2": "undefined",
        "link_path_parts.3": "undefined",
        "link_path_parts.4": "undefined",
        "link_path_parts.5": "undefined",
      },
    };
    const dataLayerEventText: FormEventInterface = {
      event: "event_data",
      event_data: {
        event_name: "form_response",
        type: instance.FREE_TEXT_FIELD_TYPE,
        url: "http://localhost/test-url",
        text: "test value",
        section: "text input section",
        action: "undefined",
        external: "undefined",
        link_domain: "http://localhost",
        "link_path_parts.1": "/test-url",
        "link_path_parts.2": "undefined",
        "link_path_parts.3": "undefined",
        "link_path_parts.4": "undefined",
        "link_path_parts.5": "undefined",
      },
    };
    const dataLayerEventRadio: FormEventInterface = {
      event: "event_data",
      event_data: {
        event_name: "form_response",
        type: "radio buttons",
        url: "http://localhost/test-url",
        text: "radio value",
        section: "radio section",
        action: "undefined",
        external: "undefined",
        link_domain: "http://localhost",
        "link_path_parts.1": "/test-url",
        "link_path_parts.2": "undefined",
        "link_path_parts.3": "undefined",
        "link_path_parts.4": "undefined",
        "link_path_parts.5": "undefined",
      },
    };
    const dataLayerEventTextarea: FormEventInterface = {
      event: "event_data",
      event_data: {
        event_name: "form_response",
        type: instance.FREE_TEXT_FIELD_TYPE,
        url: "http://localhost/test-url",
        text: "test value",
        section: "textarea section",
        action: "undefined",
        external: "undefined",
        link_domain: "http://localhost",
        "link_path_parts.1": "/test-url",
        "link_path_parts.2": "undefined",
        "link_path_parts.3": "undefined",
        "link_path_parts.4": "undefined",
        "link_path_parts.5": "undefined",
      },
    };
    expect(instance.pushToDataLayer).toBeCalledWith(dataLayerEventCheckbox);
    expect(instance.pushToDataLayer).toBeCalledWith(dataLayerEventDropdown);
    expect(instance.pushToDataLayer).toBeCalledWith(dataLayerEventText);
    expect(instance.pushToDataLayer).toBeCalledWith(dataLayerEventRadio);
    expect(instance.pushToDataLayer).toBeCalledWith(dataLayerEventTextarea);
  });
});

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

describe("form with radio buttons", () => {
  const action = new Event("submit", {
    bubbles: true,
    cancelable: true,
  });

  const spy = jest.spyOn(FormResponseTracker.prototype, "pushToDataLayer");

  test("datalayer event should be defined", () => {
    const instance = new FormResponseTracker();
    document.body.innerHTML =
      '<form action="/test-url" method="post">' +
      "<fieldset>" +
      "  <legend>test label questions</legend>" +
      '  <label for="male">test label male</label>' +
      '  <input type="radio" id="male" name="male" value="Male" checked/>' +
      '  <label for="female">test label female</label>' +
      '  <input type="radio" id="female" name="female" value="Male"/>' +
      "</fieldset>";
    '  <button id="button" type="submit">submit</button>' + "</form>";
    document.dispatchEvent(action);

    const dataLayerEvent: FormEventInterface = {
      event: "event_data",
      event_data: {
        event_name: "form_response",
        type: "radio buttons",
        url: "http://localhost/test-url",
        text: "test label male",
        section: "test label questions",
        action: "undefined",
        external: "undefined",
        link_domain: "http://localhost",
        "link_path_parts.1": "/test-url",
        "link_path_parts.2": "undefined",
        "link_path_parts.3": "undefined",
        "link_path_parts.4": "undefined",
        "link_path_parts.5": "undefined",
      },
    };
    expect(instance.pushToDataLayer).toBeCalledWith(dataLayerEvent);
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

    document.body.innerHTML =
      '<form action="/test-url" method="post">' +
      "<fieldset>" +
      "  <legend>test label questions</legend>" +
      '  <label for="question-1">test label question 1</label>' +
      '  <input type="checkbox" id="question-1" name="question-1" value="test value" checked/>' +
      '  <label for="question-2">test label question 2</label>' +
      '  <input type="checkbox" id="question-2" name="question-2" value="test value"/>' +
      "</fieldset>";
    '  <button id="button" type="submit">submit</button>' + "</form>";
    document.dispatchEvent(action);

    const dataLayerEvent: FormEventInterface = {
      event: "event_data",
      event_data: {
        event_name: "form_response",
        type: "checkbox",
        url: "http://localhost/test-url",
        text: "test label question 1",
        section: "test label questions",
        action: "undefined",
        external: "undefined",
        link_domain: "http://localhost",
        "link_path_parts.1": "/test-url",
        "link_path_parts.2": "undefined",
        "link_path_parts.3": "undefined",
        "link_path_parts.4": "undefined",
        "link_path_parts.5": "undefined",
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
        url: "http://localhost/test-url",
        text: "test value",
        section: "test label username",
        action: "undefined",
        external: "undefined",
        link_domain: "http://localhost",
        "link_path_parts.1": "/test-url",
        "link_path_parts.2": "undefined",
        "link_path_parts.3": "undefined",
        "link_path_parts.4": "undefined",
        "link_path_parts.5": "undefined",
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
        url: "http://localhost/test-url",
        text: "test value",
        section: "test label username",
        action: "undefined",
        external: "undefined",
        link_domain: "http://localhost",
        "link_path_parts.1": "/test-url",
        "link_path_parts.2": "undefined",
        "link_path_parts.3": "undefined",
        "link_path_parts.4": "undefined",
        "link_path_parts.5": "undefined",
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
        url: "http://localhost/test-url",
        text: "test value2",
        section: "test label username",
        action: "undefined",
        external: "undefined",
        link_domain: "http://localhost",
        "link_path_parts.1": "/test-url",
        "link_path_parts.2": "undefined",
        "link_path_parts.3": "undefined",
        "link_path_parts.4": "undefined",
        "link_path_parts.5": "undefined",
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
