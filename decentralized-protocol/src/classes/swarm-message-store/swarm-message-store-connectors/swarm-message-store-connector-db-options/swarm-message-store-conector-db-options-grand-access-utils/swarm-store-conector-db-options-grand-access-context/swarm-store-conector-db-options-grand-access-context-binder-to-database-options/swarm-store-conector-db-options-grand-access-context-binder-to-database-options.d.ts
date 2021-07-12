import { ESwarmStoreConnector } from 'classes/swarm-store-class/swarm-store-class.const';
import { TSwarmStoreValueTypes, TSwarmStoreDatabaseType, TSwarmStoreDatabaseOptions, ISwarmStoreConnectorDatabaseAccessControlleGrantCallback } from 'classes/swarm-store-class/swarm-store-class.types';
import { ISwarmMessageInstanceDecrypted } from 'classes/swarm-message/swarm-message-constructor.types';
import { ISwarmMessageStoreConnectorDatabaseAccessControlleGrantCallbackBound } from '../../../swarm-store-connector-db-options.types';
import { ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder } from '../../../swarm-store-connector-db-options.types';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { TSwarmStoreConnectorAccessConrotllerGrantAccessCallback } from '../../../../../../swarm-store-class/swarm-store-class.types';
export declare function swarmStoreConectorDbOptionsGrandAccessContextBinderToDatabaseOptions<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, MD extends ISwarmMessageInstanceDecrypted, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext, DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>>(dbo: DBO & {
    grantAccess?: TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, ItemType, MD>;
}, grandAccessCallbackBinder: ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder<P, ItemType, MD, CTX>): DBO extends Required<ISwarmStoreConnectorDatabaseAccessControlleGrantCallback<P, ItemType, MD>> ? DBO & ISwarmMessageStoreConnectorDatabaseAccessControlleGrantCallbackBound<P, ItemType, MD, CTX> : DBO;
//# sourceMappingURL=swarm-store-conector-db-options-grand-access-context-binder-to-database-options.d.ts.map