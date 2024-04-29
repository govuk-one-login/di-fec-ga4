import { BaseTracker } from "../baseTracker/baseTracker";

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
    const classes: Array<string> = Array.from(element.classList);

    if (
      !window.DI.analyticsGa4.cookie.consent ||
      !classes.some((className) => className.includes("govuk-details__"))
    ) {
      return false;
    }

    console.log(element);
    return;
  }
}
