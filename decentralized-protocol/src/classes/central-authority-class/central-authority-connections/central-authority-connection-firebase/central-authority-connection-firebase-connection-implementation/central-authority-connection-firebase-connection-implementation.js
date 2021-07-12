import { __awaiter } from "tslib";
import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/database';
import memoize from 'lodash.memoize';
import CAConnectionWithFirebaseBase from '../central-authority-connection-firebase-base/central-authority-connection-firebase-base';
import { isEmptyObject } from "../../../../../utils";
import { ICentralAuthorityUserProfile, TCentralAuthorityUserCryptoCredentials, } from "../../../central-authority-class-types/central-authority-class-types";
import { getVersionOfCryptoCredentials } from "../../../central-authority-utils-common/central-authority-utils-crypto-credentials/central-authority-utils-crypto-credentials";
import { CA_USER_IDENTITY_VERSIONS, CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME, CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME, CA_USER_IDENTITY_VERSION_CURRENT, } from "../../../central-authority-class-user-identity/central-authority-class-user-identity.const";
import { generateCryptoCredentialsWithUserIdentityV2 } from "../../../central-authority-utils-common/central-authority-util-crypto-keys/central-authority-util-crypto-keys";
import { validateUserIdentityVersion } from "../../../central-authority-validators/central-authority-validators-auth-credentials/central-authority-validators-auth-credentials";
import { TUserIdentityVersion } from "../../../central-authority-class-user-identity/central-authority-class-user-identity.types";
import { CA_CONNECTION_STATUS } from '../../central-authority-connections-const/central-authority-connections-const';
export class CAConnectionWithFirebaseImplementation extends CAConnectionWithFirebaseBase {
    constructor() {
        super(...arguments);
        this.isAnonymousely = false;
        this.supportedVersions = [
            CA_USER_IDENTITY_VERSIONS['01'],
            CA_USER_IDENTITY_VERSIONS['02'],
        ];
        this.isVersionSupported = memoize((version) => this.supportedVersions.includes(version));
        this.generateNewCryptoCredentialsForConfigurationProvidedV2 = () => __awaiter(this, void 0, void 0, function* () {
            const { databaseURL, currentUser } = this;
            if (!currentUser) {
                return new Error('The user is not defined');
            }
            if (databaseURL instanceof Error) {
                return databaseURL;
            }
            const cryptoCredentials = yield generateCryptoCredentialsWithUserIdentityV2({
                [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]: databaseURL,
                [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]: currentUser.uid,
            });
            if (cryptoCredentials instanceof Error) {
                console.error(cryptoCredentials);
                return new Error('Failed to generate a new crypto credentials');
            }
            return cryptoCredentials;
        });
    }
    get cryptoCredentials() {
        const { valueofCredentialsSignUpOnAuthorizedSuccess } = this;
        if (valueofCredentialsSignUpOnAuthorizedSuccess) {
            const { cryptoCredentials } = valueofCredentialsSignUpOnAuthorizedSuccess;
            return cryptoCredentials;
        }
    }
    get authProviderURL() {
        const { databaseURL } = this;
        return databaseURL instanceof Error ? undefined : databaseURL;
    }
    get status() {
        const { isConnected, isAuthorized, isAnonymousely } = this;
        if (!isConnected) {
            return CA_CONNECTION_STATUS.DISCONNECTED;
        }
        if (isAuthorized) {
            return CA_CONNECTION_STATUS.AUTHORIZED;
        }
        if (isAnonymousely) {
            return CA_CONNECTION_STATUS.CONNECTED;
        }
        return CA_CONNECTION_STATUS.DISCONNECTED;
    }
    connect(configuration) {
        const _super = Object.create(null, {
            connect: { get: () => super.connect }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const appName = firebase.apps.length ? configuration.databaseURL : undefined;
            const resultConnection = yield _super.connect.call(this, configuration, appName);
            if (resultConnection instanceof Error) {
                return resultConnection;
            }
            return true;
        });
    }
    signInAnonymousely() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connectAnonymouselyResult = yield this.app.auth().signInAnonymously();
                if (connectAnonymouselyResult instanceof Error) {
                    return connectAnonymouselyResult;
                }
            }
            catch (err) {
                console.error(err);
                return new Error('Failed to connect anonymousely');
            }
            const connectWithStorageResult = yield this.startConnectionWithCredentialsStorage();
            if (connectWithStorageResult instanceof Error) {
                console.error(connectWithStorageResult);
                return new Error('Failed to connect to the credentials storage');
            }
            this.setIsAnonymousely();
        });
    }
    getUserCredentials(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { status } = this;
            if (status !== CA_CONNECTION_STATUS.DISCONNECTED) {
                const { connectionWithCredentialsStorage } = this;
                return connectionWithCredentialsStorage.getUserCredentials(userId);
            }
            return new Error('Not connected to the Firebase');
        });
    }
    authorize(firebaseCredentials, profile) {
        return __awaiter(this, void 0, void 0, function* () {
            const isConnected = this.checkIfConnected();
            if (isConnected instanceof Error) {
                return this.onAuthorizationFailed(isConnected);
            }
            let authHandleResult;
            const { isAuthorized } = this;
            if (isAuthorized) {
                if (!this.valueofCredentialsSignUpOnAuthorizedSuccess) {
                    throw new Error('a value of the valueofCredentialsSignUpOnAuthorizedSuccess should be defined');
                }
                authHandleResult = this.valueofCredentialsSignUpOnAuthorizedSuccess;
            }
            else {
                const signInResult = yield this.signIn(firebaseCredentials);
                if (signInResult instanceof Error) {
                    console.warn('Failed to sign in with the credentials given');
                    if (!firebaseCredentials.password) {
                        return signInResult;
                    }
                    const signUpResult = yield this.signUp(firebaseCredentials);
                    if (signUpResult instanceof Error) {
                        console.error('The user was failed to sign up');
                        return this.onAuthorizationFailed(signUpResult);
                    }
                }
                const isVerifiedResult = yield this.chekIfVerifiedAccount();
                if (isVerifiedResult instanceof Error) {
                    console.error('The account is not verified');
                    return this.onAuthorizationFailed(isVerifiedResult);
                }
                const connectWithStorageResult = yield this.startConnectionWithCredentialsStorage();
                if (connectWithStorageResult instanceof Error) {
                    console.error(connectWithStorageResult);
                    return new Error('Failed to connect to the credentials storage');
                }
                this.setUserLogin(firebaseCredentials.login);
                let cryptoCredentials;
                if (firebaseCredentials.session) {
                    const sessionCryptoCredentials = yield this.readCryptoCrdentialsFromSession(firebaseCredentials.session);
                    if (sessionCryptoCredentials instanceof Error) {
                        console.error('Failed to get credentials from the session cause the error', sessionCryptoCredentials);
                    }
                    cryptoCredentials = sessionCryptoCredentials;
                }
                if (!cryptoCredentials || cryptoCredentials instanceof Error) {
                    cryptoCredentials = yield this.createOrReturnExistingCredentialsForUser(firebaseCredentials);
                }
                if (cryptoCredentials instanceof Error) {
                    console.error('Failed to get a crypto credentials valid for the user');
                    return this.onAuthorizationFailed(cryptoCredentials);
                }
                authHandleResult = yield this.returnOnAuthorizedResult(cryptoCredentials);
                if (firebaseCredentials.session) {
                    const setCredentialsInSessionResult = yield this.setCurrentUserCryptoCredentialsInSession(firebaseCredentials.session, cryptoCredentials);
                    if (setCredentialsInSessionResult instanceof Error) {
                        console.error('Failed to set the credentials in the user session', setCredentialsInSessionResult);
                    }
                }
            }
            if (authHandleResult instanceof Error) {
                return this.onAuthorizationFailed(authHandleResult);
            }
            if (profile && !isEmptyObject(profile)) {
                const setProfileResult = yield this.setProfileData(profile);
                if (setProfileResult instanceof Error) {
                    console.error(setProfileResult);
                    return this.onAuthorizationFailed('Failed to set the profile data');
                }
                authHandleResult = {
                    profile: setProfileResult,
                    cryptoCredentials: authHandleResult.cryptoCredentials,
                };
            }
            this.valueofCredentialsSignUpOnAuthorizedSuccess = authHandleResult;
            this.setValueofCredentialsSignUpOnAuthorizedSuccess(authHandleResult);
            this.unsetIsAnonymousely();
            return authHandleResult;
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            const { app } = this;
            if (!app) {
                return;
            }
            if (app.isDeleted_) {
                return;
            }
            if (this.status === CA_CONNECTION_STATUS.AUTHORIZED) {
                const signOutResult = yield this.signOut();
                if (signOutResult instanceof Error) {
                    return signOutResult;
                }
                if (signOutResult !== true) {
                    return new Error('An unknown error has occurred while sign out');
                }
            }
            return this.disconnectFromTheApp();
        });
    }
    delete(firebaseCredentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const isConnected = this.checkIfConnected();
            if (isConnected instanceof Error) {
                return isConnected;
            }
            const { currentUser } = this;
            if (currentUser instanceof Error) {
                console.error(currentUser);
                return new Error('Failed to read the current user');
            }
            if (currentUser == null) {
                return new Error('There is no current user');
            }
            const signInResult = yield this.signIn(firebaseCredentials);
            if (signInResult instanceof Error) {
                console.error('Failed to sign in before the user deletion');
                return signInResult;
            }
            try {
                const result = (yield currentUser.delete());
                if (result instanceof Error) {
                    console.error(result);
                    return new Error('Failed to delete the user from the firebase');
                }
            }
            catch (err) {
                console.error(err);
                return new Error('Failed to delete the user from the authority');
            }
            return true;
        });
    }
    setIsAnonymousely() {
        this.isAnonymousely = true;
    }
    unsetIsAnonymousely() {
        this.isAnonymousely = false;
    }
    setValueofCredentialsSignUpOnAuthorizedSuccess(authResult) {
        this.valueofCredentialsSignUpOnAuthorizedSuccess = authResult;
    }
    unsetValueofCredentialsSignUpOnAuthorizedSuccess() {
        this.valueofCredentialsSignUpOnAuthorizedSuccess = undefined;
    }
    setVersionsSupported(supportedVersions) {
        if (supportedVersions instanceof Array) {
            const len = supportedVersions.length;
            let idx = 0;
            let version;
            for (; idx++; len < idx) {
                version = supportedVersions[idx];
                if (validateUserIdentityVersion(version)) {
                    this.supportedVersions.push(version);
                }
                return new Error('The version is not supproted');
            }
        }
        return new Error('The argument must be an Array');
    }
    setUserLogin(login) {
        this.userLogin = login;
    }
    generateAndSetCredentialsForTheCurrentUser(signUpCredentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const credentialsProvidedCheckResult = this.checkSignUpCredentials(signUpCredentials);
            if (credentialsProvidedCheckResult instanceof Error) {
                console.error(credentialsProvidedCheckResult);
                return credentialsProvidedCheckResult;
            }
            const { cryptoCredentials } = signUpCredentials;
            const V1 = CA_USER_IDENTITY_VERSIONS['01'];
            let credentialsForV1 = false;
            if (this.isVersionSupported(V1)) {
                credentialsForV1 = CA_USER_IDENTITY_VERSION_CURRENT === CA_USER_IDENTITY_VERSIONS['01'];
                if (cryptoCredentials) {
                    const cryptoCredentialsVersion = getVersionOfCryptoCredentials(cryptoCredentials);
                    if (cryptoCredentialsVersion instanceof Error) {
                        console.error(cryptoCredentialsVersion);
                        return new Error('Failed to define a version of the crypto credentials');
                    }
                    if (cryptoCredentialsVersion === CA_USER_IDENTITY_VERSIONS['01']) {
                        credentialsForV1 = true;
                    }
                    else {
                        credentialsForV1 = false;
                    }
                }
                if (credentialsForV1 === true) {
                    return this.createOrSetCredentialsInDB(signUpCredentials);
                }
            }
            return this.createOrSetCredentialsInDB(signUpCredentials, this.generateNewCryptoCredentialsForConfigurationProvidedV2);
        });
    }
    disconnectFromTheApp() {
        return __awaiter(this, void 0, void 0, function* () {
            this.unsetIsAnonymousely();
            this.unsetValueofCredentialsSignUpOnAuthorizedSuccess();
            const disconnectFromStorageResult = yield this.disconnectCredentialsStorage();
            if (disconnectFromStorageResult instanceof Error) {
                return disconnectFromStorageResult;
            }
            const { app } = this;
            if (app) {
                try {
                    yield app.delete();
                }
                catch (err) {
                    console.error(err);
                    return new Error('Failed to disconnect from the Firebase app');
                }
            }
            else {
                return new Error('There is no active Firebase App instance to close');
            }
        });
    }
}
export default CAConnectionWithFirebaseImplementation;
//# sourceMappingURL=central-authority-connection-firebase-connection-implementation.js.map