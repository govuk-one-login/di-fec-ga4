import { describe, expect, jest, test, beforeEach } from "@jest/globals";
import { SelectContentTracker } from "./selectContentTracker";
import { SelectContentEventInterface } from "./selectContentTracker.interface";
import { BaseTracker } from "../baseTracker/baseTracker";

describe("selectContentTracker", () => {
  let newInstance: SelectContentTracker;
  let action: MouseEvent;
  beforeEach(() => {
    jest.clearAllMocks();

    window.DI = { analyticsGa4: { cookie: { consent: true } } };

    newInstance = new SelectContentTracker(true);
    action = new MouseEvent("toggle", {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    jest.spyOn(BaseTracker, "pushToDataLayer");
    jest.spyOn(SelectContentTracker.prototype, "trackSelectContent");
    jest.spyOn(SelectContentTracker.prototype, "initialiseEventListener");
  });

  test("new instance should call event listener", () => {
    const instance = new SelectContentTracker(true);
    expect(instance.initialiseEventListener).toBeCalled();
  });
  test("should be disabled when flag set to false", () => {
    const instance = new SelectContentTracker(false);
    expect(instance.trackSelectContent).not.toBeCalled();
  });

  test("initialiseEventListener should attach event listener to each details element", () => {
    const details1 = document.createElement("details");
    const details2 = document.createElement("details");

    document.body.appendChild(details1);
    document.body.appendChild(details2);

    // Spy on addEventListener for both elements
    const addEventListenerSpy = jest.spyOn(
      HTMLElement.prototype,
      "addEventListener",
    );

    // Initialise event listeners
    newInstance.initialiseEventListener();

    expect(addEventListenerSpy).toHaveBeenCalledTimes(2); // Ensure it's called twice
  });

  test("toggle should call trackSelectContent", () => {
    const details = document.createElement("details");
    details.addEventListener("toggle", () => {
      expect(newInstance.trackSelectContent).toBeCalled();
    });
  });
  test("pushToDataLayer is called", () => {
    const details = document.createElement("details");
    details.addEventListener("toggle", (event) => {
      newInstance.trackSelectContent(event);
    });
    details.dispatchEvent(action);
    expect(BaseTracker.pushToDataLayer).toBeCalled();
  });
  test("should push data to data layer for each details component", () => {
    const span1 = document.createElement("span");
    span1.className = "govuk-details__summary-text";
    span1.textContent = "Details Summary Text";
    const firstDetails = document.createElement("details");
    firstDetails.open = true;
    firstDetails.append(span1);
    const secondDetails = document.createElement("details");
    secondDetails.open = true;
    const span2 = document.createElement("span");
    span2.className = "govuk-details__summary-text";
    span2.textContent = "Details Summary Text 2";
    secondDetails.append(span2);
    const dataLayerEventFirstDetails: SelectContentEventInterface = {
      event: "event_data",
      event_data: {
        event_name: "select_content",
        type: "details ui",
        url: "undefined",
        text: "Details Summary Text",
        section: "undefined",
        action: "opened",
        external: "undefined",
        link_domain: "undefined",
        "link_path_parts.1": "undefined",
        "link_path_parts.2": "undefined",
        "link_path_parts.3": "undefined",
        "link_path_parts.4": "undefined",
        "link_path_parts.5": "undefined",
      },
    };

    const dataLayerEventSecondDetails: SelectContentEventInterface = {
      event: "event_data",
      event_data: {
        event_name: "select_content",
        type: "details ui",
        url: "undefined",
        text: "Details Summary Text 2",
        section: "undefined",
        action: "opened",
        external: "undefined",
        link_domain: "undefined",
        "link_path_parts.1": "undefined",
        "link_path_parts.2": "undefined",
        "link_path_parts.3": "undefined",
        "link_path_parts.4": "undefined",
        "link_path_parts.5": "undefined",
      },
    };

    firstDetails.addEventListener("toggle", (event) => {
      newInstance.trackSelectContent(event);
    });
    firstDetails.dispatchEvent(action);
    expect(BaseTracker.pushToDataLayer).toBeCalledWith(
      dataLayerEventFirstDetails,
    );
    secondDetails.addEventListener("toggle", (event) => {
      newInstance.trackSelectContent(event);
    });
    secondDetails.dispatchEvent(action);
    expect(BaseTracker.pushToDataLayer).toBeCalledWith(
      dataLayerEventSecondDetails,
    );
  });
});

describe("Cookie Management", () => {
  test("trackSelectContent should return false if not cookie consent", () => {
    jest.spyOn(SelectContentTracker.prototype, "trackSelectContent");
    window.DI.analyticsGa4.cookie.consent = false;
    const enableSelectContentTracking = true;
    const instance = new SelectContentTracker(enableSelectContentTracking);
    const details = document.createElement("details");
    details.addEventListener("toggle", () => {
      expect(instance.trackSelectContent).toReturnWith(false);
    });
  });
});

describe("getSummaryText", () => {
  const action = new MouseEvent("toggle", {
    view: window,
    bubbles: true,
    cancelable: true,
  });

  test("should return text of span/element inside details element if class name is govuk-details__summary-text", () => {
    const details = document.createElement("details");
    const span = document.createElement("span");
    span.className = "govuk-details__summary-text";
    span.textContent = "Details Summary Text";
    details.appendChild(span);
    details.dispatchEvent(action);
    const element = action.target as HTMLDetailsElement;
    expect(SelectContentTracker.getSummaryText(element)).toBe(
      "Details Summary Text",
    );
  });

  test("should return undefined if no element with class of govuk-details__summary-text", () => {
    const details = document.createElement("details");
    const span = document.createElement("span");
    span.textContent = "Details Summary Text";
    details.appendChild(span);
    details.dispatchEvent(action);
    const element = action.target as HTMLDetailsElement;
    expect(SelectContentTracker.getSummaryText(element)).toBe("undefined");
  });
});

describe("getActionValue", () => {
  const action = new MouseEvent("toggle", {
    view: window,
    bubbles: true,
    cancelable: true,
  });

  test("should return opened if details element has been toggled open", () => {
    const details = document.createElement("details");
    details.open = true;
    details.dispatchEvent(action);
    const element = action.target as HTMLDetailsElement;
    expect(SelectContentTracker.getActionValue(element)).toBe("opened");
  });

  test("should return closed if details element has been closed", () => {
    const details = document.createElement("details");
    details.dispatchEvent(action);
    const element = action.target as HTMLDetailsElement;
    expect(SelectContentTracker.getActionValue(element)).toBe("closed");
  });
});
