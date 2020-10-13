import assert from 'assert';

import { ISwarmMessagesDatabaseMessagesCachedStoreCore } from '../../swarm-messages-database-messages-cached-store.types';
import { ESwarmStoreConnector } from '../../../../../swarm-store-class/swarm-store-class.const';
import { TSwarmStoreDatabaseType } from '../../../../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessagesDatabaseMessagesCacheStoreExtendedDefferedMethods } from '../../swarm-messages-database-messages-cached-store.types';
import { SwarmMessagesDatabaseMessagesCachedStoreTemp } from '../swarm-messages-database-messages-cached-store-temp/swarm-messages-database-messages-cached-store-temp';
import {
  ISwarmMessagesDatabaseMesssageMeta,
  TSwarmMessageDatabaseMessagesCached,
} from '../../../../swarm-messages-database.types';
import {
  ISwarmMessagesDatabaseMessagesCacheMessageDescription,
  ISwarmMessagesDatabaseMessagesCacheStoreTemp,
} from '../../../swarm-messages-database-cache/swarm-messages-database-cache.types';
import { whetherSwarmMessagesDecryptedAreEqual } from '../../../../../swarm-message/swarm-message-utils/swarm-message-utils-common/swarm-message-utils-common-decrypted';
import { ISwarmMessageStoreMessagingRequestWithMetaResult } from '../../../../../swarm-message-store/swarm-message-store.types';
import { isValidSwarmMessageDecryptedFormat } from '../../../../../swarm-message-store/swarm-message-store-utils/swarm-message-store-validators/swarm-message-store-validator-swarm-message';
import { ISwarmMessageInstanceDecrypted } from '../../../../../swarm-message/swarm-message-constructor.types';

export class SwarmMessagesDatabaseMessagesCachedStore<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>
> extends SwarmMessagesDatabaseMessagesCachedStoreTemp<P, DbType, false>
  implements
    ISwarmMessagesDatabaseMessagesCacheStoreExtendedDefferedMethods<P, DbType> {
  public readonly isTemp = false;

  protected _listDefferedReadAfterCurrentCacheUpdateBatch = new Set<
    ISwarmMessagesDatabaseMesssageMeta<P, DbType>
  >();

  protected _listDefferedRead = new Set<
    ISwarmMessagesDatabaseMesssageMeta<P, DbType>
  >();

  protected _tempMessagesCachedStoreLinked?: ISwarmMessagesDatabaseMessagesCacheStoreTemp<
    P,
    DbType,
    false
  >;

  constructor(protected _dbType: DbType, protected _dbName: string) {
    super(_dbType, _dbName, false);
  }

  public add(
    description: ISwarmMessagesDatabaseMessagesCacheMessageDescription<
      P,
      DbType
    >
  ): boolean {
    if (this._checkIfMessageInTempStore(description)) {
      return true;
    }
    this._cachedStoreImplementation.add(description);
    return true;
  }

  public remove = (
    messageCharacteristic: ISwarmMessagesDatabaseMesssageMeta<P, DbType>
  ): void => {
    return this._cachedStoreImplementation.remove(messageCharacteristic);
  };

  public linkWithTempStore(
    tempCacheStore: ISwarmMessagesDatabaseMessagesCacheStoreTemp<
      P,
      DbType,
      false
    >
  ) {}

  public updateByTempStore = (): void => {
    const { _tempMessagesCachedStoreLinked } = this;

    if (
      !_tempMessagesCachedStoreLinked ||
      !_tempMessagesCachedStoreLinked.entries
    ) {
      return;
    }
    return this._cachedStoreImplementation.updateWithEntries(
      _tempMessagesCachedStoreLinked.entries
    );
  };

  public unlinkWithTempStore() {
    this._tempMessagesCachedStoreLinked = undefined;
  }

  public getDefferedReadAfterCurrentCacheUpdateBatch(): Set<
    ISwarmMessagesDatabaseMesssageMeta<P, DbType>
  > {
    return this._listDefferedReadAfterCurrentCacheUpdateBatch;
  }
  /**
   * Reset messages to read after the current batch of update will be performed.
   *
   * @memberof ISwarmMessagesDatabaseMessagesCachedStore
   */
  public resetDefferedAfterCurrentCacheUpdateBatch(): void {
    this._listDefferedReadAfterCurrentCacheUpdateBatch.clear();
  }

  /**
   * Get messages to read after the current cache update proces will be ended.
   *
   * @returns {Set<ISwarmMessagesDatabaseMesssageMeta<P, DbType>>}
   * @memberof ISwarmMessagesDatabaseMessagesCachedStore
   */
  public getDefferedRead(): Set<ISwarmMessagesDatabaseMesssageMeta<P, DbType>> {
    return this._listDefferedRead;
  }
  /**
   * Reset messages to read after the current cache update proces will be ended.
   *
   * @memberof ISwarmMessagesDatabaseMessagesCachedStore
   */
  public resetDeffered(): void {
    this._listDefferedRead.clear();
  }

  public _addToDefferedUpdate = (
    meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>
  ): void => {
    this._listDefferedRead.add(meta);
  };

  public _addToDefferedReadAfterCurrentCacheUpdateBatch = (
    meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>
  ): void => {
    this._listDefferedReadAfterCurrentCacheUpdateBatch.add(meta);
  };

  protected _checkIsReady(): this is {
    _cachedStoreImplementation: ISwarmMessagesDatabaseMessagesCachedStoreCore<
      P,
      DbType,
      false
    >;
  } {
    return this._isReady;
  }

  protected _throwIfNotReady(): this is {
    _cachedStoreImplementation: ISwarmMessagesDatabaseMessagesCachedStoreCore<
      P,
      DbType,
      false
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

  protected _getEntryFromTempStoreLinked(
    messageCharacteristic: ISwarmMessagesDatabaseMesssageMeta<P, DbType>
  ):
    | ISwarmMessageStoreMessagingRequestWithMetaResult<ESwarmStoreConnector>
    | undefined {
    const { _cachedStoreImplementation } = this;

    if (!_cachedStoreImplementation) {
      return;
    }
    return _cachedStoreImplementation.get(messageCharacteristic);
  }

  protected _getMessageDecryptedFromTempStoreLinked(
    messageCharacteristic: ISwarmMessagesDatabaseMesssageMeta<P, DbType>
  ): ISwarmMessageInstanceDecrypted | undefined {
    const entry = this._getEntryFromTempStoreLinked(messageCharacteristic);

    if (!entry || entry instanceof Error) {
      return undefined;
    }

    const { message } = entry;

    if (!isValidSwarmMessageDecryptedFormat(message)) {
      return undefined;
    }
    return message;
  }

  protected _checkIfMessageInTempStore(
    description: ISwarmMessagesDatabaseMessagesCacheMessageDescription<
      P,
      DbType
    >
  ): boolean {
    const messageInTempStore = this._getMessageDecryptedFromTempStoreLinked(
      description.messageMeta
    );

    if (!messageInTempStore) {
      return false;
    }
    return (
      !!messageInTempStore &&
      whetherSwarmMessagesDecryptedAreEqual(
        messageInTempStore,
        description.messageEntry
      )
    );
  }
}
