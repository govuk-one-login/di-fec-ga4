# Navigation Tracker

This document describes how a navigation tracker works. The navigation tracker pushes a `navigation` event to GA4.

If a user has consented to analytics cookies and the navigation tracker has been configured on an element, then the
`navigation` event is pushed to the dataLayer when the user clicks on the element. The event is only pushed if the event data is configured correctly.

## How it works

The navigation tracker works by adding an event listener to the element which listens for the `click` event dispatched by the
element (button/link). The event listener invokes the `trackNavigation` function with the `click` event.

The data required for the `navigation` event is parsed from the element's attributes.

## We want to know…

When users interact with features that navigate them from one section of the user journey to aother

## So that we can…

Understand how our users navigate through our user journey, monitor issues and make recommendations on how to improve our users experiences

## Tracking different navigation types

The type of the `navigation` event is determined by the properties parsed in the `ga4-data-navigation` attribute, and so only the configuration needs
to be modified per navigation type.

Types of `navigation` events can be found at: https://govukverify.atlassian.net/jira/software/c/projects/DFC/boards/436?selectedIssue=DFC-149

## Example of event

{
'event':'event_data',
'event_data':{
'event_name':'navigation',
'type':'generic button',
'url':'https://signin.account.gov.uk/enter-email-create',
'text':'create a gov.uk one login',  
 'section':undefined,  
 'action':undefined,  
 'external':'false',
'link_domain':'https://signin.account.gov.uk',
'link_path_parts.1':'/enter-email-create',
'link_path_parts.2':undefined,
'link_path_parts.3':undefined,
'link_path_parts.4':undefined,
'link_path_parts.5':undefined,
}
}
