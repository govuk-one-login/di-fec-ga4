# Page View Tracker

This document describes how a page view tracker works. The page view tracker pushes a `page_view_ga4` event to GA4. All
pages extending the base nunjucks template (`base.njk`) will have a specific script code if we want to trigger the page view tracker function.

The page_view event tracks each page a user views on their journey through digital identity with enriching data collected by associated parameters.

## How it works

If a user has already consented to analytics when they visit a page, the page view event will be pushed to the dataLayer.

Note that if a user consents to analytics while already on a page (ie. the page has already loaded), the page view will
still be pushed to the dataLayer when the user clicks "Accept" on the cookie banner, even though the page has not
reloaded.

#### We want to know…

How many times users view web pages in their journey through the Digital Identity programme with accompanying enriching data associated to the page as detailed in the scope below.

#### So that I can…

Analyse the performance of each section of the user journey to identify technical issues and make data driven recommendations on improvements to the user journey.

## Configuration

On page load function needs to be called:
`window.DI.analyticsGa4.pageViewTracker.trackOnPageLoad(<properties>)`

#### Example

`window.DI.analyticsGa4.pageViewTracker.trackOnPageLoad({
  statusCode: '200',
  englishPageTitle: '{{translate("error.unrecoverable.title")}}',
  taxonomy_level1: 'web cri',
  taxonomy_level2: 'f2f',
  content_id: '001',
  logged_in_status: true,
  dynamic: false
});`

## Properties

#### content_id

Content ID is a unique ID for each front end display on a given page. It is detached from the page url and title and can be used to identify a page interacting irrespective of copy updates or multiple front end displays i.e. a page url that has 2 front end displays based on device sniffing. E.g. the download app page in the DCMAW journey.
100 characters or fewer, lowercase, Guid with hyphens

#### first_published_at

The original publish date of the page.
100 characters or fewer, YYYY-MM-DD for example: 2023-03-16

#### updated_at

Date of last internal update.
100 characters or fewer, YYYY-MM-DD for example: 2023-03-16

#### dynamic <“true” | “false”>

This parameter indicates whether the page has multiple versions and uses the same URL.
This is used to trigger a page view event in GTM so that we can track dynamic page views.
100 characters or fewer, lowercase, Alphabets only

#### relying_party

The name of the relying party a user is using One Login for, this will be based on a user scope by the Data & Analytics team.
100 characters or fewer, lowercase, Alphabets only

#### logged_in_status <“logged in” | “logged out”>

Whether a user is logged in or logged out, this will be based on a user scope by the Data & Analytics team.
100 characters or fewer, lowercase, Alphabets only

#### language e.g. ‘en’

The language the content is authored in
100 characters or fewer, lowercase, Alphanumeric

#### location

This is the page URL obtained through the document.location JavaScript property
420 characters or fewer, lowercase, Govuk standard PII redaction must be applied i.e. stripping of names form urls

#### organisations <OT1056>

Publishing organisations IDs

#### primary_publishing_organisation 'Government Digital Service - Digital Identity’

Primary publishing organisation. Identifies which organisation published the content in clear text
100 characters or fewer, Alphabets only

#### referrer

This is the referring URL obtained through the document.referrer JavaScript property
420 characters or fewer, lowercase, Govuk standard PII redaction must be applied i.e. stripping of names form urls

#### status_code

HTTP response status codes indicate whether a specific HTTP request has been successfully completed. Default will be 200 but interest here is on errors e.g. 404, 500 etc.
100 characters or fewer, Numeric

#### taxonomy_level1

Taxonomies are hierarchical tool that allows us to filter data for reporting and insights purposes
Taxonomy level 1 breaks the digital identity journey down into 4 key areas:
100 characters or fewer, lowercase, Alphanumeric

#### taxonomy_level2

Taxonomies are hierarchical tool that allows us to filter data for reporting and insights purposes.

Taxonomy level 2 is used to identify subsections of the user journey within the identified taxonomy level one. It is a dynamic field based on what a user is doing and allows analysts to create high level sections within a particular user journey or section for analysis, such as conversion modelling.
100 characters or fewer, lowercase, Alphanumeric

#### title

This is the value of the document.title property. (Note that this value should be in english, even if the user has changed their preferred language to Welsh and the value of document.title has been translated into Welsh as a result)
300 characters or fewer, lowercase, Alphanumeric, English

## Example of event

{
'event':'page_view_ga4',
'page_view':{
'language':'en'|'cy',
'location': 'http://localhost/test',
'logged_in_status': 'logged in'|'logged out',
'organisations':'<OT1056>',
'primary_publishing_organisation':'government digital service - digital identity',
'relying_party': 'hmrc',
'status_code': '200',  
 'title': <enter your passport details>,
'taxonomy_level1': 'web cris',
'taxonomy_level2': 'passport',
'content_id': 'e4a3603d-2d3c-4ff1-9b80-d72c1e6b7a58',
'first_published_at': '2022-06-23',
'updated_at': '2023-10-02',
'dynamic': "true"
}
}
