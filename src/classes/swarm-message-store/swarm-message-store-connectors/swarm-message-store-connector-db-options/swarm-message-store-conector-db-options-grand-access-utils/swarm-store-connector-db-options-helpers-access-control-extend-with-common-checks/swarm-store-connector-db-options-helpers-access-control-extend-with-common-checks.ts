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
import { isDbOptionsWithGrandAccess } from '../swarm-store-conector-db-options-grand-access-context/swarm-store-conector-db-options-grand-access-context-binder-to-database-options/swarm-store-conector-db-options-grand-access-context-binder-to-database-options';
import {
  ISwarmMessageInstanceEncrypted,
  ISwarmMessageInstanceDecrypted,
} from '../../../../../swarm-message/swarm-message-constructor.types';

/**
 * Extends a database options with some additional access control
 *
 * @template P
 * @template ItemType
 * @template DbType
 * @template DBO
 * @template MSI
 * @template GAC
 * @param {DBO} dbOptions
 * @param {(string[] | undefined)} allowAccessForUsers
 * @param {(GAC | undefined)} grantAccessCallback
 * @returns {(TSwarmStoreDatabaseOptions<ESwarmStoreConnector.OrbitDB, ItemType, DbType> &
 *   ISwarmStoreDatabaseBaseOptions & { provider: ESwarmStoreConnector.OrbitDB })}
 */
function getExtendedDBOptionsWithAccessControlOrbitDB<
  P extends ESwarmStoreConnector.OrbitDB,
  ItemType extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  I extends ISwarmMessageInstanceDecrypted,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, I | ItemType>
>(
  dbOptions: DBO,
  allowAccessForUsers: string[] | undefined,
  grantAccessCallback: GAC | undefined
): TSwarmStoreDatabaseOptions<ESwarmStoreConnector.OrbitDB, ItemType, DbType> &
  ISwarmStoreDatabaseBaseOptions & { provider: ESwarmStoreConnector.OrbitDB } {
  return {
    write: allowAccessForUsers,
    provider: ESwarmStoreConnector.OrbitDB,
    ...dbOptions,
    grantAccess: grantAccessCallback,
  };
}

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
  I extends ISwarmMessageInstanceDecrypted,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, I | ItemType>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, ItemType, I, GAC> | undefined,
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
    I | ItemType,
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
  ) => TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, ItemType, I>
): TSwarmStoreDatabaseOptions<ESwarmStoreConnector.OrbitDB, ItemType, DbType> &
  ISwarmStoreDatabaseBaseOptions & { provider: ESwarmStoreConnector.OrbitDB } {
  const grantAccessCallbackExtendedWithMessageValidation = swarmMessageValidatorFabric(
    dbOptions,
    messageConstructor,
    // TODO - TSwarmStoreConnectorOrbitDbAccessConrotllerGrantAccessCallback<string, P>
    grantAccessCallback,
    options.userId
  );

  return getExtendedDBOptionsWithAccessControlOrbitDB<P, ItemType, DbType, DBO, I, GAC>(
    dbOptions,
    allowAccessForUsers,
    grantAccessCallbackExtendedWithMessageValidation as GAC
  );
}

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
function swarmMessageStoreUtilsCreateSwarmMessageGrandAccessCommonAndExtendOrbitDbDatabaseOptionsWithAdditionalSwarmMessageAccessControl<
  P extends ESwarmStoreConnector.OrbitDB,
  ItemType extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  I extends ISwarmMessageInstanceDecrypted,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, I | ItemType>
>(
  dbOptions: DBO,
  allowAccessForUsers: string[] | undefined,
  grantAccessCallback: GAC,
  swarmMessageValidatorFabric: (grantAccessCb: GAC) => TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, ItemType, I>
): TSwarmStoreDatabaseOptions<ESwarmStoreConnector.OrbitDB, ItemType, DbType> &
  ISwarmStoreDatabaseBaseOptions & { provider: ESwarmStoreConnector.OrbitDB } {
  const grantAccessCallbackExtendedWithMessageValidation = swarmMessageValidatorFabric(grantAccessCallback);

  return getExtendedDBOptionsWithAccessControlOrbitDB<P, ItemType, DbType, DBO, I, GAC>(
    dbOptions,
    allowAccessForUsers,
    grantAccessCallbackExtendedWithMessageValidation as GAC
  );
}

