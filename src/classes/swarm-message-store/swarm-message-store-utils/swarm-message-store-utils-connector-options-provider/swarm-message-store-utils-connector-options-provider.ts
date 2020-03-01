import assert from 'assert';
import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import {
  ISwarmMessageStoreOptions,
  TSwarmMessageStoreAccessControlGrantAccessCallback,
} from '../../swarm-message-store.types';
import { TSwarmMessageSeriazlized } from '../../../swarm-message/swarm-message-constructor.types';
import { TSwarmMessageUserIdentifierSerialized } from '../../../swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';
import { ISwarmStoreConnectorOrbitDBConnectionOptions } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db.types';
import { ipfsUtilsConnectBasic } from '../../../../utils/ipfs-utils/ipfs-utils';
import { getMessageValidator } from '../swarm-message-store-utils-common/swarm-message-store-utils-common';
import { ISwarmStoreConnectorOrbitDBOptions } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db.types';
import { TSwarmStoreConnectorOrbitDbAccessConrotllerGrantAccessCallback } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-access-controller/swarm-store-connector-orbit-db-subclass-access-controller.types';

async function swarmMessageStoreUtilsConnectorOptionsProviderForOrbitDB(
  options: ISwarmMessageStoreOptions<ESwarmStoreConnector.OrbitDB>
): Promise<
  ISwarmStoreConnectorOrbitDBOptions<TSwarmMessageSeriazlized> & {
    providerConnectionOptions: ISwarmStoreConnectorOrbitDBConnectionOptions;
    provider: typeof ESwarmStoreConnector.OrbitDB;
  }
> {
  const { accessControl } = options;
  let grantAccessCallback:
    | TSwarmMessageStoreAccessControlGrantAccessCallback
    | undefined;
  let allowAccessForUsers: TSwarmMessageUserIdentifierSerialized[] | undefined;

  // validate options first
  if (accessControl) {
    const { grantAccess, allowAccessFor } = accessControl;

    if (!grantAccess) {
      throw new Error('"Grant access" callback function must be provided');
    }
    assert(
      typeof grantAccess === 'function' && grantAccess.length === 3,
      '"Grant access" callback must be a function which accepts a 3 arguments'
    );
    if (allowAccessFor) {
      assert(
        allowAccessFor instanceof Array,
        'Users list for which access is uncinditionally granted for must be a function'
      );
      allowAccessFor.forEach((userId) =>
        assert(typeof userId === 'string', 'The user identity must be a string')
      );
      allowAccessForUsers = allowAccessFor;
    }
    grantAccessCallback = grantAccess;
  }

  const ipfsConnection =
    options.providerConnectionOptions && options.providerConnectionOptions.ipfs
      ? options.providerConnectionOptions.ipfs
      : await ipfsUtilsConnectBasic();
  const databases = options.databases.map((dbOptions) => {
    const grantAccess =
      (dbOptions.grantAccess as TSwarmStoreConnectorOrbitDbAccessConrotllerGrantAccessCallback<
        TSwarmMessageSeriazlized
      >) ||
      getMessageValidator(
        dbOptions,
        options.messageConstructors,
        grantAccessCallback,
        options.userId
      );

    return {
      ...dbOptions,
      provider: ESwarmStoreConnector.OrbitDB,
      grantAccess,
      write: allowAccessForUsers,
    };
  });

  return {
    ...options,
    providerConnectionOptions: {
      ...options.providerConnectionOptions,
      ipfs: ipfsConnection,
    },
    databases,
  };
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
export async function swarmMessageStoreUtilsConnectorOptionsProvider<
  P extends ESwarmStoreConnector
>(
  options: ISwarmMessageStoreOptions<P>
): Promise<ISwarmMessageStoreOptions<P>> {
  const { provider } = options;

  switch (provider) {
    case ESwarmStoreConnector.OrbitDB:
      return swarmMessageStoreUtilsConnectorOptionsProviderForOrbitDB(
        options
      ) as Promise<ISwarmMessageStoreOptions<P>>;
    default:
      throw new Error(
        `Failed to transform options cause the provider "${provider}" is unknown`
      );
  }
}
