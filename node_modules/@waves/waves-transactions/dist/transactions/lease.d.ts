/**
 * @module index
 */
import { ILeaseTransaction, ILeaseParams, WithId, WithSender } from '../transactions';
import { TSeedTypes } from '../types';
export declare function lease(params: ILeaseParams, seed: TSeedTypes): ILeaseTransaction & WithId;
export declare function lease(paramsOrTx: ILeaseParams & WithSender | ILeaseTransaction, seed?: TSeedTypes): ILeaseTransaction & WithId;
