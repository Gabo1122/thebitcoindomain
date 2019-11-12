/**
 * @module seedUtils
 */
import { encryptSeed, decryptSeed } from '@waves/ts-lib-crypto';
export declare class Seed {
    readonly phrase: string;
    readonly address: string;
    readonly keyPair: {
        publicKey: string;
        privateKey: string;
    };
    constructor(phrase: string, chainId?: string);
    encrypt(password: string, encryptionRounds?: number): string;
    static encryptSeedPhrase(seedPhrase: string, password: string, encryptionRounds?: number): string;
    static decryptSeedPhrase(encryptedSeedPhrase: string, password: string, encryptionRounds?: number): string;
    static create(words?: number): Seed;
    static fromExistingPhrase(phrase: string): Seed;
}
export declare function generateNewSeed(length?: number): string;
export declare function strengthenPassword(password: string, rounds?: number): string;
export { encryptSeed, decryptSeed };
