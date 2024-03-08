import { Cookie } from "../../cookie/cookie";
import { FormResponseTracker } from "../formResponseTracker/formResponseTracker";
import { NavigationTracker } from "../navigationTracker/navigationTracker";
import { PageViewTracker } from "../pageViewTracker/pageViewTracker";
import { OptionsInterface } from "./core.interface";

export class Analytics {
  gtmId: string;
  uaContainerId: string | undefined;
  pageViewTracker: PageViewTracker | undefined;
  navigationTracker: NavigationTracker | undefined;
  cookie: Cookie | undefined;
  formResponseTracker: FormResponseTracker | undefined;

  /**
   * Initializes a new instance of the class.
   *
   * @param {string} gtmId - The GTM ID for the instance.
   */
  constructor(gtmId: string, options: OptionsInterface = {}) {
    this.gtmId = gtmId;

    this.cookie = new Cookie(options.cookieDomain);

    this.pageViewTracker = new PageViewTracker({
      disableGa4Tracking: options.disableGa4Tracking,
    });

    if (!options.disableGa4Tracking) {
      this.formResponseTracker = new FormResponseTracker();
      this.navigationTracker = new NavigationTracker();
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
  loadGtmScript(gtmId: string): boolean {
    if (!gtmId) {
      gtmId = this.gtmId;
    }

    const googleSrc = "https://www.googletagmanager.com/gtm.js?id=" + gtmId;
    const newScript = document.createElement("script");
    newScript.async = true;
    // initialise GTM
    newScript.src = googleSrc;
    try {
      document.body.appendChild(newScript);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}
