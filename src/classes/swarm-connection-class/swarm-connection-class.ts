import {
  ISwarmConnection,
  ISwarmConnectionSubclass,
  ESwarmConnectionClassStatus,
  ISwarmConnectionOptions,
  ESwarmConnectionClassSubclassType,
  TSwarmConnectionSubclassSpecificOptions,
  ESwarmConnectionSubclassStatus,
} from './swarm-connection-class.types';
import { SwarmConnectionSubclassIPFS } from './swarm-connection-class-subclasses/swarm-connection-class-subclass-ipfs/swarm-connection-class-subclass-ipfs';
import { getStatusClass } from '../basic-classes/status-class-base/status-class-base';
import { STATUS_CLASS_STATUS_CHANGE_EVENT } from '../basic-classes/status-class-base/status-class-base.const';
import * as Ipfs from 'types/ipfs.types';

export class SwarmConnection
  extends getStatusClass<typeof ESwarmConnectionClassStatus>({
    errorStatus: ESwarmConnectionClassStatus.ERROR,
    instanceName: 'SwarmConnection',
  })
  implements ISwarmConnection {
  public get isClosed(): boolean {
    const { connection } = this;

    if (connection) {
      return !!connection.isClosed;
    }
    return this.status === ESwarmConnectionSubclassStatus.CLOSE;
  }

  public get isConnected() {
    const { connection } = this;

    if (connection) {
      return !!connection.isConnected;
    }
    return false;
  }

  public get connectionType(): ESwarmConnectionClassSubclassType | void {
    const { options } = this;

    if (options) {
      const { type } = options;

      return type;
    }
  }

  private connection?: ISwarmConnectionSubclass;

  private options?: ISwarmConnectionOptions;

  public getNativeConnection(): Ipfs.IPFS | undefined {
    if (this.connection) {
      return this.connection.getNativeConnection();
    }
    return undefined;
  }

  public async connect(
    options: ISwarmConnectionOptions
  ): Promise<boolean | Error> {
    const { isClosed } = this;

    if (isClosed) {
      return new Error(
        'Failed to start the connetion which was closed perviouselly'
      );
    }

    this.setOptions(options);
    this.setStatus(ESwarmConnectionClassStatus.CONNECTING);

    const createConnectionInstanceResult = this.createConnectionInstance();

    if (createConnectionInstanceResult instanceof Error) {
      this.setErrorStatus(createConnectionInstanceResult);
      return new Error(
        'Failed to create the instance of the connection with swarm subclass'
      );
    }

    const connectionResult = await this.startConnection();

    if (connectionResult instanceof Error) {
      this.setErrorStatus(connectionResult);
      return connectionResult;
    }
    return true;
  }

  public async close(): Promise<Error | boolean> {
    const { connection, isClosed } = this;

    if (isClosed) {
      return new Error('The connection was closed previousely');
    }
    this.setStatus(ESwarmConnectionClassStatus.CLOSE);
    this.unsetConnectionSubClassInstance(connection);
    if (connection) {
      const subclassConnectionCloseResult = await connection.close();

      if (subclassConnectionCloseResult instanceof Error) {
        console.error(subclassConnectionCloseResult);
        return this.setErrorStatus('Failed to close the sub connection');
      }
    }
    return true;
  }

  /**
   *
   * returns options specific for the subclass connection
   * @private
   * @returns {(TSwarmConnectionSubclassSpecificOptions | void)}
   * @memberof SwarmConnection
   */
  private getSubclassSpecificOptions(): TSwarmConnectionSubclassSpecificOptions | void {
    const { options } = this;

    if (options && typeof options === 'object') {
      const { subclassOptions } = options;

      return subclassOptions ? subclassOptions : undefined;
    }
  }

  private setOptions(options: ISwarmConnectionOptions) {
    this.options = options;
  }

  private setConnectionStatusListener(
    connection: ISwarmConnectionSubclass,
    isSet = true
  ) {
    const { statusEmitter } = connection;

    statusEmitter[isSet ? 'addListener' : 'removeListener'](
      STATUS_CLASS_STATUS_CHANGE_EVENT,
      this.setStatus
    );
  }

  private unsetConnectionStatusListener(connection: ISwarmConnectionSubclass) {
    this.setConnectionStatusListener(connection, false);
  }

  private setConnectionSubClassInstance(connection: ISwarmConnectionSubclass) {
    this.connection = connection;
    this.setConnectionStatusListener(connection);
  }

  private unsetConnectionSubClassInstance(
    connection?: ISwarmConnectionSubclass
  ) {
    if (connection === this.connection) {
      this.connection = undefined;
    }
    if (connection) {
      this.unsetConnectionStatusListener(connection);
    }
  }

  private createConnectionToIPFS(): boolean | Error {
    try {
      const connectionToIPFS = new SwarmConnectionSubclassIPFS();

      this.setConnectionSubClassInstance(connectionToIPFS);
      return true;
    } catch (err) {
      console.error(err);
      return new Error(
        'Failed to create an instance of IPFS connection to swarm'
      );
    }
  }

  private createConnectionInstance(): boolean | Error {
    const { connectionType: type } = this;

    if (type === ESwarmConnectionClassSubclassType.IPFS) {
      return this.createConnectionToIPFS();
    }
    return new Error('An unknown connection subclass type provided in options');
  }

  private async startConnection(): Promise<boolean | Error> {
    const { connection, connectionType } = this;

    if (!connection || typeof connection.connect !== 'function') {
      return new Error('There is no connection');
    }

    const subclassSpecificOptions = this.getSubclassSpecificOptions();
    const result = await connection.connect(subclassSpecificOptions);

    if (result instanceof Error) {
      console.error(
        `Failed to start connection to the swarm ${connectionType}`
      );
      return result;
    }
    return result;
  }
}
