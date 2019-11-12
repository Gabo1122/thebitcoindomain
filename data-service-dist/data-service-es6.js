(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ds = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"../utils/AssetStorage":24,"../utils/request":27,"../utils/utils":28,"./address":2,"./aliases/aliases":3,"./assets/assets":4,"./data":5,"./matcher/getLastPrice":6,"./matcher/getOrders":7,"./matcher/getSettings":8,"./matcher/orderBook":9,"./node/node":10,"./pairs/pairs":11,"./rating/rating":12,"./transactions/parse":13,"./transactions/transactions":14}],2:[function(require,module,exports){
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
var request_1 = require("../../utils/request");
var config_1 = require("../../config");
var assets_1 = require("../assets/assets");
var data_entities_1 = require("@waves/data-entities");
function getScriptInfo(address) {
    return Promise.all([
        assets_1.get('WAVES'),
        request_1.request({ url: config_1.get('node') + "/addresses/scriptInfo/" + address })
    ]).then(function (_a) {
        var asset = _a[0], info = _a[1];
        return __assign({}, info, { extraFee: new data_entities_1.Money(info.extraFee, asset) });
    });
}
exports.getScriptInfo = getScriptInfo;

},{"../../config":20,"../../utils/request":27,"../assets/assets":4,"@waves/data-entities":undefined}],3:[function(require,module,exports){
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

},{"../../config":20,"../../utils/request":27}],4:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var data_entities_1 = require("@waves/data-entities");
var bignumber_1 = require("@waves/bignumber");
var config_1 = require("../../config");
var request_1 = require("../../utils/request");
var signature_adapter_1 = require("@waves/signature-adapter");
var AssetStorage_1 = require("../../utils/AssetStorage");
var utils_1 = require("../../utils/utils");
var ts_utils_1 = require("ts-utils");
var MAX_ASSETS_IN_REQUEST = 30;
function get(assets) {
    return AssetStorage_1.assetStorage.getAssets(utils_1.toArray(assets), getAssetRequestCb)
        .then(function (list) {
        if (typeof assets === 'string') {
            return list[0];
        }
        else {
            return list;
        }
    });
}
exports.get = get;
exports.wavesAsset = new data_entities_1.Asset({
    ticker: 'WAVES',
    id: 'WAVES',
    name: 'Waves',
    precision: 8,
    description: '',
    height: 0,
    hasScript: false,
    timestamp: new Date('2016-04-11T21:00:00.000Z'),
    minSponsoredFee: new bignumber_1.BigNumber(0),
    sender: '',
    quantity: 10000000000000000,
    reissuable: false
});
function getAssetFromNode(assetId) {
    if (assetId === signature_adapter_1.WAVES_ID) {
        return Promise.resolve(exports.wavesAsset);
    }
    return request_1.request({ url: config_1.get('node') + "/assets/details/" + assetId })
        .then(function (data) { return new data_entities_1.Asset({
        id: data.assetId,
        name: data.name,
        description: data.description,
        height: data.issueHeight,
        precision: data.decimals,
        quantity: data.quantity,
        hasScript: !!data.script,
        reissuable: data.reissuable,
        minSponsoredFee: data.minSponsoredFee,
        sender: data.issuer,
        timestamp: new Date(data.issueTimestamp)
    }); });
}
exports.getAssetFromNode = getAssetFromNode;
function balanceList(address, txHash, ordersHash) {
    return Promise.all([
        wavesBalance(address),
        assetsBalance(address)
    ])
        .then(function (_a) {
        var waves = _a[0], balances = _a[1];
        return applyTxAndOrdersDif([waves].concat(balances), txHash, ordersHash);
    });
}
exports.balanceList = balanceList;
function wavesBalance(address) {
    return Promise.all([
        get(signature_adapter_1.WAVES_ID),
        request_1.request({ url: config_1.get('node') + "/addresses/balance/details/" + address })
    ]).then(function (_a) {
        var waves = _a[0], details = _a[1];
        return remapWavesBalance(waves, details);
    });
}
exports.wavesBalance = wavesBalance;
function assetsBalance(address) {
    return request_1.request({ url: config_1.get('node') + "/assets/balance/" + address })
        .then(function (data) {
        data.balances.forEach(function (asset) {
            AssetStorage_1.assetStorage.updateAsset(asset.assetId, new bignumber_1.BigNumber(asset.quantity), asset.reissuable);
        });
        return getAssetsByBalanceList(data)
            .then(function (assets) {
            var hash = utils_1.toHash(assets, 'id');
            return remapAssetsBalance(data, hash);
        });
    });
}
exports.assetsBalance = assetsBalance;
function remapWavesBalance(waves, data) {
    var inOrders = new data_entities_1.Money(0, waves);
    var regular = new data_entities_1.Money(data.regular, waves);
    var available = new data_entities_1.Money(data.available, waves);
    var leasedOut = new data_entities_1.Money(data.regular, waves).sub(available);
    var leasedIn = new data_entities_1.Money(data.effective, waves).sub(available);
    return {
        asset: waves,
        regular: regular,
        available: available,
        inOrders: inOrders,
        leasedOut: leasedOut,
        leasedIn: leasedIn
    };
}
exports.remapWavesBalance = remapWavesBalance;
function remapAssetsBalance(data, assetsHash) {
    utils_1.clearTransferFee();
    return data.balances.map(function (assetData) {
        var asset = assetsHash[assetData.assetId];
        var inOrders = new data_entities_1.Money(new bignumber_1.BigNumber('0'), asset);
        var regular = new data_entities_1.Money(new bignumber_1.BigNumber(assetData.balance), asset);
        var available = regular.sub(inOrders);
        var empty = new data_entities_1.Money(new bignumber_1.BigNumber('0'), asset);
        var balance = ts_utils_1.isEmpty(assetData.sponsorBalance) ? null : new data_entities_1.Money(assetData.sponsorBalance, assetsHash[signature_adapter_1.WAVES_ID]);
        var fee = ts_utils_1.isEmpty(assetData.minSponsoredAssetFee) ? null : new data_entities_1.Money(assetData.minSponsoredAssetFee, asset);
        var issueTransaction = assetData.issueTransaction;
        var sender = issueTransaction.sender;
        var isMy = sender === data.address;
        if (balance && fee) {
            utils_1.setTransferFeeItem({ balance: balance, fee: fee, isMy: isMy });
        }
        return {
            asset: asset,
            regular: regular,
            available: available,
            inOrders: inOrders,
            leasedOut: empty,
            leasedIn: empty,
        };
    }).sort((function (a, b) { return a.asset.name > b.asset.name ? 1 : a.asset.name === b.asset.name ? 0 : -1; }));
}
exports.remapAssetsBalance = remapAssetsBalance;
function applyTxAndOrdersDif(balance, txHash, ordersHash) {
    var list = utils_1.toArray(balance);
    txHash = txHash || Object.create(null);
    ordersHash = ordersHash || Object.create(null);
    list.forEach(function (balance) {
        balance.regular = moneyDif(balance.regular, txHash[balance.asset.id]);
        balance.available = moneyDif(balance.available, txHash[balance.asset.id], ordersHash[balance.asset.id]);
        balance.inOrders = ordersHash[balance.asset.id] || new data_entities_1.Money(new bignumber_1.BigNumber(0), balance.asset);
    });
    if (Array.isArray(balance)) {
        return list;
    }
    return list[0];
}
exports.applyTxAndOrdersDif = applyTxAndOrdersDif;
function moneyDif(target) {
    var toDif = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        toDif[_i - 1] = arguments[_i];
    }
    var result = toDif.filter(Boolean).reduce(function (result, toSub) {
        return result.sub(toSub);
    }, target);
    if (result.getTokens().lt(0)) {
        return result.cloneWithCoins('0');
    }
    else {
        return result;
    }
}
exports.moneyDif = moneyDif;
function getAssetsByBalanceList(data) {
    return get([signature_adapter_1.WAVES_ID].concat(data.balances.map(function (balance) { return utils_1.normalizeAssetId(balance.assetId); })));
}
exports.getAssetsByBalanceList = getAssetsByBalanceList;
var splitRequest = function (list, getData) {
    var newList = list.slice();
    var requests = [];
    var _loop_1 = function () {
        var listPart = newList.splice(0, MAX_ASSETS_IN_REQUEST);
        var result = getData(listPart);
        var timeout = exports.wait(5000).then(function () { return ({ data: listPart.map(function () { return null; }) }); });
        requests.push(Promise.race([result, timeout]));
    };
    while (newList.length) {
        _loop_1();
    }
    return Promise.all(requests).then(function (results) {
        var data = [];
        for (var _i = 0, results_1 = results; _i < results_1.length; _i++) {
            var items = results_1[_i];
            data = data.concat(items.data);
        }
        return { data: data };
    }).catch(function (e) { return ({ data: list.map(function () { return null; }) }); });
};
var getAssetRequestCb = function (list) {
    var ds = config_1.getDataService();
    return splitRequest(list, ds.getAssets) //TODO delete after modify client lib
        .then(function (response) {
        var assets = response.data;
        var fails = [];
        list.forEach(function (id, index) {
            if (!assets[index]) {
                fails.push(id);
            }
        });
        return queueRequest(fails)
            .then(function (reloadedAssets) {
            var failCount = 0;
            return list.map(function (id, index) {
                if (assets[index]) {
                    return assets[index];
                }
                else {
                    return reloadedAssets[failCount++];
                }
            });
        });
    });
};
function queueRequest(list) {
    return __awaiter(this, void 0, void 0, function () {
        var result, _i, list_1, assetId, asset;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    result = [];
                    _i = 0, list_1 = list;
                    _a.label = 1;
                case 1:
                    if (!(_i < list_1.length)) return [3 /*break*/, 4];
                    assetId = list_1[_i];
                    return [4 /*yield*/, getAssetFromNode(assetId)];
                case 2:
                    asset = _a.sent();
                    result.push(asset);
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, result];
            }
        });
    });
}
exports.queueRequest = queueRequest;
exports.wait = function (time) { return new Promise(function (resolve) { return setTimeout(resolve, time); }); };

},{"../../config":20,"../../utils/AssetStorage":24,"../../utils/request":27,"../../utils/utils":28,"@waves/bignumber":undefined,"@waves/data-entities":undefined,"@waves/signature-adapter":undefined,"ts-utils":undefined}],5:[function(require,module,exports){
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

},{"../../config":20,"../../utils/request":27,"@waves/oracle-data":undefined,"ramda":undefined}],6:[function(require,module,exports){
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

},{"../../config":20,"../../utils/request":27,"@waves/bignumber":undefined,"@waves/data-entities":undefined}],7:[function(require,module,exports){
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

},{"../../config":20,"../../utils/request":27,"../../utils/utils":28,"../assets/assets":4,"@waves/data-entities":undefined,"@waves/signature-adapter":undefined,"ts-utils":undefined}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request_1 = require("../../utils/request");
var config_1 = require("../../config");
function getFeeRates() {
    return request_1.request({
        url: config_1.get('matcher') + "/settings/rates"
    });
}
exports.getFeeRates = getFeeRates;
function getSettings() {
    return request_1.request({
        url: config_1.get('matcher') + "/settings"
    });
}
exports.getSettings = getSettings;

},{"../../config":20,"../../utils/request":27}],9:[function(require,module,exports){
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

},{"../../config":20,"../../utils/request":27,"../../utils/utils":28,"../pairs/pairs":11,"@waves/bignumber":undefined,"@waves/data-entities":undefined}],10:[function(require,module,exports){
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

},{"../../config":20,"../../utils/request":27}],11:[function(require,module,exports){
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

},{"../../config":20,"../../utils/request":27,"../assets/assets":4,"@waves/assets-pairs-order":30,"@waves/bignumber":undefined,"@waves/data-entities":undefined,"@waves/signature-adapter":undefined}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request_1 = require("../../utils/request");
var utils_1 = require("../../utils/utils");
var config_1 = require("../../config");
function getAssetsRating(assets) {
    return request_1.request({
        url: config_1.get('tokenrating') + "/api/v1/token/",
        fetchOptions: {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: utils_1.stringifyJSON({
                "assetIds": utils_1.toArray(assets),
                "page": 1,
                "limit": 25
            })
        }
    })
        .then(function (tokensList) {
        return Object.values(tokensList).map(function (ratingItem) {
            return {
                assetId: ratingItem.assetId,
                rating: ratingItem.averageScore
            };
        });
    });
}
exports.getAssetsRating = getAssetsRating;

},{"../../config":20,"../../utils/request":27,"../../utils/utils":28}],13:[function(require,module,exports){
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
var data_entities_1 = require("@waves/data-entities");
var bignumber_1 = require("@waves/bignumber");
var signature_adapter_1 = require("@waves/signature-adapter");
var waves_transactions_1 = require("@waves/waves-transactions");
var assets_1 = require("../assets/assets");
var utils_1 = require("../../utils/utils");
var getOrders_1 = require("../matcher/getOrders");
var sign_1 = require("../../sign");
var ramda_1 = require("ramda");
var SCRIPT_INVOCATION_NUMBER = 16;
var parseAttachment = ramda_1.pipe(String, waves_transactions_1.libs.crypto.base58Decode);
var getFactory = function (isTokens) {
    if (isTokens) {
        return {
            money: utils_1.tokensMoneyFactory,
            price: function (price, pair) { return data_entities_1.Money.fromTokens(price, pair.priceAsset); }
        };
    }
    else {
        return getOrders_1.factory;
    }
};
// TODO Remove is tokens flag after support Dima's api
function parseTx(transactions, isUTX, isTokens) {
    var hash = Object.create(null);
    hash[signature_adapter_1.WAVES_ID] = true;
    transactions.forEach(function (tx) { return getAssetsHashFromTx(tx, hash); });
    var api = sign_1.getSignatureApi();
    return Promise.all([
        assets_1.get(Object.keys(hash)).then(function (assets) { return utils_1.toHash(assets, 'id'); }),
        api && api.getPublicKey() || Promise.resolve(null),
        api && api.getSignVersions() || Promise.resolve({})
    ])
        .then(function (_a) {
        var hash = _a[0], sender = _a[1], versions = _a[2];
        return transactions.map(function (transaction) {
            if ('version' in transaction && versions[transaction.type] != null) {
                var versionList = versions[transaction.type];
                var version = versionList.includes(transaction.version) ? transaction.version : versionList[versionList.lenght - 1];
                transaction.version = version;
            }
            switch (transaction.type) {
                case signature_adapter_1.TRANSACTION_TYPE_NUMBER.SEND_OLD:
                    return parseTransferTx(remapOldTransfer(transaction), hash, isUTX);
                case signature_adapter_1.TRANSACTION_TYPE_NUMBER.ISSUE:
                    return parseIssueTx(transaction, hash, isUTX);
                case signature_adapter_1.TRANSACTION_TYPE_NUMBER.TRANSFER:
                    return parseTransferTx(transaction, hash, isUTX);
                case signature_adapter_1.TRANSACTION_TYPE_NUMBER.REISSUE:
                    return parseReissueTx(transaction, hash, isUTX);
                case signature_adapter_1.TRANSACTION_TYPE_NUMBER.BURN:
                    return parseBurnTx(transaction, hash, isUTX);
                case signature_adapter_1.TRANSACTION_TYPE_NUMBER.EXCHANGE:
                    return parseExchangeTx(transaction, hash, isUTX, isTokens, sender);
                case signature_adapter_1.TRANSACTION_TYPE_NUMBER.LEASE:
                    return parseLeasingTx(transaction, hash, isUTX);
                case signature_adapter_1.TRANSACTION_TYPE_NUMBER.CANCEL_LEASING:
                    return parseCancelLeasingTx(transaction, hash, isUTX);
                case signature_adapter_1.TRANSACTION_TYPE_NUMBER.CREATE_ALIAS:
                    return parseCreateAliasTx(transaction, hash, isUTX);
                case signature_adapter_1.TRANSACTION_TYPE_NUMBER.MASS_TRANSFER:
                    return parseMassTransferTx(transaction, hash, isUTX);
                case signature_adapter_1.TRANSACTION_TYPE_NUMBER.DATA:
                    return parseDataTx(transaction, hash, isUTX);
                case signature_adapter_1.TRANSACTION_TYPE_NUMBER.SPONSORSHIP:
                    return parseSponsorshipTx(transaction, hash, isUTX);
                case signature_adapter_1.TRANSACTION_TYPE_NUMBER.SET_SCRIPT:
                    return parseScriptTx(transaction, hash, isUTX);
                case signature_adapter_1.TRANSACTION_TYPE_NUMBER.SET_ASSET_SCRIPT:
                    return parseAssetScript(transaction, hash, isUTX);
                case SCRIPT_INVOCATION_NUMBER:
                    return parseInvocationTx(transaction, hash, isUTX);
                default:
                    return transaction;
            }
        });
    });
}
exports.parseTx = parseTx;
function getAssetsHashFromTx(transaction, hash) {
    if (hash === void 0) { hash = Object.create(null); }
    hash[signature_adapter_1.WAVES_ID] = true;
    switch (transaction.type) {
        case signature_adapter_1.TRANSACTION_TYPE_NUMBER.REISSUE:
        case signature_adapter_1.TRANSACTION_TYPE_NUMBER.BURN:
        case signature_adapter_1.TRANSACTION_TYPE_NUMBER.MASS_TRANSFER:
        case signature_adapter_1.TRANSACTION_TYPE_NUMBER.SPONSORSHIP:
            hash[utils_1.normalizeAssetId(transaction.assetId)] = true;
            break;
        case signature_adapter_1.TRANSACTION_TYPE_NUMBER.TRANSFER:
            hash[utils_1.normalizeAssetId(transaction.assetId)] = true;
            hash[utils_1.normalizeAssetId(transaction.feeAssetId)] = true;
            break;
        case signature_adapter_1.TRANSACTION_TYPE_NUMBER.EXCHANGE:
            hash[utils_1.normalizeAssetId(transaction.order1.assetPair.amountAsset)] = true;
            hash[utils_1.normalizeAssetId(transaction.order1.assetPair.priceAsset)] = true;
            hash[utils_1.normalizeAssetId(transaction.order1.matcherFeeAssetId)] = true;
            hash[utils_1.normalizeAssetId(transaction.order2.matcherFeeAssetId)] = true;
            break;
        case SCRIPT_INVOCATION_NUMBER:
            transaction.payment.forEach(function (payment) {
                hash[utils_1.normalizeAssetId(payment.assetId)] = true;
            });
            break;
    }
    return hash;
}
exports.getAssetsHashFromTx = getAssetsHashFromTx;
function remapOldTransfer(tx) {
    var type = signature_adapter_1.TRANSACTION_TYPE_NUMBER.TRANSFER;
    var assetId = signature_adapter_1.WAVES_ID;
    return __assign({}, tx, { type: type, assetId: assetId, attachment: '', feeAssetId: signature_adapter_1.WAVES_ID });
}
exports.remapOldTransfer = remapOldTransfer;
function parseIssueTx(tx, assetsHash, isUTX) {
    var quantity = new bignumber_1.BigNumber(tx.quantity);
    var fee = new data_entities_1.Money(tx.fee, assetsHash[signature_adapter_1.WAVES_ID]);
    return __assign({}, tx, { precision: tx.decimals, quantity: quantity, fee: fee, isUTX: isUTX });
}
exports.parseIssueTx = parseIssueTx;
function parseTransferTx(tx, assetsHash, isUTX) {
    var attachment = parseAttachment(tx.attachment);
    var recipient = utils_1.normalizeRecipient(tx.recipient);
    var amount = new data_entities_1.Money(tx.amount, assetsHash[utils_1.normalizeAssetId(tx.assetId)]);
    var fee = new data_entities_1.Money(tx.fee, assetsHash[utils_1.normalizeAssetId(tx.feeAssetId)]);
    var assetId = utils_1.normalizeAssetId(tx.assetId);
    return __assign({}, tx, { amount: amount, fee: fee, assetId: assetId, isUTX: isUTX, attachment: attachment, recipient: recipient });
}
exports.parseTransferTx = parseTransferTx;
function parseReissueTx(tx, assetsHash, isUTX) {
    var quantity = new data_entities_1.Money(tx.quantity, assetsHash[utils_1.normalizeAssetId(tx.assetId)]);
    var fee = new data_entities_1.Money(tx.fee, assetsHash[signature_adapter_1.WAVES_ID]);
    return __assign({}, tx, { quantity: quantity, fee: fee, isUTX: isUTX });
}
exports.parseReissueTx = parseReissueTx;
function parseBurnTx(tx, assetsHash, isUTX) {
    var amount = new data_entities_1.Money(tx.amount, assetsHash[utils_1.normalizeAssetId(tx.assetId)]);
    var fee = new data_entities_1.Money(tx.fee, assetsHash[signature_adapter_1.WAVES_ID]);
    return __assign({}, tx, { amount: amount, fee: fee, isUTX: isUTX });
}
exports.parseBurnTx = parseBurnTx;
function parseExchangeTx(tx, assetsHash, isUTX, isTokens, sender) {
    var _a;
    var factory = getFactory(isTokens);
    var order1 = parseExchangeOrder(factory, tx.order1, assetsHash);
    var order2 = parseExchangeOrder(factory, tx.order2, assetsHash);
    var orderHash = (_a = {},
        _a[order1.orderType] = order1,
        _a[order2.orderType] = order2,
        _a);
    var buyOrder = orderHash.buy;
    var sellOrder = orderHash.sell;
    var exchangeType = getExchangeType(order1, order2, sender);
    var _b = getExchangeTxMoneys(factory, tx, assetsHash), price = _b.price, amount = _b.amount, total = _b.total;
    var buyMatcherFee = factory.money(tx.buyMatcherFee, buyOrder.matcherFee.asset);
    var sellMatcherFee = factory.money(tx.sellMatcherFee, sellOrder.matcherFee.asset);
    var fee = factory.money(tx.fee, assetsHash[signature_adapter_1.WAVES_ID]);
    return __assign({}, tx, { order1: order1,
        order2: order2,
        price: price,
        amount: amount,
        buyMatcherFee: buyMatcherFee,
        sellMatcherFee: sellMatcherFee,
        fee: fee,
        isUTX: isUTX,
        buyOrder: buyOrder,
        sellOrder: sellOrder,
        exchangeType: exchangeType,
        total: total });
}
exports.parseExchangeTx = parseExchangeTx;
function parseScriptTx(tx, assetsHash, isUTX) {
    var fee = new data_entities_1.Money(tx.fee, assetsHash[signature_adapter_1.WAVES_ID]);
    var script = tx.script || '';
    return __assign({}, tx, { fee: fee, isUTX: isUTX, script: script });
}
exports.parseScriptTx = parseScriptTx;
function parseAssetScript(tx, assetsHash, isUTX) {
    var fee = new data_entities_1.Money(tx.fee, assetsHash[signature_adapter_1.WAVES_ID]);
    var script = tx.script || '';
    return __assign({}, tx, { fee: fee, isUTX: isUTX, script: script });
}
exports.parseAssetScript = parseAssetScript;
function getExchangeTxMoneys(factory, tx, assetsHash) {
    var assetIdPair = utils_1.normalizeAssetPair(tx.order2.assetPair);
    var pair = new data_entities_1.AssetPair(assetsHash[assetIdPair.amountAsset], assetsHash[assetIdPair.priceAsset]);
    var price = factory.price(tx.price, pair);
    var amount = factory.money(tx.amount, pair.amountAsset);
    var total = data_entities_1.Money.fromTokens(amount.getTokens().mul(price.getTokens()), price.asset);
    return { price: price, amount: amount, total: total };
}
exports.getExchangeTxMoneys = getExchangeTxMoneys;
function parseLeasingTx(tx, assetsHash, isUTX) {
    var amount = new data_entities_1.Money(tx.amount, assetsHash[signature_adapter_1.WAVES_ID]);
    var fee = new data_entities_1.Money(tx.fee, assetsHash[signature_adapter_1.WAVES_ID]);
    var recipient = utils_1.normalizeRecipient(tx.recipient);
    var isActive = tx.status === 'active';
    return __assign({}, tx, { amount: amount, fee: fee, isUTX: isUTX, recipient: recipient, isActive: isActive });
}
exports.parseLeasingTx = parseLeasingTx;
function parseCancelLeasingTx(tx, assetsHash, isUTX) {
    var lease = tx.lease && parseLeasingTx(tx.lease, assetsHash, false) || null;
    var fee = new data_entities_1.Money(tx.fee, assetsHash[signature_adapter_1.WAVES_ID]);
    return __assign({}, tx, { lease: lease, fee: fee, isUTX: isUTX });
}
exports.parseCancelLeasingTx = parseCancelLeasingTx;
function parseCreateAliasTx(tx, assetsHash, isUTX) {
    var fee = new data_entities_1.Money(tx.fee, assetsHash[signature_adapter_1.WAVES_ID]);
    return __assign({}, tx, { fee: fee, isUTX: isUTX });
}
exports.parseCreateAliasTx = parseCreateAliasTx;
function parseMassTransferTx(tx, assetsHash, isUTX) {
    var attachment = parseAttachment(tx.attachment);
    var fee = new data_entities_1.Money(tx.fee, assetsHash[signature_adapter_1.WAVES_ID]);
    var asset = assetsHash[utils_1.normalizeAssetId(tx.assetId)];
    var transfers = tx.transfers.map(function (transfer) { return ({
        recipient: utils_1.normalizeRecipient(transfer.recipient),
        amount: new data_entities_1.Money(transfer.amount, assetsHash[utils_1.normalizeAssetId(tx.assetId)])
    }); });
    var totalAmount = new data_entities_1.Money(tx.totalAmount || transfers.reduce(function (acc, item) { return acc.add(item.amount); }, new data_entities_1.Money(0, asset)).toCoins(), asset);
    return __assign({}, tx, { totalAmount: totalAmount, transfers: transfers, fee: fee, isUTX: isUTX, attachment: attachment });
}
exports.parseMassTransferTx = parseMassTransferTx;
function parseExchangeOrder(factory, order, assetsHash) {
    var assetPair = utils_1.normalizeAssetPair(order.assetPair);
    var pair = new data_entities_1.AssetPair(assetsHash[assetPair.amountAsset], assetsHash[assetPair.priceAsset]);
    var price = factory.price(order.price, pair);
    var amount = factory.money(order.amount, assetsHash[assetPair.amountAsset]);
    var total = data_entities_1.Money.fromTokens(amount.getTokens().mul(price.getTokens()), price.asset);
    var matcherFee = factory.money(order.matcherFee, assetsHash[utils_1.normalizeAssetId(order.matcherFeeAssetId)]);
    return __assign({}, order, { price: price, amount: amount, matcherFee: matcherFee, assetPair: assetPair, total: total });
}
exports.parseExchangeOrder = parseExchangeOrder;
function parseDataTx(tx, assetsHash, isUTX) {
    var fee = new data_entities_1.Money(tx.fee, assetsHash[signature_adapter_1.WAVES_ID]);
    var data = tx.data.map(function (dataItem) {
        if (dataItem.type === 'integer') {
            return __assign({}, dataItem, { value: new bignumber_1.BigNumber(dataItem.value) });
        }
        else {
            return dataItem;
        }
    });
    var txWithBigNumber = __assign({}, tx, { data: data });
    var stringifiedData = JSON.stringify(txWithBigNumber.data, null, 4);
    return __assign({}, txWithBigNumber, { stringifiedData: stringifiedData, fee: fee, isUTX: isUTX });
}
exports.parseDataTx = parseDataTx;
function parseInvocationTx(tx, assetsHash, isUTX) {
    var fee = new data_entities_1.Money(tx.fee, assetsHash[signature_adapter_1.WAVES_ID]);
    var dApp = utils_1.normalizeRecipient(tx.dApp);
    var payment = tx.payment.map(function (payment) { return new data_entities_1.Money(payment.amount, assetsHash[utils_1.normalizeAssetId(payment.assetId)]); });
    return __assign({}, tx, { fee: fee, payment: payment, isUTX: isUTX, dApp: dApp });
}
exports.parseInvocationTx = parseInvocationTx;
function parseSponsorshipTx(tx, assetsHash, isUTX) {
    var minSponsoredAssetFee = new data_entities_1.Money(tx.minSponsoredAssetFee || 0, assetsHash[tx.assetId]);
    var fee = new data_entities_1.Money(tx.fee, assetsHash[signature_adapter_1.WAVES_ID]);
    return __assign({}, tx, { fee: fee, minSponsoredAssetFee: minSponsoredAssetFee, isUTX: isUTX });
}
function getExchangeType(order1, order2, sender) {
    if (isBothOwnedBy(order1, order2, sender) || isBothNotOwnedBy(order1, order2, sender)) {
        return order1.timestamp > order2.timestamp ? order1.orderType : order2.orderType;
    }
    else {
        return getMineOrder(order1, order2, sender).orderType;
    }
}
function getMineOrder(order1, order2, sender) {
    return order1.senderPublicKey === sender ? order1 : order2;
}
function isBothOwnedBy(order1, order2, sender) {
    return order1.senderPublicKey === sender && order2.senderPublicKey === sender;
}
function isBothNotOwnedBy(order1, order2, sender) {
    return order1.senderPublicKey !== sender && order2.senderPublicKey !== sender;
}

},{"../../sign":22,"../../utils/utils":28,"../assets/assets":4,"../matcher/getOrders":7,"@waves/bignumber":undefined,"@waves/data-entities":undefined,"@waves/signature-adapter":undefined,"@waves/waves-transactions":undefined,"ramda":undefined}],14:[function(require,module,exports){
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

},{"../../config":20,"../../utils/request":27,"./parse":13,"@waves/signature-adapter":undefined,"ramda":undefined,"ts-utils":undefined}],15:[function(require,module,exports){
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
var request_1 = require("../utils/request");
var getOrders_1 = require("../api/matcher/getOrders");
var config_1 = require("../config");
var store_1 = require("../store");
var utils_1 = require("../utils/utils");
function broadcast(data) {
    return request_1.request({
        url: config_1.get('node') + "/transactions/broadcast",
        fetchOptions: {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: utils_1.stringifyJSON(data)
        }
    });
}
exports.broadcast = broadcast;
function createOrderSend(txData) {
    return request_1.request({
        url: config_1.get('matcher') + "/orderbook",
        fetchOptions: {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: utils_1.stringifyJSON(txData)
        }
    })
        .then(function (data) {
        return getOrders_1.parse([__assign({}, data.message, { type: data.message.orderType, status: 'Accepted', filled: 0 })]);
    })
        .then(store_1.addOrderToStore);
}
exports.createOrderSend = createOrderSend;
function cancelOrderSend(txData, amountId, priceId, type) {
    if (type === void 0) { type = 'cancel'; }
    return request_1.request({
        url: config_1.get('matcher') + "/orderbook/" + amountId + "/" + priceId + "/" + type,
        fetchOptions: {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: utils_1.stringifyJSON(txData)
        }
    }).then(function (data) {
        store_1.removeOrderFromStore({ id: txData.orderId });
        return data;
    });
}
exports.cancelOrderSend = cancelOrderSend;
function cancelAllOrdersSend(txData) {
    return request_1.request({
        url: config_1.get('matcher') + "/orderbook/cancel",
        fetchOptions: {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: utils_1.stringifyJSON(txData)
        }
    }).then(function (data) {
        store_1.removeAllOrdersFromStore();
        return data;
    });
}
exports.cancelAllOrdersSend = cancelAllOrdersSend;

},{"../api/matcher/getOrders":7,"../config":20,"../store":23,"../utils/request":27,"../utils/utils":28}],16:[function(require,module,exports){
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
var ramda_1 = require("ramda");
var Poll_1 = require("../utils/Poll");
var assets_1 = require("../api/assets/assets");
var getOrders_1 = require("../api/matcher/getOrders");
var UTXManager_1 = require("./UTXManager");
var aliases_1 = require("../api/aliases/aliases");
var PollControl_1 = require("./PollControl");
var config_1 = require("../config");
var data_1 = require("../api/data");
var oracle_data_1 = require("@waves/oracle-data");
var DataManager = /** @class */ (function () {
    function DataManager() {
        var _this = this;
        this.transactions = new UTXManager_1.UTXManager();
        this._silentMode = false;
        this.pollControl = new PollControl_1.PollControl(function () { return _this._createPolls(); });
        config_1.change.on(function (key) {
            if (key === 'oracleWaves' && !_this._silentMode) {
                _this.pollControl.restart('oracleWaves');
            }
        });
    }
    DataManager.prototype.setSilentMode = function (silent) {
        this._silentMode = silent;
        if (silent) {
            this.pollControl.pause();
        }
        else {
            this.pollControl.play();
        }
    };
    DataManager.prototype.applyAddress = function (address) {
        this.dropAddress();
        this._address = address;
        this.pollControl.create();
        this.transactions.applyAddress(this._address);
    };
    DataManager.prototype.dropAddress = function () {
        this._address = undefined;
        this.pollControl.destroy();
        this.transactions.dropAddress();
    };
    DataManager.prototype.getBalances = function () {
        return this.pollControl.getPollHash().balance.getDataPromise();
    };
    DataManager.prototype.getReservedInOrders = function () {
        return this.pollControl.getPollHash().orders.getDataPromise();
    };
    DataManager.prototype.getAliasesPromise = function () {
        return this.pollControl.getPollHash().aliases.getDataPromise();
    };
    DataManager.prototype.getLastAliases = function () {
        return this.pollControl.getPollHash().aliases.lastData || [];
    };
    DataManager.prototype.getOracleAssetDataByOracleName = function (id, oracleName) {
        var _a;
        if (oracleName === void 0) { oracleName = 'oracleWaves'; }
        var pollHash = this.pollControl.getPollHash();
        var lastData = ramda_1.path([oracleName, 'lastData'], pollHash);
        var assets = lastData && lastData.assets || Object.create(null);
        var WavesApp = window.WavesApp;
        var gateways = (_a = {},
            _a[WavesApp.defaultAssets.USD] = true,
            _a[WavesApp.defaultAssets.EUR] = true,
            _a[WavesApp.defaultAssets.TRY] = true,
            _a[WavesApp.defaultAssets.BTC] = true,
            _a[WavesApp.defaultAssets.ETH] = true,
            _a[WavesApp.defaultAssets.LTC] = true,
            _a[WavesApp.defaultAssets.ZEC] = true,
            _a[WavesApp.defaultAssets.BCH] = true,
            _a[WavesApp.defaultAssets.BSV] = true,
            _a[WavesApp.defaultAssets.DASH] = true,
            _a[WavesApp.defaultAssets.XMR] = true,
            _a[WavesApp.defaultAssets.VST] = true,
            _a[WavesApp.defaultAssets.ERGO] = true,
            _a[WavesApp.defaultAssets.BNT] = true,
            _a);
        var gatewaysSoon = window.angular
            .element(document.body).injector().get('configService').get('GATEWAYS_SOON') || [];
        var descriptionHash = {
            WAVES: { en: 'Waves is a blockchain ecosystem that offers comprehensive and effective blockchain-based tools for businesses, individuals and developers. Waves Platform offers unprecedented throughput and flexibility. Features include the LPoS consensus algorithm, Waves-NG protocol and advanced smart contract functionality.' }
        };
        var gatewayAsset = {
            status: 3,
            version: oracle_data_1.DATA_PROVIDER_VERSIONS.BETA,
            id: id,
            provider: 'WavesPlatform',
            ticker: null,
            link: null,
            email: null,
            logo: null,
            description: descriptionHash[id]
        };
        var gatewaySoonAsset = __assign({}, gatewayAsset, { status: 4 });
        if (id === 'WAVES') {
            return { status: oracle_data_1.STATUS_LIST.VERIFIED, description: descriptionHash.WAVES };
        }
        if (gatewaysSoon.indexOf(id) > -1) {
            return gatewaySoonAsset;
        }
        if (gateways[id]) {
            return gatewayAsset;
        }
        return assets[id] ? __assign({}, assets[id], { provider: lastData.oracle.name }) : null;
    };
    DataManager.prototype.getOraclesAssetData = function (id) {
        var dataOracleWaves = this.getOracleAssetDataByOracleName(id, 'oracleWaves');
        var dataOracleTokenomica = this.getOracleAssetDataByOracleName(id, 'oracleTokenomica');
        return dataOracleWaves || dataOracleTokenomica;
    };
    DataManager.prototype.getOracleData = function (oracleName) {
        return this.pollControl.getPollHash()[oracleName].lastData;
    };
    DataManager.prototype._getPollBalanceApi = function () {
        var _this = this;
        var get = function () {
            var hash = _this.pollControl.getPollHash();
            var inOrdersHash = hash && hash.orders.lastData || Object.create(null);
            return assets_1.balanceList(_this._address, Object.create(null), inOrdersHash);
        };
        return { get: get, set: function () { return null; } };
    };
    DataManager.prototype._getPollOrdersApi = function () {
        return {
            get: function () { return getOrders_1.getReservedBalance(); },
            set: function () { return null; }
        };
    };
    DataManager.prototype._getPollAliasesApi = function () {
        var _this = this;
        return {
            get: function () { return aliases_1.getAliasesByAddress(_this._address); },
            set: function () { return null; }
        };
    };
    DataManager.prototype._getPollOracleApi = function (address) {
        return {
            get: function () {
                return address ? data_1.getOracleData(address) : Promise.resolve({ assets: Object.create(null) });
            },
            set: function () { return null; }
        };
    };
    DataManager.prototype._createPolls = function () {
        var balance = new Poll_1.Poll(this._getPollBalanceApi(), 1000);
        var orders = new Poll_1.Poll(this._getPollOrdersApi(), 1000);
        var aliases = new Poll_1.Poll(this._getPollAliasesApi(), 10000);
        var oracleWaves = new Poll_1.Poll(this._getPollOracleApi(config_1.get('oracleWaves')), 30000);
        var oracleTokenomica = new Poll_1.Poll(this._getPollOracleApi(config_1.get('oracleTokenomica')), 30000);
        return { balance: balance, orders: orders, aliases: aliases, oracleWaves: oracleWaves, oracleTokenomica: oracleTokenomica };
    };
    return DataManager;
}());
exports.DataManager = DataManager;

},{"../api/aliases/aliases":3,"../api/assets/assets":4,"../api/data":5,"../api/matcher/getOrders":7,"../config":20,"../utils/Poll":26,"./PollControl":17,"./UTXManager":19,"@waves/oracle-data":undefined,"ramda":undefined}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PollControl = /** @class */ (function () {
    function PollControl(create) {
        this.paused = false;
        this._create = create;
    }
    PollControl.prototype.restart = function (name) {
        if (name && this._hash && this._hash[name]) {
            this._hash[name].restart();
            return;
        }
        if (this._hash) {
            Object.values(this._hash)
                .forEach(function (poll) { return poll.restart(); });
        }
    };
    PollControl.prototype.pause = function () {
        this.paused = true;
        if (this._hash) {
            Object.values(this._hash)
                .forEach(function (poll) { return poll.pause(); });
        }
    };
    PollControl.prototype.play = function () {
        this.paused = false;
        if (this._hash) {
            Object.values(this._hash)
                .forEach(function (poll) { return poll.play(); });
        }
    };
    PollControl.prototype.destroy = function () {
        if (this._hash) {
            Object.values(this._hash)
                .forEach(function (poll) { return poll.destroy(); });
            this._hash = null;
        }
    };
    PollControl.prototype.create = function () {
        this.destroy();
        this._hash = this._create();
        if (this.paused) {
            this.pause();
        }
    };
    PollControl.prototype.getPollHash = function () {
        return this._hash;
    };
    return PollControl;
}());
exports.PollControl = PollControl;

},{}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var signature_adapter_1 = require("@waves/signature-adapter");
var waves_transactions_1 = require("@waves/waves-transactions");
signature_adapter_1.Adapter.initOptions({ networkCode: window.WavesApp.network.code.charCodeAt(0) });
exports.Seed = waves_transactions_1.seedUtils.Seed;

},{"@waves/signature-adapter":undefined,"@waves/waves-transactions":undefined}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var transactions_1 = require("../api/transactions/transactions");
var Poll_1 = require("../utils/Poll");
var MoneyHash_1 = require("../utils/MoneyHash");
var signature_adapter_1 = require("@waves/signature-adapter");
var UTXManager = /** @class */ (function () {
    function UTXManager() {
        this._txList = [];
        this._txHash = Object.create(null);
    }
    UTXManager.prototype.applyAddress = function (address) {
        this._address = address;
        this._txList = [];
        this._txHash = Object.create(null);
        this._getTransactionsFromUTX();
    };
    UTXManager.prototype.dropAddress = function () {
        this._address = null;
        this._txList = [];
        this._txHash = Object.create(null);
        this._removePoll();
    };
    UTXManager.prototype._getTransactionsFromUTX = function () {
        return transactions_1.listUTX(this._address).then(this._applyUTXList.bind(this));
    };
    UTXManager.prototype._applyUTXList = function (list) {
        if (list.length) {
            this._createPoll();
            this._txList = list;
            this._updateTxMoneyHash();
        }
        else {
            this._removePoll();
        }
    };
    UTXManager.prototype._removePoll = function () {
        if (this._poll) {
            this._poll.destroy();
            this._poll = null;
        }
    };
    UTXManager.prototype._createPoll = function () {
        if (!this._poll) {
            this._poll = new Poll_1.Poll(this._getPollAPI(), 1000);
        }
    };
    UTXManager.prototype._getPollAPI = function () {
        var _this = this;
        return {
            get: function () { return transactions_1.listUTX(_this._address); },
            set: this._applyUTXList.bind(this)
        };
    };
    UTXManager.prototype._updateTxMoneyHash = function () {
        var moneyList = this._txList.reduce(function (moneyList, tx) {
            moneyList.push(tx.fee);
            switch (tx.type) {
                case signature_adapter_1.TRANSACTION_TYPE_NUMBER.TRANSFER:
                    moneyList.push(tx.amount);
                    break;
                case signature_adapter_1.TRANSACTION_TYPE_NUMBER.LEASE:
                    moneyList.push(tx.amount);
                    break;
                case signature_adapter_1.TRANSACTION_TYPE_NUMBER.MASS_TRANSFER:
                    moneyList.push(tx.totalAmount);
                    break;
            }
            return moneyList;
        }, []);
        var hash = new MoneyHash_1.MoneyHash(moneyList).toHash();
        if (!this._isEqualHash(hash)) {
            this._txHash = hash;
        }
    };
    UTXManager.prototype._isEqualHash = function (hash) {
        var _this = this;
        var newIdList = Object.keys(hash);
        var myIdList = Object.keys(this._txHash);
        var isEqualLength = newIdList.length === myIdList.length;
        return isEqualLength && (!myIdList.length || myIdList.every(function (id) { return hash[id] && _this._txHash[id].eq(hash[id]); }));
    };
    return UTXManager;
}());
exports.UTXManager = UTXManager;

},{"../api/transactions/transactions":14,"../utils/MoneyHash":25,"../utils/Poll":26,"@waves/signature-adapter":undefined}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_service_client_js_1 = require("@waves/data-service-client-js");
var node_1 = require("./api/node/node");
var request_1 = require("./utils/request");
var assets_pairs_order_1 = require("@waves/assets-pairs-order");
var ts_utils_1 = require("ts-utils");
var config = Object.create(null);
var dataService = null;
exports.timeDiff = 0;
exports.matcherSettingsPromise = Promise.resolve(assets_pairs_order_1.MAINNET_DATA);
exports.parse = function (str) { return window.WavesApp.parseJSON(str); };
function get(key) {
    return config[key];
}
exports.get = get;
function set(key, value) {
    config[key] = value;
    if (key === 'node') {
        node_1.time().then(function (serverTime) {
            var now = Date.now();
            var dif = now - serverTime.getTime();
            if (Math.abs(dif) > 1000 * 30) {
                exports.timeDiff = dif;
            }
            else {
                exports.timeDiff = 0;
            }
        });
    }
    if (key === 'matcher') {
        exports.matcherSettingsPromise = request_1.request({
            url: value + "/settings"
        }).then(function (data) { return data.priceAssets; });
    }
    if (key === 'api' || key === 'apiVersion') {
        if (config.api && config.apiVersion) {
            dataService = new data_service_client_js_1.default({ rootUrl: config.api + "/" + config.apiVersion, parse: exports.parse });
        }
    }
    exports.change.dispatch(key);
}
exports.set = set;
function setConfig(props) {
    Object.keys(props).forEach(function (key) {
        set(key, props[key]);
    });
}
exports.setConfig = setConfig;
function getDataService() {
    return dataService;
}
exports.getDataService = getDataService;
exports.change = new ts_utils_1.Signal();

},{"./api/node/node":10,"./utils/request":27,"@waves/assets-pairs-order":30,"@waves/data-service-client-js":35,"ts-utils":undefined}],21:[function(require,module,exports){
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

},{"./api/API":1,"./api/pairs/pairs":11,"./broadcast/broadcast":15,"./classes/DataManager":16,"./classes/Seed":18,"./config":20,"./sign":22,"./store":23,"./utils/AssetStorage":24,"./utils/request":27,"./utils/utils":28,"@waves/data-entities":undefined,"@waves/signature-adapter":undefined}],22:[function(require,module,exports){
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
var API;
function setSignatureApi(api) {
    API = api;
}
exports.setSignatureApi = setSignatureApi;
function dropSignatureApi() {
    API = null;
}
exports.dropSignatureApi = dropSignatureApi;
function getSignatureApi() {
    return API;
}
exports.getSignatureApi = getSignatureApi;
function getDefaultSignatureApi(user) {
    var encryptionRounds = user.settings.get('encryptionRounds');
    var userData = __assign({}, user, { encryptionRounds: encryptionRounds });
    var Adapter = signature_adapter_1.getAdapterByType(user.userType) ||
        signature_adapter_1.getAdapterByType(signature_adapter_1.adapterList[0].type);
    return new Adapter(userData);
}
exports.getDefaultSignatureApi = getDefaultSignatureApi;

},{"@waves/signature-adapter":undefined}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils/utils");
var ramda_1 = require("ramda");
var ordersStore = [];
var toRemoveOrders = [];
function createAddStore(container, timeout) {
    return function (item) {
        utils_1.toArray(item).forEach(function (item) {
            var storeItem = {
                data: item,
                expiration: window.setTimeout(function () {
                    container.splice(container.indexOf(storeItem), 1);
                }, timeout)
            };
            container.push(storeItem);
        });
        return item;
    };
}
function removeFromStoreById(container, idKey, item) {
    var id = item[idKey];
    for (var i = container.length - 1; i >= 0; i--) {
        if (container[i].data[idKey] === id) {
            window.clearTimeout(container[i].expiration);
            container.splice(i, 1);
            break;
        }
    }
}
function removeFromStoreAll(container) {
    for (var i = container.length - 1; i >= 0; i--) {
        window.clearTimeout(container[i].expiration);
        container.splice(i, 1);
    }
}
function createClearStore(addContainer, addRemoveF, idKey) {
    return function (item) {
        utils_1.toArray(item).forEach(function (item) {
            removeFromStoreById(addContainer, idKey, item);
        });
        addRemoveF(item);
        return item;
    };
}
function createClearStoreAll(container, addRemoveF) {
    return function () {
        removeFromStoreAll(container);
    };
}
function createProcessStore(toAddContainer, toRemoveContainer, idKey) {
    return ramda_1.pipe(function (list) { return ramda_1.concat(toAddContainer.map(ramda_1.prop('data')), list); }, function (list) { return ramda_1.differenceWith(ramda_1.eqProps(idKey), list, toRemoveContainer.map(ramda_1.prop('data'))); }, ramda_1.uniqBy(ramda_1.prop(idKey)));
}
var addToRemoveStore = createAddStore(toRemoveOrders, 3000);
exports.addOrderToStore = createAddStore(ordersStore, 3000);
exports.removeOrderFromStore = createClearStore(ordersStore, addToRemoveStore, 'id');
exports.removeAllOrdersFromStore = createClearStoreAll(ordersStore, addToRemoveStore);
exports.processOrdersWithStore = createProcessStore(ordersStore, toRemoveOrders, 'id');

},{"./utils/utils":28,"ramda":undefined}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_entities_1 = require("@waves/data-entities");
var utils_1 = require("./utils");
var AssetStorage = /** @class */ (function () {
    function AssetStorage() {
        this._promiseHash = Object.create(null);
        this._hash = Object.create(null);
    }
    AssetStorage.prototype.getAssets = function (idList, getMethod) {
        var _this = this;
        var promiseHash = idList.reduce(function (result, assetId) {
            if (_this._promiseHash[assetId]) {
                result[assetId] = _this._promiseHash[assetId];
            }
            return result;
        }, Object.create(null));
        var noCachedList = idList.filter(function (assetId) {
            return !promiseHash[assetId] && !_this._hash[assetId];
        });
        var loadedIdList = Object.keys(promiseHash);
        if (loadedIdList.length) {
            var promiseList = loadedIdList.map(function (id) { return promiseHash[id]; });
            var newRequestPromise = this._getNewRequestPromise(noCachedList, getMethod);
            promiseList.push(newRequestPromise);
            return Promise.all(promiseList).then(function () { return idList.map(function (id) { return _this._hash[id]; }); });
        }
        else {
            if (noCachedList.length) {
                var newRequestPromise = this._getNewRequestPromise(noCachedList, getMethod);
                return newRequestPromise.then(function () { return idList.map(function (id) { return _this._hash[id]; }); });
            }
            else {
                return Promise.resolve(idList.map(function (id) { return _this._hash[id]; }));
            }
        }
    };
    AssetStorage.prototype.updateAsset = function (id, quantity, reissuable) {
        if (this._hash[id]) {
            var asset = this._hash[id];
            if (asset.reissuable !== reissuable || !quantity.eq(asset.quantity)) {
                var info = {
                    id: id,
                    ticker: asset.ticker,
                    name: asset.name,
                    precision: asset.precision,
                    description: asset.description,
                    height: asset.height,
                    timestamp: asset.timestamp,
                    sender: asset.sender,
                    hasScript: asset.hasScript,
                    minSponsoredFee: asset.minSponsoredFee,
                    quantity: quantity,
                    reissuable: reissuable
                };
                this._hash[id] = new data_entities_1.Asset(info);
            }
        }
    };
    AssetStorage.prototype.save = function (idList, data) {
        var _this = this;
        if (utils_1.isPromise(data)) {
            var list_1 = utils_1.toArray(idList);
            list_1.forEach(function (id) {
                _this._promiseHash[id] = data;
            });
            data.then(function (asset) {
                var assetList = utils_1.toArray(asset);
                assetList.forEach(function (asset) {
                    delete _this._promiseHash[asset.id];
                    _this._hash[asset.id] = asset;
                });
            });
            data.catch(function () {
                list_1.forEach(function (id) {
                    delete _this._promiseHash[id];
                });
            });
        }
        else {
            var list = utils_1.toArray(data);
            list.forEach(function (asset) {
                delete _this._promiseHash[asset.id];
                _this._hash[asset.id] = asset;
            });
        }
    };
    AssetStorage.prototype._getNewRequestPromise = function (idList, getMethod) {
        var newRequestPromise = idList.length ? getMethod(idList) : Promise.resolve([]);
        if (idList.length) {
            this.save(idList, newRequestPromise);
        }
        return newRequestPromise;
    };
    return AssetStorage;
}());
exports.AssetStorage = AssetStorage;
exports.assetStorage = new AssetStorage();

},{"./utils":28,"@waves/data-entities":undefined}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MoneyHash = /** @class */ (function () {
    function MoneyHash(list) {
        this._storage = Object.create(null);
        if (list) {
            list.forEach(this.add, this);
        }
    }
    MoneyHash.prototype.add = function (money) {
        if (this._storage[money.asset.id]) {
            this._storage[money.asset.id] = this._storage[money.asset.id].add(money);
        }
        else {
            this._storage[money.asset.id] = money;
        }
    };
    MoneyHash.prototype.get = function (id) {
        return this._storage[id];
    };
    MoneyHash.prototype.toHash = function () {
        return this._storage;
    };
    return MoneyHash;
}());
exports.MoneyHash = MoneyHash;

},{}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts_utils_1 = require("ts-utils");
var Poll = /** @class */ (function () {
    function Poll(api, timeout) {
        this.signals = {
            requestSuccess: new ts_utils_1.Signal(),
            requestError: new ts_utils_1.Signal()
        };
        this._api = api;
        this._timeout = timeout;
        this._run();
    }
    Poll.prototype.pause = function () {
        this._clear();
    };
    Poll.prototype.play = function () {
        this._clear();
        this._run();
    };
    Poll.prototype.getDataPromise = function () {
        var _this = this;
        if (this.lastData) {
            return Promise.resolve(this.lastData);
        }
        else {
            return new Promise(function (resolve, reject) {
                var s = function (data) {
                    resolve(data);
                    _this.signals.requestError.off(r);
                };
                var r = function (data) {
                    reject(data);
                    _this.signals.requestSuccess.off(s);
                };
                _this.signals.requestSuccess.once(s);
                _this.signals.requestError.once(r);
            });
        }
    };
    Poll.prototype.destroy = function () {
        this._clear();
    };
    Poll.prototype.restart = function () {
        this._clear();
        this._run();
    };
    Poll.prototype._run = function () {
        var _this = this;
        try {
            var promise = this._api.get();
            promise.then(function (data) {
                _this._api.set(data);
                _this.lastData = data;
                _this.signals.requestSuccess.dispatch(data);
                _this._setTimeout();
            }, function (e) {
                _this.signals.requestError.dispatch(e);
                _this._setTimeout(true);
            });
        }
        catch (e) {
            this.signals.requestError.dispatch(e);
            this._setTimeout(true);
        }
    };
    Poll.prototype._setTimeout = function (isError) {
        var _this = this;
        this._clear();
        this._timer = window.setTimeout(function () { return _this._run(); }, isError ? this._timeout * 10 : this._timeout);
    };
    Poll.prototype._clear = function () {
        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }
    };
    return Poll;
}());
exports.Poll = Poll;

},{"ts-utils":undefined}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("../config");
var utils_1 = require("./utils");
var ts_utils_1 = require("ts-utils");
function request(params) {
    var promise;
    if (params.url) {
        params.fetchOptions = addDefaultRequestParams(params.url, params.fetchOptions);
        promise = fetch(utils_1.normalizeUrl(params.url), params.fetchOptions || Object.create(null))
            .then(function (response) {
            var isJSON = response.headers.get('Content-Type').toLowerCase().includes('application/json');
            if (response.ok) {
                return response.text().then(function (data) { return isJSON ? config_1.parse(data) : data; });
            }
            else {
                if (response.status >= 500 && response.status <= 599) {
                    return response.text()
                        .then(tryParseError)
                        .then(function (error) {
                        if (typeof error === 'object' && error.message) {
                            return Promise.reject(error);
                        }
                        else {
                            return Promise.reject(new Error("An unexpected error has occurred: #" + response.status));
                        }
                    });
                }
                else {
                    return response.text()
                        .then(tryParseError)
                        .then(function (error) { return Promise.reject(error); });
                }
            }
        });
    }
    else if (params.method) {
        promise = params.method();
    }
    else {
        throw new Error('Wrong request params!');
    }
    // TODO catch errors
    return promise;
}
exports.request = request;
function tryParseError(error) {
    try {
        return JSON.parse(error);
    }
    catch (e) {
        return error;
    }
}
function addDefaultRequestParams(url, options) {
    if (options === void 0) { options = Object.create(null); }
    if (url.indexOf(config_1.get('node')) === 0 && ts_utils_1.isEmpty(options.credentials) && options.method !== 'POST') {
        options.credentials = 'include';
    }
    return options;
}

},{"../config":20,"./utils":28,"ts-utils":undefined}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var signature_adapter_1 = require("@waves/signature-adapter");
var data_entities_1 = require("@waves/data-entities");
var bignumber_1 = require("@waves/bignumber");
var assets_1 = require("../api/assets/assets");
var config_1 = require("../config");
function normalizeTime(time) {
    if (typeof time === 'number') {
        return time - config_1.timeDiff;
    }
    else {
        return new Date(time.getTime() - config_1.timeDiff);
    }
}
exports.normalizeTime = normalizeTime;
function normalizeRecipient(recipient) {
    return recipient.replace("alias:" + config_1.get('code') + ":", '');
}
exports.normalizeRecipient = normalizeRecipient;
function coinsMoneyFactory(money, asset) {
    return new data_entities_1.Money(money, asset);
}
exports.coinsMoneyFactory = coinsMoneyFactory;
function tokensMoneyFactory(money, asset) {
    return data_entities_1.Money.fromTokens(money, asset);
}
exports.tokensMoneyFactory = tokensMoneyFactory;
function priceMoneyFactory(money, pair) {
    return data_entities_1.Money.fromTokens(data_entities_1.OrderPrice.fromMatcherCoins(money, pair).getTokens(), pair.priceAsset);
}
exports.priceMoneyFactory = priceMoneyFactory;
function normalizeAssetPair(assetPair) {
    var priceAsset = normalizeAssetId(assetPair.priceAsset);
    var amountAsset = normalizeAssetId(assetPair.amountAsset);
    return { priceAsset: priceAsset, amountAsset: amountAsset };
}
exports.normalizeAssetPair = normalizeAssetPair;
function normalizeUrl(url) {
    var urlObject = new URL(url, document.location.origin);
    var parts = [
        urlObject.host,
        urlObject.pathname,
        urlObject.search,
        urlObject.hash
    ].map(function (item) { return item.replace(/\/\//, '/'); });
    return urlObject.protocol + "//" + parts.join('');
}
exports.normalizeUrl = normalizeUrl;
function normalizeAssetId(assetId) {
    return assetId || signature_adapter_1.WAVES_ID;
}
exports.normalizeAssetId = normalizeAssetId;
function idToNode(id) {
    return id === signature_adapter_1.WAVES_ID ? '' : id;
}
exports.idToNode = idToNode;
function toHash(list, property) {
    return list.reduce(function (result, item) {
        result[item[property]] = item;
        return result;
    }, Object.create(null));
}
exports.toHash = toHash;
function proxyArrayArgs(cb) {
    return function (args) {
        return cb.apply(this, args);
    };
}
exports.proxyArrayArgs = proxyArrayArgs;
function addParam(cb, param) {
    return function (data) { return cb(data, param); };
}
exports.addParam = addParam;
function isPromise(some) {
    return typeof some.then === 'function' && typeof some.catch === 'function';
}
exports.isPromise = isPromise;
function toArray(some) {
    if (Array.isArray(some)) {
        return some;
    }
    else {
        return [some];
    }
}
exports.toArray = toArray;
function dateTime(time) {
    if (typeof time === 'number') {
        return time;
    }
    return time.getTime();
}
exports.dateTime = dateTime;
function addTime(date, count, timeType) {
    return new Date(dateTime(date) + getTime(count, timeType).getTime());
}
exports.addTime = addTime;
function getTime(count, timeType) {
    switch (timeType) {
        case 'second':
            return new Date(count * 1000);
        case 'minute':
            return getTime(60 * count, 'second');
        case 'hour':
            return getTime(60 * count, 'minute');
        case 'day':
            return getTime(24 * count, 'hour');
    }
}
exports.getTime = getTime;
function curryN(deep, cb) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return getCurryCallback(deep, [], cb).apply(void 0, args);
    };
}
exports.curryN = curryN;
function curry(cb) {
    return curryN(cb.length, cb);
}
exports.curry = curry;
function getCurryCallback(deep, args1, cb) {
    return function () {
        var args2 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args2[_i] = arguments[_i];
        }
        var args3 = args1.concat(args2);
        if (args3.length >= deep) {
            return cb.call.apply(cb, [null].concat(args3));
        }
        else {
            return getCurryCallback(deep, args3, cb);
        }
    };
}
function toBigNumber(some) {
    return some instanceof bignumber_1.BigNumber ? some : new bignumber_1.BigNumber(some);
}
exports.toBigNumber = toBigNumber;
function toAsset(asset) {
    return typeof asset === 'string' ? assets_1.get(asset) : Promise.resolve(asset);
}
exports.toAsset = toAsset;
function defer() {
    var resolve, reject;
    var promise = new Promise(function (res, rej) {
        resolve = res;
        reject = rej;
    });
    return { resolve: resolve, reject: reject, promise: promise };
}
exports.defer = defer;
function stringifyJSON(data) {
    return window.WavesApp.stringifyJSON(data);
}
exports.stringifyJSON = stringifyJSON;
var transferFeeList = [];
function clearTransferFee() {
    transferFeeList.splice(0, transferFeeList.length);
}
exports.clearTransferFee = clearTransferFee;
function setTransferFeeItem(item) {
    transferFeeList.push(item);
}
exports.setTransferFeeItem = setTransferFeeItem;
function getTransferFeeList() {
    return transferFeeList
        .filter(function (item) { return item.balance.getTokens().gt(1.005) || item.isMy; })
        .map(function (item) { return item.fee; });
}
exports.getTransferFeeList = getTransferFeeList;

},{"../api/assets/assets":4,"../config":20,"@waves/bignumber":undefined,"@waves/data-entities":undefined,"@waves/signature-adapter":undefined}],29:[function(require,module,exports){
module.exports=[
  { "ticker": "WAVES", "id": "WAVES"}
]
},{}],30:[function(require,module,exports){
const Base58 = require('bs58');
const { compareUint8Arrays, isPair, isEmptyArray } = require('./utils');

const MAINNET_RAW_DATA = require('./mainnet.json');
const TESTNET_RAW_DATA = require('./testnet.json');
const ARBITRARY_RAW_DATA = require('./arbitrary.json');

const MAINNET_DATA = MAINNET_RAW_DATA.map(d => d.id);
const TESTNET_DATA = TESTNET_RAW_DATA.map(d => d.id);
const ARBITRARY_DATA = ARBITRARY_RAW_DATA.map(d => d.id);

const orderPair = (predefinedList, first, second) => {
  const firstListIndex = predefinedList.indexOf(first);
  const secondListIndex = predefinedList.indexOf(second);
  const isFirstInList = Boolean(~firstListIndex);
  const isSecondInList = Boolean(~secondListIndex);
  switch (true) {
    case isFirstInList && isSecondInList:
      return firstListIndex > secondListIndex
        ? [first, second]
        : [second, first];
    case isFirstInList && !isSecondInList:
      return [second, first];
    case !isFirstInList && isSecondInList:
      return [first, second];
    default:
      return compareUint8Arrays(Base58.decode(first), Base58.decode(second))
        ? [first, second]
        : [second, first];
  }
};

const curry = function(f) {
  var slice = Array.prototype.slice,
    self = f,
    totalargs = self.length,
    partial = function(args, fn) {
      return function() {
        return fn.apply({}, args.concat(slice.call(arguments)));
      };
    },
    fn = function() {
      var args = slice.call(arguments);
      return args.length < totalargs
        ? partial(args, fn)
        : self.apply({}, slice.apply(arguments, [0, totalargs]));
    };
  return fn;
};
module.exports.createOrderPair = curry(orderPair);
module.exports.MAINNET_DATA = MAINNET_DATA;
module.exports.TESTNET_DATA = TESTNET_DATA;
module.exports.ARBITRARY_DATA = ARBITRARY_DATA;

},{"./arbitrary.json":29,"./mainnet.json":31,"./testnet.json":32,"./utils":33,"bs58":50}],31:[function(require,module,exports){
module.exports=[
  { "ticker": "USD", "id": "Ft8X1v1LTa1ABafufpaCWyVj8KkaxUWE6xBhW6sNFJck"},
  { "ticker": "EUR", "id": "Gtb1WRznfchDnTh37ezoDTJ4wcoKaRsKqKjJjy7nm2zU"},
  { "ticker": "CNY", "id": "DEJbZipbKQjwEiRjx2AqQFucrj5CZ3rAc4ZvFM8nAsoA"},
  { "ticker": "TRY", "id": "2mX5DzVKWrAJw8iwdJnV2qtoeVG9h5nTDpTqC1wb1WEN"},
  { "ticker": "BTC", "id": "8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS"},
  { "ticker": "WAVES", "id": "WAVES"},
  { "ticker": "BCH", "id": "zMFqXuoyrn5w17PFurTqxB7GsS71fp9dfk6XFwxbPCy"},
  { "ticker": "ETH", "id": "474jTeYx2r2Va35794tCScAXWJG9hU2HcgxzMowaZUnu"},
  { "ticker": "LTC", "id": "HZk1mbfuJpmxU1Fs4AX5MWLVYtctsNcg6e2C6VKqK8zk"},
  { "ticker": "DASH", "id": "B3uGHFRpSUuGEDWjqB9LWWxafQj8VTvpMucEyoxzws5H"},
  { "ticker": "Monero", "id": "5WvPKSJXzVE2orvbkJ8wsQmmQKqTv9sGBPksV4adViw3"},
  { "ticker": "ZEC", "id": "BrjUWjndUanm5VsJkbUip8VRYy6LWJePtxya3FNv4TQa"}
]

},{}],32:[function(require,module,exports){
module.exports=[
  { "ticker": "WAVES", "id": "WAVES"},
  { "ticker": "BTC", "id": "Fmg13HEHJHuZYbtJq8Da8wifJENq8uBxDuWoP9pVe2Qe"},
  { "ticker": "USD", "id": "HyFJ3rrq5m7FxdkWtQXkZrDat1F7LjVVGfpSkUuEXQHj"},
  { "ticker": "EUR", "id": "2xnE3EdpqXtFgCP156qt1AbyjpqdZ5jGjWo3CwTawcux"},
  { "ticker": "CNY", "id": "6pmDivReTLikwYqQtJTv6dTcE59knriaodB3AK8T9cF8"}
]

},{}],33:[function(require,module,exports){
const WAVES_ID_TYPE = null;

const compareUint8Arrays = (arr1, arr2) => {
  //  true    - arr1 bigger
  //  false    - arr2 bigger
  return arr1.toString('hex') > arr2.toString('hex');
};
const isPair = o =>
  Array.isArray(o) &&
  o.length === 2 &&
  o.every(id => typeof id === 'string' || id === WAVES_ID_TYPE);
const isEmptyArray = a => Array.isArray(a) && a.length === 0;

module.exports = {
  compareUint8Arrays,
  isPair,
  isEmptyArray,
};

},{}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var types_1 = require("./types");
exports.createRequest = function (methodUrl, params) {
    var URL_MAX_LENGTH = 2000;
    if (typeof params === 'undefined') {
        return { url: methodUrl, method: types_1.HttpMethods.Get };
    }
    var getUrl = "" + methodUrl + utils_1.createQS(params);
    return getUrl.length > URL_MAX_LENGTH
        ? {
            url: methodUrl,
            method: types_1.HttpMethods.Post,
            body: JSON.stringify(params),
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json, text/plain, */*',
            },
        }
        : { url: getUrl, method: types_1.HttpMethods.Get };
};

},{"./types":46,"./utils":47}],35:[function(require,module,exports){
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
var utils_1 = require("./utils");
var transform_1 = require("./transform");
exports.defaultTransform = transform_1.default;
var getAssets_1 = require("./methods/getAssets");
var getAssetsByTicker_1 = require("./methods/getAssetsByTicker");
var getCandles_1 = require("./methods/getCandles");
var getPairs_1 = require("./methods/getPairs");
var getExchangeTxs_1 = require("./methods/getExchangeTxs");
var getTransferTxs_1 = require("./methods/getTransferTxs");
var getMassTransferTxs_1 = require("./methods/getMassTransferTxs");
var getAliases_1 = require("./methods/getAliases");
var DataServiceClient = /** @class */ (function () {
    function DataServiceClient(params) {
        var options = __assign({}, params);
        if (!options.rootUrl) {
            throw new Error('No rootUrl was presented in options object. Check constructor call.');
        }
        // Add defaults
        if (!options.transform) {
            options.transform = transform_1.default;
        }
        if (!options.fetch) {
            options.fetch = utils_1.defaultFetch;
        }
        if (!options.parse) {
            options.parse = utils_1.defaultParse;
        }
        // Create methods
        this.getAssets = getAssets_1.default(options);
        this.getAssetsByTicker = getAssetsByTicker_1.default(options);
        this.getCandles = getCandles_1.default(options);
        this.getPairs = getPairs_1.default(options);
        this.getExchangeTxs = getExchangeTxs_1.default(options);
        this.getTransferTxs = getTransferTxs_1.default(options);
        this.getMassTransferTxs = getMassTransferTxs_1.default(options);
        this.aliases = getAliases_1.default(options);
    }
    return DataServiceClient;
}());
exports.default = DataServiceClient;
__export(require("./types"));

},{"./methods/getAliases":37,"./methods/getAssets":38,"./methods/getAssetsByTicker":39,"./methods/getCandles":40,"./methods/getExchangeTxs":41,"./methods/getMassTransferTxs":42,"./methods/getPairs":43,"./methods/getTransferTxs":44,"./transform":45,"./types":46,"./utils":47}],36:[function(require,module,exports){
"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var createMethod = function (_a) {
    var _b = _a.validate, validate = _b === void 0 ? utils_1.T : _b, generateRequest = _a.generateRequest, libOptions = _a.libOptions, addPaginationToArgs = _a.addPaginationToArgs;
    function method() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return utils_1.pipeP(validate, generateRequest(libOptions.rootUrl), function (_a) {
            var url = _a.url, options = __rest(_a, ["url"]);
            return libOptions.fetch(url, options);
        }, libOptions.parse, function (rawData) {
            return utils_1.pipeP(libOptions.transform, addPagination({ method: method, args: args, addPaginationToArgs: addPaginationToArgs, rawData: rawData }))(rawData);
        }).apply(void 0, args);
    }
    return method;
};
exports.createMethod = createMethod;
var addPagination = function (_a) {
    var method = _a.method, args = _a.args, addPaginationToArgs = _a.addPaginationToArgs, rawData = _a.rawData;
    return function (data) {
        if (!data || !addPaginationToArgs || !rawData || !rawData.lastCursor) {
            return { data: data };
        }
        return {
            data: data,
            fetchMore: function (count) {
                return method(addPaginationToArgs({ args: args, cursor: rawData.lastCursor, count: count }));
            },
        };
    };
};

},{"../utils":47}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var createMethod_1 = require("./createMethod");
var createRequest_1 = require("../createRequest");
var validateId = function (id) {
    return utils_1.isNotString(id)
        ? Promise.reject(new Error('ArgumentsError: aliasId should be string'))
        : Promise.resolve(id);
};
var validateByAddressParams = function (_a) {
    var address = _a[0], options = _a[1];
    return utils_1.isNotString(address)
        ? Promise.reject(new Error('ArgumentsError: address should be string'))
        : Promise.resolve([address, options]);
};
var createRequestForId = function (rootUrl) { return function (id) {
    return createRequest_1.createRequest(rootUrl + "/aliases/" + id);
}; };
var createRequestForAddress = function (rootUrl) { return function (_a) {
    var address = _a[0], showBroken = _a[1].showBroken;
    return createRequest_1.createRequest(rootUrl + "/aliases", {
        address: address,
        showBroken: showBroken,
    });
}; };
var createGetAliases = function (libOptions) { return ({
    getById: createMethod_1.createMethod({
        validate: validateId,
        generateRequest: createRequestForId,
        libOptions: libOptions,
    }),
    getByAddress: function (address, options) {
        if (options === void 0) { options = {}; }
        return createMethod_1.createMethod({
            validate: validateByAddressParams,
            generateRequest: createRequestForAddress,
            libOptions: libOptions,
        })(address, options);
    },
}); };
exports.default = createGetAliases;

},{"../createRequest":34,"../utils":47,"./createMethod":36}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var createMethod_1 = require("./createMethod");
var createRequest_1 = require("../createRequest");
var validateIds = function (idOrIds) {
    var arrayToCheck = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
    return arrayToCheck.some(utils_1.isNotString)
        ? Promise.reject(new Error('ArgumentsError: AssetId should be string'))
        : Promise.resolve(arrayToCheck);
};
var createRequestForMany = function (rootUrl) { return function (ids) { return createRequest_1.createRequest(rootUrl + "/assets", { ids: ids }); }; };
var createGetAssets = function (libOptions) {
    return createMethod_1.createMethod({
        validate: validateIds,
        generateRequest: createRequestForMany,
        libOptions: libOptions,
    });
};
exports.default = createGetAssets;

},{"../createRequest":34,"../utils":47,"./createMethod":36}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createMethod_1 = require("./createMethod");
var createRequest_1 = require("../createRequest");
var validateTicker = function (ticker) {
    return typeof ticker !== 'string'
        ? Promise.reject(new Error('ArgumentsError: Ticker should be string'))
        : Promise.resolve(ticker);
};
var createRequestForMany = function (rootUrl) { return function (ticker) { return createRequest_1.createRequest(rootUrl + "/assets", { ticker: ticker }); }; };
var createGetAssetsByTicker = function (libOptions) {
    return createMethod_1.createMethod({
        validate: validateTicker,
        generateRequest: createRequestForMany,
        libOptions: libOptions,
    });
};
exports.default = createGetAssetsByTicker;

},{"../createRequest":34,"./createMethod":36}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createMethod_1 = require("./createMethod");
var createRequest_1 = require("../createRequest");
var possibleParams = [
    'timeStart',
    'timeEnd',
    'interval',
    'matcher',
];
var isCandlesParams = function (params) {
    return typeof params === 'object' &&
        Object.keys(params).every(function (k) {
            return possibleParams.includes(k);
        });
};
var isFilters = function (filters) {
    return Array.isArray(filters) &&
        filters.length === 3 &&
        typeof filters[0] === 'string' &&
        typeof filters[1] === 'string' &&
        isCandlesParams(filters[2]);
};
var validateFilters = function (filters) {
    return isFilters(filters)
        ? Promise.resolve(filters)
        : Promise.reject('Wrong filters object');
};
var createRequestForCandles = function (rootUrl) { return function (_a) {
    var amountAssetId = _a[0], priceAssetId = _a[1], params = _a[2];
    return createRequest_1.createRequest(rootUrl + "/candles/" + amountAssetId + "/" + priceAssetId, params);
}; };
var createGetCandles = function (libOptions) {
    return createMethod_1.createMethod({
        validate: validateFilters,
        generateRequest: createRequestForCandles,
        libOptions: libOptions,
    });
};
exports.default = createGetCandles;

},{"../createRequest":34,"./createMethod":36}],41:[function(require,module,exports){
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
var createMethod_1 = require("./createMethod");
var createRequest_1 = require("../createRequest");
// One
var validateId = function (id) {
    return typeof id === 'string' ? Promise.resolve(id) : Promise.reject('Wrong id');
};
var generateRequestOne = function (rootUrl) { return function (id) {
    return createRequest_1.createRequest(rootUrl + "/transactions/exchange/" + id);
}; };
//Many
var isFilters = function (filters) {
    var possibleFilters = [
        'timeStart',
        'timeEnd',
        'limit',
        'sort',
        'matcher',
        'sender',
        'amountAsset',
        'priceAsset',
        'after',
    ];
    return (typeof filters === 'object' &&
        Object.keys(filters).every(function (k) { return possibleFilters.includes(k); }));
};
var validateFilters = function (filters) {
    return isFilters(filters)
        ? Promise.resolve(filters)
        : Promise.reject('Wrong filters object');
};
var generateRequestMany = function (rootUrl) { return function (filters) { return createRequest_1.createRequest(rootUrl + "/transactions/exchange", filters); }; };
var createGetExchangeTxs = function (libOptions) {
    var getExchangeTxsOne = createMethod_1.createMethod({
        validate: validateId,
        generateRequest: generateRequestOne,
        libOptions: libOptions,
    });
    var getExchangeTxsMany = createMethod_1.createMethod({
        validate: validateFilters,
        generateRequest: generateRequestMany,
        libOptions: libOptions,
        addPaginationToArgs: function (_a) {
            var filters = _a.args[0], cursor = _a.cursor, count = _a.count;
            return (__assign({}, filters, { after: cursor }, (count ? { limit: count } : {})));
        },
    });
    var getExchangeTxs = function (idOrFilters) {
        if (idOrFilters === void 0) { idOrFilters = {}; }
        return typeof idOrFilters === 'string'
            ? getExchangeTxsOne(idOrFilters)
            : getExchangeTxsMany(idOrFilters);
    };
    return getExchangeTxs;
};
exports.default = createGetExchangeTxs;

},{"../createRequest":34,"./createMethod":36}],42:[function(require,module,exports){
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
var createMethod_1 = require("./createMethod");
var createRequest_1 = require("../createRequest");
// One
var validateId = function (id) {
    return typeof id === 'string' ? Promise.resolve(id) : Promise.reject('Wrong id');
};
var generateRequestOne = function (rootUrl) { return function (id) {
    return createRequest_1.createRequest(rootUrl + "/transactions/mass-transfer/" + id);
}; };
//Many
var isFilters = function (filters) {
    var possibleFilters = [
        'sender',
        'assetId',
        'recipient',
        'after',
        'timeStart',
        'timeEnd',
        'sort',
        'limit',
    ];
    return (typeof filters === 'object' &&
        Object.keys(filters).every(function (k) { return possibleFilters.includes(k); }));
};
var validateFilters = function (filters) {
    return isFilters(filters)
        ? Promise.resolve(filters)
        : Promise.reject('Wrong filters object');
};
var generateRequestMany = function (rootUrl) { return function (filters) {
    return createRequest_1.createRequest(rootUrl + "/transactions/mass-transfer", filters);
}; };
var createGetMassTransferTxs = function (libOptions) {
    var getMassTransferTxsOne = createMethod_1.createMethod({
        validate: validateId,
        generateRequest: generateRequestOne,
        libOptions: libOptions,
    });
    var getMassTransferTxsMany = createMethod_1.createMethod({
        validate: validateFilters,
        generateRequest: generateRequestMany,
        libOptions: libOptions,
        addPaginationToArgs: function (_a) {
            var filters = _a.args[0], cursor = _a.cursor, count = _a.count;
            return (__assign({}, filters, { after: cursor }, (count ? { limit: count } : {})));
        },
    });
    var getMassTransferTxs = function (idOrFilters) {
        if (idOrFilters === void 0) { idOrFilters = {}; }
        return typeof idOrFilters === 'string'
            ? getMassTransferTxsOne(idOrFilters)
            : getMassTransferTxsMany(idOrFilters);
    };
    return getMassTransferTxs;
};
exports.default = createGetMassTransferTxs;

},{"../createRequest":34,"./createMethod":36}],43:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_entities_1 = require("@waves/data-entities");
var createMethod_1 = require("./createMethod");
var createRequest_1 = require("../createRequest");
var isAssetPair = function (pair) {
    switch (true) {
        case typeof pair === 'string':
            return pair.split('/').length === 2;
        case typeof pair === 'object':
            return data_entities_1.AssetPair.isAssetPair(pair);
        default:
            return false;
    }
};
var isValidPairsFilters = function (request) {
    return (Array.isArray(request) &&
        request.length === 2 &&
        typeof request[0] === 'string' &&
        (Array.isArray(request[1]) ? request[1] : [request[1]]).every(isAssetPair));
};
var validateRequest = function (matcher) { return function (pairs) {
    var request = [matcher, pairs];
    return isValidPairsFilters(request)
        ? Promise.resolve(request)
        : Promise.reject(new Error('ArgumentsError: AssetPair should be object with amountAsset, priceAsset'));
}; };
var createRequestForMany = function (nodeUrl) { return function (_a) {
    var matcher = _a[0], pairs = _a[1];
    return createRequest_1.createRequest(nodeUrl + "/pairs", {
        pairs: pairs.map(function (p) { return p.toString(); }),
        matcher: matcher,
    });
}; };
var getPairs = function (libOptions) { return function (matcher) {
    return createMethod_1.createMethod({
        validate: validateRequest(matcher),
        generateRequest: createRequestForMany,
        libOptions: libOptions,
    });
}; };
exports.default = getPairs;

},{"../createRequest":34,"./createMethod":36,"@waves/data-entities":undefined}],44:[function(require,module,exports){
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
var createMethod_1 = require("./createMethod");
var createRequest_1 = require("../createRequest");
// One
var validateId = function (id) {
    return typeof id === 'string' ? Promise.resolve(id) : Promise.reject('Wrong id');
};
var generateRequestOne = function (rootUrl) { return function (id) {
    return createRequest_1.createRequest(rootUrl + "/transactions/transfer/" + id);
}; };
//Many
var isFilters = function (filters) {
    var possibleFilters = [
        'sender',
        'assetId',
        'recipient',
        'after',
        'timeStart',
        'timeEnd',
        'sort',
        'limit',
    ];
    return (typeof filters === 'object' &&
        Object.keys(filters).every(function (k) { return possibleFilters.includes(k); }));
};
var validateFilters = function (filters) {
    return isFilters(filters)
        ? Promise.resolve(filters)
        : Promise.reject('Wrong filters object');
};
var generateRequestMany = function (rootUrl) { return function (filters) { return createRequest_1.createRequest(rootUrl + "/transactions/transfer", filters); }; };
var createGetTransferTxs = function (libOptions) {
    var getTransferTxsOne = createMethod_1.createMethod({
        validate: validateId,
        generateRequest: generateRequestOne,
        libOptions: libOptions,
    });
    var getTransferTxsMany = createMethod_1.createMethod({
        validate: validateFilters,
        generateRequest: generateRequestMany,
        libOptions: libOptions,
        addPaginationToArgs: function (_a) {
            var filters = _a.args[0], cursor = _a.cursor, count = _a.count;
            return (__assign({}, filters, { after: cursor }, (count ? { limit: count } : {})));
        },
    });
    var getTransferTxs = function (idOrFilters) {
        if (idOrFilters === void 0) { idOrFilters = {}; }
        return typeof idOrFilters === 'string'
            ? getTransferTxsOne(idOrFilters)
            : getTransferTxsMany(idOrFilters);
    };
    return getTransferTxs;
};
exports.default = createGetTransferTxs;

},{"../createRequest":34,"./createMethod":36}],45:[function(require,module,exports){
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var data_entities_1 = require("@waves/data-entities");
var types_1 = require("./types");
var utils_1 = require("./utils");
var transformer = function (_a) {
    var __type = _a.__type, data = _a.data, rest = __rest(_a, ["__type", "data"]);
    switch (__type) {
        case types_1.ApiTypes.List:
            return data.map(transformer);
        case types_1.ApiTypes.Asset:
            return transformAsset(data);
        case types_1.ApiTypes.Alias:
            return data;
        case types_1.ApiTypes.Pair:
            return transformPair(data);
        case types_1.ApiTypes.Transaction:
            return data;
        case types_1.ApiTypes.Candle:
            return transformCandle(data);
        default:
            return __assign({ __type: __type, data: data }, rest);
    }
};
var transformAsset = function (data) {
    return data === null ? null : new data_entities_1.Asset(data);
};
var transformPair = utils_1.id;
var transformCandle = function (data) {
    return data === null ? null : new data_entities_1.Candle(data);
};
exports.default = transformer;

},{"./types":46,"./utils":47,"@waves/data-entities":undefined}],46:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ApiTypes;
(function (ApiTypes) {
    ApiTypes["List"] = "list";
    ApiTypes["Asset"] = "asset";
    ApiTypes["Pair"] = "pair";
    ApiTypes["Transaction"] = "transaction";
    ApiTypes["Alias"] = "alias";
    ApiTypes["Candle"] = "candle";
})(ApiTypes = exports.ApiTypes || (exports.ApiTypes = {}));
var HttpMethods;
(function (HttpMethods) {
    HttpMethods["Get"] = "GET";
    HttpMethods["Post"] = "POST";
})(HttpMethods = exports.HttpMethods || (exports.HttpMethods = {}));

},{}],47:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noop = function () { };
exports.defaultFetch = function () {
    var _a;
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return (_a = window).fetch.apply(_a, args).then(function (res) {
        return res.ok
            ? res.text()
            : res.text().then(function (str) { return Promise.reject(new Error(str)); });
    });
};
exports.defaultParse = JSON.parse.bind(JSON);
exports.isNotString = function (value) { return typeof value !== 'string'; };
exports.pipeP = function () {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return fns.reduce(function (prev, fn) { return prev.then(fn); }, Promise.resolve(args.length === 1 ? args[0] : args));
    };
};
exports.some = function (predicate) { return function (arr) {
    return arr.some(predicate);
}; };
/**
 * @param obj flat object with primitives or arrays of primitives as values
 * @returns query string for obj
 */
