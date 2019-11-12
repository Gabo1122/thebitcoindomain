"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request_1 = require("../../utils/request");
var config_1 = require("../../config");
function getFeeRates() {
    return request_1.request({
        url: config_1.get('matcher') + "/settings/rates"
    });
}
exports.getFeeRates = getFeeRates;
function getSettings() {
    return request_1.request({
        url: config_1.get('matcher') + "/settings"
    });
}
exports.getSettings = getSettings;
//# sourceMappingURL=getSettings.js.map