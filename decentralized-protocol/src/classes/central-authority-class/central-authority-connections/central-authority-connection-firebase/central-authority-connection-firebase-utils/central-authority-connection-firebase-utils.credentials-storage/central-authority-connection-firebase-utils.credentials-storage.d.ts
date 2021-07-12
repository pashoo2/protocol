import firebase from 'firebase/app';
import { CAConnectionWithFirebaseUtilDatabase } from '../central-authority-connection-firebase-utils.database/central-authority-connection-firebase-utils.database';
import { ICAConnectionFirebase, ICAConnectionFirestoreUtilsCredentialsStrorageCredentialsSaveStructure } from './central-authority-connection-firebase-utils.credentials-storage.types';
import { TCentralAuthorityUserCryptoCredentials } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import { ICAConnectionSignUpCredentials } from '../../../central-authority-connections.types';
import { TSwarmMessageUserIdentifierSerialized } from '../../../../central-authority-class-user-identity/central-authority-class-user-identity-validators/central-authority-common-validator-user-identifier/central-authority-common-validator-user-identifier.types';
export declare class CAConnectionFirestoreUtilsCredentialsStrorage extends CAConnectionWithFirebaseUtilDatabase {
    protected connectionToFirebase?: ICAConnectionFirebase;
    protected get firebaseUserData(): firebase.User | null | Error;
    protected get firebaseUserId(): string | Error;
    constructor(connectionToFirebase: ICAConnectionFirebase);
    protected getCredentialsKeyByUserId(userId: TSwarmMessageUserIdentifierSerialized): string;
    protected checkIsConnected(): boolean | Error;
    protected checkIsAuthorized(): boolean | Error;
    protected setUpConnection(connectionToFirebase: ICAConnectionFirebase): void;
    protected checkStoredCredentialsFormat(storedCredentialsValue: any): storedCredentialsValue is ICAConnectionFirestoreUtilsCredentialsStrorageCredentialsSaveStructure;
    protected getCredentialsByValueStored(storedCredentialsValue: any, signUpCredentials?: ICAConnectionSignUpCredentials): Promise<TCentralAuthorityUserCryptoCredentials | null | Error>;
    protected filterCredentialsValues(valueStored: Record<string, any>, signUpCredentials: ICAConnectionSignUpCredentials): Promise<TCentralAuthorityUserCryptoCredentials | null | Error>;
    getCredentialsForTheCurrentUser(signUpCredentials: ICAConnectionSignUpCredentials): Promise<Error | null | TCentralAuthorityUserCryptoCredentials>;
    setUserCredentials(credentials: TCentralAuthorityUserCryptoCredentials, signUpCredentials: ICAConnectionSignUpCredentials): Promise<Error | TCentralAuthorityUserCryptoCredentials>;
    getUserCredentials(userId: TSwarmMessageUserIdentifierSerialized): Promise<Error | null | TCentralAuthorityUserCryptoCredentials>;
    disconnect(): Promise<Error | boolean>;
}
//# sourceMappingURL=central-authority-connection-firebase-utils.credentials-storage.d.ts.map