/**
 * @module index
 */
import { IAliasParams, IAliasTransaction, WithId, WithSender } from '../transactions';
import { TSeedTypes } from '../types';
export declare function alias(params: IAliasParams, seed: TSeedTypes): IAliasTransaction & WithId;
export declare function alias(paramsOrTx: IAliasParams & WithSender | IAliasTransaction, seed?: TSeedTypes): IAliasTransaction & WithId;
