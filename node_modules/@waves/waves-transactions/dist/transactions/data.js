"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module index
 */
const marshall_1 = require("@waves/marshall");
const { BASE58_STRING, BASE64_STRING, BYTE, BYTES, COUNT, LEN, LONG, SHORT, STRING, } = marshall_1.serializePrimitives;
const ts_lib_crypto_1 = require("@waves/ts-lib-crypto");
const transactions_1 = require("../transactions");
const generic_1 = require("../generic");
const marshall_2 = require("@waves/marshall");
const validators_1 = require("../validators");
const typeMap = {
    integer: ['integer', 0, LONG],
    number: ['integer', 0, LONG],
    boolean: ['boolean', 1, BYTE],
    string: ['string', 3, LEN(SHORT)(STRING)],
    binary: ['binary', 2, (s) => LEN(SHORT)(BASE64_STRING)(s.slice(7))],
    _: ['binary', 2, LEN(SHORT)(BYTES)],
};
const mapType = (value) => typeMap[typeof value] || typeMap['_'];
function data(paramsOrTx, seed) {
    const type = transactions_1.TRANSACTION_TYPE.DATA;
    const version = paramsOrTx.version || 1;
    const seedsAndIndexes = generic_1.convertToPairs(seed);
    const senderPublicKey = generic_1.getSenderPublicKey(seedsAndIndexes, paramsOrTx);
    if (!Array.isArray(paramsOrTx.data))
        throw new Error('["data should be array"]');
    const _timestamp = paramsOrTx.timestamp || Date.now();
    let bytes = ts_lib_crypto_1.concat(BYTE(transactions_1.TRANSACTION_TYPE.DATA), BYTE(1), BASE58_STRING(senderPublicKey), COUNT(SHORT)((x) => ts_lib_crypto_1.concat(LEN(SHORT)(STRING)(x.key), [mapType(x.value)[1]], mapType(x.value)[2](x.value)))(paramsOrTx.data), LONG(_timestamp));
    const computedFee = (Math.floor(1 + (bytes.length + 8 /*feeLong*/ - 1) / 1024) * 100000);
    const tx = {
        type,
        version,
        senderPublicKey,
        fee: generic_1.fee(paramsOrTx, computedFee),
        timestamp: _timestamp,
        proofs: paramsOrTx.proofs || [],
        id: '',
        data: paramsOrTx.data && paramsOrTx.data.map((x) => {
            if (x.type)
                return x;
            else {
                const type = mapType(x.value)[0];
                return {
                    type,
                    key: x.key,
                    value: type === 'binary' ? 'base64:' + Buffer.from(x.value).toString('base64') : x.value,
                };
            }
        }),
    };
    validators_1.validate.data(tx);
    const bytes1 = marshall_2.binary.serializeTx(tx);
    seedsAndIndexes.forEach(([s, i]) => generic_1.addProof(tx, ts_lib_crypto_1.signBytes(s, bytes1), i));
    tx.id = ts_lib_crypto_1.base58Encode(ts_lib_crypto_1.blake2b(bytes1));
    return tx;
}
exports.data = data;
//# sourceMappingURL=data.js.map