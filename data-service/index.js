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
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var apiMethods = require("./api/API");
var DataManager_1 = require("./classes/DataManager");
var configApi = require("./config");
var sign = require("./sign");
var utilsModule = require("./utils/utils");
var request_1 = require("./utils/request");
var wavesDataEntitiesModule = require("@waves/data-entities");
var data_entities_1 = require("@waves/data-entities");
var utils_1 = require("./utils/utils");
var config_1 = require("./config");
var pairs_1 = require("./api/pairs/pairs");
var broadcast_1 = require("./broadcast/broadcast");
var signatureAdapters = require("@waves/signature-adapter");
var signature_adapter_1 = require("@waves/signature-adapter");
var signature_adapter_2 = require("@waves/signature-adapter");
exports.getAdapterByType = signature_adapter_2.getAdapterByType;
exports.getAvailableList = signature_adapter_2.getAvailableList;
var Seed_1 = require("./classes/Seed");
exports.Seed = Seed_1.Seed;
var AssetStorage_1 = require("./utils/AssetStorage");
exports.assetStorage = AssetStorage_1.assetStorage;
__export(require("./store"));
exports.wavesDataEntities = __assign({}, wavesDataEntitiesModule);
exports.api = __assign({}, apiMethods);
exports.dataManager = new DataManager_1.DataManager();
exports.config = __assign({}, configApi);
exports.utils = __assign({}, utilsModule);
exports.signature = __assign({}, sign);
exports.signAdapters = signatureAdapters;
exports.isValidAddress = signature_adapter_1.isValidAddress;
// export const prepareForBroadcast = prepareForBroadcastF;
// export const getTransactionId = getTransactionIdF;
exports.broadcast = broadcast_1.broadcast;
exports.createOrder = broadcast_1.createOrderSend;
exports.cancelOrder = broadcast_1.cancelOrderSend;
exports.cancelAllOrders = broadcast_1.cancelAllOrdersSend;
wavesDataEntitiesModule.config.set('remapAsset', function (data) {
    var name = config_1.get('remappedAssetNames')[data.id] || data.name;
    return __assign({}, data, { name: name });
});
function fetch(url, fetchOptions) {
    return request_1.request({ url: url, fetchOptions: fetchOptions });
}
exports.fetch = fetch;
function moneyFromTokens(tokens, assetData) {
    return utils_1.toAsset(assetData).then(function (asset) {
        return exports.wavesDataEntities.Money.fromTokens(tokens, asset);
    });
}
exports.moneyFromTokens = moneyFromTokens;
function moneyFromCoins(coins, assetData) {
    return utils_1.toAsset(assetData).then(function (asset) { return new data_entities_1.Money(coins, asset); });
}
exports.moneyFromCoins = moneyFromCoins;
function orderPriceFromCoins(coins, pair, asset2) {
    if (pair instanceof data_entities_1.AssetPair) {
        return Promise.resolve(data_entities_1.OrderPrice.fromMatcherCoins(coins, pair));
    }
    else {
        return pairs_1.get(pair, asset2).then(function (pair) { return data_entities_1.OrderPrice.fromMatcherCoins(coins, pair); });
    }
}
exports.orderPriceFromCoins = orderPriceFromCoins;
function orderPriceFromTokens(tokens, pair, asset2) {
    if (pair instanceof data_entities_1.AssetPair) {
        return Promise.resolve(data_entities_1.OrderPrice.fromTokens(tokens, pair));
    }
    else {
        return pairs_1.get(pair, asset2).then(function (pair) { return data_entities_1.OrderPrice.fromTokens(tokens, pair); });
    }
}
exports.orderPriceFromTokens = orderPriceFromTokens;
var App = /** @class */ (function () {
    function App() {
    }
    App.prototype.login = function (address, api) {
        this.address = address;
        sign.setSignatureApi(api);
        this._initializeDataManager(address);
    };
    App.prototype.logOut = function () {
        sign.dropSignatureApi();
        exports.dataManager.dropAddress();
    };
    App.prototype.addMatcherSign = function (timestamp, signature) {
        var signApi = sign.getSignatureApi();
        if (!signApi) {
            return Promise.reject({ error: 'No exist signature api' });
        }
        return signApi.getPublicKey()
            .then(function (senderPublicKey) {
            exports.api.matcher.addSignature(signature, senderPublicKey, timestamp);
        });
    };
    App.prototype.getTimeStamp = function (count, timeType) {
        return utilsModule.addTime(utils_1.normalizeTime(new Date().getTime()), count, timeType).valueOf();
    };
    App.prototype.getSignIdForMatcher = function (timestamp) {
        return sign.getSignatureApi()
            .makeSignable({
            type: signature_adapter_1.SIGN_TYPE.MATCHER_ORDERS,
            data: {
                timestamp: timestamp
            }
        })
            .getId();
    };
    App.prototype._initializeDataManager = function (address) {
        exports.dataManager.dropAddress();
        exports.dataManager.applyAddress(address);
    };
    return App;
}());
exports.app = new App();
//# sourceMappingURL=index.js.map