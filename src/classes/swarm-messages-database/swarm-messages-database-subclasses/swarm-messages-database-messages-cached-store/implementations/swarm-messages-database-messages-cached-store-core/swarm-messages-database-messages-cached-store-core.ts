import assert from 'assert';
import { ESwarmStoreConnector } from '../../../../../swarm-store-class/swarm-store-class.const';
import {
  ISwarmMessagesDatabaseMessagesCachedStoreCore,
  TSwarmMessagesDatabaseMessagesCachedStoreMessagesMetaHash,
} from '../../swarm-messages-database-messages-cached-store.types';
import { ISwarmMessagesDatabaseMessagesCacheMessageDescription } from '../../../swarm-messages-database-cache/swarm-messages-database-cache.types';
import {
  ISwarmMessagesDatabaseMesssageMeta,
  TSwarmMessageDatabaseMessagesCached,
} from '../../../../swarm-messages-database.types';
import {
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseEntityKey,
  TSwarmStoreDatabaseEntityAddress,
} from '../../../../../swarm-store-class/swarm-store-class.types';
import { isValidSwarmMessageDecryptedFormat } from '../../../../../swarm-message-store/swarm-message-store-utils/swarm-message-store-validators/swarm-message-store-validator-swarm-message';
import {
  ISwarmMessageInstanceDecrypted,
  ISwarmMessageDecrypted,
} from '../../../../../swarm-message/swarm-message-constructor.types';
import { SWARM_MESSGES_DATABASE_SWARM_MESSAGES_CACHED_SWARM_MESSAGES_META_HASH_DELIMETER } from 'classes/swarm-messages-database/swarm-messages-database-subclasses/swarm-messages-database-messages-cached-store/swarm-messages-database-messages-cached-store.const';
import { whetherAllSwarmMessagesDecryptedAreEqual } from '../../../../../swarm-message/swarm-message-utils/swarm-message-utils-common/swarm-message-utils-common-decrypted';
import { TSwarmMessagesDatabaseMessagesCacheStore } from '../../../swarm-messages-database-cache/swarm-messages-database-cache.types';
import { ISwarmMessagesDatabaseMessagesCacheStoreExtendedDefferedMethods } from '../../swarm-messages-database-messages-cached-store.types';
import { ISwarmMessageStoreMessagingRequestWithMetaResult } from '../../../../../swarm-message-store/swarm-message-store.types';
import { _checkWhetherSameSwarmMessagesDecrypted } from '../../../swarm-messages-database-cache/swarm-messages-database-cache.utils';
import { TSwarmStoreDatabaseEntityUniqueIndex } from '../../../../../swarm-store-class/swarm-store-class.types';

export abstract class SwarmMessagesDatabaseMessagesCachedStoreCore<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>,
  MD extends ISwarmMessageDecrypted,
  IsTemp extends boolean,
  MetaHash extends TSwarmMessagesDatabaseMessagesCachedStoreMessagesMetaHash
