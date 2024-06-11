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
    if (!element.checked) {
      return;
    }

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
    if (!element.checked) {
      return;
    }

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
   * Retrieves the first HTMLFormElement within the specified document's main content.
   *
   * @return {HTMLFormElement | null} The first HTMLFormElement found within the main content, or null if none is found.
   */
  getFormElement(): HTMLFormElement | null {
    return document.querySelector("#main-content form");
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

      if (element.type === "checkbox") {
        this.processCheckbox(element);
      } else if (element.type === "radio") {
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
   * Get the heading text associated with the specified HTML element ID.
   *
   * @param {string} elementId - The ID of the HTML element.
   * @return {string} The heading text of the element, or "undefined" if not found.
   */

  getHeadingText = (elementId: string): string => {
    const commonId = elementId.split("-")[0];
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

    if (fieldset) {
      // If it's a child of a fieldset ,look for the legend if not check for backup conditions
      const legendElement = fieldset.querySelector("legend");
      if (legendElement?.textContent) {
        return legendElement.textContent.trim();
      }

      return this.getHeadingText(element.id);

      // if it is a checkbox or radio or date not in a fieldset, then check for backup conditions
    } else if (isCheckboxType || isRadioType || isDateType) {
      return this.getHeadingText(element.id);
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
    //get 3 date fields
    const dayField = fields.find((field) => field.id.endsWith("day"));
    const monthField = fields.find((field) => field.id.endsWith("month"));
    const yearField = fields.find((field) => field.id.endsWith("year"));

    //check if we have the 3 date fields
    if (!dayField || !monthField || !yearField) {
      return false;
    }

    //all field ids need to be linked to the same prefix id
    const idPrefix_dayField = dayField.id.split("-")[0];
    const idPrefix_monthField = monthField.id.split("-")[0];
    const idPrefix_yearField = yearField.id.split("-")[0];
    if (
      idPrefix_dayField !== idPrefix_monthField ||
      idPrefix_dayField !== idPrefix_yearField ||
      idPrefix_monthField !== idPrefix_yearField
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
    let newArrayFields: FormField[] = [];
    fields.forEach((field) => {
      //if dash is in the name
      if (field.name.includes("-")) {
        //split the name
        const fieldName = field.name.split("-")[0];
        if (!newArrayFields.find((field) => field.name === fieldName)) {
          //get day month and year
          const dayField = fields.find(
            (field) => field.id === `${fieldName}-day`,
          );
          const monthField = fields.find(
            (field) => field.id === `${fieldName}-month`,
          );
          const yearField = fields.find(
            (field) => field.id === `${fieldName}-year`,
          );
          if (dayField && monthField && yearField) {
            const combinedDateField: FormField = {
              id: `${fieldName}-day`,
              name: fieldName,
              value: `${dayField.value}-${monthField.value}-${yearField.value}`,
              type: "date",
            };
            newArrayFields.push(combinedDateField);
          }
        }
      } else {
        //not a date field
        newArrayFields.push(field);
      }
    });
    return newArrayFields;
  }
}
