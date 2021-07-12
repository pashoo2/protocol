import { isCryptoKeyDataEncryption, isCryptoKeyDataDecryption, encryptToString, decryptData, isCryptoKeyDataSign, isCryptoKeyDataVerify, signToString, verifyData, } from '@pashoo2/crypto-utilities';
import { AsyncQueueClassBase } from '../async-queue-class-base';
export class QueuedEncryptionClassBase {
    constructor(options) {
        this.defaultKeys = {};
        this.asyncQueue = new AsyncQueueClassBase();
        this.encryptData = (data, key) => {
            if (key && !isCryptoKeyDataEncryption(key)) {
                return Promise.resolve(new Error('Crypto key is not the valid key for data encryption'));
            }
            const keyToUse = key || this.defaultKeys.encryptKey;
            if (!keyToUse) {
                return Promise.resolve(new Error('A key must be provided because there is no default key defined for the instance'));
            }
            return this.addInQueue(() => encryptToString(keyToUse, data));
        };
        this.decryptData = (data, key) => {
            if (key && !isCryptoKeyDataDecryption(key)) {
                return Promise.resolve(new Error('Crypto key is not the valid key for data encryption'));
            }
            const keyToUse = key || this.defaultKeys.decryptKey;
            if (!keyToUse) {
                return Promise.resolve(new Error('A key must be provided cause there is no default key was set'));
            }
            return this.addInQueue(() => decryptData(keyToUse, data));
        };
        this.signData = (data, key) => {
            if (key && !isCryptoKeyDataSign(key)) {
                return Promise.resolve(new Error('Crypto key is not the valid key for data encryption'));
            }
            const keyToUse = key || this.defaultKeys.signKey;
            if (!keyToUse) {
                return Promise.resolve(new Error('A key must be provided cause there is no default key was set'));
            }
            return this.addInQueue(() => signToString(keyToUse, data));
        };
        this.verifyData = (data, signature, key) => {
            if (!isCryptoKeyDataVerify(key)) {
                return Promise.resolve(new Error('A crypto key must provide a data verification functionality'));
            }
            return this.addInQueue(() => verifyData(key, data, signature));
        };
        this.setOptions(options);
        return this;
    }
    startAsyncQueue(options) {
        this.asyncQueue = new AsyncQueueClassBase(options);
    }
    setOptions(options) {
        if (options && typeof options === 'object') {
            const { keys, queueOptions } = options;
            if (keys) {
                if (typeof keys !== 'object') {
                    throw new Error('Keys must be an object');
                }
                const { decryptKey, encryptKey, signKey } = keys;
                if (decryptKey) {
                    if (!isCryptoKeyDataDecryption(decryptKey)) {
                        throw new Error('The decryptKey option must be a CryptoKey');
                    }
                    this.defaultKeys.decryptKey = decryptKey;
                }
                if (encryptKey) {
                    if (!isCryptoKeyDataEncryption(encryptKey)) {
                        throw new Error('Crypto key is not the valid key for data encryption');
                    }
                    this.defaultKeys.encryptKey = encryptKey;
                }
                if (signKey) {
                    if (!isCryptoKeyDataSign(signKey)) {
                        throw new Error('The decryptKey option must be a CryptoKey');
                    }
                    this.defaultKeys.signKey = signKey;
                }
            }
            this.startAsyncQueue(queueOptions);
        }
    }
    addInQueue(cb) {
        return this.asyncQueue.do(cb);
    }
}
//# sourceMappingURL=queued-encryption-class-base.js.map