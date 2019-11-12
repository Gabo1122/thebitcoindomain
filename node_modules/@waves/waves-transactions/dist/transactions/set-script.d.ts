/**
 * @module index
 */
import { ISetScriptTransaction, ISetScriptParams, WithId, WithSender } from '../transactions';
import { TSeedTypes } from '../types';
export declare function setScript(params: ISetScriptParams, seed: TSeedTypes): ISetScriptTransaction & WithId;
export declare function setScript(paramsOrTx: ISetScriptParams & WithSender | ISetScriptTransaction, seed?: TSeedTypes): ISetScriptTransaction & WithId;
