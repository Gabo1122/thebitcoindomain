import { Asset } from './Asset';
export interface IAssetPairJSON {
    amountAsset: string;
    priceAsset: string;
}
export declare class AssetPair {
    readonly amountAsset: Asset;
    readonly priceAsset: Asset;
    readonly precisionDifference: number;
    constructor(amountAsset: Asset, priceAsset: Asset);
    toJSON(): IAssetPairJSON;
    toString(): string;
    static isAssetPair(object: object): object is AssetPair;
}
