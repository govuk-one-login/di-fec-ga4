import pageViewTracker from "./analytics/pageViewTracker/pageViewTracker.ts";
import formTracker from "./analytics/formTracker/formTracker.ts";
import navigationViewTracker from "./analytics/navigationViewTracker/navigationViewTracker.ts";

pageViewTracker();
formTracker();
navigationViewTracker();
console.log("running");
