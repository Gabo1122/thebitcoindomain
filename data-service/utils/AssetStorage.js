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
//# sourceMappingURL=AssetStorage.js.map