import React from 'react';
import { TSwarmMessageSerialized } from '../../classes/swarm-message/swarm-message-constructor.types';
import { ISwarmMessageInstanceDecrypted } from '../../classes/swarm-message/swarm-message-constructor.types';
import { TSwarmStoreDatabaseOptions, TSwarmStoreDatabaseType } from '../../classes/swarm-store-class/swarm-store-class.types';
import { IConnectionBridgeOptionsDefault } from '../../classes/connection-bridge/types/connection-bridge.types';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../classes/swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { ISwarmMessageChannelDescriptionRaw } from '../../classes/swarm-messages-channels/types/swarm-messages-channel-instance.types';
import {
  TSwrmMessagesChannelsListDBOWithGrantAccess,
  ISwarmMessagesChannelsDescriptionsList,
  ISwarmMessagesChannelsListDescription,
  TSwarmMessagesChannelsListDbType,
} from '../../classes/swarm-messages-channels/types/swarm-messages-channels-list-instance.types';
import { IUserCredentialsCommon } from '../../types/credentials.types';
import { ESwarmMessagesChannelsListEventName } from '../../classes/swarm-messages-channels/types/swarm-messages-channels-list-events.types';
import { SwarmMessagesChannelsListComponent } from '../swarm-messages-channels-list/swarm-messages-channels-list';
import {
  ISwarmMessagesDatabaseCacheOptions,
  ISwarmMessagesDatabaseCache,
  ISwarmMessagesDatabaseCacheConstructor,
} from '../../classes/swarm-messages-database/swarm-messages-database.types';
import {
  ISwarmMessagesDatabaseMessagesCollector,
  ISwarmMessagesDatabaseMessagesCollectorWithStoreMeta,
  ISwarmMessagesStoreMeta,
} from '../../classes/swarm-messages-database/swarm-messages-database.messages-collector.types';
import { ESwarmMessagesChannelEventName } from '../../classes/swarm-messages-channels/types/swarm-messages-channel-events.types';
import { SwarmChannelInstanceComponent } from '../swarm-channel-instance-component/swarm-channel-instance-component';
import {
  TSwarmStoreConnectorDefault,
  ConnectionToSwarmWithChannels,
  IConnectionToSwarmWithChannels,
  IConnectToSwarmOrbitDbWithChannelsConstructorOptions,
  IConnectToSwarmOrbitDbWithChannelsState,
} from 'classes/connection-helpers/connect-to-swarm-orbitdb-with-channels';
import {
  TCentralAuthorityUserIdentity,
  TSwarmMessagesChannelAnyByChannelDescriptionRaw,
  TSwarmMessageUserIdentifierSerialized,
} from 'classes';
import { ISerializer } from 'types/serialization.types';
import { TConnectionBridgeByOptions } from 'classes/connection-bridge/types/connection-bridge.types-helpers/connection-bridge.types.helpers';

export interface IConnectToSwarmAndCreateSwarmMessagesChannelsListWithAdditionalMetaWithDBOViaHelpersProps<
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
  connectionHelperOptions: IConnectToSwarmOrbitDbWithChannelsConstructorOptions<
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
  >;
  swarmMessagesChannelsListDescription: ISwarmMessagesChannelsListDescription;
  userCredentialsList: Array<IUserCredentialsCommon>;
  dbo: DBO;
  userIdReceiverSwarmMessages: TSwarmMessageUserIdentifierSerialized;
  swarmChannelsListDatabaseOptions: TSwrmMessagesChannelsListDBOWithGrantAccess<
    TSwarmStoreConnectorDefault,
    T,
    MD,
    ISwarmStoreDBOGrandAccessCallbackBaseContext,
    TSwarmStoreDatabaseOptions<TSwarmStoreConnectorDefault, T, TSwarmMessagesChannelsListDbType>
  >;
  userCredentialsToConnectImmediate?: IUserCredentialsCommon;
}

