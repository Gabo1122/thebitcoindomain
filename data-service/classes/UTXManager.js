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
//# sourceMappingURL=UTXManager.js.map