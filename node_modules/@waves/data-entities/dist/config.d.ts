import { IAssetInfo } from './entities/Asset';
import { ICandleInfo } from './entities/Candle';
export declare namespace config {
    function get<K extends keyof IConfig>(key: K): IConfig[K];
    function set<K extends keyof IConfig>(key: K, value?: IConfig[K]): void;
    function set(key: Partial<IConfig>): void;
}
export interface IConfig {
    remapAsset: (asset: IAssetInfo) => IAssetInfo;
    remapCandle: (candle: ICandleInfo) => ICandleInfo;
}
