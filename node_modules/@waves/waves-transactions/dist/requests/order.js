"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module index
 */
const ts_lib_crypto_1 = require("@waves/ts-lib-crypto");
const generic_1 = require("../generic");
const marshall_1 = require("@waves/marshall");
const validators_1 = require("../validators");
function order(paramsOrOrder, seed) {
    const amountAsset = generic_1.isOrder(paramsOrOrder) ? paramsOrOrder.assetPair.amountAsset : paramsOrOrder.amountAsset;
    const priceAsset = generic_1.isOrder(paramsOrOrder) ? paramsOrOrder.assetPair.priceAsset : paramsOrOrder.priceAsset;
    const proofs = generic_1.isOrder(paramsOrOrder) ? paramsOrOrder.proofs : [];
    const { matcherFee, matcherPublicKey, price, amount, orderType, expiration, timestamp } = paramsOrOrder;
    const t = timestamp || Date.now();
    const seedsAndIndexes = generic_1.convertToPairs(seed);
    const senderPublicKey = paramsOrOrder.senderPublicKey || generic_1.getSenderPublicKey(seedsAndIndexes, paramsOrOrder);
    // Use old versionless order only if it is set to null explicitly
    const version = paramsOrOrder.version === null ? undefined : paramsOrOrder.version || 2;
    const ord = {
        orderType,
        version,
        assetPair: {
            amountAsset,
            priceAsset,
        },
        price,
        amount,
        timestamp: t,
        expiration: expiration || t + 29 * 24 * 60 * 60 * 1000,
        matcherFee: matcherFee || 300000,
        matcherPublicKey,
        senderPublicKey,
        proofs,
        id: '',
    };
    if (ord.version === 3) {
        ord.matcherFeeAssetId = paramsOrOrder.matcherFeeAssetId === 'WAVES' ? null : paramsOrOrder.matcherFeeAssetId;
    }
    const bytes = marshall_1.binary.serializeOrder(ord);
    seedsAndIndexes.forEach(([s, i]) => generic_1.addProof(ord, ts_lib_crypto_1.signBytes(s, bytes), i));
    validators_1.validate.order(ord);
    ord.id = ts_lib_crypto_1.base58Encode(ts_lib_crypto_1.blake2b(bytes));
    // OrderV1 uses signature instead of proofs
    if (ord.version === undefined || ord.version === 1)
        ord.signature = ord.proofs && ord.proofs[0];
    return ord;
}
exports.order = order;
//# sourceMappingURL=order.js.map