> implements
    Omit<
      ISwarmMessagesDatabaseMessagesCachedStoreCore<P, DbType, MD, IsTemp>,
      'entriesCached' | 'get' | 'set' | 'unset' | 'updateWithEntries' | 'clear'
    > {
  public get isTemp(): IsTemp {
    return this._isTemp;
  }

  public get storeVersion() {
    return this._messagesCachedVersion;
  }

  protected _messagesCachedVersion: number = 0;

  protected get _isInitialized(): boolean {
    return !!this._cachedStore;
  }

  constructor(
    protected _cachedStore: TSwarmMessagesDatabaseMessagesCacheStore<P, DbType, MD, IsTemp>,
    protected _isTemp: IsTemp,
    protected _dbType: DbType,
    protected _dbName: string
  ) {}

  // eslint-disable-next-line @typescript-eslint/member-ordering
  addToDeffered = (this._isTemp === true
    ? undefined
    : (entry: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType>): boolean => {
        this._checkIsInitialized();
        this._checkEntryWithMeta(entry);
        if (this._whetherEntryIsExistsInCache(entry)) {
          return false;
        }
        this._addDefferedReadEntryAfterCurrentBatchOfCacheUpdate(entry.messageMeta);
        this._addDefferedReadEntryAfterOverallCaheUpdate(entry.messageMeta);
        return true;
      }) as ISwarmMessagesDatabaseMessagesCachedStoreCore<P, DbType, MD, IsTemp>['addToDeffered'];

  // eslint-disable-next-line @typescript-eslint/member-ordering
  remove = (this._isTemp === true
    ? undefined
    : (meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>): void => {
        this._checkIsInitialized();
        this._checkMeta(meta);
        this._addDefferedReadEntryAfterCurrentBatchOfCacheUpdate(meta);
        this._addDefferedReadEntryAfterOverallCaheUpdate(meta);
      }) as ISwarmMessagesDatabaseMessagesCachedStoreCore<P, DbType, MD, IsTemp>['remove'];

  protected _beforeGet = (meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>): void => {
    this._checkIsInitialized();
    this._checkMeta(meta);
  };

  protected _beforeSet = (entry: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType>): void => {
    this._checkIsInitialized();
    this._checkEntryWithMeta(entry);
  };

  protected _beforeUnset = (meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>): void => {
    this._checkIsInitialized();
    this._checkMeta(meta);
  };

  protected _checkIsInitialized(): this is {
    _cachedStore: ISwarmMessagesDatabaseMessagesCacheStoreExtendedDefferedMethods<P, DbType, MD>;
  } {
    assert(this._cachedStore, 'The isnstance is not initialized');
    assert(
      typeof ((this._cachedStore as unknown) as any)?._addToDefferedReadAfterCurrentCacheUpdateBatch === 'function',
      'The cached store should have the "_addToDefferedReadAfterCurrentCacheUpdateBatch" method'
    );
    assert(
      typeof ((this._cachedStore as unknown) as any)?._addToDefferedUpdate === 'function',
      'The cached store should have the "_addToDefferedUpdate" method'
    );
    return true;
  }

  protected _getMessageAddressFromMeta(
    meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>
  ): TSwarmStoreDatabaseEntityAddress<P> | undefined {
    return meta.messageUniqAddress;
  }

  protected _getMessageKeyFromMeta(
    meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>
  ): TSwarmStoreDatabaseEntityKey<P> | undefined {
    return meta.key;
  }

  protected _checkMeta(meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>): void {
    // TODO - make a class for the meta information
    assert(meta, 'The meta information must be defined');
    assert(typeof meta === 'object', 'The meta must be an object');
  }

  protected _checkMessageEntry(message: ISwarmMessageInstanceDecrypted): void {
    isValidSwarmMessageDecryptedFormat(message);
  }

  protected _checkEntryWithMeta(entry: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType>): void {
    assert(entry, 'The enty must be defined');
    assert(typeof entry === 'object', 'The enty must be an object');
    assert(entry.messageMeta, 'A meta information must be defined');
    assert(entry.messageEntry, 'A message must be defined');
    this._checkMeta(entry.messageMeta);
    this._checkMessageEntry(entry.messageEntry);
  }

  protected _getMetaHash(meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>): MetaHash {
    return `${meta.messageUniqAddress}${SWARM_MESSGES_DATABASE_SWARM_MESSAGES_CACHED_SWARM_MESSAGES_META_HASH_DELIMETER}${meta.key}` as MetaHash;
  }

  protected _incMessagesInCacheVersion() {
    this._messagesCachedVersion += 1;
  }

  protected _incMessagesInCacheVersionIfMessagesNotEquals(
    entryFirst: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType> | undefined,
    entrySecond: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType> | undefined
  ) {
    if (entryFirst === entrySecond) {
      return;
    }
    if (
      (entryFirst && this._getMetaHash(entryFirst.messageMeta)) !== (entrySecond && this._getMetaHash(entrySecond.messageMeta))
    ) {
      this._incMessagesInCacheVersion();
    }
    if (whetherAllSwarmMessagesDecryptedAreEqual(entryFirst?.messageEntry, entrySecond?.messageEntry)) {
      this._incMessagesInCacheVersion();
    }
  }

  protected _addDefferedReadEntryAfterCurrentBatchOfCacheUpdate(meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>): void {
    if (this._checkIsInitialized()) {
      this._cachedStore._addToDefferedReadAfterCurrentCacheUpdateBatch(meta);
    }
  }

  protected _addDefferedReadEntryAfterOverallCaheUpdate(meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>): void {
    if (this._checkIsInitialized()) {
      this._cachedStore._addToDefferedUpdate(meta);
    }
  }

  protected _canUpdateWithEmptyValue() {
    return false;
  }

  protected _checkWhetherUpdatValue(
    source: ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD> | undefined,
    target: ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD> | undefined
  ): boolean {
    if (!target && !this._canUpdateWithEmptyValue()) {
      return false;
    }
    if (!source && !target) {
      return false;
    }
    if (!source && target) {
      return true;
    }
    if (source === target) {
      return false;
    }
    return !source || !_checkWhetherSameSwarmMessagesDecrypted(source, target);
  }

  protected _checkWhetherUpdateKey(
    key: TSwarmStoreDatabaseEntityUniqueIndex<P, DbType>,
    value: ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD>,
    entriesCached: TSwarmMessageDatabaseMessagesCached<P, DbType, MD>
  ) {
    return this._checkWhetherUpdatValue(entriesCached.get(key), value);
  }

  protected _clearEntriesCached(entriesCached: TSwarmMessageDatabaseMessagesCached<P, DbType, MD>) {
    entriesCached.clear();
  }

  protected _updateCacheWithEntries(
    entries: TSwarmMessageDatabaseMessagesCached<P, DbType, MD>,
    entriesCached: TSwarmMessageDatabaseMessagesCached<P, DbType, MD>
  ): boolean {
    let hasMessagesUpdated = false;
    // if there is no entries cached for now, it is not neccesary to check
    // whether to need update it, because it is always neccessary.
    const wetherToCheckUpdateIsNeccessary = !!entriesCached.size;

    entries.forEach((value, key) => {
      if (wetherToCheckUpdateIsNeccessary || this._checkWhetherUpdateKey(key, value, entriesCached)) {
        entriesCached.set(key, value);
        hasMessagesUpdated = true;
      } else {
        console.error(new Error('_updateCacheWithEntries'));
      }
    });
    return hasMessagesUpdated;
  }

  protected abstract _whetherEntryIsExistsInCache(
    entry: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType>
  ): boolean;
}
