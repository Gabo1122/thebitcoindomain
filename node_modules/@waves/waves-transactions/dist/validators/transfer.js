"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transactions_1 = require("../transactions");
const validators_1 = require("./validators");
const transferScheme = {
    type: validators_1.isEq(transactions_1.TRANSACTION_TYPE.TRANSFER),
    senderPublicKey: validators_1.isPublicKey,
    version: validators_1.orEq([undefined, 2]),
    assetId: validators_1.isAssetId,
    feeAssetId: validators_1.isAssetId,
    recipient: validators_1.isRecipient,
    amount: validators_1.isNumberLike,
    attachment: validators_1.isAttachment,
    fee: validators_1.isNumberLike,
    timestamp: validators_1.isNumber,
    proofs: validators_1.ifElse(validators_1.isArray, validators_1.defaultValue(true), validators_1.orEq([undefined]))
};
exports.transferValidator = validators_1.validateByShema(transferScheme, validators_1.getError);
//# sourceMappingURL=transfer.js.map