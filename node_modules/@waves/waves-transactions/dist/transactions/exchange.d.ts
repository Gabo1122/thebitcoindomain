/**
 * @module index
 */
import { IExchangeTransaction, WithId } from '../transactions';
import { TSeedTypes } from '../types';
export declare function exchange(paramsOrTx: IExchangeTransaction, seed?: TSeedTypes): IExchangeTransaction & WithId;
