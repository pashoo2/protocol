// @ts-nocheck
import {
  ISwarmMessageStoreOptions,
  ISwarmMessageStore,
} from '../swarm-message-store/swarm-message-store.types';
import { ESwarmStoreConnector } from '../swarm-store-class/swarm-store-class.const';
import { ICentralAuthority } from '../central-authority-class/central-authority-class.types';
import { ICentralAuthorityOptions } from '../central-authority-class/central-authority-class.types';
import {
  ISwarmMessageConstructor,
  TSwarmMessageSerialized,
} from '../swarm-message/swarm-message-constructor.types';
import { ISensitiveDataSessionStorageOptions } from 'classes/sensitive-data-session-storage/sensitive-data-session-storage.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../swarm-messgae-encrypted-cache/swarm-messgae-encrypted-cache.types';
import { ISwarmMessageEncryptedCacheFabric } from '../swarm-messgae-encrypted-cache/swarm-messgae-encrypted-cache.types';
import {
  TSwarmStoreDatabaseType,
  ISwarmStoreConnectorBasicWithEntriesCount,
} from '../swarm-store-class/swarm-store-class.types';
import { ISwarmStoreConnectorOrbitDbConnecectionBasicFabric } from '../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db.types';
import {
  ISwarmStoreConnector,
  ISwarmStoreOptionsWithConnectorFabric,
} from '../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageStoreOptionsWithConnectorFabric } from '../swarm-message-store/swarm-message-store.types';
import {
  TSwarmStoreValueTypes,
  ISwarmStoreConnectorBasic,
} from '../swarm-store-class/swarm-store-class.types';

export type TConnectionBridgeSwarmStoreConnectorBasic<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>
> = ISwarmStoreConnectorBasicWithEntriesCount<P, T, DbType>;

export type IConnectionBridgeOptionsAuthCredentials = Omit<
  ICentralAuthorityOptions['user']['credentials'],
  'session'
>;

export interface IConnectionBridgeOptionsAuth<CD extends boolean = false> {
  /**
   * url of an  auth provider from the auth providers pool
   * on which the user will be authorized or registered
   * if still had not.
   *
   * @type {ICentralAuthorityOptions['user']['authProviderUrl']}
   */
  providerUrl: ICentralAuthorityOptions['user']['authProviderUrl'];
  /**
   * credentials used to authorize or register on a credentials
   * provider. If credentials are not provided, then session
   * must be started before
   *
   * @type {ICentralAuthorityOptions['user']['credentials']}
   */
  credentials: CD extends true
    ? IConnectionBridgeOptionsAuthCredentials
    : IConnectionBridgeOptionsAuthCredentials | undefined | never;
  session?: ISensitiveDataSessionStorageOptions;
  /**
   * this is list of auth providers will be used to authorize
   * the user and a keys of another users connected to the
   * swarm
   *
   * @type {ICentralAuthorityOptions['authProvidersPool']}
   */
  authProvidersPool?: ICentralAuthorityOptions['authProvidersPool'];
}

export interface IConnectionBridgeSwarmConnection<T> {
  getNativeConnection(): T;
}

export interface IConnectionBridgeStorageOptions<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  ConnectorBasic extends TConnectionBridgeSwarmStoreConnectorBasic<
    P,
    T,
    DbType
  > = TConnectionBridgeSwarmStoreConnectorBasic<P, T, DbType>
>
  extends Omit<
    ISwarmMessageStoreOptions<P, T, DbType, ConnectorBasic>,
    | 'userId'
    | 'credentials'
    | 'messageConstructors'
    | 'providerConnectionOptions'
    | 'databasesListStorage'
  > {
  connectorBasicFabric?: ISwarmStoreConnectorOrbitDbConnecectionBasicFabric<
    T,
    DbType,
    ISwarmStoreConnectorBasicWithEntriesCount<
      ESwarmStoreConnector.OrbitDB,
      T,
      DbType
    >
  >;
}

export interface IConnectionBridgeOptions<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  ConnectorBasic extends TConnectionBridgeSwarmStoreConnectorBasic<
    P,
    T,
    DbType
  > = TConnectionBridgeSwarmStoreConnectorBasic<P, T, DbType>,
  CD extends boolean = false
