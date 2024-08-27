import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { FormChangeTracker } from "./formChangeTracker";
import { BaseTracker } from "../baseTracker/baseTracker";

function createForm() {
  document.body.innerHTML = `
    <main id="main-content">
      <form>
        <a id="change_link" href="http://localhost?edit=true">Change</a>
      </form>
    </main>
  `;

  return {
    changeLink: document.getElementById("change_link")!,
    form: document.getElementsByTagName("form")[0],
  };
}

describe("FormChangeTracker", () => {
  let newInstance: FormChangeTracker;
  let action: MouseEvent;

  beforeEach(() => {
    jest.clearAllMocks();

    window.DI = { analyticsGa4: { cookie: { consent: true } } };

    jest.spyOn(BaseTracker, "pushToDataLayer");
    jest.spyOn(FormChangeTracker.prototype, "initialiseEventListener");
    jest.spyOn(FormChangeTracker.prototype, "trackFormChange");

    const enableFormChangeTracking = true;
    newInstance = new FormChangeTracker(enableFormChangeTracking);
    action = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });
  });

  test("form change should be deactivated, if flag is set to false", () => {
    const instance = new FormChangeTracker(false);
    expect(instance.trackFormChange).not.toBeCalled();
  });

  test("new instance should call initialiseEventListener", () => {
    expect(newInstance.initialiseEventListener).toBeCalled();
  });

  test("pushToDataLayer is called", () => {
    const { changeLink } = createForm();
    changeLink.dispatchEvent(action);
    expect(BaseTracker.pushToDataLayer).toBeCalledWith({
      event: "event_data",
      event_data: {
        action: "change response",
        event_name: "form_change_response",
        external: "false",
        link_domain: "http://localhost",
        "link_path_parts.1": "/",
        "link_path_parts.2": "undefined",
        "link_path_parts.3": "undefined",
        "link_path_parts.4": "undefined",
        "link_path_parts.5": "undefined",
        section: "undefined",
        text: "change",
        type: "undefined",
        url: "http://localhost/?edit=true",
      },
    });
  });

  test("trackFormChange should return false if not cookie consent", () => {
    window.DI.analyticsGa4.cookie.consent = false;
    const { changeLink } = createForm();
    changeLink.dispatchEvent(action);
    expect(BaseTracker.pushToDataLayer).not.toHaveBeenCalled();
  });

  test("trackFormChange should return false if not a change link", () => {
    const { form } = createForm();

    const href = document.createElement("div");
    href.className = "govuk-footer__link";
    form.appendChild(href);

    href.dispatchEvent(action);

    expect(BaseTracker.pushToDataLayer).not.toHaveBeenCalled();
  });

  test("trackFormChange should return true if a Change link", () => {
    const { changeLink } = createForm();
    changeLink.dispatchEvent(action);
    expect(BaseTracker.pushToDataLayer).toHaveBeenCalled();
  });

  test("trackFormChange should return false if it is a Lang Toggle link", () => {
    const { changeLink } = createForm();
    changeLink.setAttribute("hreflang", "en");
    changeLink.dispatchEvent(action);
    expect(BaseTracker.pushToDataLayer).not.toHaveBeenCalled();
  });

  test("should return 'undefined' if parent element does not exist", () => {
    document.body.innerHTML = `<a id="change_link" href="http://localhost?edit=true">Change</a>`;
    const href = document.getElementById("change_link") as HTMLAnchorElement;
    expect(FormChangeTracker.getSection(href)).toBe("undefined");
  });

  test("should return text content of sibling with class 'govuk-summary-list__key'", () => {
    document.body.innerHTML = `
    <div class="govuk-summary-list__key">Expected Section</div>
    <div>
      <a id="change_link">Change</a>
    </div>
  `;
    const href = document.getElementById("change_link") as HTMLAnchorElement;
    expect(FormChangeTracker.getSection(href)).toBe("Expected Section");
  });

  test("should check and return text content of parent element if no matching sibling found", () => {
    document.body.innerHTML = `  
    <div>
    Postcode
      <a id="change_link">Change</a> 
    </div>
  `;
    const href = document.getElementById("change_link") as HTMLAnchorElement;
    expect(FormChangeTracker.getSection(href)).toBe("Postcode");
  });

  test("should return 'undefined' if no matching sibling found and parent has no text content", () => {
    document.body.innerHTML = `
      <div>
        <a id="change_link">Change</a>
      </div>
    `;
    const href = document.getElementById("change_link") as HTMLAnchorElement;

    expect(FormChangeTracker.getSection(href)).toBe("undefined");
  });

  test("should return 'undefined' if summary list key has no text content", () => {
    document.body.innerHTML = `
    <div class="govuk-summary-list__key"></div>
    <div>
      <a id="change_link">Change</a>
    </div>
  `;
    const href = document.getElementById("change_link") as HTMLAnchorElement;
    expect(FormChangeTracker.getSection(href)).toBe("undefined");
  });
});
