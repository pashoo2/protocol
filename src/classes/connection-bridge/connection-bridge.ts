import assert from 'assert';
import {
  IConnectionBridgeOptions,
  IConnectionBridge,
} from './connection-bridge.types';
import { ESwarmStoreConnector } from '../swarm-store-class/swarm-store-class.const';
import {
  ICentralAuthorityOptions,
  ICentralAuthority,
} from '../central-authority-class/central-authority-class.types';
import {
  TSwarmMessageConstructorOptions,
  ISwarmMessageConstructor,
} from '../swarm-message/swarm-message-constructor.types';
import {
  ISwarmMessageStoreOptions,
  ISwarmMessageStore,
} from '../swarm-message-store/swarm-message-store.types';
import { extend } from '../../utils/common-utils/common-utils-objects';
import {
  CONNECTION_BRIDGE_OPTIONS_DEFAULT_AUTH_PROVIDERS_POOL,
  CONNECTION_BRIDGE_SESSION_STORAGE_KEYS,
  CONNECTION_BRIDGE_STORAGE_DATABASE_PREFIX,
} from './connection-bridge.const';
import { CentralAuthority } from '../central-authority-class/central-authority-class';
import { ipfsUtilsConnectBasic } from '../../utils/ipfs-utils/ipfs-utils';
import { SwarmMessageStore } from '../swarm-message-store/swarm-message-store';
import { ISensitiveDataSessionStorage } from 'classes/sensitive-data-session-storage/sensitive-data-session-storage.types';
import { SensitiveDataSessionStorage } from 'classes/sensitive-data-session-storage';
import {
  ISwarmMessageEncryptedCacheFabric,
  ISwarmMessageConstructorWithEncryptedCacheFabric,
} from '../swarm-messgae-encrypted-cache/swarm-messgae-encrypted-cache.types';
import { CONNECTION_BRIDGE_STORAGE_DATABASE_NAME } from './connection-bridge.const';
import {
  getSwarmMessageEncryptedCacheFabric,
  getSwarmMessageConstructorWithCacheFabric,
} from '../swarm-messgae-encrypted-cache/swarm-message-encrypted-cache.utils';
import { ISwarmMessgaeEncryptedCache } from '../swarm-messgae-encrypted-cache';

/**
 * this class used if front of connection
 * to the swarm, swarm database and
 * central authority, to simplify connection
 * process.
 *
 * @export
 * @class ConnectionBridge
 */
export class ConnectionBridge<
  P extends ESwarmStoreConnector = ESwarmStoreConnector.OrbitDB
