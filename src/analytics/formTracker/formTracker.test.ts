import { describe, expect, jest, test, beforeEach } from "@jest/globals";
import { FormTracker } from "./formTracker";
import { FormEventInterface, FormField } from "./formTracker.interface";

window.DI = { analyticsGa4: { cookie: { consent: true } } };

describe("FormTracker", () => {
  let instance: FormTracker;

  beforeEach(() => {
    instance = new FormTracker();
    // Remove any existing elements from document.body if needed
    document.body.innerHTML = "";
  });
  test("getFields should return a list of fields objects", () => {
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
  test("getFormFields should return checkbox values as string , separated by commas if part of checkbox group", () => {
    const form = document.createElement("form");
    form.innerHTML =
      ' <label for="test">test value</label>' +
      '<input id="test" name="test" value="test value" type="checkbox" checked/>' +
      ' <label for="test1">test value2</label>' +
      '<input id="test1" name="test" value="test value2" type="checkbox" checked/>';
    document.body.appendChild(form);
    expect(instance.getFormFields(form)).toEqual([
      {
        id: "test",
        name: "test",
        value: "test value, test value2",
        type: "checkbox",
      },
    ]);
  });

  test("getFieldValue should return field value", () => {
    const fields: FormField[] = [
      { id: "test", name: "test", value: "test value", type: "test" },
    ];
    expect(instance.getFieldValue(fields)).toBe("test value");
  });

  test("getFieldType should return free text field if type is text", () => {
    const fields: FormField[] = [
      { id: "test", name: "test", value: "test value", type: "text" },
    ];
    expect(instance.getFieldType(fields)).toBe(instance.FREE_TEXT_FIELD_TYPE);
  });

  test("getFieldType should return free text field if type is textarea", () => {
    const fields: FormField[] = [
      { id: "test", name: "test", value: "test value", type: "textarea" },
    ];
    expect(instance.getFieldType(fields)).toBe(instance.FREE_TEXT_FIELD_TYPE);
  });

  test("getFieldType should return drop-down list if type is select-one", () => {
    const fields: FormField[] = [
      { id: "test", name: "test", value: "test value", type: "select-one" },
    ];
    expect(instance.getFieldType(fields)).toBe("drop-down list");
  });

  test("getFieldType should return checkbox if type is checkbox", () => {
    const fields: FormField[] = [
      { id: "test", name: "test", value: "test value", type: "checkbox" },
    ];
    expect(instance.getFieldType(fields)).toBe("checkbox");
  });

  test("getFieldType should return radio buttons if type is radio", () => {
    const fields: FormField[] = [
      { id: "test", name: "test", value: "test value", type: "radio" },
    ];
    expect(instance.getFieldType(fields)).toBe("radio buttons");
  });

  test("getFieldLabel should return field label", () => {
    const label = document.createElement("label");
    label.textContent = "test label";
    document.body.appendChild(label);
    expect(instance.getFieldLabel()).toBe("test label");
    document.body.removeChild(label);
  });

  test("getSubmitUrl should return submit url", () => {
    const form = document.createElement("form");
    form.action = "/test-url";
    form.innerHTML =
      '<input id="test" name="test" value="test value" type="text"/>';
    document.body.appendChild(form);
    expect(instance.getSubmitUrl(form)).toBe("http://localhost/test-url");
  });

  test("getSubmitUrl should return submit url with the query params also", () => {
    const form = document.createElement("form");
    form.action = "/test-url?edit=true";
    form.innerHTML =
      '<input id="test" name="test" value="test value" type="text"/>';
    document.body.appendChild(form);
    expect(instance.getSubmitUrl(form)).toBe(
      "http://localhost/test-url?edit=true",
    );
  });

  test("getSectionValue should return label text if field is not within a fieldset ", () => {
    const formField: FormField = {
      id: "fieldId",
      name: "fieldName",
      value: "fieldValue",
      type: "text",
    };

    // Create label and set for attribute

    const label = document.createElement("label");
    label.htmlFor = formField.id;
    label.textContent = "test label";
    document.body.appendChild(label);

    // Create input and set id attribute to the same as label for attribute

    const input = document.createElement("input");
    input.id = formField.id;
    document.body.appendChild(input);
    expect(instance.getSectionValue(formField)).toBe("test label");
  });
  test("getSectionValue returns legend text when input is inside a fieldset with legend , i.e radio or checkbox ", () => {
    const formField: FormField = {
      id: "fieldId",
      name: "fieldName",
      value: "fieldValue",
      type: "text",
    };
    // Create fieldset and legend
    const fieldset = document.createElement("fieldset");
    const legend = document.createElement("legend");
    legend.textContent = "test legend";
    fieldset.appendChild(legend);

    // Create input and append to fieldset
    const input = document.createElement("input");
    input.id = formField.id;
    fieldset.appendChild(input);

    // Append fieldset to the document body
    document.body.appendChild(fieldset);
    expect(instance.getSectionValue(formField)).toBe("test legend");
  });
  test("getSectionValue should return undefined if there is no label or legend", () => {
    const formField: FormField = {
      id: "fieldId",
      name: "fieldName",
      value: "fieldValue",
      type: "text",
    };

    // Create input and set id attribute to the same as label for attribute
    const input = document.createElement("input");
    input.id = formField.id;
    document.body.appendChild(input);
    expect(instance.getSectionValue(formField)).toBe("undefined");
  });
});
