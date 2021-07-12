import 'firebase/auth';
import 'firebase/database';
import CAConnectionWithFirebaseBase from '../central-authority-connection-firebase-base/central-authority-connection-firebase-base';
import { ICAConnection, ICAConnectionSignUpCredentials, ICAConnectionUserAuthorizedResult } from '../../central-authority-connections.types';
import { ICentralAuthorityUserProfile, TCentralAuthorityUserCryptoCredentials } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import { TUserIdentityVersion } from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity.types';
import { ICAConnectionConfigurationFirebase } from '../central-authority-connection-firebase.types.configuration';
import { CA_CONNECTION_STATUS } from '../../central-authority-connections-const/central-authority-connections-const';
import { TSwarmMessageUserIdentifierSerialized } from '../../../central-authority-class-user-identity/central-authority-class-user-identity-validators/central-authority-common-validator-user-identifier/central-authority-common-validator-user-identifier.types';
export declare class CAConnectionWithFirebaseImplementation extends CAConnectionWithFirebaseBase implements ICAConnection {
    get cryptoCredentials(): TCentralAuthorityUserCryptoCredentials | undefined;
    get authProviderURL(): string;
    get status(): CA_CONNECTION_STATUS;
    protected isAnonymousely: boolean;
    protected userLogin?: string;
    protected readonly supportedVersions: Array<TUserIdentityVersion>;
    isVersionSupported: ((version: TUserIdentityVersion) => boolean) & import("lodash").MemoizedFunction;
    connect(configuration: ICAConnectionConfigurationFirebase): Promise<boolean | Error>;
    signInAnonymousely(): Promise<Error | void>;
    getUserCredentials(userId: TSwarmMessageUserIdentifierSerialized): Promise<Error | null | TCentralAuthorityUserCryptoCredentials>;
    authorize(firebaseCredentials: ICAConnectionSignUpCredentials, profile?: Partial<ICentralAuthorityUserProfile>): Promise<ICAConnectionUserAuthorizedResult | Error>;
    disconnect(): Promise<void | Error>;
    delete(firebaseCredentials: ICAConnectionSignUpCredentials): Promise<Error | boolean>;
    protected setIsAnonymousely(): void;
    protected unsetIsAnonymousely(): void;
    protected setValueofCredentialsSignUpOnAuthorizedSuccess(authResult: ICAConnectionUserAuthorizedResult): void;
    protected unsetValueofCredentialsSignUpOnAuthorizedSuccess(): void;
    protected setVersionsSupported(supportedVersions?: Array<TUserIdentityVersion>): Error | void;
    protected setUserLogin(login: string): void;
    protected generateNewCryptoCredentialsForConfigurationProvidedV2: () => Promise<Error | TCentralAuthorityUserCryptoCredentials>;
    protected generateAndSetCredentialsForTheCurrentUser(signUpCredentials: ICAConnectionSignUpCredentials): Promise<Error | TCentralAuthorityUserCryptoCredentials>;
    protected disconnectFromTheApp(): Promise<Error | void>;
}
export default CAConnectionWithFirebaseImplementation;
//# sourceMappingURL=central-authority-connection-firebase-connection-implementation.d.ts.map