> implements IConnectionBridge {
  public caConnection?: ICentralAuthority;

  public storage?: ISwarmMessageStore<P>;

  public messageConstructor?: ISwarmMessageConstructor;

  public swarmMessageEncryptedCacheFabric?: ISwarmMessageEncryptedCacheFabric;

  public swarmMessageConstructorFabric?: ISwarmMessageConstructorWithEncryptedCacheFabric;

  protected options?: IConnectionBridgeOptions<P, true>;

  protected optionsCA?: ICentralAuthorityOptions;

  protected optionsMessageConstructor?: TSwarmMessageConstructorOptions;

  protected optionsSwarmConnection?: any;

  protected optionsMessageStorage?: ISwarmMessageStoreOptions<P>;

  protected session?: ISensitiveDataSessionStorage;

  protected userDataStore?: ISensitiveDataSessionStorage;

  protected swarmMessageEncryptedCache?: ISwarmMessgaeEncryptedCache;

  protected swarmConnection?: {
    getNativeConnection(): any;
  };

  /**
   * Connect to the central authority,
   * create the message constructor,
   * create swarm connection, start
   * connection with the swarm message storage.
   *
   * @memberof ConnectionBridge
   * @throws
   */
  public async connect(options: IConnectionBridgeOptions<P>): Promise<void> {
    await this.setOptions(options);
    try {
      await this.startSession();
      await this.startCentralAuthorityConnection();
      await this.createSwarmMessageEncryptedCacheFabric();
      await this.createSwarmMessageConstructorFabric();
      await this.startSwarmMessageEncryptedCache();
      await this.createMessageConstructor();
      await this.startSwarmConnection();
      await this.startStorageConnection();
    } catch (err) {
      console.error('connection to the swarm failed', err);
      await this.close();
      throw err;
    }
  }

  /**
   * close all the connections and
   * release all instances
   *
   * @returns {Promise<void>}
   * @memberof ConnectionBridge
   */
  public async close(): Promise<void> {
    await this.closeStorage();
    await this.closeMessageConstructor();
    await this.closeSwarmConnection();
    await this.closeSwarmMessageEncryptedCacheFabric();
    await this.closeSwarmMessageConstructorFabric();
    await this.closeCentralAuthorityConnection();
  }

  /**
   * set options for the CentralAuthority connection.
   *
   * @protected
   * @memberof ConnectionBridge
   * @throws
   */
  protected setOptionsCA(): ICentralAuthorityOptions {
    const { options } = this;
    const { auth: authOptions, user: userOptions } = options!;

    assert(authOptions, 'Authorization options must be defined');
    assert(
      typeof authOptions === 'object',
      'Authorization options must be an object'
    );
    assert(userOptions, 'User options must be defined');
    assert(typeof userOptions === 'object', 'User options must be an object');

    const authProvidersPool: ICentralAuthorityOptions['authProvidersPool'] = extend(
      authOptions.authProvidersPool,
      CONNECTION_BRIDGE_OPTIONS_DEFAULT_AUTH_PROVIDERS_POOL
    );
    const optionsCentralAuthority: ICentralAuthorityOptions = {
      user: {
        profile: userOptions.profile,
        authProviderUrl: authOptions.providerUrl,
        credentials: {
          ...authOptions.credentials,
          session: this.session,
        },
      },
      authProvidersPool,
    };

    this.optionsCA = optionsCentralAuthority;
    return optionsCentralAuthority;
  }

  /**
   *
   *
   * @protected
   * @returns {TSwarmMessageConstructorOptions}
   * @memberof ConnectionBridge
   * @throws
   */
  protected setOptionsMessageConstructor(): TSwarmMessageConstructorOptions {
    const { caConnection } = this;

    if (!caConnection) {
      throw new Error('There is no connection to the central authoriry');
    }
    return {
      caConnection,
      instances: {
        encryptedCache: this.swarmMessageEncryptedCache,
      },
    };
  }

  /**
   * set options for the SwarmConnection provider
   *
   * @protected
   * @memberof ConnectionBridge
   */
  protected setOptionsSwarmConnection() {}

  /**
   * set options for the message storage
   *
   * @protected
   * @memberof ConnectionBridge
   * @throws
   */
  protected setOptionsMessageStorage(): ISwarmMessageStoreOptions<P> {
    const { messageConstructor, caConnection, swarmConnection } = this;
    const options = this.options!;
    const { auth: authOptions, storage: storageOptions } = options;

    if (!messageConstructor) {
      throw new Error('There is no message constructor defined');
    }
    if (!caConnection) {
      throw new Error(
        'There is no message central authority connection defined'
      );
    }
    if (!swarmConnection) {
      throw new Error('There is no swarm connection provider');
    }

    const userId = caConnection.getUserIdentity();

    if (typeof userId !== 'string') {
      throw new Error('Failed to get the user identity');
    }

    const authCredentials = {
      ...(authOptions.credentials as ISwarmMessageStoreOptions<
        P
      >['credentials']),
      session: this.session,
    };
    const messageStorageOptions: ISwarmMessageStoreOptions<P> = {
      ...storageOptions,
      credentials: authCredentials,
      userId,
      swarmMessageConstructorFabric: this.swarmMessageConstructorFabric,
      messageConstructors: {
        default: messageConstructor,
      },
      providerConnectionOptions: {
        ipfs: swarmConnection.getNativeConnection(),
      },
    };

    return messageStorageOptions;
  }

  protected async startUserDataStore() {
    const userDataStore = new SensitiveDataSessionStorage();

    await userDataStore.connect({
      storagePrefix:
        CONNECTION_BRIDGE_STORAGE_DATABASE_PREFIX.USER_DATA_STORAGE,
    });
    this.userDataStore = userDataStore;
  }

  /**
   *
   *
   * @protected
   * @param {IConnectionBridgeOptions<P>} options
   * @memberof ConnectionBridge
   * @throws
   */
  protected async setOptions(options: IConnectionBridgeOptions<P>) {
    await this.startUserDataStore();
    assert(options, 'Options must be provided');
    assert(typeof options === 'object', 'Options must be an object');
    if (options.auth.credentials?.login) {
      await this.userDataStore?.setItem(
        CONNECTION_BRIDGE_SESSION_STORAGE_KEYS.USER_LOGIN,
        options.auth.credentials.login
      );
      this.options = (options as unknown) as IConnectionBridgeOptions<P, true>;
    } else {
      assert(
        options.auth.session,
        'A session must be started if there is no credentials provided'
      );

      const login = await this.userDataStore?.getItem(
        CONNECTION_BRIDGE_SESSION_STORAGE_KEYS.USER_LOGIN
      );

      if (!login) {
        throw new Error(
          'There is no login provided in options and no session data found to get it'
        );
      }
      this.options = {
        ...options,
        auth: {
          ...options.auth,
          credentials: {
            ...options.auth.credentials,
            login,
          },
        },
      };
    }
  }

  /**
   * start session if options provided
   *
   * @protected
   * @param {ISensitiveDataSessionStorageOptions} sessionOptions
   * @memberof ConnectionBridge
   * @throws
   */
  protected async startSession(): Promise<void> {
    const sessionOptions = this.options?.auth.session;

    if (sessionOptions) {
      const session = new SensitiveDataSessionStorage();

      await session.connect({
        ...sessionOptions,
        storagePrefix: sessionOptions.storagePrefix
          ? `${sessionOptions.storagePrefix}${this.options?.auth.credentials?.login}`
          : undefined,
      });
      this.session = session;
    }
  }

  /**
   *
   *
   * @protected
   * @memberof ConnectionBridge
   * @throws
   */
  protected async startCentralAuthorityConnection(): Promise<void> {
    const optioinsCA = this.setOptionsCA();
    const centralAuthority = new CentralAuthority();
    const connectionResult = await centralAuthority.connect(optioinsCA);

    if (connectionResult instanceof Error) {
      throw connectionResult;
    }
    this.caConnection = centralAuthority;
  }

  /**
   * create the default message construtor
   *
   * @protected
   * @memberof ConnectionBridge
   * @throws
   */
  protected async createMessageConstructor(): Promise<void> {
    const options = this.setOptionsMessageConstructor();

    if (!this.swarmMessageConstructorFabric) {
      throw new Error(
        'Swarm message constructor fabric must be created before'
      );
    }
    this.messageConstructor = await this.swarmMessageConstructorFabric(options);
  }

  /**
   * create connection to the swarm through the
   * provider.
   * TODO
   *
   * @protected
   * @memberof ConnectionBridge
   */
  protected async startSwarmConnection(): Promise<void> {
    this.setOptionsSwarmConnection();

    const ipfs = await ipfsUtilsConnectBasic(
      this.options ? this.options.swarm : undefined
    );

    this.swarmConnection = {
      getNativeConnection() {
        return ipfs;
      },
    };
  }

  protected getOptionsSwarmMessageEncryptedCache() {
    const login = this.options!.auth.credentials.login;

    return {
      login,
      password: this.options!.auth.credentials.password!,
      session: this.session,
    };
  }

  protected async createSwarmMessageEncryptedCacheFabric(): Promise<void> {
    const login = this.options!.auth.credentials.login;
    this.swarmMessageEncryptedCacheFabric = await getSwarmMessageEncryptedCacheFabric(
      this.getOptionsSwarmMessageEncryptedCache(),
      `__${CONNECTION_BRIDGE_STORAGE_DATABASE_PREFIX.MESSAGE_CACHE_STORAGE}_//_${login}`
    );
  }

  protected async createSwarmMessageConstructorFabric(): Promise<void> {
    const login = this.options!.auth.credentials.login;

    this.swarmMessageConstructorFabric = await getSwarmMessageConstructorWithCacheFabric(
      this.getOptionsSwarmMessageEncryptedCache(),
      {
        caConnection: this.caConnection!,
        instances: {},
      },
      `__${CONNECTION_BRIDGE_STORAGE_DATABASE_PREFIX.MESSAGE_CACHE_STORAGE}_//_${login}`
    );
  }

  protected async startSwarmMessageEncryptedCache(): Promise<void> {
    const login = this.options!.auth.credentials.login;

    if (!this.swarmMessageEncryptedCacheFabric) {
      throw new Error('Encrypted cache fabric must be started before');
    }
    this.swarmMessageEncryptedCache = await this.swarmMessageEncryptedCacheFabric(
      {
        dbName: `${CONNECTION_BRIDGE_STORAGE_DATABASE_NAME.MESSAGE_CACHE_STORAGE}_//_${login}`,
      }
    );
  }

  /**
   * start connection with the SwarmMessage storage
   *
   * @protected
   * @memberof ConnectionBridge
   * @throws
   */
  protected async startStorageConnection(): Promise<void> {
    const swarmMessageStorageOptions = this.setOptionsMessageStorage();
    const swarmMessageStorage = new SwarmMessageStore<P>();
    const result = await swarmMessageStorage.connect(
      swarmMessageStorageOptions
    );

    if (result instanceof Error) {
      throw result;
    }
    this.storage = swarmMessageStorage;
  }

  /**
   * close the connection with the swarm message storage
   * and release the instance and options;
   *
   * @protected
   * @returns {Promise<void>}
   * @memberof ConnectionBridge
   */
  protected async closeStorage(): Promise<void> {
    const { storage } = this;

    if (storage) {
      try {
        await storage.close();
      } catch (err) {
        console.error(
          'Failed to close the connection to the swarm message storage',
          err
        );
      }
    } else {
      console.warn('closeSwarmMessageStorage - there is no connection');
    }
    this.storage = undefined;
    this.optionsMessageStorage = undefined;
  }

  /**
   * close the default constructor of a swarm messages,
   * release it's options and the instance.
   *
   * @protected
   * @memberof ConnectionBridge
   */
  protected async closeMessageConstructor(): Promise<void> {
    this.messageConstructor = undefined;
    this.optionsMessageConstructor = undefined;
  }

  /**
   * close the connection to the swarm and release the instance
   * and settings.
   *
   * @protected
   * @returns {Promise<void>}
   * @memberof ConnectionBridge
   */
  protected async closeSwarmConnection(): Promise<void> {
    const { swarmConnection } = this;

    if (swarmConnection) {
      const ipfsConnection = swarmConnection.getNativeConnection();

      try {
        await ipfsConnection.stop();
      } catch (error) {
        console.error(
          'closeSwarmConnection failed to stop the ipfs node!',
          error
        );
      }
    }
    this.swarmConnection = undefined;
    this.optionsSwarmConnection = undefined;
  }

  /**
   * close the instance of the fabric
   *
   * @protected
   * @memberof ConnectionBridge
   */
  protected async closeSwarmMessageEncryptedCacheFabric() {
    this.swarmMessageEncryptedCacheFabric = undefined;
  }

  /**
   * close the instance of the fabric
   *
   * @protected
   * @memberof ConnectionBridge
   */
  protected async closeSwarmMessageConstructorFabric() {
    this.swarmMessageConstructorFabric = undefined;
  }

  /**
   * close the connection to the central authority
   *
   * @protected
   * @returns {Promise<void>}
   * @memberof ConnectionBridge
   */
  protected async closeCentralAuthorityConnection(): Promise<void> {
    const { caConnection } = this;

    if (caConnection) {
      try {
        await caConnection.disconnect();
      } catch (err) {
        console.error(
          'closeCentralAuthorityConnection failed to close the connection to the central authority',
          err
        );
      }
    }
    this.caConnection = undefined;
    this.optionsCA = undefined;
  }
}
