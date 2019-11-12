"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validators_1 = require("./validators");
const authScheme = {
    data: validators_1.isString,
    host: validators_1.isString,
};
exports.authValidator = validators_1.validateByShema(authScheme, validators_1.getError);
//# sourceMappingURL=auth.js.map