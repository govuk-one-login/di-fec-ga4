import { describe, expect, jest, test, beforeEach } from "@jest/globals";
import { FormErrorTracker } from "./formErrorTracker";
import {
  FormEventInterface,
  FormField,
} from "../formTracker/formTracker.interface";

window.DI = { analyticsGa4: { cookie: { consent: true } } };

describe("FormErrorTracker", () => {
  let instance: FormErrorTracker;

  beforeEach(() => {
    instance = new FormErrorTracker();
    // Remove any existing elements from document.body if needed
    document.body.innerHTML = "";
  });
  const spy = jest.spyOn(FormErrorTracker.prototype, "pushToDataLayer");
  const trackFormErrorSpy = jest.spyOn(
    FormErrorTracker.prototype,
    "trackFormError",
  );

  test("trackFormError should return false if not cookie consent", () => {
    window.DI.analyticsGa4.cookie.consent = false;

    instance.trackFormError();
    expect(instance.trackFormError).toReturnWith(false);
  });
  test("form error tracker should define a DL for each field in form", () => {
    window.DI.analyticsGa4.cookie.consent = true;
    document.body.innerHTML =
      '<div id="main-content">' +
      '<form action="/test-url" method="post">' +
      '<div class="govuk-form-group govuk-form-group--error">' +
      "<fieldset>" +
      "  <legend>checked section</legend>" +
      '  <label for="questionType">checked value</label>' +
      '  <p id="questionType-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> Select one checkbox</p>' +
      '  <input type="checkbox" id="questionType" name="questionType" value="checkedValue" />' +
      '  <label for="questionType-2">checked value2</label>' +
      '  <input type="checkbox" id="questionType-2" name="questionType" value="checkedValue2" />' +
      "</fieldset>" +
      "</div>" +
      '<div class="govuk-form-group govuk-form-group--error">' +
      '  <label for="region">dropdown section</label>' +
      '  <p id="region-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> Select one option from dropdown</p>' +
      '  <select id="region" name="Region"><option value="test value">test value</option><option value="test value2" >test value2</option></select>' +
      "</div>" +
      '<div class="govuk-form-group govuk-form-group--error">' +
      "<fieldset>" +
      "  <legend>radio section</legend>" +
      '  <p id="male-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> Select one radio option </p>' +
      '  <label for="male">radio value</label>' +
      '  <input type="radio" id="male" name="radioGroup" value="radio value"/>' +
      '  <label for="female">radio value 2</label>' +
      '  <input type="radio" id="female" name="radioGroup" value="radio value 2"/>' +
      "</fieldset>" +
      "</div>" +
      '<div class="govuk-form-group govuk-form-group--error">' +
      '  <label for="feedback">textarea section</label>' +
      '  <p id="feedback-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> Please give us your feedback</p>' +
      '  <textarea id="feedback" name="Feedback" /></textarea>' +
      "</div>" +
      '<div class="govuk-form-group govuk-form-group--error">' +
      '  <label for="email">text input section</label>' +
      '  <p id="email-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> Please give us your email</p>' +
      '  <input type ="text" id="email" name="Email" /></input>' +
      "</div>" +
      '<div class="govuk-form-group govuk-form-group--error">' +
      '  <label for="password">password input section</label>' +
      '  <p id="password-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> Please give us your password</p>' +
      '  <input type ="password" id="password" name="password" /></input>' +
      "</div>" +
      '  <button id="button" type="submit">submit</button>' +
      "</form>" +
      "</div>";

    const dataLayerEventCheckbox: FormEventInterface = {
      event: "event_data",
      event_data: {
        event_name: "form_error",
        type: "checkbox",
        url: "http://localhost/test-url",
        text: "error: select one checkbox",
        section: "checked section",
        action: "error",
        external: "false",
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
        event_name: "form_error",
        type: "drop-down list",
        url: "http://localhost/test-url",
        text: "error: select one option from dropdown",
        section: "dropdown section",
        action: "error",
        external: "false",
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
        event_name: "form_error",
        type: "radio buttons",
        url: "http://localhost/test-url",
        text: "error: select one radio option",
        section: "radio section",
        action: "error",
        external: "false",
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
        event_name: "form_error",
        type: instance.FREE_TEXT_FIELD_TYPE,
        url: "http://localhost/test-url",
        text: "error: please give us your feedback",
        section: "textarea section",
        action: "error",
        external: "false",
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
        event_name: "form_error",
        type: instance.FREE_TEXT_FIELD_TYPE,
        url: "http://localhost/test-url",
        text: "error: please give us your email",
        section: "text input section",
        action: "error",
        external: "false",
        link_domain: "http://localhost",
        "link_path_parts.1": "/test-url",
        "link_path_parts.2": "undefined",
        "link_path_parts.3": "undefined",
        "link_path_parts.4": "undefined",
        "link_path_parts.5": "undefined",
      },
    };

    const dataLayerEventPassword: FormEventInterface = {
      event: "event_data",
      event_data: {
        event_name: "form_error",
        type: instance.FREE_TEXT_FIELD_TYPE,
        url: "http://localhost/test-url",
        text: "error: please give us your password",
        section: "password input section",
        action: "error",
        external: "false",
        link_domain: "http://localhost",
        "link_path_parts.1": "/test-url",
        "link_path_parts.2": "undefined",
        "link_path_parts.3": "undefined",
        "link_path_parts.4": "undefined",
        "link_path_parts.5": "undefined",
      },
    };
    instance.trackFormError();

    expect(instance.pushToDataLayer).toBeCalledWith(dataLayerEventDropdown);
    expect(instance.pushToDataLayer).toBeCalledWith(dataLayerEventRadio);
    expect(instance.pushToDataLayer).toBeCalledWith(dataLayerEventTextarea);
    expect(instance.pushToDataLayer).toBeCalledWith(dataLayerEventText);
    expect(instance.pushToDataLayer).toBeCalledWith(dataLayerEventPassword);
    expect(instance.pushToDataLayer).toBeCalledWith(dataLayerEventCheckbox);
  });
  test("datalayer event should be defined", () => {
    window.DI.analyticsGa4.cookie.consent = true;

    document.body.innerHTML =
      '<div id="main-content">' +
      '<form action="/test-url" method="post">' +
      '<div class="govuk-form-group govuk-form-group--error">' +
      "<fieldset>" +
      "  <legend>test label questions</legend>" +
      '  <p id="organisationType-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> Select one option</p>' +
      '  <label for="organisationType">test label question 1</label>' +
      '  <input type="checkbox" id="organisationType" name="organisationType" value="test value" checked/>' +
      '  <label for="organisationType-2">test label question 2</label>' +
      '  <input type="checkbox" id="organisationType-2" name="organisationType2" value="test value"/>' +
      "</fieldset>" +
      "</div>" +
      '  <button id="button" type="submit">submit</button>' +
      "</form>" +
      "</div>";

    const dataLayerEvent: FormEventInterface = {
      event: "event_data",
      event_data: {
        event_name: "form_error",
        type: "checkbox",
        url: "http://localhost/test-url",
        text: "error: select one option",
        section: "test label questions",
        action: "error",
        external: "false",
        link_domain: "http://localhost",
        "link_path_parts.1": "/test-url",
        "link_path_parts.2": "undefined",
        "link_path_parts.3": "undefined",
        "link_path_parts.4": "undefined",
        "link_path_parts.5": "undefined",
      },
    };

    instance.trackFormError();
    expect(instance.pushToDataLayer).toBeCalledWith(dataLayerEvent);
  });

  test("getErrorMessage should return error message", () => {
    const formField: FormField = {
      id: "fieldId",
      name: "fieldName",
      value: "fieldValue",
      type: "text",
    };

    // Create error element
    const errorElement = document.createElement("p");
    errorElement.id = "fieldId-error";
    errorElement.textContent = "error: this is an  error message";
    document.body.appendChild(errorElement);
    // Create input element
    const input = document.createElement("input");
    input.id = formField.id;
    document.body.appendChild(input);
    expect(instance.getErrorMessage(formField)).toBe(
      "error: this is an  error message",
    );
  });

  test("getErrorMessage should return parent field error message", () => {
    const formField: FormField = {
      id: "fieldId",
      name: "fieldName",
      value: "fieldValue",
      type: "text",
    };

    // Create error element
    const errorElement = document.createElement("p");
    errorElement.id = "fieldId-error";
    errorElement.textContent = "error: this is an  error message";
    document.body.appendChild(errorElement);
    // Create input element
    const input = document.createElement("input");
    input.id = formField.id + "-day";
    document.body.appendChild(input);
    expect(instance.getErrorMessage(formField)).toBe(
      "error: this is an  error message",
    );
  });

  test("getErrorMessage should return undefined , when there is no error message", () => {
    const formField: FormField = {
      id: "fieldId",
      name: "fieldName",
      value: "fieldValue",
      type: "text",
    };

    // Create input element
    const input = document.createElement("input");
    input.id = formField.id;
    document.body.appendChild(input);
    expect(instance.getErrorMessage(formField)).toBe("undefined");
  });
  test("getErrorFields should return an array of the first field in each form group in a form that have an error message", () => {
    const form = document.createElement("form");
    form.innerHTML =
      '<div class="govuk-form-group govuk-form-group--error">' +
      "<fieldset>" +
      "  <legend>checked section</legend>" +
      '  <label for="questionType">checked value</label>' +
      '  <p id="questionType-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> Select one checkbox</p>' +
      '  <input type="checkbox" id="questionType" name="questionType" value="checkedValue" />' +
      '  <label for="questionType-2">checked value2</label>' +
      '  <input type="checkbox" id="questionType-2" name="questionType" value="checkedValue2" />' +
      "</fieldset>" +
      "</div>" +
      '<div class="govuk-form-group govuk-form-group--error">' +
      '  <label for="region">dropdown section</label>' +
      '  <p id="region-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> Select one option from dropdown</p>' +
      '  <select id="region" name="Region"><option value="test value">test value</option><option value="test value2" >test value2</option></select>' +
      "</div>" +
      '<div class="govuk-form-group govuk-form-group--error">' +
      "<fieldset>" +
      "  <legend>radio section</legend>" +
      '  <p id="male-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> Select one radio option </p>' +
      '  <label for="male">radio value</label>' +
      '  <input type="radio" id="male" name="radioGroup" value="radio value"/>' +
      '  <label for="female">radio value 2</label>' +
      '  <input type="radio" id="female" name="radioGroup" value="radio value 2"/>' +
      "</fieldset>" +
      "</div>" +
      '<div class="govuk-form-group govuk-form-group--error">' +
      '  <label for="feedback">textarea section</label>' +
      '  <p id="feedback-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> Please give us your feedback</p>' +
      '  <textarea id="feedback" name="Feedback" /></textarea>' +
      "</div>" +
      '<div class="govuk-form-group govuk-form-group--error">' +
      '  <label for="email">text input section</label>' +
      '  <p id="email-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> Please give us your email</p>' +
      '  <input type ="text" id="email" name="Email" /></input>' +
      "</div>" +
      '  <button id="button" type="submit">submit</button>';
    document.body.appendChild(form);
    expect(instance.getErrorFields(form)).toEqual([
      {
        id: "questionType",
        name: "questionType",
        value: "checkedValue",
        type: "checkbox",
      },
      {
        id: "region",
        name: "Region",
        value: "test value",
        type: "select-one",
      },
      {
        id: "male",
        name: "radioGroup",
        value: "radio value",
        type: "radio",
      },
      {
        id: "feedback",
        name: "Feedback",
        value: "",
        type: "textarea",
      },
      {
        id: "email",
        name: "Email",
        value: "",
        type: "text",
      },
    ]);
  });
});
