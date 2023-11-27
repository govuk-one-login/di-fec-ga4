import { validateParameter } from "../../utils/validateParameter";
import { BaseTracker } from "../baseTracker/baseTracker";
import {
  FormEventInterface,
  FormField,
  formTrackerOptionsInterface,
} from "./formTracker.interface";

export class FormResponseTracker extends BaseTracker {
  eventName: string = "form_response";
  eventType: string = "event_data";
  disableFreeTextTracking: boolean = false;
  FREE_TEXT_FIELD_TYPE = "free text field";
  DROPDOWN_FIELD_TYPE = "drop-down list";

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
  initialiseEventListener() {
    document.addEventListener(
      "submit",
      this.trackFormResponse.bind(this),
      false,
    );
  }

  trackFormResponse(event: SubmitEvent): boolean {
    const form = document.forms[0];
    let fields: FormField[] = [];

    if (form && form.elements) {
      fields = this.getFields(form);
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
      console.error("Error in trackFormResponses", err);
      return false;
    }
  }

  /**
   * Retrieves the selected fields from an HTML form.
   *
   * @param {HTMLFormElement} form - The HTML form element.
   * @return {FormField[]} An array of selected form fields.
   */
  getFields(form: HTMLFormElement): FormField[] {
    const selectedFields: FormField[] = [];
    for (let i = 0; i < form.elements.length; i++) {
      const element: HTMLInputElement = form.elements[i] as HTMLInputElement;

      if (
        element.type === "hidden" ||
        element.type === "fieldset" ||
        element.type === "submit"
      ) {
        continue;
      }

      if (
        (element.type === "radio" || element.type === "checkbox") &&
        element.checked
      ) {
        selectedFields.push({
          id: element.id,
          name: element.name,
          value: document.querySelector(`label[for="${element.id}"]`)
            ?.textContent
            ? document
                .querySelector(`label[for="${element.id}"]`)
                ?.textContent?.trim()
            : "undefined",
          type: element.type,
        });
      } else if (element.type === "textarea" || element.type === "text") {
        selectedFields.push({
          id: element.id,
          name: element.name,
          value: element.value,
          type: element.type,
        });
      } else if (element.type === "select-one") {
        const selectedElement = form.elements[i] as HTMLSelectElement;
        selectedFields.push({
          id: selectedElement.id,
          name: selectedElement.name,
          value: selectedElement.options[selectedElement.selectedIndex].text,
          type: selectedElement.type,
        });
      }
    }
    return selectedFields;
  }

  /**
   * Returns the field type based on the given FormField array.
   *
   * @param {FormField[]} elements - An array of FormField objects.
   * @return {string} The field type based on the elements.
   */
  getFieldType(elements: FormField[]): string {
    if (elements[0].type === "textarea" || elements[0].type === "text") {
      return this.FREE_TEXT_FIELD_TYPE;
    } else if (elements[0].type === "select-one") {
      return this.DROPDOWN_FIELD_TYPE;
    } else {
      return elements[0].type;
    }
  }

  /**
   * Retrieves the label of a field.
   *
   * @return {string} The label of the field.
   */
  getFieldLabel(): string {
    let labels: HTMLCollectionOf<HTMLLegendElement | HTMLLabelElement> =
      document.getElementsByTagName("legend");
    if (!labels.length) {
      labels = document.getElementsByTagName("label");
    }
    let label: string = "";
    for (let i = 0; i < labels.length; i++) {
      if (labels[i].textContent) {
        label += labels[i]?.textContent?.trim();
        if (i > 1 && i < labels.length - 1) {
          label += ", ";
        }
      }
    }
    return label;
  }

  /**
   * Retrieves the field value from an array of form fields.
   *
   * @param {FormField[]} elements - The array of form fields.
   * @return {string} The concatenated field values separated by a comma (if there is more than one field).
   */
  getFieldValue(elements: FormField[]): string {
    let value = "";
    const separator = elements.length > 1 ? ", " : "";
    elements.forEach((element) => {
      value += element.value + separator;
    });
    return value;
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
