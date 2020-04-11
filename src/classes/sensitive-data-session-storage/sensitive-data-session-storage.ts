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
import { encryptDataToString, decryptDataByPassword } from 'utils';

export class SensitiveDataSessionStorage
  implements ISensitiveDataSessionStorage {
  protected isConnected: boolean = false;

  protected connectingPromise: undefined | Promise<void> = undefined;

  protected _temp: Record<string, any> = {};

  private _tempStringified: string | undefined = undefined;

  private k?: CryptoKey;

  public async connect(options?: ISensitiveDataSessionStorageOptions) {
    if (this.isConnected) {
      return;
    }
    if (!this.connectingPromise) {
      this.connectingPromise = this.connectToStorage(options);
    }
    await this.connectingPromise;
  }

  public getItem = async (key: string) => {
    assert(typeof key === 'string', 'Key must be a string');
    return this._temp[key];
  };

  public setItem = async (key: string, v: any) => {
    assert(typeof key === 'string', 'Key must be a string');
    if (v == null) {
      delete this._temp[key];
    } else {
      this._temp[key] = v;
    }
    this.stringifyTemp();
  };

  private async connectToStorage(
    options?: ISensitiveDataSessionStorageOptions
  ) {
    let error: Error | undefined;
    try {
      let k: CryptoKey | undefined;
      const pinCode = options?.pinCode;

      try {
        this._temp = (await this.readFromStorage(pinCode)) ?? {};
      } catch (err) {
        error = err;
      }
      this.subscribeOnWindowUnload();
      if (pinCode) {
        assert(typeof pinCode === 'string', 'Pin code must be a string');
        const pinCodeNewCryptoKey = await generatePasswordKeyByPasswordSalt(
          pinCode,
          this.generateSalt()
        );

        if (pinCodeNewCryptoKey instanceof Error) {
          throw pinCodeNewCryptoKey;
        }
        k = pinCodeNewCryptoKey;
      }
      this.k = k;
      this.stringifyTemp();
    } catch (err) {
      this.reset();
      console.error(err);
      throw err;
    } finally {
      this.clearValueStorage();
      this.isConnected = true;
    }
    if (error) {
      throw error;
    }
  }

  private readSalt() {
    const salt = sessionStorage.getItem(
      SENSITIVE_DATA_SESSION_STORAGE_STORAGE_KEY_SALT
    );

    return salt;
  }

  private generateSalt() {
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

  private subscribeOnWindowUnload() {
    window.onbeforeunload = async () => {
      const v = this._tempStringified;
      console.log(v);
      if (v && typeof v === 'string') {
        sessionStorage.setItem(SENSITIVE_DATA_SESSION_STORAGE_STORAGE_KEY, v);
      }
    };
  }

  private async readFromStorage(pinCode?: string) {
    const v = sessionStorage.getItem(
      SENSITIVE_DATA_SESSION_STORAGE_STORAGE_KEY
    );

    if (!v) {
      return;
    }
    const salt = !!pinCode && this.readSalt();
    const decrypted =
      salt && pinCode ? await decryptDataByPassword(pinCode, salt, v) : v;

    if (decrypted instanceof Error) {
      throw decrypted;
    }
    return JSON.parse(decrypted);
  }

  protected clearSaltStorage() {
    sessionStorage.removeItem(SENSITIVE_DATA_SESSION_STORAGE_STORAGE_KEY_SALT);
  }

  protected clearValueStorage() {
    sessionStorage.removeItem(SENSITIVE_DATA_SESSION_STORAGE_STORAGE_KEY);
  }

  protected reset() {
    this.clearSaltStorage();
    this.clearValueStorage();
    this.k = undefined;
    this._temp = {};
    this._tempStringified = undefined;
  }

  private stringifyTemp = async () => {
    const k = this.k;
    const v = this._temp;
    let stringified = undefined as string | undefined;

    if (!Object.keys(v).length) {
      stringified = undefined;
    } else if (k) {
      const encrypted = await encryptDataToString(k, v);

      if (encrypted instanceof Error) {
        return;
      }
      stringified = encrypted;
    } else {
      stringified = JSON.stringify(v);
    }
    this._tempStringified = stringified;
  };
}
