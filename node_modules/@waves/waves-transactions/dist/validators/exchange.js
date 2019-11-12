"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transactions_1 = require("../transactions");
const order_1 = require("./order");
const validators_1 = require("./validators");
const exchangeScheme = {
    type: validators_1.isEq(transactions_1.TRANSACTION_TYPE.EXCHANGE),
    senderPublicKey: validators_1.isPublicKey,
    version: validators_1.orEq([undefined, 0, 1, 2]),
    order1: validators_1.validatePipe(validators_1.isRequired(true), order_1.orderValidator),
    order2: validators_1.validatePipe(validators_1.isRequired(true), order_1.orderValidator),
    amount: validators_1.isNumberLike,
    price: validators_1.isNumberLike,
    buyMatcherFee: validators_1.isNumberLike,
    sellMatcherFee: validators_1.isNumberLike,
    fee: validators_1.isNumberLike,
    timestamp: validators_1.isNumber,
    proofs: validators_1.ifElse(validators_1.isArray, validators_1.defaultValue(true), validators_1.orEq([undefined]))
};
exports.exchangeValidator = validators_1.validateByShema(exchangeScheme, validators_1.getError);
//# sourceMappingURL=exchange.js.map