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
//# sourceMappingURL=PollControl.js.map