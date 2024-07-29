import logger from "loglevel";
import { validateParameter } from "../../utils/validateParameter";
import { FormTracker } from "../formTracker/formTracker";
import {
  FormEventInterface,
  FormField,
} from "../formTracker/formTracker.interface";
import { BaseTracker } from "../baseTracker/baseTracker";

export class FormResponseTracker extends FormTracker {
  eventName: string = "form_response";
  eventType: string = "event_data";
  isDataSensitive: boolean;
  enableFormResponseTracking: boolean;

  /**
   * Initializes a new instance of the FormResponseTracker class.
   *  * @param {boolean} isDataSensitive - Flag if data is sensitive
   *  * @return {void}
   */
  constructor(isDataSensitive: boolean, enableFormResponseTracking: boolean) {
    super();
    this.isDataSensitive = isDataSensitive;
    this.enableFormResponseTracking = enableFormResponseTracking;
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

    if (!this.enableFormResponseTracking) {
      return false;
    }

    const form = FormTracker.getFormElement();

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
      return false;
    }

    // check if form is valid
    if (!FormTracker.isFormValid(fields)) {
      return false;
    }

    // manage date (day/month/year) fields
    if (FormTracker.isDateFields(fields)) {
      fields = FormTracker.combineDateFields(fields);
    }

    const submitUrl = FormTracker.getSubmitUrl(form);

    try {
      fields.forEach((field) => {
        const formResponseTrackerEvent: FormEventInterface = {
          event: this.eventType,
          event_data: {
            event_name: this.eventName,
            type: validateParameter(this.getFieldType([field]), 100),
            url: validateParameter(submitUrl, 100),
            text: this.redactPII(
              validateParameter(FormTracker.getFieldValue([field]), 100),
            ),
            section: validateParameter(FormTracker.getSectionValue(field), 100),
            action: validateParameter(
              FormResponseTracker.getButtonLabel(event),
              100,
            ),
            external: "false",
            link_domain: BaseTracker.getDomain(submitUrl),
            "link_path_parts.1": BaseTracker.getDomainPath(submitUrl, 0),
            "link_path_parts.2": BaseTracker.getDomainPath(submitUrl, 1),
            "link_path_parts.3": BaseTracker.getDomainPath(submitUrl, 2),
            "link_path_parts.4": BaseTracker.getDomainPath(submitUrl, 3),
            "link_path_parts.5": BaseTracker.getDomainPath(submitUrl, 4),
          },
        };

        // Push the event to the data layer for each field
        BaseTracker.pushToDataLayer(formResponseTrackerEvent);
      });

      return true;
    } catch (err) {
      logger.error("Error in trackFormResponse", err);
      return false;
    }
  }

  /**
   * Retrieves the label of a button from a SubmitEvent.
   *
   * @param {SubmitEvent} event - The SubmitEvent object containing the button.
   * @return {string} The label of the button, or "undefined" if it is not found.
   */
  static getButtonLabel(event: SubmitEvent): string {
    return event.submitter?.textContent
      ? event.submitter.textContent.trim()
      : "undefined";
  }

  /**
   * Redacts field value if data is flagged as sensitive
   *
   * @param {string} string - Text field input
   * @return {string} The text field or undefined
   */
  redactPII(parameter: string): string {
    return this.isDataSensitive ? "undefined" : parameter.trim();
  }
}
