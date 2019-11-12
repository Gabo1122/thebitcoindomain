/**
 * @module index
 */
import { ITransferTransaction, ITransferParams, WithId, WithSender } from '../transactions';
import { TSeedTypes } from '../types';
export declare function transfer(params: ITransferParams, seed: TSeedTypes): ITransferTransaction & WithId;
export declare function transfer(paramsOrTx: ITransferParams & WithSender | ITransferTransaction, seed?: TSeedTypes): ITransferTransaction & WithId;
