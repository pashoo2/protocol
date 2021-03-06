import {
  IConnectionBridgeOptionsDefault,
  TConnectionBridgeOptionsAuthCredentialsWithAuthProvider,
} from 'classes/connection-bridge/types/connection-bridge.types';
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
import {
  ISwarmMessagesChannelsListDescription,
  TSwarmMessagesChannelsListDbType,
  TSwarmMessagesChannelsListDBOWithGrantAccess,
} from 'classes/swarm-messages-channels/types/swarm-messages-channels-list-instance.types';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connectors.types';
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
import { ICentralAuthorityUserProfile, TCentralAuthorityUserIdentity } from 'classes/central-authority-class';
import { TSwarmChannelsListId } from './connect-to-swarm-orbitdb-with-channels-state.types';
import { TCAAuthProviderIdentity } from 'classes/central-authority-class/central-authority-connections';

export interface IConnectionToSwarmWithChannels<
  DbType extends TSwarmStoreDatabaseType<TSwarmStoreConnectorDefault>,
  T extends TSwarmMessageSerialized,
  DBO extends TSwarmStoreDatabaseOptions<TSwarmStoreConnectorDefault, T, DbType>,
  CD extends boolean,
  CBO extends IConnectionBridgeOptionsDefault<TSwarmStoreConnectorDefault, T, DbType, CD>,
  MD extends ISwarmMessageInstanceDecrypted
