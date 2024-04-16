<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  
<h3 align="center">GOV.UK One Login GA4 Implementation</h3>
  <p align="center">
    This package enables GOV UK LOGIN frontend Node.js applications to use Google Tag Manager and Google Analytics 4.
    <br />
    <a href="https://govukverify.atlassian.net/wiki/spaces/DIFC/pages/3801317710/Analytics+package+One-login-ga4"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/govuk-one-login/di-fec-ga4-demo">View Demo</a>
    ·
    <a href="https://github.com/govuk-one-login/di-fec-ga4/issues">Report Bug</a>
    ·
    <a href="https://github.com/govuk-one-login/di-fec-ga4/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

The GDS Frontend Analytics (Google Analytics 4) node package is a shared, reusable solution created to facilitate the upgrade from GAU to GA4 across the GOV.UK One Login programme as GAU is being retired mid 2024.

The purpose of this package is to make it as easy as possible for the various pods that make up the GOV.UK One Login journey to upgrade their analytics while having as minimal an impact as possible on the dev teams time and effort.

The package is owned by the DI Frontend Capability team, part of the development of this tool involves ongoing discovery with the pods responsible for maintaining the frontend repositories that make up the GOV.UK One Login journey. As more information is collated, the package and documentation will be updated. As such, it is considered a WIP and the pods will be notified when a stable release is ready.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

### Installation

1. Install NPM package
   ```sh
   npm install @govuk-one-login/frontend-analytics
   ```
2. Configure your node application's startup file (example: app.js or index.js) and add a new virtual directory:

   ```js
   app.use(
     "/ga4-assets",
     express.static(
       path.join(
         __dirname,
         "../node_modules/@govuk-one-login/frontend-analytics/lib",
       ),
     ),
   );
   ```

   [!WARNING] Check if the path to your node module folder is the correct one. [!WARNING]

3. Set a variable “ga4ContainerId” with the value of your google tag manager id (format: GTM-XXXXXXX) and be sure it’s accessible to your base nunjucks template (example: src/views/common/layout/base.njk).
   You can also set the variable uaContainerId with the value of your google tag container id (format: GTM-XXXXXXX).

[!NOTE] Different methods exist if you want to set this variable. Some projects use a middleware, some will prefer to use another method. [!NOTE]

4. Add this block of code into your base nunjucks template:

   ```js
    <script src="/ga4-assets/analytics.js"></script>
    <script>
    window.DI.appInit({ga4ContainerId: "{{ga4ContainerId}}", uaContainerId: '{{ uaContainerId }}'})
    </script>
   ```

   window.DI.appInit can take another parameter: an object of settings. That can be used if you want to disable some options. This is the property of this settings object:

   - disableGa4Tracking (boolean): disable GA4 trackers
   - disableUaTracking (boolean): disable Universal Analytics tracker
   - cookieDomain (string): specify the domain the analytics consent cookie should be raised against (default is "account.gov.uk")

Example of call:

```js
window.DI.appInit(
  {
    ga4ContainerId: "{{ga4ContainerId}}",
    uaContainerId: "{{ uaContainerId }}",
  },
  {
    disableGa4Tracking: true,
    disableUaTracking: true,
    cookieDomain: "{{ cookieDomain }}",
  },
);
```

[!NOTE] window.DI.appInit is a function loaded from analytics.js. That will create a new instance of our analytics library and store into window.DI.analyticsGa4 [!NOTE]

### Analytics Cookie Consent

The Cookie class is responsible for managing cookies consent about analytics. It provides methods and fields to handle cookie-related operations:

- Set the cookie when the visitor decides to accept or reject any analytics tracking
- Hide the cookie banner that displays a message when the visitor has decided if he rejects or accepts the analytics tracking
- Show the element that displays a message when consent is not given
- Show the element that displays a message when consent is given
- Hide the cookie banner when the visitor wants to hide the accepted or rejected message

[!NOTE]
Tips:
1/ You can get analytics cookie consent status (true or false) by calling the function hasConsentForAnalytics:

```js
window.DI.analyticsGa4.cookie.hasConsentForAnalytics();
```

2/ You can revoke analytics cookie consent by calling the function setBannerCookieConsent:

```js
window.DI.analyticsGa4.cookie.setBannerCookieConsent(
  false,
  youranalyticsdomain,
);
```

[!NOTE]

### Page View Tracker

Page view tracking allows us to see which pages are most visited, where your visitors are coming from, etc.
It can be called by using the method trackOnPageLoad of the object pageViewTracker stored into the analytics library (analyticsGa4)

It takes as a unique parameter an object define by :

