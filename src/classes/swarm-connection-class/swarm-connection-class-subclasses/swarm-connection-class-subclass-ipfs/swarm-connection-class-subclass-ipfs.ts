import {
  ISwarmConnectionSubclass,
  ESwarmConnectionSubclassStatus,
  IIPFSSpecificOptions,
} from 'classes/swarm-connection-class/swarm-connection-class.types';
import {
  SWARM_CONNECTION_SUBCLASS_IPFS_CDN_SCRIPT_URL,
  SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DEFALT,
  SWARM_CONNECTION_SUBCLASS_IPFS_NODE_START_TIMEOUT,
  SWARM_CONNECTION_SUBCLASS_IPFS_NODE_RECONNECTION_MAX_ATTEMPTS,
} from './swarm-connection-class-subclass-ipfs.const';
import { getStatusClass } from 'classes/basic-classes/status-class-base/status-class-base';
import { timeout } from 'utils/common-utils/common-utils-timer';
import * as Ipfs from 'types/ipfs.types';

export class SwarmConnectionSubclassIPFS
  extends getStatusClass<typeof ESwarmConnectionSubclassStatus>({
    errorStatus: ESwarmConnectionSubclassStatus.ERROR,
    instanceName: 'SwarmConnectionSubclassIPFS',
  })
  implements ISwarmConnectionSubclass {
  protected IPFS?: any;

  protected options?: IIPFSSpecificOptions;

  protected connection?: Ipfs.IPFS;

  public isClosed: boolean = false;

  protected reconnectionAttempt: number = 0;

  public get isConnected(): boolean {
    const { isClosed, connection } = this;

    return !isClosed && !!connection && !!connection.isOnline();
  }

  public getNativeConnection(): Ipfs.IPFS | undefined {
    return this.connection;
  }

  public async close(): Promise<boolean | Error> {
    const { isClosed } = this;

    console.warn('ipfs:close');
    if (isClosed) {
      return true;
    }
    this.setConnectionClosed();
    await this.stopCurrentConnection();
    return true;
  }

  public async connect(options: IIPFSSpecificOptions): Promise<boolean | Error> {
    const { isClosed } = this;

    if (isClosed) {
      return new Error('The connection was closed previousely');
    }

    const setOptionsResult = this.setOptions(options);

    if (setOptionsResult instanceof Error) {
      console.error(setOptionsResult);
      return this.setErrorStatus('Failed to set the options');
    }

    const scriptLoadingResult = await this.preloadIpfsModule();

    console.warn('ipfs:connect');
    if (scriptLoadingResult instanceof Error) {
      console.error(scriptLoadingResult);
      return this.setErrorStatus('Failed to preload the IPFS library');
    }

    const startResult = await this.start();

    if (startResult instanceof Error) {
      // if failed to start, then try to reconnect
      const connectionResult = await this.reconnect();

      if (connectionResult instanceof Error) {
        console.error(connectionResult);
        return this.setErrorStatus('Failed to connect the first time');
      }
    }
    return true;
  }

  protected setConnectionClosed() {
    console.warn('Ipfs connection is closed');
    this.isClosed = true;
    this.setStatus(ESwarmConnectionSubclassStatus.CLOSE);
  }

  protected setOptions(options?: IIPFSSpecificOptions): Error | boolean {
    if (!options || typeof options.password !== 'string') {
      return new Error('An options and a password must be specified to encrypt the provate data');
    }
    this.options = options;
    return true;
  }

  protected setIpfsConstructor(IPFS: any) {
    this.IPFS = IPFS;
  }

  protected setIpfsConnection(ipfsNode: Ipfs.IPFS) {
    this.connection = ipfsNode;
    // unset the listeners for the node,
    // cause it may be already set
    this.unsetListeners(ipfsNode);
    // set listeners for an events 
    // emitted by the IPFS node
    this.setListeners(ipfsNode);
  }

  protected unsetCurrentConnection(ipfsNode?: Ipfs.IPFS) {
    const { connection } = this;

    if (ipfsNode) {
      if (ipfsNode === connection) {
        this.connection = undefined;
      }
      if (ipfsNode) {
        this.unsetListeners(ipfsNode);
      }
    }
  }

  protected async preloadIpfsModule(): Promise<Error | boolean> {
    let ipfsModule: unknown | Error;
    
    try {
      ipfsModule = await import('ipfs');
    } catch (err) {
      ipfsModule = err as Error;
    }
  
    if (ipfsModule instanceof Error) {
      console.error(
        `Failed to load the IPFS main script from the source ${SWARM_CONNECTION_SUBCLASS_IPFS_CDN_SCRIPT_URL}`
      );
      return ipfsModule;
    }
    if (!ipfsModule || typeof (ipfsModule as any).create !== 'function') {
      return new Error('Failed to load an instance of IPFS');
    }
    this.setIpfsConstructor(ipfsModule);
    return true;
  }

  protected handleStarted = () => {
    console.warn('IPFS connection to the swarm was started');
    this.setStatus(ESwarmConnectionSubclassStatus.STARTED);
  }

  protected handleError = async (error?: Error) => {
    if (error) {
      console.error(
        'An error has occured with the IPFS swarm connection subclass'
      );
      console.error(error);
    }
  }

  protected handleInitialized = () => {
    console.warn('IPFS connection to the swarm was initialized');
    this.setStatus(ESwarmConnectionSubclassStatus.INITIALIZED);
  }

  protected handleStop = () => {
    console.warn('IPFS connection to the swarm was initialized');
    const { isClosed } = this;
    
    if (!isClosed) {
      this.setStatus(ESwarmConnectionSubclassStatus.STOP);
      this.reconnect();
    }
  }

  protected setListeners(
    connection: Ipfs.IPFS,
    isSetListeners: boolean = true
  ) {
    const methodName = isSetListeners ? 'on' : 'off';

    connection[methodName]('start', this.handleStarted);
    connection[methodName]('init', this.handleInitialized);
    connection[methodName]('error', this.handleError);
    connection[methodName]('stop', this.handleStop);
  }

  protected unsetListeners = (connection: Ipfs.IPFS) => {
    this.setListeners(connection, false);
  };

  protected async createConnection(): Promise<Error | boolean> {
    console.warn('create a new IPFS connection to the swarm');
    const { IPFS, options } = this;

    if (IPFS) {
      const connection: Ipfs.IPFS = await IPFS.create({
        ...SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DEFALT,
        pass: options ? options.password : null, // password from options
      });

      // this is working connection
      // const connection: Ipfs.IPFS = await IPFS.create({
      //   "preload":
      //   {"enabled":false},
      //   "config":{"Addresses":{"Swarm":["/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star"]}},
      //   "repo":"orbit-chat-ipfs-dfffd",
      //   "EXPERIMENTAL": {
      //     "pubsub":true,
      //   }}
      // );

      if (connection instanceof Error) {
        console.error('Failed to create a new IPFS node');
        return connection;
      }
      this.setIpfsConnection(connection);
      console.warn('IPFS node config');
      console.warn(SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DEFALT);
      return true;
    }
    return new Error('Ipfs was not loaded as a dynamic module previousely');
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

      // if failed to start or a timeout has reached
      // stop the connection
      const stopConnectionResult = await this.stopConnection(connection);

      if (stopConnectionResult instanceof Error) {
        this.setErrorStatus('Failed to stop the connection during creating a new one');
        return stopConnectionResult;
      }
      return err;
    }

    const nodeId = await connection.id();

    if (!nodeId) {
      return new Error('Failed to start node id connection');
    }
    console.warn(`Ipfs node was started as: /n ${nodeId}`);
    return true;
  }

  protected async stopConnection(
    connection: Ipfs.IPFS
  ): Promise<Error | void> {
    console.warn('Stop the connection');
    try {
      await connection.stop();
    } catch(err) {
      console.error(new Error('Failed to stop the ipfs node'));
      return err;
    }
  }

  async stopCurrentConnection(): Promise<Error | void> {
    const { connection } = this;

    if (connection) {
      // if the current connection is exists, then stop it
      // unset the connection and it's listeners
      this.unsetCurrentConnection(connection);
      const connectionStopResult = await this.stopConnection(connection);

      if (connectionStopResult instanceof Error) {
        console.error(connectionStopResult);
        return connectionStopResult;
      }
    }
  }

  protected incReconnectionAttempt() {
    this.reconnectionAttempt += 1;
    console.warn('ipfs:incReconnectionAttempt');
  }

  protected resetReconnectionAttempt() {
    this.reconnectionAttempt = 0;
    console.warn('ipfs:resetReconnectionAttempt');
  }

  protected async reconnect(): Promise<Error | boolean> {
    console.warn('ipfs:reconnect');
    this.incReconnectionAttempt();
    if (
      this.reconnectionAttempt >
      SWARM_CONNECTION_SUBCLASS_IPFS_NODE_RECONNECTION_MAX_ATTEMPTS
    ) {
      await this.close();
      this.setStatus(ESwarmConnectionSubclassStatus.CONNECTION_FAILED);
      return new Error('Failed to connect to the SWARM throught the IPFS');
    }

    const startResult = await this.start();

    if (startResult instanceof Error) {
      // if failed to start, then try to reconnect once again
      console.error(startResult);
      return this.reconnect();
    }
    this.resetReconnectionAttempt();
    return true;
  }

  protected async start(): Promise<Error | boolean> {
    const { isClosed } = this;

    console.warn('ipfs:start');
    if (isClosed) {
      return new Error(
        'Unable to connect to the swarm if the connection was closed before'
      );
    }
    this.setStatus(ESwarmConnectionSubclassStatus.CONNECTING);
    
    // stop the current connection if exists
    const stopConnectionResult = await this.stopCurrentConnection();

    if (stopConnectionResult instanceof Error) {
      this.setErrorStatus('Failed to stop the previous connection');
    }
    
    // create a new connection to the ipfs
    const createConnectionResult = await this.createConnection();

    if (createConnectionResult instanceof Error) {
      this.setErrorStatus(createConnectionResult);
      return new Error('Failed to create a new connection');
    }

    const startConnectionResult = await this.startConnection();

    if (startConnectionResult instanceof Error) {
      this.setErrorStatus(startConnectionResult);
      return new Error('Failed to start the connection');
    }
    // if started succesfully
    // then set the status that the node
    // was started succesfully
    this.setStatus(ESwarmConnectionSubclassStatus.CONNECTED);
    return true;
  }
}
