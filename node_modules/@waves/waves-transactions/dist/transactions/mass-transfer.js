"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module index
 */
const transactions_1 = require("../transactions");
const generic_1 = require("../generic");
const ts_lib_crypto_1 = require("@waves/ts-lib-crypto");
const marshall_1 = require("@waves/marshall");
const validators_1 = require("../validators");
function massTransfer(paramsOrTx, seed) {
    const type = transactions_1.TRANSACTION_TYPE.MASS_TRANSFER;
    const version = paramsOrTx.version || 1;
    const seedsAndIndexes = generic_1.convertToPairs(seed);
    const senderPublicKey = generic_1.getSenderPublicKey(seedsAndIndexes, paramsOrTx);
    if (!Array.isArray(paramsOrTx.transfers))
        throw new Error('["transfers should be array"]');
    const tx = {
        type,
        version,
        senderPublicKey,
        assetId: generic_1.normalizeAssetId(paramsOrTx.assetId),
        transfers: paramsOrTx.transfers,
        fee: generic_1.fee(paramsOrTx, 100000 + Math.ceil(0.5 * paramsOrTx.transfers.length) * 100000),
        timestamp: paramsOrTx.timestamp || Date.now(),
        attachment: paramsOrTx.attachment || '',
        proofs: paramsOrTx.proofs || [],
        id: '',
    };
    validators_1.validate.massTransfer(tx);
    const bytes = marshall_1.binary.serializeTx(tx);
    seedsAndIndexes.forEach(([s, i]) => generic_1.addProof(tx, ts_lib_crypto_1.signBytes(s, bytes), i));
    tx.id = ts_lib_crypto_1.base58Encode(ts_lib_crypto_1.blake2b(bytes));
    return tx;
}
exports.massTransfer = massTransfer;
//# sourceMappingURL=mass-transfer.js.map