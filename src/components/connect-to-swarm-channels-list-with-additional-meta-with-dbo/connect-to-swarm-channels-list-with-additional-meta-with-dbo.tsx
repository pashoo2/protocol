import React from 'react';
import { TSwarmMessageSerialized } from '../../classes/swarm-message/swarm-message-constructor.types';
import { ISwarmMessageInstanceDecrypted } from '../../classes/swarm-message/swarm-message-constructor.types';
import { TSwarmStoreDatabaseOptions, TSwarmStoreDatabaseType } from '../../classes/swarm-store-class/swarm-store-class.types';
import { IConnectionBridgeOptionsDefault } from '../../classes/connection-bridge/types/connection-bridge.types';
import { P } from '../connect-to-swarm-with-dbo/connect-to-swarm-with-dbo';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../classes/swarm-store-class/swarm-store-connectors/swarm-store-connectors.types';
import { ConnectToSwarmWithAdditionalMetaWithDBO } from '../connect-to-swarm-with-additional-meta-with-dbo';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { ESwarmStoreConnector } from '../../classes/swarm-store-class/swarm-store-class.const';
import {
  ISwarmMessageChannelDescriptionRaw,
  ISwarmMessagesChannelConstructorOptions,
} from '../../classes/swarm-messages-channels/types/swarm-messages-channel-instance.types';
import { SWARM_MESSAGES_CHANNEL_ENCRYPTION } from '../../classes/swarm-messages-channels/const/swarm-messages-channels-main.const';
import {
  TSwrmMessagesChannelsListDBOWithGrantAccess,
  ISwarmMessagesChannelsDescriptionsList,
} from '../../classes/swarm-messages-channels/types/swarm-messages-channels-list-instance.types';
import { IUserCredentialsCommon } from '../../types/credentials.types';
import { ESwarmMessagesChannelsListEventName } from '../../classes/swarm-messages-channels/types/swarm-messages-channels-list-events.types';
import { getSwarmMessagesChannelsListVersionOneInstanceWithDefaultParameters } from '../../classes/swarm-messages-channels/swarm-messages-channels-classes/swarm-messages-channels-list-classes/swarm-messages-channels-list-v1-class/utils/swarm-messages-channels-list-v1-instance-fabrics/swarm-messages-channels-list-v1-instance-fabric-default';
import { SwarmMessagesChannelsListComponent } from '../swarm-messages-channels-list/swarm-messages-channels-list';
import { getDatabaseConnectionByDatabaseOptionsFabricWithKvMessagesUpdatesQueuedHandling } from '../../classes/swarm-messages-channels/swarm-messages-channels-classes/swarm-messages-channels-list-classes/swarm-messages-channels-list-v1-class/utils/swarm-messages-channels-list-v1-constructor-arguments-fabrics/swarm-messages-channels-list-v1-database-connection-fabrics/swarm-messages-channels-list-v1-database-connection-fabric-with-kv-messages-updates-queued-handling';
import {
  ISwarmMessagesDatabaseCacheOptions,
  ISwarmMessagesDatabaseCache,
} from '../../classes/swarm-messages-database/swarm-messages-database.types';
import {
  ISwarmMessagesDatabaseMessagesCollectorWithStoreMeta,
  ISwarmMessagesStoreMeta,
} from '../../classes/swarm-messages-database/swarm-messages-database.messages-collector.types';
import {
  TConnectionBridgeOptionsSwarmMessageStoreInstance,
  TSwarmStoreDatabasesPersistentListFabric,
} from '../../classes/connection-bridge/types/connection-bridge.types-helpers/connection-bridge-options.types-helpers';
import {
  TConnectionBridgeOptionsConnectorBasic,
  TConnectionBridgeOptionsConnectorMain,
} from '../../classes/connection-bridge/types/connection-bridge.types-helpers/connection-bridge-options.types-helpers';
import { SWARM_MESSAGES_CHANNEL_VERSION } from 'classes/swarm-messages-channels/swarm-messages-channels-classes/const/swarm-messages-channel-classes-params.const';
import { ESwarmChannelsListVersion } from '../../classes/swarm-messages-channels/swarm-messages-channels-classes/const/swarm-messages-channels-list-classes-params.const';
import { ISwarmMessagesDatabaseConnectOptions } from '../../classes/swarm-messages-database/swarm-messages-database.types';
import { CONNECTO_TO_SWARM_OPTIONS_SWARM_MESSAGES_DATABASE_CACHE_WITH_STORE_META_OPTIONS } from '../const/connect-to-swarm.const';
import { getSwarmMessagesDatabaseWithKVDbMessagesUpdatesConnectorInstanceFabric } from '../../classes/swarm-messages-channels/swarm-messages-channels-classes/swarm-messages-channel-classes/swarm-messages-channel-v1-class/utils/swarm-messages-channel-v1-constructor-options-default-utils/utils/swarm-messages-channel-v1-constructor-options-default-utils-database-connector-fabrics';
import { ISwarmMessagesChannelV1DefaultFabricOptionsDefault } from '../../classes/swarm-messages-channels/swarm-messages-channels-classes/swarm-messages-channel-classes/swarm-messages-channel-v1-class/implementations/fabrics/types/swarm-messages-channel-v1-fabric-async-default.types';
import { getSwarmMessagesChannelFabricByChannelDescriptionFabric } from '../../classes/swarm-messages-channels/swarm-messages-channels-classes/swarm-messages-channel-classes/swarm-messages-channel-v1-class/implementations/fabrics/swarm-messages-channel-v1-fabric-by-channel-description';
import { ISwarmMessagesChannelFabricByChannelDescriptionWithDefaults } from '../../classes/swarm-messages-channels/types/swarm-messages-channel-instance.fabrics.types';
import { createSwarmMessagesDatabaseMessagesCollectorWithStoreMetaInstance } from '../../classes/swarm-messages-database/swarm-messages-database-subclasses/swarm-messages-database-messages-collector-with-store-meta/swarm-messages-database-messages-collector-with-store-meta';
import { getSwarmMessageStoreMeta } from 'classes/swarm-messages-database/swarm-messages-database-utils/swarm-messages-database-messages-collector-utils/swarm-messages-database-messages-collector-utils';
import { ESwarmMessagesChannelEventName } from '../../classes/swarm-messages-channels/types/swarm-messages-channel-events.types';
import { PromiseResolveType } from '../../types/promise.types';
import { SwarmChannelInstanceComponent } from '../swarm-channel-instance-component/swarm-channel-instance-component';

