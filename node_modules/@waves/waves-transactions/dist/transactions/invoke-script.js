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
function invokeScript(paramsOrTx, seed) {
    const type = transactions_1.TRANSACTION_TYPE.INVOKE_SCRIPT;
    const version = paramsOrTx.version || 1;
    const seedsAndIndexes = generic_1.convertToPairs(seed);
    const senderPublicKey = generic_1.getSenderPublicKey(seedsAndIndexes, paramsOrTx);
    const tx = {
        type,
        version,
        senderPublicKey,
        dApp: paramsOrTx.dApp,
        call: paramsOrTx.call && Object.assign({ args: [] }, paramsOrTx.call),
        payment: mapPayment(paramsOrTx.payment),
        fee: generic_1.fee(paramsOrTx, 500000),
        feeAssetId: generic_1.normalizeAssetId(paramsOrTx.feeAssetId),
        timestamp: paramsOrTx.timestamp || Date.now(),
        chainId: generic_1.networkByte(paramsOrTx.chainId, 87),
        proofs: paramsOrTx.proofs || [],
        id: '',
    };
    validators_1.validate.invokeScript(tx);
    const bytes = marshall_1.binary.serializeTx(tx);
    seedsAndIndexes.forEach(([s, i]) => generic_1.addProof(tx, ts_lib_crypto_1.signBytes(s, bytes), i));
    tx.id = ts_lib_crypto_1.base58Encode(ts_lib_crypto_1.base58Encode(ts_lib_crypto_1.blake2b(bytes)));
    return tx;
}
exports.invokeScript = invokeScript;
const mapPayment = (payments) => payments == null
    ? []
    : payments.map(pmt => (Object.assign({}, pmt, { assetId: pmt.assetId === 'WAVES' ? null : pmt.assetId })));
//# sourceMappingURL=invoke-script.js.map