- statusCode (number): Status code of the page.
- englishPageTitle (string): English version of the page title.
- taxonomy_level1 (string): Taxonomies are hierarchical tool that allows us to filter data for reporting and insights purposes.
- taxonomy_level2 (string): Taxonomies are hierarchical tool that allows us to filter data for reporting and insights purposes.
- content_id (string): Content ID is a unique ID for each front end display on a given page.
- logged_in_status (boolean): Whether a user is logged in or logged out.
- dynamic (boolean): This parameter indicates whether the page has multiple versions and uses the same URL.

Example:

```js
window.DI.analyticsGa4.pageViewTracker.trackOnPageLoad({
  statusCode: 200,
  englishPageTitle: "english version of the page title",
  taxonomy_level1: "test tax1",
  taxonomy_level2: "test tax2",
  content_id: "<e4a3603d-2d3c-4ff1-9b80-d72c1e6b7a58>",
  logged_in_status: true,
  dynamic: true,
});
```

A Nunjuck component can be used for a reusable solution. The ga4-opl component, available in the "components" folder, lets you add Page view tracking code with just one line of code.
Steps:

1. Add the components folder of this package into your path views array.
2. Import the component into your base files.
3. Add ga4OnPageLoad function at the end of your views.

Example:

```js
{
  {
    ga4OnPageLoad({
      nonce: scriptNonce,
      statusCode: "200",
      englishPageTitle: pageTitleName,
      taxonomyLevel1: "authentication",
      taxonomyLevel2: "feedback",
      contentId: "e08d04e6-b24f-4bad-9955-1eb860771747",
      loggedInStatus: false,
      dynamic: false,
    });
  }
}
```

### Navigation Tracker

Navigation tracking allows us to see exactly how often each navigation link is used. It's triggered by a listener on the click event.

We are tracking different types of link:

- Generic Inbound Links: When a user clicks on a link and it is an inbound link which is defined as any links that point to a domain that does match the domain of the current page
- Generic Inbound Button: When a user clicks on a button and it is an inbound link which is defined as any links that point to a domain that does match the domain of the current page
- Generic Outbound Links: When a user clicks on a link and it is an outbound link, which is defined as any links that point to a domain that does not match the domain of the current page.
- Header Menu Bar: When a user clicks on a link in the header menu
- Footer links: When a user clicks on a link within the footer

[!NOTE] All links are automatically tracked. But if you need to track a button, your element needs to have a specific attributes "data-nav" and "data-link"(e.g: <button data-nav=true data-link="/next-page-url">Next</button>) [!NOTE]

### Form Response Tracker

Trigger by the submission of any form, this tracker will send to GA4 some data about the form details:

- Type of field
- Label of the field
- Submit Button text
- Value of the field

### Checkbox or Radio Fields Without a Legend

If a checkbox or radio field has been implemented without a legend, please follow these steps to ensure the tracker can retrieve the correct section value:

1. Add a `rel` attribute to the tag used to hold the section title.
2. Set the `rel` attribute value to match the `id` of the field.

**Example:**

```js
<h2 rel="consentCheckbox">Section Title</h2>
<div class="govuk-form-group">
  <div class="govuk-checkboxes" data-module="govuk-checkboxes">
    <div class="govuk-checkboxes__item">
      <input id="consentCheckbox" name="consentCheckbox" type="checkbox" />
      <label id="consentCheckbox-label" for="consentCheckbox">
        Checkbox Label
      </label>
    </div>
  </div>
</div>
```

### Form Change Tracker

Form Change Tracker is triggered when a user clicks on a link that allows them to change a previous form they had completed and loads the form page correctly. The URL needs to contain an edit parameter equal to true (example: /my-form-page?edit=true).
We are tracking the label of the field and the submit button text.

### Form Error Tracker

Form Error Tracker is triggered when a page loads and when the page displays any form errors.
We are tracking the label of the field and the error message.

### Checkbox or Radio Fields Without a Legend

If a checkbox or radio field has been implemented without a legend, please follow these steps to ensure the tracker can retrieve the correct section value:

1. Add a `rel` attribute to the tag used to hold the section title.
2. Set the `rel` attribute value to match the `id` of the field.

**Example:**

```js
<h2 rel="consentCheckbox">Section Title</h2>
<div class="govuk-form-group">
  <div class="govuk-checkboxes" data-module="govuk-checkboxes">
    <div class="govuk-checkboxes__item">
      <input id="consentCheckbox" name="consentCheckbox" type="checkbox" />
      <label id="consentCheckbox-label" for="consentCheckbox">
        Checkbox Label
      </label>
    </div>
  </div>
</div>
```

### Universal Analytics compability

More information:
https://govukverify.atlassian.net/wiki/spaces/DIFC/pages/3843227661/Universal+Analytics+compatibility

<p align="right">(<a href="#readme-top">back to top</a>)</p>
