"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_entities_1 = require("@waves/data-entities");
var bignumber_1 = require("@waves/bignumber");
var config_1 = require("../../config");
var request_1 = require("../../utils/request");
var assets_1 = require("../assets/assets");
var assets_pairs_order_1 = require("@waves/assets-pairs-order");
var signature_adapter_1 = require("@waves/signature-adapter");
function get(assetId1, assetId2) {
    return config_1.matcherSettingsPromise.then(function (list) {
        return assets_1.get([toId(assetId1), toId(assetId2)])
            .then(function (_a) {
            var _b;
            var asset1 = _a[0], asset2 = _a[1];
            var hash = (_b = {},
                _b[asset1.id] = asset1,
                _b[asset2.id] = asset2,
                _b);
            var _c = assets_pairs_order_1.createOrderPair(list, asset1.id, asset2.id), amountAssetId = _c[0], priceAssetId = _c[1];
            return new data_entities_1.AssetPair(hash[amountAssetId], hash[priceAssetId]);
        });
    });
}
exports.get = get;
var remapPairInfo = function (pairs, volumeFactory) { return function (list) { return pairs.map(function (pair, index) {
    var moneyOrNull = function (pair) { return function (data) { return data && data_entities_1.Money.fromTokens(data, pair.priceAsset) || null; }; };
    var change24F = function (open, close) { return ((!open || open.eq(0)) || !close) ? new bignumber_1.BigNumber(0) : close.sub(open).div(open).mul(100).roundTo(2); };
    var moneyFactory = moneyOrNull(pair);
    var data = list[index] || Object.create(null);
    var amountAsset = pair.amountAsset;
    var priceAsset = pair.priceAsset;
    var lastPrice = moneyFactory(data.lastPrice);
    var firstPrice = moneyFactory(data.firstPrice);
    var high = moneyFactory(data.high);
    var low = moneyFactory(data.low);
    var volume = volumeFactory(data.volumeWaves);
    var change24 = change24F(firstPrice && firstPrice.getTokens(), lastPrice && lastPrice.getTokens());
    if (change24.gt(1000)) {
        change24 = change24.roundTo(0);
    }
    var id = [amountAsset.id, priceAsset.id].sort().join();
    return { amountAsset: amountAsset, priceAsset: priceAsset, lastPrice: lastPrice, firstPrice: firstPrice, volume: volume, change24: change24, id: id, high: high, low: low };
}); }; };
function info(matcher, pairs) {
    return Promise.all([
        assets_1.get(signature_adapter_1.WAVES_ID),
        request_1.request({ method: function () { return config_1.getDataService().getPairs(matcher)(pairs).then(function (response) { return response.data; }); } })
    ]).then(function (_a) {
        var waves = _a[0], list = _a[1];
        var factory = function (data) { return data && data_entities_1.Money.fromTokens(data, waves) || null; };
        return remapPairInfo(pairs, factory)(list);
    });
}
exports.info = info;
function toId(asset) {
    return typeof asset === 'string' ? asset : asset.id;
}
//# sourceMappingURL=pairs.js.map