import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { Cookie } from "./cookie";

window.DI = {
  analyticsGa4: { loadGtmScript: () => {}, cookie: { consent: true } },
};

const cookieDomain = "";

describe("initialise Cookie", () => {
  const instance = new Cookie(cookieDomain);
  test("should hide the cookie banner if a cookie preference has been set", () => {
    jest.spyOn(instance, "getCookie").mockReturnValue("true");
    jest.spyOn(instance, "hasConsentForAnalytics").mockReturnValue(true);
    jest.spyOn(instance, "hideElement").mockImplementation(() => {});
    instance.initialise();
    expect(instance.hideElement).toHaveBeenCalledWith(
      instance.cookieBannerContainer[0],
    );
  });
});

describe("handleAcceptClickEvent", () => {
  const event = new Event("click");
  const instance = new Cookie(cookieDomain);

  test("should load GTM script", () => {
    const spy = jest.spyOn(window.DI.analyticsGa4, "loadGtmScript");
    instance.handleAcceptClickEvent(event);
    expect(window.DI.analyticsGa4.loadGtmScript).toHaveBeenCalled();
  });

  test("should set consent property to true", () => {
    instance.handleAcceptClickEvent(event);
    expect(instance.consent).toBe(true);
  });

  test("should load setBannerCookieConsent", () => {
    const spy = jest.spyOn(instance, "setBannerCookieConsent");
    instance.handleAcceptClickEvent(event);
    expect(instance.setBannerCookieConsent).toHaveBeenCalled();
  });
});

describe("handleRejectClickEvent", () => {
  const event = new Event("click");
  const instance = new Cookie(cookieDomain);

  test("should set consent property to false", () => {
    instance.handleRejectClickEvent(event);
    expect(instance.consent).toBe(false);
  });

  test("should load setBannerCookieConsent", () => {
    const spy = jest.spyOn(instance, "setBannerCookieConsent");
    instance.handleRejectClickEvent(event);
    expect(instance.setBannerCookieConsent).toHaveBeenCalled();
  });
});

describe("handleHideButtonClickEvent", () => {
  const event = new Event("click");
  const instance = new Cookie(cookieDomain);

  test("should load hideElement", () => {
    const spy = jest.spyOn(instance, "hideElement");
    instance.handleHideButtonClickEvent(event);
    expect(instance.hideElement).toHaveBeenCalled();
  });
});

describe("handleHideButtonClickEvent", () => {
  const event = new Event("click");
  const instance = new Cookie(cookieDomain);

  test("should load hideElement", () => {
    const spy = jest.spyOn(instance, "hideElement");
    instance.handleHideButtonClickEvent(event);
    expect(instance.hideElement).toHaveBeenCalled();
  });
});

describe("setBannerCookieConsent", () => {
  const instance = new Cookie(cookieDomain);

  test("should load setCookie", () => {
    const spy = jest.spyOn(instance, "setCookie");
    instance.setBannerCookieConsent(true, "localhost");
    expect(instance.setCookie).toHaveBeenCalled();
  });

  test("should load hideElement", () => {
    const spy = jest.spyOn(instance, "hideElement");
    instance.cookieBanner = document.createElement("div");
    instance.setBannerCookieConsent(true, "localhost");
    expect(instance.hideElement).toHaveBeenCalled();
  });

  test("should load showElement with cookieAccepted if consent is true", () => {
    const spy = jest.spyOn(instance, "showElement");
    instance.cookiesAccepted = document.createElement("div");
    instance.setBannerCookieConsent(true, "localhost");
    expect(instance.showElement).toHaveBeenCalled();
  });

  test("should load showElement with cookiesRejected if consent is false", () => {
    const spy = jest.spyOn(instance, "showElement");
    instance.cookiesRejected = document.createElement("div");
    instance.setBannerCookieConsent(false, "localhost");
    expect(instance.showElement).toHaveBeenCalled();
  });
});

describe("getCookie", () => {
  test("should return the value of the cookie if found", () => {
    document.cookie = "cookies_preferences_set=%7B%22analytics%22%3Afalse%7D";
    const instance = new Cookie(cookieDomain);
    expect(instance.getCookie("cookies_preferences_set")).toBe(
      "%7B%22analytics%22%3Afalse%7D",
    );
  });
});

describe("hasConsentForAnalytics", () => {
  test("should return true if consent is given", () => {
    document.cookie = "cookies_preferences_set=%7B%22analytics%22%3Atrue%7D";
    const instance = new Cookie(cookieDomain);
    expect(instance.hasConsentForAnalytics()).toBe(true);
  });

  test("should return false if consent is not given", () => {
    document.cookie = "cookies_preferences_set=%7B%22analytics%22%3Afalse%7D";
    const instance = new Cookie(cookieDomain);
    expect(instance.hasConsentForAnalytics()).toBe(false);
  });

  test("should return false if no cookie", () => {
    document.cookie = "";
    const instance = new Cookie(cookieDomain);
    expect(instance.hasConsentForAnalytics()).toBe(false);
  });

  test("should load getCookie", () => {
    const instance = new Cookie(cookieDomain);
    const spy = jest.spyOn(instance, "getCookie");
    instance.hasConsentForAnalytics();
    expect(instance.getCookie).toHaveBeenCalled();
  });
});

describe("hideElement", () => {
  test('should hide the element by setting its display property to "none"', () => {
    const instance = new Cookie(cookieDomain);
    const element = document.createElement("div");
    instance.hideElement(element);
    expect(element.classList).toContain(instance.HIDDEN_CLASS);
  });
});

describe("showElement", () => {
  test('should show the element by setting its display property to "block"', () => {
    const instance = new Cookie(cookieDomain);
    const element = document.createElement("div");
    instance.showElement(element);
    expect(element.classList).toContain(instance.SHOWN_CLASS);
  });
});

describe("setCookie", () => {
  test("should set the cookie", () => {
    const instance = new Cookie(cookieDomain);
    const cookie = "cookies_preferences_set=%7B%22analytics%22%3Atrue%7D";
    const options = { days: 365 };
    const domain = "localhost";
    instance.setCookie(
      "cookies_preferences_set",
      { analytics: true },
      options,
      domain,
    );
    expect(document.cookie).toBe(cookie);
  });
});
