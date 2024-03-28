import { BaseTracker } from "../baseTracker/baseTracker";
import { FormField } from "./formTracker.interface";

export class FormTracker extends BaseTracker {
  FREE_TEXT_FIELD_TYPE = "free text field";
  DROPDOWN_FIELD_TYPE = "drop-down list";
  RADIO_FIELD_TYPE = "radio buttons";

  constructor() {
    super();
  }

  private selectedFields: FormField[] = [];

  isExcludedType(element: HTMLInputElement): boolean {
    return (
      element.type === "hidden" ||
      element.type === "fieldset" ||
      element.type === "submit"
    );
  }

  getElementValue(element: HTMLInputElement): string {
    const label = document.querySelector(`label[for="${element.id}"]`);
    return label?.textContent?.trim() || "undefined";
  }

  processCheckbox(element: HTMLInputElement): void {
    const checkboxInSameGroup = this.selectedFields.find(
      (field) => field.name === element.name,
    );

    if (checkboxInSameGroup) {
      checkboxInSameGroup.value += `, ${this.getElementValue(element)}`;
    } else {
      this.selectedFields.push({
        id: element.id,
        name: element.name,
        value: this.getElementValue(element),
        type: element.type,
      });
    }
  }

  processRadio(element: HTMLInputElement): void {
    this.selectedFields.push({
      id: element.id,
      name: element.name,
      value: this.getElementValue(element),
      type: element.type,
    });
  }

  processTextElement(element: HTMLInputElement | HTMLTextAreaElement): void {
    this.selectedFields.push({
      id: element.id,
      name: element.name,
      value: element.value,
      type: element.type,
    });
  }

  processSelectOne(element: HTMLSelectElement): void {
    this.selectedFields.push({
      id: element.id,
      name: element.name,
      value: element.options[element.selectedIndex].text,
      type: element.type,
    });
  }
  /**
   * Retrieves the selected fields from an HTML form.
   *
   * @param {HTMLFormElement} form - The HTML form element.
   * @return {FormField[]} An array of selected form fields.
   */

  public getFormFields(form: HTMLFormElement): FormField[] {
    for (let i = 0; i < form.elements.length; i++) {
      const element = form.elements[i] as HTMLInputElement;

      if (this.isExcludedType(element)) {
        continue;
      }

      if (element.type === "checkbox" && element.checked) {
        this.processCheckbox(element);
      } else if (element.type === "radio" && element.checked) {
        this.processRadio(element);
      } else if (element.type === "select-one") {
        this.processSelectOne(element as unknown as HTMLSelectElement);
      } else {
        this.processTextElement(element);
      }
    }

    return this.selectedFields;
  }

  /**
   * Returns the field type based on the given FormField array.
   *
   * @param {FormField[]} elements - An array of FormField objects.
   * @return {string} The field type based on the elements.
   */
  getFieldType(elements: FormField[]): string {
    if (elements[0].type === "select-one") {
      return this.DROPDOWN_FIELD_TYPE;
    } else if (elements[0].type === "radio") {
      return this.RADIO_FIELD_TYPE;
    } else if (elements[0].type === "checkbox") {
      return elements[0].type;
    } else {
      return this.FREE_TEXT_FIELD_TYPE;
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
      if (
        element.type === "checkbox" ||
        element.type === "radio" ||
        element.type === "select-one"
      ) {
        value += element.value + separator;
      }
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
    const isCheckboxType = element.type === "checkbox";
    const isRadioType = element.type === "radio";
    const isDateType = element.type === "date";
    const commonId = element.id.split("-")[0];

    const getHeadingText = (): string => {
      const h1OrH2WithRel = document.querySelector(
        `h1[rel="${commonId}"], h2[rel="${commonId}"]`,
      );
      if (h1OrH2WithRel?.textContent) return h1OrH2WithRel.textContent.trim();

      const firstH1 = document.querySelector("h1");
      if (firstH1?.textContent) return firstH1.textContent.trim();

      const firstH2 = document.querySelector("h2");
      if (firstH2?.textContent) return firstH2.textContent.trim();

      return "undefined";
    };

    if (fieldset) {
      // If it's a child of a fieldset ,look for the legend if not check for backup conditions
      const legendElement = fieldset.querySelector("legend");
      if (legendElement?.textContent) {
        return legendElement.textContent.trim();
      }

      return getHeadingText();

      // if it is a checkbox or radio or date not in a fieldset, then check for backup conditions
    } else if (isCheckboxType || isRadioType || isDateType) {
      return getHeadingText();
    } else {
      // If not within a fieldset and not a checkbox / radio button/ date/s field ,e.g free text field or dropdown check for label
      const labelElement = document.querySelector(`label[for="${element.id}"]`);
      if (labelElement?.textContent) {
        return labelElement.textContent.trim();
      }
    }

    // If not within a fieldset or no legend or label found or no h1/h2 with rel attribute or no h1 or h2 then, return a "undefined" string
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

  /**
   * Check if the form fields are valid.
   *
   * @param {FormField[]} fields - array of form fields
   * @return {boolean} true if all fields are valid, false otherwise
   */
  isFormValid(fields: FormField[]): boolean {
    for (const field of fields) {
      if (!field.value) {
        return false;
      }
    }
    return true;
  }

  /**
   * Checks if the given array of form fields represents a date field.
   *
   * @param {FormField[]} fields - The array of form fields to check.
   * @return {boolean} Returns true if the fields represent a date field, false otherwise.
   */
  isDateFields(fields: FormField[]): boolean {
    //date is composed of 3 fields
    if (fields.length !== 3) {
      return false;
    }
    //all field ids need to be linked to the same prefix id
    const idPrefix_field1 = fields[0].id.split("-")[0];
    const idPrefix_field2 = fields[1].id.split("-")[0];
    const idPrefix_field3 = fields[2].id.split("-")[0];
    if (
      idPrefix_field1 !== idPrefix_field2 ||
      idPrefix_field1 !== idPrefix_field3 ||
      idPrefix_field2 !== idPrefix_field3
    ) {
      return false;
    }
    //fields needs to finish with -day, -month, -year
    const idSuffix_field1 = fields[0].id.split("-").pop();
    const idSuffix_field2 = fields[1].id.split("-").pop();
    const idSuffix_field3 = fields[2].id.split("-").pop();

    if (
      idSuffix_field1 !== "day" ||
      idSuffix_field2 !== "month" ||
      idSuffix_field3 !== "year"
    ) {
      return false;
    }

    return true;
  }
  /**
   * Combines the date fields into a single form field.
   *
   * @param {FormField[]} fields - array of form fields
   * @return {FormField[]} array containing the combined date field
   */
  combineDateFields(fields: FormField[]): FormField[] {
    const combineDateField: FormField[] = [
      {
        id: fields[0].id,
        name: fields[0].id.split("-")[0],
        value: `${fields[0].value}-${fields[1].value}-${fields[2].value}`,
        type: "date",
      },
    ];
    return combineDateField;
  }
}
