"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var signature_adapter_1 = require("@waves/signature-adapter");
var waves_transactions_1 = require("@waves/waves-transactions");
signature_adapter_1.Adapter.initOptions({ networkCode: window.WavesApp.network.code.charCodeAt(0) });
exports.Seed = waves_transactions_1.seedUtils.Seed;
//# sourceMappingURL=Seed.js.map