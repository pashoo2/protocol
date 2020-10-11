import assert from 'assert';

import {
  ISwarmMessagesDatabaseMessagesCacheStoreExtendedDefferedMethodsConstructor,
  ISwarmMessagesDatabaseMessagesCachedStoreCore,
} from './swarm-messages-database-messages-cached-store.types';
import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import { TSwarmStoreDatabaseType } from '../../../swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { SwarmMessagesDatabaseMessagesCachedStoreKeyValue } from './swarm-messages-database-messages-cached-store-subclasses/swarm-messages-database-messages-cached-store-keyvalue/swarm-messages-database-messages-cached-store-keyvalue';
import { SwarmMessagesDatabaseMessagesCachedStoreFeed } from './swarm-messages-database-messages-cached-store-subclasses/swarm-messages-database-messages-cached-store-feed';
import {
  ISwarmMessagesDatabaseMesssageMeta,
  TSwarmMessageDatabaseMessagesCached,
} from '../../swarm-messages-database.types';
import { ISwarmMessagesDatabaseMessagesCacheMessageDescription } from '../swarm-messages-database-cache/swarm-messages-database-cache.types';

export class SwarmMessagesDatabaseMessagesCachedStore<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>,
  IsTemp extends boolean
>
  implements
    ISwarmMessagesDatabaseMessagesCacheStoreExtendedDefferedMethodsConstructor<
      P,
      DbType,
      IsTemp
    > {
  public get isTemp() {
    return this._isTemp;
  }

  public get entries():
    | TSwarmMessageDatabaseMessagesCached<P, DbType>
    | undefined {
    return this._mapCachedStoreItemsToMessagesWithMeta();
  }

  protected _cachedStoreImplementation: ISwarmMessagesDatabaseMessagesCachedStoreCore<
    P,
    DbType,
    IsTemp
  >;

  protected get _isReady(): boolean {
    return !!this._cachedStoreImplementation;
  }

  constructor(
    protected _dbType: DbType,
    protected _dbName: string,
    protected _isTemp: IsTemp
  ) {
    this._cachedStoreImplementation = this._createCachedStoreImplementation();
  }

  /**
   * Read message from the cache
   *
   * @param {ISwarmMessagesDatabaseMesssageMeta<P, DbType>} messageCharacteristic
   * @returns {(ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType> | undefined)}
   * @memberof ISwarmMessagesDatabaseMessagesCachedStore
   */
  get(
    messageCharacteristic: ISwarmMessagesDatabaseMesssageMeta<P, DbType>
  ):
    | ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType>
    | undefined {}

  /**
   * Add message to cache if not exists. It may cause a deffered update
   * of the message in cache.
   *
   * @memberof ISwarmMessagesDatabaseMessagesCachedStore
   */
  add(
    description: ISwarmMessagesDatabaseMessagesCacheMessageDescription<
      P,
      DbType
    >
  ): void {}
  /**
   * Remove message with a description provided from the cache.
   * It may cause a deffered cache update and the message may
   * be removed not immediately,
   *
   * @param {ISwarmMessagesDatabaseMesssageMeta<P, DbType>} messageCharacteristic
   * @memberof ISwarmMessagesDatabaseMessagesCachedStore
   */
  remove(
    messageCharacteristic: ISwarmMessagesDatabaseMesssageMeta<P, DbType>
  ): void {}

  protected _createCachedStoreImplementation(): ISwarmMessagesDatabaseMessagesCachedStoreCore<
    P,
    DbType,
    IsTemp
  > {
    if (this._dbType === ESwarmStoreConnectorOrbitDbDatabaseType.FEED) {
      return new SwarmMessagesDatabaseMessagesCachedStoreFeed(
        this,
        this._dbType,
        this._dbName,
        this._isTemp
      );
    }
    if (this._dbType === ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE) {
      return new SwarmMessagesDatabaseMessagesCachedStoreKeyValue(
        this,
        this._dbType,
        this._dbName,
        this._isTemp
      );
    }
    throw new Error(
      'Failed to create cache store implementation for a given store type'
    );
  }

  protected _checkIsReady(): this is {
    _cachedStoreImplementation: ISwarmMessagesDatabaseMessagesCachedStoreCore<
      P,
      DbType,
      IsTemp
    >;
  } {
    return this._isReady;
  }

  protected _throwIfNotReady(): this is {
    _cachedStoreImplementation: ISwarmMessagesDatabaseMessagesCachedStoreCore<
      P,
      DbType,
      IsTemp
    >;
  } {
    assert(this._checkIsReady(), 'The instance is not ready');
    return true;
  }

  protected _mapCachedStoreItemsToMessagesWithMeta():
    | TSwarmMessageDatabaseMessagesCached<P, DbType>
    | undefined {
    if (!this._checkIsReady()) {
      return undefined;
    }
    return this._cachedStoreImplementation.entriesCached;
  }
}
