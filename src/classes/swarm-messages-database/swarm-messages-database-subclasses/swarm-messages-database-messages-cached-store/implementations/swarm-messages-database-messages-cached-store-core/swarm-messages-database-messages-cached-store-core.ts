import assert from 'assert';
import { ESwarmStoreConnector } from '../../../../../swarm-store-class/swarm-store-class.const';
import {
  ISwarmMessagesDatabaseMessagesCachedStoreCore,
  TSwarmMessagesDatabaseMessagesCachedStoreMessagesMetaHash,
} from '../../swarm-messages-database-messages-cached-store.types';
import {
  ISwarmMessagesDatabaseMessagesCacheStoreNonTemp,
  ISwarmMessagesDatabaseMessagesCacheMessageDescription,
} from '../../../swarm-messages-database-cache/swarm-messages-database-cache.types';
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
import { ISwarmMessageInstanceDecrypted } from '../../../../../swarm-message/swarm-message-constructor.types';
import { SWARM_MESSGES_DATABASE_SWARM_MESSAGES_CACHED_SWARM_MESSAGES_META_HASH_DELIMETER } from 'classes/swarm-messages-database/swarm-messages-database-subclasses/swarm-messages-database-messages-cached-store/swarm-messages-database-messages-cached-store.const';
import { whetherSwarmMessagesDecryptedAreEqual } from '../../../../../swarm-message/swarm-message-utils/swarm-message-utils-common/swarm-message-utils-common-decrypted';
import { TSwarmMessagesDatabaseMessagesCacheStore } from '../../../swarm-messages-database-cache/swarm-messages-database-cache.types';
import { ISwarmMessagesDatabaseMessagesCacheStoreExtendedDefferedMethods } from '../../swarm-messages-database-messages-cached-store.types';
import { ISwarmMessageStoreMessagingRequestWithMetaResult } from '../../../../../swarm-message-store/swarm-message-store.types';
import { _checkWhetherSameSwarmMessagesDecrypted } from '../../../swarm-messages-database-cache/swarm-messages-database-cache.utils';

export class SwarmMessagesDatabaseMessagesCachedStoreCore<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>,
  IsTemp extends boolean,
  MetaHash extends TSwarmMessagesDatabaseMessagesCachedStoreMessagesMetaHash
