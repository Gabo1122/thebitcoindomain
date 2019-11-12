/**
 * @module index
 */
import { IReissueTransaction, IReissueParams, WithId, WithSender } from '../transactions';
import { TSeedTypes } from '../types';
export declare function reissue(paramsOrTx: IReissueParams, seed: TSeedTypes): IReissueTransaction & WithId;
export declare function reissue(paramsOrTx: IReissueParams & WithSender | IReissueTransaction, seed?: TSeedTypes): IReissueTransaction & WithId;
