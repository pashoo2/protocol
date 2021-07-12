import { __awaiter } from "tslib";
import { CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME } from "../central-authority-class-user-identity/central-authority-class-user-identity.const";
import { CentralAuthorityIdentity } from "../central-authority-class-user-identity/central-authority-class-user-identity";
import { TCentralAuthorityUserCryptoCredentials } from "../central-authority-class-types/central-authority-class-types";
import { CentralAuthorityIdentityCredentialsStorage } from "../central-authority-storage-local/central-authority-storage-swarm-users-auth/central-authority-storage-swarm-users-identity-credentials/central-authority-storage-swarm-users-identity-credentials";
export class CASwarmCredentialsProvider {
    constructor() {
        this.isRunning = false;
        this.connect = (options) => __awaiter(this, void 0, void 0, function* () {
            if (this.isRunning) {
                console.warn('The instance is already running');
                return;
            }
            const setOptionsResult = this.setOptions(options);
            if (setOptionsResult instanceof Error) {
                return setOptionsResult;
            }
            const { connections } = options;
            yield this.runConnections(connections);
            this.setRunningFlag();
            this.options = options;
        });
        this.disconnect = () => __awaiter(this, void 0, void 0, function* () {
            if (!this.isRunning) {
                return;
            }
            const [resDisconnectFromCredentialsStorage, resultDisconnectFromSwarmConnectionsPool] = yield Promise.all([
                this.disconnectFromCredentialsStorage(),
                this.disconnectFromSwarmConnectionsPool(),
            ]);
            let error = '';
            if (resDisconnectFromCredentialsStorage instanceof Error) {
                console.error(resDisconnectFromCredentialsStorage);
                error = 'Failed to disconnect from the credentials storage';
            }
            if (resultDisconnectFromSwarmConnectionsPool instanceof Error) {
                console.error(resultDisconnectFromSwarmConnectionsPool);
                error = `${error}/nFailed to disconnect from the swarm connections pool`;
            }
            this.unsetConnectionsUsed();
            this.unsetRunningFlag();
            if (error) {
                return new Error(error);
            }
        });
    }
    get(identity) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isRunning) {
                return new Error('The instance is not running');
            }
            const identityInstance = this.getUserIdentityInstance(identity);
            if (identityInstance instanceof Error) {
                return identityInstance;
            }
            const credentialsFromLocalCredentialsStorage = yield this.readCredentialsFromLocalCredentialsStorage(identityInstance);
            if (credentialsFromLocalCredentialsStorage instanceof Error) {
                console.error(credentialsFromLocalCredentialsStorage);
                console.error(new Error('Failed to read credentials from the local credentials storage'));
            }
            if (credentialsFromLocalCredentialsStorage) {
                return credentialsFromLocalCredentialsStorage;
            }
            const crdentialsFromSwarm = yield this.readCredentialsFromTheSwarm(identityInstance);
            if (crdentialsFromSwarm instanceof Error) {
                console.error(crdentialsFromSwarm);
                return new Error('Failed to get credentials from the credentials provider');
            }
            if (crdentialsFromSwarm) {
                const result = yield this.setCredentialsInCredentialsStorageNoCheckPrivateKey(crdentialsFromSwarm);
                if (result instanceof Error) {
                    console.error(result);
                }
            }
            return crdentialsFromSwarm;
        });
    }
    validateOptions(options) {
        if (!options) {
            return new Error('An options must be provided');
        }
        if (typeof options !== 'object') {
            return new Error('The options provided must be an object');
        }
        const { connections, storageDb } = options;
        if (!connections) {
            return new Error('The connections parameter is absent in the options object');
        }
        if (!connections.swarmConnectionPool) {
            return new Error('Connection to the swarm connections pool is not provided in the options');
        }
        if (storageDb && typeof storageDb !== 'string') {
            return new Error('The storage db name must be a string');
        }
    }
    setOptions(options) {
        const validationResult = this.validateOptions(options);
        if (validationResult instanceof Error) {
            return validationResult;
        }
        this.options = options;
    }
    setRunningFlag() {
        this.isRunning = true;
    }
    unsetRunningFlag() {
        this.isRunning = false;
    }
    getAuthProviderIdByUserIdentity(userIdentity) {
        const { identityDescription } = userIdentity;
        if (identityDescription instanceof Error) {
            return new Error('The identity is not valid');
        }
        return identityDescription[CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME];
    }
    unsetConnectionsUsed() {
        this.connectionSwarmConnectionPool = undefined;
        this.connectionLocalCredentialsStorage = undefined;
    }
    connectToTheLocalCredentialsStorage() {
        return __awaiter(this, void 0, void 0, function* () {
            const localCredentialsStorageInstance = yield this.startConnectionLocalCredentialsStorage();
            if (localCredentialsStorageInstance instanceof Error) {
                console.error(localCredentialsStorageInstance);
                return new Error('Failed to start an instance of the Local credentials storage');
            }
            this.connectionLocalCredentialsStorage = localCredentialsStorageInstance;
        });
    }
    runConnections(connections) {
        return __awaiter(this, void 0, void 0, function* () {
            const { swarmConnectionPool, localCredentialsStorage } = connections;
            if (!swarmConnectionPool) {
                return new Error('A connection to the Swarm connections pool must be provided in the options');
            }
            this.connectionSwarmConnectionPool = swarmConnectionPool;
            if (!localCredentialsStorage) {
                return this.connectToTheLocalCredentialsStorage();
            }
        });
    }
    getOptionsForLocalCredentialsStorage() {
        if (this.options && this.options.storageDb) {
            return {
                storageName: this.options.storageDb || '',
            };
        }
    }
    startConnectionLocalCredentialsStorage() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connectionLocalCredentialsStorage = new CentralAuthorityIdentityCredentialsStorage();
                const connectToCredentialsStorageResult = yield connectionLocalCredentialsStorage.connect(this.getOptionsForLocalCredentialsStorage());
                if (connectToCredentialsStorageResult instanceof Error) {
                    console.error(connectToCredentialsStorageResult);
                    return new Error('Failed to connect with the local credentials storage');
                }
                return connectionLocalCredentialsStorage;
            }
            catch (err) {
                console.error(err);
                return new Error('An unknown error has thrown on starting a new connection to the local credentials storage');
            }
        });
    }
    disconnectFromCredentialsStorage() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = this.connectionLocalCredentialsStorage;
            if (!connection) {
                console.warn('There is no active connection to the credentials storage');
                return;
            }
            const disconnectResult = yield connection.disconnect();
            if (disconnectResult instanceof Error) {
                return disconnectResult;
            }
        });
    }
    disconnectFromSwarmConnectionsPool() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = this.connectionSwarmConnectionPool;
            if (!connection) {
                console.warn('There is no active connection to the swarm connections pool');
                return;
            }
        });
    }
    getUserIdentityInstance(userIdentity) {
        const identityInstance = new CentralAuthorityIdentity(userIdentity);
        if (!identityInstance.isValid) {
            return new Error('The identity provided is not valid');
        }
        return identityInstance;
    }
    readCredentialsFromLocalCredentialsStorage(userIdentity) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.connectionLocalCredentialsStorage) {
                console.warn('There is no connection to the local credentials storage - start a new one');
                const connectionResult = yield this.connectToTheLocalCredentialsStorage();
                if (connectionResult instanceof Error || !this.connectionLocalCredentialsStorage) {
                    console.error(connectionResult);
                    return new Error('Failed to start a new connection to the local credentials storage');
                }
            }
            return this.connectionLocalCredentialsStorage.getCredentials(userIdentity);
        });
    }
    readCredentialsFromTheSwarm(userIdentity) {
        return __awaiter(this, void 0, void 0, function* () {
            const connectionSwarm = this.connectionSwarmConnectionPool;
            if (!connectionSwarm) {
                return new Error('There is no connection to the swarm');
            }
            const authProviderId = this.getAuthProviderIdByUserIdentity(userIdentity);
            if (authProviderId instanceof Error) {
                return authProviderId;
            }
            const connection = yield connectionSwarm.connect(authProviderId);
            if (connection instanceof Error) {
                console.error(connection);
                return new Error(`Failed to connect to the auth provider ${authProviderId}`);
            }
            return connection.getUserCredentials(String(userIdentity));
        });
    }
    setCredentialsInCredentialsStorage(credentials, isCheckPrivateKey = true) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.connectionLocalCredentialsStorage) {
                console.warn('There is no connection to the local credentials storage - start a new one');
                const connectionResult = yield this.connectToTheLocalCredentialsStorage();
                if (connectionResult instanceof Error || !this.connectionLocalCredentialsStorage) {
                    console.error(connectionResult);
                    return new Error('Failed to start a new connection to the local credentials storage');
                }
            }
            const setCredntialsResult = yield this.connectionLocalCredentialsStorage.setCredentialsNoCheckPrivateKey(credentials);
            if (setCredntialsResult instanceof Error) {
                console.error(setCredntialsResult);
                return new Error('Failed to store crdentials got from the swarm');
            }
        });
    }
    setCredentialsInCredentialsStorageNoCheckPrivateKey(credentials) {
        return this.setCredentialsInCredentialsStorage(credentials, false);
    }
}
//# sourceMappingURL=central-authority-swarm-credentials-provider.js.map