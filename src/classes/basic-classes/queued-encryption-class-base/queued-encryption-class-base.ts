import {
  TCRYPTO_UTIL_ENCRYPT_DATA_TYPES,
  TCRYPTO_UTIL_DECRYPT_DATA_TYPES,
} from '../../../utils/encryption-utils/crypto-utils.types';
import { AsyncQueueClassBase } from '../async-queue-class-base/async-queue-class-base';
import { IAsyncQueueBaseClassOptions } from '../async-queue-class-base/async-queue-class-base.types';
import { isCryptoKeyDataEncryption, isCryptoKeyDataDecryption } from '../../../utils/encryption-keys-utils/encryption-keys-utils';
import { encryptToString } from '../../../utils/encryption-utils/encrypt-data.encryption-utils';
import { decryptData } from '../../../utils/encryption-utils/decrypt-data.encryption-utils';
import {
  TDATA_SIGN_UTIL_SIGN_DATA_TYPES,
  TDATA_SIGN_UTIL_VERIFY_DATA_TYPES,
  TDATA_SIGN_UTIL_VERIFY_DATA_TYPES_EXTENDED,
} from '../../../utils/data-sign-utils/data-sign-utils.types';
import { isCryptoKeyDataSign, isCryptoKeyDataVerify } from '../../../utils/encryption-keys-utils/encryption-keys-utils';
import { signToString } from '../../../utils/data-sign-utils/sign-data.encryption-utils';
import { verifyData } from '../../../utils/data-sign-utils/verify-data.encryption-utils';
import { IQueuedEncryptionClassBase } from './queued-encryption-class-base.types';
import { IQueuedEncrypyionClassBaseOptions } from './queued-encryption-class-base.types';

export class QueuedEncryptionClassBase implements IQueuedEncryptionClassBase {
  protected defaultKeys: Required<IQueuedEncrypyionClassBaseOptions>['keys'] = {};

  protected asyncQueue = new AsyncQueueClassBase();

  constructor(options?: IQueuedEncrypyionClassBaseOptions) {
    this.setOptions(options);
    return this;
  }

  public encryptData = (data: TCRYPTO_UTIL_ENCRYPT_DATA_TYPES, key?: CryptoKey): Promise<string | Error> => {
    if (key && !isCryptoKeyDataEncryption(key)) {
      return Promise.resolve(new Error('Crypto key is not the valid key for data encryption'));
    }

    const keyToUse = key || this.defaultKeys.encryptKey;

    if (!keyToUse) {
      return Promise.resolve(new Error('A key must be provided because there is no default key defined for the instance'));
    }
    return this.addInQueue(() => encryptToString(keyToUse, data));
  };

  public decryptData = (data: TCRYPTO_UTIL_DECRYPT_DATA_TYPES, key?: CryptoKey): Promise<string | Error> => {
    if (key && !isCryptoKeyDataDecryption(key)) {
      return Promise.resolve(new Error('Crypto key is not the valid key for data encryption'));
    }

    const keyToUse = key || this.defaultKeys.decryptKey;

    if (!keyToUse) {
      return Promise.resolve(new Error('A key must be provided cause there is no default key was set'));
    }
    return this.addInQueue(() => decryptData(keyToUse, data));
  };

  public signData = (data: TDATA_SIGN_UTIL_SIGN_DATA_TYPES, key?: CryptoKey): Promise<string | Error> => {
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
    data: TDATA_SIGN_UTIL_VERIFY_DATA_TYPES_EXTENDED,
    signature: TDATA_SIGN_UTIL_VERIFY_DATA_TYPES,
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
   * @param {IQueuedEncrypyionClassBaseOptions} [options]
   * @memberof QueuedEncryptionClassBase
   */
  protected setOptions(options?: IQueuedEncrypyionClassBaseOptions) {
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
