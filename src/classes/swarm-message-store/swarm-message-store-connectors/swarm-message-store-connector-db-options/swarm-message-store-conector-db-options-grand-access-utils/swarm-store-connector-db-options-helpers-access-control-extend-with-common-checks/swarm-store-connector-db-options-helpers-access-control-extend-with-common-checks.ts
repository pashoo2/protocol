import assert from 'assert';
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
import { TCentralAuthorityUserIdentity } from '../../../../../central-authority-class/central-authority-class-types/central-authority-class-types-common';
import {
  ISwarmMessageInstanceEncrypted,
  ISwarmMessageInstanceDecrypted,
} from '../../../../../swarm-message/swarm-message-constructor.types';

/**
 * Extends a database options with some additional access control
 *
 * @template P
 * @template T
 * @template DbType
 * @template DBO
 * @template MSI
 * @template GAC
 * @param {DBO} dbOptions
 * @param {(string[] | undefined)} allowAccessForUsers
 * @param {(GAC | undefined)} grantAccessCallback
 * @returns {(TSwarmStoreDatabaseOptions<ESwarmStoreConnector.OrbitDB, T, DbType> &
 *   ISwarmStoreDatabaseBaseOptions & { provider: ESwarmStoreConnector.OrbitDB })}
 */
function getExtendedDBOptionsWithAccessControlOrbitDB<
  P extends ESwarmStoreConnector.OrbitDB,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  MD extends ISwarmMessageInstanceDecrypted,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MD | T>
>(
  dbOptions: DBO,
  allowAccessForUsers: string[] | undefined,
  grantAccessCallback: GAC | undefined
): TSwarmStoreDatabaseOptions<ESwarmStoreConnector.OrbitDB, T, DbType> &
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
 * @template T
 * @param {ISwarmMessageStoreOptions<ESwarmStoreConnector.OrbitDB>} options
 * @param {(ISwarmStoreConnectorOrbitDbDatabaseOptions<T> &
 *     ISwarmStoreDatabaseBaseOptions)} dbOptions
 * @param {string[]} [allowAccessForUsers]
 * @param {TSwarmStoreConnectorOrbitDbAccessConrotllerGrantAccessCallback<ESwarmStoreConnector, T>} [grantAccessCallback]
 * @returns {(TSwarmStoreDatabaseOptions<ESwarmStoreConnector.OrbitDB, T> &
 *   ISwarmStoreDatabaseBaseOptions & { provider: ESwarmStoreConnector.OrbitDB })}
 */
function swarmMessageStoreUtilsExtendOrbitDbDatabaseOptionsWithAccessControlOrbitDB<
  P extends ESwarmStoreConnector.OrbitDB,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType> & {
    grantAccess: GAC;
  },
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
  CO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, PO>,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, PO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain>,
  MD extends ISwarmMessageInstanceDecrypted,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MD | T>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MD, GAC> | undefined,
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
  dbOptions: DBO,
  messageConstructor: PromiseResolveType<ReturnType<NonNullable<MCF>>>,
  allowAccessForUsers: string[] | undefined,
  grantAccessCallback: GAC,
  swarmMessageValidatorFabric: (
    dboptions: DBO,
    messageConstructor: PromiseResolveType<ReturnType<NonNullable<MCF>>>,
    grantAccessCb: GAC,
    currentUserId: TCentralAuthorityUserIdentity
  ) => GAC
): TSwarmStoreDatabaseOptions<ESwarmStoreConnector.OrbitDB, T, DbType> &
  ISwarmStoreDatabaseBaseOptions & { provider: ESwarmStoreConnector.OrbitDB } {
  const grantAccessCallbackExtendedWithMessageValidation = swarmMessageValidatorFabric(
    dbOptions,
    messageConstructor,
    // TODO - TSwarmStoreConnectorOrbitDbAccessConrotllerGrantAccessCallback<string, P>
    grantAccessCallback,
    options.userId
  );

  grantAccessCallbackExtendedWithMessageValidation.toString =
    grantAccessCallback?.toString.bind(grantAccessCallback) || (() => '');
  return getExtendedDBOptionsWithAccessControlOrbitDB<P, T, DbType, DBO, MD, GAC>(
    dbOptions,
    allowAccessForUsers,
    // TODO
    grantAccessCallbackExtendedWithMessageValidation
  );
}

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
function swarmMessageStoreUtilsCreateSwarmMessageGrandAccessCommonAndExtendOrbitDbDatabaseOptionsWithAdditionalSwarmMessageAccessControl<
  P extends ESwarmStoreConnector.OrbitDB,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  MD extends ISwarmMessageInstanceDecrypted,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MD | T>
