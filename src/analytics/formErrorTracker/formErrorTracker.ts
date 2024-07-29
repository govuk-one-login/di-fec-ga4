import logger from "loglevel";
import { validateParameter } from "../../utils/validateParameter";
import { FormTracker } from "../formTracker/formTracker";
import {
  FormEventInterface,
  FormField,
} from "../formTracker/formTracker.interface";
import { BaseTracker } from "../baseTracker/baseTracker";

export class FormErrorTracker extends FormTracker {
  eventName: string = "form_error";
  eventType: string = "event_data";

  /**
   * Tracks error in a form and sends data to the analytics platform.
   *
   * @return {boolean} Returns true if the form error tracking is successful, otherwise false.
   */
  trackFormError(): boolean {
    if (!window.DI.analyticsGa4.cookie.consent) {
      return false;
    }

    const form = FormTracker.getFormElement();

    if (!form) {
      return false;
    }

    let fields: FormField[] = [];
    if (form?.elements) {
      fields = FormErrorTracker.getErrorFields();
    } else {
      return false;
    }

    if (!fields.length) {
      return false;
    }

    const submitUrl = FormTracker.getSubmitUrl(form);

    try {
      fields.forEach((field) => {
        const formErrorTrackerEvent: FormEventInterface = {
          event: this.eventType,
          event_data: {
            event_name: this.eventName,
            type: validateParameter(this.getFieldType([field]), 100),
            url: validateParameter(submitUrl, 100),
            text: validateParameter(
              FormErrorTracker.getErrorMessage(field),
              100,
            ),
            section: validateParameter(FormTracker.getSectionValue(field), 100),
            action: "error",
            external: "false",
            link_domain: BaseTracker.getDomain(submitUrl),
            "link_path_parts.1": BaseTracker.getDomainPath(submitUrl, 0),
            "link_path_parts.2": BaseTracker.getDomainPath(submitUrl, 1),
            "link_path_parts.3": BaseTracker.getDomainPath(submitUrl, 2),
            "link_path_parts.4": BaseTracker.getDomainPath(submitUrl, 3),
            "link_path_parts.5": BaseTracker.getDomainPath(submitUrl, 4),
          },
        };
        BaseTracker.pushToDataLayer(formErrorTrackerEvent);
      });
      return true;
    } catch (err) {
      logger.error("Error in trackFormError", err);
      return false;
    }
  }

  /**
   Retrieve the text content of an error message associated with a specific form field.

   * @param {FormField} field - The form field.
   * @return returns a string representing the text content of the error message associated with the specified form field. 
   * If no error message is found, it returns the string "undefined
  */
  static getErrorMessage(field: FormField) {
    const error = document.getElementById(`${field.id}-error`);
    if (error) {
      return error?.textContent?.trim();
    }
    // If no error message is found, try to find an error message using the "parent" id of the form field
    const fieldNameInput = field.id.split("-");
    if (fieldNameInput.length > 1) {
      const inputError = document.getElementById(`${fieldNameInput[0]}-error`);
      if (inputError) {
        return inputError?.textContent?.trim();
      }
    }

    return "undefined";
  }

  /**
   * Querys first input, textarea, or select element within each form group that has an error message.
   * If element is found, creates a FormField object with information about the element
   * (id, name, value, type) and pushes this FormField object into the errorFields array.
   *
   * @return {FormField[]} elements - The array containing information about form fields associated with errors..
   */
  static getErrorFields(): FormField[] {
    const errorFields: FormField[] = [];
    const formGroups = document.querySelectorAll(".govuk-form-group--error");

    formGroups.forEach((formGroup) => {
      const element = formGroup.querySelector(
        "input, textarea,select,password,checkbox",
      ) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

      if (element) {
        errorFields.push({
          id: element.id,
          name: element.name,
          value: element.value,
          type: element.type,
        });
      }
    });

    return errorFields;
  }
}
