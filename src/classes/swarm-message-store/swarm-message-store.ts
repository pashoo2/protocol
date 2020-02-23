import assert from 'assert';
import { SwarmStore } from '../swarm-store-class/swarm-store-class';
import { ESwarmStoreConnector } from '../swarm-store-class/swarm-store-class.const';
import { swarmMessageStoreUtilsConnectorOptionsProvider } from './swarm-message-store-utils/swarm-message-store-utils-connector-options-provider/swarm-message-store-utils-connector-options-provider';
import {
  TSwarmMessageStoreConnectReturnType,
  ISwarmMessageStoreOptions,
} from './swarm-message-store.types';
import {
  ISwarmMessageStoreEvents,
  ISwarmMessageStore,
} from './swarm-message-store.types';

export class SwarmMessageStore<P extends ESwarmStoreConnector>
  extends SwarmStore<P, ISwarmMessageStoreEvents>
  implements ISwarmMessageStore<P> {
  protected connectorType: P | undefined;

  public async connect(
    options: ISwarmMessageStoreOptions<P>
  ): TSwarmMessageStoreConnectReturnType<P> {
    this.setOptions(options);

    const optionsSwarmStore = swarmMessageStoreUtilsConnectorOptionsProvider(
      options
    );
    const connectionResult = await super.connect(optionsSwarmStore);

    if (connectionResult instanceof Error) {
      throw connectionResult;
    }
    this.setListeners();
  }

  public async addMessage(
    dbName: string,
    message: ISwarmMessageStoreOptions<P>
  ): Promise<void> {
    //TODO
  }

  protected validateOptions(options: ISwarmMessageStoreOptions<P>): void {
    super.validateOptions(options);

    const { grantAcess, allowedAccessFor } = options;

    assert(
      !grantAcess ||
        (typeof grantAcess === 'function' && grantAcess.length === 3),
      '"Grant access" callback must be a function which accepts a 3 arguments'
    );
    if (allowedAccessFor) {
      assert(
        allowedAccessFor instanceof Array,
        'Users list for which access is uncinditionally granted for must be a function'
      );
      allowedAccessFor.forEach((userId) =>
        assert(typeof userId === 'string', 'The user identity must be a string')
      );
    }
  }

  protected setOptions(options: ISwarmMessageStoreOptions<P>): void {
    this.validateOptions(options);
    this.connectorType = options.provider;
  }

  protected setListeners() {
    //this.addListener(, listener)
  }
}
