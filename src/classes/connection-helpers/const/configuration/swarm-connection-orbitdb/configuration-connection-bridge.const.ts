import { SerializerClass } from 'classes/basic-classes/serializer-class';
import { IConnectionBridgeOptionsByStorageOptions } from 'classes/connection-bridge/types/connection-bridge.types-helpers/connection-bridge-storage-options.types.helpers';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import {
  IConnectionBridgeOptionsDefault,
  TNativeConnectionOptions,
} from 'classes/connection-bridge/types/connection-bridge.types';
import {
  CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT,
  CONFIGURATION_DEFAULT_DATABASE_PREFIX,
} from './configuration-database.const';
import { TSwarmMessageSerialized, ISwarmMessageInstanceDecrypted } from 'classes/swarm-message/swarm-message-constructor.types';
import { TSwarmStoreDatabaseType } from 'classes/swarm-store-class/swarm-store-class.types';
import {
  ISwarmStoreConnectorBasicWithEntriesCount,
  ISwarmStoreConnectorWithEntriesCount,
  TSwarmStoreConnectorBasicFabric,
  TSwarmStoreDatabaseOptions,
} from 'classes/swarm-store-class/index';
import { TCentralAuthorityUserIdentity } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import {
  TSwarmStoreDatabaseEntityKey,
  TSwarmStoreDatabaseEntryOperation,
} from 'classes/swarm-store-class/swarm-store-class.types';
import {
  connectorBasicFabricOrbitDBWithEntriesCount,
  getMainConnectorFabricWithEntriesCountDefault,
} from 'classes/connection-bridge/connection-bridge-utils-fabrics';
import { connectionBridgeSwarmStoreConnectorDatabasesPersistentListFabricDefault } from 'classes/connection-bridge/connection-bridge-utils-fabrics/connection-bridge-swarm-fabrics/connection-bridge-utils-store-database-list-storage-fabrics';
import { swarmMessageStoreInstanceFabricWithSwarmStoreFabricAndOptionsSerializer } from 'classes/connection-bridge/connection-bridge-utils-fabrics/connection-bridge-swarm-fabrics/connection-bridge-utils-swarm-store-fabrics';
import { asyncValidateVerboseBySchemaWithVoidResult } from 'utils/validation-utils/validation-utils';

import { CONFIGURATION_USER_OPTIONS_DEFAULT } from './configuration-user.const';
import { CONFIGURATION_AUTHORIZATION_FIREBASE_AUTH_PROVIDER_OPTIONS_DEFAULT } from './configuration-authorization.const';

export const CONFIGURATION_CONNECTION_BRIDGE_NATIVE_CONNECTION_OPTIONS_DEFAULT: TNativeConnectionOptions<
  typeof CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT
> = {};

export const CONFIGURATION_CONNECTION_BRIDGE_STORAGE_OPTIONS_DEFAULT: IConnectionBridgeOptionsDefault<
  typeof CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT,
  TSwarmMessageSerialized,
  TSwarmStoreDatabaseType<typeof CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT>,
  false,
  TSwarmStoreDatabaseOptions<
    typeof CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT,
    TSwarmMessageSerialized,
    TSwarmStoreDatabaseType<typeof CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT>
  >,
  ISwarmMessageInstanceDecrypted | TSwarmMessageSerialized,
  any,
  any,
  any,
  ISwarmStoreConnectorBasicWithEntriesCount<
    typeof CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT,
    TSwarmMessageSerialized,
    TSwarmStoreDatabaseType<typeof CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT>,
    TSwarmStoreDatabaseOptions<
      typeof CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT,
      TSwarmMessageSerialized,
      TSwarmStoreDatabaseType<typeof CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT>
    >
  >,
  TSwarmStoreConnectorBasicFabric<
    typeof CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT,
    TSwarmMessageSerialized,
    TSwarmStoreDatabaseType<typeof CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT>,
    TSwarmStoreDatabaseOptions<
      typeof CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT,
      TSwarmMessageSerialized,
      TSwarmStoreDatabaseType<typeof CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT>
    >,
    ISwarmStoreConnectorBasicWithEntriesCount<
      typeof CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT,
      TSwarmMessageSerialized,
      TSwarmStoreDatabaseType<typeof CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT>,
      TSwarmStoreDatabaseOptions<
        typeof CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT,
        TSwarmMessageSerialized,
        TSwarmStoreDatabaseType<typeof CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT>
      >
    >
  >,
  any,
  any,
  ISwarmStoreConnectorWithEntriesCount<
    typeof CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT,
    TSwarmMessageSerialized,
    TSwarmStoreDatabaseType<typeof CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT>,
    TSwarmStoreDatabaseOptions<
      typeof CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT,
      TSwarmMessageSerialized,
      TSwarmStoreDatabaseType<typeof CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT>
    >,
    ISwarmStoreConnectorBasicWithEntriesCount<
      typeof CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT,
      TSwarmMessageSerialized,
      TSwarmStoreDatabaseType<typeof CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT>,
      TSwarmStoreDatabaseOptions<
        typeof CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT,
        TSwarmMessageSerialized,
        TSwarmStoreDatabaseType<typeof CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT>
      >
    >,
    any
  >
