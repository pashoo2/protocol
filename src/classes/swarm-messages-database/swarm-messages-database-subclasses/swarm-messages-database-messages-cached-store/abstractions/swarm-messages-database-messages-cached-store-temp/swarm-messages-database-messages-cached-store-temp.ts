import assert from 'assert';

import { ISwarmMessagesDatabaseMessagesCachedStoreCore } from '../../swarm-messages-database-messages-cached-store.types';
import { ESwarmStoreConnector } from '../../../../../swarm-store-class/swarm-store-class.const';
import { TSwarmStoreDatabaseType } from '../../../../../swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { SwarmMessagesDatabaseMessagesCachedStoreKeyValue } from '../../implementations/swarm-messages-database-messages-cached-store-keyvalue/swarm-messages-database-messages-cached-store-keyvalue';
import { SwarmMessagesDatabaseMessagesCachedStoreFeed } from '../../implementations/swarm-messages-database-messages-cached-store-feed/index';
import { ISwarmMessageStoreMessagingRequestWithMetaResult } from '../../../../../swarm-message-store/types/swarm-message-store.types';
import { ISwarmMessageDecrypted } from '../../../../../swarm-message/swarm-message-constructor.types';
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
  MD extends ISwarmMessageDecrypted,
  IsTemp extends boolean
> implements ISwarmMessagesDatabaseMessagesCacheStoreTemp<P, DbType, MD, IsTemp> {
  public get isTemp() {
    return this._isTemp;
  }

  public get entries(): TSwarmMessageDatabaseMessagesCached<P, DbType, MD> | undefined {
    return this._mapCachedStoreItemsToMessagesWithMeta();
  }

  protected _cachedStoreImplementation: ISwarmMessagesDatabaseMessagesCachedStoreCore<P, DbType, MD, IsTemp>;

  protected get _isReady(): boolean {
    return !!this._cachedStoreImplementation;
  }

  constructor(protected _dbType: DbType, protected _dbName: string, protected _isTemp: IsTemp) {
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
  ): ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD> | undefined {
    return this._cachedStoreImplementation.get(messageCharacteristic);
  }

  set(description: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType>): void {
    return this._cachedStoreImplementation.set(description);
  }

  unset(messageCharacteristic: ISwarmMessagesDatabaseMesssageMeta<P, DbType>): void {
    return this._cachedStoreImplementation.unset(messageCharacteristic);
  }

  update(entries: TSwarmMessageDatabaseMessagesCached<P, DbType, MD>): boolean {
    return this._cachedStoreImplementation.updateWithEntries(entries);
  }

  protected _createCachedStoreImplementationFeed(): ISwarmMessagesDatabaseMessagesCachedStoreCore<
    P,
    ESwarmStoreConnectorOrbitDbDatabaseType.FEED,
    MD,
    IsTemp
  > {
    return new SwarmMessagesDatabaseMessagesCachedStoreFeed(
      (this as unknown) as any,
      this._isTemp,
      ESwarmStoreConnectorOrbitDbDatabaseType.FEED,
      this._dbName
    );
  }

  protected _createCachedStoreImplementationKeyValue(): ISwarmMessagesDatabaseMessagesCachedStoreCore<
    P,
    ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE,
    MD,
    IsTemp
  > {
    return new SwarmMessagesDatabaseMessagesCachedStoreKeyValue(
      (this as unknown) as any,
      this._isTemp,
      ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE,
      this._dbName
    );
  }

  protected _createCachedStoreImplementation(): ISwarmMessagesDatabaseMessagesCachedStoreCore<P, DbType, MD, IsTemp> {
    if (this._dbType === ESwarmStoreConnectorOrbitDbDatabaseType.FEED) {
      return this._createCachedStoreImplementationFeed() as ISwarmMessagesDatabaseMessagesCachedStoreCore<P, DbType, MD, IsTemp>;
    }
    if (this._dbType === ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE) {
      return this._createCachedStoreImplementationKeyValue() as ISwarmMessagesDatabaseMessagesCachedStoreCore<
        P,
        DbType,
        MD,
        IsTemp
      >;
    }
    throw new Error('Failed to create cache store implementation for a given store type');
  }

  protected _checkIsReady(): this is {
    _cachedStoreImplementation: ISwarmMessagesDatabaseMessagesCachedStoreCore<P, DbType, MD, IsTemp>;
  } {
    return this._isReady;
  }

  protected _throwIfNotReady(): this is {
    _cachedStoreImplementation: ISwarmMessagesDatabaseMessagesCachedStoreCore<P, DbType, MD, IsTemp>;
  } {
    assert(this._checkIsReady(), 'The instance is not ready');
    return true;
  }

  protected _mapCachedStoreItemsToMessagesWithMeta(): TSwarmMessageDatabaseMessagesCached<P, DbType, MD> | undefined {
    if (!this._checkIsReady()) {
      return undefined;
    }
    return this._cachedStoreImplementation.entriesCached;
  }
}
