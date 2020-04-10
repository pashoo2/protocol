import {
  ISensitiveDataSessionStorage,
  ISensitiveDataSessionStorageOptions,
} from './sensitive-data-session-storage.types';
import {
  SENSITIVE_DATA_SESSION_STORAGE_STORAGE_KEY,
  SENSITIVE_DATA_SESSION_STORAGE_STORAGE_KEY_SALT,
} from './sensitive-data-session-storage.const';
import assert from 'assert';
import {
  generatePasswordKeyByPasswordSalt,
  generateSaltForPassword,
} from 'classes/secret-storage-class';
import { encryptDataToString, decryptDataWithKey } from 'utils';

export class SensitiveDataSessionStorage
  implements ISensitiveDataSessionStorage {
  protected isConnected: boolean = false;

  protected _temp: Record<string, any> = {};

  protected _tempStringified: string | undefined = undefined;

  public async connect(options?: ISensitiveDataSessionStorageOptions) {
    let k: CryptoKey | undefined;
    if (options?.pinCode) {
      const { pinCode } = options;

      assert(typeof pinCode === 'string', 'Pin code must be a string');
      const salt = this.getSalt();
      const pinCodeCryptoKey = await generatePasswordKeyByPasswordSalt(
        pinCode,
        salt
      );

      if (pinCodeCryptoKey instanceof Error) {
        throw pinCodeCryptoKey;
      }
      k = pinCodeCryptoKey;
    }
    this.subscribeOnWindowUnload(k);

    const stored = await this.read(k);

    if (stored) {
      this._temp = stored;
    }
  }

  public getItem = async (key: string) => {
    assert(typeof key === 'string', 'Key must be a string');
    return this._temp[key];
  };

  public setItem = async (key: string, v: any) => {
    assert(typeof key === 'string', 'Key must be a string');

    if (v === undefined) {
      delete this._temp[key];
    } else {
      this._temp[key] = v;
    }
    this.stringifyTemp();
  };

  private getSalt() {
    const salt = sessionStorage.getItem(
      SENSITIVE_DATA_SESSION_STORAGE_STORAGE_KEY_SALT
    );

    if (salt) {
      return salt;
    }

    const newSalt = generateSaltForPassword();

    if (typeof newSalt !== 'string') {
      throw new Error('Failed to generate a salt value');
    }
    sessionStorage.setItem(
      SENSITIVE_DATA_SESSION_STORAGE_STORAGE_KEY_SALT,
      newSalt
    );
    return newSalt;
  }

  public toString() {
    return this._tempStringified ?? '';
  }

  private subscribeOnWindowUnload(k?: CryptoKey) {
    const getValue = async () => {
      const str = String(this);

      if (!str) {
        return;
      }
      if (k) {
        return await encryptDataToString(k, str);
      }
      return str;
    };

    window.onbeforeunload = async () => {
      const v = await getValue();

      if (v && typeof v === 'string') {
        sessionStorage.setItem(SENSITIVE_DATA_SESSION_STORAGE_STORAGE_KEY, v);
      }
    };
  }

  private async read(k?: CryptoKey) {
    const v = sessionStorage.getItem(
      SENSITIVE_DATA_SESSION_STORAGE_STORAGE_KEY
    );

    if (!v) {
      return;
    }
    const decrypted = k ? await decryptDataWithKey(k, v) : v;

    if (decrypted instanceof Error) {
      throw decrypted;
    }
    return JSON.parse(decrypted);
  }

  private stringifyTemp = () => {
    this._tempStringified = Object.keys(this._temp).length
      ? JSON.stringify(this._temp)
      : undefined;
  };
}
