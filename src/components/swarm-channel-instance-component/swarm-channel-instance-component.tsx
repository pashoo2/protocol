import React, { useCallback, useState } from 'react';
import { ISwarmMessagesChannel } from '../../classes/swarm-messages-channels/types/swarm-messages-channel-instance.types';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { TSwarmStoreDatabaseOptions } from '../../classes/swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnector } from '../../classes/swarm-store-class/swarm-store-class.const';
import { IConnectionBridgeOptionsDefault } from '../../classes/connection-bridge/types/connection-bridge.types';
import { SwarmChannelInstanceStateComponent as SwarmChannelInstanceSatusComponent } from './swarm-channel-instance-state-component';
import { SwarmChannelInstanceMessagesComponent } from './swarm-channel-instance-messages-component';
import { SwarmChannelInstanceSendMessageComponent } from './swarm-channel-instance-send-message-component';
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

interface ISwarmChannelInstanceComponentProps<
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

export function SwarmChannelInstanceComponent<
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
>({ swarmMessagesChannelInstance }: ISwarmChannelInstanceComponentProps<DbType, DBO, CBO, CD, MD, T>) {
  const [swarmMessagesChannelHandled] = useState(swarmMessagesChannelInstance);
  const [stateVersion, setStateVersion] = useState(0);
  const onSwarmChannelStateChange = useCallback(() => {
    setStateVersion((currentStateVersion) => currentStateVersion + 1);
  }, []);
  return (
    <>
      <SwarmChannelInstanceSatusComponent
        swarmMessagesChannelInstance={swarmMessagesChannelHandled}
        onChannelStateChange={onSwarmChannelStateChange}
      />
      <hr />
      <SwarmChannelInstanceSendMessageComponent swarmMessagesChannelInstance={swarmMessagesChannelHandled} />
      <hr />
      <SwarmChannelInstanceMessagesComponent swarmMessagesChannelInstance={swarmMessagesChannelHandled} />
    </>
  );
}
