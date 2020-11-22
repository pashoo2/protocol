import { ISensitiveDataSessionStorage, ISensitiveDataSessionStorageOptions } from './sensitive-data-session-storage.types';
import {
  SENSITIVE_DATA_SESSION_STORAGE_STORAGE_KEY,
  SENSITIVE_DATA_SESSION_STORAGE_STORAGE_KEY_SALT,
} from './sensitive-data-session-storage.const';
import assert from 'assert';
import { generatePasswordKeyByPasswordSalt, generateSaltForPassword } from 'classes/secret-storage-class';
import { encryptDataToString, decryptDataByPassword } from 'utils';
import { isSimpleObject } from '../../utils/common-utils/common-utils-objects';

export class SensitiveDataSessionStorage implements ISensitiveDataSessionStorage {
  protected isConnected: boolean = false;

  protected connectingPromise: undefined | Promise<void> = undefined;

  protected _temp: Record<string, unknown> = {};

  private get _tempStringified(): string | undefined {
    return this.__tempStringified;
  }

  private set _tempStringified(v: string | undefined) {
    this.__tempStringified = v;
  }

  private __tempStringified: string | undefined = undefined;

  private k?: CryptoKey;

  private storagePrefix: string = '';

  private get storageKeyValue() {
    return `${this.storagePrefix}//${SENSITIVE_DATA_SESSION_STORAGE_STORAGE_KEY}`;
  }

  private get storageKeySalt() {
    return `${this.storagePrefix}//${SENSITIVE_DATA_SESSION_STORAGE_STORAGE_KEY_SALT}`;
  }

  public connect = async (options?: ISensitiveDataSessionStorageOptions): Promise<void> => {
    if (this.isConnected) {
      return;
    }
    if (options) {
      const { storagePrefix } = options;

      if (storagePrefix) {
        this.storagePrefix = storagePrefix;
      }
    }
    if (!this.connectingPromise) {
      this.connectingPromise = this.connectToStorage(options);
    }
    await this.connectingPromise;
  };

  public async close(): Promise<void> {
    await this.connectingPromise;
    this.unsubscribeOnWindowUnload();
    this.resetState();
  }

  public getItem = async (key: string): Promise<unknown> => {
    assert(typeof key === 'string', 'Key must be a string');
    await this.connectingPromise;
    return this._temp[key];
  };

  public setItem = async (key: string, v: unknown): Promise<void> => {
    assert(typeof key === 'string', 'Key must be a string');
    await this.connectingPromise;
    if (v == null) {
      delete this._temp[key];
    } else {
      this._temp[key] = v;
    }
    await this.stringifyTemp();
  };

  private async connectToStorage(options?: ISensitiveDataSessionStorageOptions): Promise<void> {
    let error: Error | undefined;
    let newsalt: string | undefined;
    try {
      let k: CryptoKey | undefined;
      const pinCode = options?.pinCode;

      try {
        const valueReadFromStore = (await this.readFromStorage(pinCode)) ?? {};
        if (isSimpleObject(valueReadFromStore)) {
          this._temp = valueReadFromStore;
        }
      } catch (err) {
        error = err as Error;
      }
      if (pinCode) {
        assert(typeof pinCode === 'string', 'Pin code must be a string');
        newsalt = this.generateSalt();
        const pinCodeNewCryptoKey = await generatePasswordKeyByPasswordSalt(pinCode, newsalt);

        if (pinCodeNewCryptoKey instanceof Error) {
          throw pinCodeNewCryptoKey;
        }
        k = pinCodeNewCryptoKey;
      }
      this.k = k;
      await this.stringifyTemp();
    } catch (err) {
      error = err as Error;
    } finally {
      if (error) {
        this.resetState();
        throw error;
      }
      if (options?.clearStorageAfterConnect !== false) {
        this.clearValueStorage();
        this.clearSaltStorage();
      }
      if (newsalt) {
        sessionStorage.setItem(this.storageKeySalt, newsalt);
      }
      this.isConnected = true;
      this.subscribeOnWindowUnload();
    }
  }

  private readSalt(): string | null {
    const salt = sessionStorage.getItem(this.storageKeySalt);

    return salt;
  }

  private generateSalt(): string {
    const newSalt = generateSaltForPassword();

    if (typeof newSalt !== 'string') {
      throw new Error('Failed to generate a salt value');
    }
    return newSalt;
  }

  public toString(): string {
    return this._tempStringified ?? '';
  }

  private beforeunloadHandler = () => {
    const v = this._tempStringified;
    debugger;
    if (v && typeof v === 'string') {
      debugger;
      sessionStorage.setItem(this.storageKeyValue, v);
    } else {
      sessionStorage.removeItem(this.storageKeyValue);
    }
  };

  private subscribeOnWindowUnload(): void {
    window.addEventListener('beforeunload', this.beforeunloadHandler);
  }

  private unsubscribeOnWindowUnload(): void {
    debugger;
    window.removeEventListener('beforeunload', this.beforeunloadHandler);
  }

  private async readFromStorage(pinCode?: string): Promise<unknown> {
    const v = sessionStorage.getItem(this.storageKeyValue);

    if (!v) {
      return;
    }
    const salt = !!pinCode && this.readSalt();
    const decrypted = salt && pinCode ? await decryptDataByPassword(pinCode, salt, v) : v;

    if (decrypted instanceof Error) {
      throw decrypted;
    }
    return JSON.parse(decrypted) as unknown;
  }

  protected clearSaltStorage(): void {
    sessionStorage.removeItem(this.storageKeySalt);
  }

  protected clearValueStorage(): void {
    sessionStorage.removeItem(this.storageKeyValue);
  }

  protected resetState(): void {
    this.k = undefined;
    this._temp = {};
    this._tempStringified = undefined;
    this.isConnected = false;
  }

  private stringifyTemp = async (): Promise<void> => {
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
