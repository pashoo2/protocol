// TODO - comment next line before run
// import '@types/jest';
import { QueuedEncryptionClassBase } from './queued-encryption-class-base';
import { generateKeyPair } from '../../../utils/data-sign-utils';
import { generateKeyPair as generateEncryptionKeyPair } from '../../../utils/encryption-utils';
import { IQueuedEncrypyionClassBaseOptions } from './queued-encryption-class-base.types';

const asyncQueueOptions = {
  batchSize: 5,
  delayMs: 200,
  promiseTimeout: 1000,
};

describe('QueuedEncryptionClassBase tests', () => {
  const keysOptions = {
    signKey: undefined,
    decryptKey: undefined,
  } as Required<IQueuedEncrypyionClassBaseOptions>['keys'];
  beforeAll(async () => {
    const dataSignKeyPair = await generateKeyPair();
    const dataEncryptionKeyPair = await generateEncryptionKeyPair();

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
});