/**
 * Swarm messages channels list
 *
 * @export
 * @class ConnectToSwarmAndCreateSwarmMessagesChannelsListWithAdditionalMetaWithDBO
 * @extends {ConnectToSwarmWithAdditionalMetaWithDBO<DbType, T, DBO, CD, ConnectorBasic, ConnectorMain, SMS, SSDPLF, CBO, MI, MD, SMSM, DCO, DCCRT, SMDCC>}
 * @template T
 * @template DbType
 * @template DBO
 * @template CD
 * @template ConnectorBasic
 * @template ConnectorMain
 * @template SMS
 * @template SSDPLF
 * @template CBO
 * @template MI
 * @template MD
 * @template SMSM
 * @template DCO
 * @template DCCRT
 * @template SMDCC
 */
export class ConnectToSwarmAndCreateSwarmMessagesChannelsListWithAdditionalMetaWithDBO<
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
> extends ConnectToSwarmWithAdditionalMetaWithDBO<
  DbType,
  T,
  DBO,
  CD,
  TConnectionBridgeOptionsConnectorBasic<CBO>,
  TConnectionBridgeOptionsConnectorMain<CBO>,
  TConnectionBridgeOptionsSwarmMessageStoreInstance<CBO>,
  TSwarmStoreDatabasesPersistentListFabric<CBO>,
  CBO,
  MD,
  MD,
  ISwarmMessagesDatabaseMessagesCollectorWithStoreMeta<P, T, DBO, DbType, MD, ISwarmMessagesStoreMeta>,
  ISwarmMessagesDatabaseCacheOptions<
    P,
    DbType,
    MD,
    ISwarmMessagesDatabaseMessagesCollectorWithStoreMeta<P, T, DBO, DbType, MD, ISwarmMessagesStoreMeta>
  >,
  ISwarmMessagesDatabaseCache<
    P,
    T,
    DbType,
    DBO,
    MD,
    ISwarmMessagesDatabaseMessagesCollectorWithStoreMeta<P, T, DBO, DbType, MD, ISwarmMessagesStoreMeta>
  >
