"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transactions_1 = require("../transactions");
const validators_1 = require("./validators");
const setScriptScheme = {
    type: validators_1.isEq(transactions_1.TRANSACTION_TYPE.SET_SCRIPT),
    senderPublicKey: validators_1.isPublicKey,
    version: validators_1.orEq([undefined, 0, 1]),
    chainId: validators_1.isNumber,
    fee: validators_1.isNumberLike,
    timestamp: validators_1.isNumber,
    script: validators_1.ifElse(validators_1.isEq(null), validators_1.defaultValue(true), validators_1.isBase64),
    proofs: validators_1.ifElse(validators_1.isArray, validators_1.defaultValue(true), validators_1.orEq([undefined]))
};
exports.setScriptValidator = validators_1.validateByShema(setScriptScheme, validators_1.getError);
//# sourceMappingURL=set-script.js.map