>(
  dbOptions: DBO,
  allowAccessForUsers: string[] | undefined,
  grantAccessCallback: GAC,
  swarmMessageValidatorFabric: (grantAccessCb: GAC) => GAC
): TSwarmStoreDatabaseOptions<ESwarmStoreConnector.OrbitDB, T, DbType> &
  ISwarmStoreDatabaseBaseOptions & { provider: ESwarmStoreConnector.OrbitDB } {
  const grantAccessCallbackExtendedWithMessageValidation = swarmMessageValidatorFabric(grantAccessCallback);

  return getExtendedDBOptionsWithAccessControlOrbitDB<P, T, DbType, DBO, MD, GAC>(
    dbOptions,
    allowAccessForUsers,
    grantAccessCallbackExtendedWithMessageValidation
  );
}

export const returnGACAndUsersWithWriteAccessForOrbitDbDatabase = <
  P extends ESwarmStoreConnector.OrbitDB,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType> & {
    grantAccess: GAC;
  },
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
  CO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, PO>,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, PO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain>,
  MSI extends TSwarmMessageInstance | T,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, Exclude<MSI, ISwarmMessageInstanceEncrypted>>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, Exclude<MSI, ISwarmMessageInstanceEncrypted>, GAC> | undefined,
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
    MSI,
    GAC,
    MCF,
    ACO
  >
>(
  swarmMessageStoreOptions: O,
  dbOptions: {
    grantAccess: DBO['grantAccess'];
    write?: string[];
  }
): {
  grantAccessCallback: GAC;
  allowAccessForUsers: TSwarmMessageUserIdentifierSerialized[] | undefined;
} => {
  const { accessControl: swarmMessageStoreOptionsAccessControl } = swarmMessageStoreOptions;
  let grantAccessCallback: GAC | undefined = swarmMessageStoreOptionsAccessControl?.grantAccess;

  if (typeof dbOptions.grantAccess === 'function') {
    grantAccessCallback = dbOptions.grantAccess;
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
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType> & {
    grantAccess: GAC;
  },
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
  swarmMessageStoreOptions: O,
  swarmMessageValidatorFabric: (
    dboptions: DBO,
    messageConstructor: PromiseResolveType<ReturnType<NonNullable<MCF>>>,
    grantAccessCb: GAC,
    currentUserId: TCentralAuthorityUserIdentity
  ) => GAC
) => (
  dbOptions: DBO,
  messageConstructor: PromiseResolveType<ReturnType<NonNullable<MCF>>>
): DBO & ISwarmStoreDatabaseBaseOptions & { provider: P } => {
  const { grantAccessCallback, allowAccessForUsers } = returnGACAndUsersWithWriteAccessForOrbitDbDatabase<
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
    ACO,
    O
  >(swarmMessageStoreOptions, dbOptions);
  return swarmMessageStoreUtilsExtendOrbitDbDatabaseOptionsWithAccessControlOrbitDB<
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
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType> & {
    grantAccess: GAC;
  },
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
  swarmMessageStoreOptions: O,
  swarmMessageValidatorFabricForGrandAccessCallbackBoundToContext: (grantAccessCb: GAC) => GAC
) => (
  dbOptions: DBO & {
    grantAccess: GAC;
  }
): DBO & ISwarmStoreDatabaseBaseOptions & { provider: P } => {
  const { grantAccessCallback, allowAccessForUsers } = returnGACAndUsersWithWriteAccessForOrbitDbDatabase<
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
    ACO,
    O
  >(swarmMessageStoreOptions, dbOptions);
  return swarmMessageStoreUtilsCreateSwarmMessageGrandAccessCommonAndExtendOrbitDbDatabaseOptionsWithAdditionalSwarmMessageAccessControl<
    P,
    T,
    DbType,
    DBO,
    MD,
    GAC
  >(dbOptions, allowAccessForUsers, grantAccessCallback, swarmMessageValidatorFabricForGrandAccessCallbackBoundToContext) as DBO &
    ISwarmStoreDatabaseBaseOptions & { provider: P };
};
