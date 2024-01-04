import { BaseTracker } from "../baseTracker/baseTracker";
import { FormField } from "./formTracker.interface";

export class FormTracker extends BaseTracker {
  FREE_TEXT_FIELD_TYPE = "free text field";
  DROPDOWN_FIELD_TYPE = "drop-down list";
  RADIO_FIELD_TYPE = "radio buttons";

  constructor() {
    super();
  }

  /**
   * Retrieves the selected fields from an HTML form.
   *
   * @param {HTMLFormElement} form - The HTML form element.
   * @return {FormField[]} An array of selected form fields.
   */
  public getFormFields(form: HTMLFormElement): FormField[] {
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
    } else if (elements[0].type === "radio") {
      return this.RADIO_FIELD_TYPE;
    } else {
      return elements[0].type;
    }
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
   * Get the section value from the label or legend associated with the HTML form element.
   *
   * @param {FormField} element - The form field.
   * @return {string} The label or legend of the field.
   */
  getSectionValue(element: FormField): string {
    const field = document.getElementById(element.id);
    const fieldset = field?.closest("fieldset");
    if (fieldset) {
      // If it's a child of a fieldset e.g radio button/ checkbox, look for the legend
      const legendElement = fieldset.querySelector("legend");
      if (legendElement && legendElement.textContent) {
        return legendElement.textContent.trim();
      }
    } else {
      // If not within a fieldset,e.g free text field, dropdown check for label
      const labelElement = document.querySelector(`label[for="${element.id}"]`);
      if (labelElement && labelElement.textContent) {
        return labelElement.textContent.trim();
      }
    }

    // If not within a fieldset or no legend found, return an empty string
    return "undefined";
  }

  /**
   * Get the submit URL from the given HTML form element.
   *
   * @param {HTMLFormElement} form - The HTML form element.
   * @return {string} The submit URL or "undefined" if not found.
   */
  getSubmitUrl(form: HTMLFormElement): string {
    return form.action ?? "undefined";
  }
}
