import { ESwarmStoreConnector } from '../../../../swarm-store-class/swarm-store-class.const';
import {
  TSwarmMessageInstance,
  TSwarmMessageSerialized,
  ISwarmMessageConstructor,
} from '../../../../swarm-message/swarm-message-constructor.types';
import {
  ISwarmStoreConnectorOrbitDBConnectionOptions,
  ISwarmStoreConnectorOrbitDBOptions,
} from '../../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db.types';
import { ipfsUtilsConnectBasic } from '../../../../../utils/ipfs-utils/ipfs-utils';
import {
  ISwarmStoreConnector,
  ISwarmStoreConnectorBasic,
  ISwarmStoreOptionsConnectorFabric,
  ISwarmStoreProviderOptions,
  TSwarmStoreConnectorConnectionOptions,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseType,
} from '../../../../swarm-store-class/swarm-store-class.types';
import {
  ISwarmMessageStoreAccessControlOptions,
  ISwarmMessageStoreOptionsWithConnectorFabric,
  TSwarmMessagesStoreGrantAccessCallback,
} from '../../../types/swarm-message-store.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../../../swarm-message-encrypted-cache/swarm-messgae-encrypted-cache.types';
import { ISwarmMessageStoreDatabaseOptionsExtender } from '../../../types/swarm-message-store-utils.types';

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
async function extendSwarmMessageStoreConnectionOptionsForOrbitDBConnector<
  P extends ESwarmStoreConnector.OrbitDB,
  ItemType extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>,
  CO extends ISwarmStoreProviderOptions<P, ItemType, DbType, DBO, ConnectorBasic, PO>,
  ConnectorMain extends ISwarmStoreConnector<P, ItemType, DbType, DBO, ConnectorBasic, PO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, ItemType, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain>,
  MSI extends TSwarmMessageInstance | ItemType,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MSI>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, ItemType, MSI, GAC> | undefined,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<
    P,
    ItemType,
    DbType,
    DBO,
    ConnectorBasic,
    PO,
    CO,
    ConnectorMain,
    CFO,
    MSI,
    GAC,
    MCF,
    ACO
  >
>(
  options: O
): Promise<
  ISwarmStoreConnectorOrbitDBOptions<ItemType, DbType> & {
    providerConnectionOptions: ISwarmStoreConnectorOrbitDBConnectionOptions<ItemType, DbType, DBO, ConnectorBasic>;
    provider: typeof ESwarmStoreConnector.OrbitDB;
  }
> {
  const ipfsConnection =
    options.providerConnectionOptions && options.providerConnectionOptions.ipfs
      ? options.providerConnectionOptions.ipfs
      : await ipfsUtilsConnectBasic();

  return {
    ...options,
    providerConnectionOptions: {
      ...options.providerConnectionOptions,
      ipfs: ipfsConnection,
    },
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
export async function extendSwarmMessageStoreConnectionOptionsWithAccessControlAndConnectorSpecificOptions<
  P extends ESwarmStoreConnector.OrbitDB,
  ItemType extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>,
  CO extends ISwarmStoreProviderOptions<P, ItemType, DbType, DBO, ConnectorBasic, PO>,
  ConnectorMain extends ISwarmStoreConnector<P, ItemType, DbType, DBO, ConnectorBasic, PO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, ItemType, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain>,
  MSI extends TSwarmMessageInstance | ItemType,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MSI>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, ItemType, MSI, GAC> | undefined,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<
    P,
    ItemType,
    DbType,
    DBO,
    ConnectorBasic,
    PO,
    CO,
    ConnectorMain,
    CFO,
    MSI,
    GAC,
    MCF,
    ACO
  >
>(options: O): Promise<O> {
  const { provider } = options;

  switch (provider) {
    case ESwarmStoreConnector.OrbitDB:
      return (await extendSwarmMessageStoreConnectionOptionsForOrbitDBConnector<
        P,
        ItemType,
        DbType,
        DBO,
        ConnectorBasic,
        PO,
        CO,
        ConnectorMain,
        CFO,
        MSI,
        GAC,
        MCF,
        ACO,
        O
      >(options)) as O;
    default:
      throw new Error(`Failed to transform options cause the provider "${provider}" is unknown`);
  }
}
