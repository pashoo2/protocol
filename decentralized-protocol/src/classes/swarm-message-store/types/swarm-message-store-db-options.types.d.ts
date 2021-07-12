import { ISwarmMessageConstructor } from '../../swarm-message';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { TSwarmMessageUserIdentifierSerialized } from '../../central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity-validators/central-authority-common-validator-user-identifier/central-authority-common-validator-user-identifier.types';
import { ConstructorType } from '../../../types/helper.types';
import { ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabricParams } from '../swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-message-store-conector-db-options-grand-access-utils/swarm-store-conector-db-options-grand-access-context/swarm-store-conector-db-options-grand-access-context-classes/swarm-message-store-conector-db-options-grand-access-context-class/swarm-message-store-conector-db-options-grand-access-context-class.types';
export interface ISwarmMessageStoreDbOptionsGrandAccessCallbackContext<SMC extends ISwarmMessageConstructor> extends ISwarmStoreDBOGrandAccessCallbackBaseContext {
    readonly dbName: string;
    readonly isPublicDb: boolean;
    readonly usersIdsWithWriteAccess: TSwarmMessageUserIdentifierSerialized[];
    readonly swarmMessageConstructor: SMC;
}
export interface ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabric<SMC extends ISwarmMessageConstructor, BC extends ConstructorType<ISwarmStoreDBOGrandAccessCallbackBaseContext>> {
    (BaseContext: BC, params: ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabricParams<SMC>): BC & ConstructorType<ISwarmMessageStoreDbOptionsGrandAccessCallbackContext<SMC>>;
}
//# sourceMappingURL=swarm-message-store-db-options.types.d.ts.map