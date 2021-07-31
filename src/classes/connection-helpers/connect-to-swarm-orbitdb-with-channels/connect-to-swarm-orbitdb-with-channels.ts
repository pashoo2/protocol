import { EventEmitter } from 'events';

import { createConnectionBridgeConnectionWithDBOClassByOptions } from 'classes/connection-bridge/connection-bridge-utils-fabrics/connection-bridge-class-fabrics/connection-bridge-with-dbo-class/connection-bridge-with-dbo-class-fabric';
import {
  IConnectionBridgeOptions,
  IConnectionBridgeOptionsDefault,
  TConnectionBridgeOptionsAuthCredentials,
} from 'classes/connection-bridge/types/connection-bridge.types';
import { IConnectToSwarmOrbitDbWithChannelsState } from 'classes/connection-helpers/connect-to-swarm-orbitdb-with-channels/types/connect-to-swarm-orbitdb-with-channels-state.types';
import { CONFIGURATION_CONNECTION_DATABASE_STORAGE_OPTIONS_DEFAULT } from 'classes/connection-helpers/const/configuration/swarm-connection-orbitdb/configuration-database-storage.const';
import { ISwarmMessageInstanceDecrypted, TSwarmMessageSerialized } from 'classes/swarm-message';
import {
  ISwarmMessagesDatabaseCache,
  ISwarmMessagesDatabaseCacheConstructor,
  ISwarmMessagesDatabaseCacheOptions,
  ISwarmMessagesDatabaseMessagesCollector,
  ISwarmMessagesStoreMeta,
} from 'classes/swarm-messages-database';
import {
  ESwarmStoreConnectorOrbitDbDatabaseType,
  ESwarmStoreEventNames,
  ISwarmStoreDatabasesCommonStatusList,
  TSwarmDatabaseName,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseType,
} from 'classes/swarm-store-class';
import { IUserCredentialsCommon } from 'types/credentials.types';
import { getSwarmMessageStoreMeta } from 'classes/swarm-messages-database/swarm-messages-database-utils/swarm-messages-database-messages-collector-utils/swarm-messages-database-messages-collector-utils';

