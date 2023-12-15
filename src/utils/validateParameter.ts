/*
 *   Takes a paremeter passed in from external use of a tracker and asserts it is defined, is a string and has a length allowed by GA
 */

import { stripPIIFromString } from "./pii-remover";

export function validateParameter(parameter: any, maxLength: number) {
  let validatedParameter = parameter || "undefined";
  const length = parameter.length;
  const type = typeof parameter;

  if (type !== "string") {
    console.error(
      `GA4: Invalid data type found, ${parameter} should be a string but instead found a ${type}`,
    );
    validatedParameter = "undefined";
  } else if (length > maxLength) {
    console.error(
      `GA4: ${parameter} should not be more than ${maxLength} characters, it is currently ${length} characters long`,
    );
    validatedParameter = parameter.substring(0, maxLength);
  }
  const value = validatedParameter.toLowerCase();
  return stripPIIFromString(value);
}
