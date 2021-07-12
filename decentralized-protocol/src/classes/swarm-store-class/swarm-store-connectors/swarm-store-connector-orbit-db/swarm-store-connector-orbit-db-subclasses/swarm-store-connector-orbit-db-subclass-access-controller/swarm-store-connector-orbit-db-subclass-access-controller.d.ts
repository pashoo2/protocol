import OrbitDB from 'orbit-db';
import OrbitDBAccessController from 'orbit-db-access-controllers/src/orbitdb-access-controller';
import { ISwarmStoreConnectorOrbitDbDatabaseAccessControllerOptions } from './swarm-store-connector-orbit-db-subclass-access-controller.types';
import { IdentityProvider } from 'orbit-db-identity-provider';
import { ESwarmStoreConnector } from '../../../../swarm-store-class.const';
import { TSwarmStoreConnectorAccessConrotllerGrantAccessCallback, TSwarmStoreValueTypes } from '../../../../swarm-store-class.types';
export declare function getControllerAddressByOptions<T extends TSwarmStoreValueTypes<ESwarmStoreConnector.OrbitDB>>(options: ISwarmStoreConnectorOrbitDbDatabaseAccessControllerOptions<T> & {
    address?: string;
    name?: string;
}): string;
export declare class SwarmStoreConnectorOrbitDBSubclassAccessController<T extends TSwarmStoreValueTypes<ESwarmStoreConnector.OrbitDB>> extends OrbitDBAccessController {
    protected __options: ISwarmStoreConnectorOrbitDbDatabaseAccessControllerOptions<T>;
    static get type(): string;
    static create<T extends TSwarmStoreValueTypes<ESwarmStoreConnector.OrbitDB>>(orbitdb: OrbitDB, options?: ISwarmStoreConnectorOrbitDbDatabaseAccessControllerOptions<T> & {
        address?: string;
        name?: string;
    }): Promise<SwarmStoreConnectorOrbitDBSubclassAccessController<T>>;
    protected __isPublic: boolean;
    protected __grantAccessCallback?: TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<ESwarmStoreConnector.OrbitDB, T>;
    constructor(orbitdb: OrbitDB, __options?: ISwarmStoreConnectorOrbitDbDatabaseAccessControllerOptions<T>);
    grant(capability: any, key: string): Promise<void>;
    canAppend(entry: LogEntry<T>, identityProvider: IdentityProvider): Promise<boolean>;
    protected __validateEntryFormat(entry: LogEntry<T>): entry is LogEntry<T>;
    protected __verifyAccess(entry: LogEntry<T>): Promise<boolean>;
    protected __setOptions(options: ISwarmStoreConnectorOrbitDbDatabaseAccessControllerOptions<T>): void;
    save(): Promise<{
        address: string;
    }>;
}
//# sourceMappingURL=swarm-store-connector-orbit-db-subclass-access-controller.d.ts.map