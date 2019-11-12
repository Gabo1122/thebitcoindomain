"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transactions_1 = require("../transactions");
const validators_1 = require("./validators");
const issueScheme = {
    type: validators_1.isEq(transactions_1.TRANSACTION_TYPE.ISSUE),
    version: validators_1.orEq([undefined, 2]),
    senderPublicKey: validators_1.isPublicKey,
    name: validators_1.isValidAssetName,
    description: validators_1.isValidAssetDescription,
    quantity: validators_1.isNumberLike,
    decimals: validators_1.isNumber,
    reissuable: validators_1.isBoolean,
    script: validators_1.ifElse(validators_1.isRequired(true), validators_1.isBase64, validators_1.defaultValue(true)),
    chainId: validators_1.isNumber,
    fee: validators_1.isNumberLike,
    timestamp: validators_1.isNumber,
    proofs: validators_1.ifElse(validators_1.isArray, validators_1.defaultValue(true), validators_1.orEq([undefined]))
};
exports.issueValidator = validators_1.validateByShema(issueScheme, validators_1.getError);
//# sourceMappingURL=issue.js.map