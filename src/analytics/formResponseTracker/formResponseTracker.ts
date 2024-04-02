import { validateParameter } from "../../utils/validateParameter";
import { FormTracker } from "../formTracker/formTracker";
import {
  FormEventInterface,
  FormField,
} from "../formTracker/formTracker.interface";

export class FormResponseTracker extends FormTracker {
  eventName: string = "form_response";
  eventType: string = "event_data";

  /**
   * Initializes a new instance of the FormResponseTracker class.
   *
   * @return {void}
   */
  constructor() {
    super();
    this.initialiseEventListener();
  }

  /**
   * Initialise the event listener for the document.
   *
   */
  initialiseEventListener(): void {
    document.addEventListener(
      "submit",
      this.trackFormResponse.bind(this),
      false,
    );
  }

  /**
   * Tracks the form response and sends the data to the analytics platform.
   *
   * @param {SubmitEvent} event - The submit event triggered by the form submission.
   * @return {boolean} Returns true if the form response is successfully tracked, otherwise false.
   */
  trackFormResponse(event: SubmitEvent): boolean {
    if (!window.DI.analyticsGa4.cookie.consent) {
      return false;
    }

    const form = this.getFormElement();

    if (!form) {
      return false;
    }

    let fields: FormField[] = [];

    if (form?.elements) {
      fields = this.getFormFields(form);
    } else {
      return false;
    }

    if (!fields.length) {
      console.log("form or fields not found");
      return false;
    }

    //check if form is valid
    if (!this.isFormValid(fields)) {
      return false;
    }

    //manage date (day/month/year) fields
    if (this.isDateFields(fields)) {
      fields = this.combineDateFields(fields);
    }

    const submitUrl = this.getSubmitUrl(form);

    try {
      // Iterate through each form field and generate an event for each
      for (const field of fields) {
        const formResponseTrackerEvent: FormEventInterface = {
          event: this.eventType,
          event_data: {
            event_name: this.eventName,
            type: validateParameter(this.getFieldType([field]), 100),
            url: validateParameter(submitUrl, 100),
            text: validateParameter(this.getFieldValue([field]), 100),
            section: validateParameter(this.getSectionValue(field), 100),
            action: validateParameter(this.getButtonLabel(event), 100),
            external: "false",
            link_domain: this.getDomain(submitUrl),
            "link_path_parts.1": this.getDomainPath(submitUrl, 0),
            "link_path_parts.2": this.getDomainPath(submitUrl, 1),
            "link_path_parts.3": this.getDomainPath(submitUrl, 2),
            "link_path_parts.4": this.getDomainPath(submitUrl, 3),
            "link_path_parts.5": this.getDomainPath(submitUrl, 4),
          },
        };

        // Push the event to the data layer for each field
        this.pushToDataLayer(formResponseTrackerEvent);
      }

      return true;
    } catch (err) {
      console.error("Error in trackFormResponse", err);
      return false;
    }
  }

  /**
   * Retrieves the label of a button from a SubmitEvent.
   *
   * @param {SubmitEvent} event - The SubmitEvent object containing the button.
   * @return {string} The label of the button, or "undefined" if it is not found.
   */
  getButtonLabel(event: SubmitEvent): string {
    return event.submitter?.textContent
      ? event.submitter.textContent.trim()
      : "undefined";
  }
}
