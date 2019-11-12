"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validators_1 = require("./validators");
const cancelOrderScheme = {
    sender: validators_1.isPublicKey,
    orderId: validators_1.isHash,
    signature: validators_1.isBase58,
    hash: validators_1.isBase58,
};
exports.cancelOrderValidator = validators_1.validateByShema(cancelOrderScheme, validators_1.getError);
//# sourceMappingURL=cancel-order.js.map