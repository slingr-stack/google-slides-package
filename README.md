
# Overview

This package allows direct access to the Google Slides API through a service account.
It also provides shortcuts and helpers for the most common use cases.


Some features available in this package are:

- Authentication and authorization
- Direct access to the Google Slides API

## Configuration

To use the Google Slides package, you must create an app in the [Google Developer Console](https://console.developers.google.com)
by following these instructions:

- Create a Google Cloud project for your Google Slides app.
- Enable the Slides API in your Google Cloud project. 
- Download the JSON file with the service account credentials to get the service account private key if using **Service Account** authentication.
- For **OAuth 2.0** authentication, create OAuth 2.0 credentials and obtain the **Client ID** and **Client Secret**.

### Authentication Method
You can choose between two authentication methods for your application.

**Name**: `authenticationMethod`
**Type**: buttonsGroup
**Mandatory**: true

### Service account email

As explained above, this value comes from the credential file.

**Name**: `serviceAccountEmail`
**Type**: text
**Mandatory**: true

### Private Key

As explained above, this value also comes from the credentials file.

**Name**: `privateKey`
**Type**: password
**Mandatory**: true

### Client ID

The Client ID for your OAuth 2.0 application.

**Name**: `clientId`
**Type**: text
**Mandatory**: true

### Client Secret
The Client Secret given by the API provider.

**Name**: `clientSecret`
**Type**: password
**Mandatory**: true

###  Scopes

Note that the client must have access to the slides resources. If you try to access to a resource that the user does not own
the request will result in a 404 or 403 unauthorized error.

### Configuration Parameters
Field names to use the parameters with configuration.

**Client Id (clientId)** - Text<br>
**Client Secret (clientSecret)** - Text<br>
**Service Account Email (serviceAccountEmail)** - Text<br>
**Private Key (privateKey)** - Text<br>
**Scope (scope)** - Text

### Storage value and Offline mode
The Google Slides package allows the application runtime to request a refresh token. So when calling the UI service to be able to log in to the application

```javascript
pkg.googleslides.api.getAccessToken();
```

This will return the access token, which will be securely stored in the application's storage and associated with a user by their ID.

If you have enabled the `OAuth 2.0` authentication method, the same method is used. The difference is that the Google Slides package includes the `&access_type=offline` parameter, which allows the application to request a refresh token. This happens when calling the UI service (which should run during runtime, for example, by invoking the method within an action) to log in to the application.

The Google service will return an object containing both the access token and the refresh token. Each token will be stored in the app's storage (accessible via the Monitor), where you can view them encrypted and associated with the user by ID.

# Javascript API

You can make `GET`,`POST`, requests to the [Google Slides API](https://developers.google.com/slides/api/reference/rest) like this:

## HTTP requests
You can make `GET`,`POST` requests to the [Google Slides API](https://developers.google.com/slides/api/reference/rest) like this:
```javascript
var response = pkg.googleslides.api.get('/presentations/:presentationId')
var response = pkg.googleslides.api.post('/presentations', body)
var response = pkg.googleslides.api.get('/presentations/:presentationId/pages/:pageObjectId')
```

Please take a look at the documentation of the [HTTP service](https://github.com/slingr-stack/http-service)
for more information about generic requests.

## Events

There are no events for this package.

## Dependencies
* HTTP Service
* OAuth Package

# About Slingr

Slingr is a low-code rapid application development platform that accelerates development, with robust architecture for integrations and executing custom workflows and automation.

[More info about Slingr](https://slingr.io)

# License

This package is licensed under the Apache License 2.0. See the `LICENSE` file for more details.
