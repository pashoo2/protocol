import assert from 'assert';
import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import { ISwarmMessageStoreOptions } from '../../swarm-message-store.types';
import { TSwarmMessageSerialized, TSwarmMessageInstance } from '../../../swarm-message/swarm-message-constructor.types';
import { TSwarmMessageUserIdentifierSerialized } from '../../../swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';
import { ISwarmStoreConnectorOrbitDBConnectionOptions } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db.types';
import { ipfsUtilsConnectBasic } from '../../../../utils/ipfs-utils/ipfs-utils';
import { getMessageValidator } from '../swarm-message-store-utils-common/swarm-message-store-utils-common';
import { ISwarmStoreConnectorOrbitDBOptions } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db.types';
import { ISwarmStoreConnectorOrbitDbDatabaseOptions } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
import {
  TSwarmStoreDatabaseType,
  TSwarmStoreConnectorConnectionOptions,
  ISwarmStoreProviderOptions,
  ISwarmStoreOptionsConnectorFabric,
  ISwarmStoreConnector,
  ISwarmStoreDatabasesOptions,
  ISwarmStoreDatabasesCommonStatusList,
} from '../../../swarm-store-class/swarm-store-class.types';
import { ISwarmStoreConnectorBasic } from '../../../swarm-store-class/swarm-store-class.types';
import {
  ISwarmMessageStoreOptionsWithConnectorFabric,
  ISwarmMessageStoreAccessControlOptions,
  TSwarmMessagesStoreGrantAccessCallback,
} from '../../swarm-message-store.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../../swarm-messgae-encrypted-cache/swarm-messgae-encrypted-cache.types';
import { PromiseResolveType } from '../../../../types/helper.types';
import { ISwarmStoreDatabaseBaseOptions, TSwarmStoreDatabaseOptions } from '../../../swarm-store-class/swarm-store-class.types';

/**
 * Add access control options for OrbitDB provided
 * databases.
 *
 * @template ItemType
 * @param {ISwarmMessageStoreOptions<ESwarmStoreConnector.OrbitDB>} options
 * @param {(ISwarmStoreConnectorOrbitDbDatabaseOptions<ItemType> &
 *     ISwarmStoreDatabaseBaseOptions)} dbOptions
 * @param {string[]} [allowAccessForUsers]
 * @param {TSwarmStoreConnectorOrbitDbAccessConrotllerGrantAccessCallback<ESwarmStoreConnector, ItemType>} [grantAccessCallback]
 * @returns {(TSwarmStoreDatabaseOptions<ESwarmStoreConnector.OrbitDB, ItemType> &
 *   ISwarmStoreDatabaseBaseOptions & { provider: ESwarmStoreConnector.OrbitDB })}
 */
function swarmMessageStoreUtilsExtendDatabaseOptionsWithAccessControlOrbitDB<
  P extends ESwarmStoreConnector.OrbitDB,
  ItemType extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, ConnectorBasic>,
  CO extends ISwarmStoreProviderOptions<P, ItemType, DbType, ConnectorBasic, PO>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType>,
  ConnectorMain extends ISwarmStoreConnector<P, ItemType, DbType, ConnectorBasic, PO, DBO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, ItemType, DbType, ConnectorBasic, PO, CO, DBO, ConnectorMain>,
  MSI extends TSwarmMessageInstance | ItemType,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MSI>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, ItemType, MSI, GAC> | undefined,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<P, ItemType, DbType, ConnectorBasic, PO, CO, DBO, ConnectorMain, CFO, MSI, GAC, MCF, ACO>
