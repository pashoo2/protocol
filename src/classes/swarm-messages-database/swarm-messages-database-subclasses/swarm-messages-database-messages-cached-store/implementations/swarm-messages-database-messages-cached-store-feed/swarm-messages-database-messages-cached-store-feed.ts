import { SwarmMessagesDatabaseMessagesCachedStoreCore } from '../swarm-messages-database-messages-cached-store-core/swarm-messages-database-messages-cached-store-core';
import { ESwarmStoreConnector } from '../../../../../swarm-store-class/swarm-store-class.const';
import {
  TSwarmMessagesDatabaseMessagesCachedStoreMessagesMetaHash,
  ISwarmMessagesDatabaseMessagesCachedStoreCore,
} from '../../swarm-messages-database-messages-cached-store.types';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { ISwarmMessagesDatabaseMessagesCacheMessageDescription } from '../../../swarm-messages-database-cache/swarm-messages-database-cache.types';
import {
  ISwarmMessagesDatabaseMesssageMeta,
  TSwarmMessageDatabaseMessagesCached,
} from '../../../../swarm-messages-database.types';
import { ISwarmMessageStoreMessagingRequestWithMetaResult } from '../../../../../swarm-message-store/types/swarm-message-store.types';
import { ISwarmMessageInstanceDecrypted } from '../../../../../swarm-message/swarm-message-constructor.types';
import assert from 'assert';

export class SwarmMessagesDatabaseMessagesCachedStoreFeed<
    P extends ESwarmStoreConnector,
    MD extends ISwarmMessageInstanceDecrypted,
    IsTemp extends boolean
  >
  extends SwarmMessagesDatabaseMessagesCachedStoreCore<
    P,
    ESwarmStoreConnectorOrbitDbDatabaseType.FEED,
    MD,
    IsTemp,
    TSwarmMessagesDatabaseMessagesCachedStoreMessagesMetaHash
  >
  implements ISwarmMessagesDatabaseMessagesCachedStoreCore<P, ESwarmStoreConnectorOrbitDbDatabaseType.FEED, MD, IsTemp> {
  get entriesCached(): TSwarmMessageDatabaseMessagesCached<P, ESwarmStoreConnectorOrbitDbDatabaseType.FEED, MD> {
    return this._entriesCached;
  }
  protected _entriesCached = new Map() as TSwarmMessageDatabaseMessagesCached<
    P,
    ESwarmStoreConnectorOrbitDbDatabaseType.FEED,
    MD
  >;

  get = (
    meta: ISwarmMessagesDatabaseMesssageMeta<P, ESwarmStoreConnectorOrbitDbDatabaseType.FEED>
  ): ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD> | undefined => {
    this._beforeGet(meta);
    return this._getMessageCachedByMeta(meta);
  };

  set = (entry: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, ESwarmStoreConnectorOrbitDbDatabaseType.FEED>): void => {
    this._beforeSet(entry);
    this._setMessageInEntriesCached(entry);
  };

  unset = (meta: ISwarmMessagesDatabaseMesssageMeta<P, ESwarmStoreConnectorOrbitDbDatabaseType.FEED>): void => {
    this._beforeUnset(meta);
    this._unsetMessageInEntriesCached(meta);
  };

  // eslint-disable-next-line @typescript-eslint/member-ordering
  updateWithEntries(entries: TSwarmMessageDatabaseMessagesCached<P, ESwarmStoreConnectorOrbitDbDatabaseType.FEED, MD>): boolean {
    // TODO - maybe it's better to create a copy of the map and set the new map instead of updating the existing
    const hasUpdatedMessages = this._updateCacheWithEntries(entries, this._entriesCached);

    if (hasUpdatedMessages) {
      this._incMessagesInCacheVersion();
    }
    return hasUpdatedMessages;
  }

  clear() {
    this._entriesCached.clear();
  }

  protected _whetherEntryIsExistsInCache(
    entry: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, ESwarmStoreConnectorOrbitDbDatabaseType.FEED>
  ): boolean {
    return !!this._getMessageCachedByMeta(entry.messageMeta);
  }

  protected _getMessageCachedByMeta = (
    meta: ISwarmMessagesDatabaseMesssageMeta<P, ESwarmStoreConnectorOrbitDbDatabaseType.FEED>
  ): ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD> | undefined => {
    const messageAddress = this._getMessageAddressFromMeta(meta);

    if (!messageAddress) {
      console.warn('Failed to get message address by meta');
      return;
    }
    return this._entriesCached.get(messageAddress);
  };

  protected _getMessageInfo(
    entry: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, ESwarmStoreConnectorOrbitDbDatabaseType.FEED>
  ): Omit<ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD>, 'key'> {
    const { messageMeta: meta, messageEntry: message } = entry;
    const address = this._getMessageAddressFromMeta(meta);

    if (!address) {
      throw new Error('A message add must be defined');
    }
    const messageDecrypted = message as MD;
    return {
      dbName: this._dbName,
      message: messageDecrypted,
      messageAddress: address,
    };
  }

  protected _unsetMessageInEntriesCached(
    meta: ISwarmMessagesDatabaseMesssageMeta<P, ESwarmStoreConnectorOrbitDbDatabaseType.FEED>
  ): void {
    const address = this._getMessageAddressFromMeta(meta);

    if (!address) {
      throw new Error('A message add must be defined');
    }
    this.entriesCached.delete(address);
  }

  protected _setMessageInEntriesCached(
    entry: ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, ESwarmStoreConnectorOrbitDbDatabaseType.FEED>
  ): void {
    const { messageMeta } = entry;
    const address = this._getMessageAddressFromMeta(messageMeta);

    if (!address) {
      throw new Error('An address must not be empty');
    }
    this._entriesCached.set(address, this._getMessageInfo(entry));
  }

  protected _checkMeta(meta: ISwarmMessagesDatabaseMesssageMeta<P, ESwarmStoreConnectorOrbitDbDatabaseType.FEED>): void {
    super._checkMeta(meta);
    assert(meta.messageUniqAddress, 'The meta information must includes message address');
  }
}
