import {
  AppConfigInterface,
  OptionsInterface,
} from "./analytics/core/core.interface";
import { Analytics } from "./analytics/core/core";

declare global {
  interface Window {
    DI: any;
  }
}

const appInit = function (
  settings: AppConfigInterface,
  options: OptionsInterface,
): boolean {
  try {
    window.DI.analyticsGa4 = new Analytics(settings.ga4ContainerId, options);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

window.DI = window.DI || {};
window.DI.appInit = appInit;
