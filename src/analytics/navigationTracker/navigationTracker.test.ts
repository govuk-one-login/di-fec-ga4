import { describe, expect, jest, test } from "@jest/globals";
import { NavigationTracker } from "./navigationTracker";

window.DI = { analyticsGa4: { cookie: { consent: true } } };

describe("navigationTracker", () => {
  const newInstance = new NavigationTracker();
  const action = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  const spy = jest.spyOn(NavigationTracker.prototype, "pushToDataLayer");
  const spyTrackNavigation = jest.spyOn(
    NavigationTracker.prototype,
    "trackNavigation",
  );
  const constructorSpy = jest.spyOn(
    NavigationTracker.prototype,
    "initialiseEventListener",
  );

  test("new instance should call initialiseEventListener", () => {
    const instance = new NavigationTracker();
    expect(newInstance.initialiseEventListener).toBeCalled();
  });

  test("click should call trackNavigation", () => {
    const href = document.createElement("A");
    href.className = "govuk-footer__link";
    href.innerHTML = "Link to GOV.UK";
    href.addEventListener("click", (event) => {
      expect(newInstance.trackNavigation).toBeCalled();
    });
  });

  test("should push data into data layer if click on logo icon", () => {
    const element = document.createElement("span");
    element.className = "govuk-header__logotype";
    document.body.innerHTML = "<header></header>";
    const header = document.getElementsByTagName("header")[0];
    header.appendChild(element);
    element.dispatchEvent(action);
    element.addEventListener("click", (event) => {
      expect(newInstance.pushToDataLayer).toBeCalled();
    });
  });

  //test trackNavigation doesn't accept anything except button or link
  test("trackNavigation should return false if not a link or a button", () => {
    const href = document.createElement("div");
    href.className = "govuk-footer__link";
    href.addEventListener("click", (event) => {
      expect(newInstance.trackNavigation(event)).toBe(false);
    });
    href.dispatchEvent(action);
  });

  //test trackNavigation accept button
  test("trackNavigation should return true if a link", () => {
    document.body.innerHTML = "<header></header><footer></footer>";
    const href = document.createElement("A");
    href.className = "govuk-footer__link";
    href.innerHTML = "Link to GOV.UK";
    href.setAttribute("href", "http://localhost");
    href.addEventListener("click", (event) => {
      expect(newInstance.trackNavigation(event)).toBe(true);
    });
    href.dispatchEvent(action);
  });

  //test trackNavigation accept navigation button
  test("trackNavigation should return true if a navigation button", () => {
    document.body.innerHTML = "<header></header><footer></footer>";
    const href = document.createElement("BUTTON");
    href.setAttribute("data-nav", "true");
    href.setAttribute("data-link", "/next-url");
    href.innerHTML = "Continue";
    href.setAttribute("href", "http://localhost");
    href.addEventListener("click", (event) => {
      expect(newInstance.trackNavigation(event)).toBe(true);
    });
    href.dispatchEvent(action);
  });

  //test trackNavigation doesn't accept button
  test("trackNavigation should return false if not a navigation button", () => {
    document.body.innerHTML = "<header></header><footer></footer>";
    const href = document.createElement("BUTTON");
    href.innerHTML = "Continue";
    href.setAttribute("href", "http://localhost");
    href.addEventListener("click", (event) => {
      expect(newInstance.trackNavigation(event)).toBe(false);
    });
    href.dispatchEvent(action);
  });

  //test pushToDataLayer is called
  test("pushToDataLayer is called", () => {
    const href = document.createElement("A");
    href.className = "govuk-footer__link";
    href.addEventListener("click", (event) => {
      newInstance.trackNavigation(event);
    });
    href.dispatchEvent(action);
    expect(newInstance.pushToDataLayer).toBeCalled();
  });
});

describe("Cookie Management", () => {
  test("trackNavigation should return false if not cookie consent", () => {
    const spy = jest.spyOn(NavigationTracker.prototype, "trackNavigation");
    window.DI.analyticsGa4.cookie.consent = false;
    const instance = new NavigationTracker();
    const href = document.createElement("A");
    href.className = "govuk-footer__link";
    href.addEventListener("click", (event) => {
      expect(instance.trackNavigation).toReturnWith(false);
    });
  });
});

