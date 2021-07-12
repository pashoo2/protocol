import { ISwarmMessageConstructor } from '../../../../../../../swarm-message/swarm-message-constructor.types';
import { TSwarmMessageUserIdentifierSerialized } from '../../../../../../../central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity-validators/central-authority-common-validator-user-identifier/central-authority-common-validator-user-identifier.types';
export interface ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabricParams<SMC extends ISwarmMessageConstructor> {
    readonly dbName: string;
    readonly isPublicDb: boolean;
    readonly usersIdsWithWriteAccess: TSwarmMessageUserIdentifierSerialized[];
    readonly swarmMessageConstructor: SMC;
}
//# sourceMappingURL=swarm-message-store-conector-db-options-grand-access-context-class.types.d.ts.map