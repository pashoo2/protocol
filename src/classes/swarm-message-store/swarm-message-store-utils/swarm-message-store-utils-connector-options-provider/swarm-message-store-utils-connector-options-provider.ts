import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import { ISwarmMessageStoreOptions } from '../../swarm-message-store.types';
import { ISwarmStoreOptions } from '../../../swarm-store-class/swarm-store-class.types';

/**
 * transform options from options simplified
 * interface for the SwarmMessageStore to the
 * full options for the SwarmStore.
 *
 * @export
 * @template P
 * @param {ISwarmMessageStoreOptions<P>} options
 * @returns {ISwarmStoreOptions<P>}
 * @throws if the options can not be transformed then throws
 */
export function swarmMessageStoreUtilsConnectorOptionsProvider<
  P extends ESwarmStoreConnector
>(options: ISwarmMessageStoreOptions<P>): ISwarmStoreOptions<P> {
  // TODO
}
