"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("../../config");
var request_1 = require("../../utils/request");
var parse_1 = require("./parse");
var ts_utils_1 = require("ts-utils");
var signature_adapter_1 = require("@waves/signature-adapter");
var ramda_1 = require("ramda");
var DEFAULT_GET_TRANSACTIONS_OPTIONS = Object.assign(Object.create(null), {
    limit: 5000,
    getAll: false
});
function list(address, limit, after) {
    if (limit === void 0) { limit = 100; }
    return request_1.request({
        url: config_1.get('node') + "/transactions/address/" + address + "/limit/" + limit + (after ? "?after=" + after : '')
    }).then(ramda_1.pipe(ramda_1.prop('0'), ramda_1.uniqBy(ramda_1.prop('id')))).then(function (transactions) { return parse_1.parseTx(transactions, false); });
}
exports.list = list;
function getExchangeTxList(requestParams, options) {
    if (requestParams === void 0) { requestParams = Object.create(null); }
    options = Object.assign(Object.create(null), DEFAULT_GET_TRANSACTIONS_OPTIONS, options);
    var getData = function (response, result) {
        result = result.concat(response.data);
        if (!options.getAll) {
            return result;
        }
        else if (response.data.length && response.fetchMore) {
            if (options.limit && options.limit <= result.length) {
                return result;
            }
            return response.fetchMore().then(function (r) { return getData(r, result); });
        }
        else {
            return result;
        }
    };
    return request_1.request({
        method: function () { return config_1.getDataService().getExchangeTxs(requestParams)
            .then(function (r) { return getData(r, []); }); }
    })
        .then(function (transactions) { return parse_1.parseTx(transactions, false, true); });
}
exports.getExchangeTxList = getExchangeTxList;
function listUTX(address) {
    return request_1.request({ url: config_1.get('node') + "/transactions/unconfirmed" })
        .then(ramda_1.uniqBy(ramda_1.prop('id')))
        .then(function (transactions) { return filterByAddress(transactions, address); })
        .then(function (transactions) { return parse_1.parseTx(transactions, true); });
}
exports.listUTX = listUTX;
function get(id) {
    return request_1.request({ url: config_1.get('node') + "/transactions/info/" + id })
        .then(function (tx) { return parse_1.parseTx([tx], false); })
        .then(function (list) { return list[0]; });
}
exports.get = get;
function getUTX(id) {
    return request_1.request({ url: config_1.get('node') + "/transactions/unconfirmed/info/" + id })
        .then(function (tx) { return parse_1.parseTx([tx], true); })
        .then(function (list) { return list[0]; });
}
exports.getUTX = getUTX;
function filterByAddress(transactions, address) {
    if (address) {
        return transactions.filter(ts_utils_1.contains({ sender: address }));
    }
    return transactions;
}
exports.filterByAddress = filterByAddress;
function isTransfer(tx) {
    return tx.type === signature_adapter_1.TRANSACTION_TYPE_NUMBER.MASS_TRANSFER;
}
exports.isTransfer = isTransfer;
function isIssue(tx) {
    return tx.type === signature_adapter_1.TRANSACTION_TYPE_NUMBER.ISSUE;
}
exports.isIssue = isIssue;
function isReissue(tx) {
    return tx.type === signature_adapter_1.TRANSACTION_TYPE_NUMBER.REISSUE;
}
exports.isReissue = isReissue;
function isBurn(tx) {
    return tx.type === signature_adapter_1.TRANSACTION_TYPE_NUMBER.BURN;
}
exports.isBurn = isBurn;
function isExchange(tx) {
    return tx.type === signature_adapter_1.TRANSACTION_TYPE_NUMBER.EXCHANGE;
}
exports.isExchange = isExchange;
function isLeasing(tx) {
    return tx.type === signature_adapter_1.TRANSACTION_TYPE_NUMBER.LEASE;
}
exports.isLeasing = isLeasing;
function isCancelLeasing(tx) {
    return tx.type === signature_adapter_1.TRANSACTION_TYPE_NUMBER.CANCEL_LEASING;
}
exports.isCancelLeasing = isCancelLeasing;
function isCreateAlias(tx) {
    return tx.type === signature_adapter_1.TRANSACTION_TYPE_NUMBER.CREATE_ALIAS;
}
exports.isCreateAlias = isCreateAlias;
function isMassTransfer(tx) {
    return tx.type === signature_adapter_1.TRANSACTION_TYPE_NUMBER.MASS_TRANSFER;
}
exports.isMassTransfer = isMassTransfer;
function isData(tx) {
    return tx.type === signature_adapter_1.TRANSACTION_TYPE_NUMBER.DATA;
}
exports.isData = isData;
//# sourceMappingURL=transactions.js.map