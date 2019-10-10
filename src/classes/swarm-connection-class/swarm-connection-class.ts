import {
  ISwarmConnection,
  ISwarmConnectionSubclass,
  ESwarmConnectionClassStatus,
  ISwarmConnectionOptions,
  ESwarmConnectionClassSubclassType,
} from './swarm-connection-class.types';
import { SwarmConnectionSubclassIPFS } from './swarm-connection-class-subclasses/swarm-connection-class-subclass-ipfs/swarm-connection-class-subclass-ipfs';
import { getStatusClass } from 'classes/basic-classes/status-class-base/status-class-base';

export class SwarmConnection
  extends getStatusClass<typeof ESwarmConnectionClassStatus>({
    errorStatus: ESwarmConnectionClassStatus.ERROR,
    instanceName: 'SwarmConnection',
  })
  implements ISwarmConnection {
  connection?: ISwarmConnectionSubclass;

  options?: ISwarmConnectionOptions;

  private setOptions(options: ISwarmConnectionOptions) {
    this.options = options;
  }

  private setConnectionSublassInstance(connection: ISwarmConnectionSubclass) {
    this.connection = connection;
  }

  private createConnectionToIPFS(): boolean | Error {
    try {
      const connectionToIPFS = new SwarmConnectionSubclassIPFS();

      this.setConnectionSublassInstance(connectionToIPFS);
      return true;
    } catch (err) {
      console.error(err);
      return new Error(
        'Failed to create an instance of IPFS connection to swarm'
      );
    }
  }

  private createConnectionInstance(): boolean | Error {
    const { options } = this;

    if (!options) {
      return new Error(
        'There is no options provided for the Swarm connections'
      );
    }

    const { type } = options;

    if (type === ESwarmConnectionClassSubclassType.IPFS) {
      return this.createConnectionToIPFS();
    }
    return new Error('An unknown connection subclass type provided in options');
  }

  private async startConnection(): Promise<boolean | Error> {
    const { connection } = this;

    if (!connection || typeof connection.connect !== 'function') {
      return new Error('There is no connection');
    }
    const result = await connection.connect();

    return result;
  }

  public async connect(
    options: ISwarmConnectionOptions
  ): Promise<boolean | Error> {
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
}
