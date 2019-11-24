import 'orbit-db-keystore';

declare module 'orbit-db-keystore' {
  export interface IOrbitDBKeystoreStore {
    status: string;
    open(): Promise<void>;
    close(): Promise<void>;
    put(k: string, v: any): Promise<void>;
    get(k: string): string | Uint8Array;
  }

  export interface IOrbitDBKeystoreCache {
    length: number;
    keys: string[];
    set(k: string, v: any): void;
    get(k: string): any;
    remove(k: string): void;
    clear(): void;
  }

  /**
   *
   *
   * @export
   * @interface IOrbitDBKeystoreOptionsForSecretStorage
   * @property {string} path - the custom name of the storage
   */
  export interface IOrbitDBKeystoreOptionsForSecretStorage {
    store?: string | IOrbitDBKeystoreStore;
    cache?: IOrbitDBKeystoreCache;
    path?: string;
    credentials: {
      password: string;
    };
  }

  export type TOrbitDBKeystoreOptions =
    | IOrbitDBKeystoreOptionsForSecretStorage
    | string;
}
