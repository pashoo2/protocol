import assert from 'assert';
import { IConnectionBridgeOptions } from './connection-bridge.types';
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
import { CONNECTION_BRIDGE_OPTIONS_DEFAULT_AUTH_PROVIDERS_POOL } from './connection-bridge.const';
import { CentralAuthority } from '../central-authority-class/central-authority-class';
import { ISwarmConnectionOptions } from '../swarm-connection-class/swarm-connection-class.types';
import { SwarmMessageConstructor } from '../swarm-message/swarm-message-constructor';
import { ipfsUtilsConnectBasic } from '../../utils/ipfs-utils/ipfs-utils';
import { SwarmMessageStore } from '../swarm-message-store/swarm-message-store';

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
> {
  public caConnection?: ICentralAuthority;

  public storage?: ISwarmMessageStore<P>;

  protected options?: IConnectionBridgeOptions<P>;

  protected optionsCA?: ICentralAuthorityOptions;

  protected optionsMessageConstructor?: TSwarmMessageConstructorOptions;

  protected optionsSwarmConnection?: ISwarmConnectionOptions;

  protected optionsMessageStorage?: ISwarmMessageStoreOptions<P>;

  protected messageConstructor?: ISwarmMessageConstructor;

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
    this.setOptions(options);
    await this.startCentralAuthorityConnection();
    await this.createMessageConstructor();
    await this.startSwarmConnection();
    await this.startStorageConnection();
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
        credentials: authOptions.credentials,
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
    const { messageConstructor, caConnection } = this;
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

    const userId = caConnection.getUserIdentity();

    if (typeof userId !== 'string') {
      throw new Error('Failed to get the user identity');
    }

    const messageStorageOptions: ISwarmMessageStoreOptions<P> = {
      ...options.storage,
      credentials: authOptions.credentials,
      userId,
      messageConstructors: {
        default: messageConstructor,
      },
    };

    return messageStorageOptions;
  }

  /**
   *
   *
   * @protected
   * @param {IConnectionBridgeOptions<P>} options
   * @memberof ConnectionBridge
   * @throws
   */
  protected setOptions(options: IConnectionBridgeOptions<P>) {
    assert(options, 'Options must be provided');
    assert(typeof options === 'object', 'Options must be an object');
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

    await centralAuthority.connect(optioinsCA);
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
    const messageConstructor = new SwarmMessageConstructor(options);

    this.messageConstructor = messageConstructor;
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

    const ipfs = await ipfsUtilsConnectBasic();

    this.swarmConnection = {
      getNativeConnection() {
        return ipfs;
      },
    };
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

    await swarmMessageStorage.connect(swarmMessageStorageOptions);
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
