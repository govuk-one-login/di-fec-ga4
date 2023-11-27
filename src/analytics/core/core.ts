import { FormResponseTracker } from "../formTracker/formTracker";
import { NavigationTracker } from "../navigationTracker/navigationTracker";
import { PageViewTracker } from "../pageViewTracker/pageViewTracker";
import { OptionsInterface } from "./core.interface";

export class Analytics {
  gtmId: string;
  pageViewTracker: PageViewTracker | undefined;
  navigationTracker: NavigationTracker | undefined;
  formResponseTracker: FormResponseTracker | undefined;

  /**
   * Initializes a new instance of the class.
   *
   * @param {string} gtmId - The GTM ID for the instance.
   */
  constructor(gtmId: string, options: OptionsInterface = {}) {
    this.gtmId = gtmId;
    this.pageViewTracker = new PageViewTracker({
      disableGa4Tracking: options.disableGa4Tracking,
    });
    if (!options.disableGa4Tracking) {
      this.navigationTracker = new NavigationTracker();
      this.formResponseTracker = new FormResponseTracker({
        disableFreeTextTracking: options.disableFormFreeTextTracking,
      });
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
