import { TCentralAuthorityUserCryptoCredentials, TCentralAuthorityUserIdentity } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import { ISecretStoreCredentials, ISecretStoreCredentialsSession } from 'classes/secret-storage-class/secret-storage-class.types';
export declare type TCAStorageCurrentUserCredentials = ISecretStoreCredentials | ISecretStoreCredentialsSession;
export interface ICAStorageCurrentUserCredentialsOptions {
    credentials: TCAStorageCurrentUserCredentials;
}
export interface ICAStorageCurrentUserCredentials {
    connect(options: ICAStorageCurrentUserCredentialsOptions): Promise<Error | void>;
    disconnect(): Promise<Error | void>;
    set(userCryptoCredentials: TCentralAuthorityUserCryptoCredentials): Promise<Error | void>;
    unset(userId: TCentralAuthorityUserIdentity): Promise<Error | void>;
    get(userId: TCentralAuthorityUserIdentity): Promise<Error | TCentralAuthorityUserCryptoCredentials | void>;
    getByAuthProvider(authProviderUrl: string): Promise<Error | TCentralAuthorityUserCryptoCredentials | void>;
}
//# sourceMappingURL=central-authority-storage-current-user-credentials.types.d.ts.map