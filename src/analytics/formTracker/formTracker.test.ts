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

    // Create input and set ID attribute to the same as label FOR attribute

    const input = document.createElement("input");
    input.id = formField.id;
    document.body.appendChild(input);
    expect(instance.getSectionValue(formField)).toBe("test label");
  });
  test("getSectionValue returns legend text when input is inside a fieldset with legend , i.e radio", () => {
    const formField: FormField = {
      id: "fieldId",
      name: "fieldName",
      value: "fieldValue",
      type: "radio buttons",
    };
    // Create fieldset and legend
    const fieldset = document.createElement("fieldset");
    const legend = document.createElement("legend");
    legend.textContent = "test legend";
    fieldset.appendChild(legend);

    // Create radio and append to fieldset
    const input = document.createElement("input");
    input.type = "radio buttons";
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

    // Create input and set ID attribute to the same as label FOR attribute
    const input = document.createElement("input");
    input.id = formField.id;
    document.body.appendChild(input);
    expect(instance.getSectionValue(formField)).toBe("undefined");
  });
  test("getSectionValue should return h1 with rel attribute matching element.id if there is a radio button without a legend", () => {
    const formField: FormField = {
      id: "fieldId",
      name: "fieldName",
      value: "fieldValue",
      type: "radio buttons",
    };

    // Create radio and set ID attribute to the same as label FOR attribute
    const radio = document.createElement("input");
    radio.type = "radio buttons";
    radio.id = formField.id;

    const label = document.createElement("label");
    label.htmlFor = formField.id; // Associates the label with the radio by matching their IDs
    label.textContent = "Your Label Text"; // Set the label text

    // Append the radio and label to the document
    document.body.appendChild(radio);
    document.body.appendChild(label);
    const h1 = document.createElement("h1");
    h1.textContent = "Hello, World!";
    h1.setAttribute("rel", formField.id);
    document.body.appendChild(h1);
    expect(instance.getSectionValue(formField)).toBe("Hello, World!");
  });
  test("getSectionValue should return h2 with rel attribute matching element.id if there is a checkbox without a legend", () => {
    const formField: FormField = {
      id: "fieldId",
      name: "fieldName",
      value: "fieldValue",
      type: "checkbox",
    };

    // Create checkbox and set ID attribute to the same as label FOR attribute
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = formField.id;

    const label = document.createElement("label");
    label.htmlFor = formField.id; // Associates the label with the checkbox by matching their IDs
    label.textContent = "Your Label Text"; // Set the label text

    // Append the checkbox and label to the document
    document.body.appendChild(checkbox);
    document.body.appendChild(label);
    const h2 = document.createElement("h2");
    h2.textContent = "Hello, World!";
    h2.setAttribute("rel", formField.id);
    document.body.appendChild(h2);
    expect(instance.getSectionValue(formField)).toBe("Hello, World!");
  });
  test("getSectionValue should return first h1, if there is a checkbox without a legend", () => {
    const formField: FormField = {
      id: "fieldId",
      name: "fieldName",
      value: "fieldValue",
      type: "checkbox",
    };

    // Create checkbox and set ID attribute to the same as label FOR attribute
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = formField.id;

    const label = document.createElement("label");
    label.htmlFor = formField.id; // Associates the label with the checkbox by matching their IDs
    label.textContent = "Your Label Text"; // Set the label text

    // Append the checkbox and label to the document
    document.body.appendChild(checkbox);
    document.body.appendChild(label);
    const h1 = document.createElement("h1");
    h1.textContent = "Hello, World!";
    document.body.appendChild(h1);
    const secondh1 = document.createElement("h1");
    secondh1.textContent = "Bye, World!";
    document.body.appendChild(secondh1);
    expect(instance.getSectionValue(formField)).toBe("Hello, World!");
  });
  test("getSectionValue should return the FIRST h2 if there is a checkbox with a legend", () => {
    const formField: FormField = {
      id: "fieldId",
      name: "fieldName",
      value: "fieldValue",
      type: "checkbox",
    };

    // Create checkbox and set ID attribute to the same as label FOR attribute
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = formField.id;

    const label = document.createElement("label");
    label.htmlFor = formField.id; // Associates the label with the checkbox by matching their IDs
    label.textContent = "Your Label Text"; // Set the label text

    // Append the checkbox and label to the document
    document.body.appendChild(checkbox);
    document.body.appendChild(label);
    const h2 = document.createElement("h2");
    h2.textContent = "Hello, World!";
    document.body.appendChild(h2);
    const secondh2 = document.createElement("h2");
    secondh2.textContent = "Bye, World!";
    document.body.appendChild(secondh2);
    expect(instance.getSectionValue(formField)).toBe("Hello, World!");
  });
  test("getSectionValue should return the FIRST h2 when there are radio buttons without a legend", () => {
    const formField: FormField = {
      id: "fieldId",
      name: "fieldName",
      value: "fieldValue",
      type: "radio buttons",
    };

    // Create checkbox and set ID attribute to the same as label FOR attribute
    const radio = document.createElement("input");
    radio.type = "radio buttons";
    radio.id = formField.id;

    const label = document.createElement("label");
    label.htmlFor = formField.id; // Associates the label with the checkbox by matching their IDs
    label.textContent = "Your Label Text"; // Set the label text

    // Append the radio buttons and label to the document
    document.body.appendChild(radio);
    document.body.appendChild(label);
    const h2 = document.createElement("h2");
    h2.setAttribute("rel", formField.id);
    h2.textContent = "Hello, World!";
    document.body.appendChild(h2);
    expect(instance.getSectionValue(formField)).toBe("Hello, World!");
  });
  test("getSectionValue should return label when there is a dropdown with a label", () => {
    const formField: FormField = {
      id: "fieldId",
      name: "fieldName",
      value: "fieldValue",
      type: "dropdown",
    };

    // Create dropdown and set ID attribute to the same as label FOR attribute
    const dropdown = document.createElement("input");
    dropdown.type = "dropdown";
    dropdown.id = formField.id;

    const label = document.createElement("label");
    label.htmlFor = formField.id; // Associates the label with the dropdown by matching their IDs
    label.textContent = "Your Label Text"; // Set the label text

    // Append the dropdown and label to the document
    document.body.appendChild(dropdown);
    document.body.appendChild(label);

    expect(instance.getSectionValue(formField)).toBe("Your Label Text");
  });
});
