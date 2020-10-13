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
import { ISwarmMessageStoreMessagingRequestWithMetaResult } from '../../../../../swarm-message-store/swarm-message-store.types';

export class SwarmMessagesDatabaseMessagesCachedStoreFeed<
  P extends ESwarmStoreConnector,
  IsTemp extends boolean
>
  extends SwarmMessagesDatabaseMessagesCachedStoreCore<
    P,
    ESwarmStoreConnectorOrbitDbDatabaseType.FEED,
    IsTemp,
    TSwarmMessagesDatabaseMessagesCachedStoreMessagesMetaHash
  >
  implements
    ISwarmMessagesDatabaseMessagesCachedStoreCore<
      P,
      ESwarmStoreConnectorOrbitDbDatabaseType.FEED,
      IsTemp
    > {
  get entriesCached(): TSwarmMessageDatabaseMessagesCached<
    P,
    ESwarmStoreConnectorOrbitDbDatabaseType.FEED
  > {
    return this._entriesCached;
  }
  protected _entriesCached = new Map() as TSwarmMessageDatabaseMessagesCached<
    P,
    ESwarmStoreConnectorOrbitDbDatabaseType.FEED
  >;

  get = (
    meta: ISwarmMessagesDatabaseMesssageMeta<
      P,
      ESwarmStoreConnectorOrbitDbDatabaseType.FEED
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
      ESwarmStoreConnectorOrbitDbDatabaseType.FEED
    >
  ): void => {
    this._beforeSet(entry);
    this._setMessageInEntriesCached(entry);
  };

  unset = (
    meta: ISwarmMessagesDatabaseMesssageMeta<
      P,
      ESwarmStoreConnectorOrbitDbDatabaseType.FEED
    >
  ): void => {
    this._beforeUnset(meta);
    this._unsetMessageInEntriesCached(meta);
  };

  // eslint-disable-next-line @typescript-eslint/member-ordering
  updateWithEntries = (this._isTemp === true
    ? undefined
    : (
        entries: TSwarmMessageDatabaseMessagesCached<
          P,
          ESwarmStoreConnectorOrbitDbDatabaseType.FEED
        >
      ): void => {
        this._updateCacheWithEntries(entries);
        this._incMessagesInCacheVersion();
      }) as ISwarmMessagesDatabaseMessagesCachedStoreCore<
    P,
    ESwarmStoreConnectorOrbitDbDatabaseType.FEED,
    IsTemp
  >['updateWithEntries'];

  protected _whetherEntryIsExists(
    entry: ISwarmMessagesDatabaseMessagesCacheMessageDescription<
      P,
      ESwarmStoreConnectorOrbitDbDatabaseType.FEED
    >
  ): boolean {
    return !!this._getMessageCachedByMeta(entry.messageMeta);
  }

  protected _getMessageCachedByMeta = (
    meta: ISwarmMessagesDatabaseMesssageMeta<
      P,
      ESwarmStoreConnectorOrbitDbDatabaseType.FEED
    >
  ):
    | ISwarmMessageStoreMessagingRequestWithMetaResult<ESwarmStoreConnector>
    | undefined => {
    const messageAddress = this._getMessageAddressFromMeta(meta);

    if (!messageAddress) {
      console.warn('Failed to get message address by meta');
      return;
    }
    return this._entriesCached.get(messageAddress);
  };

  protected _getMessageInfo(
    entry: ISwarmMessagesDatabaseMessagesCacheMessageDescription<
      P,
      ESwarmStoreConnectorOrbitDbDatabaseType.FEED
    >
  ): Omit<ISwarmMessageStoreMessagingRequestWithMetaResult<P>, 'key'> {
    const { messageMeta: meta, messageEntry: message } = entry;
    const address = this._getMessageAddressFromMeta(meta);

    if (!address) {
      throw new Error('A message add must be defined');
    }
    return {
      dbName: this._dbName,
      message,
      messageAddress: address,
    };
  }

  protected _unsetMessageInEntriesCached(
    meta: ISwarmMessagesDatabaseMesssageMeta<
      P,
      ESwarmStoreConnectorOrbitDbDatabaseType.FEED
    >
  ): void {
    const address = this._getMessageAddressFromMeta(meta);

    if (!address) {
      throw new Error('A message add must be defined');
    }
    this.entriesCached.delete(address);
  }

  protected _setMessageInEntriesCached(
    entry: ISwarmMessagesDatabaseMessagesCacheMessageDescription<
      P,
      ESwarmStoreConnectorOrbitDbDatabaseType.FEED
    >
  ): void {
    const { messageMeta } = entry;
    const address = this._getMessageAddressFromMeta(messageMeta);

    if (!address) {
      throw new Error('An address must not be empty');
    }
    this._entriesCached.set(address, this._getMessageInfo(entry));
  }

  protected _clearEntriesCached() {
    this._entriesCached.clear();
  }

  protected _updateCacheWithEntries(
    entries: TSwarmMessageDatabaseMessagesCached<
      P,
      ESwarmStoreConnectorOrbitDbDatabaseType.FEED
    >
  ): void {
    this._clearEntriesCached();
    entries.forEach((value) => this._entriesCached.set(key, value));
  }
}
