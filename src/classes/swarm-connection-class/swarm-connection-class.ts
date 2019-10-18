import {
  ISwarmConnection,
  ISwarmConnectionSubclass,
  ESwarmConnectionClassStatus,
  ISwarmConnectionOptions,
  ESwarmConnectionClassSubclassType,
  ISwarmConnectionSubclassSpecificOptions,
} from './swarm-connection-class.types';
import { SwarmConnectionSubclassIPFS } from './swarm-connection-class-subclasses/swarm-connection-class-subclass-ipfs/swarm-connection-class-subclass-ipfs';
import { getStatusClass } from 'classes/basic-classes/status-class-base/status-class-base';
import undefined from 'firebase/empty-import';

export class SwarmConnection
  extends getStatusClass<typeof ESwarmConnectionClassStatus>({
    errorStatus: ESwarmConnectionClassStatus.ERROR,
    instanceName: 'SwarmConnection',
  })
  implements ISwarmConnection {
  private connection?: ISwarmConnectionSubclass;

  private options?: ISwarmConnectionOptions;

  public get connectionType(): ESwarmConnectionClassSubclassType | void {
    const { options } = this;

    if (options) {
      const { type } = options;

      return type;
    }
  }

  /**
   *
   * returns options specific for the subclass connection
   * @private
   * @returns {(ISwarmConnectionSubclassSpecificOptions | void)}
   * @memberof SwarmConnection
   */
  private getSubclassSpecificOptions(): ISwarmConnectionSubclassSpecificOptions | void {
    const { options } = this;

    if (options && typeof options === 'object') {
      const { subclassOptions } = options;

      return subclassOptions ? subclassOptions : undefined;
    }
  }

  private setOptions(options: ISwarmConnectionOptions) {
    this.options = options;
  }

  private setConnectionSUBCLASSInstance(connection: ISwarmConnectionSubclass) {
    this.connection = connection;
  }

  private createConnectionToIPFS(): boolean | Error {
    try {
      const connectionToIPFS = new SwarmConnectionSubclassIPFS();

      this.setConnectionSUBCLASSInstance(connectionToIPFS);
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
