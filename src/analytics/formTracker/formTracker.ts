import { BaseTracker } from "../baseTracker/baseTracker";
import { FormField } from "./formTracker.interface";

export class FormTracker extends BaseTracker {
  FREE_TEXT_FIELD_TYPE = "free text field";
  DROPDOWN_FIELD_TYPE = "drop-down list";
  RADIO_FIELD_TYPE = "radio buttons";
  private selectedFields: FormField[] = [];

  static isExcludedType(element: HTMLInputElement): boolean {
    return (
      element.type === "hidden" ||
      element.type === "fieldset" ||
      element.type === "button" ||
      element.type === "submit"
    );
  }

  static getElementValue(element: HTMLInputElement): string {
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
      checkboxInSameGroup.value += `, ${FormTracker.getElementValue(element)}`;
    } else {
      this.selectedFields.push({
        id: element.id,
        name: element.name,
        value: FormTracker.getElementValue(element),
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
      value: FormTracker.getElementValue(element),
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
  static getFormElement(): HTMLFormElement | null {
    return document.querySelector("#main-content form");
  }

  /**
   * Retrieves the selected fields from an HTML form.
   *
   * @param {HTMLFormElement} form - The HTML form element.
   * @return {FormField[]} An array of selected form fields.
   */
  public getFormFields(form: HTMLFormElement): FormField[] {
    [...form.elements].forEach((element) => {
      const inputElement = element as HTMLInputElement;

      if (FormTracker.isExcludedType(inputElement)) {
        return;
      }

      if (inputElement.type === "checkbox") {
        this.processCheckbox(inputElement);
      } else if (inputElement.type === "radio") {
        this.processRadio(inputElement);
      } else if (inputElement.type === "select-one") {
        this.processSelectOne(inputElement as unknown as HTMLSelectElement);
      } else {
        this.processTextElement(inputElement);
      }
    });

    return this.selectedFields;
  }

  /**
   * Returns the field type based on the given FormField array.
   *
   * @param {FormField[]} elements - An array of FormField objects.
   * @return {string} The field type based on the elements.
   */
  getFieldType(elements: FormField[]): string {
    switch (elements[0].type) {
      case "select-one":
        return this.DROPDOWN_FIELD_TYPE;
      case "radio":
        return this.RADIO_FIELD_TYPE;
      case "checkbox":
        return elements[0].type;
      default:
        return this.FREE_TEXT_FIELD_TYPE;
    }
  }

  /**
   * Retrieves the field value from an array of form fields.
   *
   * @param {FormField[]} elements - The array of form fields.
   * @return {string} The concatenated field values separated by a comma (if there is more than one field).
   */
  static getFieldValue(elements: FormField[]): string {
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
  static getFieldLabel(): string {
    let labels: HTMLCollectionOf<HTMLLegendElement | HTMLLabelElement> =
      document.getElementsByTagName("legend");
    if (!labels.length) {
      labels = document.getElementsByTagName("label");
    }
    let label: string = "";
    for (let i = 0; i < labels.length; i++) {
      if (labels[i].textContent) {
        label += labels[i].textContent!.trim();
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
  static getHeadingText(elementId: string): string {
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
  }

  /**
   * Get the section value from the label or legend associated with the HTML form element.
   *
   * @param {FormField} element - The form field.
   * @return {string} The label or legend of the field.
   */
  static getSectionValue(element: FormField): string {
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

      return FormTracker.getHeadingText(element.id);

      // if it is a checkbox or radio or date not in a fieldset, then check for backup conditions
    }
    if (isCheckboxType || isRadioType || isDateType) {
      return FormTracker.getHeadingText(element.id);
    }
    // If not within a fieldset and not a checkbox / radio button/ date/s field ,e.g free text field or dropdown check for label
    const labelElement = document.querySelector(`label[for="${element.id}"]`);
    if (labelElement?.textContent) {
      return labelElement.textContent.trim();
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
  static getSubmitUrl(form: HTMLFormElement): string {
    return form.action ?? "undefined";
  }

  /**
   * Check if the form fields are valid.
   *
   * @param {FormField[]} fields - array of form fields
   * @return {boolean} true if all fields are valid, false otherwise
   */
  static isFormValid(fields: FormField[]): boolean {
    return fields.every((field) => !!field.value);
  }

  /**
   * Checks if the given array of form fields represents a date field.
   *
   * @param {FormField[]} fields - The array of form fields to check.
   * @return {boolean} Returns true if the fields represent a date field, false otherwise.
   */
  static isDateFields(fields: FormField[]): boolean {
    // get 3 date fields
    const dayField = fields.find((field) => field.id.endsWith("day"));
    const monthField = fields.find((field) => field.id.endsWith("month"));
    const yearField = fields.find((field) => field.id.endsWith("year"));

    // check if we have the 3 date fields
    if (!dayField || !monthField || !yearField) {
      return false;
    }

    // all field ids need to be linked to the same prefix id
    const idPrefixDayField = dayField.id.split("-")[0];
    const idPrefixMonthField = monthField.id.split("-")[0];
    const idPrefixYearField = yearField.id.split("-")[0];
    if (
      idPrefixDayField !== idPrefixMonthField ||
      idPrefixDayField !== idPrefixYearField ||
      idPrefixMonthField !== idPrefixYearField
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
  static combineDateFields(fields: FormField[]): FormField[] {
    const newArrayFields: FormField[] = [];
    fields.forEach((field) => {
      if (field.name.includes("-")) {
        const fieldName = field.name.split("-")[0];
        if (
          !newArrayFields.find(
            (newArrayField) => newArrayField.name === fieldName,
          )
        ) {
          const dayField = fields.find(
            (dField) => dField.id === `${fieldName}-day`,
          );
          const monthField = fields.find(
            (mField) => mField.id === `${fieldName}-month`,
          );
          const yearField = fields.find(
            (yField) => yField.id === `${fieldName}-year`,
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
        // not a date field
        newArrayFields.push(field);
      }
    });
    return newArrayFields;
  }
}
