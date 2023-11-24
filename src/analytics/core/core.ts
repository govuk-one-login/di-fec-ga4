import { Cookie } from "../../cookie/cookie";
import { NavigationTracker } from "../navigationTracker/navigationTracker";
import { PageViewTracker } from "../pageViewTracker/pageViewTracker";

export class Analytics {
  gtmId: string;
  pageViewTracker: PageViewTracker;
  navigationTracker: NavigationTracker;
  cookie: Cookie;
  /**
   * Initializes a new instance of the class.
   *
   * @param {string} gtmId - The GTM ID for the instance.
   */
  constructor(gtmId: string) {
    this.gtmId = gtmId;
    this.cookie = new Cookie();
    this.pageViewTracker = new PageViewTracker();
    this.navigationTracker = new NavigationTracker();

    if (this.cookie.consent) {
      this.loadGtmScript();
    }
  }

  /**
   * Loads the Google Tag Manager script asynchronously and appends it to the document body.
   *
   * @return {boolean} Returns true if the script was successfully loaded and appended, otherwise false.
   */
  loadGtmScript(): boolean {
    const googleSrc =
      "https://www.googletagmanager.com/gtm.js?id=" + this.gtmId;
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