import {
  IConnectToSwarmOrbitDbWithChannelsConstructorOptions,
  TSwarmStoreConnectorDefault,
} from './types/connect-to-swarm-orbitdb-with-channels-constructor.types';
import {
  CONNECT_TO_SWARM_ORBITDB_WITH_CHANNELS_STATE_CHANGE_EVENT_NAME,
  CONNECT_TO_SWARM_ORBITDB_WITH_CHANNELS_STATE_DEFAULT,
} from './const/connect-to-swarm-orbitdb-with-channels-state.const';
import { TConnectionBridgeByOptions } from 'classes/connection-bridge/types/connection-bridge.types-helpers/connection-bridge.types.helpers';
import { ESwarmMessageStoreEventNames, ISwarmMessageStore } from 'classes/swarm-message-store';
import { TConnectToSwarmOrbitDbSwarmMessagesList } from 'classes/connection-helpers/connect-to-swarm-orbitdb-with-channels/types/connect-to-swarm-orbitdb-with-channels-state.types';
import { IConnectToSwarmOrbitDbSwarmMessageDescription } from './types/connect-to-swarm-orbitdb-with-channels-state.types';
import {
  IConnectToSwarmOrbitDbWithChannelsDatabaseSwarmMessagesListUpdateListener,
  IConnectToSwarmOrbitDbWithChannelsDatabaseSwarmMessagesListUpdateListenerParameter,
} from 'classes/connection-helpers/connect-to-swarm-orbitdb-with-channels/types/connect-to-swarm-orbitdb-with-channels-change-listeners.types';
import { CONNECT_TO_SWARM_ORBITDB_WITH_CHANNELS_DATABASE_MESSAGES_UPDATE_EVENT_NAME } from './const/connect-to-swarm-orbitdb-with-channels-state.const';
import {
  ESwarmMessagesChannelsListEventName,
  ISwarmMessageChannelDescriptionRaw,
  ISwarmMessagesChannelsDescriptionsList,
  ISwarmMessagesChannelV1DefaultFabricOptionsDefault,
  TSwarmMessagesChannelAnyByChannelDescriptionRaw,
  getSwarmMessagesChannelV1InstanveWithDefaults,
} from 'classes/swarm-messages-channels';
import { TSwarmMessagesDatabaseConnectedFabricOptions } from '../../swarm-messages-database/swarm-messages-database-fabrics/types/swarm-messages-database-intstance-fabric-main.types';
import { swarmMessagesDatabaseConnectedFabricMain } from 'classes/swarm-messages-database/swarm-messages-database-fabrics/swarm-messages-database-intstance-fabric-main/swarm-messages-database-intstance-fabric-main';
import {
  TConnectionBridgeOptionsAccessControlOptions,
  TConnectionBridgeOptionsConnectorBasic,
  TConnectionBridgeOptionsConnectorConnectionOptions,
  TConnectionBridgeOptionsConnectorFabricOptions,
  TConnectionBridgeOptionsConnectorMain,
  TConnectionBridgeOptionsConstructorWithEncryptedCacheFabric,
  TConnectionBridgeOptionsGrandAccessCallback,
  TConnectionBridgeOptionsProviderOptions,
  TConnectionBridgeOptionsSwarmMessageStoreInstance,
  TConnectionBridgeOptionsSwarmMessageStoreOptionsWithConnectorFabric,
} from 'classes/connection-bridge/types/connection-bridge.types-helpers';
import { createSwarmMessagesDatabaseMessagesCollectorInstance } from '../../swarm-messages-database/swarm-messages-database-subclasses/swarm-messages-database-messages-collector/swarm-messages-database-messages-collector';
import { ISerializer } from 'types/serialization.types';
import { TCentralAuthorityUserIdentity } from 'classes/central-authority-class';
import { SMS } from 'classes/connection-bridge/types/connection-bridge.types-helpers/connection-bridge-storage-options.types.helpers';
import { getDatabaseConnectionByDatabaseOptionsFabricWithKvMessagesUpdatesQueuedHandling } from '../../swarm-messages-channels/swarm-messages-channels-classes/swarm-messages-channels-list-classes/swarm-messages-channels-list-v1-class/utils/swarm-messages-channels-list-v1-constructor-arguments-fabrics/swarm-messages-channels-list-v1-database-connection-fabrics/swarm-messages-channels-list-v1-database-connection-fabric-with-kv-messages-updates-queued-handling';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import {
  ISwarmMessagesChannelsListDescription,
  TSwarmMessagesChannelsListDbType,
  TSwrmMessagesChannelsListDBOWithGrantAccess,
} from 'classes/swarm-messages-channels/types/swarm-messages-channels-list-instance.types';
import { getSwarmMessagesChannelsListVersionOneInstanceWithDefaultParameters } from '../../swarm-messages-channels/swarm-messages-channels-classes/swarm-messages-channels-list-classes/swarm-messages-channels-list-v1-class/utils/swarm-messages-channels-list-v1-instance-fabrics/swarm-messages-channels-list-v1-instance-fabric-default';
import { IConnectToSwarmOrbitDbWithChannelsStateListener } from './types/connect-to-swarm-orbitdb-with-channels-change-listeners.types';
import { CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT } from 'classes/connection-helpers/const/configuration/swarm-connection-orbitdb/configuration-database.const';
import { ISwarmMessagesChannelConstructorOptions } from '../../swarm-messages-channels/types/swarm-messages-channel-instance.types';
import { ISwarmMessagesDatabaseConnectOptions } from 'classes/swarm-messages-database/swarm-messages-database.types';
import { createSwarmMessagesDatabaseMessagesCollectorWithStoreMetaInstance } from 'classes/swarm-messages-database/swarm-messages-database-subclasses/swarm-messages-database-messages-collector-with-store-meta';
import { getSwarmMessagesDatabaseWithKVDbMessagesUpdatesConnectorInstanceFabric } from '../../swarm-messages-channels/swarm-messages-channels-classes/swarm-messages-channel-classes/swarm-messages-channel-v1-class/utils/swarm-messages-channel-v1-constructor-options-default-utils/utils/swarm-messages-channel-v1-constructor-options-default-utils-database-connector-fabrics';
import { TDatabaseOptionsTypeByChannelDescriptionRaw } from '../../swarm-messages-channels/types/swarm-messages-channel-instance.helpers.types';
import { ESwarmMessagesChannelEventName } from 'classes/swarm-messages-channels/types/swarm-messages-channel-events.types';
import { IConnectionToSwarmWithChannels } from './types/connect-to-swarm-orbitdb-with-channels-instance.types';

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
> implements IConnectionToSwarmWithChannels<DbType, T, DBO, CD, CBO, MD>
{
  public get state(): Readonly<IConnectToSwarmOrbitDbWithChannelsState<DbType, T, DBO, CBO>> {
    return {
      ...this.__state,
    };
  }
  public get isConnectedToSwarm(): boolean {
    const { isConnectingToSwarm, connectionBridge } = this.__state;
    return Boolean(connectionBridge) && !isConnectingToSwarm;
  }
  private __state: IConnectToSwarmOrbitDbWithChannelsState<DbType, T, DBO, CBO> =
    CONNECT_TO_SWARM_ORBITDB_WITH_CHANNELS_STATE_DEFAULT as IConnectToSwarmOrbitDbWithChannelsState<DbType, T, DBO, CBO>;
  private __emiter = new EventEmitter();
  private __emitterDatabaseMessagesListUpdate = new EventEmitter();
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

  public async connectToSwarm(userCredentials?: IUserCredentialsCommon): Promise<void> {
    await this._connectToSwarmIfNotConnected(userCredentials);
  }

  public async connectToSwarmChannelsList(
    channelsListDescription: ISwarmMessagesChannelsListDescription,
    channelsListDatabaseOptions: TSwrmMessagesChannelsListDBOWithGrantAccess<
      TSwarmStoreConnectorDefault,
      T,
      MD,
      ISwarmStoreDBOGrandAccessCallbackBaseContext,
      TSwarmStoreDatabaseOptions<TSwarmStoreConnectorDefault, T, TSwarmMessagesChannelsListDbType>
    >
  ): Promise<void> {
    const swarmMessagesChannelsList = await this._connectToSwarmAndCreateSwarmMessagesChannelsList(
      channelsListDescription,
      channelsListDatabaseOptions
    );

    this._setListenerSwarmMessagesChannelsListClosed(swarmMessagesChannelsList);
    this._updateState({
      swarmMessagesChannelsList,
    });
  }

  public async connectToSwarmChannel(
    swarmMessageChannelDescriptionRaw: ISwarmMessageChannelDescriptionRaw<
      TSwarmStoreConnectorDefault,
      TSwarmMessageSerialized,
      ESwarmStoreConnectorOrbitDbDatabaseType,
      TSwarmStoreDatabaseOptions<TSwarmStoreConnectorDefault, TSwarmMessageSerialized, ESwarmStoreConnectorOrbitDbDatabaseType>
    >
  ): Promise<TSwarmMessagesChannelAnyByChannelDescriptionRaw<typeof swarmMessageChannelDescriptionRaw>> {
    const { swarmMessagesChannelsList } = this.state;
    if (!swarmMessagesChannelsList) {
      throw new Error('Swarm messages channels list instance should be exists');
    }
    const swarmMessagesChanelInstance = await this._createSwarmMessagesChannelInstanceAndConnect(
      swarmMessagesChannelsList as ISwarmMessagesChannelsDescriptionsList<TSwarmStoreConnectorDefault, T, MD>,
      swarmMessageChannelDescriptionRaw
    );
    return swarmMessagesChanelInstance;
  }

  public addStateChangeListener(listener: IConnectToSwarmOrbitDbWithChannelsStateListener<DbType, T, DBO, CBO>): void {
    this.__emiter.addListener(CONNECT_TO_SWARM_ORBITDB_WITH_CHANNELS_STATE_CHANGE_EVENT_NAME, listener);
  }
  public removeStateChangeListener(listener: IConnectToSwarmOrbitDbWithChannelsStateListener<DbType, T, DBO, CBO>): void {
    this.__emiter.removeListener(CONNECT_TO_SWARM_ORBITDB_WITH_CHANNELS_STATE_CHANGE_EVENT_NAME, listener);
  }

  public addDatabaseSwarmMessagesListUpdateListener(
    listener: IConnectToSwarmOrbitDbWithChannelsDatabaseSwarmMessagesListUpdateListener<DbType>
  ): void {
    this.__emitterDatabaseMessagesListUpdate.addListener(
      CONNECT_TO_SWARM_ORBITDB_WITH_CHANNELS_DATABASE_MESSAGES_UPDATE_EVENT_NAME,
      listener
    );
  }
  public removeDatabaseSwarmMessagesListUpdateListener(
    listener: IConnectToSwarmOrbitDbWithChannelsDatabaseSwarmMessagesListUpdateListener<DbType>
  ): void {
    this.__emitterDatabaseMessagesListUpdate.removeListener(
      CONNECT_TO_SWARM_ORBITDB_WITH_CHANNELS_DATABASE_MESSAGES_UPDATE_EVENT_NAME,
      listener
    );
  }

  protected async _connectToSwarm(userCredentials?: IUserCredentialsCommon): Promise<void> {
    const currentState = this.state;

    if (!userCredentials) {
      console.warn(
        'Credentials are not provided therefore connection can be established only if a session available for the user'
      );
    }
    if (currentState.isConnectingToSwarm) {
      throw new Error('The instance is already connecting');
    }

    this._updateState({
      isConnectingToSwarm: true,
    });
    try {
      const connectionBridge = (await this._createConnectionBridgeInstance(
        this.__configuration.connectionBridgeOptions,
        userCredentials
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
        databasesList: databasesList as unknown as IConnectToSwarmOrbitDbWithChannelsState<DbType, T, DBO, CBO>['databasesList'],
        userProfileData,
      });
      this._setListenersConnectionBridge(connectionBridge);
    } catch (err) {
      this._updateState({
        connectionError: err as Error,
      });
    }
  }

  protected async _connectToSwarmIfNotConnected(userCredentials?: IUserCredentialsCommon): Promise<void> {
    if (this.isConnectedToSwarm) {
      return;
    }
    return await this._connectToSwarm(userCredentials);
  }

  protected async _createConnectionBridgeInstance(
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

  protected async _connectToSwarmAndCreateSwarmMessagesChannelsList(
    channelsListDescription: ISwarmMessagesChannelsListDescription,
    channelDatabaseOptions: TSwrmMessagesChannelsListDBOWithGrantAccess<
      TSwarmStoreConnectorDefault,
      T,
      MD,
      ISwarmStoreDBOGrandAccessCallbackBaseContext,
      TSwarmStoreDatabaseOptions<TSwarmStoreConnectorDefault, T, TSwarmMessagesChannelsListDbType>
    >
  ): Promise<ISwarmMessagesChannelsDescriptionsList<TSwarmStoreConnectorDefault, T, MD>> {
    const swarmMessageChannelsList = this._createSwarmMessagesChannelsList(channelsListDescription, channelDatabaseOptions);

    await this._waitTillSwarmMessageChannelsListWillBeReadyOrRejectIfClosed(swarmMessageChannelsList);
    return swarmMessageChannelsList;
  }

  protected _updateState(updatedStatePartial: Partial<IConnectToSwarmOrbitDbWithChannelsState<DbType, T, DBO, CBO>>) {
    const newState = {
      ...this.__state,
      ...updatedStatePartial,
    };

    this.__state = newState;
    this.__emiter.emit(CONNECT_TO_SWARM_ORBITDB_WITH_CHANNELS_STATE_CHANGE_EVENT_NAME, newState);
  }

  protected _resetState() {
    this._updateState(
      CONNECT_TO_SWARM_ORBITDB_WITH_CHANNELS_STATE_DEFAULT as IConnectToSwarmOrbitDbWithChannelsState<DbType, T, DBO, CBO>
    );
  }

  protected _getActiveConnectionBridgeInstance(): TConnectionBridgeByOptions<
    TSwarmStoreConnectorDefault,
    T,
    DbType,
    DBO,
    CBO,
    boolean,
    ISerializer<any>,
    CBO['storage']
  > {
    const { connectionBridge } = this.state;

    if (!connectionBridge) {
      throw new Error('There is no active connection with swarm');
    }
    return connectionBridge;
  }

  protected _getActiveUserId(): TCentralAuthorityUserIdentity {
    const { userId } = this.state;

    if (!userId) {
      throw new Error('An active user identity is not defined');
    }
    return userId;
  }

  protected _getActiveSwarmMessageStore(): SMS<CBO['storage']> {
    const connectionBridge = this._getActiveConnectionBridgeInstance();
    const { swarmMessageStore } = connectionBridge;

    if (!swarmMessageStore) {
      throw new Error('There is no active instance of a swarm message store found');
    }
    return swarmMessageStore;
  }

  protected _getSwarmMessagesCollector(): SMSM {
    const swarmMessageStore = this._getActiveSwarmMessageStore();
    return createSwarmMessagesDatabaseMessagesCollectorInstance<
      TSwarmStoreConnectorDefault,
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
    >({
      swarmMessageStore: swarmMessageStore as ISwarmMessageStore<
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
        any
      > as TConnectionBridgeOptionsSwarmMessageStoreInstance<CBO>,
    }) as SMSM;
  }

  protected _getOptionsForSwarmMessagesDatabaseConnectedWithoutDatabaseOptionsFabric = (): Omit<
    TSwarmMessagesDatabaseConnectedFabricOptions<typeof swarmMessagesDatabaseConnectedFabricMain>,
    'dbOptions'
  > => {
    const { swarmMessagesDatabaseCacheOptions } = this.__configuration;
    const swarmMessageStore = this._getActiveSwarmMessageStore();
    const activeUserId = this._getActiveUserId();

    return {
      cacheOptions: swarmMessagesDatabaseCacheOptions,
      swarmMessageStore,
      swarmMessagesCollector: this._getSwarmMessagesCollector(),
      user: {
        userId: activeUserId,
      },
    };
  };

  protected _getDatabaseConnectorFabricForChannnelsList() {
    // TODO - make fabrics of options for creating database connectors options, options for connection bridge
    const optionsForDatabaseConnectionFabric = this._getOptionsForSwarmMessagesDatabaseConnectedWithoutDatabaseOptionsFabric();
    const dbConnectorByDbOptionsFabric = getDatabaseConnectionByDatabaseOptionsFabricWithKvMessagesUpdatesQueuedHandling<
      TSwarmStoreConnectorDefault,
      T,
      MD,
      ISwarmStoreDBOGrandAccessCallbackBaseContext,
      TSwrmMessagesChannelsListDBOWithGrantAccess<
        TSwarmStoreConnectorDefault,
        T,
        MD,
        ISwarmStoreDBOGrandAccessCallbackBaseContext
      >
    >(
      // TODO - make a right type assertion
      optionsForDatabaseConnectionFabric as any
    );
    return dbConnectorByDbOptionsFabric;
  }

  protected _getOptionsForConstructorArgumentsFabric(
    channelsListDescription: ISwarmMessagesChannelsListDescription,
    channelDatabaseOptions: TSwrmMessagesChannelsListDBOWithGrantAccess<
      TSwarmStoreConnectorDefault,
      T,
      MD,
      ISwarmStoreDBOGrandAccessCallbackBaseContext,
      TSwarmStoreDatabaseOptions<TSwarmStoreConnectorDefault, T, TSwarmMessagesChannelsListDbType>
    >
  ): Parameters<typeof getSwarmMessagesChannelsListVersionOneInstanceWithDefaultParameters>[1] {
    const { connectionBridgeOptions } = this.__configuration;
    const { serializer, jsonSchemaValidator } = connectionBridgeOptions;
    return {
      description: channelsListDescription,
      connectionOptions: {
        connectorType: CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT,
        // TODO - resolve the type assertion
        dbOptions: channelDatabaseOptions,
      },
      utilities: {
        serializer,
      },
      validators: {
        jsonSchemaValidator,
      },
    };
  }

  protected _createSwarmMessagesChannelsList(
    channelsListDescription: ISwarmMessagesChannelsListDescription,
    channelDatabaseOptions: TSwrmMessagesChannelsListDBOWithGrantAccess<
      TSwarmStoreConnectorDefault,
      T,
      MD,
      ISwarmStoreDBOGrandAccessCallbackBaseContext,
      TSwarmStoreDatabaseOptions<TSwarmStoreConnectorDefault, T, TSwarmMessagesChannelsListDbType>
    >
  ): ISwarmMessagesChannelsDescriptionsList<TSwarmStoreConnectorDefault, T, MD> {
    const connectorFabric = this._getDatabaseConnectorFabricForChannnelsList();
    const optionsForConstructorArgumentsFabric = this._getOptionsForConstructorArgumentsFabric(
      channelsListDescription,
      channelDatabaseOptions
    );
    const swarmMessageChannelsList = getSwarmMessagesChannelsListVersionOneInstanceWithDefaultParameters<
      TSwarmStoreConnectorDefault,
      T,
      MD,
      ISwarmStoreDBOGrandAccessCallbackBaseContext,
      TSwrmMessagesChannelsListDBOWithGrantAccess<
        TSwarmStoreConnectorDefault,
        T,
        MD,
        ISwarmStoreDBOGrandAccessCallbackBaseContext
      >,
      typeof connectorFabric,
      typeof optionsForConstructorArgumentsFabric
    >(connectorFabric, optionsForConstructorArgumentsFabric);
    return swarmMessageChannelsList;
  }

  protected _waitTillSwarmMessageChannelsListWillBeReadyOrRejectIfClosed(
    swarmMessageChannelsList: ISwarmMessagesChannelsDescriptionsList<TSwarmStoreConnectorDefault, T, MD>
  ) {
    const swarmMessageChannelsListEmitter = swarmMessageChannelsList.emitter;
    return new Promise((res, rej) => {
      function onReady() {
        swarmMessageChannelsListEmitter.removeListener(ESwarmMessagesChannelsListEventName.CHANNELS_LIST_CLOSED, onClose);
        res(undefined);
      }
      function onClose() {
        swarmMessageChannelsListEmitter.removeListener(ESwarmMessagesChannelsListEventName.CHANNELS_LIST_CLOSED, onReady);
        rej(undefined);
      }

      swarmMessageChannelsListEmitter.once(ESwarmMessagesChannelsListEventName.CHANNELS_LIST_READY, onReady);
      swarmMessageChannelsListEmitter.once(ESwarmMessagesChannelsListEventName.CHANNELS_LIST_CLOSED, onClose);
    });
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

  protected _getDatabaseOptionsOrUndefined(dbName: DBO['dbName']): DBO | undefined {
    const { databasesList } = this.state;
    return databasesList.options?.[dbName] as DBO | undefined;
  }

  protected _getDatabaseMessagesListOrUndefined(
    dbName: DBO['dbName']
  ): TConnectToSwarmOrbitDbSwarmMessagesList<DbType> | undefined {
    const { databasesMessagesLists } = this.state;
    return databasesMessagesLists.get(dbName);
  }

  protected _creteNewDatabaseMessagesList(dbName: DBO['dbName']): void {
    if (!this._getDatabaseOptionsOrUndefined(dbName)) {
      throw new Error('A database with unknown options');
    }

    const { databasesMessagesLists } = this.state;
    const databaseMessagesList: TConnectToSwarmOrbitDbSwarmMessagesList<DbType> = new Map<
      TSwarmDatabaseName,
      IConnectToSwarmOrbitDbSwarmMessageDescription<DbType>
    >();

    databasesMessagesLists.set(dbName, databaseMessagesList);
  }

  protected _getOrCreateNewDatabaseMessagesListAndReturnIt(
    dbName: DBO['dbName']
  ): TConnectToSwarmOrbitDbSwarmMessagesList<DbType> {
    const databaseExistingMessagesList = this._getDatabaseMessagesListOrUndefined(dbName);
    if (!databaseExistingMessagesList) {
      this._creteNewDatabaseMessagesList(dbName);
    }

    const databaseMessagesList = databaseExistingMessagesList ?? this._getDatabaseMessagesListOrUndefined(dbName);
    if (!databaseMessagesList) {
      throw new Error('New database messages list creation has failed');
    }
    return databaseMessagesList;
  }

  protected _getSwarmMessageDescriptionByMetadata(
    message: ISwarmMessageInstanceDecrypted,
    messageId: string,
    databaseName: TSwarmDatabaseName,
    databaseKey?: string
  ): IConnectToSwarmOrbitDbSwarmMessageDescription<DbType> {
    const databaseOptions = this._getDatabaseOptionsOrUndefined(databaseName);
    if (databaseOptions?.dbType === ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE && !databaseKey) {
      throw new Error('A database key for the message is not defined');
    }
    return {
      id: messageId,
      key: databaseKey as DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE ? string : void,
      message,
    };
  }

  protected _getDatabaseMessagesListUpdateEventListenerParameter(
    dbName: TSwarmDatabaseName,
    swarmMessageDescription: IConnectToSwarmOrbitDbSwarmMessageDescription<DbType>,
    databaseMessagesList: TConnectToSwarmOrbitDbSwarmMessagesList<DbType>
  ): IConnectToSwarmOrbitDbWithChannelsDatabaseSwarmMessagesListUpdateListenerParameter<DbType> {
    return {
      databaseName: dbName,
      swarmMessageDescription,
      databaseSwarmMessagesList: databaseMessagesList,
    };
  }

  protected _emitDatabaseMessagesListUpdateEvent(
    eventListenerParameter: IConnectToSwarmOrbitDbWithChannelsDatabaseSwarmMessagesListUpdateListenerParameter<DbType>
  ): void {
    this.__emitterDatabaseMessagesListUpdate.emit(
      CONNECT_TO_SWARM_ORBITDB_WITH_CHANNELS_DATABASE_MESSAGES_UPDATE_EVENT_NAME,
      eventListenerParameter
    );
  }

  protected _addNewMessageReceivedToTheListAndEmitEventDatabaseMessagesListUpdate(
    databaseName: TSwarmDatabaseName,
    message: ISwarmMessageInstanceDecrypted,
    messageId: string,
    databaseKey?: string
  ): void {
    const databaseMessagesList = this._getOrCreateNewDatabaseMessagesListAndReturnIt(databaseName);
    if (databaseMessagesList.get(messageId)) {
      // if a message with the same identity already exists in the list
      return;
    }

    const swarmMessageDescription = this._getSwarmMessageDescriptionByMetadata(message, messageId, databaseName, databaseKey);
    databaseMessagesList.set(messageId, swarmMessageDescription);

    const eventListenerParamter = this._getDatabaseMessagesListUpdateEventListenerParameter(
      databaseName,
      swarmMessageDescription,
      databaseMessagesList
    );

    this._emitDatabaseMessagesListUpdateEvent(eventListenerParamter);
  }

  protected _handleMessage = (
    dbName: DBO['dbName'],
    message: ISwarmMessageInstanceDecrypted,
    messageId: string,
    databaseKey?: string
  ): void => {
    this._addNewMessageReceivedToTheListAndEmitEventDatabaseMessagesListUpdate(dbName, message, messageId, databaseKey);
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

  protected _getSwarmMessagesChannelConstructorOptions(
    swarmChannelsListInstance: ISwarmMessagesChannelsDescriptionsList<TSwarmStoreConnectorDefault, T, MD>,
    swarmMessageChannelDescription: ISwarmMessageChannelDescriptionRaw<
      TSwarmStoreConnectorDefault,
      T,
      TSwarmStoreDatabaseType<TSwarmStoreConnectorDefault>,
      TSwarmStoreDatabaseOptions<
        TSwarmStoreConnectorDefault,
        TSwarmMessageSerialized,
        TSwarmStoreDatabaseType<TSwarmStoreConnectorDefault>
      >
    >
  ): ISwarmMessagesChannelV1DefaultFabricOptionsDefault<
    TSwarmStoreConnectorDefault,
    T,
    MD,
    DbType,
    DBO
  >['channelConstructorMainOptions'] {
    const { centralAuthorityConnection, swarmMessageStore } = this._getActiveConnectionBridgeInstance();

    if (!centralAuthorityConnection) {
      throw new Error('Central authority connection is not ready to be used');
    }
    if (!swarmMessageStore) {
      throw new Error('Swarm message store is not ready to be used');
    }

    const currentUserId = this._getActiveUserId();

    const swarmMessagesChannelConstructorOptions: Omit<
      ISwarmMessagesChannelConstructorOptions<
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
        typeof swarmMessageStore,
        MD,
        any,
        any,
        any,
        any,
        any
      >,
      'passwordEncryptedChannelEncryptionQueue' | 'utils'
    > = {
      currentUserId,
      swarmMessagesChannelDescription: swarmMessageChannelDescription,
      swarmMessagesChannelsListInstance: swarmChannelsListInstance,
    };

    return swarmMessagesChannelConstructorOptions;
  }

  protected _getSwarmMessagesDatabaseConnectorOptions(): Omit<
    ISwarmMessagesDatabaseConnectOptions<
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
      MD,
      any,
      any,
      any
    >,
    'dbOptions' | 'user'
  > {
    const swarmMessageStore = this._getActiveSwarmMessageStore();
    const swarmMessagesCollector = createSwarmMessagesDatabaseMessagesCollectorWithStoreMetaInstance({
      swarmMessageStore,
      getSwarmMessageStoreMeta: getSwarmMessageStoreMeta as (
        swarmMessageStoreParameter: typeof swarmMessageStore,
        dbName: DBO['dbName']
      ) => Promise<ISwarmMessagesStoreMeta>,
    });
    const { swarmMessagesDatabaseCacheOptions } = this.__configuration;
    const swarmMessagesDatabaseConnectorOptions: Omit<
      ISwarmMessagesDatabaseConnectOptions<
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
        MD,
        any,
        any,
        any
      >,
      'dbOptions' | 'user'
    > = {
      swarmMessageStore,
      cacheOptions: swarmMessagesDatabaseCacheOptions,
      swarmMessagesCollector,
    };
    return swarmMessagesDatabaseConnectorOptions;
  }

  protected _getOptionsForSwarmMessagesChannelV1FabricByChannelsListInstanceAndChannelDescription(
    channelsListInstance: ISwarmMessagesChannelsDescriptionsList<TSwarmStoreConnectorDefault, T, MD>,
    swarmMessageChannelDescription: ISwarmMessageChannelDescriptionRaw<
      TSwarmStoreConnectorDefault,
      T,
      TSwarmStoreDatabaseType<TSwarmStoreConnectorDefault>,
      TSwarmStoreDatabaseOptions<
        TSwarmStoreConnectorDefault,
        TSwarmMessageSerialized,
        TSwarmStoreDatabaseType<TSwarmStoreConnectorDefault>
      >
    >
  ): ISwarmMessagesChannelV1DefaultFabricOptionsDefault<TSwarmStoreConnectorDefault, T, MD, DbType, DBO> {
    const swarmMessagesChannelConstructorOptions = this._getSwarmMessagesChannelConstructorOptions(
      channelsListInstance,
      swarmMessageChannelDescription
    );
    const swarmMessagesDatabaseConnectorOptions =
      this._getSwarmMessagesDatabaseConnectorOptions() as ISwarmMessagesChannelV1DefaultFabricOptionsDefault<
        TSwarmStoreConnectorDefault,
        T,
        MD,
        DbType,
        DBO
      >['channelDatabaseConnectorOptions'];
    const defaultConnectionUtils = {
      getSwarmMessagesDatabaseConnectorInstanceDefaultFabric:
        getSwarmMessagesDatabaseWithKVDbMessagesUpdatesConnectorInstanceFabric,
    } as ISwarmMessagesChannelV1DefaultFabricOptionsDefault<
      TSwarmStoreConnectorDefault,
      T,
      MD,
      DbType,
      DBO
    >['defaultConnectionUtils'];
    return {
      channelConstructorMainOptions: swarmMessagesChannelConstructorOptions,
      channelDatabaseConnectorOptions: swarmMessagesDatabaseConnectorOptions,
      defaultConnectionUtils,
    } as ISwarmMessagesChannelV1DefaultFabricOptionsDefault<TSwarmStoreConnectorDefault, T, MD, DbType, DBO>;
  }

  protected async _createSwarmMessagesChannelInstanceAndConnect<
    SMCDR extends ISwarmMessageChannelDescriptionRaw<
      TSwarmStoreConnectorDefault,
      TSwarmMessageSerialized,
      ESwarmStoreConnectorOrbitDbDatabaseType,
      TSwarmStoreDatabaseOptions<TSwarmStoreConnectorDefault, TSwarmMessageSerialized, ESwarmStoreConnectorOrbitDbDatabaseType>
    >
  >(
    channelsListInstance: ISwarmMessagesChannelsDescriptionsList<TSwarmStoreConnectorDefault, T, MD>,
    swarmMessageChannelDescriptionRaw: SMCDR
  ): Promise<TSwarmMessagesChannelAnyByChannelDescriptionRaw<SMCDR>> {
    const swarmMessageStore = this._getActiveSwarmMessageStore();
    const optionsForChannelFabric = this._getOptionsForSwarmMessagesChannelV1FabricByChannelsListInstanceAndChannelDescription(
      channelsListInstance,
      swarmMessageChannelDescriptionRaw
    );
    const swarmMessagesChannelInstance = await getSwarmMessagesChannelV1InstanveWithDefaults<
      TSwarmStoreConnectorDefault,
      T,
      typeof swarmMessageChannelDescriptionRaw['dbType'],
      TDatabaseOptionsTypeByChannelDescriptionRaw<typeof swarmMessageChannelDescriptionRaw>,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      typeof swarmMessageStore,
      MD,
      any,
      any,
      any,
      any,
      any
    >(optionsForChannelFabric as unknown as any);

    const isChannelReady = swarmMessagesChannelInstance.isReady;

    if (!isChannelReady) {
      await new Promise((res) =>
        swarmMessagesChannelInstance.emitterChannelState.once(ESwarmMessagesChannelEventName.CHANNEL_OPEN, res)
      );
    }

    return swarmMessagesChannelInstance as unknown as TSwarmMessagesChannelAnyByChannelDescriptionRaw<SMCDR>;
  }

  protected _handleDatabasesListClosed(
    swarmMessagesChannelsList: ISwarmMessagesChannelsDescriptionsList<TSwarmStoreConnectorDefault, T, MD>
  ): void {
    if (this.state.swarmMessagesChannelsList === swarmMessagesChannelsList) {
      this._updateState({
        swarmMessagesChannelsList: undefined,
      });
    }
  }

  protected _setListenerSwarmMessagesChannelsListClosed(
    swarmMessagesChannelsList: ISwarmMessagesChannelsDescriptionsList<TSwarmStoreConnectorDefault, T, MD>
  ): void {
    swarmMessagesChannelsList.emitter.once(ESwarmMessagesChannelsListEventName.CHANNELS_LIST_CLOSED, () =>
      this._handleDatabasesListClosed(swarmMessagesChannelsList)
    );
  }
}
