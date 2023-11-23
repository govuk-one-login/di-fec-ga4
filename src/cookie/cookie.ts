export class Cookie {
  public consent: boolean = false;
  public COOKIES_PREFERENCES_SET = "cookies_preferences_set";
  private cookiesAccepted = document.getElementById("cookies-accepted");
  private cookiesRejected = document.getElementById("cookies-rejected");
  private hideCookieBanner =
    document.getElementsByClassName("cookie-hide-button");
  private cookieBannerContainer: HTMLCollectionOf<Element> =
    document.getElementsByClassName("govuk-cookie-banner");
  private cookieBanner = document.getElementById("cookies-banner-main");
  private acceptCookies = document.getElementsByName("cookiesAccept");
  private rejectCookies = document.getElementsByName("cookiesReject");

  constructor() {
    this.initialise();
  }

  /**
   * Initializes the object and performs necessary setup.
   */
  initialise(): void {
    //Check if a cookie preference has been set
    const savedCookiePreference = this.getCookie(this.COOKIES_PREFERENCES_SET);
    if (savedCookiePreference) {
      this.consent = this.hasConsentForAnalytics();
      this.hideElement(this.cookieBannerContainer[0] as HTMLElement);
    } else {
      //add event listerners
      this.acceptCookies[0].addEventListener(
        "click",
        this.handleAcceptClickEvent.bind(this),
      );
      this.rejectCookies[0].addEventListener(
        "click",
        this.handleRejectClickEvent.bind(this),
      );

      const hideButtons = Array.prototype.slice.call(this.hideCookieBanner);
      for (let i = 0; i < hideButtons.length; i++) {
        hideButtons[i].addEventListener(
          "click",
          this.handleHideButtonClickEvent.bind(this),
        );
      }
    }
  }

  /**
   * Handles the click event when the accept button is clicked.
   *
   * @param {Event} event - The click event.
   */
  handleAcceptClickEvent(event: Event): void {
    event.preventDefault();
    this.setBannerCookieConsent(true, window.location.hostname);
    this.consent = true;
    window.DI.analyticsGa4.loadGtmScript();
    //this.parent.loadGtmScript();
  }

  /**
   * Handles the click event when the reject button is clicked.
   *
   * @param {Event} event - The click event object.
   */
  handleRejectClickEvent(event: Event): void {
    event.preventDefault();
    this.consent = false;
    this.setBannerCookieConsent(false, window.location.hostname);
  }

  /**
   * Handles the click event of the hide button.
   *
   * @param {Event} event - The click event.
   */
  handleHideButtonClickEvent(event: Event): void {
    event.preventDefault();
    this.hideElement(this.cookieBannerContainer[0] as HTMLElement);
  }

  /**
   * Set the banner cookie consent.
   *
   * @param {boolean} analyticsConsent - Whether analytics consent is given or not.
   * @param {string} domain - The domain where the cookie is set.
   */
  setBannerCookieConsent(analyticsConsent: boolean, domain: string): void {
    this.setCookie(
      this.COOKIES_PREFERENCES_SET,
      { analytics: analyticsConsent },
      { days: 365 },
      domain,
    );

    if (this.cookieBanner) {
      this.hideElement(this.cookieBanner);
    }

    if (analyticsConsent === true) {
      if (this.cookiesAccepted) {
        this.showElement(this.cookiesAccepted);
      }

      let event;
      if (typeof window.CustomEvent === "function") {
        event = new window.CustomEvent("cookie-consent");
      } else {
        event = document.createEvent("CustomEvent");
        event.initCustomEvent("cookie-consent");
      }
      window.dispatchEvent(event);
    } else {
      if (this.cookiesRejected) {
        this.showElement(this.cookiesRejected);
      }
    }
  }

  /**
   * Checks whether the user has given consent for analytics.
   *
   * @return {boolean} - Returns true if the user has given consent for analytics, false otherwise.
   */
  hasConsentForAnalytics(): boolean {
    const cookieConsent = JSON.parse(
      decodeURIComponent(this.getCookie(this.COOKIES_PREFERENCES_SET)),
    );
    return cookieConsent ? cookieConsent.analytics === true : false;
  }

  /**
   * Retrieves the value of a cookie by its name.
   *
   * @param {string} name - The name of the cookie to retrieve.
   * @return {string} The value of the cookie if found, or an empty string if not found.
   */
  getCookie(name: string): string {
    const nameEQ = name + "=";
    if (document.cookie) {
      const cookies = document.cookie.split(";");
      for (let i = 0, len = cookies.length; i < len; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === " ") {
          cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) === 0) {
          return cookie.substring(nameEQ.length);
        }
      }
    }
    return "";
  }

  /**
   * Sets a cookie with the given name, values, options, and domain.
   *
   * @param {string} name - The name of the cookie.
   * @param {any} values - The values to be stored in the cookie.
   * @param {any} options - The options for the cookie (optional).
   * @param {string} domain - The domain to which the cookie belongs.
   * @return {void} This function does not return a value.
   */
  setCookie(name: string, values: any, options: any, domain: string): void {
    if (typeof options === "undefined") {
      options = {};
    }
    let cookieString = name + "=" + encodeURIComponent(JSON.stringify(values));
    if (options.days) {
      let date = new Date();
      date.setTime(date.getTime() + options.days * 24 * 60 * 60 * 1000);
      cookieString =
        cookieString +
        "; Expires=" +
        date.toUTCString() +
        "; Path=/; Domain=" +
        domain;
    }

    if (document.location.protocol === "https:") {
      cookieString = cookieString + "; Secure";
    }
    document.cookie = cookieString;
  }

  /**
   * Hides the given HTML element by setting its display property to "none".
   *
   * @param {HTMLElement} element - The HTML element to be hidden.
   */
  hideElement(element: HTMLElement): void {
    element.style.display = "none";
  }

  /**
   * Shows the specified HTML element by setting its display property to "block".
   *
   * @param {HTMLElement} element - The element to be shown.
   */
  showElement(element: HTMLElement): void {
    element.style.display = "block";
  }
}
