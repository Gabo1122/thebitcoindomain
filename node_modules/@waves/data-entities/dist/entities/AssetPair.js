"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AssetPair = /** @class */ (function () {
    function AssetPair(amountAsset, priceAsset) {
        this.amountAsset = amountAsset;
        this.priceAsset = priceAsset;
        this.precisionDifference =
            this.priceAsset.precision - this.amountAsset.precision;
    }
    AssetPair.prototype.toJSON = function () {
        return {
            amountAsset: this.amountAsset.id,
            priceAsset: this.priceAsset.id,
        };
    };
    AssetPair.prototype.toString = function () {
        return this.amountAsset + "/" + this.priceAsset;
    };
    AssetPair.isAssetPair = function (object) {
        return object instanceof AssetPair;
    };
    return AssetPair;
}());
exports.AssetPair = AssetPair;
//# sourceMappingURL=AssetPair.js.map