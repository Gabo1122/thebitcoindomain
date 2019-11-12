"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transactions_1 = require("../transactions");
const validators_1 = require("./validators");
const dataScheme = {
    type: validators_1.isEq(transactions_1.TRANSACTION_TYPE.DATA),
    senderPublicKey: validators_1.isPublicKey,
    version: validators_1.orEq([undefined, 0, 1]),
    data: (data) => validators_1.isArray(data) &&
        data.every(item => validators_1.isValidData(item)),
    fee: validators_1.isNumberLike,
    timestamp: validators_1.isNumber,
    proofs: validators_1.ifElse(validators_1.isArray, validators_1.defaultValue(true), validators_1.orEq([undefined]))
};
exports.dataValidator = validators_1.validateByShema(dataScheme, validators_1.getError);
//# sourceMappingURL=data.js.map