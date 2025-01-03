
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
- Download the JSON file with the service account credentials to get the service account private key if using **JWT** authentication.
- For **OAuth 2.0** authentication, create OAuth 2.0 credentials and obtain the **Client ID** and **Client Secret**.

### Authentication Method
You can choose between two authentication methods for your application:
- **JWT** (JSON Web Token): This method uses a service account for authentication, you will need the Service Account Email, the Private Key and scope of access.
- **OAuth 2.0**: This method uses OAuth authentication, where you'll need the Client ID, Client Secret,

### Service account email

As explained above, this value comes from the credential file.

### Private Key

As explained above, this value also comes from the credentials file.

### Client ID

The Client ID for your OAuth 2.0 application.

### Client Secret
The Client Secret given by the API provider.

### OAuth Scopes

The scopes the service account have access to. 
Take into account 
if any scope is selected to which the service account does not have access, 
the package will fail to be authorized to make any requests.

### Configuration Parameters
Field names to use the parameters with configuration.

**Client Id (clientId)** - Text<br>
**Client Secret (clientSecret)** - Text<br>
**State (state)** - Text<br>
**Service Account Email (serviceAccountEmail)** - Text<br>
**Private Key (privateKey)** - Text<br>
**Scope (scope)** - Text

### Storage value and Offline mode
The Google Slides package allows the application runtime to request a refresh token. So when calling the UI service to be able to log in to the application

```javascript
pkg.googleslides.api.getAccessToken();
```

the Google service must return an object with the access token and the refresh token. For each of these tokens a record will be created in the app storage (accessible from the Monitor),
and you will be able to see them encrypted and associated to a user by id.

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

There are no events for this package.

## Dependencies
* HTTP Service (Latest Version)
* OAuth (Latest Version)

# About Slingr

Slingr is a low-code rapid application development platform that accelerates development, with robust architecture for integrations and executing custom workflows and automation.

[More info about Slingr](https://slingr.io)

# License

This package is licensed under the Apache License 2.0. See the `LICENSE` file for more details.
