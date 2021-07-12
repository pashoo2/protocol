import { __awaiter } from "tslib";
import { QueuedEncryptionClassBase } from './queued-encryption-class-base';
import { dataSignGenerateKeyPair, generateKeyPair } from '@pashoo2/crypto-utilities';
const testString = '!@#$%^&&**())_)(*&%%{}|?><,.eowiroidfhjklhs121шфыво';
const asyncQueueOptions = {
    batchSize: 5,
    delayMs: 200,
    promiseTimeout: 1000,
};
const testObject = {
    hello: 123456789999,
    g: testString,
    e: {
        it: 'nested',
    },
};
describe('QueuedEncryptionClassBase tests', () => {
    const keysOptions = {
        signKey: undefined,
        decryptKey: undefined,
    };
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const dataSignKeyPair = yield dataSignGenerateKeyPair();
        const dataEncryptionKeyPair = yield generateKeyPair();
        keysOptions.signKey = dataSignKeyPair.privateKey;
        keysOptions.decryptKey = dataEncryptionKeyPair.privateKey;
    }));
    describe('constructor tests', () => {
        it('constructor with no options should no fail', () => {
            expect(() => new QueuedEncryptionClassBase()).not.toThrow();
        });
        it('consrtuctor with keys in options should not fail', () => {
            expect(() => new QueuedEncryptionClassBase({
                keys: keysOptions,
            })).not.toThrow();
        });
        it('consrtuctor with sync queue options should not fail', () => {
            expect(() => new QueuedEncryptionClassBase({
                queueOptions: asyncQueueOptions,
            })).not.toThrow();
        });
        it('constructor with full options should not fail', () => {
            expect(() => new QueuedEncryptionClassBase({
                queueOptions: asyncQueueOptions,
                keys: keysOptions,
            })).not.toThrow();
        });
        it('constructor with wrong keys in options should fail', () => {
            expect(() => new QueuedEncryptionClassBase({
                queueOptions: asyncQueueOptions,
                keys: 'wrong keys types',
            })).toThrow();
        });
        it('constructor with wrong queueOptions in options should fail', () => {
            expect(() => new QueuedEncryptionClassBase({
                queueOptions: 'wrong queue options',
                keys: keysOptions,
            })).toThrow();
        });
    });
    describe('test data sign', () => {
        let instance;
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            const keysOptions = {
                signKey: undefined,
                decryptKey: undefined,
            };
            const dataSignKeyPair = yield dataSignGenerateKeyPair();
            const dataEncryptionKeyPair = yield generateKeyPair();
            keysOptions.signKey = dataSignKeyPair.privateKey;
            keysOptions.decryptKey = dataEncryptionKeyPair.privateKey;
            instance = new QueuedEncryptionClassBase({
                queueOptions: asyncQueueOptions,
                keys: keysOptions,
            });
        }));
        it('sign a string should not failed', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect(instance.signData(testString)).resolves.toEqual(expect.stringContaining(''));
        }));
        it('sign an object should not failed', () => __awaiter(void 0, void 0, void 0, function* () {
            let result;
            yield expect(instance.signData(testObject)).resolves.toEqual(expect.stringContaining(''));
        }));
    });
    describe('test data verify', () => {
        let instance;
        let dataSignKeyPair;
        let dataEncryptionKeyPair;
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            const keysOptions = {
                signKey: undefined,
                decryptKey: undefined,
            };
            dataSignKeyPair = yield dataSignGenerateKeyPair();
            dataEncryptionKeyPair = yield generateKeyPair();
            keysOptions.signKey = dataSignKeyPair.privateKey;
            keysOptions.decryptKey = dataEncryptionKeyPair.privateKey;
            instance = new QueuedEncryptionClassBase({
                queueOptions: asyncQueueOptions,
                keys: keysOptions,
            });
        }));
        it('verify string signed should not failed', () => __awaiter(void 0, void 0, void 0, function* () {
            const testValue = testString;
            const signature = yield instance.signData(testValue);
            expect(signature).not.toEqual(expect.any(Error));
            expect(signature).toEqual(expect.any(String));
            yield expect(instance.verifyData(testValue, signature, dataSignKeyPair.publicKey)).resolves.toEqual(true);
        }));
        it('verify an object signed should not failed', () => __awaiter(void 0, void 0, void 0, function* () {
            const testValue = testObject;
            const signature = yield instance.signData(testValue);
            expect(signature).not.toEqual(expect.any(Error));
            expect(signature).toEqual(expect.any(String));
            yield expect(instance.verifyData(testValue, signature, dataSignKeyPair.publicKey)).resolves.toEqual(true);
        }));
    });
    describe('test data encryption', () => {
        let instance;
        let dataSignKeyPair;
        let dataEncryptionKeyPair;
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            const keysOptions = {
                signKey: undefined,
                decryptKey: undefined,
            };
            dataSignKeyPair = yield dataSignGenerateKeyPair();
            dataEncryptionKeyPair = yield generateKeyPair();
            keysOptions.signKey = dataSignKeyPair.privateKey;
            keysOptions.decryptKey = dataEncryptionKeyPair.privateKey;
            instance = new QueuedEncryptionClassBase({
                queueOptions: asyncQueueOptions,
                keys: keysOptions,
            });
        }));
        test('encrypt string should not failed', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect(instance.encryptData(testString, dataEncryptionKeyPair.publicKey)).resolves.toEqual(expect.stringMatching(''));
        }));
        test('encrypt object should not failed', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect(instance.encryptData(testObject, dataEncryptionKeyPair.publicKey)).resolves.toEqual(expect.stringMatching(''));
        }));
    });
    describe('test data decryption', () => {
        let instance;
        let dataSignKeyPair;
        let dataEncryptionKeyPair;
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            const keysOptions = {
                signKey: undefined,
                decryptKey: undefined,
            };
            dataSignKeyPair = yield dataSignGenerateKeyPair();
            dataEncryptionKeyPair = yield generateKeyPair();
            keysOptions.signKey = dataSignKeyPair.privateKey;
            keysOptions.decryptKey = dataEncryptionKeyPair.privateKey;
            instance = new QueuedEncryptionClassBase({
                queueOptions: asyncQueueOptions,
                keys: keysOptions,
            });
        }));
        test('decrypt string should not failed', () => __awaiter(void 0, void 0, void 0, function* () {
            const encryptedString = yield instance.encryptData(testString, dataEncryptionKeyPair.publicKey);
            expect(encryptedString).toEqual(expect.stringMatching(''));
            yield expect(instance.decryptData(encryptedString, dataEncryptionKeyPair.privateKey)).resolves.toEqual(testString);
        }));
        test('decrypt object should not failed', () => __awaiter(void 0, void 0, void 0, function* () {
            const encryptedObject = yield instance.encryptData(testObject, dataEncryptionKeyPair.publicKey);
            expect(encryptedObject).toEqual(expect.stringMatching(''));
            const decryptedObject = yield instance.decryptData(encryptedObject, dataEncryptionKeyPair.privateKey);
            expect(JSON.parse(decryptedObject)).toEqual(testObject);
        }));
    });
});
//# sourceMappingURL=queued-encryption-class-base.test.js.map