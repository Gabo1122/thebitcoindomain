"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request_1 = require("../../utils/request");
var config_1 = require("../../config");
function getAliasesByAddress(address) {
    var ds = config_1.getDataService();
    return request_1.request({ method: function () { return ds.aliases.getByAddress(address); } })
        .then(function (r) { return r.data.map(function (alias) { return alias.alias; }); });
}
exports.getAliasesByAddress = getAliasesByAddress;
function getAddressByAlias(alias) {
    var ds = config_1.getDataService();
    return request_1.request({ method: function () { return ds.aliases.getById(alias).then(function (r) { return r.data; }); } });
}
exports.getAddressByAlias = getAddressByAlias;
//# sourceMappingURL=aliases.js.map