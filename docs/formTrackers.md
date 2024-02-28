# Form Tracker

This document describes how a form tracker works. The form trackers pushes a `form_response` or `form_error` or `form_change`event to GA4.

## Form Response Tracker

If a user has consented to analytics cookies, then the
`form_response` event is pushed when the user submits this form.

### How it works

The form tracker works by adding an event listener to the form which listens for the `submit` event dispatched by the
form's continue (or submission) button. The event listener invokes the `trackFormResponse` function with the submit event.

### Currently supported input types

Inputs of the following type will be included in the `form_response` event pushed to GA4:

- Radio buttons
- Inputs type text
- Textareas
- Dropdown selects
- Checkboxes

### Example of event

{
'event_name': 'form_response',
'type': 'free text field',
'text': 'undefined',
'section': 'enter your email address',
'action': 'continue',
'url': `http://localhost:3000/validate-enter-email`,
'external': 'undefined',
'link_domain': `http://localhost:3000`,
'link_path_parts.1': '/validate-enter-email',
'link_path_parts.2': 'undefined',
'link_path_parts.3': 'undefined',
'link_path_parts.4': 'undefined',
'link_path_parts.5': 'undefined'
}

## Form Error Tracker

If a user has consented to analytics cookies, then the
`form_error` event is pushed when the user loads a form which contains a form error message(s).

### How it works

The form error tracker works by looking in the page if there is an element with the class `govuk-error-message`. This action is done when the page view tracker is called.

### Example of event

{
"event_name": "form_error",
"type": "radio buttons",
"url": "http://localhost:3000/validate-organisation-type",
"text": "error: select one option",
"section": "what is your organisation type?",
"action": "error",
"external": "undefined",
"link_domain": "http://localhost:3000",
"link_path_parts.1": "/validate-organisation-type",
"link_path_parts.2": "undefined",
"link_path_parts.3": "undefined",
"link_path_parts.4": "undefined",
"link_path_parts.5": "undefined"
}

## Form Change Tracker

If a user has consented to analytics cookies, then the
`form_change` event is pushed when the user loads a form because they want to change the answer.

### How it works

The form change tracker works by looking in the url of the page if there is a query paremeter called "edit". This action is done when the page view tracker is called.

### Example of event

{
event_name: "form_change_response",
type: "undefined",
url: "http://localhost:3001/organisation-type?edit=true",
text: "change",
section: "what is your organisation type?",
action: "change response",
external: "undefined",
link_domain: "http://localhost:3001",
link_path_parts.1: "/organisation-type",
link_path_parts.2: "undefined",
link_path_parts.3: "undefined",
link_path_parts.4: "undefined",
link_path_parts.5: "undefined"
}
