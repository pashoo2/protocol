import { SwarmMessagesDatabaseMessagesCachedStoreCore } from '../swarm-messages-database-messages-cached-store-core/swarm-messages-database-messages-cached-store-core';
import { ESwarmStoreConnector } from '../../../../../swarm-store-class/swarm-store-class.const';
import { TSwarmMessagesDatabaseMessagesCachedStoreMessagesMetaHash } from '../../swarm-messages-database-messages-cached-store.types';
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
> extends SwarmMessagesDatabaseMessagesCachedStoreCore<
  P,
  ESwarmStoreConnectorOrbitDbDatabaseType.FEED,
  IsTemp,
  TSwarmMessagesDatabaseMessagesCachedStoreMessagesMetaHash
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

  set = (
    entry: ISwarmMessagesDatabaseMessagesCacheMessageDescription<
      P,
      ESwarmStoreConnectorOrbitDbDatabaseType.FEED
    >
  ): void => {
    super.set(entry);
    this._setMessageInEntriesCached(entry);
  };

  unset = (
    meta: ISwarmMessagesDatabaseMesssageMeta<
      P,
      ESwarmStoreConnectorOrbitDbDatabaseType.FEED
    >
  ): void => {
    super.unset(meta);
    this._unsetMessageInEntriesCached(meta);
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
    this.entriesCached.set(address, this._getMessageInfo(entry));
  }
}
