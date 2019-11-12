/**
 * @module index
 */
import { IIssueTransaction, IIssueParams, WithId, WithSender } from '../transactions';
import { TSeedTypes } from '../types';
export declare function issue(params: IIssueParams, seed: TSeedTypes): IIssueTransaction & WithId;
export declare function issue(paramsOrTx: IIssueParams & WithSender | IIssueTransaction, seed?: TSeedTypes): IIssueTransaction & WithId;
