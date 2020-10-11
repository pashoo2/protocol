import assert from 'assert';
import { ESwarmStoreConnector } from '../../../../../swarm-store-class/swarm-store-class.const';
import {
  ISwarmMessagesDatabaseMessagesCachedStoreCore,
  TSwarmMessagesDatabaseMessagesCachedStoreMessagesMetaHash,
  ISwarmMessagesDatabaseMessagesCacheStoreExtendedDefferedMethods,
} from '../../swarm-messages-database-messages-cached-store.types';
import {
  ISwarmMessagesDatabaseMessagesCacheStore,
  ISwarmMessagesDatabaseMessagesCacheMessageDescription,
} from '../../../swarm-messages-database-cache/swarm-messages-database-cache.types';
import { ISwarmMessagesDatabaseMesssageMeta } from '../../../../swarm-messages-database.types';
import {
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseEntityKey,
  TSwarmStoreDatabaseEntityAddress,
} from '../../../../../swarm-store-class/swarm-store-class.types';
import { isValidSwarmMessageDecryptedFormat } from '../../../../../swarm-message-store/swarm-message-store-utils/swarm-message-store-validators/swarm-message-store-validator-swarm-message';
import { ISwarmMessageInstanceDecrypted } from '../../../../../swarm-message/swarm-message-constructor.types';
import { SWARM_MESSGES_DATABASE_SWARM_MESSAGES_CACHED_SWARM_MESSAGES_META_HASH_DELIMETER } from 'classes/swarm-messages-database/swarm-messages-database-subclasses/swarm-messages-database-messages-cached-store/swarm-messages-database-messages-cached-store.const';
import { whetherSwarmMessagesDecryptedAreEqual } from '../../../../../swarm-message/swarm-message-utils/swarm-message-utils-common/swarm-message-utils-common-decrypted';
import { memoizeLastReturnedValue } from '../../../../../../utils/data-cache-utils/data-cache-utils-memoization';
import { isDefined } from '../../../../../../utils/common-utils/common-utils-main';

export class SwarmMessagesDatabaseMessagesCachedStoreCore<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>,
  IsTemp extends boolean,
  MetaHash extends TSwarmMessagesDatabaseMessagesCachedStoreMessagesMetaHash
>
  implements
    Omit<
      ISwarmMessagesDatabaseMessagesCachedStoreCore<P, DbType, IsTemp>,
      'entriesCached'
    > {
  public get entries() {
    return this._entries(this._messagesCachedVersion);
  }

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

  protected _entries = memoizeLastReturnedValue((version) => {
    return Array.from(this._messagesCached.values()).filter(isDefined);
  });

  protected get _isInitialized(): boolean {
    return !!this._cachedStore;
  }

  constructor(
    protected _cachedStore: ISwarmMessagesDatabaseMessagesCacheStoreExtendedDefferedMethods<
      P,
      DbType,
      IsTemp
    >,
    protected _dbType: DbType,
    protected _isTemp: IsTemp,
    protected _dbName: string
  ) {}

  get = (
    meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>
  ):
    | ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType>
    | undefined => {
    this._checkIsInitialized();
    this._checkMeta(meta);
    return this._getEntryFromCache(meta);
  };

  set = (
    entry: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType>
  ): void => {
    this._checkIsInitialized();
    this._checkEntryWithMeta(entry);
    this._setEntryInCache(entry);
  };

  unset = (meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>): void => {
    this._checkIsInitialized();
    this._checkMeta(meta);
    this._unsetEntryInCache(meta);
  };

  // eslint-disable-next-line @typescript-eslint/member-ordering
  add = (this._isTemp === true
    ? undefined
    : (
        entry: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType>
      ): void => {
        this._checkIsInitialized();
        this._checkEntryWithMeta(entry);
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

  protected _checkIsInitialized(): this is {
    _cachedStore: ISwarmMessagesDatabaseMessagesCacheStore<P, DbType, IsTemp>;
  } {
    assert(this._cachedStore, 'The isnstance is not initialized');
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

  protected _getEntryFromCache(
    meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>
  ):
    | ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType>
    | undefined {
    return this._messagesCached.get(this._getMetaHash(meta));
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

  protected _setEntryInCache(
    entry: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType>
  ): void {
    const entryExisting = this._getEntryFromCache(entry.messageMeta);

    this._messagesCached.set(this._getMetaHash(entry.messageMeta), entry);
    this._incMessagesInCacheVersionIfMessagesNotEquals(entryExisting, entry);
  }

  protected _unsetEntryInCache(
    meta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>
  ) {
    const entryExisting = this._getEntryFromCache(meta);

    this._messagesCached.delete(this._getMetaHash(meta));
    if (entryExisting) {
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
}
