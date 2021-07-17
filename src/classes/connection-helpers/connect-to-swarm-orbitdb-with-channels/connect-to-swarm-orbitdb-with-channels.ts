import { EventEmitter } from 'events';

import { createConnectionBridgeConnectionWithDBOClassByOptions } from 'classes/connection-bridge/connection-bridge-utils-fabrics/connection-bridge-class-fabrics/connection-bridge-with-dbo-class/connection-bridge-with-dbo-class-fabric';
import {
  IConnectionBridgeOptions,
  IConnectionBridgeOptionsDefault,
  TConnectionBridgeOptionsAuthCredentials,
} from 'classes/connection-bridge/types/connection-bridge.types';
import {
  IConnectToSwarmOrbitdbWithChannelsState,
  IConnectToSwarmOrbitdbWithChannelsStateListener,
} from 'classes/connection-helpers/connect-to-swarm-orbitdb-with-channels/types/connect-to-swarm-orbitdb-with-channels-state.types';
import { CONFIGURATION_CONNECTION_DATABASE_STORAGE_OPTIONS_DEFAULT } from 'classes/connection-helpers/const/configuration/swarm-connection-orbitdb/configuration-database-storage.const';
import { ISwarmMessageInstanceDecrypted, TSwarmMessageSerialized } from 'classes/swarm-message';
import {
  ISwarmMessagesDatabaseCache,
  ISwarmMessagesDatabaseCacheConstructor,
  ISwarmMessagesDatabaseCacheOptions,
  ISwarmMessagesDatabaseMessagesCollector,
} from 'classes/swarm-messages-database';
import {
  ESwarmStoreEventNames,
  ISwarmStoreDatabasesCommonStatusList,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseType,
} from 'classes/swarm-store-class';
import { IUserCredentialsCommon } from 'types/credentials.types';

import {
  IConnectToSwarmOrbitDbWithChannelsConstructorOptions,
  TSwarmStoreConnectorDefault,
} from './types/connect-to-swarm-orbitdb-with-channels-constructor.types';
import {
  CONNECT_TO_SWARM_ORBITDB_WITH_CHANNELS_STATE_CHANGE_EVENT_NAME,
  CONNECT_TO_SWARM_ORBITDB_WITH_CHANNELS_STATE_DEFAULT,
} from './const/connect-to-swarm-orbitdb-with-channels-state.const';
import { TConnectionBridgeByOptions } from 'classes/connection-bridge/types/connection-bridge.types-helpers/connection-bridge.types.helpers';
import { ESwarmMessageStoreEventNames } from 'classes/swarm-message-store';

export class ConnectionToSwarmWithChannels<
  DbType extends TSwarmStoreDatabaseType<TSwarmStoreConnectorDefault>,
  T extends TSwarmMessageSerialized,
  DBO extends TSwarmStoreDatabaseOptions<TSwarmStoreConnectorDefault, T, DbType>,
  CD extends boolean,
  CBO extends IConnectionBridgeOptionsDefault<TSwarmStoreConnectorDefault, T, DbType, CD>,
  MD extends ISwarmMessageInstanceDecrypted,
  SMSM extends ISwarmMessagesDatabaseMessagesCollector<TSwarmStoreConnectorDefault, DbType, MD>,
  DCO extends ISwarmMessagesDatabaseCacheOptions<TSwarmStoreConnectorDefault, DbType, MD, SMSM>,
  DCCRT extends ISwarmMessagesDatabaseCache<TSwarmStoreConnectorDefault, T, DbType, DBO, MD, SMSM>,
  SMDCC extends ISwarmMessagesDatabaseCacheConstructor<TSwarmStoreConnectorDefault, T, DbType, DBO, MD, SMSM, DCO, DCCRT>
