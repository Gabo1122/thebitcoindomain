"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module index
 */
const ts_lib_crypto_1 = require("@waves/ts-lib-crypto");
const marshall_1 = require("@waves/marshall");
const { BASE58_STRING } = marshall_1.serializePrimitives;
const generic_1 = require("../generic");
const validators_1 = require("../validators");
exports.cancelOrderParamsToBytes = (cancelOrderParams) => ts_lib_crypto_1.concat(BASE58_STRING(cancelOrderParams.sender), BASE58_STRING(cancelOrderParams.orderId));
function cancelOrder(params, seed) {
    const seedsAndIndexes = generic_1.convertToPairs(seed);
    const senderPublicKey = params.senderPublicKey || generic_1.getSenderPublicKey(seedsAndIndexes, { senderPublicKey: undefined });
    const bytes = ts_lib_crypto_1.concat(BASE58_STRING(senderPublicKey), BASE58_STRING(params.orderId));
    const signature = params.signature || (seed != null && ts_lib_crypto_1.signBytes(seed, bytes)) || '';
    const hash = ts_lib_crypto_1.base58Encode(ts_lib_crypto_1.blake2b(Uint8Array.from(bytes)));
    const cancelOrderBody = {
        sender: senderPublicKey,
        orderId: params.orderId,
        signature,
        hash
    };
    validators_1.validate.cancelOrder(cancelOrderBody);
    return cancelOrderBody;
}
exports.cancelOrder = cancelOrder;
//# sourceMappingURL=cancel-order.js.map