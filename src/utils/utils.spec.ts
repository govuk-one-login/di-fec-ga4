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

describe("PII remover", () => {
  test("email should be replaced by '[email]'", () => {
    const parameter = "fabien@gov.uk";
    const validatedParameter = validateParameter(parameter, 100);
    expect(validatedParameter).toEqual("[email]");
  });

  test("date format dd/mm/yyyy should be replaced by '[date]'", () => {
    const parameter = "23/11/2022";
    const validatedParameter = validateParameter(parameter, 100);
    expect(validatedParameter).toEqual("[date]");
  });

  test("date format dd/mm/yy should be replaced by '[date]'", () => {
    const parameter = "23/11/23";
    const validatedParameter = validateParameter(parameter, 100);
    expect(validatedParameter).toEqual("[date]");
  });

  test("date format yyyy/mm/dd should be replaced by '[date]'", () => {
    const parameter = "2021/11/21";
    const validatedParameter = validateParameter(parameter, 100);
    expect(validatedParameter).toEqual("[date]");
  });

  test("date format with string should be replaced by '[date]'", () => {
    const parameter = "1 January 1990";
    const validatedParameter = validateParameter(parameter, 100);
    expect(validatedParameter).toEqual("[date]");
  });

  test("postcode should be replaced by '[postcode]'", () => {
    const parameter = "W1 1AA";
    const validatedParameter = validateParameter(parameter, 100);
    expect(validatedParameter).toEqual("[postcode]");
  });

  test("postcode (without space) should be replaced by '[postcode]'", () => {
    const parameter = "W11AA";
    const validatedParameter = validateParameter(parameter, 100);
    expect(validatedParameter).toEqual("[postcode]");
  });

  test("phone number should be replaced by '[phonenumber]'", () => {
    const parameter = "0701 1234567";
    const validatedParameter = validateParameter(parameter, 100);
    expect(validatedParameter).toEqual("[phonenumber]");
  });

  test("phone number (without space) should be replaced by '[phonenumber]'", () => {
    const parameter = "07011234567";
    const validatedParameter = validateParameter(parameter, 100);
    expect(validatedParameter).toEqual("[phonenumber]");
  });
});