> {
  public get state(): Readonly<IConnectToSwarmOrbitdbWithChannelsState<DbType, T, DBO, CBO>> {
    return {
      ...this.__state,
    };
  }
  private __state: IConnectToSwarmOrbitdbWithChannelsState<DbType, T, DBO, CBO> =
    CONNECT_TO_SWARM_ORBITDB_WITH_CHANNELS_STATE_DEFAULT as IConnectToSwarmOrbitdbWithChannelsState<DbType, T, DBO, CBO>;
  private __emiter = new EventEmitter();
  constructor(
    private __configuration: IConnectToSwarmOrbitDbWithChannelsConstructorOptions<
      DbType,
      T,
      DBO,
      CD,
      CBO,
      MD,
      SMSM,
      DCO,
      DCCRT,
      SMDCC
    >
  ) {}
  public addStateChangeListener(listener: IConnectToSwarmOrbitdbWithChannelsStateListener<DbType, T, DBO, CBO>): void {
    this.__emiter.addListener(CONNECT_TO_SWARM_ORBITDB_WITH_CHANNELS_STATE_CHANGE_EVENT_NAME, listener);
  }
  public removeStateChangeListener(listener: IConnectToSwarmOrbitdbWithChannelsStateListener<DbType, T, DBO, CBO>): void {
    this.__emiter.removeListener(CONNECT_TO_SWARM_ORBITDB_WITH_CHANNELS_STATE_CHANGE_EVENT_NAME, listener);
  }
  public async connectToSwarm(credentials: IUserCredentialsCommon): Promise<void> {
    const currentState = this.state;

    if (!credentials) {
      throw new Error('Credentials should be defined to connect to swarm');
    }
    if (currentState.isConnectingToSwarm) {
      throw new Error('The instance is already connecting');
    }

    this._updateState({
      isConnectingToSwarm: true,
      userCredentialsActive: credentials,
    });
    try {
      const connectionBridge = (await this._connectToSwarmWithDBOUtil(
        this.__configuration.connectionBridgeOptions,
        credentials
      )) as unknown as TConnectionBridgeByOptions<TSwarmStoreConnectorDefault, T, DbType, DBO, CBO>;

      if (!connectionBridge) {
        throw new Error('Creation connection failed');
      }

      const userId = connectionBridge.centralAuthorityConnection.getUserIdentity();

      if (userId instanceof Error) {
        throw new Error('Failed to get a user unique id');
      }
      const databasesList = connectionBridge.swarmMessageStore.databases;
      if (!databasesList) {
        throw new Error('Failed to get a database list');
      }
      const userProfileData = await connectionBridge.centralAuthorityConnection?.getCAUserProfile();

      this._updateState({
        connectionBridge,
        userId,
        databasesList: databasesList as unknown as IConnectToSwarmOrbitdbWithChannelsState<DbType, T, DBO, CBO>['databasesList'],
        userProfileData,
      });
      this._setListenersConnectionBridge(connectionBridge);

      const { dbo } = this.__configuration;

      if (!dbo) {
        throw new Error('Database options should be defined to connect with it');
      }
      await this.handleOpenNewSwarmStoreMessagesDatabase(dbo);
    } catch (err) {
      this._updateState({
        connectionError: err as Error,
      });
    }
  }

  protected async _connectToSwarmWithDBOUtil(
    options: IConnectionBridgeOptions<
      TSwarmStoreConnectorDefault,
      T,
      DbType,
      DBO,
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
      any,
      any,
      any,
      CBO['serializer']
    >,
    credentials: TConnectionBridgeOptionsAuthCredentials
  ) {
    const storageOptions = {
      ...options.storage,
      ...CONFIGURATION_CONNECTION_DATABASE_STORAGE_OPTIONS_DEFAULT,
    };
    const optionsResulted = {
      ...options,
      storage: storageOptions,
    };
    const connectionBridgeInstance = await createConnectionBridgeConnectionWithDBOClassByOptions(
      optionsResulted,
      credentials,
      true
    );

    return connectionBridgeInstance;
  }

  protected _updateState(updatedStatePartial: Partial<IConnectToSwarmOrbitdbWithChannelsState<DbType, T, DBO, CBO>>) {
    const newState = {
      ...this.__state,
      ...updatedStatePartial,
    };

    this.__state = newState;
    this.__emiter.emit(CONNECT_TO_SWARM_ORBITDB_WITH_CHANNELS_STATE_CHANGE_EVENT_NAME, newState);
  }

  protected _resetState() {
    this._updateState(
      CONNECT_TO_SWARM_ORBITDB_WITH_CHANNELS_STATE_DEFAULT as IConnectToSwarmOrbitdbWithChannelsState<DbType, T, DBO, CBO>
    );
  }

  protected _handleDatabasesListUpdate = (
    databasesList: ISwarmStoreDatabasesCommonStatusList<
      TSwarmStoreConnectorDefault,
      T,
      DbType,
      TSwarmStoreDatabaseOptions<TSwarmStoreConnectorDefault, T, DbType>
    >
  ) => {
    this._updateState({
      databasesList: { ...databasesList },
    });
  };

  protected _handleMessage = (dbName: DBO['dbName'], message: MI, id: string, key: string) => {
    const { messagesReceived } = this.state;
    const messagesMap = messagesReceived.get(dbName) || new Map();
    // TODO - to get all of actual values for KV-store it is necessary
    // to iterate overall database. Cause for a KV store implemented
    // by the OrbitDB only the "db.all" method returns all keys, so
    // in this implementation only thught the iterate method of a db
    // this is able to iterate over all items(db.all)

    if (!messagesMap.get(id)) {
      messagesMap.set(id, {
        message,
        id,
        key,
      });
      messagesReceived.set(dbName, messagesMap);
      this.forceUpdate();
    }
  };

  protected _setListenersConnectionBridge(
    connectionBridge: TConnectionBridgeByOptions<TSwarmStoreConnectorDefault, T, DbType, DBO, CBO>
  ) {
    const swarmMessageStore = connectionBridge.swarmMessageStore;

    if (!swarmMessageStore) {
      throw new Error('Swarm message store instance is not exists in the connection bridge instance');
    }
    swarmMessageStore.addListener(ESwarmStoreEventNames.DATABASES_LIST_UPDATED, this._handleDatabasesListUpdate);
    swarmMessageStore.addListener(ESwarmMessageStoreEventNames.NEW_MESSAGE, this._handleMessage);
  }
}
