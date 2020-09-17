import assert from 'assert';
import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import {
  ISwarmMessageStoreOptions,
  TSwarmMessageStoreAccessControlGrantAccessCallback,
} from '../../swarm-message-store.types';
import { TSwarmMessageSerialized } from '../../../swarm-message/swarm-message-constructor.types';
import { TSwarmMessageUserIdentifierSerialized } from '../../../swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';
import { ISwarmStoreConnectorOrbitDBConnectionOptions } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db.types';
import { ipfsUtilsConnectBasic } from '../../../../utils/ipfs-utils/ipfs-utils';
import { getMessageValidator } from '../swarm-message-store-utils-common/swarm-message-store-utils-common';
import { ISwarmStoreConnectorOrbitDBOptions } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db.types';
import { ISwarmStoreConnectorOrbitDbDatabaseOptions } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
import { TSwarmStoreValueTypes } from '../../../swarm-store-class/swarm-store-class.types';
import { TSwarmStoreConnectorOrbitDbAccessConrotllerGrantAccessCallback } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-access-controller/swarm-store-connector-orbit-db-subclass-access-controller.types';
import {
  ISwarmStoreDatabaseBaseOptions,
  TSwarmStoreDatabaseOptions,
} from '../../../swarm-store-class/swarm-store-class.types';

/**
 * Add access control options for OrbitDB provided
 * databases.
 *
 * @template T
 * @param {ISwarmMessageStoreOptions<ESwarmStoreConnector.OrbitDB>} options
 * @param {(ISwarmStoreConnectorOrbitDbDatabaseOptions<T> &
 *     ISwarmStoreDatabaseBaseOptions)} dbOptions
 * @param {string[]} [allowAccessForUsers]
 * @param {TSwarmStoreConnectorOrbitDbAccessConrotllerGrantAccessCallback<ESwarmStoreConnector, T>} [grantAccessCallback]
 * @returns {(TSwarmStoreDatabaseOptions<ESwarmStoreConnector.OrbitDB, T> &
 *   ISwarmStoreDatabaseBaseOptions & { provider: ESwarmStoreConnector.OrbitDB })}
 */
function swarmMessageStoreUtilsExtendDatabaseOptionsWithAccessControlOrbitDB<
  T extends TSwarmStoreValueTypes<ESwarmStoreConnector.OrbitDB>
>(
  options: ISwarmMessageStoreOptions<ESwarmStoreConnector.OrbitDB>,
  dbOptions: ISwarmStoreConnectorOrbitDbDatabaseOptions<T> &
    ISwarmStoreDatabaseBaseOptions,
  allowAccessForUsers?: string[],
  grantAccessCallback?: TSwarmStoreConnectorOrbitDbAccessConrotllerGrantAccessCallback<
    ESwarmStoreConnector,
    T
  >
): TSwarmStoreDatabaseOptions<ESwarmStoreConnector.OrbitDB, T> &
  ISwarmStoreDatabaseBaseOptions & { provider: ESwarmStoreConnector.OrbitDB } {
  const grantAccess = getMessageValidator(
    dbOptions,
    options.messageConstructors,
    // TODO - TSwarmStoreConnectorOrbitDbAccessConrotllerGrantAccessCallback<string, P>
    (grantAccessCallback || dbOptions.grantAccess) as any,
    options.userId
  );

  return {
    write: allowAccessForUsers,
    ...dbOptions,
    grantAccess,
    provider: ESwarmStoreConnector.OrbitDB,
  };
}

/**
 * Return a function which extends a database options with
 * access control
 *
 * @param {ISwarmMessageStoreOptions<ESwarmStoreConnector.OrbitDB>} options
 * @throw
 * @exports
 */
export const swarmMessageStoreUtilsExtendDatabaseOptionsWithAccessControl = <
  P extends ESwarmStoreConnector,
  T extends TSwarmStoreValueTypes<P>
>(
  options: ISwarmMessageStoreOptions<P>
) => (
  dbOptions: ISwarmStoreConnectorOrbitDbDatabaseOptions<T> &
    ISwarmStoreDatabaseBaseOptions
): TSwarmStoreDatabaseOptions<P, T> &
  ISwarmStoreDatabaseBaseOptions & { provider: P } => {
  const { accessControl } = options;
  let grantAccessCallback:
    | TSwarmMessageStoreAccessControlGrantAccessCallback<P>
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
  return swarmMessageStoreUtilsExtendDatabaseOptionsWithAccessControlOrbitDB<T>(
    options,
    dbOptions,
    allowAccessForUsers,
    grantAccessCallback as any
  ) as any; // TODO - on added another DB provider than the OrbitDB, any type must be removed
};

/**
 * Extends options for connector to a databases of the OrbitDB type
 *
 * @param {ISwarmMessageStoreOptions<ESwarmStoreConnector.OrbitDB>} options - options for the connector
 * @param {ReturnType<typeof swarmMessageStoreUtilsExtendDatabaseOptionsWithAccessControl>} extendWithAccessControlOptions - get access options for a database
 * @returns {(Promise<
 *   ISwarmStoreConnectorOrbitDBOptions<TSwarmMessageSerialized> & {
 *     providerConnectionOptions: ISwarmStoreConnectorOrbitDBConnectionOptions;
 *     provider: typeof ESwarmStoreConnector.OrbitDB;
 *   }
 * >)}
 */
async function swarmMessageStoreUtilsConnectorOptionsProviderForOrbitDB(
  options: ISwarmMessageStoreOptions<ESwarmStoreConnector.OrbitDB>,
  extendWithAccessControlOptions: ReturnType<
    typeof swarmMessageStoreUtilsExtendDatabaseOptionsWithAccessControl
  >
): Promise<
  ISwarmStoreConnectorOrbitDBOptions<TSwarmMessageSerialized> & {
    providerConnectionOptions: ISwarmStoreConnectorOrbitDBConnectionOptions;
    provider: typeof ESwarmStoreConnector.OrbitDB;
  }
> {
  const ipfsConnection =
    options.providerConnectionOptions && options.providerConnectionOptions.ipfs
      ? options.providerConnectionOptions.ipfs
      : await ipfsUtilsConnectBasic();
  const databases = options.databases.map(extendWithAccessControlOptions);

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
  options: ISwarmMessageStoreOptions<P>,
  extendWithAccessControlOptions: ReturnType<
    typeof swarmMessageStoreUtilsExtendDatabaseOptionsWithAccessControl
  >
): Promise<ISwarmMessageStoreOptions<P>> {
  const { provider } = options;

  switch (provider) {
    case ESwarmStoreConnector.OrbitDB:
      return swarmMessageStoreUtilsConnectorOptionsProviderForOrbitDB(
        options,
        extendWithAccessControlOptions
      ) as Promise<ISwarmMessageStoreOptions<P>>;
    default:
      throw new Error(
        `Failed to transform options cause the provider "${provider}" is unknown`
      );
  }
}
