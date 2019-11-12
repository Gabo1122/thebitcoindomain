/**
 * @module index
 */
import { WithId, WithSender, IInvokeScriptParams, IInvokeScriptTransaction } from '../transactions';
import { TSeedTypes } from '../types';
export declare function invokeScript(params: IInvokeScriptParams, seed: TSeedTypes): IInvokeScriptTransaction & WithId;
export declare function invokeScript(paramsOrTx: IInvokeScriptParams & WithSender | IInvokeScriptTransaction, seed?: TSeedTypes): IInvokeScriptTransaction & WithId;
