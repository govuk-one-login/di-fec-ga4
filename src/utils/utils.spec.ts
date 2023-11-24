import { describe, expect, test } from "@jest/globals";
import { validateParameter } from "./validateParameter";

describe("validateParameter", () => {
  test("parameter of type string and allowed length should be returned", () => {
    const parameter = "hello world";
    const validatedParameter = validateParameter(parameter, 100);
    expect(validatedParameter).toEqual(parameter);
  });

  test("invalid types should be replaced by an error message", () => {
    const parameter = 1234;
    const validatedParameter = validateParameter(parameter, 100);
    expect(validatedParameter).toEqual("undefined");
  });

  test("parameters with invalid lengths should be truncated", () => {
    const parameter = "a".repeat(200);
    const validatedParameter = validateParameter(parameter, 100);
    expect(validatedParameter.length).toEqual(100);
  });

  test("empty parameters should be replaced with error message", () => {
    const parameter = "";
    const validatedParameter = validateParameter(parameter, 100);
    expect(validatedParameter).toEqual("undefined");
  });
});
