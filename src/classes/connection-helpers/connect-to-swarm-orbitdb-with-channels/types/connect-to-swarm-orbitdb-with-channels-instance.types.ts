import { IConnectionBridgeOptionsDefault } from 'classes/connection-bridge/types/connection-bridge.types';
import { IConnectToSwarmOrbitDbWithChannelsState } from 'classes/connection-helpers/connect-to-swarm-orbitdb-with-channels/types/connect-to-swarm-orbitdb-with-channels-state.types';
import { ISwarmMessageInstanceDecrypted, TSwarmMessageSerialized } from 'classes/swarm-message';
import {
  ISwarmMessagesDatabaseCache,
  ISwarmMessagesDatabaseCacheConstructor,
  ISwarmMessagesDatabaseCacheOptions,
  ISwarmMessagesDatabaseMessagesCollector,
} from 'classes/swarm-messages-database';
import {
  ESwarmStoreConnectorOrbitDbDatabaseType,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseType,
} from 'classes/swarm-store-class';
import { IUserCredentialsCommon } from 'types/credentials.types';
import {
  ISwarmMessagesChannelsListDescription,
  TSwarmMessagesChannelsListDbType,
  TSwrmMessagesChannelsListDBOWithGrantAccess,
} from 'classes/swarm-messages-channels/types/swarm-messages-channels-list-instance.types';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import {
  ISwarmMessageChannelDescriptionRaw,
  TSwarmMessagesChannelAnyByChannelDescriptionRaw,
} from 'classes/swarm-messages-channels';
import {
  IConnectToSwarmOrbitDbWithChannelsConstructorOptions,
  TSwarmStoreConnectorDefault,
} from './connect-to-swarm-orbitdb-with-channels-constructor.types';
import { IConnectToSwarmOrbitDbWithChannelsStateListener } from 'classes/connection-helpers/connect-to-swarm-orbitdb-with-channels/types/connect-to-swarm-orbitdb-with-channels-change-listeners.types';
import { IConnectToSwarmOrbitDbWithChannelsDatabaseSwarmMessagesListUpdateListener } from './connect-to-swarm-orbitdb-with-channels-change-listeners.types';
import { TConnectionBridgeOptionsDatabaseOptions } from 'classes/connection-bridge';
import { TConnectionBridgeOptionsDbType } from '../../../connection-bridge/types/connection-bridge.types-helpers/connection-bridge-options.types-helpers';

export interface IConnectionToSwarmWithChannels<
  DbType extends TSwarmStoreDatabaseType<TSwarmStoreConnectorDefault>,
  T extends TSwarmMessageSerialized,
  DBO extends TSwarmStoreDatabaseOptions<TSwarmStoreConnectorDefault, T, DbType>,
  CD extends boolean,
  CBO extends IConnectionBridgeOptionsDefault<TSwarmStoreConnectorDefault, T, DbType, CD>,
  MD extends ISwarmMessageInstanceDecrypted
