import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { FormChangeTracker } from "./formChangeTracker";
import { FormEventInterface } from "../formTracker/formTracker.interface";

window.DI = { analyticsGa4: { cookie: { consent: true } } };

describe("FormChangeTracker", () => {
  let newInstance: FormChangeTracker;
  let action: MouseEvent;

  beforeEach(() => {
    // Reset spies and create a new instance before each test
    jest.clearAllMocks(); // Clear all prior mock calls
    newInstance = new FormChangeTracker();
    action = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });
  });
  const spy = jest.spyOn(FormChangeTracker.prototype, "pushToDataLayer");
  const trackFormChangeSpy = jest.spyOn(
    FormChangeTracker.prototype,
    "trackFormChange",
  );

  const isChangeLinkSpy = jest.spyOn(
    FormChangeTracker.prototype,
    "isChangeLink",
  );

  const getSectionSpy = jest.spyOn(FormChangeTracker.prototype, "getSection");

  const constructorSpy = jest.spyOn(
    FormChangeTracker.prototype,
    "initialiseEventListener",
  );

  // test pushToDataLayer is called
  test("pushToDataLayer is called", () => {
    // Create the main content div
    const mainContent = document.createElement("div");
    mainContent.id = "main-content";

    // Create the anchor element
    const href = document.createElement("A");
    href.textContent = "Change";
    href.setAttribute("href", "http://localhost?edit=true");

    // Create the form element
    const form = document.createElement("form");
    form.appendChild(href);
    mainContent.appendChild(form);

    // Append the main content div to the document body
    document.body.appendChild(mainContent);

    // Add a click event listener to the anchor element
    href.addEventListener("click", (event) => {
      newInstance.trackFormChange(event);
    });

    href.dispatchEvent(action);

    // Check if pushToDataLayer was called
    expect(newInstance.pushToDataLayer).toBeCalled();
  });

  test("new instance should call initialiseEventListener", () => {
    expect(newInstance.initialiseEventListener).toBeCalled();
  });

  test("click should call trackNavigation", () => {
    const href = document.createElement("A");
    href.textContent = "Change organisation type";
    href.addEventListener("click", (event) => {
      expect(newInstance.trackFormChange).toBeCalled();
    });
  });

  test("trackFormChange should return false if not cookie consent", () => {
    window.DI.analyticsGa4.cookie.consent = false;
    const href = document.createElement("A");
    href.textContent = "Change organisation type";
    href.addEventListener("click", (event) => {
      expect(newInstance.trackFormChange).toReturnWith(false);
    });
  });

  //test trackFormChange doesn't accept anything except but Change link

  test("trackFormChange should return false if not a change link", () => {
    const href = document.createElement("div");
    href.className = "govuk-footer__link";
    href.addEventListener("click", (event) => {
      expect(newInstance.trackFormChange(event)).toBe(false);
    });
    href.dispatchEvent(action);
  });

  // test trackFormChange accept Change Link
  test("trackFormChange should return true if a Change link", () => {
    const href = document.createElement("A");
    href.textContent = "Change organisation type";

    document.body.appendChild(href);
    href.dispatchEvent(action);
    href.addEventListener("click", (event) => {
      expect(newInstance.trackFormChange(event)).toBe(true);
    });
    document.body.removeChild(href);
  });

  // test trackFormChange does not accept Lang Toggle Link
  test("trackFormChange should return false if it is a Lang Toggle link", () => {
    const href = document.createElement("A");
    href.textContent = "Change organisation type";
    href.setAttribute("hreflang", "en");

    document.body.appendChild(href);
    href.dispatchEvent(action);
    href.addEventListener("click", (event) => {
      expect(newInstance.trackFormChange(event)).toBe(false);
    });
    document.body.removeChild(href);
  });

  test;
  test("should return 'undefined' if parent element does not exist", () => {
    const element = document.createElement("div");
    expect(newInstance.getSection(element)).toBe("undefined");
  });

  test("should return text content of sibling with class 'govuk-summary-list__key'", () => {
    const parentElement = document.createElement("div");
    const siblingElement = document.createElement("div");
    siblingElement.classList.add("govuk-summary-list__key");
    siblingElement.textContent = "Expected Section";

    const href = document.createElement("a");
    parentElement.appendChild(href);

    document.body.appendChild(siblingElement); // Sibling is added to the document body before the parent
    document.body.appendChild(parentElement); // Parent is added to the document body

    expect(newInstance.getSection(href)).toBe("Expected Section");
  });

  test("should check and return text content of parent element if no matching sibling found", () => {
    const parentElement = document.createElement("div");
    parentElement.textContent = "Parent Content";

    const element = document.createElement("div");
    parentElement.appendChild(element);

    expect(newInstance.getSection(element)).toBe("Parent Content");
  });

  test("should return 'undefined' if no matching sibling found and parent has no text content", () => {
    const parentElement = document.createElement("div");

    const element = document.createElement("div");
    parentElement.appendChild(element);

    expect(newInstance.getSection(element)).toBe("undefined");
  });

  test("should return 'undefined' if sibling element is not a sibling of the provided element", () => {
    const parentElement = document.createElement("div");
    const siblingElement = document.createElement("div");
    siblingElement.classList.add("govuk-summary-list__key");
    siblingElement.textContent = "Expected Section";

    // Add sibling element outside the parent element
    document.body.appendChild(siblingElement);

    const element = document.createElement("div");
    parentElement.appendChild(element);

    expect(newInstance.getSection(element)).toBe("undefined");
  });
});
