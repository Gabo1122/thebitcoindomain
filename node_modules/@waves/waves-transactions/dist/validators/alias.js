"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transactions_1 = require("../transactions");
const validators_1 = require("./validators");
const aliasScheme = {
    type: validators_1.isEq(transactions_1.TRANSACTION_TYPE.ALIAS),
    version: validators_1.orEq([undefined, 2]),
    senderPublicKey: validators_1.isPublicKey,
    alias: validators_1.isValidAliasName,
    fee: validators_1.isNumberLike,
    chainId: validators_1.isNumber,
    timestamp: validators_1.isNumber,
    proofs: validators_1.ifElse(validators_1.isArray, validators_1.defaultValue(true), validators_1.orEq([undefined]))
};
exports.aliasValidator = validators_1.validateByShema(aliasScheme, validators_1.getError);
//# sourceMappingURL=alias.js.map