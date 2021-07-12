import { TCentralAuthorityUserCryptoCredentials, ICentralAuthorityUserProfile, ICentralAuthorityUserAuthCredentials } from '../central-authority-class-types/central-authority-class-types';
import { ICAConnectionConfigurationFirebase } from './central-authority-connection-firebase/central-authority-connection-firebase.types.configuration';
import { TUserIdentityVersion } from '../central-authority-class-user-identity/central-authority-class-user-identity.types';
import { CA_CONNECTION_STATUS } from './central-authority-connections-const/central-authority-connections-const';
import { TSwarmMessageUserIdentifierSerialized } from '../central-authority-class-user-identity/central-authority-class-user-identity-validators/central-authority-common-validator-user-identifier/central-authority-common-validator-user-identifier.types';
export declare type TCAConnectionsAuthProviderConnectionOptions = ICAConnectionConfigurationFirebase;
export interface ICAConnectionAuthProviderConstructor {
    new (): ICAConnection;
}
export declare type TCAAuthProviderIdentity = string;
export interface ICAConnectionUserAuthorizedResult {
    cryptoCredentials: TCentralAuthorityUserCryptoCredentials;
    profile: ICentralAuthorityUserProfile;
}
export interface ICAConnectionSignUpCredentials extends ICentralAuthorityUserAuthCredentials {
    cryptoCredentials?: TCentralAuthorityUserCryptoCredentials;
}
export interface ICAConnectionSignInCredentials {
    login: string;
    password?: string;
}
export interface ICAConnection {
    cryptoCredentials?: TCentralAuthorityUserCryptoCredentials;
    status: CA_CONNECTION_STATUS;
    authProviderURL: string | undefined;
    isVersionSupported(v: TUserIdentityVersion): boolean;
    connect(configuration: ICAConnectionConfigurationFirebase): Promise<boolean | Error>;
    signInAnonymousely(): Promise<Error | void>;
    authorize(signUpCredentials: ICAConnectionSignUpCredentials, profile?: Partial<ICentralAuthorityUserProfile>): Promise<Error | ICAConnectionUserAuthorizedResult>;
    signOut(): Promise<Error | boolean>;
    delete(signUpCredentials?: ICAConnectionSignUpCredentials): Promise<Error | boolean>;
    getUserCredentials(userId: TSwarmMessageUserIdentifierSerialized): Promise<Error | null | TCentralAuthorityUserCryptoCredentials>;
    disconnect(): Promise<Error | void>;
    getCAUserProfile(): Promise<Partial<ICentralAuthorityUserProfile> | undefined | Error>;
}
//# sourceMappingURL=central-authority-connections.types.d.ts.map