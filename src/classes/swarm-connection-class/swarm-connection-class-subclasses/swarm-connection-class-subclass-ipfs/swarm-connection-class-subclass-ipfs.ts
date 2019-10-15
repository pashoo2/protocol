/* global window.Ipfs */
import ipfs from 'types/ipfs.types';
import {
  ISwarmConnectionSubclass,
  ESwarmConnectionSubclassStatus,
} from 'classes/swarm-connection-class/swarm-connection-class.types';
import {
  SWARM_CONNECTION_SUBCLASS_IPFS_CDN_SCRIPT_URL,
  SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DEFALT,
  SWARM_CONNECTION_SUBCLASS_IPFS_NODE_START_TIMEOUT,
  SWARM_CONNECTION_SUBCLASS_IPFS_NODE_RECONNECTION_MAX_ATTEMPTS,
} from './swarm-connection-class-subclass-ipfs.const';
import { lazyLoadScript } from 'utils/lazy-loading-utils/lazy-loading-utils';
import { getStatusClass } from 'classes/basic-classes/status-class-base/status-class-base';
import { timeout } from 'utils/common-utils/common-utils-timer';

export class SwarmConnectionSubclassIPFS
  extends getStatusClass<typeof ESwarmConnectionSubclassStatus>({
    errorStatus: ESwarmConnectionSubclassStatus.ERROR,
    instanceName: 'SwarmConnectionSubclassIPFS',
  })
  implements ISwarmConnectionSubclass {
  protected IPFS?: any;

  protected connection?: ipfs.IpfsNode;

  public isClosed: boolean = false;

  protected reconnectionAttempt: number = 0;

  protected setConnectionClosed() {
    console.warn('Ipfs connection is closed');
    this.isClosed = true;
    this.setStatus(ESwarmConnectionSubclassStatus.CLOSE);
  }

  protected setIpfsConstructor(IPFS: any) {
    this.IPFS = IPFS;
  }

  protected setIpfsConnection(ipfsNode: ipfs.IpfsNode) {
    this.connection = ipfsNode;
  }

  protected async preloadScriptFromCDN(): Promise<Error | boolean> {
    const scriptLoading = await lazyLoadScript(
      SWARM_CONNECTION_SUBCLASS_IPFS_CDN_SCRIPT_URL
    );

    if (scriptLoading instanceof Error) {
      console.error(
        `Failed to load the IPFS main script from the source ${SWARM_CONNECTION_SUBCLASS_IPFS_CDN_SCRIPT_URL}`
      );
      return scriptLoading;
    }
    if (!(window as any).Ipfs) {
      return new Error(
        'There is no IPFS was found on the window global variable'
      );
    }

    const { Ipfs } = window as any;

    if (!Ipfs || typeof Ipfs.create !== 'function') {
      return new Error('Failed to load an instance of IPFS');
    }
    this.setIpfsConstructor(Ipfs);
    return true;
  }

  protected handleError(error?: Error) {
    if (error) {
      console.error(
        'An error has occured with the IPFS swarm connection subclass'
      );
      console.error(error);
    }
  }

  protected handleInitialized() {
    console.warn('IPFS connection to the swarm was initialized');
    this.setStatus(ESwarmConnectionSubclassStatus.INITIALIZED);
  }

  protected handleStop() {
    console.warn('IPFS connection to the swarm was initialized');
    const { isClosed } = this;

    if (!isClosed) {
      this.setStatus(ESwarmConnectionSubclassStatus.STOP);
      this.reconnect();
    }
  }

  protected setListeners(
    connection: ipfs.IpfsNode,
    isSetListeners: boolean = true
  ) {
    const methodName = isSetListeners ? 'on' : 'off';

    connection[methodName]('error', this.handleError);
    connection[methodName]('init', this.handleInitialized);
  }

  protected unsetListeners = (connection: ipfs.IpfsNode) => {
    this.setListeners(connection, false);
  };

  protected async createConnetion(): Promise<Error | boolean> {
    console.warn('create a new IPFS connection to the swarm');
    const { IPFS } = this;

    if (IPFS) {
      const connection = await IPFS.create(
        SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DEFALT
      );

      this.setIpfsConnection(connection);
      console.warn('IPFS node config');
      console.warn(SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DEFALT);
      return true;
    }
    return new Error('Ipfs constructoe was not loaded');
  }

  protected async startConnection(): Promise<Error | boolean> {
    const { connection, isClosed } = this;

    if (isClosed) {
      return new Error('Unable to start connection closed previousely');
    }
    if (!connection) {
      return new Error(
        'There is no connection to the IPFS, it must be created before start'
      );
    }
    try {
      await Promise.race([
        timeout(SWARM_CONNECTION_SUBCLASS_IPFS_NODE_START_TIMEOUT),
        connection.ready,
      ]);
    } catch (err) {
      console.error(err);
      const stopConnectionResult = await this.stopConnection(connection);

      if (stopConnectionResult instanceof Error) {
        console.error(stopConnectionResult);
      }
      return this.setErrorStatus('Failed to start connection');
    }

    const nodeId = await connection.id();

    if (!nodeId) {
      return new Error('Failed to start node id connection');
    }
    console.warn(`Ipfs node was started as: /n ${nodeId}`);
    return true;
  }

  protected async stopConnection(
    connection: ipfs.IpfsNode
  ): Promise<Error | void> {
    console.warn('Stop the connection');
    this.unsetListeners(connection);
    return connection.stop();
  }

  protected async reconnect(): Promise<Error | boolean> {
    this.reconnectionAttempt += 1;
    if (
      this.reconnectionAttempt >
      SWARM_CONNECTION_SUBCLASS_IPFS_NODE_RECONNECTION_MAX_ATTEMPTS
    ) {
      await this.close();
      this.setStatus(ESwarmConnectionSubclassStatus.CONNECTION_FAILED);
      return new Error('Failed to connect to the SWARM throught the IPFS');
    }

    const { connection } = this;

    if (connection) {
      const connectionStopResult = await this.stopConnection(connection);

      if (connectionStopResult instanceof Error) {
        console.error(connectionStopResult);
        return this.reconnect();
      }
    }

    const startResult = await this.start();

    if (startResult instanceof Error) {
      console.error(startResult);
      return this.reconnect();
    }
    return true;
  }

  protected async start(): Promise<Error | boolean> {
    const { isClosed, connection } = this;

    this.setStatus(ESwarmConnectionSubclassStatus.CONNECTING);
    if (isClosed) {
      return new Error(
        'Unable to reconnect to the swarm if the connection was closed previusely'
      );
    }
    if (!connection) {
      const createConnectionResult = await this.createConnetion();

      if (createConnectionResult instanceof Error) {
        this.setErrorStatus(createConnectionResult);
        return new Error('Failed to create a new connection');
      }
    } else {
      const stopCurrentConnectionResult = await this.stopConnection(connection);

      if (stopCurrentConnectionResult instanceof Error) {
        return this.setErrorStatus(stopCurrentConnectionResult);
      }
    }

    const startConnectionResult = await this.startConnection();

    if (startConnectionResult instanceof Error) {
      this.setErrorStatus(startConnectionResult);
      return new Error('Failed to start the connection');
    }

    const { connection: currentConnection } = this;

    if (!currentConnection) {
      return new Error(
        'Failed to start the connection cause there is no connection created'
      );
    }
    this.setListeners(currentConnection);
    return true;
  }

  public async close(): Promise<boolean | Error> {
    const { isClosed, connection } = this;

    if (isClosed) {
      return true;
    }
    this.setConnectionClosed();
    if (connection) {
      const stopConnectionResult = await this.stopConnection(connection);

      if (stopConnectionResult instanceof Error) {
        console.error(stopConnectionResult);
        return new Error(
          'Failed to stop the existing IPFS connection to the swarm'
        );
      }
    }
    return true;
  }

  public async connect(): Promise<boolean | Error> {
    const scriptLoadingResult = await this.preloadScriptFromCDN();

    if (scriptLoadingResult instanceof Error) {
      console.error(scriptLoadingResult);
      return new Error('Failed to preload the IPFS library');
    }

    this.setStatus(ESwarmConnectionSubclassStatus.CONNECTING);
    const startResult = await this.start();

    if (startResult instanceof Error) {
      return this.reconnect();
    }
    this.setStatus(ESwarmConnectionSubclassStatus.CONECTED);
    return true;
  }
}
