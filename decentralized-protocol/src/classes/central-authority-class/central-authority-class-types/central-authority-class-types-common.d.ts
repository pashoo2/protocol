import { IUserDescription, TUserIdentity } from 'types/users.types';
import { IHttpRequestOptions } from 'classes/basic-classes/http-request-class-base';
import { CA_AUTH_CREDENTIALS_USER_PASSWORD_PROP_NAME, CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME, CA_AUTH_CREDENTIALS_USER_SECRET_LOGIN_PROP_NAME } from '../central-authority-class-const/central-authority-class-const-auth-credentials';
import { TCACryptoKeyPairs } from './central-authority-class-types-crypto-keys';
import { TCentralAuthorityUserCryptoCredentials, TCentralAuthorityCredentialsStorageAuthCredentials } from './central-authority-class-types-crypto-credentials';
import { ISensitiveDataSessionStorage } from 'classes/sensitive-data-session-storage/sensitive-data-session-storage.types';
export declare type TCentralAuthorityUserIdentity = string;
export declare type TCentralAuthorityUserLogin = string;
export declare type TCentralAuthorityUserPassword = string;
export interface ICentralAuthorityUserAuthCredentials {
    login: TCentralAuthorityUserLogin;
    password?: TCentralAuthorityUserPassword;
    session?: ISensitiveDataSessionStorage;
}
export declare type TCentralAuthorityUserAuthCredentialsWithPwd = Required<Pick<ICentralAuthorityUserAuthCredentials, 'login' | 'password'>>;
export declare type TCentralAuthorityAuthCredentials = {
    [CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME]: TCentralAuthorityUserIdentity;
    [CA_AUTH_CREDENTIALS_USER_PASSWORD_PROP_NAME]: string;
    [CA_AUTH_CREDENTIALS_USER_SECRET_LOGIN_PROP_NAME]?: string;
};
export interface ICentralAuthorityUserProfile {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    photoURL?: string | null;
}
export interface ICentralAuthorityStorageCryptoCredentials {
    connect(credentials?: TCentralAuthorityCredentialsStorageAuthCredentials): Promise<boolean | Error>;
    setCredentials(cryptoKeyPairs: TCACryptoKeyPairs): Promise<Error | boolean>;
    getCredentials(): Promise<TCentralAuthorityUserCryptoCredentials | Error | null>;
    disconnect(): Promise<boolean | Error>;
}
export interface ICentralAuthorityConnectionOptions {
    serverUrl: string;
    getUsersDescriptionsRequestOptions: IHttpRequestOptions;
}
export declare abstract class CentralAuthorityConnection {
    constructor();
    abstract getUsersDescription(users: TUserIdentity[]): Promise<(IUserDescription | null)[] | Error>;
}
export interface ICentralAuthorityConnection {
    new (): CentralAuthorityConnection;
}
export declare type TInstanceOfCentralAuthorityConnection = InstanceType<ICentralAuthorityConnection>;
//# sourceMappingURL=central-authority-class-types-common.d.ts.map