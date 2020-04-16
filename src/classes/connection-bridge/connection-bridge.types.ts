import {
  ISwarmMessageStoreOptions,
  ISwarmMessageStore,
} from '../swarm-message-store/swarm-message-store.types';
import { ESwarmStoreConnector } from '../swarm-store-class/swarm-store-class.const';
import { ICentralAuthority } from '../central-authority-class/central-authority-class.types';
import { ISwarmConnectionOptions } from '../swarm-connection-class/swarm-connection-class.types';
import { ICentralAuthorityOptions } from '../central-authority-class/central-authority-class.types';
import { ISwarmMessageConstructor } from '../swarm-message/swarm-message-constructor.types';
import { ISensitiveDataSessionStorageOptions } from 'classes/sensitive-data-session-storage/sensitive-data-session-storage.types';
import { ISwarmMessgaeEncryptedCache } from '../swarm-messgae-encrypted-cache/swarm-messgae-encrypted-cache.types';

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

export interface IConnectionBridgeOptions<
  P extends ESwarmStoreConnector = ESwarmStoreConnector.OrbitDB,
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
    Omit<
      Omit<Omit<ISwarmMessageStoreOptions<P>, 'userId'>, 'credentials'>,
      'messageConstructors'
    >,
    'providerConnectionOptions'
  >;
  /**
   * specify options for the swarm connection provider
   *
   * @type {(Omit<ISwarmConnectionOptions, 'subclassOptions'> & {
   *     subclassOptions: Omit<
   *       ISwarmConnectionOptions['subclassOptions'],
   *       'password'
   *     >;
   *   })}
   * @memberof IConnectionBridgeOptions
   */
  // TODO - at now the default IPFS connection will be used
  swarm?: Omit<ISwarmConnectionOptions, 'subclassOptions'> & {
    // TODO - do not set a password, otherwise the session persistence is not guaranteed
    subclassOptions: Omit<
      ISwarmConnectionOptions['subclassOptions'],
      'password'
    >;
  };
}

export interface IConnectionBridge<
  P extends ESwarmStoreConnector = ESwarmStoreConnector.OrbitDB
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
  storage?: ISwarmMessageStore<P>;
  /**
   * allows to create messages, which can be stored in the swarm
   *
   * @type {ISwarmMessageConstructor}
   * @memberof IConnectionBridge
   */
  messageConstructor?: ISwarmMessageConstructor;

  /**
   * used to store decrypted bodies of a private
   * messages sent to another users.
   *
   * @type {ISwarmMessgaeEncryptedCache}
   * @memberof IConnectionBridge
   */
  swarmMessageEncryptedCache?: ISwarmMessgaeEncryptedCache;
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
  connect(options: IConnectionBridgeOptions<P>): Promise<Error | void>;
  /**
   * Close all connections and release the options.
   * The connection can't be used anymore.
   *
   * @returns {(Promise<Error | void>)}
   * @memberof IConnectionBridge
   */
  close(): Promise<Error | void>;
}
