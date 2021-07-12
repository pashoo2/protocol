import { ISwarmMessageInstanceDecrypted } from '../../classes/swarm-message/swarm-message-constructor.types';
import { TSwarmStoreDatabaseEntityKey } from '../../classes/swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnector } from '../../classes/swarm-store-class/swarm-store-class.const';
import { TSwarmMessageUserIdentifierSerialized } from '../../classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity-validators/central-authority-common-validator-user-identifier/central-authority-common-validator-user-identifier.types';
export interface ISwarmMessagesDatabaseMessageDescription<P extends ESwarmStoreConnector.OrbitDB> {
    id: TSwarmStoreDatabaseEntityKey<P>;
    key?: TSwarmStoreDatabaseEntityKey<P>;
    message: ISwarmMessageInstanceDecrypted;
}
export interface ISwarmMessagesDatabaseDeleteMessageDescription<P extends ESwarmStoreConnector.OrbitDB> {
    id: TSwarmStoreDatabaseEntityKey<P>;
    idDeleted: TSwarmStoreDatabaseEntityKey<P> | undefined;
    key: TSwarmStoreDatabaseEntityKey<P> | undefined;
    userId: TSwarmMessageUserIdentifierSerialized;
}
//# sourceMappingURL=swarm-messages-database-component.types.d.ts.map