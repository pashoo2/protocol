import React from 'react';

import { ConnectToSwarm } from '../connect-to-swarm/connect-to-swarm';
import { TSwarmStoreDatabaseType, TSwarmStoreDatabaseOptions } from '../../classes/swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnector } from '../../classes/swarm-store-class/swarm-store-class.const';
import {
  TSwarmMessageSerialized,
  TSwarmMessageInstance,
  ISwarmMessageInstanceDecrypted,
} from '../../classes/swarm-message/swarm-message-constructor.types';
import { IConnectionBridgeOptionsDefault } from '../../classes/connection-bridge/connection-bridge.types';
import { IUserCredentialsCommon } from '../../types/credentials.types';
import { TSwarmMessageUserIdentifierSerialized } from '../../classes/swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';
import {
  ISwarmMessagesDatabaseCacheOptions,
  ISwarmMessagesDatabaseCache,
  ISwarmMessagesDatabaseCacheConstructor,
} from '../../classes/swarm-messages-database/swarm-messages-database.types';
import {
  ISwarmMessagesDatabaseConnectOptionsSwarmMessagesCacheOptions,
  ISwarmMessagesDatabaseMessagesCollector,
} from '../../classes/swarm-messages-database/swarm-messages-database.types';

type P = ESwarmStoreConnector.OrbitDB;

type TConnectToSwarmImmediateProps<
  DbType extends TSwarmStoreDatabaseType<P>,
  T extends TSwarmMessageSerialized,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  CBO extends IConnectionBridgeOptionsDefault<P, T, DbType, any>,
  MD extends ISwarmMessageInstanceDecrypted,
  SMSM extends ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD>,
  DCO extends ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMSM>,
  DCCRT extends ISwarmMessagesDatabaseCache<P, T, DbType, DBO, MD, SMSM>,
  SMDCC extends ISwarmMessagesDatabaseCacheConstructor<P, T, DbType, DBO, MD, SMSM, DCO, DCCRT>
> = {
  dbOptions: DBO;
  connectionBridgeOptions: CBO;
  userCredentials: IUserCredentialsCommon;
  userIdReceiverSwarmMessages: TSwarmMessageUserIdentifierSerialized;
  swarmMessagesDatabaseCacheOptions: ISwarmMessagesDatabaseConnectOptionsSwarmMessagesCacheOptions<
    P,
    T,
    DbType,
    DBO,
    MD,
    SMSM,
    DCO,
    DCCRT,
    SMDCC
  >;
};

const CREDENTIALS: IUserCredentialsCommon[] = [];

export class ConnectToSwarmImmediate<
  DbType extends TSwarmStoreDatabaseType<P>,
  T extends TSwarmMessageSerialized,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  CBO extends IConnectionBridgeOptionsDefault<P, T, DbType, any>,
  MI extends TSwarmMessageInstance,
  MD extends ISwarmMessageInstanceDecrypted,
  SMSM extends ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD>,
  DCO extends ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMSM>,
  DCCRT extends ISwarmMessagesDatabaseCache<P, T, DbType, DBO, MD, SMSM>,
  SMDCC extends ISwarmMessagesDatabaseCacheConstructor<
    P,
    T,
    DbType,
    DBO,
    MD,
    SMSM,
    DCO,
    DCCRT
  > = ISwarmMessagesDatabaseCacheConstructor<P, T, DbType, DBO, MD, SMSM, DCO, DCCRT>
> extends React.Component<TConnectToSwarmImmediateProps<DbType, T, DBO, CBO, MD, SMSM, DCO, DCCRT, SMDCC>> {
  render() {
    const {
      dbOptions,
      connectionBridgeOptions,
      userCredentials,
      userIdReceiverSwarmMessages,
      swarmMessagesDatabaseCacheOptions,
    } = this.props;
    return (
      <ConnectToSwarm<DbType, T, DBO, true, CBO, MI, MD, SMSM, DCO, DCCRT, SMDCC>
        connectionBridgeOptions={connectionBridgeOptions}
        userCredentialsList={CREDENTIALS}
        userCredentialsToConnectImmediate={userCredentials}
        dbo={dbOptions}
        userIdReceiverSwarmMessages={userIdReceiverSwarmMessages}
        swarmMessagesDatabaseCacheOptions={swarmMessagesDatabaseCacheOptions}
      />
    );
  }
}
