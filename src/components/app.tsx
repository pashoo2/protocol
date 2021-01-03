import React from 'react';
import { FileStoreAddFile } from 'components/filestore-add-file/filestore-add-file';
import { ConnectToSwarm } from 'components/connect-to-swarm';
import { SensitiveDataStorage } from 'components/sensitive-data-storage';
import { ConnectToSwarmImmediate } from './connect-to-swarm-immediate/connect-to-swarm-immediate';
import {
  CONNECT_TO_SWARM_IMMEDIATE_DATABASE_OPTIONS_KEY_VALUE,
  CONNECT_TO_SWARM_IMMEDIATE_DATABASE_OPTIONS_FEED,
} from './const/connect-to-swarm-immediate.const';
import { CONNECTO_TO_SWARM_OPTIONS_SWARM_MESSAGES_DATABASE_CACHE_WITH_STORE_META_OPTIONS } from './const/connect-to-swarm.const';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { ESwarmStoreConnector } from '../classes/swarm-store-class/swarm-store-class.const';
import { ISwarmMessagesDatabaseMessagesCollector } from '../classes/swarm-messages-database/swarm-messages-database.messages-collector.types';
import { ConstructorArgumentType } from '../types/helper.types';
import { ConnectToSwarmWithAdditionalMeta } from './connect-to-swarm-with-additional-meta/connect-to-swarm-with-additional-meta';
import { ConnectToSwarmWithDBO } from './connect-to-swarm-with-dbo/connect-to-swarm-with-dbo';
import { ConnectToSwarmWithAdditionalMetaWithDBO } from './connect-to-swarm-with-additional-meta-with-dbo/connect-to-swarm-with-additional-meta';
import {
  TSwarmMessageSerialized,
  TSwarmMessageInstance,
  ISwarmMessageInstanceDecrypted,
} from '../classes/swarm-message/swarm-message-constructor.types';
import {
  CONNECT_TO_SWARM_CONNECTION_WITH_STORE_META_OPTIONS,
  CONNECT_TO_SWARM_AUTH_CREDENTIALS_USEDID_2,
  CONNECT_TO_SWARM_AUTH_CREDENTIALS_USEDID_1,
  CONNECT_TO_SWARM_AUTH_CREDENTIALS_1,
  CONNECT_TO_SWARM_AUTH_CREDENTIALS_2,
} from './const/connect-to-swarm.const';

