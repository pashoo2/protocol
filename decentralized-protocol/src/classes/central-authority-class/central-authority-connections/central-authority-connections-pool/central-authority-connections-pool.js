import { __awaiter } from "tslib";
import { normalizeUrl } from "../../../../utils";
import { normalizeCAConnectionAuthProviderURL, validateCAConnectionAuthProviderType, validateCAConnectionAuthProviderConnectionConfiguration, validateCAConnectionAuthProviderUrl, } from '../central-authority-connections-utils/central-authority-connections-utils';
import { getConnectionConstructorAuthProviderType } from '../central-authority-connections-utils/central-authority-connections-utils.common/central-authority-connections-utils.common';
import { ICentralAuthorityUserProfile } from "../../central-authority-class-types/central-authority-class-types";
import { CA_CONNECTION_STATUS } from '../central-authority-connections-const/central-authority-connections-const';
import { checkIsValidCryptoCredentials } from '../../central-authority-validators/central-authority-validators-crypto-keys/central-authority-validators-crypto-keys';
import CentralAuthorityIdentity from '../../central-authority-class-user-identity/central-authority-class-user-identity';
import { CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME } from '../../central-authority-class-user-identity/central-authority-class-user-identity.const';
import { compareAuthProvidersIdentities } from '../../central-authority-utils-common/central-authority-utils-crypto-credentials/central-authority-utils-crypto-credentials';
export class CAConnectionsPool {
    constructor(options) {
        this.providersConnectionState = {};
        this.getCAUserProfile = () => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const authConnection = this.authConnection;
            if (!authConnection) {
                return;
            }
            return (_a = authConnection.connection) === null || _a === void 0 ? void 0 : _a.getCAUserProfile();
        });
        this.addAuthProvider = (authProviderConnectionConfiguration) => {
            if (!authProviderConnectionConfiguration) {
                throw new Error('Configuration for the auth provider is not defined');
            }
            if (typeof authProviderConnectionConfiguration !== 'object') {
                throw new Error('Configuration must be an object');
            }
            const { caProvider, caProviderUrl, options } = authProviderConnectionConfiguration;
            if (caProvider == null) {
                throw new Error('Provider type must be defined');
            }
            if (!validateCAConnectionAuthProviderType(caProvider)) {
                throw new Error('The auth provider type is wrong');
            }
            const authProviderUrlNormalized = normalizeCAConnectionAuthProviderURL(caProviderUrl);
            const { providersConnectionState } = this;
            if (authProviderUrlNormalized instanceof Error) {
                throw authProviderUrlNormalized;
            }
            if (providersConnectionState[authProviderUrlNormalized]) {
                throw new Error(`Configuration was already set for the auth provider ${authProviderUrlNormalized}`);
            }
            if (!options) {
                throw new Error(`Configuration for the auth provider ${authProviderUrlNormalized} is not specified`);
            }
            if (!validateCAConnectionAuthProviderConnectionConfiguration(caProvider, options)) {
                throw new Error(`The configuration for the auth provider ${authProviderUrlNormalized} is not valid`);
            }
            const setAuthProviderConnectionStateResult = this.updateStateAuthProvider({
                caProvider,
                caProviderUrl,
                options,
            });
            if (setAuthProviderConnectionStateResult instanceof Error) {
                throw setAuthProviderConnectionStateResult;
            }
        };
        this.setOptions(options);
    }
    get authConnection() {
        const { providersConnectionState } = this;
        const providersConnectionsStates = Object.values(providersConnectionState);
        let idx = 0;
        let authProviderConnection;
        let authProviderUrl;
        const len = providersConnectionsStates.length;
        while (idx < len) {
            ({ connection: authProviderConnection, caProviderUrl: authProviderUrl } = providersConnectionsStates[idx++]);
            if (authProviderConnection && authProviderConnection.status === CA_CONNECTION_STATUS.AUTHORIZED) {
                return {
                    connection: authProviderConnection,
                    authProviderId: authProviderUrl || authProviderConnection.authProviderURL,
                };
            }
        }
    }
    getConnection(authProvider) {
        return this.connect(authProvider);
    }
    connect(authProviderUrl, isAuthentificateAnonymousely = true) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!validateCAConnectionAuthProviderUrl(authProviderUrl)) {
                return new Error('The url provided as the auth provider service url is not valid');
            }
            const currentConnectionWithAuthProvider = this.getActiveConnectionWithAuthProvider(authProviderUrl);
            if (currentConnectionWithAuthProvider instanceof Error) {
                console.error(currentConnectionWithAuthProvider);
                return new Error(`Failed to resolve an active connection with the provider ${authProviderUrl}`);
            }
            if (currentConnectionWithAuthProvider) {
                return currentConnectionWithAuthProvider;
            }
            const connectionWithAuthProvider = yield this.connectWithAuthProvider(authProviderUrl);
            if (connectionWithAuthProvider instanceof Error) {
                return connectionWithAuthProvider;
            }
            if (isAuthentificateAnonymousely) {
                const ananymousResult = yield connectionWithAuthProvider.signInAnonymousely();
                if (ananymousResult instanceof Error) {
                    return ananymousResult;
                }
                return yield this.addConectionWithProvider(authProviderUrl, connectionWithAuthProvider);
            }
            return connectionWithAuthProvider;
        });
    }
    authorize(authProviderUrl, signUpCredentials, profile) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!validateCAConnectionAuthProviderUrl(authProviderUrl)) {
                return new Error('The url provided as the auth provider service url is not valid');
            }
            if (this.userAuthResult) {
                const signOutResult = yield this.signOut();
                if (signOutResult instanceof Error) {
                    console.error(signOutResult);
                    return new Error('The user is already authorized on the auth provider service, and failed to sign out from it');
                }
            }
            const currentConnectionWithProviderAuthOn = this.authConnection;
            const normalizedUrl = normalizeUrl(authProviderUrl);
            if (normalizedUrl instanceof Error) {
                console.error(normalizedUrl);
                return new Error('Failed to normalize the url of the auth provider');
            }
            if (currentConnectionWithProviderAuthOn) {
                const { authProviderId: currentAuthProviderUrl, connection } = currentConnectionWithProviderAuthOn;
                const normalizedUrlAuthProviderCurrent = normalizeUrl(currentAuthProviderUrl);
                if (normalizedUrlAuthProviderCurrent !== normalizedUrl) {
                    return new Error(`Already authorized on the ${normalizedUrlAuthProviderCurrent} service, differ from the requested ${authProviderUrl}`);
                }
                return connection;
            }
            const connectionWithAuthProvider = yield this.connect(authProviderUrl, false);
            if (connectionWithAuthProvider instanceof Error) {
                console.error(connectionWithAuthProvider);
                return new Error(`Failed to connect with the auth provider ${authProviderUrl}`);
            }
            const authResult = yield connectionWithAuthProvider.authorize(signUpCredentials, profile);
            if (authResult instanceof Error) {
                const disconnectFromTheConnectionResult = yield connectionWithAuthProvider.disconnect();
                if (disconnectFromTheConnectionResult instanceof Error) {
                    console.error(disconnectFromTheConnectionResult);
                    console.error(new Error('Failed to disconnect form the auth provider which failed to authorize on'));
                }
                console.error(`Failed to authorize with the auth provider ${authProviderUrl}`);
                return authResult;
            }
            const addConnectionResult = yield this.addConectionWithProvider(authProviderUrl, connectionWithAuthProvider);
            if (addConnectionResult instanceof Error) {
                try {
                    yield connectionWithAuthProvider.disconnect();
                }
                catch (err) {
                    console.error('Failed to disconnect', err);
                }
                return addConnectionResult;
            }
            this.setAuthResult(authProviderUrl, authResult);
            return connectionWithAuthProvider;
        });
    }
    disconnect(authProviderUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentConnectionWithAuthProvider = this.getConnectionWithAuthProvider(authProviderUrl);
            if (currentConnectionWithAuthProvider instanceof Error) {
                return currentConnectionWithAuthProvider;
            }
            if (currentConnectionWithAuthProvider) {
                const disconnectionResult = yield currentConnectionWithAuthProvider.disconnect();
                if (disconnectionResult instanceof Error) {
                    console.error(disconnectionResult);
                    return new Error(`Failed to disconnect from the auth provider ${authProviderUrl}`);
                }
            }
            return this.unsetConnectionWithAuthProvider(authProviderUrl);
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            const { providersConnectionState } = this;
            const providerConnectionStateValues = Object.values(providersConnectionState);
            const disconnectResults = [];
            const len = providerConnectionStateValues.length;
            let idx = 0;
            let connectionToAuthProviderStateDesc;
            let connectionToAuthProvider;
            let errorMessage = '';
            while (idx < len) {
                connectionToAuthProviderStateDesc = providerConnectionStateValues[idx++];
                ({ connection: connectionToAuthProvider } = connectionToAuthProviderStateDesc);
                idx += 1;
                if (connectionToAuthProvider) {
                    const connectionToAuthProviderUrl = connectionToAuthProviderStateDesc.caProviderUrl;
                    if (connectionToAuthProvider.status !== CA_CONNECTION_STATUS.DISCONNECTED) {
                        disconnectResults.push(connectionToAuthProvider
                            .disconnect()
                            .then((result) => {
                            if (result instanceof Error) {
                                console.error(result);
                                errorMessage += `/nThe error has occured when disconnect from the auth provider ${connectionToAuthProviderUrl}`;
                            }
                            else {
                                this.unsetConnectionWithAuthProvider(connectionToAuthProviderUrl);
                            }
                        })
                            .catch((err) => {
                            console.error(err);
                            errorMessage += `/nCrashed while disconnect from the auth provider ${connectionToAuthProviderUrl}`;
                        }));
                    }
                    this.unsetConnectionWithAuthProvider(connectionToAuthProviderUrl);
                }
            }
            yield Promise.all(disconnectResults);
            if (errorMessage) {
                return new Error(errorMessage);
            }
        });
    }
    signOut() {
        return __awaiter(this, void 0, void 0, function* () {
            const { authConnection } = this;
            this.unsetAuthResult();
            if (authConnection) {
                const { connection, authProviderId: authProviderUrl } = authConnection;
                if (connection) {
                    const disconnectResult = yield this.disconnect(authProviderUrl);
                    if (disconnectResult instanceof Error) {
                        console.error(disconnectResult);
                        return new Error(`Failed to disconnect from the auth procider ${authProviderUrl} on sign out from it`);
                    }
                }
            }
        });
    }
    setAuthResult(authProviderId, authResult) {
        const { cryptoCredentials } = authResult;
        const validationResult = checkIsValidCryptoCredentials(cryptoCredentials);
        if (!validationResult) {
            return new Error('The crypto credentials are not valid');
        }
        const userIdentity = new CentralAuthorityIdentity(cryptoCredentials.userIdentity);
        if (userIdentity.identityDescription instanceof Error) {
            return new Error('The user identity is not valid');
        }
        if (!compareAuthProvidersIdentities(userIdentity.identityDescription[CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME], authProviderId)) {
            return new Error(`
        The auth provider url from the auth crdentials ${userIdentity.identityDescription[CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]} is not equals to the provider the user authorized on ${authProviderId}
      `);
        }
        this.userAuthResult = Object.assign(Object.assign({}, authResult), { authProviderId });
    }
    unsetAuthResult() {
        this.userAuthResult = undefined;
    }
    getAuthProviderStateDesc(authProviderUrl) {
        const normalizedUrl = normalizeUrl(authProviderUrl);
        if (normalizedUrl instanceof Error) {
            console.error(normalizedUrl);
            return new Error('The url is not valid');
        }
        const { providersConnectionState } = this;
        return providersConnectionState[normalizedUrl];
    }
    addConectionWithProvider(authProviderUrl, connectionWithAuthProvider) {
        return __awaiter(this, void 0, void 0, function* () {
            const setConnectionInAuhProviderConnectionStatesStore = this.setConnectionWithAuthProvider(authProviderUrl, connectionWithAuthProvider);
            if (setConnectionInAuhProviderConnectionStatesStore instanceof Error) {
                console.error(setConnectionInAuhProviderConnectionStatesStore);
                const disconnectResult = yield connectionWithAuthProvider.disconnect();
                if (disconnectResult instanceof Error) {
                    console.error(disconnectResult);
                }
                return new Error('Failed to set connection with auth provider');
            }
            return connectionWithAuthProvider;
        });
    }
    getActiveConnectionWithAuthProvider(authProviderUrl) {
        const authProviderState = this.getAuthProviderStateDesc(authProviderUrl);
        if (authProviderState instanceof Error) {
            return authProviderState;
        }
        if (authProviderState) {
            const { connection } = authProviderState;
            if (connection && connection.status !== CA_CONNECTION_STATUS.DISCONNECTED) {
                return connection;
            }
        }
    }
    getConnectionWithAuthProvider(authProviderUrl) {
        const authProviderState = this.getAuthProviderStateDesc(authProviderUrl);
        if (authProviderState instanceof Error) {
            return authProviderState;
        }
        if (authProviderState) {
            return authProviderState.connection;
        }
    }
    updateStateAuthProvider(authProviderConnectionState) {
        const { caProviderUrl } = authProviderConnectionState;
        if (!caProviderUrl) {
            return new Error('An url of the auth provider must be specified');
        }
        const authProviderUrlNormalized = normalizeCAConnectionAuthProviderURL(caProviderUrl);
        if (authProviderUrlNormalized instanceof Error) {
            return authProviderUrlNormalized;
        }
        const { providersConnectionState } = this;
        const existingState = providersConnectionState[authProviderUrlNormalized];
        if (!existingState) {
            providersConnectionState[caProviderUrl] = authProviderConnectionState;
        }
        else {
            Object.assign(existingState, authProviderConnectionState);
        }
    }
    setConnectionWithAuthProvider(authProviderUrl, connection) {
        const authProviderUrlNormalized = normalizeUrl(authProviderUrl);
        if (authProviderUrlNormalized instanceof Error) {
            console.error(authProviderUrlNormalized);
            return new Error('The url is not valid');
        }
        if (!connection) {
            return new Error(`Connection with the auth provider ${authProviderUrl} must be specified`);
        }
        if (typeof connection.authorize !== 'function' || typeof connection.connect !== 'function') {
            return new Error('The instance of the CAConnection is not valid');
        }
        if (connection.status === CA_CONNECTION_STATUS.DISCONNECTED) {
            return new Error('The connection must be in active state');
        }
        const existingConnection = this.getActiveConnectionWithAuthProvider(authProviderUrl);
        if (existingConnection instanceof Error) {
            return existingConnection;
        }
        if (existingConnection) {
            return new Error(`Connection with the ${authProviderUrl} is already exists`);
        }
        return this.updateStateAuthProvider({
            connection,
            caProviderUrl: authProviderUrl,
        });
    }
    unsetConnectionWithAuthProvider(authProviderUrl) {
        return this.updateStateAuthProvider({
            caProviderUrl: authProviderUrl,
            connection: undefined,
        });
    }
    connectWithAuthProvider(authProviderUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const normalizedAuthProviderUrl = normalizeUrl(authProviderUrl);
            if (normalizedAuthProviderUrl instanceof Error) {
                console.error(normalizedAuthProviderUrl);
                return new Error('The url provided for the auth provider is not valid');
            }
            const stateOfAuthProvider = this.getAuthProviderStateDesc(authProviderUrl);
            if (stateOfAuthProvider instanceof Error) {
                console.error(stateOfAuthProvider);
                return new Error(`The configuration for the ${authProviderUrl} is not valid`);
            }
            if (!stateOfAuthProvider) {
                return new Error(`The url provided ${authProviderUrl} is not known`);
            }
            const { options, caProvider } = stateOfAuthProvider;
            if (!options) {
                return new Error(`Connection options is not specified for the auth provider ${authProviderUrl}`);
            }
            if (caProvider == null) {
                return new Error('Auth provider type is not specified in the current state');
            }
            const ConnectionConstructor = getConnectionConstructorAuthProviderType(caProvider);
            if (!ConnectionConstructor) {
                return new Error(`There is no constructor class for the auth provider ${authProviderUrl}`);
            }
            if (ConnectionConstructor instanceof Error) {
                console.error(ConnectionConstructor);
                return new Error(`An error has occurred on define constructor class for the auth provider ${authProviderUrl}`);
            }
            let connectionWithAuthProvider;
            try {
                connectionWithAuthProvider = new ConnectionConstructor();
            }
            catch (err) {
                console.error(err);
                return new Error('The error has occurred when construct the connection');
            }
            const connectionResult = yield connectionWithAuthProvider.connect(options);
            if (connectionResult instanceof Error) {
                console.error(connectionResult);
                return new Error(`Failed to connect with the auth provider ${authProviderUrl}`);
            }
            return connectionWithAuthProvider;
        });
    }
    setOptionsOfAuthProviders(providers) {
        if (!providers) {
            throw new Error('Providers property must be specified');
        }
        if (!(providers instanceof Array)) {
            throw new Error('Providers must be an instance of Array');
        }
        if (!providers.length) {
            throw new Error('Providers property must not be an empty array');
        }
        providers.forEach(this.addAuthProvider);
    }
    setOptions(options) {
        const { providers } = options;
        this.setOptionsOfAuthProviders(providers);
    }
}
//# sourceMappingURL=central-authority-connections-pool.js.map