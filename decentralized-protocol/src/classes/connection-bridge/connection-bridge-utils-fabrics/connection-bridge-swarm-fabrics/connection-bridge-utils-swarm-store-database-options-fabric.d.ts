import { TSwarmStoreValueTypes, TSwarmStoreDatabaseType, TSwarmStoreDatabaseOptions, TSwarmStoreDatabaseOptionsSerialized } from '../../../swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import { ISwarmMessageConstructor, ISwarmMessageInstanceDecrypted } from '../../../swarm-message/swarm-message-constructor.types';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { ISwarmMessageStoreDatabaseOptionsWithMetaConstructor } from '../../../swarm-message-store/swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-store-connector-db-options.types';
import { ConstructorType } from '../../../../types/helper.types';
import { ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorFabricParams } from '../../../swarm-message-store/swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-store-connector-db-options.types';
import { ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabric } from '../../../swarm-message-store/types/swarm-message-store-db-options.types';
import { ISwarmMessageStoreConnectorDbOptionsClassFabric } from '../../types/connection-bridge-swarm-fabrics.types';
import { ISerializer } from '../../../../types/serialization.types';
import { IDatabaseOptionsClass } from '../../../swarm-store-class/swarm-store-class.types';
import { ISwarmStoreDBOSerializerValidator } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
export declare function getSwarmMessageStoreConnectorDBOClass<P extends ESwarmStoreConnector, T extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, MD extends ISwarmMessageInstanceDecrypted, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>, DBOS extends TSwarmStoreDatabaseOptionsSerialized, SMC extends ISwarmMessageConstructor, CTXC extends ConstructorType<CTX>, SMSDBOGACF extends ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabric<SMC, CTXC>>(ContextBaseClass: CTXC, swarmMessageStoreDBOGrandAccessCallbackContextFabric: SMSDBOGACF, DBOBaseClassSerializerValidator: ConstructorType<ISwarmStoreDBOSerializerValidator<P, T, DbType, DBO, DBOS>> | IDatabaseOptionsClass<P, T, DbType, DBO, DBOS>, additionalParams: Omit<ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorFabricParams<P, T, DbType, MD, CTX, DBO, DBOS, SMC>, 'grandAccessCallbackContextFabric'>): ISwarmMessageStoreDatabaseOptionsWithMetaConstructor<P, T, DbType, MD, CTX, DBO, DBOS, {
    swarmMessageConstructor: SMC;
}>;
export declare function getSwarmMessageStoreConnectorDBOClassFabric<P extends ESwarmStoreConnector, T extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, MD extends ISwarmMessageInstanceDecrypted, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>, DBOS extends TSwarmStoreDatabaseOptionsSerialized, SMC extends ISwarmMessageConstructor, CTXC extends ConstructorType<CTX>, SMSDBOGACF extends ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabric<SMC, CTXC>, DBOCF extends ISwarmMessageStoreConnectorDbOptionsClassFabric<P, T, DbType, MD, CTX, DBO, DBOS, SMC, CTXC, SMSDBOGACF>, SRLZR extends ISerializer>(serializer: SRLZR): DBOCF;
//# sourceMappingURL=connection-bridge-utils-swarm-store-database-options-fabric.d.ts.map