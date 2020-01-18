import { TCAUserIdentityRawTypes } from './../central-authority-class-user-identity/central-authority-class-user-identity.types';
import { ICAIdentityCredentialsStorage } from './../central-authority-storage-local/central-authority-storage-swarm-users-auth/central-authority-storage-swarm-users-identity-credentials/central-authority-storage-swarm-users-identity-credentials.types';
import { ICAConnectionPool } from './../central-authority-connections/central-authority-connections-pool/central-authority-connections-pool.types';
import { TCentralAuthorityUserCryptoCredentials } from './../central-authority-class-types/central-authority-class-types-crypto-credentials';

/**
 * connections used to get the user's credentials
 *
 * @export
 * @interface ICASwarmCredentialsProviderOptionsConnections
 */
export interface ICASwarmCredentialsProviderOptionsConnections {
  swarmConnectionPool: ICAConnectionPool;
  localCredentialsStorage?: ICAIdentityCredentialsStorage;
}

/**
 * options provided to initialize all connections
 * to get read users credentials
 *
 * @export
 * @interface ICASwarmCredentialsProviderOptions
 */
export interface ICASwarmCredentialsProviderOptions {
  connections: ICASwarmCredentialsProviderOptionsConnections;
  // a database name where to store and read credentials
  storageDb?: string;
}

/**
 * This class used to get credentials of the users by
 * connection to the swarm, and store it in the local
 * cache or from the local cache
 *
 * @export
 * @interface ICASwarmCredentialsProvider
 */
export interface ICASwarmCredentialsProvider {
  // initialize connection to the local cache
  connect(options: ICASwarmCredentialsProviderOptions): Promise<Error | void>;
  // disconnect from the local cache
  disconnect(): Promise<Error | void>;
  // get credentials for the user with identity
  get(
    identity: TCAUserIdentityRawTypes
  ): Promise<TCentralAuthorityUserCryptoCredentials | Error | null>;
}
