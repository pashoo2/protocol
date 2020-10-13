import assert from 'assert';

import { ISwarmMessagesDatabaseMessagesCachedStoreCore } from '../../swarm-messages-database-messages-cached-store.types';
import { ESwarmStoreConnector } from '../../../../../swarm-store-class/swarm-store-class.const';
import { TSwarmStoreDatabaseType } from '../../../../../swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { SwarmMessagesDatabaseMessagesCachedStoreKeyValue } from '../../implementations/swarm-messages-database-messages-cached-store-keyvalue/swarm-messages-database-messages-cached-store-keyvalue';
import { SwarmMessagesDatabaseMessagesCachedStoreFeed } from '../../implementations/swarm-messages-database-messages-cached-store-feed/index';
import { ISwarmMessageStoreMessagingRequestWithMetaResult } from '../../../../../swarm-message-store/swarm-message-store.types';
import {
  ISwarmMessagesDatabaseMesssageMeta,
  TSwarmMessageDatabaseMessagesCached,
} from '../../../../swarm-messages-database.types';
import {
  ISwarmMessagesDatabaseMessagesCacheMessageDescription,
  ISwarmMessagesDatabaseMessagesCacheStoreTemp,
} from '../../../swarm-messages-database-cache/swarm-messages-database-cache.types';

export class SwarmMessagesDatabaseMessagesCachedStoreTemp<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>,
  IsTemp extends boolean
> implements ISwarmMessagesDatabaseMessagesCacheStoreTemp<P, DbType, IsTemp> {
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
    | ISwarmMessageStoreMessagingRequestWithMetaResult<ESwarmStoreConnector>
    | undefined {
    return this._cachedStoreImplementation.get(messageCharacteristic);
  }

  set(
    description: ISwarmMessagesDatabaseMessagesCacheMessageDescription<
      P,
      DbType
    >
  ): void {
    return this._cachedStoreImplementation.set(description);
  }

  unset(
    messageCharacteristic: ISwarmMessagesDatabaseMesssageMeta<P, DbType>
  ): void {
    return this._cachedStoreImplementation.unset(messageCharacteristic);
  }

  protected _createCachedStoreImplementation(): ISwarmMessagesDatabaseMessagesCachedStoreCore<
    P,
    DbType,
    IsTemp
  > {
    if (this._dbType === ESwarmStoreConnectorOrbitDbDatabaseType.FEED) {
      return new SwarmMessagesDatabaseMessagesCachedStoreFeed(
        (this as unknown) as any,
        this._isTemp,
        ESwarmStoreConnectorOrbitDbDatabaseType.FEED,
        this._dbName
      ) as ISwarmMessagesDatabaseMessagesCachedStoreCore<P, DbType, IsTemp>;
    }
    if (this._dbType === ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE) {
      return new SwarmMessagesDatabaseMessagesCachedStoreKeyValue(
        (this as unknown) as any,
        this._isTemp,
        ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE,
        this._dbName
      ) as ISwarmMessagesDatabaseMessagesCachedStoreCore<P, DbType, IsTemp>;
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
