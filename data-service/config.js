"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_service_client_js_1 = require("@waves/data-service-client-js");
var node_1 = require("./api/node/node");
var request_1 = require("./utils/request");
var assets_pairs_order_1 = require("@waves/assets-pairs-order");
var ts_utils_1 = require("ts-utils");
var config = Object.create(null);
var dataService = null;
exports.timeDiff = 0;
exports.matcherSettingsPromise = Promise.resolve(assets_pairs_order_1.MAINNET_DATA);
exports.parse = function (str) { return window.WavesApp.parseJSON(str); };
function get(key) {
    return config[key];
}
exports.get = get;
function set(key, value) {
    config[key] = value;
    if (key === 'node') {
        node_1.time().then(function (serverTime) {
            var now = Date.now();
            var dif = now - serverTime.getTime();
            if (Math.abs(dif) > 1000 * 30) {
                exports.timeDiff = dif;
            }
            else {
                exports.timeDiff = 0;
            }
        });
    }
    if (key === 'matcher') {
        exports.matcherSettingsPromise = request_1.request({
            url: value + "/settings"
        }).then(function (data) { return data.priceAssets; });
    }
    if (key === 'api' || key === 'apiVersion') {
        if (config.api && config.apiVersion) {
            dataService = new data_service_client_js_1.default({ rootUrl: config.api + "/" + config.apiVersion, parse: exports.parse });
        }
    }
    exports.change.dispatch(key);
}
exports.set = set;
function setConfig(props) {
    Object.keys(props).forEach(function (key) {
        set(key, props[key]);
    });
}
exports.setConfig = setConfig;
function getDataService() {
    return dataService;
}
exports.getDataService = getDataService;
exports.change = new ts_utils_1.Signal();
//# sourceMappingURL=config.js.map