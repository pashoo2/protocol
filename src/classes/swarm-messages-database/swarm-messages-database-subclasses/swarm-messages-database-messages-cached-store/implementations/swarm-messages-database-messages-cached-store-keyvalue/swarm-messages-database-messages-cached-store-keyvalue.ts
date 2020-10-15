import assert from 'assert';
import { SwarmMessagesDatabaseMessagesCachedStoreCore } from '../swarm-messages-database-messages-cached-store-core/swarm-messages-database-messages-cached-store-core';
import { ESwarmStoreConnector } from '../../../../../swarm-store-class/swarm-store-class.const';
import {
  TSwarmMessagesDatabaseMessagesCachedStoreMessagesMetaHash,
  ISwarmMessagesDatabaseMessagesCachedStoreCore,
} from '../../swarm-messages-database-messages-cached-store.types';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import {
  ISwarmMessagesDatabaseMesssageMeta,
  TSwarmMessageDatabaseMessagesCached,
} from '../../../../swarm-messages-database.types';
import { ISwarmMessagesDatabaseMessagesCacheMessageDescription } from '../../../swarm-messages-database-cache/swarm-messages-database-cache.types';
import { ISwarmMessageStoreMessagingRequestWithMetaResult } from '../../../../../swarm-message-store/swarm-message-store.types';

export class SwarmMessagesDatabaseMessagesCachedStoreKeyValue<
  P extends ESwarmStoreConnector,
  IsTemp extends boolean
>
  extends SwarmMessagesDatabaseMessagesCachedStoreCore<
    P,
    ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE,
    IsTemp,
    TSwarmMessagesDatabaseMessagesCachedStoreMessagesMetaHash
  >
  implements
    ISwarmMessagesDatabaseMessagesCachedStoreCore<
      P,
      ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE,
      IsTemp
    > {
  get entriesCached(): TSwarmMessageDatabaseMessagesCached<
    P,
    ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
  > {
    return this._entriesCached;
  }
  protected _entriesCached = new Map() as TSwarmMessageDatabaseMessagesCached<
    P,
    ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
  >;

  get = (
    meta: ISwarmMessagesDatabaseMesssageMeta<
      P,
      ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
    >
  ):
    | ISwarmMessageStoreMessagingRequestWithMetaResult<ESwarmStoreConnector>
    | undefined => {
    this._beforeGet(meta);
    return this._getMessageCachedByMeta(meta);
  };

  set = (
    entry: ISwarmMessagesDatabaseMessagesCacheMessageDescription<
      P,
      ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
    >
  ): void => {
    this._beforeSet(entry);
    this._setMessageInEntriesCached(entry);
    this._incMessagesInCacheVersion();
  };

  unset = (
    meta: ISwarmMessagesDatabaseMesssageMeta<
      P,
      ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
    >
  ): void => {
    this._beforeUnset(meta);
    this._unsetMessageInEntriesCached(meta);
    this._incMessagesInCacheVersion();
  };

  // eslint-disable-next-line @typescript-eslint/member-ordering
  updateWithEntries(
    entries: TSwarmMessageDatabaseMessagesCached<
      P,
      ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
    >
  ): boolean {
    const hasUpdatedMessages = this._updateCacheWithEntries(
      entries,
      this._entriesCached
    );

    this._incMessagesInCacheVersion();
    return hasUpdatedMessages;
  }

  protected _whetherEntryIsExists(
    entry: ISwarmMessagesDatabaseMessagesCacheMessageDescription<
      P,
      ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
    >
  ): boolean {
    return !!this._getMessageCachedByMeta(entry.messageMeta);
  }

  protected _checkMeta(
    meta: ISwarmMessagesDatabaseMesssageMeta<
      P,
      ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
    >
  ): void {
    super._checkMeta(meta);
    assert(meta.key, 'Key must be defined in meta information');
  }

  protected _getMessageCachedByMeta(
    meta: ISwarmMessagesDatabaseMesssageMeta<
      P,
      ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
    >
  ):
    | ISwarmMessageStoreMessagingRequestWithMetaResult<ESwarmStoreConnector>
    | undefined {
    this._checkMeta(meta);

    const messageKey = this._getMessageKeyFromMeta(meta);

    if (!messageKey) {
      console.warn('Message key is absent in meta information');
      return;
    }
    return this._entriesCached.get(messageKey);
  }

  protected _getMessageInfo(
    entry: ISwarmMessagesDatabaseMessagesCacheMessageDescription<
      P,
      ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
    >
  ): Required<ISwarmMessageStoreMessagingRequestWithMetaResult<P>> {
    const { messageMeta: meta, messageEntry: message } = entry;
    const key = this._getMessageKeyFromMeta(meta);
    const address = this._getMessageAddressFromMeta(meta);

    if (!key) {
      throw new Error('A key must be defined');
    }
    if (!address) {
      throw new Error('A message add must be defined');
    }
    return {
      dbName: this._dbName,
      message,
      key,
      messageAddress: address,
    };
  }

  protected _unsetMessageInEntriesCached(
    meta: ISwarmMessagesDatabaseMesssageMeta<
      P,
      ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
    >
  ): void {
    const key = this._getMessageAddressFromMeta(meta);
    if (!key) {
      throw new Error('A key is not defined');
    }
    this.entriesCached.delete(key);
  }

  protected _setMessageInEntriesCached(
    entry: ISwarmMessagesDatabaseMessagesCacheMessageDescription<
      P,
      ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
    >
  ): void {
    const { messageMeta } = entry;
    const key = this._getMessageKeyFromMeta(messageMeta);

    if (!key) {
      throw new Error('A key is not defined');
    }
    this.entriesCached.set(key, this._getMessageInfo(entry));
  }

  protected _checkWhetherUpdateKey(
    key: string,
    value: ISwarmMessageStoreMessagingRequestWithMetaResult<
      ESwarmStoreConnector
    >
  ) {
    return this._checkWhetherUpdatValue(this._entriesCached.get(key), value);
  }
}
