import {
  ISwarmMessageStoreOptions,
  ISwarmMessageStore,
} from '../swarm-message-store/swarm-message-store.types';
import { ESwarmStoreConnector } from '../swarm-store-class/swarm-store-class.const';
import { ICentralAuthority } from '../central-authority-class/central-authority-class.types';
import { ICentralAuthorityOptions } from '../central-authority-class/central-authority-class.types';
import { ISwarmMessageConstructor } from '../swarm-message/swarm-message-constructor.types';
import { ISensitiveDataSessionStorageOptions } from 'classes/sensitive-data-session-storage/sensitive-data-session-storage.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../swarm-messgae-encrypted-cache/swarm-messgae-encrypted-cache.types';
import { ISwarmMessageEncryptedCacheFabric } from '../swarm-messgae-encrypted-cache/swarm-messgae-encrypted-cache.types';
import { TSwarmStoreDatabaseType } from '../swarm-store-class/swarm-store-class.types';

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

export interface IConnectionBridgeOptions<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>,
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
  storage: Omit<
    ISwarmMessageStoreOptions<P, DbType>,
    | 'userId'
    | 'credentials'
    | 'messageConstructors'
    | 'providerConnectionOptions'
    | 'databasesListStorage'
  >;
  /**
   * specify options for the swarm connection provider
   *
   * @memberof IConnectionBridgeOptions
   */
  // TODO - at now the default IPFS connection will be used
  swarm?: any;
}

export interface IConnectionBridge<
  P extends ESwarmStoreConnector = ESwarmStoreConnector.OrbitDB,
  DbType extends TSwarmStoreDatabaseType<P> = TSwarmStoreDatabaseType<P>
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
  storage?: ISwarmMessageStore<P, DbType>;
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
  connect(options: IConnectionBridgeOptions<P, DbType>): Promise<Error | void>;

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
      | IConnectionBridgeOptions<P, DbType>
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