/**
 * customSerialize :: a -> string
 */
var customSerialize = function (v) {
    switch (true) {
        case v instanceof Date:
            return v.toISOString();
        default:
            return v;
    }
};
var createKeyValue = function (key, v) { return key + "=" + customSerialize(v); };
exports.createQS = function (obj) {
    var qs = Object.entries(obj)
        .filter(function (_a) {
        var _ = _a[0], value = _a[1];
        return value !== undefined;
    })
        .map(function (_a) {
        var key = _a[0], valueOrValues = _a[1];
        return Array.isArray(valueOrValues)
            ? valueOrValues.map(function (v) { return createKeyValue(key, v); }).join('&')
            : createKeyValue(key, valueOrValues);
    })
        .join('&');
    return qs === '' ? qs : "?" + qs;
};
exports.id = function (_) { return _; };
exports.T = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return true;
};

},{}],48:[function(require,module,exports){
// base-x encoding / decoding
// Copyright (c) 2018 base-x contributors
// Copyright (c) 2014-2018 The Bitcoin Core developers (base58.cpp)
// Distributed under the MIT software license, see the accompanying
// file LICENSE or http://www.opensource.org/licenses/mit-license.php.

const Buffer = require('safe-buffer').Buffer

module.exports = function base (ALPHABET) {
  if (ALPHABET.length >= 255) throw new TypeError('Alphabet too long')

  const BASE_MAP = new Uint8Array(256)
  BASE_MAP.fill(255)

  for (let i = 0; i < ALPHABET.length; i++) {
    const x = ALPHABET.charAt(i)
    const xc = x.charCodeAt(0)

    if (BASE_MAP[xc] !== 255) throw new TypeError(x + ' is ambiguous')
    BASE_MAP[xc] = i
  }

  const BASE = ALPHABET.length
  const LEADER = ALPHABET.charAt(0)
  const FACTOR = Math.log(BASE) / Math.log(256) // log(BASE) / log(256), rounded up
  const iFACTOR = Math.log(256) / Math.log(BASE) // log(256) / log(BASE), rounded up

  function encode (source) {
    if (!Buffer.isBuffer(source)) throw new TypeError('Expected Buffer')
    if (source.length === 0) return ''

    // Skip & count leading zeroes.
    let zeroes = 0
    let length = 0
    let pbegin = 0
    const pend = source.length

    while (pbegin !== pend && source[pbegin] === 0) {
      pbegin++
      zeroes++
    }

    // Allocate enough space in big-endian base58 representation.
    const size = ((pend - pbegin) * iFACTOR + 1) >>> 0
    const b58 = new Uint8Array(size)

    // Process the bytes.
    while (pbegin !== pend) {
      let carry = source[pbegin]

      // Apply "b58 = b58 * 256 + ch".
      let i = 0
      for (let it = size - 1; (carry !== 0 || i < length) && (it !== -1); it--, i++) {
        carry += (256 * b58[it]) >>> 0
        b58[it] = (carry % BASE) >>> 0
        carry = (carry / BASE) >>> 0
      }

      if (carry !== 0) throw new Error('Non-zero carry')
      length = i
      pbegin++
    }

    // Skip leading zeroes in base58 result.
    let it = size - length
    while (it !== size && b58[it] === 0) {
      it++
    }

    // Translate the result into a string.
    let str = LEADER.repeat(zeroes)
    for (; it < size; ++it) str += ALPHABET.charAt(b58[it])

    return str
  }

  function decodeUnsafe (source) {
    if (typeof source !== 'string') throw new TypeError('Expected String')
    if (source.length === 0) return Buffer.alloc(0)

    let psz = 0

    // Skip leading spaces.
    if (source[psz] === ' ') return

    // Skip and count leading '1's.
    let zeroes = 0
    let length = 0
    while (source[psz] === LEADER) {
      zeroes++
      psz++
    }

    // Allocate enough space in big-endian base256 representation.
    const size = (((source.length - psz) * FACTOR) + 1) >>> 0 // log(58) / log(256), rounded up.
    const b256 = new Uint8Array(size)

    // Process the characters.
    while (source[psz]) {
      // Decode character
      let carry = BASE_MAP[source.charCodeAt(psz)]

      // Invalid character
      if (carry === 255) return

      let i = 0
      for (let it = size - 1; (carry !== 0 || i < length) && (it !== -1); it--, i++) {
        carry += (BASE * b256[it]) >>> 0
        b256[it] = (carry % 256) >>> 0
        carry = (carry / 256) >>> 0
      }

      if (carry !== 0) throw new Error('Non-zero carry')
      length = i
      psz++
    }

    // Skip trailing spaces.
    if (source[psz] === ' ') return

    // Skip leading zeroes in b256.
    let it = size - length
    while (it !== size && b256[it] === 0) {
      it++
    }

    const vch = Buffer.allocUnsafe(zeroes + (size - it))
    vch.fill(0x00, 0, zeroes)

    let j = zeroes
    while (it !== size) {
      vch[j++] = b256[it++]
    }

    return vch
  }

  function decode (string) {
    const buffer = decodeUnsafe(string)
    if (buffer) return buffer

    throw new Error('Non-base' + BASE + ' character')
  }

  return {
    encode: encode,
    decodeUnsafe: decodeUnsafe,
    decode: decode
  }
}

},{"safe-buffer":53}],49:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  for (var i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],50:[function(require,module,exports){
var basex = require('base-x')
var ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

module.exports = basex(ALPHABET)

},{"base-x":48}],51:[function(require,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function () { return 42 } }
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species != null &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayLike(value)
  }

  if (value == null) {
    throw TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      buf = Buffer.from(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length
  var mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
        : (firstByte > 0xBF) ? 2
          : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

},{"base64-js":49,"ieee754":52}],52:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],53:[function(require,module,exports){
/* eslint-disable node/no-deprecated-api */
var buffer = require('buffer')
var Buffer = buffer.Buffer

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key]
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size)
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
  } else {
    buf.fill(0)
  }
  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
}

},{"buffer":51}]},{},[21])(21)
});
