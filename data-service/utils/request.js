"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("../config");
var utils_1 = require("./utils");
var ts_utils_1 = require("ts-utils");
function request(params) {
    var promise;
    if (params.url) {
        params.fetchOptions = addDefaultRequestParams(params.url, params.fetchOptions);
        promise = fetch(utils_1.normalizeUrl(params.url), params.fetchOptions || Object.create(null))
            .then(function (response) {
            var isJSON = response.headers.get('Content-Type').toLowerCase().includes('application/json');
            if (response.ok) {
                return response.text().then(function (data) { return isJSON ? config_1.parse(data) : data; });
            }
            else {
                if (response.status >= 500 && response.status <= 599) {
                    return response.text()
                        .then(tryParseError)
                        .then(function (error) {
                        if (typeof error === 'object' && error.message) {
                            return Promise.reject(error);
                        }
                        else {
                            return Promise.reject(new Error("An unexpected error has occurred: #" + response.status));
                        }
                    });
                }
                else {
                    return response.text()
                        .then(tryParseError)
                        .then(function (error) { return Promise.reject(error); });
                }
            }
        });
    }
    else if (params.method) {
        promise = params.method();
    }
    else {
        throw new Error('Wrong request params!');
    }
    // TODO catch errors
    return promise;
}
exports.request = request;
function tryParseError(error) {
    try {
        return JSON.parse(error);
    }
    catch (e) {
        return error;
    }
}
function addDefaultRequestParams(url, options) {
    if (options === void 0) { options = Object.create(null); }
    if (url.indexOf(config_1.get('node')) === 0 && ts_utils_1.isEmpty(options.credentials) && options.method !== 'POST') {
        options.credentials = 'include';
    }
    return options;
}
//# sourceMappingURL=request.js.map