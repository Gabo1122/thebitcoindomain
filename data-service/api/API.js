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
var assetsApi = require("./assets/assets");
var transactionsApi = require("./transactions/transactions");
var parse_1 = require("./transactions/parse");
var utilsFunctions = require("../utils/utils");
var request_1 = require("../utils/request");
var AssetStorage_1 = require("../utils/AssetStorage");
var node_1 = require("./node/node");
var orderBook_1 = require("./matcher/orderBook");
var getOrders_1 = require("./matcher/getOrders");
var addressModule = require("./address");
var getLastPrice_1 = require("./matcher/getLastPrice");
var aliases_1 = require("./aliases/aliases");
var getSettings_1 = require("./matcher/getSettings");
var pairsModule = require("./pairs/pairs");
var ratingModule = require("./rating/rating");
var dataModule = require("./data");
exports.aliases = { getAliasesByAddress: aliases_1.getAliasesByAddress, getAddressByAlias: aliases_1.getAddressByAlias };
exports.node = { height: node_1.height };
exports.matcher = {
    getOrderBook: orderBook_1.get, getOrdersByPair: getOrders_1.getOrdersByPair, addSignature: getOrders_1.addSignature, clearSignature: getOrders_1.clearSignature, getOrders: getOrders_1.getOrders, signatureTimeout: getOrders_1.signatureTimeout, factory: getOrders_1.factory, getLastPrice: getLastPrice_1.getLastPrice,
    getFeeRates: getSettings_1.getFeeRates, getSettings: getSettings_1.getSettings
};
exports.assets = __assign({}, assetsApi);
exports.transactions = __assign({}, transactionsApi, { parseTx: parse_1.parseTx, parseExchangeOrder: parse_1.parseExchangeOrder, getAssetsHashFromTx: parse_1.getAssetsHashFromTx });
exports.utils = __assign({}, utilsFunctions, { request: request_1.request, assetStorage: AssetStorage_1.assetStorage });
exports.pairs = __assign({}, pairsModule);
exports.rating = __assign({}, ratingModule);
exports.data = __assign({}, dataModule);
exports.address = addressModule;
//# sourceMappingURL=API.js.map