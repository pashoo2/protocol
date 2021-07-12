import { __awaiter, __decorate, __metadata } from "tslib";
import { checkIsError } from "../../utils";
import { dataCachingUtilsCachingDecoratorGlobalCachePerClass } from "../../utils/data-cache-utils";
import { validateVerboseBySchema } from './../../utils/validation-utils/validation-utils';
import { getErrorScopedClass } from './../basic-classes/error-extended-scoped-class-base/error-extended-scoped-class-base';
import { CENTRAL_AUTHORITY_CLASS_ERRORS_PREFIX, CENTRAL_AUTHORITY_CLASS_OPTIONS_SCHEMA, CENTRAL_AUTHORITY_CLASS_SWARM_CREDENTIALS_STORAGE_DB_NAME, CENTRAL_AUTHORITY_CLASS_SWARM_CREDENTIALS_SWARM_USERS_CREDENTIALS_CACHE_CAPACITY, } from './central-authority-class.const';
import { CAConnectionsPool } from './central-authority-connections/central-authority-connections-pool/central-authority-connections-pool';
import { CentralAuthorityStorageCurrentUserCredentials } from './central-authority-storage-local/central-authority-storage-current-user-auth/central-authority-storage-current-user-credentials/central-authority-storage-current-user-credentials';
import { CASwarmCredentialsProvider } from './central-authority-swarm-credentials-provider/central-authority-swarm-credentials-provider';
import { compareCryptoCredentials, exportCryptoCredentialsToString, } from './central-authority-utils-common/central-authority-utils-crypto-credentials/central-authority-utils-crypto-credentials';
import { getDataEncryptionKeyPairByCryptoCredentials, getDataEncryptionPubKeyByCryptoCredentials, getDataSignKeyPairByCryptoCredentials, getDataSignPubKeyByCryptoCredentials, getUserIdentityFromCryptoCredentials, } from './central-authority-utils-common/central-authority-utils-crypto-credentials/central-authority-utils-crypto-credentials-crypto-keys';
import { checkIsValidCryptoCredentials } from './central-authority-validators/central-authority-validators-crypto-keys/central-authority-validators-crypto-keys';
const CAError = getErrorScopedClass(CENTRAL_AUTHORITY_CLASS_ERRORS_PREFIX);
export class CentralAuthority {
    constructor() {
        this.isRunningInstance = false;
    }
    get isRunning() {
        return this.isRunningInstance;
    }
    get errorNotRunning() {
        return new CAError('The instance is not running');
    }
    connect(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isRunning) {
                console.warn('This instance is already running');
            }
            const setOptionsResult = this.setOptions(options);
            if (setOptionsResult instanceof Error) {
                return setOptionsResult;
            }
            const [resultUserCredentialsStorage, resultCAAuthProvidersConnectionsPool] = yield Promise.all([
                this.connectToUserCredentialsStorage(options.user),
                this.connectToAuthProvidersPool(options.authProvidersPool, options.user),
            ]);
            let isError = false;
            if (resultUserCredentialsStorage instanceof Error) {
                console.error(resultUserCredentialsStorage);
                isError = true;
            }
            if (resultCAAuthProvidersConnectionsPool instanceof Error) {
                return this.handleFailAndClose(resultCAAuthProvidersConnectionsPool);
            }
            if (isError) {
                return this.handleFailAndClose('There is an error occurred while connecting to the providers');
            }
            const setLocallyStoredCredentialsResult = yield this.readAndSetLocallyStoredUserCredentials();
            if (setLocallyStoredCredentialsResult instanceof Error) {
                console.error(setLocallyStoredCredentialsResult);
                return this.handleFailAndClose('Failed to read the locally stored credentials for the current user');
            }
            const checkUserCredentialsResult = yield this.compareLocalAndRemoteCredentials();
            if (checkUserCredentialsResult instanceof Error) {
                console.error(checkUserCredentialsResult);
                return this.handleFailAndClose('The user credentials stored locally and provided by the auth provided are not same');
            }
            const storeCredentialsLocallyResult = yield this.storeCryptoCredentialsFromAuthProvider();
            if (storeCredentialsLocallyResult instanceof Error) {
                console.error(storeCredentialsLocallyResult);
                return this.handleFailAndClose('Failed to store the credentials for the user locally');
            }
            const createConnectionToSwarmCredentialsStorageResult = yield this.connectToSwarmCredentialsStorage();
            if (createConnectionToSwarmCredentialsStorageResult instanceof Error) {
                console.error(createConnectionToSwarmCredentialsStorageResult);
                return this.handleFailAndClose('Failed to connect to the swarm credentials storage provider');
            }
            this.setIsRunning();
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.unsetOptions();
            if (!this.isRunning) {
                console.warn('The user is already not connected to the central authority');
                return;
            }
            const result = yield this.disconnectAll();
            if (result instanceof Error) {
                console.error(result);
                return new CAError('Failed to close all the connections');
            }
        });
    }
    getSwarmUserCredentials(identity) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isRunning) {
                return this.errorNotRunning;
            }
            return this.readSwarmUserCredentials(identity);
        });
    }
    getSwarmUserEncryptionPubKey(identity) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isRunning) {
                return this.errorNotRunning;
            }
            const swarmUserCredentials = yield this.readSwarmUserCredentials(identity);
            if (swarmUserCredentials instanceof Error) {
                console.error(swarmUserCredentials);
                return new CAError('Failed to get a credentials of the swarm user');
            }
            return getDataEncryptionPubKeyByCryptoCredentials(swarmUserCredentials);
        });
    }
    getSwarmUserSignPubKey(identity) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isRunning) {
                return this.errorNotRunning;
            }
            const swarmUserCredentials = yield this.readSwarmUserCredentials(identity);
            if (swarmUserCredentials instanceof Error) {
                console.error(swarmUserCredentials);
                return new CAError('Failed to get a credentials of the swarm user');
            }
            return getDataSignPubKeyByCryptoCredentials(swarmUserCredentials);
        });
    }
    getUserIdentity() {
        const userCryptoCredentials = this.getCurrentUserCryptoCredentials();
        if (userCryptoCredentials instanceof Error) {
            return userCryptoCredentials;
        }
        return (getUserIdentityFromCryptoCredentials(userCryptoCredentials) || new CAError('there is no credentials of the current user'));
    }
    getUserEncryptionKeyPair() {
        const userCryptoCredentials = this.getCurrentUserCryptoCredentials();
        if (userCryptoCredentials instanceof Error) {
            return userCryptoCredentials;
        }
        return (getDataEncryptionKeyPairByCryptoCredentials(userCryptoCredentials) ||
            new CAError('there is no credentials of the current user'));
    }
    getUserDataSignKeyPair() {
        const userCryptoCredentials = this.getCurrentUserCryptoCredentials();
        if (userCryptoCredentials instanceof Error) {
            return userCryptoCredentials;
        }
        return (getDataSignKeyPairByCryptoCredentials(userCryptoCredentials) || new CAError('there is no credentials of the current user'));
    }
    getCAUserProfile() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return (_a = this.connectionAuthProvidersPool) === null || _a === void 0 ? void 0 : _a.getCAUserProfile();
        });
    }
    exportCryptoCredentials() {
        return __awaiter(this, void 0, void 0, function* () {
            const userCryptoCredentials = this.getCurrentUserCryptoCredentials();
            if (userCryptoCredentials instanceof Error) {
                return userCryptoCredentials;
            }
            return exportCryptoCredentialsToString(userCryptoCredentials);
        });
    }
    validateOptions(options) {
        if (!options) {
            return new CAError('Options must be provided');
        }
        const validationResult = validateVerboseBySchema(CENTRAL_AUTHORITY_CLASS_OPTIONS_SCHEMA, options);
        if (validationResult instanceof Error) {
            return new CAError(validationResult);
        }
    }
    setOptions(options) {
        const optionsValidationResult = this.validateOptions(options);
        if (optionsValidationResult) {
            return optionsValidationResult;
        }
        this.authProvidersPoolConfiguration = options.authProvidersPool;
        if (options.user.credentials.cryptoCredentials) {
            this.remoteProvidedUserCryptoCredntials = options.user.credentials.cryptoCredentials;
        }
    }
    unsetOptions() {
        this.authProvidersPoolConfiguration = undefined;
        this.remoteProvidedUserCryptoCredntials = undefined;
    }
    setIsRunning() {
        this.isRunningInstance = true;
    }
    unsetIsRunning() {
        this.isRunningInstance = false;
    }
    closeConnectionToAuthProvidersPool() {
        return __awaiter(this, void 0, void 0, function* () {
            const { connectionAuthProvidersPool } = this;
            this.unsetConnectionToAuthProvidersPool();
            if (connectionAuthProvidersPool) {
                const res = yield connectionAuthProvidersPool.close();
                if (res instanceof Error) {
                    console.error(res);
                    return new CAError('Failed to disconnect from auth providers pool');
                }
            }
        });
    }
    closeConnectionToCurrentUserCredentialsStorage() {
        return __awaiter(this, void 0, void 0, function* () {
            const { connectionStorageCurrentUserCrdentials } = this;
            this.unsetConnectionToCurrentUserCredentialsStorage();
            if (connectionStorageCurrentUserCrdentials) {
                const res = yield connectionStorageCurrentUserCrdentials.disconnect();
                if (res instanceof Error) {
                    console.error(res);
                    return new CAError('Failed to disconnect from current user credentials storage');
                }
            }
        });
    }
    closeConnectionSwarmCredentialsProvider() {
        return __awaiter(this, void 0, void 0, function* () {
            const { connectionSwarmCredentialsProvider } = this;
            this.unsetConnectionToSwarmCredentialsStorage();
            if (connectionSwarmCredentialsProvider) {
                const res = yield connectionSwarmCredentialsProvider.disconnect();
                if (res instanceof Error) {
                    console.error(res);
                    return new CAError('Failed to disconnect from swarm credentials provider');
                }
            }
        });
    }
    closeAllConnections() {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield Promise.all([
                this.closeConnectionToAuthProvidersPool(),
                this.closeConnectionToCurrentUserCredentialsStorage(),
                this.closeConnectionSwarmCredentialsProvider(),
            ]);
            const isErrorExists = results.some(checkIsError);
            if (isErrorExists) {
                return new CAError('Failed to close one of the exising connections');
            }
        });
    }
    unsetPropsOnClose() {
        this.unsetIsRunning();
        this.unsetLocallyStoredCredentials();
        this.unsetUserOnAuthResult();
    }
    disconnectAll() {
        return __awaiter(this, void 0, void 0, function* () {
            this.unsetPropsOnClose();
            const closeConnectionsResult = yield this.closeAllConnections();
            if (closeConnectionsResult instanceof Error) {
                console.error(closeConnectionsResult);
                return closeConnectionsResult;
            }
        });
    }
    handleFailAndClose(error) {
        return __awaiter(this, void 0, void 0, function* () {
            const closeConnectionsResult = yield this.disconnectAll();
            if (closeConnectionsResult instanceof Error) {
                console.error(closeConnectionsResult);
                console.error(new CAError('handleFailAndClose::failed to close the instance'));
            }
            return new CAError(error || 'handleFailAndClose::an unknown error caused the instance close');
        });
    }
    getOptionsForAuthProvidersConnectionsPool(options) {
        return {
            providers: options.providersConfigurations,
        };
    }
    getOptionsToAuthorizeUserOnAuthConnection(optionsUserCredentials) {
        return [optionsUserCredentials.authProviderUrl, optionsUserCredentials.credentials, optionsUserCredentials.profile];
    }
    setUserOnAuthResult(caSwarmConnectionsPoolAuthResult) {
        this.remoteProvidedUserCryptoCredntials = caSwarmConnectionsPoolAuthResult.cryptoCredentials;
        this.userProfileOnAuthService = caSwarmConnectionsPoolAuthResult.profile;
        this.authProviderId = caSwarmConnectionsPoolAuthResult.authProviderId;
    }
    unsetUserOnAuthResult() {
        this.remoteProvidedUserCryptoCredntials = undefined;
        this.userProfileOnAuthService = undefined;
    }
    setConnectionToAuthProvidersPool(connectionSwarmPool) {
        this.connectionAuthProvidersPool = connectionSwarmPool;
    }
    unsetConnectionToAuthProvidersPool() {
        this.connectionAuthProvidersPool = undefined;
    }
    connectToAuthProvidersPool(optionsConnectionPool, optionsUserCredentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const optionsAuthProvidersPool = this.getOptionsForAuthProvidersConnectionsPool(optionsConnectionPool);
            let connectionToAuthProvidersPool;
            try {
                connectionToAuthProvidersPool = new CAConnectionsPool(optionsAuthProvidersPool);
            }
            catch (err) {
                console.error(err);
                return new CAError('Failed to create an instance of CAConnectionsPool');
            }
            const authorizationResult = yield connectionToAuthProvidersPool.authorize(...this.getOptionsToAuthorizeUserOnAuthConnection(optionsUserCredentials));
            if (authorizationResult instanceof Error) {
                console.error(authorizationResult);
                return authorizationResult;
            }
            const { userAuthResult } = connectionToAuthProvidersPool;
            if (!userAuthResult) {
                return new CAError('There is no user credntials and profile provided after authorization on auth service');
            }
            if (userAuthResult.authProviderId !== optionsUserCredentials.authProviderUrl) {
                return new Error(`The auth provider id ${userAuthResult.authProviderId} returned in the crypto credentials is not equals to the auth provider url user want to authorized on ${optionsUserCredentials.authProviderUrl}`);
            }
            this.setConnectionToAuthProvidersPool(connectionToAuthProvidersPool);
            this.setUserOnAuthResult(userAuthResult);
        });
    }
    getOptionsForCAStorageCurrentUserCredentials(optionsUser) {
        const { credentials } = optionsUser;
        let userCredentials;
        if (!credentials.password) {
            userCredentials = {
                login: credentials.login,
                session: credentials.session,
            };
        }
        else {
            userCredentials = {
                login: credentials.login,
                password: credentials.password,
                session: credentials.session,
            };
        }
        return {
            credentials: userCredentials,
        };
    }
    setConnectionToCurrentUserCredentialsStorage(connection) {
        this.connectionStorageCurrentUserCrdentials = connection;
    }
    unsetConnectionToCurrentUserCredentialsStorage() {
        this.connectionStorageCurrentUserCrdentials = undefined;
    }
    connectToUserCredentialsStorage(optionsUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const caStorageCurrentUserCredentials = new CentralAuthorityStorageCurrentUserCredentials();
            const optionsCAStorageCurrentUserCredentials = this.getOptionsForCAStorageCurrentUserCredentials(optionsUser);
            const caStorageCurrentUserCredentialsConnectionResult = yield caStorageCurrentUserCredentials.connect(optionsCAStorageCurrentUserCredentials);
            if (caStorageCurrentUserCredentialsConnectionResult instanceof Error) {
                console.error(caStorageCurrentUserCredentialsConnectionResult);
                return new CAError('Failed to connect to the storage of the user credentials');
            }
            this.setConnectionToCurrentUserCredentialsStorage(caStorageCurrentUserCredentials);
        });
    }
    setLocallyStoredCredentials(cryptoCredentials) {
        const validateResult = checkIsValidCryptoCredentials(cryptoCredentials);
        if (!validateResult) {
            return new CAError('The locally stored crypto credentials is not valid');
        }
        this.locallyStoredUserCryptoCredntials = cryptoCredentials;
    }
    unsetLocallyStoredCredentials() {
        this.locallyStoredUserCryptoCredntials = undefined;
    }
    readAndSetLocallyStoredUserCredentials() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.connectionStorageCurrentUserCrdentials) {
                return new CAError('There is no connection to the storage of the user credntials');
            }
            if (!this.authProviderId) {
                return new CAError("The auth provider's identifier, the user was authorized on, is not defined to check the user's crypto credntials for it");
            }
            if (!this.remoteProvidedUserCryptoCredntials) {
                return new CAError('The user crypto credentials returned by the auth provider are not defined');
            }
            let cryptoCredentials = yield this.connectionStorageCurrentUserCrdentials.get(this.remoteProvidedUserCryptoCredntials.userIdentity);
            if (cryptoCredentials instanceof Error) {
                console.error(cryptoCredentials);
                console.error(new CAError(`Failed to read credentials for the user identity ${this.remoteProvidedUserCryptoCredntials.userIdentity}. Try to read it for the auth provider identity ${this.authProviderId}`));
                cryptoCredentials = undefined;
            }
            if (!cryptoCredentials) {
                cryptoCredentials = yield this.connectionStorageCurrentUserCrdentials.getByAuthProvider(this.authProviderId);
                if (cryptoCredentials instanceof Error) {
                    console.error(cryptoCredentials);
                    return new CAError(`Failed to read crypto credentials for the auth provider ${this.authProviderId}`);
                }
            }
            if (!cryptoCredentials) {
                console.warn('There is no credentials stored locally for the current user');
                return;
            }
            if (cryptoCredentials instanceof Error) {
                return new CAError(cryptoCredentials.message);
            }
            return this.setLocallyStoredCredentials(cryptoCredentials);
        });
    }
    compareLocalAndRemoteCredentials() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.remoteProvidedUserCryptoCredntials) {
                return new CAError('There is no credntials for the user provided by the auth provider the user is authentificated on');
            }
            if (!this.locallyStoredUserCryptoCredntials) {
                console.warn('There is no crypto credentials stored for the user identity and the current auth provider id. Nothing to check.');
                return;
            }
            const comparationResult = yield compareCryptoCredentials(this.locallyStoredUserCryptoCredntials, this.remoteProvidedUserCryptoCredntials);
            if (comparationResult instanceof Error) {
                console.error(comparationResult);
                return new CAError('Failed to compare crypto credentials stored locally and got by the auth provider');
            }
            if (comparationResult !== true) {
                return new CAError('The crypto credentials stored in the credentials storage does not equals to the credentials provided be the auth provider');
            }
        });
    }
    storeCryptoCredentialsFromAuthProvider() {
        return __awaiter(this, void 0, void 0, function* () {
            const { connectionStorageCurrentUserCrdentials, locallyStoredUserCryptoCredntials, remoteProvidedUserCryptoCredntials } = this;
            if (locallyStoredUserCryptoCredntials) {
                console.warn('storeCryptoCredentialsFromAuthProvider:: locally stored credentials for the current user is already exists');
                return;
            }
            if (!remoteProvidedUserCryptoCredntials) {
                return new CAError('There was no credentials provided by the auth provider the user is authorized on');
            }
            if (!connectionStorageCurrentUserCrdentials) {
                return new CAError('There is no connection to the storage of the current user credentials');
            }
            const setRemoteCredentialsResult = yield connectionStorageCurrentUserCrdentials.set(remoteProvidedUserCryptoCredntials);
            if (setRemoteCredentialsResult instanceof Error) {
                console.error(setRemoteCredentialsResult);
                return new CAError('Failed to store locally the current user credentials provided by the auth provided');
            }
        });
    }
    createConnectionToSwarmCredentialsStorage() {
        try {
            return new CASwarmCredentialsProvider();
        }
        catch (err) {
            console.error(err);
            return new CAError('Failed to create instance of the Swarm credentials storage');
        }
    }
    getOptionsForSwarmCredentialsStorageConnection() {
        if (!this.connectionAuthProvidersPool) {
            return new CAError('A connection to the swarm pool must be provided for the swarm credentials storage');
        }
        return {
            connections: {
                swarmConnectionPool: this.connectionAuthProvidersPool,
            },
            storageDb: CENTRAL_AUTHORITY_CLASS_SWARM_CREDENTIALS_STORAGE_DB_NAME,
        };
    }
    setConnectionToSwarmCredentialsStorage(connection) {
        this.connectionSwarmCredentialsProvider = connection;
    }
    unsetConnectionToSwarmCredentialsStorage() {
        this.connectionSwarmCredentialsProvider = undefined;
    }
    connectToSwarmCredentialsStorage() {
        return __awaiter(this, void 0, void 0, function* () {
            const connectionToSwarmCredentialsStorage = this.createConnectionToSwarmCredentialsStorage();
            if (connectionToSwarmCredentialsStorage instanceof Error) {
                console.error(connectionToSwarmCredentialsStorage);
                return connectionToSwarmCredentialsStorage;
            }
            const options = this.getOptionsForSwarmCredentialsStorageConnection();
            if (options instanceof Error) {
                console.error(options);
                return options;
            }
            const connectionResult = yield connectionToSwarmCredentialsStorage.connect(options);
            if (connectionResult instanceof Error) {
                console.error(connectionResult);
                return new CAError('Failed to connect to the swarm credentials storage');
            }
            return this.setConnectionToSwarmCredentialsStorage(connectionToSwarmCredentialsStorage);
        });
    }
    readSwarmUserCredentials(identity) {
        return __awaiter(this, void 0, void 0, function* () {
            const { connectionSwarmCredentialsProvider } = this;
            if (!connectionSwarmCredentialsProvider) {
                return new CAError('There is no connection to the swarm credentials provider');
            }
            return yield connectionSwarmCredentialsProvider.get(identity);
        });
    }
    getCurrentUserCryptoCredentials() {
        if (!this.isRunning) {
            return this.errorNotRunning;
        }
        if (!this.remoteProvidedUserCryptoCredntials) {
            return new CAError('There is no user crypyo credentials');
        }
        return this.remoteProvidedUserCryptoCredntials;
    }
}
__decorate([
    dataCachingUtilsCachingDecoratorGlobalCachePerClass(CENTRAL_AUTHORITY_CLASS_SWARM_CREDENTIALS_SWARM_USERS_CREDENTIALS_CACHE_CAPACITY),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CentralAuthority.prototype, "readSwarmUserCredentials", null);
//# sourceMappingURL=central-authority-class.js.map