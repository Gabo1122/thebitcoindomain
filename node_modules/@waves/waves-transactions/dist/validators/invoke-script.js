"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transactions_1 = require("../transactions");
const validators_1 = require("./validators");
const invokeScheme = {
    type: validators_1.isEq(transactions_1.TRANSACTION_TYPE.INVOKE_SCRIPT),
    senderPublicKey: validators_1.isPublicKey,
    version: validators_1.orEq([undefined, 0, 1]),
    dApp: validators_1.isRecipient,
    call: validators_1.ifElse(validators_1.isRequired(false), validators_1.defaultValue(true), validators_1.validatePipe(validators_1.pipe(validators_1.prop('function'), validators_1.isString), validators_1.pipe(validators_1.prop('function'), validators_1.prop('length'), validators_1.gte(0)), validators_1.pipe(validators_1.prop('args'), validators_1.isArray), (data) => data.every(validators_1.validatePipe(validators_1.isRequired(true), validators_1.isValidDataPair)))),
    payment: validators_1.validatePipe(validators_1.isArray, (data) => data.every(validators_1.validatePipe(validators_1.pipe(validators_1.prop('amount'), validators_1.isNumberLike), validators_1.pipe(validators_1.prop('assetId'), validators_1.isAssetId)))),
    fee: validators_1.isNumberLike,
    feeAssetId: validators_1.isAssetId,
    chainId: validators_1.isNumber,
    timestamp: validators_1.isNumber,
    proofs: validators_1.ifElse(validators_1.isArray, validators_1.defaultValue(true), validators_1.orEq([undefined]))
};
exports.invokeValidator = validators_1.validateByShema(invokeScheme, validators_1.getError);
// const tx: IInvokeScriptTransaction & WithId = {
//   call: paramsOrTx.call && {args: [], ...paramsOrTx.call},
//   payment: mapPayment(paramsOrTx.payment),
// }
//# sourceMappingURL=invoke-script.js.map