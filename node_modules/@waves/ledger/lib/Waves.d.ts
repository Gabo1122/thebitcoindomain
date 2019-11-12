export declare class Waves {
    protected transport: any;
    protected networkCode: number;
    protected _version: Promise<Array<number>> | null;
    constructor(transport: any, networkCode?: number);
    decorateClassByTransport(): void;
    getWalletPublicKey(path: string, verify?: boolean): Promise<IUserData>;
    signTransaction(path: string, amountPrecession: number, txData: Uint8Array, version?: number): Promise<string>;
    signOrder(path: string, amountPrecession: number, txData: Uint8Array): Promise<string>;
    signSomeData(path: string, msgBuffer: Uint8Array): Promise<string>;
    signRequest(path: string, msgBuffer: Uint8Array): Promise<string>;
    signMessage(path: string, msgBuffer: Uint8Array): Promise<string>;
    getVersion(): Promise<Array<number>>;
    protected _versionNum(): Promise<number>;
    protected _fillData(prefixBuffer: Uint8Array, dataBuffer: Uint8Array, ver2?: number[]): Promise<any>;
    protected _signData(dataBufferAsync: Uint8Array): Promise<string>;
    static checkError(data: Array<number>): {
        error: string;
        status: number;
    } | null;
    static splitPath(path: string): any;
}
export interface IUserData {
    publicKey: string;
    address: string;
    statusCode: string;
}