describe("getLinkType", () => {
  const newInstance = new NavigationTracker();
  const action = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });

  test('should return "footer" when the element is an <a> tag within the footer tag', () => {
    const href = document.createElement("A");
    href.className = "govuk-footer__link";
    href.dispatchEvent(action);
    document.body.innerHTML = "<header></header><footer></footer>";
    const footer = document.getElementsByTagName("footer")[0];
    footer.appendChild(href);
    const element = action.target as HTMLLinkElement;
    expect(newInstance.getLinkType(element)).toBe("footer");
  });

  test('should return "header menu bar" when the element is an <a> tag within the phase banner', () => {
    const href = document.createElement("A");
    href.className = "govuk-link";
    href.dispatchEvent(action);
    document.body.innerHTML = "<div class='govuk-phase-banner'></div>";
    const phaseBanner =
      document.getElementsByClassName("govuk-phase-banner")[0];
    phaseBanner.appendChild(href);
    const element = action.target as HTMLLinkElement;
    expect(newInstance.getLinkType(element)).toBe("header menu bar");
  });

  test('should return "header menu bar" when the element is an <a> tag within the header tag', () => {
    const href = document.createElement("A");
    href.className = "header__navigation";
    href.dispatchEvent(action);
    document.body.innerHTML = "<header></header><footer></footer>";
    const header = document.getElementsByTagName("header")[0];
    header.appendChild(href);
    const element = action.target as HTMLLinkElement;
    expect(newInstance.getLinkType(element)).toBe("header menu bar");
  });

  test('should return "generic link" when the element is an <a> tag which is not inside the footer or header tags', () => {
    const href = document.createElement("A");
    href.className = "other-link";
    href.dispatchEvent(action);
    const element = action.target as HTMLLinkElement;
    document.body.innerHTML = "<header></header><footer></footer>";
    expect(newInstance.getLinkType(element)).toBe("generic link");
  });

  test('should return "generic button" when the element is a has a tag and button classname', () => {
    const button = document.createElement("A");
    button.className = "govuk-button";
    button.dispatchEvent(action);
    const element = action.target as HTMLLinkElement;
    expect(newInstance.getLinkType(element)).toBe("generic button");
  });

  test('should return "generic button" when the element is a button', () => {
    const button = document.createElement("BUTTON");
    button.setAttribute("data-nav", "true");
    button.setAttribute("data-link", "/next-url");
    button.dispatchEvent(action);
    const element = action.target as HTMLLinkElement;
    expect(newInstance.getLinkType(element)).toBe("generic button");
  });
});

describe("isExternalLink", () => {
  const newInstance = new NavigationTracker();

  test("should return false for internal links", () => {
    const url = "http://localhost";
    expect(newInstance.isExternalLink(url)).toBe(false);
  });

  test("should return false for signin account links", () => {
    const url = "http://signin.account.gov.uk/cookies";
    expect(newInstance.isExternalLink(url)).toBe(false);
  });

  test("should return true for external links", () => {
    const url = "https://google.com";
    expect(newInstance.isExternalLink(url)).toBe(true);
  });
});

describe("isHeaderMenuBarLink", () => {
  const newInstance = new NavigationTracker();

  test("should return true if link is inside the header tag", () => {
    document.body.innerHTML = `<header><a id="testLink">Link to GOV.UK</a></header>`;
    const element = document.getElementById("testLink") as HTMLElement;
    expect(newInstance.isHeaderMenuBarLink(element)).toBe(true);
  });

  test("should return false if link is not inside the header tag", () => {
    document.body.innerHTML = `<header></header><a id="testLink">Link to GOV.UK</a>`;
    const element = document.getElementById("testLink") as HTMLElement;
    expect(newInstance.isHeaderMenuBarLink(element)).toBe(false);
  });
});

describe("isFooterLink", () => {
  const newInstance = new NavigationTracker();

  test("should return true if link is inside the footer tag", () => {
    document.body.innerHTML = `<footer><a id="testLink2">Link to GOV.UK</a></footer>`;
    const element = document.getElementById("testLink2") as HTMLElement;
    expect(newInstance.isFooterLink(element)).toBe(true);
  });

  test("should return true if link is not inside the footer tag", () => {
    document.body.innerHTML = `<footer></footer><a id="testLink2">Link to GOV.UK</a>`;
    const element = document.getElementById("testLink2") as HTMLElement;
    expect(newInstance.isFooterLink(element)).toBe(false);
  });
});

