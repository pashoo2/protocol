import React, { useEffect, useState } from 'react';
import { ISwarmMessagesChannel } from '../../classes/swarm-messages-channels/types/swarm-messages-channel-instance.types';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { TSwarmStoreDatabaseOptions } from '../../classes/swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnector } from '../../classes/swarm-store-class/swarm-store-class.const';
import { IConnectionBridgeOptionsDefault } from '../../classes/connection-bridge/types/connection-bridge.types';
import { ESwarmMessagesChannelEventName } from '../../classes/swarm-messages-channels/types/swarm-messages-channel-events.types';
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

interface ISwarmChannelInstanceStateComponentProps<
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
  onChannelStateChange?(): void;
}

export function SwarmChannelInstanceStateComponent<
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
  onChannelStateChange,
}: ISwarmChannelInstanceStateComponentProps<DbType, DBO, CBO, CD, MD, T>): React.ReactElement {
  const [currentSwarmMessagesChannelInstance] = useState(swarmMessagesChannelInstance);
  const [isChannelReady, setChannelIsReady] = useState(false);
  const [isChannelClosed, setChannelIsClosed] = useState(false);

  const {
    dbType,
    id,
    isReady,
    markedAsRemoved,
    channelInactiveReasonError,
    emitterChannelState,
  } = currentSwarmMessagesChannelInstance;
  const channelCurrentStatus = isReady ? 'ready' : isChannelClosed ? 'closed' : 'not ready yet';

  useEffect(() => {
    function handleSwarmMessagesChannelInstanceIsReady(): void {
      setChannelIsReady(true);
      onChannelStateChange?.();
    }
    function handleSwarmMessagesChannelInstanceIsClosed(): void {
      setChannelIsReady(false);
      setChannelIsClosed(true);
      onChannelStateChange?.();
    }
    function setOrUnsetListeners(ifSetListeners: boolean): void {
      const methodName = ifSetListeners ? 'addListener' : 'removeListener';
      emitterChannelState[methodName](ESwarmMessagesChannelEventName.CHANNEL_OPEN, handleSwarmMessagesChannelInstanceIsReady);
      emitterChannelState[methodName](ESwarmMessagesChannelEventName.CHANNEL_CLOSED, handleSwarmMessagesChannelInstanceIsClosed);
    }
    setOrUnsetListeners(true);
    return function clearSwarmMessagesInstanceEventsHandler() {
      setOrUnsetListeners(false);
    };
  }, [emitterChannelState, onChannelStateChange]);
  return (
    <div>
      <p>Swarm channel:</p>
      <p>Id: {id}</p>
      <p>Database type: {dbType}</p>
      <p>Status: {channelCurrentStatus}</p>
      {markedAsRemoved ? <p>Channel is marked as removed</p> : null}
      {channelInactiveReasonError && (
        <p>Error has occured: {channelInactiveReasonError} and therefore the channel has been closed</p>
      )}
    </div>
  );
}
