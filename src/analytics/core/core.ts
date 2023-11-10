export class Analytics {
  gtmId: string;
  /**
   * Initializes a new instance of the class.
   *
   * @param {string} gtmId - The GTM ID for the instance.
   */
  constructor(gtmId: string) {
    console.log("constructor called");
    this.gtmId = gtmId;
    this.loadGtmScript();
  }

  /**
   * Loads the Google Tag Manager script.
   *
   */
  loadGtmScript() {
    console.log("load gtm script");
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
