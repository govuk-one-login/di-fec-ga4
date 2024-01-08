import { validateParameter } from "../../utils/validateParameter";
import { FormTracker } from "../formTracker/formTracker";
import {
  FormEventInterface,
  FormField,
  formTrackerOptionsInterface,
} from "../formTracker/formTracker.interface";

export class FormResponseTracker extends FormTracker {
  eventName: string = "form_response";
  eventType: string = "event_data";
  disableFreeTextTracking: boolean = false;

  /**
   * Initializes a new instance of the FormResponseTracker class.
   *
   * @param {formTrackerOptionsInterface} formTrackerOptions - The options for the form tracker.
   * @return {void}
   */
  constructor(formTrackerOptions: formTrackerOptionsInterface = {}) {
    super();
    this.disableFreeTextTracking =
      formTrackerOptions.disableFreeTextTracking || false;
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

    const form = document.forms[0];
    let fields: FormField[] = [];

    if (form && form.elements) {
      fields = this.getFormFields(form);
    } else {
      return false;
    }

    if (!fields.length) {
      console.log("form or fields not found");
      return false;
    }

    try {
      // Iterate through each form field and generate an event for each
      for (const field of fields) {
        const submitUrl = this.getSubmitUrl(form);

        const formResponseTrackerEvent: FormEventInterface = {
          event: this.eventType,
          event_data: {
            event_name: this.eventName,
            type: validateParameter(this.getFieldType([field]), 100),
            url: validateParameter(submitUrl, 100),
            text: validateParameter(this.getFieldValue([field]), 100),
            section: validateParameter(this.getSectionValue(field), 100),
            action: validateParameter(this.getButtonLabel(event), 100),
            external: "undefined",
            link_domain: this.getDomain(submitUrl),
            "link_path_parts.1": this.getDomainPath(submitUrl, 0),
            "link_path_parts.2": this.getDomainPath(submitUrl, 1),
            "link_path_parts.3": this.getDomainPath(submitUrl, 2),
            "link_path_parts.4": this.getDomainPath(submitUrl, 3),
            "link_path_parts.5": this.getDomainPath(submitUrl, 4),
          },
        };

        // Don't track free text if disableFreeTextTracking is set
        if (
          this.disableFreeTextTracking &&
          formResponseTrackerEvent.event_data.type === this.FREE_TEXT_FIELD_TYPE
        ) {
          return false; // Skip tracking for this field
        }

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
