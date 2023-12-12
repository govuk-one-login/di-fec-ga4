import { validateParameter } from "../../utils/validateParameter";
import { FormTracker } from "../formTracker/formTracker";
import {
  FormEventInterface,
  FormField,
} from "../formTracker/formTracker.interface";

export class FormErrorTracker extends FormTracker {
  eventName: string = "form_error";
  eventType: string = "event_data";

  constructor() {
    super();
  }

  /**
   * Tracks error in a form and sends data to the analytics platform.
   *
   * @return {boolean} Returns true if the form error tracking is successful, otherwise false.
   */
  trackFormError(): boolean {
    if (!window.DI.analyticsGa4.cookie.consent) {
      return false;
    }

    const form = document.forms[0];
    if (!form) {
      return false;
    }

    if (!form.elements) {
      return false;
    }

    const submitUrl = this.getSubmitUrl(form);
    const formErrorTrackerEvent: FormEventInterface = {
      event: this.eventType,
      event_data: {
        event_name: this.eventName,
        type: validateParameter(this.getType(form), 100),
        url: validateParameter(submitUrl, 100),
        text: validateParameter(this.getErrorMessage(), 100),
        section: validateParameter(this.getFieldLabel(), 100),
        action: "error",
        external: "undefined",
        link_domain: this.getDomain(submitUrl),
        "link_path_parts.1": this.getDomainPath(submitUrl, 0),
        "link_path_parts.2": this.getDomainPath(submitUrl, 1),
        "link_path_parts.3": this.getDomainPath(submitUrl, 2),
        "link_path_parts.4": this.getDomainPath(submitUrl, 3),
        "link_path_parts.5": this.getDomainPath(submitUrl, 4),
      },
    };

    try {
      this.pushToDataLayer(formErrorTrackerEvent);
      return true;
    } catch (err) {
      console.error("Error in trackFormError", err);
      return false;
    }
  }

  getErrorMessage() {
    const error = document.getElementsByClassName("govuk-error-message");
    if (error) {
      return error[0]?.textContent?.trim();
    } else {
      return "undefined";
    }
  }

  getType(form: HTMLFormElement) {
    const fields: HTMLInputElement[] = [];
    for (let i = 0; i < form.elements.length; i++) {
      const element: HTMLInputElement = form.elements[i] as HTMLInputElement;
      if (
        element.type !== "hidden" &&
        element.type !== "fieldset" &&
        element.type !== "submit"
      ) {
        fields.push(element);
      }
    }

    if (fields.length) {
      return this.getFieldType(fields);
    } else {
      return "undefined";
    }
  }
}
