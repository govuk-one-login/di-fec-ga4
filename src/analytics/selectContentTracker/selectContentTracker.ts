import { BaseTracker } from "../baseTracker/baseTracker";
import { SelectContentTrackerInterface } from "./selectContentTracker.interface";

export class SelectContentTracker extends BaseTracker {
  eventName: string = "select_content";
  eventType: string = "detail ui";

  constructor() {
    super();
    this.initEventListener();
  }

  initEventListener() {
    document.addEventListener("click", this.trackDetails.bind(this), false);
  }

  trackDetails(event: Event) {
    let element: HTMLElement = event.target as HTMLElement;
    let type: string = "undefined";
    const classes: Array<string> = Array.from(element.classList);

    if (!window.DI.analyticsGa4.cookie.consent) {
      return false;
    }

    if (classes.some((className) => className.includes("govuk-details"))) {
      type = "detail ui";
    } else if (
      classes.some((className) => className.includes("govuk-accordion"))
    ) {
      type = "accordion";
    } else {
      return false;
    }
    console.log(element);

    const selectContentTrackerEvent: SelectContentTrackerInterface = {
      event: "event_data",
      event_data: {
        event_name: this.eventName,
        type,
        // url: "undefined",
        text: this.getEventText(element).trim(),
        // section: "undefined",
        action: this.getEventAction(element),
        external: "false",
        // link_domain: "undefined",
        // "link_path_parts.1": "undefined",
        // "link_path_parts.2": "undefined",
        // "link_path_parts.3": "undefined",
        // "link_path_parts.4": "undefined",
        // "link_path_parts.5": "undefined",
      },
    };

    console.log(selectContentTrackerEvent);

    return;

    // try {
    //   this.pushToDataLayer(selectContentTrackerEvent);
    //   return true;
    // } catch(err) {
    //   console.error("Error in SelectContentTracker", err);
    //   return false;
    // }
  }

  getEventText(element: HTMLElement): string {
    let eventText: string = "undefined";
    element.tagName === "SUMMARY"
      ? (eventText = element.firstElementChild?.textContent as string)
      : (eventText = element.textContent as string);
    return eventText;
  }

  getEventAction(element: HTMLElement): string {
    const parent = element.closest(".govuk-details");
    return parent?.hasAttribute("open") ? "closed" : "opened";
  }
}
