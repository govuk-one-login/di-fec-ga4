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
    document.body.innerHTML = `
  <main id="main-content">
    <form>
      <a id="change_link" href="http://localhost?edit=true">Change</a>
    </form>
  </main>
`;
    const href = document.getElementById("change_link") as HTMLAnchorElement;
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
    document.body.innerHTML = `<a id="change_link" href="http://localhost?edit=true">Change</a>`;
    const href = document.getElementById("change_link") as HTMLAnchorElement;
    href.dispatchEvent(action);
    href.addEventListener("click", (event) => {
      expect(newInstance.trackFormChange(event)).toBe(true);
    });
  });

  // test trackFormChange does not accept Lang Toggle Link
  test("trackFormChange should return false if it is a Lang Toggle link", () => {
    document.body.innerHTML = `<a id="change_link" href="http://localhost?edit=true hreflang="en">Change</a>`;
    const href = document.getElementById("change_link") as HTMLAnchorElement;
    href.dispatchEvent(action);
    href.addEventListener("click", (event) => {
      expect(newInstance.trackFormChange(event)).toBe(false);
    });
  });

  test("should return 'undefined' if parent element does not exist", () => {
    document.body.innerHTML = `<a id="change_link" href="http://localhost?edit=true">Change</a>`;
    const href = document.getElementById("change_link") as HTMLAnchorElement;
    expect(newInstance.getSection(href)).toBe("undefined");
  });

  test("should return text content of sibling with class 'govuk-summary-list__key'", () => {
    document.body.innerHTML = `
    <div class="govuk-summary-list__key">Expected Section</div>
    <div>
      <a id="change_link">Change</a>
    </div>
  `;
    const href = document.getElementById("change_link") as HTMLAnchorElement;
    expect(newInstance.getSection(href)).toBe("Expected Section");
  });

  test("should check and return text content of parent element if no matching sibling found", () => {
    document.body.innerHTML = `  
    <div>
    Postcode
      <a id="change_link">Change</a> 
    </div>
  `;
    const href = document.getElementById("change_link") as HTMLAnchorElement;
    expect(newInstance.getSection(href)).toBe("Postcode");
  });

  test("should return 'undefined' if no matching sibling found and parent has no text content", () => {
    document.body.innerHTML = `
      <div>
        <a id="change_link">Change</a>
      </div>
    `;
    const href = document.getElementById("change_link") as HTMLAnchorElement;

    expect(newInstance.getSection(href)).toBe("undefined");
  });

  test("should return 'undefined' if summary list key has no text content", () => {
    document.body.innerHTML = `
    <div class="govuk-summary-list__key"></div>
    <div>
      <a id="change_link">Change</a>
    </div>
  `;
    const href = document.getElementById("change_link") as HTMLAnchorElement;
    expect(newInstance.getSection(href)).toBe("undefined");
  });
});
