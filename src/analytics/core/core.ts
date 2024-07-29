import logger from "loglevel";
import { Cookie } from "../../cookie/cookie";
import { FormChangeTracker } from "../formChangeTracker/formChangeTracker";
import { FormResponseTracker } from "../formResponseTracker/formResponseTracker";
import { NavigationTracker } from "../navigationTracker/navigationTracker";
import { PageViewTracker } from "../pageViewTracker/pageViewTracker";
import { SelectContentTracker } from "../selectContentTracker/selectContentTracker";
import { OptionsInterface } from "./core.interface";
import { BaseTracker } from "../baseTracker/baseTracker";

export class Analytics {
  gtmId: string;
  isDataSensitive: boolean | undefined;
  enableFormResponseTracking: boolean;
  enableNavigationTracking: boolean;
  enableFormChangeTracking: boolean;
  enableSelectContentTracking: boolean;
  uaContainerId: string | undefined;
  pageViewTracker: PageViewTracker | undefined;
  navigationTracker: NavigationTracker | undefined;
  formChangeTracker: FormChangeTracker | undefined;
  cookie: Cookie | undefined;
  formResponseTracker: FormResponseTracker | undefined;
  selectContentTracker: SelectContentTracker | undefined;

  /**
   * Initializes a new instance of the class.
   *
   * @param {string} gtmId - The GTM ID for the instance.
   */
  constructor(gtmId: string, options: OptionsInterface) {
    this.gtmId = gtmId;

    this.cookie = new Cookie(options.cookieDomain);
    this.isDataSensitive = Boolean(options.isDataSensitive);
    this.enableFormResponseTracking = Boolean(
      options.enableFormResponseTracking,
    );
    this.enableNavigationTracking = Boolean(options.enableNavigationTracking);
    this.enableFormChangeTracking = Boolean(options.enableFormChangeTracking);
    this.enableSelectContentTracking = Boolean(
      options.enableSelectContentTracking,
    );

    this.pageViewTracker = new PageViewTracker({
      enableGa4Tracking: options.enableGa4Tracking,
      enableUaTracking: options.enableUaTracking,
      enableFormChangeTracking: options.enableFormChangeTracking,
      enableFormErrorTracking: options.enableFormErrorTracking,
      enableFormResponseTracking: options.enableFormResponseTracking,
      enableNavigationTracking: options.enableNavigationTracking,
      enablePageViewTracking: options.enablePageViewTracking,
      enableSelectContentTracking: options.enableSelectContentTracking,
      cookieDomain: options.cookieDomain,
    });

    if (options.enableGa4Tracking) {
      BaseTracker.pushToDataLayer({
        "gtm.allowlist": ["google"],
        "gtm.blocklist": ["adm", "awct", "sp", "gclidw", "gcs", "opt"],
        "gtm.start": new Date().getTime(),
        event: "gtm.js",
      });
      this.formResponseTracker = new FormResponseTracker(
        this.isDataSensitive,
        this.enableFormResponseTracking,
      );
      this.navigationTracker = new NavigationTracker(
        this.enableNavigationTracking,
      );
      this.formChangeTracker = new FormChangeTracker(
        this.enableFormChangeTracking,
      );
      this.selectContentTracker = new SelectContentTracker(
        this.enableSelectContentTracking,
      );
      if (this.cookie.consent) {
        this.loadGtmScript(this.gtmId);
      }
    }
  }

  /**
   * Loads the Google Tag Manager script asynchronously and appends it to the document body.
   *
   * @return {boolean} Returns true if the script was successfully loaded and appended, otherwise false.
   */
  loadGtmScript(gtmId?: string): boolean {
    const defaultedGtmId = gtmId || this.gtmId;

    const googleSrc = `https://www.googletagmanager.com/gtm.js?id=${defaultedGtmId}`;
    const newScript = document.createElement("script");
    newScript.async = true;
    // initialise GTM
    newScript.src = googleSrc;
    try {
      document.body.appendChild(newScript);
      return true;
    } catch (err) {
      logger.error(err);
      return false;
    }
  }
}
