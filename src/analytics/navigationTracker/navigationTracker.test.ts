import { describe, expect, jest, test } from "@jest/globals";
import { NavigationTracker } from "./navigationTracker";

window.DI = { analyticsGa4: { cookie: { consent: true } } };

describe("navigationTracker", () => {
  const newInstance = new NavigationTracker();
  const action = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  const spy = jest.spyOn(NavigationTracker.prototype, "pushToDataLayer");
  const constructorSpy = jest.spyOn(
    NavigationTracker.prototype,
    "initialiseEventListener",
  );

  test("new instance should call initialiseEventListener", () => {
    const instance = new NavigationTracker();
    expect(newInstance.initialiseEventListener).toBeCalled();
  });

  //test trackNavigation doesn't accept anything except button or link
  test("trackNavigation should return false if not a link or a button", () => {
    const href = document.createElement("div");
    href.className = "govuk-footer__link";
    href.addEventListener("click", (event) => {
      expect(newInstance.trackNavigation(event)).toBe(false);
    });
    href.dispatchEvent(action);
  });

  //test trackNavigation accept button
  test("trackNavigation should return true if a link", () => {
    const href = document.createElement("A");
    href.className = "govuk-footer__link";
    href.innerHTML = "Link to GOV.UK";
    href.setAttribute("href", "http://localhost");
    href.addEventListener("click", (event) => {
      expect(newInstance.trackNavigation(event)).toBe(true);
    });
    href.dispatchEvent(action);
  });

  //test trackNavigation accept link
  test("trackNavigation should return false if a link without href", () => {
    const href = document.createElement("A");
    href.className = "govuk-footer__link";
    href.innerHTML = "Link to GOV.UK";
    href.addEventListener("click", (event) => {
      expect(newInstance.trackNavigation(event)).toBe(false);
    });
    href.dispatchEvent(action);
  });

  //test pushToDataLayer is called
  test("pushToDataLayer is called", () => {
    const href = document.createElement("A");
    href.className = "govuk-footer__link";
    href.addEventListener("click", (event) => {
      newInstance.trackNavigation(event);
    });
    href.dispatchEvent(action);
    expect(newInstance.pushToDataLayer).toBeCalled();
  });
});

describe("getLinkType", () => {
  const newInstance = new NavigationTracker();
  const action = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });

  test('should return "footer" when the element is an <a> tag with footer link class', () => {
    const href = document.createElement("A");
    href.className = "govuk-footer__link";
    href.dispatchEvent(action);
    const element = action.target as HTMLLinkElement;
    expect(newInstance.getLinkType(element)).toBe("footer");
  });

  test('should return "header menu bar" when the element is an <a> tag with header menu bar link class', () => {
    const href = document.createElement("A");
    href.className = "header__navigation";
    href.dispatchEvent(action);
    const element = action.target as HTMLLinkElement;
    expect(newInstance.getLinkType(element)).toBe("header menu bar");
  });

  test('should return "generic link" when the element is an <a> tag without footer or header menu bar link class', () => {
    const href = document.createElement("A");
    href.className = "other-link";
    href.dispatchEvent(action);
    const element = action.target as HTMLLinkElement;
    expect(newInstance.getLinkType(element)).toBe("generic link");
  });

  test('should return "generic button" when the element is a <button> tag', () => {
    const button = document.createElement("BUTTON");
    button.className = "other-link";
    button.dispatchEvent(action);
    const element = action.target as HTMLLinkElement;
    expect(newInstance.getLinkType(element)).toBe("generic button");
  });
});

describe("isExternalLink", () => {
  const newInstance = new NavigationTracker();

  test("should return false for internal links", () => {
    const url = "http://localhost";
    expect(newInstance.isExternalLink(url)).toBe(false);
  });

  test("should return true for external links", () => {
    const url = "https://google.com";
    expect(newInstance.isExternalLink(url)).toBe(true);
  });
});

describe("isHeaderMenuBarLink", () => {
  const newInstance = new NavigationTracker();

  test('should return true if the class name includes "header__navigation"', () => {
    expect(newInstance.isHeaderMenuBarLink("header__navigation")).toBe(true);
  });

  test('should return false if the class name does not include "header__navigation"', () => {
    expect(newInstance.isHeaderMenuBarLink("header__logo")).toBe(false);
  });

  test('should return true if the class name includes "header__navigation" along with other classes', () => {
    expect(
      newInstance.isHeaderMenuBarLink("header__navigation header__logo"),
    ).toBe(true);
  });

  test("should return false if the class name is an empty string", () => {
    expect(newInstance.isHeaderMenuBarLink("")).toBe(false);
  });
});

describe("isFooterLink", () => {
  const newInstance = new NavigationTracker();

  test("should return true if the class name contains 'govuk-footer__link'", () => {
    expect(newInstance.isFooterLink("govuk-footer__link")).toBe(true);
  });

  test("should return false if the class name does not contain 'govuk-footer__link'", () => {
    expect(newInstance.isFooterLink("some-other-class")).toBe(false);
  });

  test("should return true if the class name contains 'govuk-footer__link' along with other classes", () => {
    expect(
      newInstance.isFooterLink("govuk-footer__link some-other-class"),
    ).toBe(true);
  });

  test("should return true if the class name contains 'govuk-footer__link' as a substring", () => {
    expect(newInstance.isFooterLink("some-class-govuk-footer__link")).toBe(
      true,
    );
  });

  test("should return false if the class name is an empty string", () => {
    expect(newInstance.isFooterLink("")).toBe(false);
  });
});
