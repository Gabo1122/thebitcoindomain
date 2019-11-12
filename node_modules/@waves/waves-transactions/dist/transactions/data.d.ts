import { IDataTransaction, IDataParams, WithId, WithSender } from '../transactions';
import { TSeedTypes } from '../types';
export declare function data(params: IDataParams, seed: TSeedTypes): IDataTransaction & WithId;
export declare function data(paramsOrTx: IDataParams & WithSender | IDataTransaction, seed?: TSeedTypes): IDataTransaction & WithId;