> {
  protected __swarmChannelsFabricChannelDescription?: ISwarmMessagesChannelFabricByChannelDescriptionWithDefaults<
    ESwarmStoreConnector.OrbitDB,
    T,
    MD,
    DbType,
    DBO
  >;

  public async componentDidMount() {
    const { userCredentialsToConnectImmediate } = this.props;
    if (userCredentialsToConnectImmediate) {
      const swarmMessagesChannelsList = await this._connectToSwarmAndCreateSwarmMessagesChannelsList(
        userCredentialsToConnectImmediate
      );
      const currentUserId = this.getCurrentUserId();
      const swarmMessageChannelDescription = this.getSwarmMessagesChannelDescriptionDefault(currentUserId);
      this._setListenersChannelsListInstance(swarmMessagesChannelsList);
      this.setState({
        swarmMessagesChannelsList,
        swarmMessageChannelDescription,
      });
    }
  }

  public render(): React.ReactElement {
    const { swarmMessagesChannelsList, openedSwarmChannelInstance } = this.state as any;
    const whetherConnectionBridgeInstanceInitialized = this.isConnectionBridgeInstanceInitialized();
    if (openedSwarmChannelInstance) {
      return this._renderSwarmMessagesChannel();
    }
    return (
      <div>
        {this._renderUserIdentity()}
        <hr />
        Swarm messages channels list
        <br />
        {swarmMessagesChannelsList && whetherConnectionBridgeInstanceInitialized ? (
          <SwarmMessagesChannelsListComponent
            currentUserId={this.getCurrentUserId()}
            channelsList={swarmMessagesChannelsList}
            onChoseSwarmChannel={this.__onChoseSwarmChannel}
          />
        ) : (
          'channels list instance is not exists'
        )}
      </div>
    );
  }

  public componentWillUnmount() {
    const { openedSwarmChannelInstance } = this.state as unknown as {
      openedSwarmChannelInstance: PromiseResolveType<
        ReturnType<ISwarmMessagesChannelFabricByChannelDescriptionWithDefaults<ESwarmStoreConnector.OrbitDB, T, MD, DbType, DBO>>
      > | null;
    };

    if (openedSwarmChannelInstance) {
      openedSwarmChannelInstance.emitterChannelState.removeListener(
        ESwarmMessagesChannelEventName.CHANNEL_CLOSED,
        this.__handleChannelClosed
      );
    }
  }

  protected isConnectionBridgeInstanceInitialized(): boolean {
    const { connectionBridge } = this.state;

    return Boolean(connectionBridge);
  }

  protected getCurrentUserId(): string {
    const { connectionBridge } = this.state;
    if (!connectionBridge) {
      throw new Error('A connection bridge instance is not initialized');
    }
    const currentUserId = connectionBridge.centralAuthorityConnection?.getUserIdentity();
    if (!currentUserId) {
      throw new Error('An identity of the current user should be provided');
    }
    if (currentUserId instanceof Error) {
      throw currentUserId;
    }
    return currentUserId;
  }

  protected _renderUserIdentity(): React.ReactElement | null {
    const { connectionBridge } = this.state;
    if (!connectionBridge) {
      return null;
    }
    return <p>User id: {this.getCurrentUserId()}</p>;
  }

  protected _getOptionsForConstructorArgumentsFabric(): Parameters<
    typeof getSwarmMessagesChannelsListVersionOneInstanceWithDefaultParameters
  >[1] {
    const description = {
      version: ESwarmChannelsListVersion.FIRST,
      id: 'eff9f522-3a63-46f7-8d5f-ad76765c3779',
      name: 'channelsList',
    };
    const { dbo, connectionBridgeOptions } = this.props;
    const { serializer, jsonSchemaValidator } = connectionBridgeOptions as CBO;
    return {
      description,
      connectionOptions: {
        connectorType: ESwarmStoreConnector.OrbitDB,
        dbOptions: dbo as any,
      },
      utilities: {
        serializer,
      },
      validators: {
        jsonSchemaValidator,
      },
    };
  }

  protected _renderSwarmMessagesChannel(): React.ReactElement {
    const { openedSwarmChannelInstance } = this.state as any;

    if (!openedSwarmChannelInstance) {
      throw new Error('Swarm channel instance should be defined');
    }
    return <SwarmChannelInstanceComponent swarmMessagesChannelInstance={openedSwarmChannelInstance} />;
  }

  protected _getDatabaseConnectorFabricForChannnelsList() {
    // TODO - make fabrics of options for creating database connectors options, options for connection bridge
    const optionsForDatabaseConnectionFabric = this._getOptionsForSwarmMessagesDatabaseConnectedWithoutDatabaseOptionsFabric();
    const dbConnectorByDbOptionsFabric = getDatabaseConnectionByDatabaseOptionsFabricWithKvMessagesUpdatesQueuedHandling<
      P,
      T,
      MD,
      ISwarmStoreDBOGrandAccessCallbackBaseContext,
      TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, ISwarmStoreDBOGrandAccessCallbackBaseContext>
    >(optionsForDatabaseConnectionFabric as any);
    return dbConnectorByDbOptionsFabric;
  }

  protected _createSwarmMessagesChannelsList() {
    const connectorFabric = this._getDatabaseConnectorFabricForChannnelsList();
    const optionsForConstructorArgumentsFabric = this._getOptionsForConstructorArgumentsFabric();
    const swarmMessageChannelsList = getSwarmMessagesChannelsListVersionOneInstanceWithDefaultParameters<
      P,
      T,
      MD,
      ISwarmStoreDBOGrandAccessCallbackBaseContext,
      TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, ISwarmStoreDBOGrandAccessCallbackBaseContext>,
      typeof connectorFabric,
      typeof optionsForConstructorArgumentsFabric
    >(connectorFabric, optionsForConstructorArgumentsFabric);
    return swarmMessageChannelsList;
  }

  protected getSwarmMessagesChannelDescriptionDefault<
    DT extends ESwarmStoreConnectorOrbitDbDatabaseType = ESwarmStoreConnectorOrbitDbDatabaseType.FEED
  >(
    currentUserId: string,
    dbType: DT = ESwarmStoreConnectorOrbitDbDatabaseType.FEED as DT
  ): ISwarmMessageChannelDescriptionRaw<
    P,
    TSwarmMessageSerialized,
    DT,
    TSwarmStoreDatabaseOptions<P, TSwarmMessageSerialized, DT>
  > {
    const swarmMessageChannelDescription = {
      id: '40accad4-7941-41aa-95db-7954e80a73b8',
      dbType: dbType,
      version: SWARM_MESSAGES_CHANNEL_VERSION.FIRST,
      tags: ['test', 'swarm_channel'],
      name: 'test swarm channel',
      admins: [currentUserId],
      description: 'This is a swarm channel for test purposes',
      messageEncryption: SWARM_MESSAGES_CHANNEL_ENCRYPTION.PUBLIC,
      dbOptions: {
        write: [currentUserId],
        grantAccess: function grantAccess(): Promise<boolean> {
          return Promise.resolve(true);
        },
      },
    };
    return swarmMessageChannelDescription;
  }

  protected async _connectToSwarmAndCreateSwarmMessagesChannelsList(
    userCredentialsToConnectImmediate: IUserCredentialsCommon
  ): Promise<ISwarmMessagesChannelsDescriptionsList<ESwarmStoreConnector, T, MD>> {
    await this.connectToSwarm(userCredentialsToConnectImmediate);
    const channelsListInstance = this._createSwarmMessagesChannelsList();
    return channelsListInstance;
  }

  protected async addChannelDescriptionToChannelsList(
    channelsListInstance: ISwarmMessagesChannelsDescriptionsList<ESwarmStoreConnector, T, MD>,
    swarmMessageChannelDescription: ISwarmMessageChannelDescriptionRaw<
      P,
      TSwarmMessageSerialized,
      TSwarmStoreDatabaseType<P>,
      TSwarmStoreDatabaseOptions<P, TSwarmMessageSerialized, TSwarmStoreDatabaseType<P>>
    >
  ): Promise<void> {
    await channelsListInstance.upsertChannel(swarmMessageChannelDescription);
  }

  protected _setListenersChannelsListInstance(
    channelsListInstance: ISwarmMessagesChannelsDescriptionsList<ESwarmStoreConnector, T, MD>
  ): void {
    const channelsListEventsEmitter = channelsListInstance.emitter;
    channelsListEventsEmitter.addListener(
      ESwarmMessagesChannelsListEventName.CHANNELS_LIST_READY,
      this.__handleChannelsListIsReady
    );
  }

  protected async _onChannelAdded(
    channelsListInstance: ISwarmMessagesChannelsDescriptionsList<ESwarmStoreConnector, T, MD>,
    swarmMessageChannelDescription: ISwarmMessageChannelDescriptionRaw<
      P,
      TSwarmMessageSerialized,
      TSwarmStoreDatabaseType<P>,
      TSwarmStoreDatabaseOptions<P, TSwarmMessageSerialized, TSwarmStoreDatabaseType<P>>
    >
  ): Promise<void> {}

  private __handleChannelsListIsReady = async () => {
    this.setState({
      channelsListIsReady: true,
    });
  };

  protected _getConnectionBridgeInstance() {
    const connectionBridge = this.state.connectionBridge;
    if (!connectionBridge) {
      throw new Error('Connection bridge insance is not available to be used');
    }
    return connectionBridge;
  }

  protected _getSwarmMessagesDatabaseConnectorOptions(): Omit<
    ISwarmMessagesDatabaseConnectOptions<P, T, DbType, DBO, any, any, any, any, any, any, any, any, any, any, MD, any, any, any>,
    'dbOptions' | 'user'
  > {
    const connectionBridge = this._getConnectionBridgeInstance();
    const swarmMessageStore = connectionBridge.swarmMessageStore;

    if (!swarmMessageStore) {
      throw new Error('Swarm message store is not redy to be used');
    }

    const swarmMessagesCollector = createSwarmMessagesDatabaseMessagesCollectorWithStoreMetaInstance({
      swarmMessageStore,
      getSwarmMessageStoreMeta,
    });
    const swarmMessagesDatabaseConnectorOptions: Omit<
      ISwarmMessagesDatabaseConnectOptions<
        P,
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
      cacheOptions: CONNECTO_TO_SWARM_OPTIONS_SWARM_MESSAGES_DATABASE_CACHE_WITH_STORE_META_OPTIONS,
      swarmMessagesCollector,
    };
    return swarmMessagesDatabaseConnectorOptions;
  }

  protected _getSwarmMessagesChannelConstructorOptions(
    channelsListInstance: ISwarmMessagesChannelsDescriptionsList<P, T, MD>,
    swarmMessageChannelDescription?: ISwarmMessageChannelDescriptionRaw<
      P,
      T,
      TSwarmStoreDatabaseType<P>,
      TSwarmStoreDatabaseOptions<P, TSwarmMessageSerialized, TSwarmStoreDatabaseType<P>>
    >
  ): ISwarmMessagesChannelV1DefaultFabricOptionsDefault<
    ESwarmStoreConnector.OrbitDB,
    T,
    MD,
    DbType,
    DBO
  >['channelConstructorMainOptions'] {
    const { centralAuthorityConnection, swarmMessageStore } = this._getConnectionBridgeInstance();

    if (!centralAuthorityConnection) {
      throw new Error('Central authority connection is not ready to be used');
    }
    if (!swarmMessageStore) {
      throw new Error('Swarm message store is not redy to be used');
    }

    const currentUserId = centralAuthorityConnection?.getUserIdentity();

    if (currentUserId instanceof Error) {
      throw currentUserId;
    }
    if (!currentUserId) {
      throw new Error('Current user identifier is not defined');
    }

    const swarmMessagesChannelConstructorOptions: Omit<
      ISwarmMessagesChannelConstructorOptions<
        P,
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
        any,
        any,
        typeof swarmMessageStore
      >,
      'passwordEncryptedChannelEncryptionQueue' | 'utils'
    > = {
      currentUserId,
      swarmMessagesChannelDescription: swarmMessageChannelDescription,
      swarmMessagesChannelsListInstance: channelsListInstance,
    };

    return swarmMessagesChannelConstructorOptions;
  }

  protected _getOptionsForSwarmMessagesChannelV1FabricByChannelsListInstanceAndChannelDescription(
    channelsListInstance: ISwarmMessagesChannelsDescriptionsList<P, T, MD>,
    swarmMessageChannelDescription?: ISwarmMessageChannelDescriptionRaw<
      P,
      T,
      TSwarmStoreDatabaseType<P>,
      TSwarmStoreDatabaseOptions<P, TSwarmMessageSerialized, TSwarmStoreDatabaseType<P>>
    >
  ): ISwarmMessagesChannelV1DefaultFabricOptionsDefault<ESwarmStoreConnector.OrbitDB, T, MD, DbType, DBO> {
    const swarmMessagesChannelConstructorOptions = this._getSwarmMessagesChannelConstructorOptions(
      channelsListInstance,
      swarmMessageChannelDescription
    );
    const swarmMessagesDatabaseConnectorOptions =
      this._getSwarmMessagesDatabaseConnectorOptions() as ISwarmMessagesChannelV1DefaultFabricOptionsDefault<
        ESwarmStoreConnector.OrbitDB,
        T,
        MD,
        DbType,
        DBO
      >['channelDatabaseConnectorOptions'];
    const defaultConnectionUtils = {
      getSwarmMessagesDatabaseConnectorInstanceDefaultFabric:
        getSwarmMessagesDatabaseWithKVDbMessagesUpdatesConnectorInstanceFabric,
    } as ISwarmMessagesChannelV1DefaultFabricOptionsDefault<
      ESwarmStoreConnector.OrbitDB,
      T,
      MD,
      DbType,
      DBO
    >['defaultConnectionUtils'];
    return {
      channelConstructorMainOptions: swarmMessagesChannelConstructorOptions,
      channelDatabaseConnectorOptions: swarmMessagesDatabaseConnectorOptions,
      defaultConnectionUtils,
    } as ISwarmMessagesChannelV1DefaultFabricOptionsDefault<ESwarmStoreConnector.OrbitDB, T, MD, DbType, DBO>;
  }

  /**
   * Returns fabric of a swarm channel instance by it's description
   *
   * @private
   * @returns {ISwarmMessagesChannelFabricByChannelDescriptionWithDefaults<
   *     ESwarmStoreConnector.OrbitDB,
   *     T,
   *     MD,
   *     DbType,
   *     DBO
   *   >}
   * @memberof ConnectToSwarmAndCreateSwarmMessagesChannelsListWithAdditionalMetaWithDBO
   */
  private __createSwarmChannelsFabricChannelDescription(): ISwarmMessagesChannelFabricByChannelDescriptionWithDefaults<
    ESwarmStoreConnector.OrbitDB,
    T,
    MD,
    DbType,
    DBO
  > {
    const { swarmMessagesChannelsList } = this.state as any;

    if (!swarmMessagesChannelsList) {
      throw new Error('Swarm messages channels list is not ready');
    }
    const optionsToCreateSwarmChannelInstanceFabric =
      this._getOptionsForSwarmMessagesChannelV1FabricByChannelsListInstanceAndChannelDescription(swarmMessagesChannelsList);
    const swarmChannelInstanceByDescriptionFabric = getSwarmMessagesChannelFabricByChannelDescriptionFabric<
      ESwarmStoreConnector.OrbitDB,
      T,
      MD,
      DbType,
      DBO
    >(optionsToCreateSwarmChannelInstanceFabric as any);
    return swarmChannelInstanceByDescriptionFabric as unknown as ISwarmMessagesChannelFabricByChannelDescriptionWithDefaults<
      ESwarmStoreConnector.OrbitDB,
      T,
      MD,
      DbType,
      DBO
    >;
  }

  protected __getExistingSwarmChannelsFabricChannelDescriptionOrCreateNewOne(): ISwarmMessagesChannelFabricByChannelDescriptionWithDefaults<
    ESwarmStoreConnector.OrbitDB,
    T,
    MD,
    DbType,
    DBO
  > {
    const swarmChannelsFabricChannelDescription = this.__swarmChannelsFabricChannelDescription;

    if (swarmChannelsFabricChannelDescription) {
      return swarmChannelsFabricChannelDescription;
    }

    const swarmChannelsFabricChannelDescriptionNew = this.__createSwarmChannelsFabricChannelDescription();

    this.__swarmChannelsFabricChannelDescription = swarmChannelsFabricChannelDescriptionNew;
    return swarmChannelsFabricChannelDescriptionNew;
  }

  protected async _createSwarmChannelInstanceByDescription(
    swarmChannelDescription: ISwarmMessageChannelDescriptionRaw<P, T, any, any>
  ): Promise<void> {
    const fabricSwarmChannelByChannelDescription = this.__getExistingSwarmChannelsFabricChannelDescriptionOrCreateNewOne();
    const swarmChannelInstance = await fabricSwarmChannelByChannelDescription(swarmChannelDescription);
    if (process.env.NODE_ENV === 'development') debugger;
    // TODO - render the instance with SwarmChannelInstanceComponent
    this.setState({
      openedSwarmChannelInstance: swarmChannelInstance,
    });
    swarmChannelInstance.emitterChannelState.once(ESwarmMessagesChannelEventName.CHANNEL_CLOSED, this.__handleChannelClosed);
  }

  private __onChoseSwarmChannel = async (
    swarmChannelDescription: ISwarmMessageChannelDescriptionRaw<P, T, any, any>
  ): Promise<void> => {
    await this._createSwarmChannelInstanceByDescription(swarmChannelDescription);
  };

  private __handleChannelClosed = () => {
    this.setState({
      openedSwarmChannelInstance: null,
    });
  };
}
