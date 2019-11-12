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
//# sourceMappingURL=assets.js.map