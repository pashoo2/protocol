import { __awaiter } from "tslib";
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import { ICentralAuthorityUserAuthCredentials, TCentralAuthorityUserCryptoCredentials, ICentralAuthorityUserProfile, } from "../../../central-authority-class-types/central-authority-class-types";
import { isEmptyObject } from "../../../../../utils";
import { validateUserProfileData } from "../../../central-authority-validators/central-authority-validators-user/central-authority-validators-user";
import { dataValidatorUtilEmail, dataValidatorUtilURL } from "../../../../../utils/data-validators-utils";
import { checkIsValidCryptoCredentials } from "../../../central-authority-validators/central-authority-validators-crypto-keys/central-authority-validators-crypto-keys";
import { generateCryptoCredentialsWithUserIdentityV1 } from "../../../central-authority-utils-common/central-authority-util-crypto-keys/central-authority-util-crypto-keys";
import CentralAuthorityIdentity from "../../../central-authority-class-user-identity/central-authority-class-user-identity";
import { CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME } from "../../../central-authority-class-user-identity/central-authority-class-user-identity.const";
import { CAConnectionFirestoreUtilsCredentialsStrorage } from '../central-authority-connection-firebase-utils/central-authority-connection-firebase-utils.credentials-storage/central-authority-connection-firebase-utils.credentials-storage';
import { CA_CONNECTION_FIREBASE_CREDENTIALS_GENERATION_MAX_ATTEMPTS } from '../central-authority-connection-firebase.const/central-authority-connection-firebase.const.restrictions';
import { validatePassword } from "../../../central-authority-validators/central-authority-validators-auth-credentials/central-authority-validators-auth-credentials";
import ErrorExtendedBaseClass from "../../../../basic-classes/error-extended-class-base/error-extended-class-base";
import { CA_CONNECTION_ERROR_ACCOUNT_NOT_VERIFIED_CODE, CA_CONNECTION_ERROR_ACCOUNT_CAN_NOT_BE_USED_ANYMORE, } from '../../central-authority-connections-const/central-authority-connections-const';
import { valiateCAAuthConnectionFirebaseUtilsConnetionConfiguration } from '../central-authority-connection-firebase-utils/central-authority-connection-firebase-utils.validators';
import { timeout } from "../../../../../utils";
import { CA_CONNECTION_FIREBASE_AUTH_WITH_SESSION_TOKEN_TIMEOUT_MS } from '../central-authority-connection-firebase.const';
import { CENTRAL_AUTHORITY_CONNECTION_FIREBASE_BASE_SESSION_KEY } from './central-authority-connection-firebase-base.const';
import assert from 'assert';
import { importCryptoCredentialsFromAString, exportCryptoCredentialsToString, } from '../../../central-authority-utils-common/central-authority-utils-crypto-credentials/central-authority-utils-crypto-credentials';
export class CAConnectionWithFirebaseBase {
    constructor() {
        this.isConnected = false;
        this.isAuthorizedWithCredentials = false;
        this.getCAUserProfile = () => __awaiter(this, void 0, void 0, function* () {
            if (this.isAuthorized) {
                return this.getCurrentUserProfileData() || undefined;
            }
        });
        this.generateNewCryptoCredentialsForConfigurationProvided = () => __awaiter(this, void 0, void 0, function* () {
            const { databaseURL } = this;
            if (databaseURL instanceof Error) {
                return databaseURL;
            }
            const cryptoCredentials = yield generateCryptoCredentialsWithUserIdentityV1({
                authorityProviderURI: databaseURL,
            });
            if (cryptoCredentials instanceof Error) {
                console.error(cryptoCredentials);
                return new Error('Failed to generate a new crypto credentials');
            }
            return cryptoCredentials;
        });
        this.setCryptoCredentialsForTheUserToDatabase = (cryptoCredentials, signUpCredentials) => __awaiter(this, void 0, void 0, function* () {
            const isConnected = this.checkIfConnected();
            const { connectionWithCredentialsStorage } = this;
            if (!isConnected) {
                return new Error('There is no active connection to the Firebase auth provider');
            }
            const setCredentialsResult = yield connectionWithCredentialsStorage.setUserCredentials(cryptoCredentials, signUpCredentials);
            if (setCredentialsResult instanceof Error) {
                return setCredentialsResult;
            }
            return setCredentialsResult;
        });
    }
    get isUserSignedIn() {
        const { isConnected, isVerifiedAccount } = this;
        if (!isConnected) {
            return false;
        }
        return isVerifiedAccount;
    }
    get isAuthorized() {
        const { isUserSignedIn, valueofCredentialsSignUpOnAuthorizedSuccess: credentialsAuthorizedSuccess } = this;
        if (!isUserSignedIn) {
            return false;
        }
        return !!credentialsAuthorizedSuccess;
    }
    get authResult() {
        return this.valueofCredentialsSignUpOnAuthorizedSuccess;
    }
    get currentUser() {
        var _a;
        const { isConnected } = this;
        return isConnected ? (_a = this.app) === null || _a === void 0 ? void 0 : _a.auth().currentUser : null;
    }
    get isVerifiedAccount() {
        const { isConnected, currentUser: currentUserData } = this;
        if (!isConnected) {
            return false;
        }
        if (!currentUserData) {
            return false;
        }
        if (!currentUserData.emailVerified) {
            return false;
        }
        return true;
    }
    get databaseURL() {
        const { configuration } = this;
        if (!configuration) {
            return new Error('There is no url specified for the Firebase authority provided');
        }
        const { databaseURL } = configuration;
        if (dataValidatorUtilURL(databaseURL)) {
            return databaseURL;
        }
        return new Error('An invalid URL provided for the Firebase authority provider');
    }
    get app() {
        return firebase.app(this.databaseURL);
    }
    getApp() {
        return this.app;
    }
    signOut() {
        return __awaiter(this, void 0, void 0, function* () {
            const isConnected = this.checkIfConnected();
            if (isConnected instanceof Error) {
                return isConnected;
            }
            const disconnectFromStorageResult = yield this.disconnectCredentialsStorage();
            if (disconnectFromStorageResult instanceof Error) {
                return disconnectFromStorageResult;
            }
            try {
                yield this.app.auth().signOut();
            }
            catch (err) {
                console.error(err);
                return new Error('Failed to sign out');
            }
            this.handleUnauthorized();
            return true;
        });
    }
    connect(configuration, name) {
        return __awaiter(this, void 0, void 0, function* () {
            let app;
            try {
                const appName = name || configuration.databaseURL;
                const existingApp = firebase.apps.find((app) => app.name);
                app = existingApp || firebase.initializeApp(configuration, appName);
                this.configuration = configuration;
            }
            catch (err) {
                console.error(err);
                this.setConnectedStatus(false);
                return new Error('Failed to initialize the application with the given configuration');
            }
            this.setConnectedStatus(app);
            return true;
        });
    }
    getCurrentUserData() {
        var _a;
        return (_a = this.app) === null || _a === void 0 ? void 0 : _a.auth().currentUser;
    }
    mapUserFirebaseDataToCAUserProfileData(userData) {
        return {
            name: userData.displayName,
            email: userData.email,
            phone: userData.phoneNumber,
            photoURL: userData.photoURL,
        };
    }
    mapUserProviderDataToCAUserProfileData(userData) {
        return {
            name: userData.displayName,
            email: userData.email,
            phone: userData.phoneNumber,
            photoURL: userData.photoURL,
        };
    }
    getCurrentUserProfileData() {
        var _a;
        const userData = this.getCurrentUserData();
        if (userData) {
            const userDataFromAuthProvider = (_a = userData === null || userData === void 0 ? void 0 : userData.providerData) === null || _a === void 0 ? void 0 : _a[0];
            if (userDataFromAuthProvider) {
                return this.mapUserProviderDataToCAUserProfileData(userDataFromAuthProvider);
            }
            return this.mapUserProviderDataToCAUserProfileData(userData);
        }
    }
    generateAndSetCredentialsForTheCurrentUser(signUpCredentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const credentialsProvidedCheckResult = this.checkSignUpCredentials(signUpCredentials);
            if (credentialsProvidedCheckResult instanceof Error) {
                console.error(credentialsProvidedCheckResult);
                return credentialsProvidedCheckResult;
            }
            return this.createOrSetCredentialsInDB(signUpCredentials);
        });
    }
    setConnectedStatus(isConnected) {
        this.isConnected = !!isConnected;
    }
    setAuthorizedStatus(isAuthorized) {
        this.isAuthorizedWithCredentials = isAuthorized;
    }
    checkIfConnected() {
        const { isConnected, connectionWithCredentialsStorage } = this;
        if (!connectionWithCredentialsStorage || !connectionWithCredentialsStorage.isConnected) {
            return false;
        }
        return !isConnected ? new Error('There is no active connection with the Firebase') : true;
    }
    checkSignUpCredentials(signUpCredentials) {
        if (!signUpCredentials) {
            return new Error('Sign up credentials must be provided');
        }
        if (typeof signUpCredentials !== 'object') {
            return new Error('Sign up credentials must be an object');
        }
        const { cryptoCredentials: credentialsGiven, login, password } = signUpCredentials;
        if (credentialsGiven) {
            const resultCheckCredentialsGiven = this.checkUserIdentityIsValidForConfigurationProvided(credentialsGiven);
            if (resultCheckCredentialsGiven instanceof Error) {
                console.error(resultCheckCredentialsGiven);
                return new Error('Credentials given is not valid for the Firebase auth provider');
            }
        }
        if (!dataValidatorUtilEmail(login)) {
            return new Error('The login must be an email valid');
        }
        if (!validatePassword(password)) {
            return new Error('The password provided is not valid');
        }
        return true;
    }
    setConnectionWithCredentialsStorage(connectionWithCredentialsStorage) {
        this.connectionWithCredentialsStorage = connectionWithCredentialsStorage;
    }
    startConnectionWithCredentialsStorage() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.connectionWithCredentialsStorage) {
                return true;
            }
            const connectionWithCredentialsStorage = new CAConnectionFirestoreUtilsCredentialsStrorage(this);
            const storageConnectionResult = yield connectionWithCredentialsStorage.connect();
            if (storageConnectionResult instanceof Error) {
                console.error(storageConnectionResult);
                return new Error('Failed connect to the Firebase credentials storage');
            }
            if (!connectionWithCredentialsStorage.isConnected) {
                return new Error('Connection to the Firebase credentials storage was not succeed');
            }
            this.setConnectionWithCredentialsStorage(connectionWithCredentialsStorage);
            return true;
        });
    }
    waitingUserInit() {
        return __awaiter(this, void 0, void 0, function* () {
            const isConnected = this.checkIfConnected();
            if (isConnected instanceof Error) {
                return new Error('The connection is not established');
            }
            if (!this.app) {
                return new Error('The Firebase app is not defined');
            }
            return new Promise((res) => {
                this.app.auth().onAuthStateChanged((user) => {
                    if (user && user.email) {
                        res(user);
                    }
                });
            });
        });
    }
    handleUnauthorized() {
        this.setAuthorizedStatus(false);
        this.valueofCredentialsSignUpOnAuthorizedSuccess = undefined;
    }
    onAuthorizationFailed(error) {
        const err = error instanceof Error ? error : new Error(String(error));
        console.error(err);
        console.error('Authorization failed on remote Firebase server');
        this.handleUnauthorized();
        return err;
    }
    singUpWithAuthCredentials(authCredentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const checkSignUpCredentialsResult = this.checkSignUpCredentials(authCredentials);
            if (checkSignUpCredentialsResult instanceof Error) {
                console.error(checkSignUpCredentialsResult);
                return this.onAuthorizationFailed(checkSignUpCredentialsResult);
            }
            const { login, password } = authCredentials;
            try {
                yield this.app.auth().createUserWithEmailAndPassword(login, password);
            }
            catch (err) {
                console.error(err);
                return new Error('Failed to sign up to the Firebase with the given credentials');
            }
            return true;
        });
    }
    singInWithAuthCredentials(authCredentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const { login, password } = authCredentials;
            try {
                if (password) {
                    yield this.app.auth().signInWithEmailAndPassword(login, password);
                }
            }
            catch (err) {
                console.error(err);
                return new Error(`Failed to sign up to the Firebase with the given credentials: ${err.message}`);
            }
            return true;
        });
    }
    setSessionPersistance() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.app.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
            }
            catch (err) {
                console.error('Failed to set Session persistance for the Firebase');
            }
        });
    }
    getUserProfileData() {
        return __awaiter(this, void 0, void 0, function* () {
            const isConnected = this.checkIfConnected();
            if (isConnected instanceof Error) {
                return isConnected;
            }
            const { currentUser: currentUserData } = this;
            if (!currentUserData) {
                return {};
            }
            const { displayName, photoURL, phoneNumber, email } = currentUserData;
            return {
                name: displayName || null,
                email: email || null,
                phone: phoneNumber || null,
                photoURL: photoURL || null,
            };
        });
    }
    returnOnAuthorizedResult(cryptoCredentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const userProfile = yield this.getUserProfileData();
            if (userProfile instanceof Error) {
                console.error(userProfile);
                return new Error('Failed to get profile data');
            }
            return {
                cryptoCredentials,
                profile: userProfile,
            };
        });
    }
    mapAppProfileToFirebaseProfileWithoutEmail(profile) {
        return {
            displayName: (profile && profile.name) || null,
            photoURL: (profile && profile.photoURL) || null,
        };
    }
    setProfileDataEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const checkIsConnectedResult = this.checkIfConnected();
            if (checkIsConnectedResult instanceof Error) {
                return checkIsConnectedResult;
            }
            if (!dataValidatorUtilEmail(email)) {
                return new Error('The email is not valid');
            }
            const { currentUser } = this;
            if (!currentUser) {
                return new Error('Failed to get the user profile data');
            }
            if (currentUser.email !== email) {
                try {
                    yield currentUser.updateEmail(email);
                }
                catch (err) {
                    console.error(err);
                    return new Error('Failed to update the email address');
                }
                const sendEmailVerificationResult = yield this.handleAuthEmailNotVerified();
                if (sendEmailVerificationResult instanceof Error) {
                    console.error(sendEmailVerificationResult);
                    return new Error('Failed to update the email address');
                }
                const logOutResult = yield this.signOut();
                if (logOutResult instanceof Error) {
                    console.error(logOutResult);
                    return new Error('Failed to log out');
                }
                return true;
            }
            return true;
        });
    }
    setProfileDataWithFirebase(profileDataPartialWithoutPhoneNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const isConnected = this.checkIfConnected();
            if (isConnected instanceof Error) {
                return isConnected;
            }
            const { currentUser } = this;
            if (!currentUser) {
                return new Error('There is no current user profile');
            }
            const profileMappedForFirebaseWithoutEmail = this.mapAppProfileToFirebaseProfileWithoutEmail(profileDataPartialWithoutPhoneNumber);
            try {
                yield currentUser.updateProfile(profileMappedForFirebaseWithoutEmail);
            }
            catch (err) {
                console.error(err);
                return new Error('Failed to set the Firebase profile data');
            }
            return true;
        });
    }
    setProfileData(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            if (isEmptyObject(profile)) {
                return this.getUserProfileData();
            }
            if (!validateUserProfileData(profile)) {
                return new Error('The profile is not valid');
            }
            const resultUpdateProfile = yield this.setProfileDataWithFirebase(profile);
            if (resultUpdateProfile instanceof Error) {
                return resultUpdateProfile;
            }
            const updatedProfile = yield this.getUserProfileData();
            if (updatedProfile instanceof Error) {
                console.error(updatedProfile);
                return new Error('Failed to read the updated profile data');
            }
            const { email } = profile;
            if (email) {
                const updateEmailResult = yield this.setProfileDataEmail(email);
                if (updateEmailResult instanceof Error) {
                    return updateEmailResult;
                }
                return Object.assign(Object.assign({}, updatedProfile), { email });
            }
            return updatedProfile;
        });
    }
    handleAuthEmailNotVerified() {
        return __awaiter(this, void 0, void 0, function* () {
            const isConnected = this.checkIfConnected();
            if (isConnected instanceof Error) {
                return isConnected;
            }
            const { currentUser } = this;
            if (!currentUser) {
                return new Error('There is no user authorized');
            }
            try {
                yield currentUser.sendEmailVerification();
            }
            catch (err) {
                console.error(err);
                return new Error('Failed to send the email verification link');
            }
            return true;
        });
    }
    chekIfVerifiedAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isVerifiedAccount) {
                return true;
            }
            const sendVerificationEmailResult = yield this.handleAuthEmailNotVerified();
            if (sendVerificationEmailResult instanceof Error) {
                console.error(sendVerificationEmailResult);
                return new Error('Failed to send the email verification');
            }
            return new ErrorExtendedBaseClass('Please verify the email address', CA_CONNECTION_ERROR_ACCOUNT_NOT_VERIFIED_CODE);
        });
    }
    checkUserIdentityIsValidForConfigurationProvided(cryptoCredentials) {
        const { databaseURL } = this;
        if (databaseURL instanceof Error) {
            return databaseURL;
        }
        if (!checkIsValidCryptoCredentials(cryptoCredentials)) {
            return new Error('The crypto credentials value is not valid');
        }
        const caUserIdentity = new CentralAuthorityIdentity(cryptoCredentials);
        if (!caUserIdentity.isValid) {
            return new Error('User identity is not valid');
        }
        const { identityDescription: identityDescriptionParsed } = caUserIdentity;
        if (identityDescriptionParsed instanceof Error) {
            console.error(identityDescriptionParsed);
            return new Error('Failed to get description by identity string');
        }
        if (identityDescriptionParsed[CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME] !== databaseURL) {
            return new Error('Wrong authority provider url got from the identity string');
        }
        return cryptoCredentials;
    }
    readCryptoCredentialsForTheUserFromDatabase(signUpCredentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const isConnected = this.checkIfConnected();
            if (!isConnected) {
                return new Error('There is no active connection to the Firebase auth provider');
            }
            const { connectionWithCredentialsStorage } = this;
            const credentialsForTheCurrentUser = yield connectionWithCredentialsStorage.getCredentialsForTheCurrentUser(signUpCredentials);
            if (credentialsForTheCurrentUser instanceof Error) {
                console.error(credentialsForTheCurrentUser);
                return new Error('Failed to read credentials of the current user');
            }
            return credentialsForTheCurrentUser;
        });
    }
    createOrSetCredentialsInDB(signUpCredentials, generateNewCryptoCredentialsForConfigurationProvided = this
        .generateNewCryptoCredentialsForConfigurationProvided, setCryptoCredentialsForTheUserToDatabase = this.setCryptoCredentialsForTheUserToDatabase) {
        return __awaiter(this, void 0, void 0, function* () {
            let attempt = 0;
            let cryptoCredentials = new Error('Failed to generate and set a crypto credentials for the user because of unknown reason');
            let isSuccess = false;
            if (typeof generateNewCryptoCredentialsForConfigurationProvided !== 'function') {
                return new Error('The generateNewCryptoCredentialsForConfigurationProvided argument must be a function');
            }
            if (typeof setCryptoCredentialsForTheUserToDatabase !== 'function') {
                return new Error('The setCryptoCredentialsForTheUserToDatabase argument must be a function');
            }
            const credentialsGiven = signUpCredentials.cryptoCredentials;
            while (attempt < CA_CONNECTION_FIREBASE_CREDENTIALS_GENERATION_MAX_ATTEMPTS && !isSuccess) {
                cryptoCredentials = credentialsGiven
                    ?
                        credentialsGiven
                    :
                        yield generateNewCryptoCredentialsForConfigurationProvided();
                if (cryptoCredentials instanceof Error) {
                    console.error(cryptoCredentials);
                }
                else {
                    const setCredentialsResult = yield setCryptoCredentialsForTheUserToDatabase(cryptoCredentials, signUpCredentials);
                    if (setCredentialsResult instanceof Error) {
                        console.error(setCredentialsResult);
                        cryptoCredentials = new Error('Failed to store credentials for the user in the database');
                    }
                    else {
                        cryptoCredentials = setCredentialsResult;
                        isSuccess = true;
                    }
                }
                attempt += 1;
            }
            return cryptoCredentials;
        });
    }
    checkIfCredentialsExistsForTheUser(signUpCredentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const credentialsExistingForTheCurrentUser = yield this.readCryptoCredentialsForTheUserFromDatabase(signUpCredentials);
            if (credentialsExistingForTheCurrentUser instanceof Error) {
                console.error(credentialsExistingForTheCurrentUser);
                return new Error('Failed to read credentials for the user from the Firebase database');
            }
            if (credentialsExistingForTheCurrentUser) {
                const credentialsValidationResult = this.checkUserIdentityIsValidForConfigurationProvided(credentialsExistingForTheCurrentUser);
                if (credentialsValidationResult instanceof Error) {
                    console.error(credentialsValidationResult);
                    console.error('The credentials stored for the user is not valid');
                    return new ErrorExtendedBaseClass("Sorry, you can't use this account anymore, cause a credentials existing for the account exists and not valid", CA_CONNECTION_ERROR_ACCOUNT_CAN_NOT_BE_USED_ANYMORE);
                }
                return credentialsExistingForTheCurrentUser;
            }
        });
    }
    setSessionData(session, sessionData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                assert(sessionData, 'A session data must not be empty');
                assert(typeof sessionData === 'object', 'A session data must an object');
                yield session.setItem(CENTRAL_AUTHORITY_CONNECTION_FIREBASE_BASE_SESSION_KEY, sessionData);
            }
            catch (err) {
                return err;
            }
        });
    }
    setCurrentUserCryptoCredentialsInSession(session, cryptoCredentials) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                assert(cryptoCredentials, 'Crypto credenitials must be provided');
                assert(typeof cryptoCredentials === 'object', 'Crypto credentials must be an object');
                const credentialsExported = yield exportCryptoCredentialsToString(cryptoCredentials);
                if (credentialsExported instanceof Error) {
                    throw credentialsExported;
                }
                return yield this.setSessionData(session, {
                    credentials: credentialsExported,
                });
            }
            catch (err) {
                return err;
            }
        });
    }
    readSessionData(session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sessionData = yield session.getItem(CENTRAL_AUTHORITY_CONNECTION_FIREBASE_BASE_SESSION_KEY);
                if (sessionData) {
                    assert(typeof sessionData === 'object', 'session data is not an object');
                    return sessionData;
                }
            }
            catch (err) {
                return err;
            }
        });
    }
    readCryptoCrdentialsFromSession(session) {
        return __awaiter(this, void 0, void 0, function* () {
            const sessionData = yield this.readSessionData(session);
            if (!sessionData) {
                return;
            }
            if (sessionData instanceof Error) {
                return sessionData;
            }
            const { credentials } = sessionData;
            if (credentials) {
                try {
                    if (typeof credentials !== 'string') {
                        return new Error('Credentials stored in session have a wrong format');
                    }
                    return yield importCryptoCredentialsFromAString(credentials);
                }
                catch (err) {
                    return err;
                }
            }
        });
    }
    createOrReturnExistingCredentialsForUser(signUpCredentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const credentialsExistingForTheCurrentUser = yield this.checkIfCredentialsExistsForTheUser(signUpCredentials);
            if (credentialsExistingForTheCurrentUser instanceof Error) {
                return credentialsExistingForTheCurrentUser;
            }
            if (credentialsExistingForTheCurrentUser != null) {
                return credentialsExistingForTheCurrentUser;
            }
            const newCredentialsGenerated = yield this.generateAndSetCredentialsForTheCurrentUser(signUpCredentials);
            if (newCredentialsGenerated instanceof Error) {
                console.error(newCredentialsGenerated);
                return new Error('Failed to generate or set a crypto credentials for the user');
            }
            return newCredentialsGenerated;
        });
    }
    signInWithSessionPersisted() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Promise.race([
                    timeout(CA_CONNECTION_FIREBASE_AUTH_WITH_SESSION_TOKEN_TIMEOUT_MS),
                    new Promise((res, rej) => {
                        this.app.auth().onAuthStateChanged(function (user) {
                            if (user) {
                                res(user);
                            }
                            else {
                                rej(user);
                            }
                        });
                    }),
                ]);
                return true;
            }
            catch (err) {
                console.error(err);
                return err;
            }
        });
    }
    signIn(firebaseCredentials) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!firebaseCredentials.password && firebaseCredentials.session) {
                return this.signInWithSessionPersisted();
            }
            const checkSignUpCredentialsResult = this.checkSignUpCredentials(firebaseCredentials);
            if (checkSignUpCredentialsResult instanceof Error) {
                console.error(checkSignUpCredentialsResult);
                return this.onAuthorizationFailed(checkSignUpCredentialsResult);
            }
            const authResult = yield this.singInWithAuthCredentials(firebaseCredentials);
            if (authResult === true && firebaseCredentials.session) {
                yield this.setSessionPersistance();
            }
            return authResult;
        });
    }
    signUp(signUpCredentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const signUpResult = yield this.singUpWithAuthCredentials(signUpCredentials);
            if (signUpResult instanceof Error) {
                return this.onAuthorizationFailed('Failed to authorize on Firebase remote server with the credentials');
            }
            return true;
        });
    }
    disconnectCredentialsStorage() {
        return __awaiter(this, void 0, void 0, function* () {
            const { connectionWithCredentialsStorage } = this;
            if (connectionWithCredentialsStorage && connectionWithCredentialsStorage.isConnected) {
                const res = yield connectionWithCredentialsStorage.disconnect();
                if (res instanceof Error) {
                    console.error(res);
                    return new Error('Failed to disconnect from the Firebase credentials storage');
                }
            }
            this.connectionWithCredentialsStorage = undefined;
            return true;
        });
    }
}
CAConnectionWithFirebaseBase.validateConfiguration = valiateCAAuthConnectionFirebaseUtilsConnetionConfiguration;
export default CAConnectionWithFirebaseBase;
//# sourceMappingURL=central-authority-connection-firebase-base.js.map