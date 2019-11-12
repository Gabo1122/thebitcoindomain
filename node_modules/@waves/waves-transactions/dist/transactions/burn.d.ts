/**
 * @module index
 */
import { IBurnTransaction, IBurnParams, WithId, WithSender } from '../transactions';
import { TSeedTypes } from '../types';
export declare function burn(params: IBurnParams, seed: TSeedTypes): IBurnTransaction & WithId;
export declare function burn(paramsOrTx: IBurnParams & WithSender | IBurnTransaction, seed?: TSeedTypes): IBurnTransaction & WithId;
