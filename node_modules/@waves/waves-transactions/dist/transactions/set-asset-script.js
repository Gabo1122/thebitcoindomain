"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module index
 */
const transactions_1 = require("../transactions");
const ts_lib_crypto_1 = require("@waves/ts-lib-crypto");
const generic_1 = require("../generic");
const marshall_1 = require("@waves/marshall");
const validators_1 = require("../validators");
function setAssetScript(paramsOrTx, seed) {
    const type = transactions_1.TRANSACTION_TYPE.SET_ASSET_SCRIPT;
    const version = paramsOrTx.version || 1;
    const seedsAndIndexes = generic_1.convertToPairs(seed);
    const senderPublicKey = generic_1.getSenderPublicKey(seedsAndIndexes, paramsOrTx);
    if (paramsOrTx.script == null)
        throw new Error('Asset script cannot be empty');
    const tx = {
        type,
        version,
        senderPublicKey,
        assetId: paramsOrTx.assetId,
        chainId: generic_1.networkByte(paramsOrTx.chainId, 87),
        fee: generic_1.fee(paramsOrTx, 100000000),
        timestamp: paramsOrTx.timestamp || Date.now(),
        proofs: paramsOrTx.proofs || [],
        id: '',
        script: generic_1.base64Prefix(paramsOrTx.script),
    };
    validators_1.validate.setAssetScript(tx);
    const bytes = marshall_1.binary.serializeTx(tx);
    seedsAndIndexes.forEach(([s, i]) => generic_1.addProof(tx, ts_lib_crypto_1.signBytes(s, bytes), i));
    tx.id = ts_lib_crypto_1.base58Encode(ts_lib_crypto_1.blake2b(bytes));
    return tx;
}
exports.setAssetScript = setAssetScript;
//# sourceMappingURL=set-asset-script.js.map