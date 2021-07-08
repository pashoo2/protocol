import {
  TCryptoUtilEncryptDataTypes,
  TCryptoUtilDecryptDataTypes,
  isCryptoKeyDataEncryption,
  isCryptoKeyDataDecryption,
  encryptToString,
  decryptData,
  TDataSignUtilSignDataTypes,
  TDataSignUtilVerifyDataTypes,
  TDataSignUtilVerifyDataTypesExtended,
  isCryptoKeyDataSign,
  isCryptoKeyDataVerify,
  signToString,
  verifyData,
} from '@pashoo2/crypto-utilities';
import { AsyncQueueClassBase } from '../async-queue-class-base/async-queue-class-base';
import { IAsyncQueueBaseClassOptions } from '../async-queue-class-base/async-queue-class-base.types';
import { IQueuedEncryptionClassBase } from './queued-encryption-class-base.types';
import { IQueuedEncryptionClassBaseOptions } from './queued-encryption-class-base.types';

export class QueuedEncryptionClassBase implements IQueuedEncryptionClassBase {
  protected defaultKeys: Required<IQueuedEncryptionClassBaseOptions>['keys'] = {};

  protected asyncQueue = new AsyncQueueClassBase();

  constructor(options?: IQueuedEncryptionClassBaseOptions) {
    this.setOptions(options);
    return this;
  }

  public encryptData = (data: TCryptoUtilEncryptDataTypes, key?: CryptoKey): Promise<string | Error> => {
    if (key && !isCryptoKeyDataEncryption(key)) {
      return Promise.resolve(new Error('Crypto key is not the valid key for data encryption'));
    }

    const keyToUse = key || this.defaultKeys.encryptKey;

    if (!keyToUse) {
      return Promise.resolve(new Error('A key must be provided because there is no default key defined for the instance'));
    }
    return this.addInQueue(() => encryptToString(keyToUse, data));
  };

  public decryptData = (data: TCryptoUtilDecryptDataTypes, key?: CryptoKey): Promise<string | Error> => {
    if (key && !isCryptoKeyDataDecryption(key)) {
      return Promise.resolve(new Error('Crypto key is not the valid key for data encryption'));
    }

    const keyToUse = key || this.defaultKeys.decryptKey;

    if (!keyToUse) {
      return Promise.resolve(new Error('A key must be provided cause there is no default key was set'));
    }
    return this.addInQueue(() => decryptData(keyToUse, data));
  };

  public signData = (data: TDataSignUtilSignDataTypes, key?: CryptoKey): Promise<string | Error> => {
    if (key && !isCryptoKeyDataSign(key)) {
      return Promise.resolve(new Error('Crypto key is not the valid key for data encryption'));
    }

    const keyToUse = key || this.defaultKeys.signKey;

    if (!keyToUse) {
      return Promise.resolve(new Error('A key must be provided cause there is no default key was set'));
    }
    return this.addInQueue(() => signToString(keyToUse, data));
  };

  public verifyData = (
    data: TDataSignUtilVerifyDataTypesExtended,
    signature: TDataSignUtilVerifyDataTypes,
    key: CryptoKey
  ): Promise<boolean | Error> => {
    if (!isCryptoKeyDataVerify(key)) {
      return Promise.resolve(new Error('A crypto key must provide a data verification functionality'));
    }
    return this.addInQueue(() => verifyData(key, data, signature));
  };

  protected startAsyncQueue(options?: IAsyncQueueBaseClassOptions) {
    this.asyncQueue = new AsyncQueueClassBase(options);
  }

  /**
   * set options provided for feature usage
   *
   * @protected
   * @param {IQueuedEncryptionClassBaseOptions} [options]
   * @memberof QueuedEncryptionClassBase
   */
  protected setOptions(options?: IQueuedEncryptionClassBaseOptions) {
    if (options && typeof options === 'object') {
      const { keys, queueOptions } = options;

      if (keys) {
        if (typeof keys !== 'object') {
          throw new Error('Keys must be an object');
        }

        const { decryptKey, encryptKey, signKey } = keys;

        if (decryptKey) {
          // verify key for data decryption
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
          // verify key for data decryption
          if (!isCryptoKeyDataSign(signKey)) {
            throw new Error('The decryptKey option must be a CryptoKey');
          }
          this.defaultKeys.signKey = signKey;
        }
      }
      this.startAsyncQueue(queueOptions);
    }
  }

  protected addInQueue<T>(cb: () => Promise<T>) {
    return this.asyncQueue.do<T>(cb);
  }
}
