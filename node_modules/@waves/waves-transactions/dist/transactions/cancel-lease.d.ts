/**
 * @module index
 */
import { ICancelLeaseTransaction, ICancelLeaseParams, WithId, WithSender } from '../transactions';
import { TSeedTypes } from '../types';
export declare function cancelLease(params: ICancelLeaseParams, seed: TSeedTypes): ICancelLeaseTransaction & WithId;
export declare function cancelLease(paramsOrTx: ICancelLeaseParams & WithSender | ICancelLeaseTransaction, seed?: TSeedTypes): ICancelLeaseTransaction & WithId;