> {
  auth: IConnectionBridgeOptionsAuth<CD>;
  user: {
    /**
     * profile of the user for the central auth provider
     *
     * @type {ICentralAuthorityOptions['user']['profile']}
     */
    profile?: ICentralAuthorityOptions['user']['profile'];
  };
  /**
   * this is options for a swarm databases user will be
   * used to store a data.
   *
   * @type {ISwarmMessageStoreOptions<P>}
   * @memberof IConnectionBridgeOptions
   */
  storage: IConnectionBridgeStorageOptions<P, T, DbType, ConnectorBasic>;
  /**
   * specify options for the swarm connection provider
   *
   * @memberof IConnectionBridgeOptions
   */
  // TODO - at now the default IPFS connection will be used
  swarm?: any;
}

export interface IConnectionBridge<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType>,
  PO extends TSwarmStoreConnectorConnectionOptions<
    P,
    ItemType,
    DbType,
    ConnectorBasic
  >,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType>,
  CO extends ISwarmStoreProviderOptions<
    P,
    ItemType,
    DbType,
    ConnectorBasic,
    PO
  >,
  CFO extends ISwarmStoreOptionsConnectorFabric<
    P,
    ItemType,
    DbType,
    ConnectorBasic,
    PO,
    CO,
    DBO,
    ConnectorMain
  >,
  ConnectorMain extends ISwarmStoreConnector<
    P,
    ItemType,
    DbType,
    ConnectorBasic,
    PO,
    DBO
  >,
  O extends ISwarmStoreOptionsWithConnectorFabric<
    P,
    ItemType,
    DbType,
    ConnectorBasic,
    PO,
    CO,
    DBO,
    ConnectorMain,
    CFO
  >
> {
  /**
   * used to authorize the user or get
   * a common information about the users
   * also connected to the swarm.
   *
   * @type {ICentralAuthority}
   * @memberof IConnectionBridge
   */
  caConnection?: ICentralAuthority;
  /**
   * storage allows to add or read messages from
   * the swarm
   *
   * @type {ISwarmMessageStore<P>}
   * @memberof IConnectionBridge
   */
  storage?: ISwarmMessageStore<P, T, DbType, ConnectorBasic, ConnectorMain, O>;
  /**
   * allows to create messages, which can be stored in the swarm
   *
   * @type {ISwarmMessageConstructor}
   * @memberof IConnectionBridge
   */
  messageConstructor?: ISwarmMessageConstructor;

  /**
   * Fabric which provides instances of SwarmMessageEncryptedCache,
   * already connected to the storage and ready to use.
   *
   * @type {ISwarmMessageEncryptedCacheFabric}
   * @memberof IConnectionBridge
   */
  swarmMessageEncryptedCacheFabric?: ISwarmMessageEncryptedCacheFabric;

  /**
   * allows to construct SwarmMessagesConstructor with support of
   * encrypted cache storage and ready to use.
   *
   * @type {ISwarmMessageConstructorWithEncryptedCacheFabric}
   * @memberof IConnectionBridge
   */
  swarmMessageConstructorFabric?: ISwarmMessageConstructorWithEncryptedCacheFabric;

  /**
   * Connect to central authority and swarm. If the connection
   * will be succeed than the caConnection and storage
   * properties will be available.
   * If email or any other operations are necessary then
   * the promise returned will be resolved with Error
   * have a message with the problem description.
   *
   * @param {IConnectionBridgeOptions<P>} options
   * @returns {(Promise<Error | void>)}
   * @memberof IConnectionBridge
   */
  connect(
    options: IConnectionBridgeOptions<P, T, DbType>
  ): Promise<Error | void>;

  /**
   * checks was a session started before and
   * if it's data is available for now.
   * If a session is availablr, the user
   * can try to connect without credentials.
   *
   * @param {(ISensitiveDataSessionStorageOptions | IConnectionBridgeOptions<P>)} [options]
   * @returns {Promise<boolean>}
   * @memberof IConnectionBridge
   */
  checkSessionAvailable(
    options?:
      | ISensitiveDataSessionStorageOptions
      | IConnectionBridgeOptions<P, T, DbType>
  ): Promise<boolean>;
  /**
   * Close all connections and release the options.
   * The connection can't be used anymore.
   *
   * @returns {(Promise<Error | void>)}
   * @memberof IConnectionBridge
   */
  close(): Promise<Error | void>;
}
