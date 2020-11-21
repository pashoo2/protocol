import React from 'react';
import { FileStoreAddFile } from 'components/filestore-add-file/filestore-add-file';
import { ConnectToSwarm } from 'components/connect-to-swarm';
import { SensitiveDataStorage } from 'components/sensitive-data-storage';
import { ConnectToSwarmImmediate } from './connect-to-swarm-immediate/connect-to-swarm-immediate';
import { CONNECT_TO_SWARM_IMMEDIATE_DATABASE_OPTIONS_KEY_VALUE } from './const/connect-to-swarm-immediate.const';
import { CONNECTO_TO_SWARM_OPTIONS_SWARM_MESSAGES_DATABASE_CACHE_OPTIONS } from './const/connect-to-swarm.const';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import {
  TSwarmMessageSerialized,
  TSwarmMessageInstance,
  ISwarmMessageInstanceDecrypted,
} from '../classes/swarm-message/swarm-message-constructor.types';
import {
  CONNECT_TO_SWARM_CONNECTION_OPTIONS,
  CONNECT_TO_SWARM_AUTH_CREDENTIALS_USEDID_2,
  CONNECT_TO_SWARM_AUTH_CREDENTIALS_1,
} from './const/connect-to-swarm.const';

export class App extends React.Component {
  render() {
    // return <FileStoreAddFile />;
    // return <SensitiveDataStorage />;
    // return <ConnectToSwarm />;
    return (
      <ConnectToSwarmImmediate<
        ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED,
        TSwarmMessageSerialized,
        typeof CONNECT_TO_SWARM_IMMEDIATE_DATABASE_OPTIONS_KEY_VALUE,
        typeof CONNECT_TO_SWARM_CONNECTION_OPTIONS,
        TSwarmMessageInstance,
        ISwarmMessageInstanceDecrypted
      >
        dbOptions={CONNECT_TO_SWARM_IMMEDIATE_DATABASE_OPTIONS_KEY_VALUE}
        connectionBridgeOptions={CONNECT_TO_SWARM_CONNECTION_OPTIONS}
        userCredentials={CONNECT_TO_SWARM_AUTH_CREDENTIALS_1}
        userIdReceiverSwarmMessages={CONNECT_TO_SWARM_AUTH_CREDENTIALS_USEDID_2}
        swarmMessagesDatabaseCacheOptions={CONNECTO_TO_SWARM_OPTIONS_SWARM_MESSAGES_DATABASE_CACHE_OPTIONS}
      />
    );
  }
}

export default App;
