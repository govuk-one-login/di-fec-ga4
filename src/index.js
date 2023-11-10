import { Analytics } from "./analytics/core/core.ts";

window.DI = window.DI || {};
(function (DI) {
  "use strict";
  function initAnalytics({ ga4ContainerId }) {
    window.DI.analyticsGa4 = new Analytics(ga4ContainerId);
  }
  DI.appInit = initAnalytics;
})(window.DI);
