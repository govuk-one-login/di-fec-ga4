import { BaseTracker } from "../baseTracker/baseTracker";

export class FormResponseTracker extends BaseTracker {
  eventName: string = "form_response";
  eventType: string = "event_data";

  constructor() {
    super();
    this.initialiseEventListener();
  }

  initialiseEventListener() {
    document.addEventListener(
      "submit",
      this.trackFormResponse.bind(this),
      false,
    );
  }

  trackFormResponse(event: SubmitEvent): boolean {
    event.preventDefault();

    const form = document.forms[0];
    console.log("form action", form.action);
    console.log("fieldset", form.elements[0]);
    console.log("event type", event.target);

    console.log("form button label", event.submitter?.textContent?.trim());
    event.currentTarget;
    const data = new FormData(event.target as any);
    //console.log('data action',event.currentTarget)
    console.log("data entries", data.keys());
    data.forEach((value, key) => {
      console.log("key", key);
      console.log("value", value);
    });

    const value = Object.fromEntries(data.entries());
    console.log("value", { value });
    //this.getFieldLabel();
    this.getFieldType(form);

    //console.log("form elements", form.elements);
    //this.getFormElements(form.elements as any);
    //remove fields type hidden

    //console.log("button", form.);

    const formResponseTrackerEvent: any = {
      event: this.eventType,
      event_data: {
        event_name: this.eventName,
        type: this.getFieldType(form),
        url: this.getLocation(),
        text: this.getFieldValue(form),
        section: this.getFieldLabel(),
        action: event.submitter?.textContent
          ? event.submitter.textContent.trim()
          : "undefined",
        external: "undefined",
      },
    };

    /*try {
      this.pushToDataLayer(formResponseTrackerEvent);
      return true;
    } catch (err) {
      console.error("Error in trackFormResponses", err);
      return false;
    }*/
    return false;
  }

  getFieldType(form: HTMLFormElement): string {
    const inputs = form.getElementsByTagName("input");
    if (!inputs.length) {
      return "undefined";
    }
    console.log("input type", inputs[0].type);
    return inputs[0].type;
  }

  getFieldLabel(): string {
    const labels: HTMLCollectionOf<HTMLLegendElement> =
      document.getElementsByTagName("legend");
    if (!labels.length) {
      return "undefined";
    }
    let label: string = "";
    for (let i = 0; i < labels.length; i++) {
      if (labels[i].textContent) {
        label += labels[i]?.textContent?.trim() + " ";
      }
    }
    return label;
  }

  getFieldValue(form: HTMLFormElement): string {
    return "field value";
  }

  getButtonLabel(form: HTMLFormElement): string {
    return "button label";
  }
}
