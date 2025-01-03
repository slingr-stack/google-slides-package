
# Overview

This endpoint allows direct access to the [Google Slides API](https://developers.google.com/slides/api/reference/rest?hl=es-419) through a service account. 
However, it provides shortcuts and helpers for most common use cases.

Some features available in this package are:

- Authentication and authorization
- Direct access to the Google Slides API

## Configuration

To use the Google Slides package, you must create an app in the [Google Developer Console](https://console.developers.google.com)
by following these instructions:

- Create a Google Cloud project for your Google Slides app.
- Enable the Slides API in your Google Cloud project.
- Download the JSON file with the service account credentials to get the service account private key.

### Service account email

As explained above, this value comes from the credential file.

### OAuth Scopes

The scopes the service account have access to. 
Take into account 
if any scope is selected to which the service account does not have access, 
the endpoint will fail to be authorized to make any requests.

### Private Key

As explained above, this value also comes from the credentials file.

# Javascript API

The Javascript API of the googleslides package has two pieces:

- **HTTP requests**

## HTTP requests
You can make `GET`,`POST` requests to the [googleslides API](https://developers.google.com/slides/api/reference/rest) like this:
```javascript
var response = pkg.googleslides.api.get('/presentations/:presentationId')
var response = pkg.googleslides.api.post('/presentations', body)
var response = pkg.googleslides.api.get('/presentations/:presentationId/pages/:pageObjectId')
```

Please take a look at the documentation of the [HTTP service](https://github.com/slingr-stack/http-service)
for more information about generic requests.

## Events

There are no events for this endpoint.

## Dependencies
* HTTP Service (Latest Version)

# About SLINGR

Slingr is a low-code rapid application development platform that accelerates development, with robust architecture for integrations and executing custom workflows and automation.

[More info about Slingr](https://slingr.io)

# License

This package is licensed under the Apache License 2.0. See the `LICENSE` file for more details.
