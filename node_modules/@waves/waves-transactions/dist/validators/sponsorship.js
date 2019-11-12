"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transactions_1 = require("../transactions");
const validators_1 = require("./validators");
const sponsorshipScheme = {
    type: validators_1.isEq(transactions_1.TRANSACTION_TYPE.SPONSORSHIP),
    senderPublicKey: validators_1.isPublicKey,
    version: validators_1.orEq([undefined, 0, 1]),
    assetId: validators_1.isAssetId,
    minSponsoredAssetFee: validators_1.isNumberLike,
    fee: validators_1.isNumberLike,
    timestamp: validators_1.isNumber,
    proofs: validators_1.ifElse(validators_1.isArray, validators_1.defaultValue(true), validators_1.orEq([undefined]))
};
exports.sponsorshipValidator = validators_1.validateByShema(sponsorshipScheme, validators_1.getError);
//# sourceMappingURL=sponsorship.js.map