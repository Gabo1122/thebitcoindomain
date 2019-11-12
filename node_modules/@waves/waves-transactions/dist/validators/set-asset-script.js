"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transactions_1 = require("../transactions");
const validators_1 = require("./validators");
const setAssetScriptScheme = {
    type: validators_1.isEq(transactions_1.TRANSACTION_TYPE.SET_ASSET_SCRIPT),
    senderPublicKey: validators_1.isPublicKey,
    version: validators_1.orEq([undefined, 0, 1]),
    assetId: validators_1.isAssetId,
    chainId: validators_1.isNumber,
    fee: validators_1.isNumberLike,
    timestamp: validators_1.isNumber,
    script: validators_1.isBase64,
    proofs: validators_1.ifElse(validators_1.isArray, validators_1.defaultValue(true), validators_1.orEq([undefined]))
};
exports.setAssetScriptValidator = validators_1.validateByShema(setAssetScriptScheme, validators_1.getError);
//# sourceMappingURL=set-asset-script.js.map