"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transactions_1 = require("../transactions");
const validators_1 = require("./validators");
const massTransferScheme = {
    type: validators_1.isEq(transactions_1.TRANSACTION_TYPE.MASS_TRANSFER),
    senderPublicKey: validators_1.isPublicKey,
    version: validators_1.orEq([undefined, 0, 1]),
    transfers: validators_1.validatePipe(validators_1.isArray, validators_1.pipe(validators_1.prop('length'), validators_1.gte(0)), (data) => data.every(validators_1.validatePipe(validators_1.isRequired(true), validators_1.pipe(validators_1.prop('recipient'), validators_1.isRecipient), validators_1.pipe(validators_1.prop('amount'), validators_1.isNumberLike)))),
    assetId: validators_1.isAssetId,
    attachment: validators_1.isAttachment,
    fee: validators_1.isNumberLike,
    timestamp: validators_1.isNumber,
    proofs: validators_1.ifElse(validators_1.isArray, validators_1.defaultValue(true), validators_1.orEq([undefined]))
};
exports.massTransferValidator = validators_1.validateByShema(massTransferScheme, validators_1.getError);
//# sourceMappingURL=mass-transfer.js.map