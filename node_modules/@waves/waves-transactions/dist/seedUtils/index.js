"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module seedUtils
 */
const ts_lib_crypto_1 = require("@waves/ts-lib-crypto");
exports.encryptSeed = ts_lib_crypto_1.encryptSeed;
exports.decryptSeed = ts_lib_crypto_1.decryptSeed;
const marshall_1 = require("@waves/marshall");
class Seed {
    constructor(phrase, chainId) {
        if (phrase.length < 12) {
            throw new Error('Your seed length is less than allowed in config');
        }
        this.phrase = phrase;
        this.address = ts_lib_crypto_1.address(phrase, chainId);
        this.keyPair = {
            privateKey: ts_lib_crypto_1.privateKey(phrase),
            publicKey: ts_lib_crypto_1.publicKey(phrase),
        };
        Object.freeze(this);
        Object.freeze(this.keyPair);
    }
    encrypt(password, encryptionRounds) {
        return Seed.encryptSeedPhrase(this.phrase, password, encryptionRounds);
    }
    static encryptSeedPhrase(seedPhrase, password, encryptionRounds = 5000) {
        if (password && password.length < 8) {
            // logger.warn('Your password may be too weak');
        }
        if (encryptionRounds < 1000) {
            // logger.warn('Encryption rounds may be too few');
        }
        if (seedPhrase.length < 12) {
            throw new Error('The seed phrase you are trying to encrypt is too short');
        }
        return ts_lib_crypto_1.encryptSeed(seedPhrase, password, encryptionRounds);
    }
    static decryptSeedPhrase(encryptedSeedPhrase, password, encryptionRounds = 5000) {
        const wrongPasswordMessage = 'The password is wrong';
        let phrase;
        try {
            phrase = ts_lib_crypto_1.decryptSeed(encryptedSeedPhrase, password, encryptionRounds);
        }
        catch (e) {
            throw new Error(wrongPasswordMessage);
        }
        if (phrase === '' || phrase.length < 12) {
            throw new Error(wrongPasswordMessage);
        }
        return phrase;
    }
    static create(words = 15) {
        const phrase = generateNewSeed(words);
        const minimumSeedLength = 12;
        if (phrase.length < minimumSeedLength) {
            // If you see that error you should increase the number of words in the generated seed
            throw new Error(`The resulted seed length is less than the minimum length (${minimumSeedLength})`);
        }
        return new Seed(phrase);
    }
    static fromExistingPhrase(phrase) {
        const minimumSeedLength = 12;
        if (phrase.length < minimumSeedLength) {
            // If you see that error you should increase the number of words or set it lower in the config
            throw new Error(`The resulted seed length is less than the minimum length (${minimumSeedLength})`);
        }
        return new Seed(phrase);
    }
}
exports.Seed = Seed;
function generateNewSeed(length = 15) {
    return ts_lib_crypto_1.randomSeed(length);
}
exports.generateNewSeed = generateNewSeed;
function strengthenPassword(password, rounds = 5000) {
    while (rounds--) {
        const bytes = marshall_1.serializePrimitives.STRING(password);
        password = ts_lib_crypto_1.base16Encode(ts_lib_crypto_1.sha256(bytes));
    }
    return password;
}
exports.strengthenPassword = strengthenPassword;
//# sourceMappingURL=index.js.map