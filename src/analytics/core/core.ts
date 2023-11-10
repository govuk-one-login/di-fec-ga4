import { PageViewTracker } from "../pageViewTracker/pageViewTracker";

export class Analytics {
  gtmId: string;
  pageViewTracker: PageViewTracker;

  /**
   * Initializes a new instance of the class.
   *
   * @param {string} gtmId - The GTM ID for the instance.
   */
  constructor(gtmId: string) {
    this.gtmId = gtmId;
    this.pageViewTracker = new PageViewTracker();
    this.loadGtmScript();
  }

  /**
   * Loads the Google Tag Manager script.
   *
   */
  loadGtmScript() {
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
