/**
 * @module index
 */
import { ISetAssetScriptTransaction, ISetAssetScriptParams, WithId, WithSender } from '../transactions';
import { TSeedTypes } from '../types';
export declare function setAssetScript(params: ISetAssetScriptParams, seed: TSeedTypes): ISetAssetScriptTransaction & WithId;
export declare function setAssetScript(paramsOrTx: ISetAssetScriptParams & WithSender | ISetAssetScriptTransaction, seed?: TSeedTypes): ISetAssetScriptTransaction & WithId;
