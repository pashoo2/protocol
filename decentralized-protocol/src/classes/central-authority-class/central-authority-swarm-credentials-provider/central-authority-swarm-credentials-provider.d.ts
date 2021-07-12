import { CentralAuthorityIdentity } from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity';
import { TCentralAuthorityUserCryptoCredentials } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import { TCAuthProviderIdentifier, TCAUserIdentityRawTypes } from './../central-authority-class-user-identity/central-authority-class-user-identity.types';
import { ICAIdentityCredentialsStorage, ICAIdentityCredentialsStorageConntionOptions } from './../central-authority-storage-local/central-authority-storage-swarm-users-auth/central-authority-storage-swarm-users-identity-credentials/central-authority-storage-swarm-users-identity-credentials.types';
import { ICAConnectionPool } from './../central-authority-connections/central-authority-connections-pool/central-authority-connections-pool.types';
import { ICASwarmCredentialsProvider, ICASwarmCredentialsProviderOptions, ICASwarmCredentialsProviderOptionsConnections } from './central-authority-swarm-credentials-provider.types';
export declare class CASwarmCredentialsProvider implements ICASwarmCredentialsProvider {
    protected isRunning: boolean;
    protected options?: ICASwarmCredentialsProviderOptions;
    protected connectionSwarmConnectionPool?: ICAConnectionPool;
    protected connectionLocalCredentialsStorage?: ICAIdentityCredentialsStorage;
    connect: (options: ICASwarmCredentialsProviderOptions) => Promise<void | Error>;
    disconnect: () => Promise<Error | void>;
    get(identity: TCAUserIdentityRawTypes): Promise<TCentralAuthorityUserCryptoCredentials | Error | null>;
    protected validateOptions(options: ICASwarmCredentialsProviderOptions): Error | void;
    protected setOptions(options: ICASwarmCredentialsProviderOptions): Error | void;
    protected setRunningFlag(): void;
    protected unsetRunningFlag(): void;
    protected getAuthProviderIdByUserIdentity(userIdentity: CentralAuthorityIdentity): TCAuthProviderIdentifier | Error;
    protected unsetConnectionsUsed(): void;
    protected connectToTheLocalCredentialsStorage(): Promise<Error | void>;
    protected runConnections(connections: ICASwarmCredentialsProviderOptionsConnections): Promise<Error | void>;
    protected getOptionsForLocalCredentialsStorage(): ICAIdentityCredentialsStorageConntionOptions | undefined;
    protected startConnectionLocalCredentialsStorage(): Promise<Error | ICAIdentityCredentialsStorage>;
    protected disconnectFromCredentialsStorage(): Promise<Error | void>;
    protected disconnectFromSwarmConnectionsPool(): Promise<Error | void>;
    protected getUserIdentityInstance(userIdentity: TCAUserIdentityRawTypes): Error | CentralAuthorityIdentity;
    protected readCredentialsFromLocalCredentialsStorage(userIdentity: CentralAuthorityIdentity): Promise<Error | null | TCentralAuthorityUserCryptoCredentials>;
    protected readCredentialsFromTheSwarm(userIdentity: CentralAuthorityIdentity): Promise<Error | null | TCentralAuthorityUserCryptoCredentials>;
    protected setCredentialsInCredentialsStorage(credentials: TCentralAuthorityUserCryptoCredentials, isCheckPrivateKey?: boolean): Promise<void | Error>;
    protected setCredentialsInCredentialsStorageNoCheckPrivateKey(credentials: TCentralAuthorityUserCryptoCredentials): Promise<void | Error>;
}
//# sourceMappingURL=central-authority-swarm-credentials-provider.d.ts.map