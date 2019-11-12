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
//# sourceMappingURL=DataManager.js.map