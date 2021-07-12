import { TCAUserIdentityRawTypes } from './../../../central-authority-class-user-identity/central-authority-class-user-identity.types';
import { OpenStorage } from './../../../../open-storage/open-storage';
import { ICAIdentityCredentialsStorage, ICAIdentityCredentialsStorageConntionOptions } from './central-authority-storage-swarm-users-identity-credentials.types';
import { TCentralAuthorityUserIdentity, TCACryptoKeyPairs, TCentralAuthorityUserCryptoCredentials } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
declare const CentralAuthorityIdentityCredentialsStorage_base: {
    new (): {
        status?: string;
        errorOccurred?: Error;
        statusEmitter: import("../../../../basic-classes/event-emitter-class-base").EventEmitter<{
            status: {
                NEW: string;
                CONNECTING: string;
                CONNECTED: string;
                CONNECTION_FAILED: string;
                ERROR: string;
                PENDING: string;
                DISCONNECTED: string;
            };
        }>;
        clearError(): void;
        clearStatus(): void;
        clearState(): void;
        setStatus: (status: string) => () => void;
        setErrorStatus: (err: string | Error) => Error;
    };
    error(err: string | Error): Error;
};
export declare class CentralAuthorityIdentityCredentialsStorage extends CentralAuthorityIdentityCredentialsStorage_base implements ICAIdentityCredentialsStorage {
    get isActive(): boolean;
    protected storageConnection?: OpenStorage;
    protected storageName?: string;
    connect(options?: ICAIdentityCredentialsStorageConntionOptions): Promise<boolean | Error>;
    getCredentials(identity: TCentralAuthorityUserIdentity): Promise<TCentralAuthorityUserCryptoCredentials | Error | null>;
    setCredentials(...args: any[]): Promise<boolean | Error>;
    setCredentialsNoCheckPrivateKey(cryptoCredentials: TCAUserIdentityRawTypes | string): Promise<boolean | Error>;
    disconnect(): Promise<Error | boolean>;
    protected getKeyNameWithPrefix(key: string): string;
    protected setStorageName(postfix?: string): void;
    protected setDefaultOptions(): void;
    protected setOptions(options?: ICAIdentityCredentialsStorageConntionOptions): void | Error;
    protected createConnectionToStorage(): OpenStorage | Error;
    protected getStorageKeyByCAIdentity(identity: TCAUserIdentityRawTypes): string | Error;
    protected getCredentialsRaw(identityKey: string): Promise<string | Error | undefined>;
    protected setCredentialsByIdentity: (identity: TCAUserIdentityRawTypes, cryptoKeyPairs: TCACryptoKeyPairs, checkPrivateKey?: boolean) => Promise<boolean | Error>;
    protected setCredentialsByCACryptoCredentials(caCryptoCredentials: TCentralAuthorityUserCryptoCredentials, checkPrivateKey?: boolean): Promise<boolean | Error>;
    protected setCredentialsByCACryptoCredentialsExportedToString(caCryptoCredentialsExportedToString: string, checkPrivateKey?: boolean): Promise<boolean | Error>;
    protected getCredentialsCached(identity: TCAUserIdentityRawTypes): Promise<TCentralAuthorityUserCryptoCredentials | Error | null>;
}
export {};
//# sourceMappingURL=central-authority-storage-swarm-users-identity-credentials.d.ts.map