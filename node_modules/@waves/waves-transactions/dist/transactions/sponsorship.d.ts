/**
 * @module index
 */
import { WithId, WithSender, ISponsorshipParams, ISponsorshipTransaction } from '../transactions';
import { TSeedTypes } from '../types';
export declare function sponsorship(params: ISponsorshipParams, seed: TSeedTypes): ISponsorshipTransaction & WithId;
export declare function sponsorship(paramsOrTx: ISponsorshipParams & WithSender | ISponsorshipTransaction, seed?: TSeedTypes): ISponsorshipTransaction & WithId;
