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
var signature_adapter_1 = require("@waves/signature-adapter");
var data_entities_1 = require("@waves/data-entities");
var utils_1 = require("../../utils/utils");
var ts_utils_1 = require("ts-utils");
var request_1 = require("../../utils/request");
var config_1 = require("../../config");
var assets_1 = require("../assets/assets");
var signatureData;
var timer = null;
exports.factory = {
    price: utils_1.priceMoneyFactory,
    money: utils_1.coinsMoneyFactory
};
exports.remapOrder = function (factory) { return function (assets) { return function (order) {
    var amountAsset = assets[utils_1.normalizeAssetId(order.assetPair.amountAsset)];
    var priceAsset = assets[utils_1.normalizeAssetId(order.assetPair.priceAsset)];
    var assetPair = new data_entities_1.AssetPair(amountAsset, priceAsset);
    var amount = factory.money(order.amount, amountAsset);
    var price = factory.price(order.price, assetPair);
    var filled = factory.money(order.filled, amountAsset);
    var total = data_entities_1.Money.fromTokens(amount.getTokens().mul(price.getTokens()), priceAsset);
    var progress = Number(filled.getTokens().div(amount.getTokens()).toFixed());
    var timestamp = new Date(order.timestamp);
    var isActive = order.status === 'Accepted' || order.status === 'PartiallyFilled';
    return __assign({}, order, { amount: amount, price: price, filled: filled, assetPair: assetPair, progress: progress, timestamp: timestamp, isActive: isActive, total: total });
}; }; };
exports.matcherOrderRemap = exports.remapOrder(exports.factory);
function addSignature(signature, publicKey, timestamp) {
    addTimer({
        timestamp: timestamp,
        signature: signature,
        publicKey: publicKey
    });
}
exports.addSignature = addSignature;
function hasSignature() {
    return !!signatureData;
}
exports.hasSignature = hasSignature;
function clearSignature() {
    signatureData = null;
    if (timer) {
        clearTimeout(timer);
        timer = null;
    }
}
exports.clearSignature = clearSignature;
exports.signatureTimeout = new ts_utils_1.Signal();
var fetch = function (url) {
    return request_1.request({
        url: config_1.get('matcher') + "/" + url,
        fetchOptions: {
            headers: {
                Timestamp: signatureData.timestamp,
                Signature: signatureData.signature
            }
        }
    });
};
exports.parse = function (list) {
    var assets = getAssetsFromOrderList(list);
    return assets_1.get(assets).then(function (assets) {
        var hash = utils_1.toHash(assets, 'id');
        return list.map(function (order) { return exports.matcherOrderRemap(hash)(order); });
    });
};
function getOrders(options) {
    if (!signatureData) {
        throw new Error('Get orders without signature! Call method "addSignature"!');
    }
    options = options ? options : { isActive: true };
    var activeOnly = options.isActive;
    return fetch("orderbook/" + signatureData.publicKey + "?activeOnly=" + activeOnly)
        .then(exports.parse);
}
exports.getOrders = getOrders;
function getOrdersByPair(pair) {
    if (!signatureData) {
        throw new Error('Get orders without signature! Call method "addSignature"!');
    }
    return fetch("orderbook/" + pair.amountAsset.id + "/" + pair.priceAsset.id + "/publicKey/" + signatureData.publicKey)
        .then(exports.parse);
}
exports.getOrdersByPair = getOrdersByPair;
function getReservedBalance() {
    if (!signatureData) {
        throw new Error('Get orders without signature! Call method "addSignature"!');
    }
    return fetch("/balance/reserved/" + signatureData.publicKey)
        .then(prepareReservedBalance);
}
exports.getReservedBalance = getReservedBalance;
function prepareReservedBalance(data) {
    var assetIdList = Object.keys(data);
    return assets_1.get(assetIdList)
        .then(function (assets) {
        return assets.reduce(function (acc, asset) {
            var count = data[asset.id];
            acc[asset.id] = new data_entities_1.Money(count, asset);
            return acc;
        }, Object.create(null));
    });
}
exports.prepareReservedBalance = prepareReservedBalance;
function getAssetsFromOrderList(orders) {
    var hash = Object.create(null);
    hash[signature_adapter_1.WAVES_ID] = true;
    return Object.keys(orders.reduce(getAssetsFromOrder, hash));
}
function getAssetsFromOrder(assets, order) {
    assets[utils_1.normalizeAssetId(order.assetPair.amountAsset)] = true;
    assets[utils_1.normalizeAssetId(order.assetPair.priceAsset)] = true;
    return assets;
}
function addTimer(sign) {
    clearSignature();
    timer = setTimeout(function () {
        signatureData = null;
        exports.signatureTimeout.dispatch({});
    }, sign.timestamp - Date.now());
    signatureData = sign;
}
//# sourceMappingURL=getOrders.js.map