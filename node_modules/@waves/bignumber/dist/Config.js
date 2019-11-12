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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bignumber_js_1 = __importDefault(require("bignumber.js"));
var Config = /** @class */ (function () {
    function Config() {
        this.format = Config.DEFAULT_FORMAT;
        bignumber_js_1.default.config({ FORMAT: this.format });
    }
    Config.prototype.set = function (configPart) {
        if ('FORMAT' in configPart) {
            this.format = __assign({}, this.format, configPart.FORMAT);
            configPart.FORMAT = this.format;
        }
        bignumber_js_1.default.config(configPart);
    };
    Config.DEFAULT_FORMAT = {
        prefix: '',
        decimalSeparator: '.',
        groupSeparator: ',',
        groupSize: 3,
        secondaryGroupSize: 0,
        fractionGroupSeparator: ' ',
        fractionGroupSize: 0,
        suffix: ''
    };
    return Config;
}());
exports.Config = Config;
//# sourceMappingURL=Config.js.map