import React from 'react';

import { ConnectToSwarm } from '../connect-to-swarm/connect-to-swarm';
import { TSwarmStoreDatabaseType, TSwarmStoreDatabaseOptions } from '../../classes/swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnector } from '../../classes/swarm-store-class/swarm-store-class.const';
import { TSwarmMessageSerialized } from '../../classes/swarm-message/swarm-message-constructor.types';
import { IConnectionBridgeOptionsDefault } from '../../classes/connection-bridge/connection-bridge.types';
import { IUserCredentialsCommon } from '../../types/credentials.types';
import { TSwarmMessageUserIdentifierSerialized } from '../../classes/swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';

type P = ESwarmStoreConnector.OrbitDB;

type TConnectToSwarmImmediateProps<
  DbType extends TSwarmStoreDatabaseType<P>,
  T extends TSwarmMessageSerialized,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  CBO extends IConnectionBridgeOptionsDefault<P, T, DbType, any>
> = {
  dbOptions: DBO;
  connectionBridgeOptions: CBO;
  userCredentials: IUserCredentialsCommon;
  userIdReceiverSwarmMessages: TSwarmMessageUserIdentifierSerialized;
};

const CREDENTIALS: IUserCredentialsCommon[] = [];

export class ConnectToSwarmImmediate<
  DbType extends TSwarmStoreDatabaseType<P>,
  T extends TSwarmMessageSerialized,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  CBO extends IConnectionBridgeOptionsDefault<P, T, DbType, any>
> extends React.Component<TConnectToSwarmImmediateProps<DbType, T, DBO, CBO>> {
  render() {
    const { dbOptions, connectionBridgeOptions, userCredentials, userIdReceiverSwarmMessages } = this.props;
    return (
      <ConnectToSwarm<DbType, T, DBO, CBO>
        connectionBridgeOptions={connectionBridgeOptions}
        userCredentialsList={CREDENTIALS}
        userCredentialsToConnectImmediate={userCredentials}
        dbo={dbOptions}
        userIdReceiverSwarmMessages={userIdReceiverSwarmMessages}
      />
    );
  }
}
