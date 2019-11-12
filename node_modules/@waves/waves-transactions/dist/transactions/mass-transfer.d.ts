/**
 * @module index
 */
import { IMassTransferTransaction, IMassTransferParams, WithId, WithSender } from '../transactions';
import { TSeedTypes } from '../types';
export declare function massTransfer(params: IMassTransferParams, seed: TSeedTypes): IMassTransferTransaction & WithId;
export declare function massTransfer(paramsOrTx: IMassTransferParams & WithSender | IMassTransferTransaction, seed?: TSeedTypes): IMassTransferTransaction & WithId;
