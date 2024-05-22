import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { SelectContentTracker } from "./selectContentTracker";
import { SelectContentTrackerInterface } from "./selectContentTracker.interface";

window.DI = { analyticsGa4: { cookie: { consent: true } } };

const parameters: SelectContentTrackerInterface = {
  event: "",
  event_data: {
    event_name: "",
    type: "",
    // url: "",
    text: "",
    // section: "",
    action: "",
    external: "",
    // link_domain: "";
    // "link_path_parts.1": "",
    // "link_path_parts.2": "",
    // "link_path_parts.3": "",
    // "link_path_parts.4": "",
    // "link_path_parts.5": "",
  },
};

describe("selectContentTracker", () => {
  const trackerInstance = new SelectContentTracker();

  test("pushToDataLayer is called", () => {
    expect(trackerInstance.initEventListener).toBeCalled();
  });
});
