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

    const formResponseTrackerEvent: FormEventInterface = {
      event: this.eventType,
      event_data: {
        event_name: this.eventName,
        type: validateParameter(this.getFieldType(fields), 100),
        url: "undefined",
        text: validateParameter(this.getFieldValue(fields), 100),
        section: validateParameter(this.getFieldLabel(), 100),
        action: validateParameter(this.getButtonLabel(event), 100),
        external: "undefined",
      },
    };

    //don't track free text if disableFreeTextTracking is set
    if (
      this.disableFreeTextTracking &&
      formResponseTrackerEvent.event_data.type === this.FREE_TEXT_FIELD_TYPE
    ) {
      return false;
    }

    try {
      this.pushToDataLayer(formResponseTrackerEvent);
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