>
  implements
    Omit<
      ISwarmMessagesDatabaseMessagesCachedStoreCore<P, DbType, IsTemp>,
      'entriesCached' | 'get' | 'set' | 'unset' | 'updateWithEntries'
    > {
  public get isTemp(): IsTemp {
    return this._isTemp;
  }

  public get storeVersion() {
    return this._messagesCachedVersion;
  }

  protected _messagesCachedVersion: number = 0;

  protected _messagesCached = new Map<
    MetaHash,
    ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType>
  >();

  protected get _isInitialized(): boolean {
    return !!this._cachedStore;
  }

  constructor(
    protected _cachedStore: TSwarmMessagesDatabaseMessagesCacheStore<
      P,
      DbType,
      IsTemp
    >,
    protected _isTemp: IsTemp,
    protected _dbType: DbType,
    protected _dbName: string
  ) {}

  // eslint-disable-next-line @typescript-eslint/member-ordering
  add = (this._isTemp === true
    ? undefined
    : (
        entry: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType>
      ): void => {
        this._checkIsInitialized();
        this._checkEntryWithMeta(entry);
        if (this._whetherEntryIsExists(entry)) {
          return;
        }
        this._addDefferedReadEntryAfterCurrentBatchOfCacheUpdate(
          entry.messageMeta
        );
        this._addDefferedReadEntryAfterOverallCaheUpdate(entry.messageMeta);
      }) as ISwarmMessagesDatabaseMessagesCachedStoreCore<
    P,
    DbType,
    IsTemp
  >['add'];

  // eslint-disable-next-line @typescript-eslint/member-ordering
  remove = (this._isTemp === true
    ? undefined
    : (meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>): void => {
        this._checkIsInitialized();
        this._checkMeta(meta);
        this._addDefferedReadEntryAfterCurrentBatchOfCacheUpdate(meta);
        this._addDefferedReadEntryAfterOverallCaheUpdate(meta);
      }) as ISwarmMessagesDatabaseMessagesCachedStoreCore<
    P,
    DbType,
    IsTemp
  >['remove'];

  protected _beforeGet = (
    meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>
  ): void => {
    this._checkIsInitialized();
    this._checkMeta(meta);
  };

  protected _beforeSet = (
    entry: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType>
  ): void => {
    this._checkIsInitialized();
    this._checkEntryWithMeta(entry);
  };

  protected _beforeUnset = (
    meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>
  ): void => {
    this._checkIsInitialized();
    this._checkMeta(meta);
  };

  protected _whetherEntryIsExists(
    entry: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType>
  ): boolean {
    return false;
  }

  protected _checkIsInitialized(): this is {
    _cachedStore: ISwarmMessagesDatabaseMessagesCacheStoreExtendedDefferedMethods<
      P,
      DbType
    >;
  } {
    assert(this._cachedStore, 'The isnstance is not initialized');
    assert(
      typeof ((this._cachedStore as unknown) as any)
        ?._addToDefferedReadAfterCurrentCacheUpdateBatch === 'function',
      'The cached store should have the "_addToDefferedReadAfterCurrentCacheUpdateBatch" method'
    );
    assert(
      typeof ((this._cachedStore as unknown) as any)?._addToDefferedUpdate ===
        'function',
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

  protected _checkMeta(
    meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>
  ): void {
    assert(meta, 'The meta information must be defined');
    assert(typeof meta === 'object', 'The meta must be an object');
    assert(
      meta.messageUniqAddress,
      'The meta information must includes message address'
    );
  }

  protected _checkMessageEntry(message: ISwarmMessageInstanceDecrypted): void {
    isValidSwarmMessageDecryptedFormat(message);
  }

  protected _checkEntryWithMeta(
    entry: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType>
  ): void {
    assert(entry, 'The enty must be defined');
    assert(typeof entry === 'object', 'The enty must be an object');
    assert(entry.messageMeta, 'A meta information must be defined');
    assert(entry.messageEntry, 'A message must be defined');
    this._checkMeta(entry.messageMeta);
    this._checkMessageEntry(entry.messageEntry);
  }

  protected _getMetaHash(
    meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>
  ): MetaHash {
    return `${meta.messageUniqAddress}${SWARM_MESSGES_DATABASE_SWARM_MESSAGES_CACHED_SWARM_MESSAGES_META_HASH_DELIMETER}${meta.key}` as MetaHash;
  }

  protected _incMessagesInCacheVersion() {
    this._messagesCachedVersion += 1;
  }

  protected _incMessagesInCacheVersionIfMessagesNotEquals(
    entryFirst:
      | ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType>
      | undefined,
    entrySecond:
      | ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType>
      | undefined
  ) {
    if (entryFirst === entrySecond) {
      return;
    }
    if (
      (entryFirst && this._getMetaHash(entryFirst.messageMeta)) !==
      (entrySecond && this._getMetaHash(entrySecond.messageMeta))
    ) {
      this._incMessagesInCacheVersion();
    }
    if (
      whetherSwarmMessagesDecryptedAreEqual(
        entryFirst?.messageEntry,
        entrySecond?.messageEntry
      )
    ) {
      this._incMessagesInCacheVersion();
    }
  }

  protected _addDefferedReadEntryAfterCurrentBatchOfCacheUpdate(
    meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>
  ): void {
    if (this._checkIsInitialized()) {
      this._cachedStore._addToDefferedReadAfterCurrentCacheUpdateBatch(meta);
    }
  }

  protected _addDefferedReadEntryAfterOverallCaheUpdate(
    meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>
  ): void {
    if (this._checkIsInitialized()) {
      this._cachedStore._addToDefferedUpdate(meta);
    }
  }

  protected _checkWhetherUpdatValue(
    source:
      | ISwarmMessageStoreMessagingRequestWithMetaResult<ESwarmStoreConnector>
      | undefined,
    target:
      | ISwarmMessageStoreMessagingRequestWithMetaResult<ESwarmStoreConnector>
      | undefined
  ): boolean {
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
    key: string,
    value: ISwarmMessageStoreMessagingRequestWithMetaResult<
      ESwarmStoreConnector
    >,
    entriesCached: TSwarmMessageDatabaseMessagesCached<P, DbType>
  ) {
    return this._checkWhetherUpdatValue(entriesCached.get(key), value);
  }

  protected _clearEntriesCached(
    entriesCached: TSwarmMessageDatabaseMessagesCached<P, DbType>
  ) {
    entriesCached.clear();
  }

  protected _updateCacheWithEntries(
    entries: TSwarmMessageDatabaseMessagesCached<P, DbType>,
    entriesCached: TSwarmMessageDatabaseMessagesCached<P, DbType>
  ): boolean {
    let hasMessagesUpdated = false;
    this._clearEntriesCached(entriesCached);
    entries.forEach((value, key) => {
      if (!value) {
        return;
      }
      if (this._checkWhetherUpdateKey(key, value, entriesCached)) {
        entriesCached.set(key, value);
        hasMessagesUpdated = true;
      }
    });
    return hasMessagesUpdated;
  }
}
