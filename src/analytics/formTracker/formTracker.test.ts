import { describe, expect, jest, test } from "@jest/globals";
import { FormTracker } from "./formTracker";
import { FormEventInterface, FormField } from "./formTracker.interface";

window.DI = { analyticsGa4: { cookie: { consent: true } } };

describe("FormTracker", () => {
  test("getFields should return a list of fields objects", () => {
    const instance = new FormTracker();
    const form = document.createElement("form");
    form.innerHTML =
      '<input id="test" name="test" value="test value" type="text"/>';
    document.body.appendChild(form);
    expect(instance.getFormFields(form)).toEqual([
      {
        id: "test",
        name: "test",
        value: "test value",
        type: "text",
      },
    ]);
  });

  test("getFieldValue should return field value", () => {
    const instance = new FormTracker();
    const fields: FormField[] = [
      { id: "test", name: "test", value: "test value", type: "test" },
    ];
    expect(instance.getFieldValue(fields)).toBe("test value");
  });

  test("getFieldType should return free text field if type is text", () => {
    const instance = new FormTracker();
    const fields: FormField[] = [
      { id: "test", name: "test", value: "test value", type: "text" },
    ];
    expect(instance.getFieldType(fields)).toBe(instance.FREE_TEXT_FIELD_TYPE);
  });

  test("getFieldType should return free text field if type is textarea", () => {
    const instance = new FormTracker();
    const fields: FormField[] = [
      { id: "test", name: "test", value: "test value", type: "textarea" },
    ];
    expect(instance.getFieldType(fields)).toBe(instance.FREE_TEXT_FIELD_TYPE);
  });

  test("getFieldType should return drop-down list if type is select-one", () => {
    const instance = new FormTracker();
    const fields: FormField[] = [
      { id: "test", name: "test", value: "test value", type: "select-one" },
    ];
    expect(instance.getFieldType(fields)).toBe("drop-down list");
  });

  test("getFieldType should return checkbox if type is checkbox", () => {
    const instance = new FormTracker();
    const fields: FormField[] = [
      { id: "test", name: "test", value: "test value", type: "checkbox" },
    ];
    expect(instance.getFieldType(fields)).toBe("checkbox");
  });

  test("getFieldType should return radio buttons if type is radio", () => {
    const instance = new FormTracker();
    const fields: FormField[] = [
      { id: "test", name: "test", value: "test value", type: "radio" },
    ];
    expect(instance.getFieldType(fields)).toBe("radio buttons");
  });

  test("getFieldLabel should return field label", () => {
    const instance = new FormTracker();
    const label = document.createElement("label");
    label.innerHTML = "test label";
    label.textContent = "test label";
    document.body.appendChild(label);
    expect(instance.getFieldLabel()).toBe("test label");
  });

  test("getSubmitUrl should return submit url", () => {
    const instance = new FormTracker();
    const form = document.createElement("form");
    form.action = "/test-url";
    form.innerHTML =
      '<input id="test" name="test" value="test value" type="text"/>';
    document.body.appendChild(form);
    expect(instance.getSubmitUrl(form)).toBe("http://localhost/test-url");
  });

  test("getSubmitUrl should return submit url with the query params also", () => {
    const instance = new FormTracker();
    const form = document.createElement("form");
    form.action = "/test-url?edit=true";
    form.innerHTML =
      '<input id="test" name="test" value="test value" type="text"/>';
    document.body.appendChild(form);
    expect(instance.getSubmitUrl(form)).toBe(
      "http://localhost/test-url?edit=true",
    );
  });
});
