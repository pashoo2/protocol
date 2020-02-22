import { EventEmitter } from '../basic-classes/event-emitter-class-base/event-emitter-class-base';
import {
  ISwarmStoreEvents,
  ISwarmStore,
  ISwarmStoreOptions,
} from './swarm-store-class.types';
import { ESwarmStoreProvider } from './swarm-store-class.const';
import { ISwarmStoreConnector } from './swarm-store-class.types';

/**
 * This is decentralized storage.
 * Allows to create a new database,
 * store a value, grant access,
 * validate, store a data on it.
 *
 * @export
 * @class SwarmStore
 * @extends {EventEmitter<ISwarmStoreEvents>}
 * @implements {ISwarmStore<P>}
 * @template P
 */
export class SwarmStore<P extends ESwarmStoreProvider>
  extends EventEmitter<ISwarmStoreEvents>
  implements ISwarmStore<P> {
  // open connection with all databases
  public async connect(options: ISwarmStoreOptions<P>): Promise<Error | void> {
    this.createConnectionWithStorageConnector(options);
  }

  protected createConnectionWithStorageConnector(
    options: ISwarmStoreOptions<P>
  ): ISwarmStoreConnector<P> | Error {}
}
