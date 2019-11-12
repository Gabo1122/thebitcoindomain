"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_entities_1 = require("@waves/data-entities");
var bignumber_1 = require("@waves/bignumber");
var request_1 = require("../../utils/request");
var config_1 = require("../../config");
function getLastPrice(pair) {
    return request_1.request({
        url: config_1.get('matcher') + "/orderbook/" + pair.amountAsset.id + "/" + pair.priceAsset.id + "/status"
    }).then(function (_a) {
        var lastPrice = _a.lastPrice, lastSide = _a.lastSide;
        var orderPrice = (new data_entities_1.OrderPrice(new bignumber_1.BigNumber(lastPrice), pair)).getTokens();
        var price = (new data_entities_1.Money(0, pair.priceAsset)).cloneWithTokens(orderPrice);
        return { price: price, lastSide: lastSide };
    });
}
exports.getLastPrice = getLastPrice;
//# sourceMappingURL=getLastPrice.js.map