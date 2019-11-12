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
//# sourceMappingURL=Poll.js.map