"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("../config");
var utils_1 = require("../utils");
var Candle = /** @class */ (function () {
    function Candle(candleObject) {
        var _this = this;
        candleObject = config_1.config.get('remapCandle')(candleObject);
        var bigNumbers = [
            'open',
            'close',
            'high',
            'low',
            'volume',
            'quoteVolume',
            'weightedAveragePrice',
        ];
        bigNumbers.forEach(function (key) { return (_this[key] = utils_1.toBigNumber(candleObject[key])); });
        this.time = candleObject.time;
        this.maxHeight = candleObject.maxHeight;
        this.txsCount = candleObject.txsCount;
    }
    Candle.prototype.toJSON = function () {
        return {
            time: this.time,
            open: this.open,
            close: this.close,
            high: this.high,
            low: this.low,
            volume: this.volume,
            quoteVolume: this.quoteVolume,
            weightedAveragePrice: this.weightedAveragePrice,
            maxHeight: this.maxHeight,
            txsCount: this.txsCount,
        };
    };
    Candle.prototype.toString = function () {
        return '[object Candle]';
    };
    Candle.isCandle = function (object) {
        return object instanceof Candle;
    };
    return Candle;
}());
exports.Candle = Candle;
//# sourceMappingURL=Candle.js.map