>['storage'] = {
  accessControl: {
    // A default function that is responsible for writing and reading from the database.
    grantAccess: function grandAccess(
      message: unknown,
      userId: TCentralAuthorityUserIdentity,
      dbName: string,
      key?: TSwarmStoreDatabaseEntityKey<typeof CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT>,
      // operation on the database
      op?: TSwarmStoreDatabaseEntryOperation<typeof CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT>
    ): Promise<boolean> {
      debugger;
      return Promise.resolve(true);
    },
  },
  // use the default swarm message constructor fabric
  swarmMessageConstructorFabric: undefined,
  // main (lower-level) connector to the swarm
  connectorBasicFabric: connectorBasicFabricOrbitDBWithEntriesCount,
  // a higher-level connector to the swarm
  connectorMainFabric: undefined,
  // this is special fabric creates fabric for creation of the MainConnector instance
  getMainConnectorFabric: getMainConnectorFabricWithEntriesCountDefault,
  // A name of the base connector to the swarm
  provider: CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT,
  // A name
  directory: CONFIGURATION_DEFAULT_DATABASE_PREFIX,
  // List of databases connection to which should be established once a connection to swarm will be established
  databases: [],
  // Persistent storage for a list with databases known
  swarmStoreDatabasesPersistentListFabric: connectionBridgeSwarmStoreConnectorDatabasesPersistentListFabricDefault,
  // Storage that is responsible to deal with swarm messages on a high level
  swarmMessageStoreInstanceFabric: swarmMessageStoreInstanceFabricWithSwarmStoreFabricAndOptionsSerializer,
};

export const CONNECTION_BRIDGE_OPTIONS_DEFAULT: IConnectionBridgeOptionsByStorageOptions<
  typeof CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT,
  TSwarmMessageSerialized,
  false,
  InstanceType<typeof SerializerClass>,
  ESwarmStoreConnectorOrbitDbDatabaseType,
  TSwarmStoreDatabaseOptions<
    typeof CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT,
    TSwarmMessageSerialized,
    ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED
  >,
  typeof CONFIGURATION_CONNECTION_BRIDGE_STORAGE_OPTIONS_DEFAULT
> = {
  swarmStoreConnectorType: CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT,
  user: CONFIGURATION_USER_OPTIONS_DEFAULT,
  auth: CONFIGURATION_AUTHORIZATION_FIREBASE_AUTH_PROVIDER_OPTIONS_DEFAULT,
  storage: CONFIGURATION_CONNECTION_BRIDGE_STORAGE_OPTIONS_DEFAULT,
  nativeConnection: CONFIGURATION_CONNECTION_BRIDGE_NATIVE_CONNECTION_OPTIONS_DEFAULT, // use the default value
  serializer: new SerializerClass(),
  jsonSchemaValidator: asyncValidateVerboseBySchemaWithVoidResult,
};
