import {
  ESwarmStoreConnector,
  ISwarmStoreConnector,
  ISwarmStoreConnectorBasic,
  ISwarmStoreDatabaseBaseOptions,
  ISwarmStoreOptionsConnectorFabric,
  ISwarmStoreProviderOptions,
  TSwarmStoreConnectorConnectionOptions,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseType,
} from '../../../../../../swarm-store-class';
import {
  TSwarmMessageInstance,
  TSwarmMessageSerialized,
  TSwarmMessageUserIdentifierSerialized,
} from '../../../../../../swarm-message';
import {
  ISwarmMessageStoreAccessControlOptions,
  ISwarmMessageStoreOptionsWithConnectorFabric,
  TSwarmMessagesStoreGrantAccessCallback,
} from '../../../../../swarm-message-store.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../../../../../swarm-message-encrypted-cache';
import { getMessageValidator } from '../../../../../swarm-message-store-utils/swarm-message-store-utils-common';
import { PromiseResolveType } from '../../../../../../../types/promise.types';
import assert from 'assert';

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
function swarmMessageStoreUtilsExtendOrbitDbDatabaseOptionsWithAccessControlOrbitDB<
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
  options: O,
  dbOptions: DBO,
  allowAccessForUsers: string[] | undefined,
  grantAccessCallback: GAC | undefined
): TSwarmStoreDatabaseOptions<ESwarmStoreConnector.OrbitDB, ItemType, DbType> &
  ISwarmStoreDatabaseBaseOptions & { provider: ESwarmStoreConnector.OrbitDB } {
  const grantAccess = getMessageValidator<P, ItemType, DbType, DBO, MSI, GAC, PromiseResolveType<ReturnType<NonNullable<MCF>>>>(
    dbOptions,
    options.messageConstructors,
    // TODO - TSwarmStoreConnectorOrbitDbAccessConrotllerGrantAccessCallback<string, P>
    grantAccessCallback || (dbOptions.grantAccess as GAC | undefined),
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
export const createSwarmMessageStoreUtilsExtenderOrbitDBDatabaseOptionsWithAccessControl = <
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
) => (dbOptions: DBO): DBO & ISwarmStoreDatabaseBaseOptions & { provider: P } => {
  const { accessControl } = options;
  let grantAccessCallback: GAC | undefined;
  let allowAccessForUsers: TSwarmMessageUserIdentifierSerialized[] | undefined;

  // validate options first
  if (accessControl) {
    const { grantAccess, allowAccessFor } = accessControl as ISwarmMessageStoreAccessControlOptions<P, ItemType, MSI, GAC>;

    if (!grantAccess) {
      throw new Error('"Grant access" callback function must be provided');
    }
    assert(
      typeof grantAccess === 'function' && grantAccess.length >= 3 && grantAccess.length <= 5,
      '"Grant access" callback must be a function which accepts a 3 arguments'
    );
    if (allowAccessFor) {
      assert(allowAccessFor instanceof Array, 'Users list for which access is uncinditionally granted for must be a function');
      allowAccessFor.forEach((userId) => assert(typeof userId === 'string', 'The user identity must be a string'));
      allowAccessForUsers = allowAccessFor;
    }
    grantAccessCallback = grantAccess;
  }
  return swarmMessageStoreUtilsExtendOrbitDbDatabaseOptionsWithAccessControlOrbitDB<
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
  >(options, dbOptions, allowAccessForUsers, grantAccessCallback) as DBO & ISwarmStoreDatabaseBaseOptions & { provider: P };
};
