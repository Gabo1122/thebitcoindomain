"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module index
 */
const transactions_1 = require("../transactions");
const marshall_1 = require("@waves/marshall");
const ts_lib_crypto_1 = require("@waves/ts-lib-crypto");
const generic_1 = require("../generic");
const validators_1 = require("../validators");
function alias(paramsOrTx, seed) {
    const type = transactions_1.TRANSACTION_TYPE.ALIAS;
    const version = paramsOrTx.version || 2;
    const seedsAndIndexes = generic_1.convertToPairs(seed);
    const senderPublicKey = generic_1.getSenderPublicKey(seedsAndIndexes, paramsOrTx);
    const tx = {
        type,
        version,
        senderPublicKey,
        alias: paramsOrTx.alias,
        fee: generic_1.fee(paramsOrTx, 100000),
        timestamp: paramsOrTx.timestamp || Date.now(),
        chainId: generic_1.networkByte(paramsOrTx.chainId, 87),
        proofs: paramsOrTx.proofs || [],
        id: '',
    };
    validators_1.validate.alias(tx);
    const bytes = marshall_1.binary.serializeTx(tx);
    seedsAndIndexes.forEach(([s, i]) => generic_1.addProof(tx, ts_lib_crypto_1.signBytes(s, bytes), i));
    const idBytes = [bytes[0], ...bytes.slice(36, -16)];
    tx.id = ts_lib_crypto_1.base58Encode(ts_lib_crypto_1.blake2b(Uint8Array.from(idBytes)));
    return tx;
}
exports.alias = alias;
//# sourceMappingURL=alias.js.map