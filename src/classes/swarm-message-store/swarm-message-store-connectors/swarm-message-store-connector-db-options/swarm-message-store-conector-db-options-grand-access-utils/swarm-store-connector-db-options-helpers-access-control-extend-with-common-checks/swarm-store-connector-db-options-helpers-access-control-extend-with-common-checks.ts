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
} from '../../../../../swarm-store-class';
import {
  TSwarmMessageInstance,
  TSwarmMessageSerialized,
  TSwarmMessageUserIdentifierSerialized,
} from '../../../../../swarm-message';
import {
  ISwarmMessageStoreAccessControlOptions,
  ISwarmMessageStoreOptionsWithConnectorFabric,
  TSwarmMessagesStoreGrantAccessCallback,
} from '../../../../types/swarm-message-store.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../../../../swarm-message-encrypted-cache';
import { PromiseResolveType } from '../../../../../../types/promise.types';
import assert from 'assert';
import { TCentralAuthorityUserIdentity } from '../../../../../central-authority-class/central-authority-class-types/central-authority-class-types-common';
import { TSwarmStoreConnectorAccessConrotllerGrantAccessCallback } from '../../../../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageDatabaseConstructors } from '../../../../types/swarm-message-store.types';

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
  messageConstructor: PromiseResolveType<ReturnType<NonNullable<MCF>>>,
  allowAccessForUsers: string[] | undefined,
  grantAccessCallback: GAC | undefined,
  swarmMessageValidatorFabric: (
    dboptions: DBO,
    messageConstructor: PromiseResolveType<ReturnType<NonNullable<MCF>>>,
    grantAccessCb: GAC | undefined,
    currentUserId: TCentralAuthorityUserIdentity
  ) => TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, ItemType, MSI>
): TSwarmStoreDatabaseOptions<ESwarmStoreConnector.OrbitDB, ItemType, DbType> &
  ISwarmStoreDatabaseBaseOptions & { provider: ESwarmStoreConnector.OrbitDB } {
  const grantAccessCallbackToUse = grantAccessCallback || (dbOptions.grantAccess as GAC | undefined);
  const grantAccess = swarmMessageValidatorFabric(
    dbOptions,
    messageConstructor,
    // TODO - TSwarmStoreConnectorOrbitDbAccessConrotllerGrantAccessCallback<string, P>
    grantAccessCallbackToUse,
    options.userId
  );

  if (grantAccessCallbackToUse) {
    grantAccess.toString = () => {
      return grantAccessCallbackToUse.toString();
    };
  }
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
 * @param {ISwarmMessageStoreOptions<ESwarmStoreConnector.OrbitDB>} swarmMessageStoreOptions
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
  swarmMessageStoreOptions: O,
  swarmMessageValidatorFabric: (
    dboptions: DBO,
    messageConstructor: PromiseResolveType<ReturnType<NonNullable<MCF>>>,
    grantAccessCb: GAC | undefined,
    currentUserId: TCentralAuthorityUserIdentity
  ) => TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, ItemType, MSI>
) => (
  dbOptions: DBO,
  messageConstructor: PromiseResolveType<ReturnType<NonNullable<MCF>>>
): DBO & ISwarmStoreDatabaseBaseOptions & { provider: P } => {
  const { accessControl: swarmMessageStoreOptionsAccessControl } = swarmMessageStoreOptions;
  const grantAccessCallback: GAC | undefined = (dbOptions.grantAccess ?? swarmMessageStoreOptionsAccessControl?.grantAccess) as
    | GAC
    | undefined;
  const allowAccessForUsers: TSwarmMessageUserIdentifierSerialized[] | undefined =
    dbOptions.write ?? swarmMessageStoreOptionsAccessControl?.allowAccessFor;

  if (!grantAccessCallback) {
    throw new Error('"Grant access" callback function must be provided');
  }
  if (grantAccessCallback.length >= 3 && grantAccessCallback.length <= 5) {
    console.warn('"Grant access" callback must be a function which accepts a 3 arguments');
  }
  if (allowAccessForUsers) {
    assert(allowAccessForUsers instanceof Array, 'Users list for which access is uncinditionally granted for must be a function');
    allowAccessForUsers.forEach((userId) => assert(typeof userId === 'string', 'The user identity must be a string'));
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
  >(
    swarmMessageStoreOptions,
    dbOptions,
    messageConstructor,
    allowAccessForUsers,
    grantAccessCallback,
    swarmMessageValidatorFabric
  ) as DBO & ISwarmStoreDatabaseBaseOptions & { provider: P };
};