> {
  /**
   * If the instance is connected to the swarm.
   *
   * @type {boolean}
   * @memberof IConnectionToSwarmWithChannels
   */
  readonly isConnectedToSwarm: boolean;
  /**
   * Current connection state
   *
   * @type {Readonly<IConnectToSwarmOrbitDbWithChannelsState<DbType, T, DBO, CBO>>}
   * @memberof IConnectionToSwarmWithChannels
   */
  readonly state: Readonly<Partial<IConnectToSwarmOrbitDbWithChannelsState<DbType, T, DBO, CBO>>>;

  /**
   * This list contains identities of authorization providers
   * supported and available to authorize through.
   *
   * @type {TCAAuthProviderIdentity[]}
   * @memberof IConnectionBridge
   */
  readonly authProvidersIdentitiesList: TCAAuthProviderIdentity[];

  /**
   * Create an active connection to the swarm
   *
   * @param {TConnectionBridgeOptionsAuthCredentialsWithAuthProvider} [userCredentials] - ??? credentials are not necessary only if there is a session exists for the user
   * @returns {Promise<void>}
   * @memberof IConnectionToSwarmWithChannels
   */
  connectToSwarm(
    userCredentials?: TConnectionBridgeOptionsAuthCredentialsWithAuthProvider,
    userProfile?: Partial<ICentralAuthorityUserProfile>
  ): Promise<void>;
  /**
   * Update user's profile in central authority.
   *
   * @param {Partial<ICentralAuthorityUserProfile>} userProfile
   * @returns {Promise<void>}
   * @memberof IConnectionToSwarmWithChannels
   */
  updateUserCentralAuthorityProfile(userProfile: Partial<ICentralAuthorityUserProfile>): Promise<void>;
  /**
   * Connect to an instance that allows to share information about messaging channels
   * available within this channels list.
   * It allows to add new channels to the list, listen for any updates of the existing
   * ones and listen for new ones, which have been added by other users.
   * Create connection to the swarm at first, if there is no connection so far.
   *
   * @param {ISwarmMessagesChannelsListDescription} channelsListDescription
   * @param {TSwarmMessagesChannelsListDBOWithGrantAccess<
   *             TSwarmStoreConnectorDefault,
   *             T,
   *             MD,
   *             ISwarmStoreDBOGrandAccessCallbackBaseContext,
   *             TSwarmStoreDatabaseOptions<TSwarmStoreConnectorDefault, T, TSwarmMessagesChannelsListDbType>
   *         >} channelsListDatabaseOptions
   * @returns {Promise<void>}
   * @memberof IConnectionToSwarmWithChannels
   */
  connectToSwarmChannelsList(
    channelsListDescription: ISwarmMessagesChannelsListDescription,
    channelsListDatabaseOptions: TSwarmMessagesChannelsListDBOWithGrantAccess<
      TSwarmStoreConnectorDefault,
      T,
      MD,
      ISwarmStoreDBOGrandAccessCallbackBaseContext,
      TSwarmStoreDatabaseOptions<TSwarmStoreConnectorDefault, T, TSwarmMessagesChannelsListDbType>
    >
  ): Promise<void>;
  /**
   * Create a swarm channel instance which allows messaging with other
   * users connected to the swarm channel.
   * Created swarm channel will be added to an instance of swarm channels list
   *
   * @param {ISwarmMessageChannelDescriptionRaw<
   *       TSwarmStoreConnectorDefault,
   *       TSwarmMessageSerialized,
   *       ESwarmStoreConnectorOrbitDbDatabaseType,
   *       TSwarmStoreDatabaseOptions<TSwarmStoreConnectorDefault, TSwarmMessageSerialized, ESwarmStoreConnectorOrbitDbDatabaseType>
   *     >} swarmMessageChannelDescriptionRaw
   * @param {TSwarmChannelsListId} swarmChannelsListId
   * @returns {Promise<TSwarmMessagesChannelAnyByChannelDescriptionRaw<typeof swarmMessageChannelDescriptionRaw>>}
   * @memberof IConnectionToSwarmWithChannels
   */
  connectToSwarmChannel(
    swarmMessageChannelDescriptionRaw: ISwarmMessageChannelDescriptionRaw<
      TSwarmStoreConnectorDefault,
      TSwarmMessageSerialized,
      ESwarmStoreConnectorOrbitDbDatabaseType,
      TSwarmStoreDatabaseOptions<TSwarmStoreConnectorDefault, TSwarmMessageSerialized, ESwarmStoreConnectorOrbitDbDatabaseType>
    >,
    swarmChannelsListId: TSwarmChannelsListId
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
  /**
   * Encrypt a string using a public crypto key of
   * the user specified through userId
   *
   * @param {string} value
   * @param {TCentralAuthorityUserIdentity} userId
   * @returns {Promise<string>}
   * @memberof IConnectionInitializer
   */
  encryptString(value: string, userId: TCentralAuthorityUserIdentity): Promise<string>;
  /**
   * Encrypt a string using the current user's public crypto key
   * The data then key be decrypted by the user's private
   * crypto key
   *
   * @param {string} value
   * @returns {Promise<string>}
   * @memberof IConnectionInitializer
   */
  encryptString(value: string): Promise<string>;
  /**
   * Decrypt a string encrypted using the current user's public crypto key
   *
   * @param {string} value
   * @returns {Promise<string>}
   * @memberof IConnectionInitializer
   */
  decryptString(value: string): Promise<string>;
  /**
   * Sign the string by a crypto key of the current user
   * and return a signature.
   *
   * @param {string} value
   * @returns {Promise<string>}
   * @memberof IConnectionToSwarmWithChannels
   */
  signString(value: string): Promise<string>;
  /**
   * Verify the signature for a data signed by a swarm
   * user's crypto key
   *
   * @param {string} value
   * @param {string} signature
   * @param {TCentralAuthorityUserIdentity} userId
   * @returns {Promise<string>}
   * @memberof IConnectionToSwarmWithChannels
   */
  verifySignature(value: string, signature: string, userId: TCentralAuthorityUserIdentity): Promise<boolean>;
  /**
   * Verify the signature for a data signed by the current user's
   * crypto key
   *
   * @param {string} value
   * @returns {Promise<string>}
   * @memberof IConnectionToSwarmWithChannels
   */
  verifySignature(value: string, signature: string): Promise<boolean>;
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
> = IConnectionToSwarmWithChannels<TSwarmStoreDatabaseType<TSwarmStoreConnectorDefault>, T, DBO, CD, CBO, MD> & {
  readonly state: Readonly<
    Partial<IConnectToSwarmOrbitDbWithChannelsState<TSwarmStoreDatabaseType<TSwarmStoreConnectorDefault>, T, DBO, CBO>>
  >;
};
