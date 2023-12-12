import { validateParameter } from "../../utils/validateParameter";
import { FormTracker } from "../formTracker/formTracker";
import { FormEventInterface } from "../formTracker/formTracker.interface";

export class FormChangeTracker extends FormTracker {
  eventName: string = "form_change_response";
  eventType: string = "event_data";

  constructor() {
    super();
  }

  /**
   * Tracks changes in a form and sends data to the analytics platform.
   *
   * @return {boolean} Returns true if the form change tracking is successful, otherwise false.
   */
  trackFormChange(): boolean {
    if (!window.DI.analyticsGa4.cookie.consent) {
      return false;
    }

    const form = document.forms[0];

    if (!form) {
      return false;
    }

    const formChangeTrackerEvent: FormEventInterface = {
      event: this.eventType,
      event_data: {
        event_name: this.eventName,
        type: "undefined",
        url: "undefined",
        text: "change", //put static value. Waiting final documentation on form change tracker,
        section: validateParameter(this.getFieldLabel(), 100),
        action: "change response",
        external: "undefined",
      },
    };

    try {
      this.pushToDataLayer(formChangeTrackerEvent);
      return true;
    } catch (err) {
      console.error("Error in trackFormChange", err);
      return false;
    }
  }

  getSubmitterText(): string {
    const submitButton = document.querySelector("form > button");
    return submitButton?.textContent?.trim() ?? "undefined";
  }
}
