import { describe, expect, jest, test } from "@jest/globals";
import { FormResponseTracker } from "./formTracker";
import { FormEventInterface, FormField } from "./formTracker.interface";

describe("FormResponseTracker", () => {
  //const newInstance = new FormResponseTracker();
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

  test("getFields should return a list of fields objects", () => {
    const instance = new FormResponseTracker();
    const form = document.createElement("form");
    form.innerHTML =
      '<input id="test" name="test" value="test value" type="text"/>';
    document.body.appendChild(form);
    expect(instance.getFields(form)).toEqual([
      {
        id: "test",
        name: "test",
        value: "test value",
        type: "text",
      },
    ]);
  });

  test("getFieldValue should return field value", () => {
    const instance = new FormResponseTracker();
    const fields: FormField[] = [
      { id: "test", name: "test", value: "test value", type: "test" },
    ];
    expect(instance.getFieldValue(fields)).toBe("test value");
  });

  test("getFieldType should return free text field if type is text", () => {
    const instance = new FormResponseTracker();
    const fields: FormField[] = [
      { id: "test", name: "test", value: "test value", type: "text" },
    ];
    expect(instance.getFieldType(fields)).toBe("free text field");
  });

  test("getFieldType should return free text field if type is textarea", () => {
    const instance = new FormResponseTracker();
    const fields: FormField[] = [
      { id: "test", name: "test", value: "test value", type: "textarea" },
    ];
    expect(instance.getFieldType(fields)).toBe("free text field");
  });

  test("getFieldType should return drop-down list if type is select-one", () => {
    const instance = new FormResponseTracker();
    const fields: FormField[] = [
      { id: "test", name: "test", value: "test value", type: "select-one" },
    ];
    expect(instance.getFieldType(fields)).toBe("drop-down list");
  });

  test("getFieldType should return checkbox if type is checkbox", () => {
    const instance = new FormResponseTracker();
    const fields: FormField[] = [
      { id: "test", name: "test", value: "test value", type: "checkbox" },
    ];
    expect(instance.getFieldType(fields)).toBe("checkbox");
  });

  test("getFieldType should return radio if type is radio", () => {
    const instance = new FormResponseTracker();
    const fields: FormField[] = [
      { id: "test", name: "test", value: "test value", type: "radio" },
    ];
    expect(instance.getFieldType(fields)).toBe("radio");
  });

  test("getFieldLabel should return field label", () => {
    const instance = new FormResponseTracker();
    const label = document.createElement("label");
    label.innerHTML = "test label";
    label.textContent = "test label";
    document.body.appendChild(label);
    expect(instance.getFieldLabel()).toBe("test label");
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
        type: "free text field",
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
        type: "free text field",
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
