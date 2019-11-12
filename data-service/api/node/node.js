"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request_1 = require("../../utils/request");
var config_1 = require("../../config");
function height() {
    return request_1.request({ url: config_1.get('node') + "/blocks/height" });
}
exports.height = height;
function time() {
    return request_1.request({ url: config_1.get('node') + "/utils/time" })
        .then(function (_a) {
        var NTP = _a.NTP;
        return new Date(NTP);
    });
}
exports.time = time;
//# sourceMappingURL=node.js.map