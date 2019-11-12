"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var request_1 = require("../../utils/request");
var config_1 = require("../../config");
var assets_1 = require("../assets/assets");
var data_entities_1 = require("@waves/data-entities");
function getScriptInfo(address) {
    return Promise.all([
        assets_1.get('WAVES'),
        request_1.request({ url: config_1.get('node') + "/addresses/scriptInfo/" + address })
    ]).then(function (_a) {
        var asset = _a[0], info = _a[1];
        return __assign({}, info, { extraFee: new data_entities_1.Money(info.extraFee, asset) });
    });
}
exports.getScriptInfo = getScriptInfo;
//# sourceMappingURL=index.js.map