export const returnGACAndUsersWithWriteAccessForOrbitDbDatabase = <
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
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, Exclude<MSI, ISwarmMessageInstanceEncrypted>>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, ItemType, Exclude<MSI, ISwarmMessageInstanceEncrypted>, GAC> | undefined,
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
  dbOptions: DBO
): {
  grantAccessCallback: GAC;
  allowAccessForUsers: TSwarmMessageUserIdentifierSerialized[] | undefined;
} => {
  const { accessControl: swarmMessageStoreOptionsAccessControl } = swarmMessageStoreOptions;
  let grantAccessCallback: GAC | undefined = swarmMessageStoreOptionsAccessControl?.grantAccess;

  if (
    isDbOptionsWithGrandAccess<P, ItemType, DbType, Exclude<Exclude<MSI, ISwarmMessageInstanceEncrypted>, ItemType>, DBO>(
      dbOptions
    )
  ) {
    grantAccessCallback = dbOptions.grantAccess as GAC;
  }
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
  return {
    grantAccessCallback,
    allowAccessForUsers,
  };
};

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
  I extends ISwarmMessageInstanceDecrypted,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, I | ItemType>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, ItemType, I | ItemType, GAC> | undefined,
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
    I | ItemType,
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
  ) => TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, ItemType, I>
) => (
  dbOptions: DBO,
  messageConstructor: PromiseResolveType<ReturnType<NonNullable<MCF>>>
): DBO & ISwarmStoreDatabaseBaseOptions & { provider: P } => {
  const { grantAccessCallback, allowAccessForUsers } = returnGACAndUsersWithWriteAccessForOrbitDbDatabase<
    P,
    ItemType,
    DbType,
    DBO,
    ConnectorBasic,
    PO,
    CO,
    ConnectorMain,
    CFO,
    I | ItemType,
    GAC,
    MCF,
    ACO,
    O
  >(swarmMessageStoreOptions, dbOptions);
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
    I,
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

/**
 * Return a function which extends a database options with
 * access control
 *
 * @param {ISwarmMessageStoreOptions<ESwarmStoreConnector.OrbitDB>} swarmMessageStoreOptions
 * @throw
 * @exports
 */
export const createSwarmMessageStoreUtilsExtenderOrbitDBDatabaseOptionsWithAccessControlAndGrandAccessCallbackBoundToContext = <
  P extends ESwarmStoreConnector.OrbitDB,
  ItemType extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>,
  CO extends ISwarmStoreProviderOptions<P, ItemType, DbType, DBO, ConnectorBasic, PO>,
  ConnectorMain extends ISwarmStoreConnector<P, ItemType, DbType, DBO, ConnectorBasic, PO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, ItemType, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain>,
  I extends ISwarmMessageInstanceDecrypted,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, I | ItemType>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, ItemType, I | ItemType, GAC> | undefined,
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
    I | ItemType,
    GAC,
    MCF,
    ACO
  >
>(
  swarmMessageStoreOptions: O,
  swarmMessageValidatorFabricForGrandAccessCallbackBoundToContext: (
    grantAccessCb: GAC
  ) => TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, ItemType, I>
) => (dbOptions: DBO): DBO & ISwarmStoreDatabaseBaseOptions & { provider: P } => {
  const { grantAccessCallback, allowAccessForUsers } = returnGACAndUsersWithWriteAccessForOrbitDbDatabase<
    P,
    ItemType,
    DbType,
    DBO,
    ConnectorBasic,
    PO,
    CO,
    ConnectorMain,
    CFO,
    I | ItemType,
    GAC,
    MCF,
    ACO,
    O
  >(swarmMessageStoreOptions, dbOptions);
  return swarmMessageStoreUtilsCreateSwarmMessageGrandAccessCommonAndExtendOrbitDbDatabaseOptionsWithAdditionalSwarmMessageAccessControl<
    P,
    ItemType,
    DbType,
    DBO,
    I,
    GAC
  >(dbOptions, allowAccessForUsers, grantAccessCallback, swarmMessageValidatorFabricForGrandAccessCallbackBoundToContext) as DBO &
    ISwarmStoreDatabaseBaseOptions & { provider: P };
};
