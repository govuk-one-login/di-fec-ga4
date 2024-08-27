import logger from "loglevel";
import { validateParameter } from "../../utils/validateParameter";
import { FormTracker } from "../formTracker/formTracker";
import { FormEventInterface } from "../formTracker/formTracker.interface";
import { BaseTracker } from "../baseTracker/baseTracker";

export class FormChangeTracker extends FormTracker {
  eventName: string = "form_change_response";
  eventType: string = "event_data";
  enableFormChangeTracking: boolean;

  constructor(enableFormChangeTracking: boolean) {
    super();
    this.enableFormChangeTracking = enableFormChangeTracking;
    this.initialiseEventListener();
  }

  initialiseEventListener() {
    document.addEventListener("click", this.trackFormChange.bind(this), false);
  }

  /**
   * Tracks changes in a form and sends data to the analytics platform.
   *
   * @return {boolean} Returns true if the form change tracking is successful, otherwise false.
   */
  trackFormChange(event: Event): boolean {
    if (!window.DI.analyticsGa4.cookie.consent) {
      return false;
    }

    if (!this.enableFormChangeTracking) {
      return false;
    }

    const form = FormTracker.getFormElement();

    if (!form) {
      return false;
    }

    const element: HTMLLinkElement = event.target as HTMLLinkElement;

    // Ensure element is an <a> tag with "Change" text content and is not a lang toggle link
    if (
      element.tagName !== "A" ||
      !BaseTracker.isChangeLink(element) ||
      element.hasAttribute("hreflang")
    ) {
      return false;
    }

    const formChangeTrackerEvent: FormEventInterface = {
      event: this.eventType,
      event_data: {
        event_name: this.eventName,
        type: "undefined",
        url: validateParameter(element.href, 500),
        text: "change", // put static value. Waiting final documentation on form change tracker,
        section: validateParameter(FormChangeTracker.getSection(element), 100),
        action: "change response",
        external: "false",
        link_domain: BaseTracker.getDomain(element.href),
        "link_path_parts.1": BaseTracker.getDomainPath(element.href, 0),
        "link_path_parts.2": BaseTracker.getDomainPath(element.href, 1),
        "link_path_parts.3": BaseTracker.getDomainPath(element.href, 2),
        "link_path_parts.4": BaseTracker.getDomainPath(element.href, 3),
        "link_path_parts.5": BaseTracker.getDomainPath(element.href, 4),
      },
    };

    try {
      BaseTracker.pushToDataLayer(formChangeTrackerEvent);
      return true;
    } catch (err) {
      logger.error("Error in trackFormChange", err);
      return false;
    }
  }

  static getSection(element: HTMLElement): string {
    const { parentElement } = element;

    // Ensure the parent element exists
    if (!parentElement) {
      return "undefined";
    }

    let parentSiblingElement = parentElement?.previousElementSibling;
    while (parentSiblingElement) {
      if (parentSiblingElement.classList.contains("govuk-summary-list__key")) {
        const sectionValue =
          parentSiblingElement.textContent?.trim() || "undefined";
        return sectionValue;
      }
      parentSiblingElement = parentSiblingElement.previousElementSibling;
    }
    // If no matching sibling is found, check the parent element
    let parentTextContent = "";
    parentElement.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        parentTextContent += node.textContent?.trim() || "";
      }
    });
    return parentTextContent || "undefined";
  }
}