export interface IConnectToSwarmAndCreateSwarmMessagesChannelsListWithAdditionalMetaWithDBOViaHelpersState<
  DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED,
  DBO extends TSwarmStoreDatabaseOptions<TSwarmStoreConnectorDefault, T, DbType>,
  CBO extends IConnectionBridgeOptionsDefault<
    TSwarmStoreConnectorDefault,
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
    any,
    any
  >,
  CD extends boolean = boolean,
  MD extends ISwarmMessageInstanceDecrypted = ISwarmMessageInstanceDecrypted,
  T extends TSwarmMessageSerialized = TSwarmMessageSerialized
> {
  channelsListIsReady: boolean;
  connectionToSwarmWithChannelsOrUndefined: IConnectionToSwarmWithChannels<DbType, T, DBO, CD, CBO, MD> | undefined;
  connectionToSwarmWithChannelsStatePartial: Partial<IConnectToSwarmOrbitDbWithChannelsState<DbType, T, DBO, CBO>>;
  openedSwarmChannelInstanceOrUndefined:
    | TSwarmMessagesChannelAnyByChannelDescriptionRaw<
        ISwarmMessageChannelDescriptionRaw<
          TSwarmStoreConnectorDefault,
          TSwarmMessageSerialized,
          ESwarmStoreConnectorOrbitDbDatabaseType,
          TSwarmStoreDatabaseOptions<
            TSwarmStoreConnectorDefault,
            TSwarmMessageSerialized,
            ESwarmStoreConnectorOrbitDbDatabaseType
          >
        >
      >
    | undefined;
}

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
export class ConnectToSwarmAndCreateSwarmMessagesChannelsListWithAdditionalMetaWithDBOViaHelpers<
  DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED,
  DBO extends TSwarmStoreDatabaseOptions<TSwarmStoreConnectorDefault, T, DbType>,
  CBO extends IConnectionBridgeOptionsDefault<
    TSwarmStoreConnectorDefault,
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
    any,
    any
  >,
  CD extends boolean = boolean,
  MD extends ISwarmMessageInstanceDecrypted = ISwarmMessageInstanceDecrypted,
  T extends TSwarmMessageSerialized = TSwarmMessageSerialized,
  SMSM extends ISwarmMessagesDatabaseMessagesCollector<
    TSwarmStoreConnectorDefault,
    DbType,
    MD
  > = ISwarmMessagesDatabaseMessagesCollectorWithStoreMeta<
    TSwarmStoreConnectorDefault,
    T,
    DBO,
    DbType,
    MD,
    ISwarmMessagesStoreMeta
  >,
  DCO extends ISwarmMessagesDatabaseCacheOptions<
    TSwarmStoreConnectorDefault,
    DbType,
    MD,
    SMSM
  > = ISwarmMessagesDatabaseCacheOptions<TSwarmStoreConnectorDefault, DbType, MD, SMSM>,
  DCCRT extends ISwarmMessagesDatabaseCache<TSwarmStoreConnectorDefault, T, DbType, DBO, MD, SMSM> = ISwarmMessagesDatabaseCache<
    TSwarmStoreConnectorDefault,
    T,
    DbType,
    DBO,
    MD,
    SMSM
  >,
  SMDCC extends ISwarmMessagesDatabaseCacheConstructor<
    TSwarmStoreConnectorDefault,
    T,
    DbType,
    DBO,
    MD,
    SMSM,
    DCO,
    DCCRT
  > = ISwarmMessagesDatabaseCacheConstructor<TSwarmStoreConnectorDefault, T, DbType, DBO, MD, SMSM, DCO, DCCRT>
> extends React.PureComponent<
  IConnectToSwarmAndCreateSwarmMessagesChannelsListWithAdditionalMetaWithDBOViaHelpersProps<
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
  >,
  IConnectToSwarmAndCreateSwarmMessagesChannelsListWithAdditionalMetaWithDBOViaHelpersState<DbType, DBO, CBO, CD, MD, T>
