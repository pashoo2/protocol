import { IStore } from 'orbit-db-cache';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbKeystoreStore
  extends IStore {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbCacheStore
  extends IStore {
  /**
   * close() method will not close the instance. It's
   * necessary when restart the database, it's cache
   * is closed by the OrbitDB API, so to prevent
   * a cache from closing and it can be resused.
   *
   * @param {boolean} isPrevented - prevented or not
   * @memberof ISwarmStoreConnectorOrbitDbSubclassesCacheOrbitDbCacheStore
   * @throws - if closed before
   */
  setPreventClose(isPrevented: boolean): void;
}