describe("isBackLink", () => {
  const newInstance = new NavigationTracker();

  test("should return true if link is a back button", () => {
    document.body.innerHTML = `<a id="testLink3" href="/welcome" class="govuk-back-link">Back</a>`;
    const element = document.getElementById("testLink3") as HTMLElement;
    expect(newInstance.isBackLink(element)).toBe(true);
  });

  test("should return false if link is not a back button", () => {
    document.body.innerHTML = `<a id="testLink3" href="/welcome" class="govuk-random-link">Back</a>`;
    const element = document.getElementById("testLink3") as HTMLElement;
    expect(newInstance.isBackLink(element)).toBe(false);
  });
});

describe("getSection", () => {
  const newInstance = new NavigationTracker();
  const action = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });

  test("it should return undefined if section is not defined", () => {
    document.body.innerHTML = `<body><a id="testLink1">Link to GOV.UK</a></body>`;
    const element = document.getElementById("testLink1") as HTMLElement;
    expect(newInstance.getSection(element)).toBe("undefined");
  });

  test("it should return logo when a link is clicked in the logo", () => {
    const element = document.createElement("span");
    element.className = "govuk-header__logotype";
    document.body.innerHTML = "<header></header>";
    const header = document.getElementsByTagName("header")[0];
    header.appendChild(element);
    element.dispatchEvent(action);
    element.addEventListener("click", (event) => {
      expect(newInstance.getSection(element)).toBe("logo");
    });
  });

  test("it should return phase banner when a link is clicked in the phase banner", () => {
    const href = document.createElement("A");
    href.className = "govuk-link";
    href.dispatchEvent(action);
    document.body.innerHTML = "<div class='govuk-phase-banner'></div>";
    const phaseBanner =
      document.getElementsByClassName("govuk-phase-banner")[0];
    phaseBanner.appendChild(href);
    const element = action.target as HTMLLinkElement;
    expect(newInstance.getSection(element)).toBe("phase banner");
  });

  test("it should return menu links when a link is clicked in the header", () => {
    const href = document.createElement("A");
    href.className = "govuk-link";
    href.dispatchEvent(action);
    document.body.innerHTML = "<header></header>";
    const header = document.getElementsByTagName("header")[0];
    header.appendChild(href);
    const element = action.target as HTMLLinkElement;
    expect(newInstance.getSection(element)).toBe("menu links");
  });

  test("it should return support links when a link is clicked in the support links", () => {
    const href = document.createElement("A");
    href.className = "govuk-link";
    href.dispatchEvent(action);
    document.body.innerHTML = "<div class='govuk-footer__inline-list'></div>";
    const footerInlineList = document.getElementsByClassName(
      "govuk-footer__inline-list",
    )[0];
    footerInlineList.appendChild(href);
    const element = action.target as HTMLLinkElement;
    expect(newInstance.getSection(element)).toBe("support links");
  });

  test("it should return licence links when a link is clicked in the licence link", () => {
    const href = document.createElement("A");
    href.className = "govuk-link";
    href.dispatchEvent(action);
    document.body.innerHTML =
      "<span class='govuk-footer__licence-description'></span>";
    const licence = document.getElementsByClassName(
      "govuk-footer__licence-description",
    )[0];
    licence.appendChild(href);
    const element = action.target as HTMLLinkElement;
    expect(newInstance.getSection(element)).toBe("licence");
  });

  test("it should return copyright when a link is clicked on copyright image", () => {
    const href = document.createElement("A");
    href.className = "govuk-link";
    href.dispatchEvent(action);
    document.body.innerHTML =
      "<span class='govuk-footer__copyright-logo'></span>";
    const copyright = document.getElementsByClassName(
      "govuk-footer__copyright-logo",
    )[0];
    copyright.appendChild(href);
    const element = action.target as HTMLLinkElement;
    expect(newInstance.getSection(element)).toBe("copyright");
  });
});
