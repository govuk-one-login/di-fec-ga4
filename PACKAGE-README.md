<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  
<h3 align="center">GOV UK One Login GA4 Implementation</h3>
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

The GDS One Login GA4 (Google Analytics 4) node package is a shared, reusable solution created to facilitate the upgrade from GAU to GA4 across the One Login programme as GAU is being retired mid 2024.

The purpose of this package is to make it as easy as possible for the various pods that make up the One Login journey to upgrade their analytics while having as minimal an impact as possible on the dev teams time and effort.

The package is owned by the DI Frontend Capability team, part of the development of this tool involves ongoing discovery with the pods responsible for maintaining the frontend repositories that make up the One Login journey. As more information is collated, the package and documentation will be updated. As such, it is considered a WIP and the pods will be notified when a stable release is ready.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

### Installation

1. Install NPM package
   ```sh
   npm install one-login-ga4
   ```
2. Configure your node application's startup file (example: app.js or index.js) and add a new virtual directory:

   ```js
   app.use(
     "/ga4-assets",
     express.static(path.join(__dirname, "../node_modules/one-login-ga4/lib")),
   );
   ```

   [!WARNING] Check if the path to your node module folder is the correct one. [!WARNING]

3. Set a variable “ga4ContainerId” with the value of your google tag manager id (format: GTM-XXXXXXX) and be sure it’s accessible to your base nunjucks template (example: src/views/common/layout/base.njk).

[!NOTE] Different methods exist if you want to set this variable. Some projects use a middleware, some will prefer to use another method. [!NOTE]

4. Add this block of code into your base nunjucks template:

   ```js
    <script src="/ga4-assets/analytics.js"></script>
    <script>
    window.DI.appInit({ga4ContainerId: "{{ga4ContainerId}}"})
    </script>
   ```

   window.DI.appInit can take another parameter: an object of settings. That can be used if you want to disable some options. This is the property of this settings object:

   - disableGa4Tracking (boolean): disable GA4 trackers
   - disableUaTracking (boolean): disable Universal Analytics tracker
   - disableAnalyticsCookie (boolean): disable analytics cookie logic within the analytics library
   - disableFormFreeTextTracking (boolean): disable free text field tracking within the form response tracker.

Example of call:

```js
window.DI.appInit(
  { ga4ContainerId: "{{ga4ContainerId}}" },
  {
    disabldisableGa4Tracking: true,
    disableUaTracking: true,
    disableAnalyticsCookie: false,
    disableFormFreeTextTracking: true,
  },
);
```

[!NOTE] window.DI.appInit is a function loaded from analytics.js. That will create a new instance of our analytics library and store into window.DI.analyticsGa4 [!NOTE]

### Page View Tracker

Page view tracking allows us to see which pages are most visited, where your visitors are coming from, etc.
It can be called by using the method trackOnPageLoad of the object pageViewTracker stored into the analytics library (analyticsGa4)

It takes as a unique parameter an object define by :

- statusCode: number
- englishPageTitle: string
- taxonomy_level1: string
- taxonomy_level2: string

Example:

```js
window.DI.analyticsGa4.pageViewTracker.trackOnPageLoad({
  statusCode: 200,
  englishPageTitle: "english version of the page title",
  taxonomy_level1: "test tax1",
  taxonomy_level2: "test tax2",
});
```

### Navigation Tracker

Navigation tracking allows us to see exactly how often each navigation link is used. It's triggered by a listener on the click event.

We are tracking different types of link:

- Generic Inbound Links: When a user clicks on a link and it is an inbound link which is defined as any links that point to a domain that does match the domain of the current page
- Generic Inbound Button: When a user clicks on a button and it is an inbound link which is defined as any links that point to a domain that does match the domain of the current page
- Generic Outbound Links: When a user clicks on a link and it is an outbound link, which is defined as any links that point to a domain that does not match the domain of the current page.
- Header Menu Bar: When a user clicks on a link in the header menu
- Footer links: When a user clicks on a link within the footer

<p align="right">(<a href="#readme-top">back to top</a>)</p>
