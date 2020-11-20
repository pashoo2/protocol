import React from 'react';

import { ConnectToSwarm } from '../connect-to-swarm/connect-to-swarm';
import { TSwarmStoreDatabaseType, TSwarmStoreDatabaseOptions } from '../../classes/swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnector } from '../../classes/swarm-store-class/swarm-store-class.const';
import { TSwarmMessageSerialized } from '../../classes/swarm-message/swarm-message-constructor.types';
import { IConnectionBridgeOptionsDefault } from '../../classes/connection-bridge/connection-bridge.types';
import { CONNECT_TO_SWARM_IMMEDIATE_CREDENTIALS_VARIANT } from './connect-to-swarm-immediate.const';

type P = ESwarmStoreConnector.OrbitDB;

type TConnectToSwarmImmediateProps<
  DbType extends TSwarmStoreDatabaseType<P>,
  T extends TSwarmMessageSerialized,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  CBO extends IConnectionBridgeOptionsDefault<P, T, DbType, any>
> = {
  dbOptions: DBO;
  connectionBridgeOptions: CBO;
};

export class ConnectToSwarmImmediate<
  DbType extends TSwarmStoreDatabaseType<P>,
  T extends TSwarmMessageSerialized,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  CBO extends IConnectionBridgeOptionsDefault<P, T, DbType, any>
> extends React.Component<TConnectToSwarmImmediateProps<DbType, T, DBO, CBO>> {
  render() {
    const { dbOptions, connectionBridgeOptions } = this.props;
    return (
      <ConnectToSwarm<DbType, T, DBO, CBO>
        connectionBridgeOptions={connectionBridgeOptions}
        connectImmediateWithCredentials={CONNECT_TO_SWARM_IMMEDIATE_CREDENTIALS_VARIANT}
        dbOptionsToConnectImmediate={dbOptions}
        dboMain={undefined}
        dbo1={undefined}
        dbo2={undefined}
      />
    );
  }
}
