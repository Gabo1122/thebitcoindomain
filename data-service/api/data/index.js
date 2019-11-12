"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request_1 = require("../../utils/request");
var config_1 = require("../../config");
var oracle_data_1 = require("@waves/oracle-data");
var ramda_1 = require("ramda");
function getDataFields(address) {
    return request_1.request({ url: config_1.get('node') + "/addresses/data/" + address });
}
exports.getDataFields = getDataFields;
function getOracleData(address) {
    return getDataFields(address).then(function (fields) {
        var oracle = oracle_data_1.getProviderData(fields);
        if (oracle.status === oracle_data_1.RESPONSE_STATUSES.ERROR) {
            return null;
        }
        var assets = oracle_data_1.getProviderAssets(fields)
            .filter(function (item) { return item.status === oracle_data_1.RESPONSE_STATUSES.OK; })
            .map(function (item) { return item.content; });
        return {
            oracle: oracle.content,
            assets: ramda_1.indexBy(ramda_1.prop('id'), assets)
        };
    });
}
exports.getOracleData = getOracleData;
//# sourceMappingURL=index.js.map