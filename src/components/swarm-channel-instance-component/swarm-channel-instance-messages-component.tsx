import React, { useEffect, useState } from 'react';
import { ISwarmMessagesChannel } from '../../classes/swarm-messages-channels/types/swarm-messages-channel-instance.types';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { TSwarmStoreDatabaseOptions } from '../../classes/swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnector } from '../../classes/swarm-store-class/swarm-store-class.const';
import { IConnectionBridgeOptionsDefault } from '../../classes/connection-bridge/types/connection-bridge.types';
import { ESwarmMessageStoreEventNames } from '../../classes/swarm-message-store/swarm-message-store.const';
import { ESwarmMessagesDatabaseCacheEventsNames } from '../../classes/swarm-messages-database/swarm-messages-database.const';
import { ISwarmMessageStoreMessagingRequestWithMetaResult } from '../../classes/swarm-message-store/types/swarm-message-store.types';
import { SwarmChannelInstanceMessageComponent } from './swarm-channel-instance-message-with-meta-component';
import {
  TConnectionBridgeOptionsSwarmMessageStoreOptionsWithConnectorFabric,
  TConnectionBridgeOptionsSwarmMessageStoreInstance,
} from '../../classes/connection-bridge/types/connection-bridge.types-helpers/connection-bridge-options.types-helpers';
import {
  TConnectionBridgeOptionsConstructorWithEncryptedCacheFabric,
  TConnectionBridgeOptionsAccessControlOptions,
} from '../../classes/connection-bridge/types/connection-bridge.types-helpers/connection-bridge-options.types-helpers';
import {
  TConnectionBridgeOptionsConnectorFabricOptions,
  TConnectionBridgeOptionsGrandAccessCallback,
} from '../../classes/connection-bridge/types/connection-bridge.types-helpers/connection-bridge-options.types-helpers';
import {
  TConnectionBridgeOptionsProviderOptions,
  TConnectionBridgeOptionsConnectorMain,
} from '../../classes/connection-bridge/types/connection-bridge.types-helpers/connection-bridge-options.types-helpers';
import {
  TConnectionBridgeOptionsConnectorBasic,
  TConnectionBridgeOptionsConnectorConnectionOptions,
} from '../../classes/connection-bridge/types/connection-bridge.types-helpers/connection-bridge-options.types-helpers';
import {
  ISwarmMessageInstanceDecrypted,
  TSwarmMessageSerialized,
} from '../../classes/swarm-message/swarm-message-constructor.types';

type P = ESwarmStoreConnector.OrbitDB;

interface ISwarmChannelInstanceMessagesComponentProps<
  DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  CBO extends IConnectionBridgeOptionsDefault<
    P,
    T,
    DbType,
    CD,
    DBO,
    MD,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >,
  CD extends boolean = boolean,
  MD extends ISwarmMessageInstanceDecrypted = ISwarmMessageInstanceDecrypted,
  T extends TSwarmMessageSerialized = TSwarmMessageSerialized
> {
  swarmMessagesChannelInstance: ISwarmMessagesChannel<
    P,
    T,
    DbType,
    DBO,
    TConnectionBridgeOptionsConnectorBasic<CBO>,
    TConnectionBridgeOptionsConnectorConnectionOptions<CBO>,
    TConnectionBridgeOptionsProviderOptions<CBO>,
    TConnectionBridgeOptionsConnectorMain<CBO>,
    TConnectionBridgeOptionsConnectorFabricOptions<CBO>,
    TConnectionBridgeOptionsGrandAccessCallback<CBO>,
    TConnectionBridgeOptionsConstructorWithEncryptedCacheFabric<CBO>,
    TConnectionBridgeOptionsAccessControlOptions<CBO>,
    TConnectionBridgeOptionsSwarmMessageStoreOptionsWithConnectorFabric<CBO>,
    TConnectionBridgeOptionsSwarmMessageStoreInstance<CBO>,
    MD
  >;
}

export function SwarmChannelInstanceMessagesComponent<
  DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  CBO extends IConnectionBridgeOptionsDefault<
    P,
    T,
    DbType,
    CD,
    DBO,
    MD,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >,
  CD extends boolean = boolean,
  MD extends ISwarmMessageInstanceDecrypted = ISwarmMessageInstanceDecrypted,
  T extends TSwarmMessageSerialized = TSwarmMessageSerialized
>({
  swarmMessagesChannelInstance,
}: ISwarmChannelInstanceMessagesComponentProps<DbType, DBO, CBO, CD, MD, T>): React.ReactElement {
  const [messagesWithMetaCachedList, setMessagesWithMetaCached] = useState<
    ISwarmMessageStoreMessagingRequestWithMetaResult<ESwarmStoreConnector, MD>[] | null
  >(null);

  useEffect(() => {
    const emitterChannelMessagesDatabase = swarmMessagesChannelInstance.emitterChannelMessagesDatabase;

    function swarmMessagesUpdate(dbName: DBO['dbName'], message: MD): void {
      const cachedMessages = swarmMessagesChannelInstance.cachedMessages;
      if (cachedMessages) {
        let cachedMessageDescription;
        const messagesList = [];

        for (cachedMessageDescription of cachedMessages.values()) {
          messagesList.push(cachedMessageDescription);
        }
        setMessagesWithMetaCached(messagesList);
      }
    }

    emitterChannelMessagesDatabase.on(ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATED, swarmMessagesUpdate);
    return () => {
      emitterChannelMessagesDatabase.off(ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATED, swarmMessagesUpdate);
    };
  });

  if (!messagesWithMetaCachedList || !messagesWithMetaCachedList.length) {
    return <p>There are no swarm messages here yet</p>;
  }
  return (
    <div>
      <p>Swarm channel messages:</p>
      {messagesWithMetaCachedList.map((messageWithMeta, idx) => {
        const { message, messageAddress } = messageWithMeta;
        const key = message instanceof Error ? (messageAddress instanceof Error ? idx : messageAddress) : message.sig;
        return <SwarmChannelInstanceMessageComponent key={key} swarmMessageWithMeta={messageWithMeta} />;
      })}
    </div>
  );
}
