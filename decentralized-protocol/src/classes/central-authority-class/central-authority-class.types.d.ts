import { TCentralAuthorityUserCryptoCredentials } from './central-authority-class-types/central-authority-class-types-crypto-credentials';
import { TCAUserIdentityRawTypes } from './central-authority-class-user-identity/central-authority-class-user-identity.types';
import { ICentralAuthorityUserProfile, TCentralAuthorityUserIdentity } from './central-authority-class-types/central-authority-class-types-common';
import { TCAAuthProviderIdentity, ICAConnectionSignUpCredentials } from './central-authority-connections/central-authority-connections.types';
import { IAuthProviderConnectionConfiguration } from 'classes/central-authority-class/central-authority-connections/central-authority-connections-pool/central-authority-connections-pool.types';
import { ISecretStoreCredentialsSession } from 'classes/secret-storage-class';
export interface ICentralAuthorityAuthProvidersOptions {
    providersConfigurations: IAuthProviderConnectionConfiguration[];
}
export declare type ICentralAuthorityUserCredentials = ICAConnectionSignUpCredentials & Partial<ISecretStoreCredentialsSession>;
export interface ICentralAuthorityUser {
    authProviderUrl: TCAAuthProviderIdentity;
    credentials: ICentralAuthorityUserCredentials;
    profile?: Partial<ICentralAuthorityUserProfile>;
}
export interface ICentralAuthorityOptions {
    authProvidersPool: ICentralAuthorityAuthProvidersOptions;
    user: ICentralAuthorityUser;
}
export interface ICentralAuthority {
    readonly isRunning: boolean;
    connect(options: ICentralAuthorityOptions): Promise<Error | void>;
    disconnect(): Promise<Error | void>;
    getSwarmUserCredentials(identity: TCAUserIdentityRawTypes): Promise<TCentralAuthorityUserCryptoCredentials | Error | null>;
    getSwarmUserEncryptionPubKey(identity: TCAUserIdentityRawTypes): Promise<Error | null | CryptoKey>;
    getSwarmUserSignPubKey(identity: TCAUserIdentityRawTypes): Promise<Error | null | CryptoKey>;
    getUserIdentity(): Error | TCentralAuthorityUserIdentity;
    getUserEncryptionKeyPair(): Error | CryptoKeyPair;
    getUserDataSignKeyPair(): Error | CryptoKeyPair;
    getCAUserProfile(): Promise<ICentralAuthorityUserProfile | undefined>;
    exportCryptoCredentials(): Promise<string | Error>;
    importCryptoCredentials?(cryptoCredentials: string): Promise<TCentralAuthorityUserCryptoCredentials | Error>;
}
//# sourceMappingURL=central-authority-class.types.d.ts.map