import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import { ISwarmMessageStoreOptions } from '../../swarm-message-store.types';
import { ISwarmStoreOptions } from '../../../swarm-store-class/swarm-store-class.types';

function swarmMessageStoreUtilsConnectorOptionsProviderForOrbitDB(
  options: ISwarmMessageStoreOptions<ESwarmStoreConnector.OrbitDB>
): ISwarmMessageStoreOptions<ESwarmStoreConnector.OrbitDB> {
  const { accessControl } = options;

  if (accessControl) {
    const { grantAcess, allowAccessFor } = accessControl;

    // TODO - convert for ISwarmStoreConnectorOrbitDbAccessConrotllerOrbitDBStandardOptions
    return options;
  }
  return options;
}

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
  const { provider } = options;

  switch (provider) {
    case ESwarmStoreConnector.OrbitDB:
      return swarmMessageStoreUtilsConnectorOptionsProviderForOrbitDB(
        options
      ) as ISwarmMessageStoreOptions<P>;
    default:
      throw new Error(
        `Failed to transform options cause the provider "${provider}" is unknown`
      );
  }
}
