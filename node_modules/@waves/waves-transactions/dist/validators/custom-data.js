"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validators_1 = require("./validators");
const customDataV1Scheme = {
    version: validators_1.isEq(1),
    binary: validators_1.isBase64
};
const customDataV2Scheme = {
    version: validators_1.isEq(2),
    data: validators_1.validatePipe(validators_1.isArray, (data) => data.every(validators_1.validatePipe(validators_1.isRequired(true), validators_1.isValidDataPair)))
};
const v1Validator = validators_1.validateByShema(customDataV1Scheme, validators_1.getError);
const v2Validator = validators_1.validateByShema(customDataV2Scheme, validators_1.getError);
exports.customDataValidator = validators_1.ifElse(validators_1.pipe(validators_1.prop('version'), validators_1.isEq(1)), v1Validator, v2Validator);
//# sourceMappingURL=custom-data.js.map