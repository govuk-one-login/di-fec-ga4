import pageViewTracker from "./src/analytics/pageViewTracker/pageViewTracker.js";
import formTracker from "./src/analytics/formTracker/formTracker.js";
import navigationViewTracker from "./src/analytics/navigationViewTracker/navigationViewTracker.ts";

pageViewTracker();
formTracker();
navigationViewTracker();
console.log("running");
