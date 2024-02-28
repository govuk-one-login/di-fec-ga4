# Analytics

This document describes the Google Analytics implementation shared across some front end codebases within Digital
Identity.

No data is gathered without user consent.

## Overview

We currently push analytics data to Universal Analytics (UA) via a Google Tag Manager (GTM) container.

As of July 2023, we are in the process of migrating to Google Analytics 4 (GA4). We will push analytics data to
GA4 via a second GTM container - running both containers in parallel until we are confident to move to the GA4
implementation only.

## Implementation

Two important functions are provided from the `src/analytics/index.ts` file. They are both set on global objects `window.DI.analyticsGa4`
and `window.DI.analyticsUa` when the scripts are loaded in the browser:

### `appInit` function

This function sets up the `window.DI.analyticsGa4` object and `window.DI.analyticsUa`
It starts the initialisation of the analytics script.

### `Analytics` object

This object contains all the methods and logic for running analytics into DI frontend app.
It creates all the different trackers and starts the cookie management script.

The constructor first creates a new Cookie manager and Page View tracker instances (`dist/docs/pageViewTracker.md`).

If GA4 is not disabled, it will:

- If the user has consented, load the GTM script (using the containerId's passed as parameters)
- activates the Form Response Tracker
  > `dist/docs/formTracker.md`
- activates the Navigation Tracker
  > `dist/docs/navigationTracker.md`

## How DCMAW wires analytics functionality into its front end

All the javascript files within `src/` are "uglified" into a single, minified `analytics.js` file.

The `analytics.js` file has to be included in the base nunjucks template (e.g: `src/views/common/layout/base.njk`) as a script,
which makes available all the javascript functions described above on the global window object in the browser.

We then call our `appInit` (`src/index.ts`) function (which is now accessible on the global window
object) in the same base nunjucks template which initialises analytics and the cookie banner. We pass the `containerId`s and `disableGa4Tracking` as parameters, `disableGa4Tracking`, `disableUaTracking` and `domain` as options;
these values can be injected by your `setLocal` middleware functions which grabs these values from the current environment.
