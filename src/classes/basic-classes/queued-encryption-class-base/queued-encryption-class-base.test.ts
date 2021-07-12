// TODO - comment next line before run
// import '@types/jest';
import { QueuedEncryptionClassBase } from './queued-encryption-class-base';
import { IQueuedEncryptionClassBaseOptions } from './queued-encryption-class-base.types';
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
  } as Required<IQueuedEncryptionClassBaseOptions>['keys'];
  beforeAll(async () => {
    const dataSignKeyPair = await dataSignGenerateKeyPair();
    const dataEncryptionKeyPair = await generateKeyPair();

    keysOptions.signKey = dataSignKeyPair.privateKey;
    keysOptions.decryptKey = dataEncryptionKeyPair.privateKey;
  });

  describe('constructor tests', () => {
    it('constructor with no options should no fail', () => {
      expect(() => new QueuedEncryptionClassBase()).not.toThrow();
    });
    it('consrtuctor with keys in options should not fail', () => {
      expect(
        () =>
          new QueuedEncryptionClassBase({
            keys: keysOptions,
          })
      ).not.toThrow();
    });
    it('consrtuctor with sync queue options should not fail', () => {
      expect(
        () =>
          new QueuedEncryptionClassBase({
            queueOptions: asyncQueueOptions,
          })
      ).not.toThrow();
    });
    it('constructor with full options should not fail', () => {
      expect(
        () =>
          new QueuedEncryptionClassBase({
            queueOptions: asyncQueueOptions,
            keys: keysOptions,
          })
      ).not.toThrow();
    });
    it('constructor with wrong keys in options should fail', () => {
      expect(
        () =>
          new QueuedEncryptionClassBase({
            queueOptions: asyncQueueOptions,
            keys: 'wrong keys types',
          } as any)
      ).toThrow();
    });
    it('constructor with wrong queueOptions in options should fail', () => {
      expect(
        () =>
          new QueuedEncryptionClassBase({
            queueOptions: 'wrong queue options',
            keys: keysOptions,
          } as any)
      ).toThrow();
    });
  });

  describe('test data sign', () => {
    let instance: QueuedEncryptionClassBase;
    beforeAll(async () => {
      const keysOptions = {
        signKey: undefined,
        decryptKey: undefined,
      } as Required<IQueuedEncryptionClassBaseOptions>['keys'];
      const dataSignKeyPair = await dataSignGenerateKeyPair();
      const dataEncryptionKeyPair = await generateKeyPair();

      keysOptions.signKey = dataSignKeyPair.privateKey;
      keysOptions.decryptKey = dataEncryptionKeyPair.privateKey;
      instance = new QueuedEncryptionClassBase({
        queueOptions: asyncQueueOptions,
        keys: keysOptions,
      });
    });
    it('sign a string should not failed', async () => {
      await expect(instance.signData(testString)).resolves.toEqual(expect.stringContaining(''));
    });
    it('sign an object should not failed', async () => {
      let result;
      await expect(instance.signData(testObject)).resolves.toEqual(expect.stringContaining(''));
    });
  });
  describe('test data verify', () => {
    let instance: QueuedEncryptionClassBase;
    let dataSignKeyPair: CryptoKeyPair;
    let dataEncryptionKeyPair: CryptoKeyPair;
    beforeAll(async () => {
      const keysOptions = {
        signKey: undefined,
        decryptKey: undefined,
      } as Required<IQueuedEncryptionClassBaseOptions>['keys'];
      dataSignKeyPair = await dataSignGenerateKeyPair();
      dataEncryptionKeyPair = await generateKeyPair();

      keysOptions.signKey = dataSignKeyPair.privateKey;
      keysOptions.decryptKey = dataEncryptionKeyPair.privateKey;
      instance = new QueuedEncryptionClassBase({
        queueOptions: asyncQueueOptions,
        keys: keysOptions,
      });
    });
    it('verify string signed should not failed', async () => {
      const testValue = testString;
      const signature = await instance.signData(testValue);

      expect(signature).not.toEqual(expect.any(Error));
      expect(signature).toEqual(expect.any(String));
      await expect(instance.verifyData(testValue, signature as string, dataSignKeyPair.publicKey)).resolves.toEqual(true);
    });
    it('verify an object signed should not failed', async () => {
      const testValue = testObject;
      const signature = await instance.signData(testValue);

      expect(signature).not.toEqual(expect.any(Error));
      expect(signature).toEqual(expect.any(String));
      await expect(instance.verifyData(testValue, signature as string, dataSignKeyPair.publicKey)).resolves.toEqual(true);
    });
  });

  describe('test data encryption', () => {
    let instance: QueuedEncryptionClassBase;
    let dataSignKeyPair: CryptoKeyPair;
    let dataEncryptionKeyPair: CryptoKeyPair;
    beforeAll(async () => {
      const keysOptions = {
        signKey: undefined,
        decryptKey: undefined,
      } as Required<IQueuedEncryptionClassBaseOptions>['keys'];
      dataSignKeyPair = await dataSignGenerateKeyPair();
      dataEncryptionKeyPair = await generateKeyPair();

      keysOptions.signKey = dataSignKeyPair.privateKey;
      keysOptions.decryptKey = dataEncryptionKeyPair.privateKey;
      instance = new QueuedEncryptionClassBase({
        queueOptions: asyncQueueOptions,
        keys: keysOptions,
      });
    });

    test('encrypt string should not failed', async () => {
      await expect(instance.encryptData(testString, dataEncryptionKeyPair.publicKey)).resolves.toEqual(expect.stringMatching(''));
    });
    test('encrypt object should not failed', async () => {
      await expect(instance.encryptData(testObject, dataEncryptionKeyPair.publicKey)).resolves.toEqual(expect.stringMatching(''));
    });
  });

  describe('test data decryption', () => {
    let instance: QueuedEncryptionClassBase;
    let dataSignKeyPair: CryptoKeyPair;
    let dataEncryptionKeyPair: CryptoKeyPair;
    beforeAll(async () => {
      const keysOptions = {
        signKey: undefined,
        decryptKey: undefined,
      } as Required<IQueuedEncryptionClassBaseOptions>['keys'];
      dataSignKeyPair = await dataSignGenerateKeyPair();
      dataEncryptionKeyPair = await generateKeyPair();

      keysOptions.signKey = dataSignKeyPair.privateKey;
      keysOptions.decryptKey = dataEncryptionKeyPair.privateKey;
      instance = new QueuedEncryptionClassBase({
        queueOptions: asyncQueueOptions,
        keys: keysOptions,
      });
    });

    test('decrypt string should not failed', async () => {
      const encryptedString = await instance.encryptData(testString, dataEncryptionKeyPair.publicKey);

      expect(encryptedString).toEqual(expect.stringMatching(''));
      await expect(instance.decryptData(encryptedString as string, dataEncryptionKeyPair.privateKey)).resolves.toEqual(
        testString
      );
    });
    test('decrypt object should not failed', async () => {
      const encryptedObject = await instance.encryptData(testObject, dataEncryptionKeyPair.publicKey);

      expect(encryptedObject).toEqual(expect.stringMatching(''));
      const decryptedObject = await instance.decryptData(encryptedObject as string, dataEncryptionKeyPair.privateKey);
      expect(JSON.parse(decryptedObject as any)).toEqual(testObject);
    });
  });
});
