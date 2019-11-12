"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validators_1 = require("./validators");
const orderScheme = {
    orderType: validators_1.orEq(['sell', 'buy']),
    senderPublicKey: validators_1.isPublicKey,
    matcherPublicKey: validators_1.isPublicKey,
    version: validators_1.orEq([undefined, 0, 1, 2, 3]),
    assetPair: validators_1.validatePipe(validators_1.isRequired(true), validators_1.pipe(validators_1.prop('amountAsset'), validators_1.isAssetId), validators_1.pipe(validators_1.prop('priceAsset'), validators_1.isAssetId)),
    price: validators_1.isNumberLike,
    amount: validators_1.isNumberLike,
    matcherFee: validators_1.isNumberLike,
    expiration: validators_1.isNumberLike,
    timestamp: validators_1.isNumber,
    proofs: validators_1.ifElse(validators_1.isArray, validators_1.defaultValue(true), validators_1.orEq([undefined]))
};
const v1_2_OrderScheme = {
    matcherFeeAssetId: validators_1.orEq([undefined, null, 'WAVES'])
};
const v3_OrderScheme = {
    matcherFeeAssetId: validators_1.isAssetId
};
const validateOrder = validators_1.validateByShema(orderScheme, validators_1.getError);
const validateOrderV2 = validators_1.validateByShema(v1_2_OrderScheme, validators_1.getError);
const validateOrderV3 = validators_1.validateByShema(v3_OrderScheme, validators_1.getError);
exports.orderValidator = validators_1.validatePipe(validateOrder, validators_1.ifElse(validators_1.pipe(validators_1.prop('version'), validators_1.isEq(3)), validateOrderV3, validateOrderV2));
//# sourceMappingURL=order.js.map