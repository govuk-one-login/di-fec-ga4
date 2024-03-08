/*
 *   Takes a paremeter passed in from external use of a tracker and asserts it is defined, is a string and has a length allowed by GA
 */

import { stripPIIFromString } from "./pii-remover";

export function validateParameter(parameter: any, maxLength: number) {
  let validatedParameter = parameter || "undefined";
  const length = parameter.length;
  const type = typeof parameter;

  if (type !== "string") {
    validatedParameter = "undefined";
  } else if (length > maxLength) {
    validatedParameter = parameter.substring(0, maxLength);
  }
  const value = validatedParameter.toLowerCase();
  return stripPIIFromString(value);
}
