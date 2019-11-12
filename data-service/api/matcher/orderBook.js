"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("../../config");
var pairs_1 = require("../pairs/pairs");
var utils_1 = require("../../utils/utils");
var data_entities_1 = require("@waves/data-entities");
var bignumber_1 = require("@waves/bignumber");
var request_1 = require("../../utils/request");
function get(asset1, asset2) {
    var timer;
    var timeout = new Promise(function (_, reject) {
        timer = setTimeout(function () { return reject(new Error('Request timeout!')); }, 3000);
    });
    var promise = pairs_1.get(asset1, asset2)
        .then(function (pair) {
        clearTimeout(timer);
        return request_1.request({ url: config_1.get('matcher') + "/orderbook/" + pair.toString() })
            .then(utils_1.addParam(remapOrderBook, pair));
    });
    return Promise.race([promise, timeout]);
}
exports.get = get;
function remapOrderBook(orderBook, pair) {
    var remap = remapOrder(pair);
    return {
        pair: pair,
        bids: orderBook.bids.map(remap),
        asks: orderBook.asks.map(remap)
    };
}
var remapOrder = function (pair) { return function (order) { return ({
    amount: new data_entities_1.Money(order.amount, pair.amountAsset),
    price: data_entities_1.Money.fromTokens(data_entities_1.OrderPrice.fromMatcherCoins(new bignumber_1.BigNumber(order.price), pair).getTokens(), pair.priceAsset)
}); }; };
//# sourceMappingURL=orderBook.js.map