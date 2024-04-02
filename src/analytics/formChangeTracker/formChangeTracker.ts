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

    const form = this.getFormElement();

    if (!form) {
      return false;
    }

    const submitUrl = this.getSubmitUrl(form);
    const formChangeTrackerEvent: FormEventInterface = {
      event: this.eventType,
      event_data: {
        event_name: this.eventName,
        type: "undefined",
        url: validateParameter(submitUrl, 100),
        text: "change", //put static value. Waiting final documentation on form change tracker,
        section: validateParameter(this.getFieldLabel(), 100),
        action: "change response",
        external: "false",
        link_domain: this.getDomain(submitUrl),
        "link_path_parts.1": this.getDomainPath(submitUrl, 0),
        "link_path_parts.2": this.getDomainPath(submitUrl, 1),
        "link_path_parts.3": this.getDomainPath(submitUrl, 2),
        "link_path_parts.4": this.getDomainPath(submitUrl, 3),
        "link_path_parts.5": this.getDomainPath(submitUrl, 4),
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
