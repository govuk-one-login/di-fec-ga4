import { AppConfigInterface } from "./analytics/core/core.interface";
import { Analytics } from "./analytics/core/core";

declare global {
  interface Window {
    DI: any;
  }
}

const appInit = function (settings: AppConfigInterface): boolean {
  try {
    window.DI.analyticsGa4 = new Analytics(settings.ga4ContainerId);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

window.DI = window.DI || {};
window.DI.appInit = appInit;
