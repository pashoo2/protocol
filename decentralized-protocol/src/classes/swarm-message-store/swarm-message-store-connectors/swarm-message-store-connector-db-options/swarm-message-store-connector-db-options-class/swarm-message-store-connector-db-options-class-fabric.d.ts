import { ESwarmStoreConnector } from 'classes/swarm-store-class/swarm-store-class.const';
import { TSwarmStoreValueTypes, TSwarmStoreDatabaseType, TSwarmStoreDatabaseOptions, TSwarmStoreDatabaseOptionsSerialized } from 'classes/swarm-store-class/swarm-store-class.types';
import { ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorFabricParams } from '../swarm-store-connector-db-options.types';
import { ISwarmMessageStoreDatabaseOptionsWithMetaConstructor } from '../swarm-store-connector-db-options.types';
import { ConstructorType } from '../../../../../types/helper.types';
import { ISwarmStoreDBOSerializerValidator } from '../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { IDatabaseOptionsClass } from '../../../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageConstructor, ISwarmMessageInstanceDecrypted } from '../../../../swarm-message/swarm-message-constructor.types';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
export declare function getSwarmMessageStoreDBOClass<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, MD extends ISwarmMessageInstanceDecrypted, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext, DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>, DBOS extends TSwarmStoreDatabaseOptionsSerialized, SMC extends ISwarmMessageConstructor>(params: ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorFabricParams<P, ItemType, DbType, MD, CTX, DBO, DBOS, SMC>, DBOBaseClassSerializerValidator: ConstructorType<ISwarmStoreDBOSerializerValidator<P, ItemType, DbType, DBO, DBOS>> | IDatabaseOptionsClass<P, ItemType, DbType, DBO, DBOS>): ISwarmMessageStoreDatabaseOptionsWithMetaConstructor<P, ItemType, DbType, MD, CTX, DBO, DBOS, {
    swarmMessageConstructor: SMC;
}>;
//# sourceMappingURL=swarm-message-store-connector-db-options-class-fabric.d.ts.map