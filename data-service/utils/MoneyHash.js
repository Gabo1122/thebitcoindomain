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
//# sourceMappingURL=MoneyHash.js.map