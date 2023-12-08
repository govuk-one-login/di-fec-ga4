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

  //test trackNavigation accept link
  test("trackNavigation should return false if a link without href", () => {
    const href = document.createElement("A");
    href.className = "govuk-footer__link";
    href.innerHTML = "Link to GOV.UK";
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
  const spy = jest.spyOn(NavigationTracker.prototype, "trackNavigation");
  test("trackNavigation should return false if not cookie consent", () => {
    window.DI.analyticsGa4.cookie.consent = false;
    const instance = new NavigationTracker();
    expect(instance.trackNavigation).toReturnWith(false);
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
});

describe("isExternalLink", () => {
  const newInstance = new NavigationTracker();

  test("should return false for internal links", () => {
    const url = "http://localhost";
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