export class App extends React.Component {
  render() {
    // return <FileStoreAddFile />;
    // return <SensitiveDataStorage />;
    // return <ConnectToSwarm />;
    type TSwarmCacheConstructor = typeof CONNECTO_TO_SWARM_OPTIONS_SWARM_MESSAGES_DATABASE_CACHE_WITH_STORE_META_OPTIONS['cacheConstructor'];
    // return (
    //   <ConnectToSwarmImmediate<
    //     typeof CONNECT_TO_SWARM_IMMEDIATE_DATABASE_OPTIONS_KEY_VALUE['dbType'],
    //     TSwarmMessageSerialized,
    //     typeof CONNECT_TO_SWARM_IMMEDIATE_DATABASE_OPTIONS_KEY_VALUE,
    //     typeof CONNECT_TO_SWARM_CONNECTION_OPTIONS,
    //     TSwarmMessageInstance,
    //     ISwarmMessageInstanceDecrypted,
    //     ISwarmMessagesDatabaseMessagesCollector<
    //       ESwarmStoreConnector.OrbitDB,
    //       ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED,
    //       ISwarmMessageInstanceDecrypted
    //     >,
    //     ConstructorArgumentType<TSwarmCacheConstructor>,
    //     InstanceType<TSwarmCacheConstructor>,
    //     TSwarmCacheConstructor
    //   >
    //     dbOptions={CONNECT_TO_SWARM_IMMEDIATE_DATABASE_OPTIONS_KEY_VALUE}
    //     connectionBridgeOptions={CONNECT_TO_SWARM_CONNECTION_OPTIONS}
    //     userCredentials={CONNECT_TO_SWARM_AUTH_CREDENTIALS_1}
    //     userIdReceiverSwarmMessages={CONNECT_TO_SWARM_AUTH_CREDENTIALS_USEDID_2}
    //     swarmMessagesDatabaseCacheOptions={CONNECTO_TO_SWARM_OPTIONS_SWARM_MESSAGES_DATABASE_CACHE_OPTIONS}
    //   />
    // );
    // return (
    //   <ConnectToSwarmWithAdditionalMeta<
    //     typeof CONNECT_TO_SWARM_IMMEDIATE_DATABASE_OPTIONS_FEED['dbType'],
    //     TSwarmMessageSerialized,
    //     typeof CONNECT_TO_SWARM_IMMEDIATE_DATABASE_OPTIONS_FEED,
    //     false,
    //     ReturnType<typeof CONNECT_TO_SWARM_CONNECTION_WITH_STORE_META_OPTIONS['storage']['connectorBasicFabric']>,
    //     ReturnType<
    //       ReturnType<NonNullable<typeof CONNECT_TO_SWARM_CONNECTION_WITH_STORE_META_OPTIONS['storage']['getMainConnectorFabric']>>
    //     >,
    //     any, // TODO - ReturnType<typeof CONNECT_TO_SWARM_CONNECTION_WITH_STORE_META_OPTIONS['storage']['swarmMessageStoreInstanceFabric']>,
    //     any, // TODO typeof CONNECT_TO_SWARM_CONNECTION_WITH_STORE_META_OPTIONS['storage']['swarmStoreDatabasesPersistentListFabric'],
    //     typeof CONNECT_TO_SWARM_CONNECTION_WITH_STORE_META_OPTIONS,
    //     TSwarmMessageInstance,
    //     ISwarmMessageInstanceDecrypted
    //   >
    //     dbo={CONNECT_TO_SWARM_IMMEDIATE_DATABASE_OPTIONS_FEED}
    //     connectionBridgeOptions={CONNECT_TO_SWARM_CONNECTION_WITH_STORE_META_OPTIONS}
    //     userCredentialsList={[CONNECT_TO_SWARM_AUTH_CREDENTIALS_1]}
    //     userCredentialsToConnectImmediate={CONNECT_TO_SWARM_AUTH_CREDENTIALS_1}
    //     userIdReceiverSwarmMessages={CONNECT_TO_SWARM_AUTH_CREDENTIALS_USEDID_2}
    //     swarmMessagesDatabaseCacheOptions={CONNECTO_TO_SWARM_OPTIONS_SWARM_MESSAGES_DATABASE_CACHE_WITH_STORE_META_OPTIONS}
    //   />
    // );
    const userToConnectWith = window.prompt('Which user did you chose 1 or 2', '1');
    const userToConnectWithCredentials =
      userToConnectWith === '1' ? CONNECT_TO_SWARM_AUTH_CREDENTIALS_1 : CONNECT_TO_SWARM_AUTH_CREDENTIALS_2;
    const userIdReceiverMessages =
      userToConnectWith === '1' ? CONNECT_TO_SWARM_AUTH_CREDENTIALS_USEDID_2 : CONNECT_TO_SWARM_AUTH_CREDENTIALS_USEDID_1;

    return (
      <ConnectToSwarmWithAdditionalMetaWithDBO<
        typeof CONNECT_TO_SWARM_IMMEDIATE_DATABASE_OPTIONS_FEED['dbType'],
        TSwarmMessageSerialized,
        typeof CONNECT_TO_SWARM_IMMEDIATE_DATABASE_OPTIONS_FEED,
        false,
        ReturnType<typeof CONNECT_TO_SWARM_CONNECTION_WITH_STORE_META_OPTIONS['storage']['connectorBasicFabric']>,
        ReturnType<
          ReturnType<NonNullable<typeof CONNECT_TO_SWARM_CONNECTION_WITH_STORE_META_OPTIONS['storage']['getMainConnectorFabric']>>
        >,
        any, // TODO - ReturnType<typeof CONNECT_TO_SWARM_CONNECTION_WITH_STORE_META_OPTIONS['storage']['swarmMessageStoreInstanceFabric']>,
        any, // TODO typeof CONNECT_TO_SWARM_CONNECTION_WITH_STORE_META_OPTIONS['storage']['swarmStoreDatabasesPersistentListFabric'],
        typeof CONNECT_TO_SWARM_CONNECTION_WITH_STORE_META_OPTIONS,
        TSwarmMessageInstance,
        ISwarmMessageInstanceDecrypted
      >
        dbo={CONNECT_TO_SWARM_IMMEDIATE_DATABASE_OPTIONS_FEED}
        connectionBridgeOptions={CONNECT_TO_SWARM_CONNECTION_WITH_STORE_META_OPTIONS}
        userCredentialsList={[userToConnectWithCredentials]}
        userCredentialsToConnectImmediate={userToConnectWithCredentials}
        userIdReceiverSwarmMessages={userIdReceiverMessages}
        swarmMessagesDatabaseCacheOptions={CONNECTO_TO_SWARM_OPTIONS_SWARM_MESSAGES_DATABASE_CACHE_WITH_STORE_META_OPTIONS}
      />
    );
  }
}

export default App;
