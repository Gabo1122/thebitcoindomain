import { BigNumber } from './BigNumber';
import ROUND_MODE = BigNumber.ROUND_MODE;
export declare class Config {
    private static DEFAULT_FORMAT;
    private format;
    constructor();
    set(configPart: Partial<IConfig>): void;
}
export interface IConfig {
    ROUNDING_MODE: ROUND_MODE;
    FORMAT: Partial<IFormat>;
}
export interface IFormat {
    prefix: string;
    decimalSeparator: string;
    groupSeparator: string;
    groupSize: number;
    secondaryGroupSize: number;
    fractionGroupSeparator: string;
    fractionGroupSize: number;
    suffix: string;
}