>(
  options: O,
  dbOptions: DBO,
  allowAccessForUsers: string[] | undefined,
  grantAccessCallback: GAC
): TSwarmStoreDatabaseOptions<ESwarmStoreConnector.OrbitDB, ItemType> & ISwarmStoreDatabaseBaseOptions & { provider: ESwarmStoreConnector.OrbitDB } {
  const grantAccess = getMessageValidator<P, ItemType, DBO, MSI, GAC, PromiseResolveType<ReturnType<NonNullable<MCF>>>>(
    dbOptions,
    options.messageConstructors,
    // TODO - TSwarmStoreConnectorOrbitDbAccessConrotllerGrantAccessCallback<string, P>
    (grantAccessCallback || dbOptions.grantAccess) as GAC,
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
  P extends ESwarmStoreConnector.OrbitDB,
  ItemType extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, ConnectorBasic>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType>,
  CO extends ISwarmStoreProviderOptions<P, ItemType, DbType, ConnectorBasic, PO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, ItemType, DbType, ConnectorBasic, PO, CO, DBO, ConnectorMain>,
  ConnectorMain extends ISwarmStoreConnector<P, ItemType, DbType, ConnectorBasic, PO, DBO>,
  MSI extends TSwarmMessageInstance | ItemType,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MSI>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, ItemType, MSI, GAC> | undefined,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<P, ItemType, DbType, ConnectorBasic, PO, CO, DBO, ConnectorMain, CFO, MSI, GAC, MCF, ACO>
>(
  options: O
) => (dbOptions: DBO): DBO & ISwarmStoreDatabaseBaseOptions & { provider: P } => {
  const { accessControl } = options;
  let grantAccessCallback: GAC = undefined as GAC;
  let allowAccessForUsers: TSwarmMessageUserIdentifierSerialized[] | undefined;

  // validate options first
  if (accessControl) {
    const { grantAccess, allowAccessFor } = accessControl as ISwarmMessageStoreAccessControlOptions<P, ItemType, MSI, GAC>;

    if (!grantAccess) {
      throw new Error('"Grant access" callback function must be provided');
    }
    assert(typeof grantAccess === 'function' && grantAccess.length === 3, '"Grant access" callback must be a function which accepts a 3 arguments');
    if (allowAccessFor) {
      assert(allowAccessFor instanceof Array, 'Users list for which access is uncinditionally granted for must be a function');
      allowAccessFor.forEach((userId) => assert(typeof userId === 'string', 'The user identity must be a string'));
      allowAccessForUsers = allowAccessFor;
    }
    grantAccessCallback = grantAccess;
  }
  return swarmMessageStoreUtilsExtendDatabaseOptionsWithAccessControlOrbitDB<
    P,
    ItemType,
    DbType,
    ConnectorBasic,
    PO,
    CO,
    DBO,
    ConnectorMain,
    CFO,
    MSI,
    GAC,
    MCF,
    ACO,
    O
  >(options, dbOptions, allowAccessForUsers, grantAccessCallback) as DBO & ISwarmStoreDatabaseBaseOptions & { provider: P };
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
async function swarmMessageStoreUtilsConnectorOptionsProviderForOrbitDB<
  P extends ESwarmStoreConnector.OrbitDB,
  ItemType extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, ConnectorBasic>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType>,
  CO extends ISwarmStoreProviderOptions<P, ItemType, DbType, ConnectorBasic, PO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, ItemType, DbType, ConnectorBasic, PO, CO, DBO, ConnectorMain>,
  ConnectorMain extends ISwarmStoreConnector<P, ItemType, DbType, ConnectorBasic, PO, DBO>,
  MSI extends TSwarmMessageInstance | ItemType,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MSI>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, ItemType, MSI, GAC> | undefined,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<P, ItemType, DbType, ConnectorBasic, PO, CO, DBO, ConnectorMain, CFO, MSI, GAC, MCF, ACO>
>(
  options: O,
  extendWithAccessControlOptions: (dbOptions: DBO) => DBO
): Promise<
  ISwarmStoreConnectorOrbitDBOptions<ItemType> & {
    providerConnectionOptions: ISwarmStoreConnectorOrbitDBConnectionOptions<ItemType, DbType, ConnectorBasic>;
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
  ItemType extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, ConnectorBasic>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType>,
  CO extends ISwarmStoreProviderOptions<P, ItemType, DbType, ConnectorBasic, PO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, ItemType, DbType, ConnectorBasic, PO, CO, DBO, ConnectorMain>,
  ConnectorMain extends ISwarmStoreConnector<P, ItemType, DbType, ConnectorBasic, PO, DBO>,
  MSI extends TSwarmMessageInstance | ItemType,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MSI>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, ItemType, MSI, GAC> | undefined,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<P, ItemType, DbType, ConnectorBasic, PO, CO, DBO, ConnectorMain, CFO, MSI, GAC, MCF, ACO>
>(options: O, extendWithAccessControlOptions: (dbOptions: DBO) => DBO): Promise<O> {
  const { provider } = options;

  switch (provider) {
    case ESwarmStoreConnector.OrbitDB:
      return swarmMessageStoreUtilsConnectorOptionsProviderForOrbitDB<
        P,
        ItemType,
        DbType,
        ConnectorBasic,
        PO,
        DBO,
        CO,
        CFO,
        ConnectorMain,
        MSI,
        GAC,
        MCF,
        ACO,
        O
      >(options, extendWithAccessControlOptions) as Promise<O>;
    default:
      throw new Error(`Failed to transform options cause the provider "${provider}" is unknown`);
  }
}
