import { ESwarmStoreConnector, ISwarmStoreConnector, ISwarmStoreConnectorBasic, ISwarmStoreDatabaseBaseOptions, ISwarmStoreOptionsConnectorFabric, ISwarmStoreProviderOptions, TSwarmStoreConnectorConnectionOptions, TSwarmStoreDatabaseOptions } from '../../../../../swarm-store-class';
import { TSwarmMessageInstance, TSwarmMessageUserIdentifierSerialized } from '../../../../../swarm-message';
import { ISwarmMessageStoreAccessControlOptions, ISwarmMessageStoreOptionsWithConnectorFabric, TSwarmMessagesStoreGrantAccessCallback } from '../../../../types/swarm-message-store.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../../../../swarm-message-encrypted-cache';
import { PromiseResolveType } from '../../../../../../types/promise.types';
import { TCentralAuthorityUserIdentity } from '../../../../../central-authority-class/central-authority-class-types/central-authority-class-types-common';
import { ISwarmMessageInstanceEncrypted, ISwarmMessageInstanceDecrypted } from '../../../../../swarm-message/swarm-message-constructor.types';
export declare const returnGACAndUsersWithWriteAccessForOrbitDbDatabase: <P extends ESwarmStoreConnector, T extends string, DbType extends import("../../../../../swarm-store-class").ESwarmStoreConnectorOrbitDbDatabaseType, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType> & {
    grantAccess: GAC;
}, ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>, PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>, CO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, PO>, ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, PO>, CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain>, MSI extends TSwarmMessageInstance | T, GAC extends TSwarmMessagesStoreGrantAccessCallback<P, Exclude<MSI, ISwarmMessageInstanceEncrypted>, Record<string, unknown>>, MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric, ACO extends ISwarmMessageStoreAccessControlOptions<P, T, Exclude<MSI, ISwarmMessageInstanceEncrypted>, GAC>, O extends ISwarmMessageStoreOptionsWithConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, MSI, GAC, MCF, ACO>>(swarmMessageStoreOptions: O, dbOptions: {
    grantAccess: DBO["grantAccess"];
    write?: string[];
}) => {
    grantAccessCallback: GAC;
    allowAccessForUsers: TSwarmMessageUserIdentifierSerialized[] | undefined;
};
export declare const createSwarmMessageStoreUtilsExtenderOrbitDBDatabaseOptionsWithAccessControl: <P extends ESwarmStoreConnector, T extends string, DbType extends import("../../../../../swarm-store-class").ESwarmStoreConnectorOrbitDbDatabaseType, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType> & {
    grantAccess: GAC;
}, ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>, PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>, CO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, PO>, ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, PO>, CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain>, MD extends ISwarmMessageInstanceDecrypted, GAC extends TSwarmMessagesStoreGrantAccessCallback<P, T | MD, Record<string, unknown>>, MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric, ACO extends ISwarmMessageStoreAccessControlOptions<P, T, T | MD, GAC>, O extends ISwarmMessageStoreOptionsWithConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, T | MD, GAC, MCF, ACO>>(swarmMessageStoreOptions: O, swarmMessageValidatorFabric: (dboptions: DBO, messageConstructor: PromiseResolveType<ReturnType<NonNullable<MCF>>>, grantAccessCb: GAC, currentUserId: TCentralAuthorityUserIdentity) => GAC) => (dbOptions: DBO, messageConstructor: PromiseResolveType<ReturnType<NonNullable<MCF>>>) => DBO & ISwarmStoreDatabaseBaseOptions & {
    provider: P;
};
export declare const createSwarmMessageStoreUtilsExtenderOrbitDBDatabaseOptionsWithAccessControlAndGrandAccessCallbackBoundToContext: <P extends ESwarmStoreConnector, T extends string, DbType extends import("../../../../../swarm-store-class").ESwarmStoreConnectorOrbitDbDatabaseType, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType> & {
    grantAccess: GAC;
}, ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>, PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>, CO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, PO>, ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, PO>, CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain>, MD extends ISwarmMessageInstanceDecrypted, GAC extends TSwarmMessagesStoreGrantAccessCallback<P, T | MD, Record<string, unknown>>, MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric, ACO extends ISwarmMessageStoreAccessControlOptions<P, T, T | MD, GAC>, O extends ISwarmMessageStoreOptionsWithConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, T | MD, GAC, MCF, ACO>>(swarmMessageStoreOptions: O, swarmMessageValidatorFabricForGrandAccessCallbackBoundToContext: (grantAccessCb: GAC) => GAC) => (dbOptions: DBO & {
    grantAccess: GAC;
}) => DBO & ISwarmStoreDatabaseBaseOptions & {
    provider: P;
};
//# sourceMappingURL=swarm-store-connector-db-options-helpers-access-control-extend-with-common-checks.d.ts.map