import { describe, expect, test } from "@jest/globals";
import { applyDefaults } from "./applyDefaults";

interface ITestInterface {
  propA?: boolean;
  propB?: string;
}

describe("applyDefaults", () => {
  test("applies defaults only for properties where defaults are provided", () => {
    const raw: ITestInterface = { propA: false };
    const defaultedValue = applyDefaults(raw, {
      propB: "Hello world",
    });
    expect(defaultedValue).toEqual({ propA: false, propB: "Hello world" });
  });

  test("applies defaults without overwriting existing values", () => {
    const raw: ITestInterface = { propA: false };
    const defaultedValue = applyDefaults(raw, {
      propA: true,
      propB: "Hello world",
    });
    expect(defaultedValue).toEqual({ propA: false, propB: "Hello world" });
  });
});