> {
  public state: IConnectToSwarmAndCreateSwarmMessagesChannelsListWithAdditionalMetaWithDBOViaHelpersState<
    DbType,
    DBO,
    CBO,
    CD,
    MD,
    T
  > = {
    channelsListIsReady: false,
    connectionToSwarmWithChannelsOrUndefined: undefined,
    connectionToSwarmWithChannelsStatePartial: {},
    openedSwarmChannelInstanceOrUndefined: undefined,
  };

  protected get _userIdOrUndefined(): TCentralAuthorityUserIdentity | undefined {
    return this.state.connectionToSwarmWithChannelsStatePartial.userId;
  }

  protected get _swarmMessagesChannelsListOrUndefined():
    | ISwarmMessagesChannelsDescriptionsList<TSwarmStoreConnectorDefault, T, MD>
    | undefined {
    return this.state.connectionToSwarmWithChannelsStatePartial
      .swarmMessagesChannelsList as ISwarmMessagesChannelsDescriptionsList<TSwarmStoreConnectorDefault, T, MD>;
  }

  public async componentDidMount() {
    const { userCredentialsToConnectImmediate } = this.props;

    const connectionToSwarmWithChannels = this._createAndReturnConnectionToSwarmWithChannelsInstance();
    if (userCredentialsToConnectImmediate) {
      const swarmMessagesChannelsList = await this._createAndReturnSwarmMessagesChannelsList(
        connectionToSwarmWithChannels,
        userCredentialsToConnectImmediate
      );
      this._setListenersChannelsListInstance(swarmMessagesChannelsList);
    }
  }

  public render(): React.ReactElement {
    const { openedSwarmChannelInstanceOrUndefined } = this.state;
    const swarmMessagesChannelsListOrUndefined = this._swarmMessagesChannelsListOrUndefined;
    if (openedSwarmChannelInstanceOrUndefined) {
      return this._renderSwarmMessagesChannel();
    }
    return (
      <div>
        {this._renderUserIdentity()}
        <hr />
        Swarm messages channels list
        <br />
        {swarmMessagesChannelsListOrUndefined ? (
          <SwarmMessagesChannelsListComponent
            currentUserId={this._getCurrentUserIdOrThrow()}
            channelsList={swarmMessagesChannelsListOrUndefined}
            onChoseSwarmChannel={this.__onChoseSwarmChannel}
          />
        ) : (
          'channels list instance is not exists'
        )}
      </div>
    );
  }

  public componentWillUnmount() {
    const { connectionToSwarmWithChannelsOrUndefined } = this.state;

    if (connectionToSwarmWithChannelsOrUndefined) {
      this._unsetListenersOnConnectionToSwarmWithChannels(connectionToSwarmWithChannelsOrUndefined);
    }
    this._unsetListenerSwarmChannelCurrentInstanceClosed();
  }

  protected _getCurrentUserIdOrThrow(): TCentralAuthorityUserIdentity {
    const currentUserId = this._userIdOrUndefined;
    if (!currentUserId) {
      throw new Error('An identity of the current user should be provided');
    }
    return currentUserId;
  }

  protected _renderUserIdentity(): React.ReactElement | null {
    const userIdOrUndefined = this._userIdOrUndefined;
    if (!userIdOrUndefined) {
      return null;
    }
    return <p>User id: {userIdOrUndefined}</p>;
  }

  protected _renderSwarmMessagesChannel(): React.ReactElement {
    const { openedSwarmChannelInstanceOrUndefined } = this.state;

    if (!openedSwarmChannelInstanceOrUndefined) {
      throw new Error('Swarm channel instance should be defined');
    }
    return <SwarmChannelInstanceComponent swarmMessagesChannelInstance={openedSwarmChannelInstanceOrUndefined} />;
  }

  protected _getConnectToSwarmOrbitDbWithChannelsConstructorOptions(): IConnectToSwarmOrbitDbWithChannelsConstructorOptions<
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
  > {
    const { connectionHelperOptions } = this.props;
    return connectionHelperOptions;
  }

  protected _createAndReturnConnectionToSwarmWithChannelsInstance(): ConnectionToSwarmWithChannels<
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
  > {
    const constructorOptions = this._getConnectToSwarmOrbitDbWithChannelsConstructorOptions();
    const connectionToSwarmWithChannels = new ConnectionToSwarmWithChannels(constructorOptions);

    this._setInStateConnectionToSwarmWithChannels(connectionToSwarmWithChannels);
    this._setListenersOnConnectionToSwarmWithChannels(connectionToSwarmWithChannels);
    return connectionToSwarmWithChannels;
  }

  protected _setInStateConnectionToSwarmWithChannels(
    connectionToSwarmWithChannels: ConnectionToSwarmWithChannels<DbType, T, DBO, CD, CBO, MD, SMSM, DCO, DCCRT, SMDCC>
  ): void {
    this.setState({
      connectionToSwarmWithChannelsOrUndefined: connectionToSwarmWithChannels,
      connectionToSwarmWithChannelsStatePartial: {
        ...connectionToSwarmWithChannels.state,
      },
    });
  }

  protected _getChannelsListDescription(): ISwarmMessagesChannelsListDescription {
    return this.props.swarmMessagesChannelsListDescription;
  }

  protected _getSwarmChannelsListDatabaseOptions(): TSwrmMessagesChannelsListDBOWithGrantAccess<
    TSwarmStoreConnectorDefault,
    T,
    MD,
    ISwarmStoreDBOGrandAccessCallbackBaseContext,
    TSwarmStoreDatabaseOptions<TSwarmStoreConnectorDefault, T, TSwarmMessagesChannelsListDbType>
  > {
    return this.props.swarmChannelsListDatabaseOptions;
  }

  protected async _createAndReturnSwarmMessagesChannelsList(
    connectionToSwarmWithChannels: IConnectionToSwarmWithChannels<DbType, T, DBO, CD, CBO, MD>,
    userCredentialsToConnectImmediate?: IUserCredentialsCommon
  ): Promise<ISwarmMessagesChannelsDescriptionsList<TSwarmStoreConnectorDefault, T, MD>> {
    await connectionToSwarmWithChannels.connectToSwarm(userCredentialsToConnectImmediate);
    const channelsListDescription = this._getChannelsListDescription();
    const swarmChannelsListDatabaseOptions = this._getSwarmChannelsListDatabaseOptions();
    await connectionToSwarmWithChannels.connectToSwarmChannelsList(
      channelsListDescription,
      swarmChannelsListDatabaseOptions,
      userCredentialsToConnectImmediate
    );
    const swarmMessagesChannelsList = connectionToSwarmWithChannels.state.swarmMessagesChannelsList;
    if (!swarmMessagesChannelsList) {
      throw new Error('Channels list has not been created and started for unknown reason');
    }
    return swarmMessagesChannelsList as ISwarmMessagesChannelsDescriptionsList<TSwarmStoreConnectorDefault, T, MD>;
  }

  protected async addChannelDescriptionToChannelsList(
    channelsListInstance: ISwarmMessagesChannelsDescriptionsList<TSwarmStoreConnectorDefault, T, MD>,
    swarmMessageChannelDescription: ISwarmMessageChannelDescriptionRaw<
      TSwarmStoreConnectorDefault,
      TSwarmMessageSerialized,
      TSwarmStoreDatabaseType<TSwarmStoreConnectorDefault>,
      TSwarmStoreDatabaseOptions<
        TSwarmStoreConnectorDefault,
        TSwarmMessageSerialized,
        TSwarmStoreDatabaseType<TSwarmStoreConnectorDefault>
      >
    >
  ): Promise<void> {
    await channelsListInstance.upsertChannel(swarmMessageChannelDescription);
  }

  protected _setListenersChannelsListInstance(
    channelsListInstance: ISwarmMessagesChannelsDescriptionsList<TSwarmStoreConnectorDefault, T, MD>
  ): void {
    const channelsListEventsEmitter = channelsListInstance.emitter;
    channelsListEventsEmitter.addListener(
      ESwarmMessagesChannelsListEventName.CHANNELS_LIST_CLOSED,
      this.__handleChannelsListIsClosed
    );
  }

  private __handleConnectionToSwarmWithChannelsStateUpdate = (
    connectionToSwarmWithChannelsStateUpdated: Partial<IConnectToSwarmOrbitDbWithChannelsState<DbType, T, DBO, CBO>>
  ): void => {
    this.setState({
      connectionToSwarmWithChannelsStatePartial: {
        ...connectionToSwarmWithChannelsStateUpdated,
      },
      channelsListIsReady: Boolean(this._swarmMessagesChannelsListOrUndefined),
    });
  };

  protected _setListenersOnConnectionToSwarmWithChannels(
    connectionToSwarmWithChannels: IConnectionToSwarmWithChannels<DbType, T, DBO, CD, CBO, MD>
  ): void {
    connectionToSwarmWithChannels.addStateChangeListener(this.__handleConnectionToSwarmWithChannelsStateUpdate);
  }

  protected _unsetListenersOnConnectionToSwarmWithChannels(
    connectionToSwarmWithChannels: IConnectionToSwarmWithChannels<DbType, T, DBO, CD, CBO, MD>
  ): void {
    connectionToSwarmWithChannels.removeStateChangeListener(this.__handleConnectionToSwarmWithChannelsStateUpdate);
  }

  private __handleChannelsListIsClosed = () => {
    this.setState({
      channelsListIsReady: false,
    });
  };

  protected _getConnectionToSwarmWithChannelsOrThrow(): IConnectionToSwarmWithChannels<DbType, T, DBO, CD, CBO, MD> {
    const { connectionToSwarmWithChannelsOrUndefined } = this.state;
    if (!connectionToSwarmWithChannelsOrUndefined) {
      throw new Error('There is no active connection to the swarm');
    }
    return connectionToSwarmWithChannelsOrUndefined;
  }

  protected async _createSwarmChannelInstanceByDescription(
    swarmChannelDescription: ISwarmMessageChannelDescriptionRaw<
      TSwarmStoreConnectorDefault,
      TSwarmMessageSerialized,
      ESwarmStoreConnectorOrbitDbDatabaseType,
      TSwarmStoreDatabaseOptions<TSwarmStoreConnectorDefault, TSwarmMessageSerialized, ESwarmStoreConnectorOrbitDbDatabaseType>
    >
  ): Promise<void> {
    const connectionToSwarmWithChannels = this._getConnectionToSwarmWithChannelsOrThrow();
    const swarmChannelInstance = await connectionToSwarmWithChannels.connectToSwarmChannel(swarmChannelDescription);
    this._handleSwarmChannelInstance(swarmChannelInstance);
  }

  private __onChoseSwarmChannel = async (
    swarmChannelDescription: ISwarmMessageChannelDescriptionRaw<
      TSwarmStoreConnectorDefault,
      TSwarmMessageSerialized,
      ESwarmStoreConnectorOrbitDbDatabaseType,
      TSwarmStoreDatabaseOptions<TSwarmStoreConnectorDefault, TSwarmMessageSerialized, ESwarmStoreConnectorOrbitDbDatabaseType>
    >
  ): Promise<void> => {
    await this._createSwarmChannelInstanceByDescription(swarmChannelDescription);
  };

  private __handleChannelClosed = () => {
    this.setState({
      openedSwarmChannelInstanceOrUndefined: undefined,
    });
  };

  private _handleSwarmChannelInstance(
    swarmChannelInstance: TSwarmMessagesChannelAnyByChannelDescriptionRaw<
      ISwarmMessageChannelDescriptionRaw<
        TSwarmStoreConnectorDefault,
        TSwarmMessageSerialized,
        ESwarmStoreConnectorOrbitDbDatabaseType,
        TSwarmStoreDatabaseOptions<TSwarmStoreConnectorDefault, TSwarmMessageSerialized, ESwarmStoreConnectorOrbitDbDatabaseType>
      >
    >
  ): void {
    this.setState({
      openedSwarmChannelInstanceOrUndefined: swarmChannelInstance,
    });
    swarmChannelInstance.emitterChannelState.once(ESwarmMessagesChannelEventName.CHANNEL_CLOSED, this.__handleChannelClosed);
  }

  private _unsetListenerSwarmChannelCurrentInstanceClosed() {
    this.state.openedSwarmChannelInstanceOrUndefined?.emitterChannelState.removeListener(
      ESwarmMessagesChannelEventName.CHANNEL_CLOSED,
      this.__handleChannelClosed
    );
  }
}
