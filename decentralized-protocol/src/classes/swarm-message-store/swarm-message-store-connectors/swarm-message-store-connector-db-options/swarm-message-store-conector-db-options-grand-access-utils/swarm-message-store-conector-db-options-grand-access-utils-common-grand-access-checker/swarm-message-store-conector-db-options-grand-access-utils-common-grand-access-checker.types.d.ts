import { TCentralAuthorityUserIdentity } from '../../../../../central-authority-class/central-authority-class-types/central-authority-class-types-common';
import { ISwarmMessageConstructor, TSwarmMessageSerialized, TSwarmMessageInstance } from '../../../../../swarm-message/swarm-message-constructor.types';
import { ESwarmStoreConnector } from '../../../../../swarm-store-class/swarm-store-class.const';
import { ISwarmMessageStoreAccessControlGrantAccessCallback } from '../../../../types/swarm-message-store.types';
import { TSwarmMessageUserIdentifierSerialized } from '../../../../../central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity-validators/central-authority-common-validator-user-identifier/central-authority-common-validator-user-identifier.types';
export interface ISwarmMessageGrantValidatorContext<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, I extends TSwarmMessageInstance, CB extends ISwarmMessageStoreAccessControlGrantAccessCallback<P, T> | ISwarmMessageStoreAccessControlGrantAccessCallback<P, I> | undefined> {
    dbName: string;
    messageConstructor: ISwarmMessageConstructor;
    isPublic: boolean | undefined;
    isUserCanWrite: boolean;
    currentUserId: TCentralAuthorityUserIdentity;
    grantAccessCb?: CB;
}
export interface IGetMessageValidatorUnboundFabricReturnedSwarmMessageGrantValidatorFunctionContext<SMC extends ISwarmMessageConstructor> {
    readonly dbName: string;
    readonly isPublicDb: boolean;
    readonly usersIdsWithWriteAccess: TSwarmMessageUserIdentifierSerialized[];
    readonly swarmMessageConstructor: SMC;
    readonly currentUserId: TSwarmMessageUserIdentifierSerialized;
}
//# sourceMappingURL=swarm-message-store-conector-db-options-grand-access-utils-common-grand-access-checker.types.d.ts.map