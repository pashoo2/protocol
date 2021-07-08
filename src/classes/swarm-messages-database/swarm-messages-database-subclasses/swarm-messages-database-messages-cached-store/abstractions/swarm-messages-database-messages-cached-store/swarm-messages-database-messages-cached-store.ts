import assert from 'assert';
import { isArraysSwallowEqual } from 'utils';

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
import { ifSwarmMessagesDecryptedEqual } from '../../../../../swarm-message/swarm-message-utils/swarm-message-utils-common/swarm-message-utils-common-decrypted';
import { ISwarmMessageStoreMessagingRequestWithMetaResult } from '../../../../../swarm-message-store/types/swarm-message-store.types';
import { isValidSwarmMessageDecryptedFormat } from '../../../../../swarm-message-store/swarm-message-store-utils/swarm-message-store-validators/swarm-message-store-validator-swarm-message';
import { ISwarmMessageInstanceDecrypted } from '../../../../../swarm-message/swarm-message-constructor.types';

export class SwarmMessagesDatabaseMessagesCachedStore<
    P extends ESwarmStoreConnector,
    DbType extends TSwarmStoreDatabaseType<P>,
    MD extends ISwarmMessageInstanceDecrypted
  >
  extends SwarmMessagesDatabaseMessagesCachedStoreTemp<P, DbType, MD, false>
  implements ISwarmMessagesDatabaseMessagesCacheStoreExtendedDefferedMethods<P, DbType, MD>
{
  protected _listMessagesMetaForDefferedReadAfterCurrentCacheUpdateBatch =
    this._createNewListMessagesMetaForDefferedReadPartial();

  protected _listMessagesMetaForDefferedRead = this._createNewListMessagesMetaForDefferedReadFull();

  protected _tempMessagesCachedStoreLinked?: ISwarmMessagesDatabaseMessagesCacheStoreTemp<P, DbType, MD, true>;

  constructor(protected _dbType: DbType, protected _dbName: string) {
    super(_dbType, _dbName, false);
  }

  public addToDeffered(description: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType>): boolean {
    if (this._checkIfMessageInTempStore(description)) {
      return true;
    }
    return this._cachedStoreImplementation.addToDeffered(description);
  }

  public remove = (messageCharacteristic: ISwarmMessagesDatabaseMesssageMeta<P, DbType>): void => {
    return this._cachedStoreImplementation.remove(messageCharacteristic);
  };

  public linkWithTempStore(tempCacheStore: ISwarmMessagesDatabaseMessagesCacheStoreTemp<P, DbType, MD, true>) {
    this._validateTempCacheStore(tempCacheStore);
    this._linkWithTempCacheStore(tempCacheStore);
  }

  public updateByTempStore = (): boolean => {
    const { _tempMessagesCachedStoreLinked } = this;

    if (!_tempMessagesCachedStoreLinked || !_tempMessagesCachedStoreLinked.entries) {
      return false;
    }

    const whetherSameKeysInTempAndMainStorage = this._whetherSameKeysBetweenTempStorageLinkedEntriesAndMain();

    if (!whetherSameKeysInTempAndMainStorage) {
      this._cachedStoreImplementation.clear();
    }
    return this._cachedStoreImplementation.updateWithEntries(_tempMessagesCachedStoreLinked.entries);
  };

  public unlinkWithTempStore() {
    this._tempMessagesCachedStoreLinked = undefined;
  }

  public getDefferedReadAfterCurrentCacheUpdateBatch(): Set<ISwarmMessagesDatabaseMesssageMeta<P, DbType>> {
    return this._listMessagesMetaForDefferedReadAfterCurrentCacheUpdateBatch;
  }
  /**
   * Reset messages to read after the current batch of update will be performed.
   *
   * @memberof ISwarmMessagesDatabaseMessagesCachedStore
   */
  public resetDefferedAfterCurrentCacheUpdateBatch(): void {
    this._listMessagesMetaForDefferedReadAfterCurrentCacheUpdateBatch = this._createNewListMessagesMetaForDefferedReadPartial();
  }

  /**
   * Get messages to read after the current cache update proces will be ended.
   *
   * @returns {Set<ISwarmMessagesDatabaseMesssageMeta<P, DbType>>}
   * @memberof ISwarmMessagesDatabaseMessagesCachedStore
   */
  public getDefferedRead(): Set<ISwarmMessagesDatabaseMesssageMeta<P, DbType>> {
    return this._listMessagesMetaForDefferedRead;
  }
  /**
   * Reset messages to read after the current cache update proces will be ended.
   *
   * @memberof ISwarmMessagesDatabaseMessagesCachedStore
   */
  public resetDeffered(): void {
    this._listMessagesMetaForDefferedRead = this._createNewListMessagesMetaForDefferedReadFull();
  }

  public _addToDefferedUpdate = (meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>): void => {
    this._listMessagesMetaForDefferedRead.add(meta);
  };

  public _addToDefferedReadAfterCurrentCacheUpdateBatch = (meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>): void => {
    this._listMessagesMetaForDefferedReadAfterCurrentCacheUpdateBatch.add(meta);
  };

  protected _createNewListMessagesMetaForDefferedReadFull(): Set<ISwarmMessagesDatabaseMesssageMeta<P, DbType>> {
    return new Set<ISwarmMessagesDatabaseMesssageMeta<P, DbType>>();
  }

  protected _createNewListMessagesMetaForDefferedReadPartial(): Set<ISwarmMessagesDatabaseMesssageMeta<P, DbType>> {
    return this._createNewListMessagesMetaForDefferedReadFull();
  }

  protected _checkIsReady(): this is {
    _cachedStoreImplementation: ISwarmMessagesDatabaseMessagesCachedStoreCore<P, DbType, MD, false>;
  } {
    return this._isReady;
  }

  protected _throwIfNotReady(): this is {
    _cachedStoreImplementation: ISwarmMessagesDatabaseMessagesCachedStoreCore<P, DbType, MD, false>;
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

  protected _getEntryFromTempStoreLinked(
    messageCharacteristic: ISwarmMessagesDatabaseMesssageMeta<P, DbType>
  ): ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD> | undefined {
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

  protected _checkIfMessageInTempStore(description: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType>): boolean {
    const messageInTempStore = this._getMessageDecryptedFromTempStoreLinked(description.messageMeta);

    if (!messageInTempStore) {
      return false;
    }
    return !!messageInTempStore && ifSwarmMessagesDecryptedEqual(messageInTempStore, description.messageEntry);
  }

  protected _whetherSameKeysBetweenTempStorageLinkedEntriesAndMain(): boolean {
    const linkedStorageKeys = this._tempMessagesCachedStoreLinked?.entries?.keys();
    const mainStorageKeys = this._cachedStoreImplementation.entriesCached.keys();

    if (!mainStorageKeys !== !linkedStorageKeys) {
      return false;
    }
    if (!linkedStorageKeys) {
      return false;
    }
    return isArraysSwallowEqual(Array.from(mainStorageKeys), Array.from(linkedStorageKeys));
  }

  protected _validateTempCacheStore(tempCacheStore: ISwarmMessagesDatabaseMessagesCacheStoreTemp<P, DbType, MD, true>): void {
    assert(tempCacheStore.isTemp, 'The storage should be temporary');
  }

  protected _linkWithTempCacheStore(tempCacheStore: ISwarmMessagesDatabaseMessagesCacheStoreTemp<P, DbType, MD, true>): void {
    if (this._tempMessagesCachedStoreLinked) {
      throw new Error('A temp cache store has already linked to this storage');
    }
    this._tempMessagesCachedStoreLinked = tempCacheStore;
  }
}
