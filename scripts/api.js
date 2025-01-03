/****************************************************
 Dependencies
 ****************************************************/

let httpReference = dependencies.http;

let httpDependency = {
    get: httpReference.get,
    post: httpReference.post,
};

let httpService = {};

/**
 *
 * Handles a request with retry from the platform side.
 */
function handleRequestWithRetry(requestFn, options, callbackData, callbacks) {
    try {
        return requestFn(options, callbackData, callbacks);
    } catch (error) {
        sys.logs.info("[googleslides] Handling request..."+ JSON.stringify(error));
        if (config.get("authenticationMethod") == "oAuth2") {
            dependencies.oauth.functions.refreshToken('googleslides:refreshToken');
            return requestFn(setAuthorization(options), callbackData, callbacks);
        }
    }
}

function createWrapperFunction(requestFn) {
    return function(options, callbackData, callbacks) {
        return handleRequestWithRetry(requestFn, options, callbackData, callbacks);
    };
}

for (let key in httpDependency) {
    if (typeof httpDependency[key] === 'function') httpService[key] = createWrapperFunction(httpDependency[key]);
}

/**
 * Retrieves the access token.
 *
 * @return {void} The access token refreshed on the storage.
 */
exports.getAccessToken = function () {
    sys.logs.info("[googleslides] Getting access token from oauth");
    if (config.get("authenticationMethod") === "oAuth2") {
        return dependencies.oauth.functions.connectUser("googleslides:userConnected");
    } else if (config.get("authenticationMethod") === "jwt") {
        return getAccessTokenForAccount();
    }
}

/**
 * Removes the access token from the oauth.
 *
 * @return {void} The access token removed on the storage.
 */
exports.removeAccessToken = function () {
    if (config.get("authenticationMethod") === "oAuth2") {
        sys.logs.info("[googleslides] Removing access token from oauth");
        return dependencies.oauth.functions.disconnectUser("googleslides:disconnectUser");
    } else {
        sys.logs.warn("[googleslides] JWT does not support token removal.");
    }
}

/****************************************************
 Public API - Generic Functions
 ****************************************************/

/**
 * Sends an HTTP GET request to the specified URL with the provided HTTP options.
 *
 * @param {string} path         - The path to send the GET request to.
 * @param {object} httpOptions  - The options to be included in the GET request check http-service documentation.
 * @param {object} callbackData - Additional data to be passed to the callback functions. [optional]
 * @param {object} callbacks    - The callback functions to be called upon completion of the GET request. [optional]
 * @return {object}             - The response of the GET request.
 */
exports.get = function(path, httpOptions, callbackData, callbacks) {
    let options = checkHttpOptions(path, httpOptions);
    return httpService.get(GoogleSlides(options), callbackData, callbacks);
};

/**
 * Sends an HTTP POST request to the specified URL with the provided HTTP options.
 *
 * @param {string} path         - The path to send the POST request to.
 * @param {object} httpOptions  - The options to be included in the POST request check http-service documentation.
 * @param {object} callbackData - Additional data to be passed to the callback functions. [optional]
 * @param {object} callbacks    - The callback functions to be called upon completion of the POST request. [optional]
 * @return {object}             - The response of the POST request.
 */
exports.post = function(path, httpOptions, callbackData, callbacks) {
    let options = checkHttpOptions(path, httpOptions);
    return httpService.post(GoogleSlides(options), callbackData, callbacks);
};

/****************************************************
 Private helpers
 ****************************************************/

function checkHttpOptions (path, options) {
    options = options || {};
    if (!!path) {
        if (isObject(path)) {
            // take the 'path' parameter as the options
            options = path || {};
        } else {
            if (!!options.path || !!options.params || !!options.body) {
                // options contain the http package format
                options.path = path;
            } else {
                // create html package
                options = {
                    path: path,
                    body: options
                }
            }
        }
    }
    return options;
}

function isObject (obj) {
    return !!obj && stringType(obj) === '[object Object]'
}

let stringType = Function.prototype.call.bind(Object.prototype.toString)

/****************************************************
 Configurator
 ****************************************************/

let GoogleSlides = function (options) {
    options = options || {};
    options= setApiUri(options);
    options= setRequestHeaders(options);
    options = setAuthorization(options);
    return options;
}

/****************************************************
 Private API
 ****************************************************/

function setApiUri(options) {
    let API_URL = config.get("GOOGLESLIDES_API_BASE_URL");
    let url = options.path || "";
    options.url = API_URL + url;
    sys.logs.debug('[googleslides] Set url: ' + options.path + "->" + options.url);
    return options;
}

function setRequestHeaders(options) {
    let headers = options.headers || {};
    headers = mergeJSON(headers, {"Content-Type": "application/json"});
    options.headers = headers;
    return options;
}

function setAuthorization(options) {
    sys.logs.debug('[googleslides] setting authorization');
    if (config.get("authenticationMethod") == "oAuth2") {
        let authorization = options.authorization || {};
        authorization = mergeJSON(authorization, {
            type: "oauth2",
            accessToken: sys.storage.get(
                'installationInfo-googleslides-User-'+sys.context.getCurrentUserRecord().id() + ' - access_token',{decrypt:true}),
            headerPrefix: "Bearer"
        });
        options.authorization = authorization;
        return options;
    } else {
        options.headers = mergeJSON(options.headers, {"Authorization": "Bearer "+getAccessTokenForAccount()});

    }
}

function getAccessTokenForAccount(account) {
    account = account || "account";
    sys.logs.info('[googleslides] Getting access token for account: '+account);
    let installationJson = sys.storage.get('installationInfo-googleslides---'+account) || {id: null};
    let token = installationJson.token || null;
    let expiration = installationJson.expiration || 0;
    if (!!token || expiration < new Date()) {
        sys.logs.info('[googleslides] Access token is expired or not found. Getting new token');
        let res = httpService.post(
            {
                url: "https://oauth2.googleapis.com/token",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: {
                    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                    assertion: getJsonWebToken()
                }
            });
        token = res.access_token;
        let expires_at = res.expires_in;
        expiration = new Date(new Date(expires_at) - 1 * 60 * 1000).getTime();
        installationJson = mergeJSON(installationJson, {"token": token, "expiration": expiration});
        sys.logs.info('[googleslides] Saving new token for account: ' + account);
        sys.storage.replace('installationInfo-googleslides---'+account, installationJson);
    }
    return token;
}

function getJsonWebToken() {
    try{
        let currentTime = new Date().getTime();
        let futureTime = new Date(currentTime + ( 10 * 60 * 1000)).getTime();
        let scopes = config.get("scope");
        sys.logs.error("debugging options to generate JWT" + JSON.stringify(  {
            iss: config.get("serviceAccountEmail"),
            aud: config.get("GOOGLESLIDES_API_BASE_URL"),
            scope: scopes,
            iat: currentTime,
            exp: futureTime,
            privateKey: config.get("privateKey")
        }));
        return sys.utils.crypto.jwt.generate(
            {
                iss: config.get("serviceAccountEmail"),
                aud: config.get("GOOGLESLIDES_API_BASE_URL"),
                scope: scopes,
                iat: currentTime,
                exp: futureTime
            },
            config.get("privateKey"),
            "RS256"
        );
    } catch (error) {
        sys.logs.error("[googleslides] Error generating JWT: ", error);
    }
}

function mergeJSON (json1, json2) {
    const result = {};
    let key;
    for (key in json1) {
        if(json1.hasOwnProperty(key)) result[key] = json1[key];
    }
    for (key in json2) {
        if(json2.hasOwnProperty(key)) result[key] = json2[key];
    }
    return result;
}
