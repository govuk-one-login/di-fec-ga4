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

  test("isFormValid should return false if field value is empty", () => {
    const fields: FormField[] = [
      { id: "test", name: "test", value: "", type: "textarea" },
    ];
    expect(instance.isFormValid(fields)).toBe(false);
  });

  test("isFormValid should return true if field value is here", () => {
    const fields: FormField[] = [
      { id: "test", name: "test", value: "testtest", type: "textarea" },
    ];
    expect(instance.isFormValid(fields)).toBe(true);
  });

  test("isFormValid should return false if one of the field value is empty", () => {
    const fields: FormField[] = [
      { id: "test", name: "test", value: "", type: "textarea" },
      { id: "test2", name: "test2", value: "test2", type: "checkbox" },
    ];
    expect(instance.isFormValid(fields)).toBe(false);
  });

  test("isFormValid should return true if all field values are here", () => {
    const fields: FormField[] = [
      { id: "test", name: "test", value: "test1", type: "textarea" },
      { id: "test2", name: "test2", value: "test2", type: "checkbox" },
    ];
    expect(instance.isFormValid(fields)).toBe(true);
  });

  //getFormElement Tests
  test("getFormElement should return the form element", () => {
    const divElement = document.createElement("div");
    divElement.id = "main-content";
    const form = document.createElement("form");
    form.innerHTML =
      '<input id="text" name="text" value="text value" type="text"/>' +
      ' <label for="checkbox">checkbox value</label>' +
      '<input id="checkbox" name="checkbox" value="checkbox value" type="checkbox" checked/>' +
      '<label for="selectField">Select Field:</label>' +
      '<select id="selectField" name="selectField">' +
      '  <option value="Option 1">Option 1</option>' +
      '  <option value="Option 2" selected>Option 2</option>' +
      "</select>";
    divElement.appendChild(form);
    document.body.appendChild(divElement);
    expect(instance.getFormElement()).toEqual(form);
  });

  // getFormFields Tests
  test("getFormFields should return a list of fields objects", () => {
    const form = document.createElement("form");
    form.innerHTML =
      '<input id="text" name="text" value="text value" type="text"/>' +
      ' <label for="checkbox">checkbox value</label>' +
      '<input id="checkbox" name="checkbox" value="checkbox value" type="checkbox" checked/>' +
      '<label for="selectField">Select Field:</label>' +
      '<select id="selectField" name="selectField">' +
      '  <option value="Option 1">Option 1</option>' +
      '  <option value="Option 2" selected>Option 2</option>' +
      "</select>";
    document.body.appendChild(form);
    expect(instance.getFormFields(form)).toEqual([
      {
        id: "text",
        name: "text",
        value: "text value",
        type: "text",
      },
      {
        id: "checkbox",
        name: "checkbox",
        value: "checkbox value",
        type: "checkbox",
      },
      {
        id: "selectField",
        name: "selectField",
        value: "Option 2",
        type: "select-one",
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

  // isExcludedType Tests

  test("isExcludedType should return true for hidden input type", () => {
    const element: HTMLInputElement = { type: "hidden" } as HTMLInputElement;
    const result = instance.isExcludedType(element);
    expect(result).toBe(true);
  });

  test("isExcludedType should return true for submit input type", () => {
    const element: HTMLInputElement = { type: "submit" } as HTMLInputElement;
    const result = instance.isExcludedType(element);
    expect(result).toBe(true);
  });
  test("isExcludedType should return true for fieldset input type", () => {
    const element: HTMLInputElement = { type: "fieldset" } as HTMLInputElement;
    const result = instance.isExcludedType(element);
    expect(result).toBe(true);
  });
  test("isExcludedType should return false for other input types", () => {
    const element: HTMLInputElement = { type: "text" } as HTMLInputElement;
    const result = instance.isExcludedType(element);
    expect(result).toBe(false);
  });

  // getElementValue Tests

  test("getElementValue should return trimmed label text content", () => {
    const element: HTMLInputElement = document.createElement("input");
    element.id = "inputId";

    // Create a label element and associate it with the input
    const label: HTMLLabelElement = document.createElement("label");
    label.setAttribute("for", "inputId");
    label.textContent = " Test Label ";

    // Append the input and label to the document body
    document.body.appendChild(element);
    document.body.appendChild(label);

    const result = instance.getElementValue(element);
    expect(result).toBe("Test Label");
  });

  test("getElementValue should return 'undefined' for a non-existing label", () => {
    const element: HTMLInputElement = document.createElement("input");
    element.id = "inputId";

    // Append the input to the document body
    document.body.appendChild(element);

    const result = instance.getElementValue(element);
    expect(result).toBe("undefined");
  });

  // processCheckbox Tests

  test("processCheckbox should add checkbox to selected fields", () => {
    const element: HTMLInputElement = document.createElement("input");
    element.id = "checkboxId";
    element.name = "checkboxName";
    element.type = "checkbox";
    element.checked = true;

    // Create a label and associate it with the checkbox
    const label: HTMLLabelElement = document.createElement("label");
    label.setAttribute("for", "checkboxId");
    label.textContent = "checkbox label";

    document.body.appendChild(element);
    document.body.appendChild(label);

    instance.processCheckbox(element);
    expect(instance["selectedFields"]).toEqual([
      {
        id: "checkboxId",
        name: "checkboxName",
        value: "checkbox label",
        type: "checkbox",
      },
    ]);
  });

  test("processCheckbox should add only selected checkbox to selected fields", () => {
    const element: HTMLInputElement = document.createElement("input");
    element.id = "checkboxId";
    element.name = "checkboxName";
    element.type = "checkbox";
    element.checked = true;

    // Create a label and associate it with the checkbox
    const label: HTMLLabelElement = document.createElement("label");
    label.setAttribute("for", "checkboxId");
    label.textContent = "checkbox label";

    const element2: HTMLInputElement = document.createElement("input");
    element2.id = "checkboxId2";
    element2.name = "checkboxName2";
    element2.type = "checkbox";

    // Create a label and associate it with the checkbox
    const label2: HTMLLabelElement = document.createElement("label");
    label2.setAttribute("for", "checkboxId2");
    label2.textContent = "checkbox2 label";

    document.body.appendChild(element);
    document.body.appendChild(label);
    document.body.appendChild(element2);
    document.body.appendChild(label2);

    instance.processCheckbox(element);
    expect(instance["selectedFields"]).toEqual([
      {
        id: "checkboxId",
        name: "checkboxName",
        value: "checkbox label",
        type: "checkbox",
      },
    ]);
  });

  test("processCheckbox should return the values of checkboxes which are part of the same group as a string separated by commas", () => {
    const element: HTMLInputElement = document.createElement("input");
    element.id = "checkboxId";
    element.name = "checkboxName";
    element.type = "checkbox";
    element.checked = true;

    const secondElement: HTMLInputElement = document.createElement("input");
    secondElement.id = "secondCheckboxId";
    secondElement.name = "checkboxName";
    secondElement.type = "checkbox";
    secondElement.checked = true;

    // Create a label and associate it with the checkbox1
    const label: HTMLLabelElement = document.createElement("label");
    label.setAttribute("for", "checkboxId");
    label.textContent = "checkbox1 label";

    // Create a label and associate it with the checkbox2
    const label2: HTMLLabelElement = document.createElement("label");
    label2.setAttribute("for", "secondCheckboxId");
    label2.textContent = "checkbox2 label";

    document.body.appendChild(element);
    document.body.appendChild(secondElement);
    document.body.appendChild(label);
    document.body.appendChild(label2);

    instance.processCheckbox(element);
    instance.processCheckbox(secondElement);
    expect(instance["selectedFields"]).toEqual([
      {
        id: "checkboxId",
        name: "checkboxName",
        value: "checkbox1 label, checkbox2 label",
        type: "checkbox",
      },
    ]);
  });

  // processRadio Tests

  test("processRadio should add radio button to selected fields", () => {
    const element: HTMLInputElement = document.createElement("input");
    element.id = "radioId";
    element.name = "radioName";
    element.type = "radio";
    element.checked = true;

    // Create a label and associate it with the radio
    const label: HTMLLabelElement = document.createElement("label");
    label.setAttribute("for", "radioId");
    label.textContent = "radio label";

    document.body.appendChild(element);
    document.body.appendChild(label);

    instance.processCheckbox(element);
    expect(instance["selectedFields"]).toEqual([
      {
        id: "radioId",
        name: "radioName",
        value: "radio label",
        type: "radio",
      },
    ]);
  });

  // processTextElement Tests

  test("processTextElement should add text input to selected fields", () => {
    const element: HTMLInputElement = document.createElement("input");
    element.id = "textId";
    element.name = "textName";
    element.type = "text";
    element.value = "text value";

    document.body.appendChild(element);

    instance.processTextElement(element);
    expect(instance["selectedFields"]).toEqual([
      {
        id: "textId",
        name: "textName",
        value: "text value",
        type: "text",
      },
    ]);
  });

  test("processTextElement should add textarea to selected fields", () => {
    const element: HTMLTextAreaElement = document.createElement("textarea");
    element.id = "textareaId";
    element.name = "textareaName";
    element.value = "textarea value";

    document.body.appendChild(element);

    instance.processTextElement(element);
    expect(instance["selectedFields"]).toEqual([
      {
        id: "textareaId",
        name: "textareaName",
        value: "textarea value",
        type: "textarea",
      },
    ]);
  });

  // processSelectOne Tests

  test("processSelectOne should add select-one element to selected fields", () => {
    const element: HTMLSelectElement = document.createElement("select");
    element.id = "selectId";
    element.name = "selectName";
    element.setAttribute("select-one", "");

    // Create and append option elements
    const option1 = document.createElement("option");
    option1.text = "Option 1";
    element.add(option1);

    const option2 = document.createElement("option");
    option2.text = "Option 2";
    element.add(option2);

    document.body.appendChild(element);

    // Set selectedIndex
    element.selectedIndex = 1;

    instance.processSelectOne(element);
    expect(instance["selectedFields"]).toEqual([
      {
        id: "selectId",
        name: "selectName",
        value: "Option 2",
        type: "select-one",
      },
    ]);
  });

  test("getFieldValue should return field value", () => {
    const fields: FormField[] = [
      { id: "test", name: "test", value: "test value", type: "checkbox" },
    ];
    expect(instance.getFieldValue(fields)).toBe("test value");
  });

  test("getFieldValue should return empty value if type is text", () => {
    const fields: FormField[] = [
      { id: "test", name: "test", value: "test value", type: "text" },
    ];
    expect(instance.getFieldValue(fields)).toBe("");
  });

  test("getFieldValue should return empty value if type is textarea", () => {
    const fields: FormField[] = [
      { id: "test", name: "test", value: "test value", type: "textarea" },
    ];
    expect(instance.getFieldValue(fields)).toBe("");
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

  test("getHeadingText should return h1 content if it has a rel attribute matching commonId", () => {
    // create h1 with rel attribute

    const h1 = document.createElement("h1");
    h1.textContent = "H1 with rel attribute";
    h1.setAttribute("rel", "example");

    document.body.appendChild(h1);

    expect(instance.getHeadingText("example_1")).toBe("H1 with rel attribute");
  });

  test("getHeadingText should return undefined if there is no h1/h2 with a rel attribute matching commonId", () => {
    // create h2
    const h2 = document.createElement("h2");
    document.body.appendChild(h2);

    expect(instance.getHeadingText("example_1")).toBe("undefined");
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
      type: "radio",
    };

    // Create radio and set ID attribute to the same as label FOR attribute
    const radio = document.createElement("input");
    radio.type = "radio";
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
  test("getSectionValue should return h1 with rel attribute matching element.id if there is a radio button without a legend, inside a fieldset", () => {
    const formField: FormField = {
      id: "fieldId-1",
      name: "fieldName",
      value: "fieldValue",
      type: "radio",
    };

    // Create radio and set ID attribute to the same as label FOR attribute
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.id = formField.id;

    const label = document.createElement("label");
    label.htmlFor = formField.id; // Associates the label with the radio by matching their IDs
    label.textContent = "Your Label Text"; // Set the label text

    // Create fieldset element
    const fieldset = document.createElement("fieldset");

    // Append the radio and label to the fieldset
    fieldset.appendChild(radio);
    fieldset.appendChild(label);

    // Append the fieldset to the document
    document.body.appendChild(fieldset);
    const h1 = document.createElement("h1");
    h1.textContent = "Hello, World!";
    h1.setAttribute("rel", "fieldId");
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
      type: "radio",
    };

    // Create checkbox and set ID attribute to the same as label FOR attribute
    const radio = document.createElement("input");
    radio.type = "radio";
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
  test("isDateFields should return true if date fields are present", () => {
    const formFields: FormField[] = [
      {
        id: "fieldId-day",
        name: "fieldId-day",
        value: "01",
        type: "text",
      },
      {
        id: "fieldId-month",
        name: "fieldId-month",
        value: "01",
        type: "text",
      },
      {
        id: "fieldId-year",
        name: "fieldId-year",
        value: "2000",
        type: "text",
      },
    ];
    expect(instance.isDateFields(formFields)).toBe(true);
  });
  test("isDateFields should return true if date fields are present", () => {
    const formFields: FormField[] = [
      {
        id: "fieldId-day",
        name: "fieldId-day",
        value: "01",
        type: "text",
      },
      {
        id: "fieldId-month",
        name: "fieldId-month",
        value: "01",
        type: "text",
      },
      {
        id: "fieldId-year",
        name: "fieldId-year",
        value: "2000",
        type: "text",
      },
      {
        id: "fieldname",
        name: "fieldname",
        value: "myname",
        type: "text",
      },
      {
        id: "fieldId2-day",
        name: "fieldId2-day",
        value: "01",
        type: "text",
      },
      {
        id: "fieldId2-month",
        name: "fieldId2-month",
        value: "01",
        type: "text",
      },
      {
        id: "fieldId2-year",
        name: "fieldId2-year",
        value: "2000",
        type: "text",
      },
    ];
    expect(instance.isDateFields(formFields)).toBe(true);
  });
  test("isDateFields should return false if date fields are not present", () => {
    const formFields: FormField[] = [
      {
        id: "fieldId",
        name: "fieldId",
        value: "test",
        type: "text",
      },
    ];
    expect(instance.isDateFields(formFields)).toBe(false);
  });
  test("combineDateFields should return 1 specific formField from date fields", () => {
    const formFields: FormField[] = [
      {
        id: "fieldId-day",
        name: "fieldId-day",
        value: "01",
        type: "text",
      },
      {
        id: "fieldId-month",
        name: "fieldId-month",
        value: "01",
        type: "text",
      },
      {
        id: "fieldId-year",
        name: "fieldId-year",
        value: "2000",
        type: "text",
      },
    ];

    const result: FormField[] = [
      {
        id: "fieldId-day",
        name: "fieldId",
        value: "01-01-2000",
        type: "date",
      },
    ];
    expect(instance.combineDateFields(formFields)).toStrictEqual(result);
  });
  test("combineDateFields should return 2 formFields from date fields", () => {
    const formFields: FormField[] = [
      {
        id: "fieldId-day",
        name: "fieldId-day",
        value: "01",
        type: "text",
      },
      {
        id: "fieldId-month",
        name: "fieldId-month",
        value: "01",
        type: "text",
      },
      {
        id: "fieldId-year",
        name: "fieldId-year",
        value: "2000",
        type: "text",
      },
      {
        id: "fieldId2-day",
        name: "fieldId2-day",
        value: "02",
        type: "text",
      },
      {
        id: "fieldId2-month",
        name: "fieldId2-month",
        value: "02",
        type: "text",
      },
      {
        id: "fieldId2-year",
        name: "fieldId2-year",
        value: "2002",
        type: "text",
      },
    ];

    const result: FormField[] = [
      {
        id: "fieldId-day",
        name: "fieldId",
        value: "01-01-2000",
        type: "date",
      },
      {
        id: "fieldId2-day",
        name: "fieldId2",
        value: "02-02-2002",
        type: "date",
      },
    ];
    expect(instance.combineDateFields(formFields)).toStrictEqual(result);
  });
});
