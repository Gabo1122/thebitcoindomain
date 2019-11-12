import { IAuthParams, IAuth } from '../transactions';
export declare const serializeAuthData: (auth: {
    host: string;
    data: string;
}) => Uint8Array;
export declare function auth(params: IAuthParams, seed?: string, chainId?: string | number): IAuth;
