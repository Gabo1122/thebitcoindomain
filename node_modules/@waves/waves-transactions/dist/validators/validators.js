"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_lib_crypto_1 = require("@waves/ts-lib-crypto");
const TX_DEFAULTS = {
    MAX_ATTACHMENT: 140,
    ALIAS: {
        AVAILABLE_CHARS: '-.0123456789@_abcdefghijklmnopqrstuvwxyz',
        MAX_ALIAS_LENGTH: 30,
        MIN_ALIAS_LENGTH: 4,
    },
};
const ASSETS = {
    NAME_MIN_BYTES: 4,
    NAME_MAX_BYTES: 16,
    DESCRIPTION_MAX_BYTES: 1000,
};
exports.defaultValue = (value) => () => value;
exports.nope = (value) => value;
exports.pipe = (...args) => (value) => args.reduce((acc, cb) => cb(acc), value);
exports.validatePipe = (...args) => (value) => {
    let isValid = true;
    for (const cb of args) {
        isValid = !!cb(value);
        if (!isValid) {
            return false;
        }
    }
    return isValid;
};
exports.prop = (key) => (value) => value ? value[key] : undefined;
exports.lte = (ref) => (value) => ref >= value;
exports.gte = (ref) => (value) => ref <= value;
exports.ifElse = (condition, a, b) => (value) => condition(value) ? a(value) : b(value);
exports.isEq = (reference) => (value) => {
    switch (true) {
        case exports.isNumber(value) && exports.isNumber(reference):
            return Number(value) === Number(reference);
        case exports.isString(value) && exports.isString(reference):
            return String(reference) === String(value);
        case exports.isBoolean(value) && exports.isBoolean(reference):
            return Boolean(value) === Boolean(reference);
        default:
            return reference === value;
    }
};
exports.orEq = (referencesList) => (value) => referencesList.some(exports.isEq(value));
exports.isRequired = (required) => (value) => !required || value != null;
exports.isString = (value) => typeof value === 'string' || value instanceof String;
exports.isNumber = (value) => (typeof value === 'number' || value instanceof Number) && !isNaN(Number(value));
exports.isNumberLike = (value) => value != null && !isNaN(Number(value)) && !!(value || value === 0);
exports.isBoolean = (value) => value != null && (typeof value === 'boolean' || value instanceof Boolean);
exports.isByteArray = (value) => {
    if (!value) {
        return false;
    }
    const bytes = new Uint8Array(value);
    return bytes.length === value.length && bytes.every((val, index) => exports.isEq(val)(value[index]));
};
exports.isArray = (value) => Array.isArray(value);
exports.bytesLength = (length) => (value) => {
    try {
        return Uint8Array.from(value).length === length;
    }
    catch (e) {
        return false;
    }
};
exports.isBase58 = (value) => {
    try {
        ts_lib_crypto_1.base58Decode(value);
    }
    catch (e) {
        return false;
    }
    return true;
};
exports.isBase64 = (value) => {
    try {
        value = value.replace(/^base64:/, '');
        ts_lib_crypto_1.base64Decode(value);
    }
    catch (e) {
        return false;
    }
    return true;
};
exports.isValidAddress = (address, network) => {
    if (typeof address !== 'string' || !exports.isBase58(address)) {
        return false;
    }
    let addressBytes = ts_lib_crypto_1.base58Decode(address);
    if (addressBytes[0] !== 1) {
        return false;
    }
    if (network != null && addressBytes[1] != network) {
        return false;
    }
    let key = addressBytes.slice(0, 22);
    let check = addressBytes.slice(22, 26);
    let keyHash = ts_lib_crypto_1.keccak(ts_lib_crypto_1.blake2b(key)).slice(0, 4);
    for (let i = 0; i < 4; i++) {
        if (check[i] !== keyHash[i]) {
            return false;
        }
    }
    return true;
};
const validateChars = (chars) => (value) => value.split('').every((char) => chars.includes(char));
exports.isValidAliasName = exports.ifElse(validateChars(TX_DEFAULTS.ALIAS.AVAILABLE_CHARS), exports.pipe(exports.prop('length'), exports.validatePipe(exports.lte(TX_DEFAULTS.ALIAS.MAX_ALIAS_LENGTH), exports.gte(TX_DEFAULTS.ALIAS.MIN_ALIAS_LENGTH))), exports.defaultValue(false));
exports.isValidAlias = exports.validatePipe(exports.isString, exports.pipe((value) => value.split(':'), exports.ifElse((value) => value[0] !== 'alias' || value.length !== 3, exports.defaultValue(false), exports.pipe(exports.prop(2), exports.isValidAliasName))));
exports.isHash = exports.validatePipe(exports.isRequired(true), exports.isBase58, exports.pipe((value) => ts_lib_crypto_1.base58Decode(value), exports.bytesLength(32)));
exports.isPublicKey = exports.isHash;
exports.isAssetId = exports.ifElse(exports.orEq(['', null, undefined, 'WAVES']), exports.defaultValue(true), exports.isHash);
exports.isAttachment = exports.ifElse(exports.orEq([null, undefined]), exports.defaultValue(true), exports.pipe(exports.ifElse(exports.isBase58, ts_lib_crypto_1.base58Decode, exports.nope), exports.ifElse(exports.isByteArray, exports.pipe(exports.prop('length'), exports.lte(TX_DEFAULTS.MAX_ATTACHMENT)), exports.defaultValue(false))));
const validateType = {
    integer: exports.isNumberLike,
    boolean: exports.isBoolean,
    string: exports.isString,
    binary: exports.isBase64,
};
exports.isValidDataPair = (data) => !!(validateType[data.type] && validateType[data.type](data.value));
exports.isValidData = exports.validatePipe(exports.isRequired(true), exports.pipe(exports.prop('key'), exports.validatePipe(exports.isString, (key) => !!key)), exports.isValidDataPair);
exports.isValidAssetName = exports.validatePipe(exports.isRequired(true), exports.isString, exports.pipe(ts_lib_crypto_1.stringToBytes, exports.prop('length'), exports.ifElse(exports.gte(ASSETS.NAME_MIN_BYTES), exports.lte(ASSETS.NAME_MAX_BYTES), exports.defaultValue(false))));
exports.isValidAssetDescription = exports.ifElse(exports.isRequired(false), exports.defaultValue(true), exports.pipe(ts_lib_crypto_1.stringToBytes, exports.prop('length'), exports.lte(ASSETS.DESCRIPTION_MAX_BYTES)));
exports.exception = (msg) => {
    throw new Error(msg);
};
exports.isRecipient = exports.ifElse(exports.isValidAddress, exports.defaultValue(true), exports.isValidAlias);
exports.validateByShema = (shema, errorTpl) => (tx) => {
    Object.entries(shema).forEach(([key, cb]) => {
        const value = exports.prop(key)(tx || {});
        if (!cb(value)) {
            exports.exception(errorTpl(key, value));
        }
    });
    return true;
};
exports.getError = (key, value) => {
    return `tx "${key}", has wrong data: ${JSON.stringify(value)}. Check tx data.`;
};
//# sourceMappingURL=validators.js.map