> {
  /**
   * Current connection state
   *
   * @type {Readonly<IConnectToSwarmOrbitDbWithChannelsState<DbType, T, DBO, CBO>>}
   * @memberof IConnectionToSwarmWithChannels
   */
  readonly state: Readonly<Partial<IConnectToSwarmOrbitDbWithChannelsState<DbType, T, DBO, CBO>>>;

  /**
   * Create an active connection to the swarm
   *
   * @param {IUserCredentialsCommon} [userCredentials] - ??? credentials are not necessary only if there is a session exists for the user
   * @returns {Promise<void>}
   * @memberof IConnectionToSwarmWithChannels
   */
  connectToSwarm(userCredentials?: IUserCredentialsCommon): Promise<void>;

  /**
   * Connect to an instance that allows to share information about messaging channels
   * available within this channels list.
   * It allows to add new channels to the list, listen for any updates of the existing
   * ones and listen for new ones, which have been added by other users.
   * Create connection to the swarm at first, if there is no connection so far.
   *
   * @param {ISwarmMessagesChannelsListDescription} channelsListDescription
   * @param {TSwrmMessagesChannelsListDBOWithGrantAccess<
   *             TSwarmStoreConnectorDefault,
   *             T,
   *             MD,
   *             ISwarmStoreDBOGrandAccessCallbackBaseContext,
   *             TSwarmStoreDatabaseOptions<TSwarmStoreConnectorDefault, T, TSwarmMessagesChannelsListDbType>
   *         >} channelsListDatabaseOptions
   * @param {IUserCredentialsCommon} [userCredentials]
   * @returns {Promise<void>}
   * @memberof IConnectionToSwarmWithChannels
   */
  connectToSwarmChannelsList(
    channelsListDescription: ISwarmMessagesChannelsListDescription,
    channelsListDatabaseOptions: TSwrmMessagesChannelsListDBOWithGrantAccess<
      TSwarmStoreConnectorDefault,
      T,
      MD,
      ISwarmStoreDBOGrandAccessCallbackBaseContext,
      TSwarmStoreDatabaseOptions<TSwarmStoreConnectorDefault, T, TSwarmMessagesChannelsListDbType>
    >,
    userCredentials?: IUserCredentialsCommon
  ): Promise<void>;

  /**
   * Create a swarm channel instance which allows messaging with other
   * users connected to the swarm channel.
   * Created swarm channel will be added to an instance of swarm channels list
   *
   * @param {ISwarmMessageChannelDescriptionRaw<
   *             TSwarmStoreConnectorDefault,
   *             TSwarmMessageSerialized,
   *             ESwarmStoreConnectorOrbitDbDatabaseType,
   *             TSwarmStoreDatabaseOptions<
   *                 TSwarmStoreConnectorDefault,
   *                 TSwarmMessageSerialized,
   *                 ESwarmStoreConnectorOrbitDbDatabaseType,
   *             >
   *         >} swarmMessageChannelDescriptionRaw
   * @returns {Promise<TSwarmMessagesChannelAnyByChannelDescriptionRaw<typeof swarmMessageChannelDescriptionRaw>>}
   * @memberof IConnectionToSwarmWithChannels
   */
  connectToSwarmChannel(
    swarmMessageChannelDescriptionRaw: ISwarmMessageChannelDescriptionRaw<
      TSwarmStoreConnectorDefault,
      TSwarmMessageSerialized,
      ESwarmStoreConnectorOrbitDbDatabaseType,
      TSwarmStoreDatabaseOptions<TSwarmStoreConnectorDefault, TSwarmMessageSerialized, ESwarmStoreConnectorOrbitDbDatabaseType>
    >
  ): Promise<TSwarmMessagesChannelAnyByChannelDescriptionRaw<typeof swarmMessageChannelDescriptionRaw>>;

  /**
   * Add a listener for listening changes of the instance's state changes
   *
   * @param {IConnectToSwarmOrbitDbWithChannelsStateListener<DbType, T, DBO, CBO>} listener
   * @memberof IConnectionToSwarmWithChannels
   */
  addStateChangeListener(listener: IConnectToSwarmOrbitDbWithChannelsStateListener<DbType, T, DBO, CBO>): void;

  /**
   * Remove state change listener.
   *
   * @param {IConnectToSwarmOrbitDbWithChannelsStateListener<DbType, T, DBO, CBO>} listener
   * @memberof IConnectionToSwarmWithChannels
   */
  removeStateChangeListener(listener: IConnectToSwarmOrbitDbWithChannelsStateListener<DbType, T, DBO, CBO>): void;

  /**
   * Listen for messages which have been read from the database.
   * It might be messages which were added to the channels before as well as a new ones.
   *
   * @param {IConnectToSwarmOrbitDbWithChannelsDatabaseSwarmMessagesListUpdateListener<DbType>} listener
   * @memberof IConnectionToSwarmWithChannels
   */
  addDatabaseSwarmMessagesListUpdateListener(
    listener: IConnectToSwarmOrbitDbWithChannelsDatabaseSwarmMessagesListUpdateListener<DbType>
  ): void;

  /**
   * Remove listener of messages updates.
   *
   * @param {IConnectToSwarmOrbitDbWithChannelsDatabaseSwarmMessagesListUpdateListener<DbType>} listener
   * @memberof IConnectionToSwarmWithChannels
   */
  removeDatabaseSwarmMessagesListUpdateListener(
    listener: IConnectToSwarmOrbitDbWithChannelsDatabaseSwarmMessagesListUpdateListener<DbType>
  ): void;
}

export interface IConnectionToSwarmWithChannelsConstructor<
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
  new (
    configuration: IConnectToSwarmOrbitDbWithChannelsConstructorOptions<DbType, T, DBO, CD, CBO, MD, SMSM, DCO, DCCRT, SMDCC>
  ): IConnectionToSwarmWithChannels<DbType, T, DBO, CD, CBO, MD>;
}

export type TConnectionToSwarmWithChannelsByConnectionBridgeOptions<
  CBO extends IConnectionBridgeOptionsDefault<
    TSwarmStoreConnectorDefault,
    T,
    TSwarmStoreDatabaseType<TSwarmStoreConnectorDefault>,
    boolean
  >,
  DBO extends TConnectionBridgeOptionsDatabaseOptions<CBO> & {
    dbType: TConnectionBridgeOptionsDbType<CBO>;
  } = TConnectionBridgeOptionsDatabaseOptions<CBO> & {
    dbType: TConnectionBridgeOptionsDbType<CBO>;
  },
  T extends TSwarmMessageSerialized = TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted = ISwarmMessageInstanceDecrypted,
  CD extends boolean = boolean
> = IConnectionToSwarmWithChannels<TSwarmStoreDatabaseType<TSwarmStoreConnectorDefault>, T, DBO, CD, CBO, MD>;
