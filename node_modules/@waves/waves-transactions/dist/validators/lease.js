"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transactions_1 = require("../transactions");
const validators_1 = require("./validators");
const leaseScheme = {
    type: validators_1.isEq(transactions_1.TRANSACTION_TYPE.LEASE),
    version: validators_1.orEq([undefined, 2]),
    senderPublicKey: validators_1.isPublicKey,
    recipient: validators_1.isRecipient,
    amount: validators_1.isNumberLike,
    fee: validators_1.isNumberLike,
    timestamp: validators_1.isNumber,
    proofs: validators_1.ifElse(validators_1.isArray, validators_1.defaultValue(true), validators_1.orEq([undefined]))
};
exports.leaseValidator = validators_1.validateByShema(leaseScheme, validators_1.getError);
//# sourceMappingURL=lease.js.map