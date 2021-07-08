import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import {
  TSwarmMessageInstance,
  TSwarmMessageSerialized,
  ISwarmMessageInstanceDecrypted,
} from '../../../swarm-message/swarm-message-constructor.types';
import {
  ISwarmStoreConnectorOrbitDBConnectionOptions,
  ISwarmStoreConnectorOrbitDBOptions,
} from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db.types';
import { ipfsUtilsConnectBasic } from '../../../../utils/ipfs-utils/ipfs-utils';
import {
  ISwarmStoreConnector,
  ISwarmStoreConnectorBasic,
  ISwarmStoreOptionsConnectorFabric,
  ISwarmStoreProviderOptions,
  TSwarmStoreConnectorConnectionOptions,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseType,
} from '../../../swarm-store-class/swarm-store-class.types';
import {
  ISwarmMessageStoreAccessControlOptions,
  ISwarmMessageStoreOptionsWithConnectorFabric,
  TSwarmMessagesStoreGrantAccessCallback,
} from '../../types/swarm-message-store.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../../swarm-message-encrypted-cache/swarm-message-encrypted-cache.types';

/**
 * Extends options for connector to a databases of the OrbitDB type
 *
 * @param {ISwarmMessageStoreOptions<ESwarmStoreConnector.OrbitDB>} options - options for the connector
 * @param {ReturnType<typeof createSwarmMessageStoreUtilsExtenderDatabaseOptionsWithAccessControl>} extendWithAccessControlOptions - get access options for a database
 * @returns {(Promise<
 *   ISwarmStoreConnectorOrbitDBOptions<TSwarmMessageSerialized> & {
 *     providerConnectionOptions: ISwarmStoreConnectorOrbitDBConnectionOptions;
 *     provider: typeof ESwarmStoreConnector.OrbitDB;
 *   }
 * >)}
 */
async function swarmMessageStoreUtilsConnectorOptionsProviderForOrbitDB<
  P extends ESwarmStoreConnector.OrbitDB,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
  CO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, PO>,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, PO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain>,
  MD extends ISwarmMessageInstanceDecrypted,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MD | T>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MD | T, GAC> | undefined,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    PO,
    CO,
    ConnectorMain,
    CFO,
    MD | T,
    GAC,
    MCF,
    ACO
  >
>(
  options: O,
  extendWithAccessControlOptions: (dbOptions: DBO) => DBO
): Promise<
  ISwarmStoreConnectorOrbitDBOptions<T, DbType> & {
    providerConnectionOptions: ISwarmStoreConnectorOrbitDBConnectionOptions<T, DbType, DBO, ConnectorBasic>;
    provider: typeof ESwarmStoreConnector.OrbitDB;
  }
> {
  const ipfsConnection =
    options.providerConnectionOptions && options.providerConnectionOptions.ipfs
      ? options.providerConnectionOptions.ipfs
      : await ipfsUtilsConnectBasic();
  const databases = (options.databases as DBO[]).map(extendWithAccessControlOptions);

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
  P extends ESwarmStoreConnector.OrbitDB,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
  CO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, PO>,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, PO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain>,
  MD extends ISwarmMessageInstanceDecrypted,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MD | T>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MD | T, GAC> | undefined,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    PO,
    CO,
    ConnectorMain,
    CFO,
    MD | T,
    GAC,
    MCF,
    ACO
  >
>(options: O, extendWithAccessControlOptions: (dbOptions: DBO) => DBO): Promise<O> {
  const { provider } = options;

  switch (provider) {
    case ESwarmStoreConnector.OrbitDB:
      return (await swarmMessageStoreUtilsConnectorOptionsProviderForOrbitDB<
        P,
        T,
        DbType,
        DBO,
        ConnectorBasic,
        PO,
        CO,
        ConnectorMain,
        CFO,
        MD,
        GAC,
        MCF,
        ACO,
        O
      >(options, extendWithAccessControlOptions)) as O;
    default:
      throw new Error(`Failed to transform options cause the provider "${provider}" is unknown`);
  }
}
