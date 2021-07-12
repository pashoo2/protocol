import { ISwarmMessageDatabaseConstructors } from '../../../../types/swarm-message-store.types';
import { TCentralAuthorityUserIdentity } from '../../../../../central-authority-class/central-authority-class-types/central-authority-class-types-common';
import { ESwarmStoreConnector } from '../../../../../swarm-store-class/swarm-store-class.const';
import { TSwarmStoreConnectorAccessConrotllerGrantAccessCallback } from '../../../../../swarm-store-class/swarm-store-class.types';
import { TSwarmMessageInstance, ISwarmMessageInstanceDecrypted } from '../../../../../swarm-message/swarm-message-constructor.types';
import { TSwarmStoreDatabaseOptions } from '../../../../../swarm-store-class/swarm-store-class.types';
import { TSwarmMessagesStoreGrantAccessCallback } from '../../../../types/swarm-message-store.types';
import { ISwarmMessageConstructor, ISwarmMessageInstanceEncrypted } from '../../../../../swarm-message/swarm-message-constructor.types';
export declare const getMessageConstructorForDatabase: <SMC extends ISwarmMessageConstructor>(dbName: string, messageConstructors: ISwarmMessageDatabaseConstructors<SMC>) => SMC;
export declare const getMessageValidator: <P extends ESwarmStoreConnector, T extends string, DbType extends import("../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const").ESwarmStoreConnectorOrbitDbDatabaseType, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>, MSI extends TSwarmMessageInstance | T, GAC extends TSwarmMessagesStoreGrantAccessCallback<P, Exclude<MSI, ISwarmMessageInstanceEncrypted>, Record<string, unknown>>, SMC extends ISwarmMessageConstructor>(dbOptions: DBO & {
    grantAccess: GAC;
}, messageConstructor: SMC, grantAccessCb: GAC, currentUserId: TCentralAuthorityUserIdentity) => TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, T, Exclude<Exclude<MSI, ISwarmMessageInstanceEncrypted>, T>>;
export declare const getMessageValidatorForGrandAccessCallbackBound: <P extends ESwarmStoreConnector, T extends string, MD extends ISwarmMessageInstanceDecrypted, GAC extends TSwarmMessagesStoreGrantAccessCallback<P, string, Record<string, unknown>>, SMC extends ISwarmMessageConstructor>(grantAccessCb: GAC) => GAC extends undefined ? TSwarmMessagesStoreGrantAccessCallback<P, T | MD, Record<string, unknown>> : GAC;
//# sourceMappingURL=swarm-message-store-conector-db-options-grand-access-utils-common-grand-access-checker.d.ts.map