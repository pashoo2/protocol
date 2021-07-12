import { TCAUserIdentityRawTypes } from './../../../central-authority-class-user-identity/central-authority-class-user-identity.types';
import { TCentralAuthorityUserIdentity, TCACryptoKeyPairs, TCentralAuthorityUserCryptoCredentials } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
export interface ICAIdentityCredentialsDescription {
    identity: TCentralAuthorityUserIdentity;
    credentials: TCACryptoKeyPairs;
}
export interface ICAIdentityCredentialsDescriptionStored {
    id: string;
    identity: TCentralAuthorityUserIdentity;
    credentials: TCACryptoKeyPairs;
}
export interface ICAIdentityCredentialsStorageConntionOptions {
    storageName?: string;
}
export interface ICAIdentityCredentialsStorage {
    isActive: boolean;
    connect(options?: ICAIdentityCredentialsStorageConntionOptions): Promise<boolean | Error>;
    disconnect(): Promise<boolean | Error>;
    getCredentials(identity: TCAUserIdentityRawTypes): Promise<TCentralAuthorityUserCryptoCredentials | Error | null>;
    setCredentials(identity: TCAUserIdentityRawTypes, cryptoCredentials: TCACryptoKeyPairs): Promise<boolean | Error>;
    setCredentials(cryptoCredentials: TCAUserIdentityRawTypes): Promise<boolean | Error>;
    setCredentials(cryptoCredentialsExportedAsString: string): Promise<boolean | Error>;
    setCredentialsNoCheckPrivateKey(cryptoCredentials: TCAUserIdentityRawTypes | string): Promise<boolean | Error>;
    setCredentialsNoCheckPrivateKey(cryptoCredentials: TCAUserIdentityRawTypes | string): Promise<boolean | Error>;
}
//# sourceMappingURL=central-authority-storage-swarm-users-identity-credentials.types.d.ts.map