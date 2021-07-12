import { TCAUserIdentityRawTypes } from './../central-authority-class-user-identity/central-authority-class-user-identity.types';
import { ICAIdentityCredentialsStorage } from './../central-authority-storage-local/central-authority-storage-swarm-users-auth/central-authority-storage-swarm-users-identity-credentials/central-authority-storage-swarm-users-identity-credentials.types';
import { ICAConnectionPool } from './../central-authority-connections/central-authority-connections-pool/central-authority-connections-pool.types';
import { TCentralAuthorityUserCryptoCredentials } from './../central-authority-class-types/central-authority-class-types-crypto-credentials';
export interface ICASwarmCredentialsProviderOptionsConnections {
    swarmConnectionPool: ICAConnectionPool;
    localCredentialsStorage?: ICAIdentityCredentialsStorage;
}
export interface ICASwarmCredentialsProviderOptions {
    connections: ICASwarmCredentialsProviderOptionsConnections;
    storageDb?: string;
}
export interface ICASwarmCredentialsProvider {
    connect(options: ICASwarmCredentialsProviderOptions): Promise<Error | void>;
    disconnect(): Promise<Error | void>;
    get(identity: TCAUserIdentityRawTypes): Promise<TCentralAuthorityUserCryptoCredentials | Error | null>;
}
//# sourceMappingURL=central-authority-swarm-credentials-provider.types.d.ts.map