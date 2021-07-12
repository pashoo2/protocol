import { __awaiter } from "tslib";
import React from 'react';
import { connectToSwarmWithDBOUtil } from './connect-to-swarm-with-dbo-utils/connect-to-swarm-with-dbo-utils';
import { CONNECT_TO_SWARM_STORAGE_DEFAULT_MESSAGE_BODY } from '../const/connect-to-swarm.const';
import { CONNECT_TO_SWARM_AUTH_CREDENTIALS_SESSION_STORAGE_KEY } from '../const/connect-to-swarm.const';
import { ESwarmStoreConnectorOrbitDbDatabaseMethodNames, ISwarmStoreDatabasesCommonStatusList, ESwarmStoreEventNames, } from "../../classes";
import { SwarmStoreDbComponent } from '../swarm-store-db-component/swarm-store-db-component';
import { ESwarmMessageStoreEventNames } from '../../classes/swarm-message-store/swarm-message-store.const';
import { UserProfile } from '../userProfile/userProfile';
import { SwarmMessagesDatabaseComponent } from '../swarm-messages-database-component/swarm-messages-database-component';
import { swarmMessagesDatabaseConnectedFabricMain } from '../../classes/swarm-messages-database/swarm-messages-database-fabrics/swarm-messages-database-intstance-fabric-main/swarm-messages-database-intstance-fabric-main';
import { createSwarmMessagesDatabaseMessagesCollectorInstance } from '../../classes/swarm-messages-database/swarm-messages-database-subclasses/swarm-messages-database-messages-collector/swarm-messages-database-messages-collector';
export class ConnectToSwarmWithDBO extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            isConnecting: false,
            messagingSending: undefined,
            error: undefined,
            connectionBridge: undefined,
            userId: undefined,
            dbRemoved: false,
            dbRemoving: false,
            messages: [],
            messagesReceived: new Map(),
            databasesList: undefined,
            swarmStoreMessagesDbOptionsList: [],
            databaseOpeningStatus: false,
            secretStorage: undefined,
            userProfileData: undefined,
            userCredentialsActive: undefined,
            isDatabaseListVisible: false,
        };
        this.sendSwarmMessage = () => __awaiter(this, void 0, void 0, function* () {
            throw new Error('sendSwarmMessage is not implemented yet');
        });
        this.sendPrivateSwarmMessage = () => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                yield ((_a = this.swarmMessageStore) === null || _a === void 0 ? void 0 : _a.addMessage(this.mainDatabaseName, Object.assign(Object.assign({}, CONNECT_TO_SWARM_STORAGE_DEFAULT_MESSAGE_BODY), { receiverId: this.props.userIdReceiverSwarmMessages })));
            }
            catch (err) {
                console.error(err);
            }
        });
        this.toggleMessagesSending = (isPrivate = false) => {
            this.setState((state) => {
                if (state.messagingSending) {
                    clearInterval(state.messagingSending);
                    return {
                        messagingSending: undefined,
                    };
                }
                const method = isPrivate ? this.sendPrivateSwarmMessage : this.sendSwarmMessage;
                void method();
                return {
                    messagingSending: setInterval(method, 1000),
                };
            });
        };
        this.handleDatabaseRemove = () => __awaiter(this, void 0, void 0, function* () {
            const { swarmMessageStore: swarmMessageStoreOrUndefined } = this;
            if (swarmMessageStoreOrUndefined) {
                this.setState({
                    dbRemoving: true,
                });
                yield swarmMessageStoreOrUndefined.dropDatabase(this.mainDatabaseName);
                this.setState({
                    dbRemoved: true,
                    dbRemoving: false,
                });
            }
        });
        this.connectToDb = () => __awaiter(this, void 0, void 0, function* () {
            const { swarmMessageStore: swarmMessageStoreOrUndefined } = this;
            if (swarmMessageStoreOrUndefined) {
                yield swarmMessageStoreOrUndefined.openDatabase(this.mainDatabaseOptions);
                this.setState({
                    dbRemoved: false,
                });
            }
        });
        this.loadNextMessages = () => __awaiter(this, void 0, void 0, function* () {
            const { swarmMessageStore: swarmMessageStoreOrUndefined } = this;
            if (swarmMessageStoreOrUndefined) {
                const result = yield swarmMessageStoreOrUndefined.request(this.mainDatabaseName, ESwarmStoreConnectorOrbitDbDatabaseMethodNames.load, 10);
                console.log(result);
            }
        });
        this.handleDatabasesListUpdate = (databasesList) => {
            this.setState({
                databasesList: Object.assign({}, databasesList),
            });
        };
        this.handleMessage = (dbName, message, id, key) => {
            const { messagesReceived } = this.state;
            const messagesMap = messagesReceived.get(dbName) || new Map();
            if (!messagesMap.get(id)) {
                messagesMap.set(id, {
                    message,
                    id,
                    key,
                });
                messagesReceived.set(dbName, messagesMap);
                this.forceUpdate();
            }
        };
        this.connectToSwarm = (credentials) => __awaiter(this, void 0, void 0, function* () {
            var _b, _c, _d;
            if (!credentials) {
                throw new Error('Credentials should be defined to connect to swarm');
            }
            this.setState({
                isConnecting: true,
                userCredentialsActive: credentials,
            });
            try {
                const connectionBridge = yield connectToSwarmWithDBOUtil(this.props.connectionBridgeOptions, credentials);
                sessionStorage.setItem(CONNECT_TO_SWARM_AUTH_CREDENTIALS_SESSION_STORAGE_KEY, 'true');
                const userId = (_b = connectionBridge === null || connectionBridge === void 0 ? void 0 : connectionBridge.centralAuthorityConnection) === null || _b === void 0 ? void 0 : _b.getUserIdentity();
                const userProfileData = yield ((_c = connectionBridge === null || connectionBridge === void 0 ? void 0 : connectionBridge.centralAuthorityConnection) === null || _c === void 0 ? void 0 : _c.getCAUserProfile());
                this.setState({
                    connectionBridge,
                    userId,
                    databasesList: (_d = connectionBridge.swarmMessageStore) === null || _d === void 0 ? void 0 : _d.databases,
                    secretStorage: connectionBridge.secretStorage,
                    userProfileData,
                });
                this.setListenersConnectionBridge(connectionBridge);
                const { dbo } = this.props;
                if (!dbo) {
                    throw new Error('Database options shoul be defined to connect with it');
                }
                yield this.handleOpenNewSwarmStoreMessagesDatabase(dbo);
            }
            catch (error) {
                this.setState({
                    error,
                });
            }
        });
        this.handleOpenDatabase = (dbName) => __awaiter(this, void 0, void 0, function* () {
            var _e;
            try {
                this.setState({
                    databaseOpeningStatus: true,
                });
                yield ((_e = this.swarmMessageStore) === null || _e === void 0 ? void 0 : _e.openDatabase(Object.assign(Object.assign({}, this.defaultDbOptions), { dbName: dbName || this.defaultDbOptions.dbName })));
            }
            catch (err) {
                console.error(err);
            }
            finally {
                this.setState({
                    databaseOpeningStatus: false,
                });
            }
        });
        this.handleClickOpenNewSwarmStoreMessagesDatabase = () => __awaiter(this, void 0, void 0, function* () {
            yield this.handleOpenNewSwarmStoreMessagesDatabase();
        });
        this.handleOpenNewDatabase = () => __awaiter(this, void 0, void 0, function* () {
            const dbName = window.prompt('Enter database name', '');
            if (dbName) {
                yield this.handleOpenDatabase(dbName);
            }
        });
        this.handleOpenNewSwarmStoreMessagesDatabase = (dbOptionsToConnectImmediate) => __awaiter(this, void 0, void 0, function* () {
            const dbNameToOpen = dbOptionsToConnectImmediate === null || dbOptionsToConnectImmediate === void 0 ? void 0 : dbOptionsToConnectImmediate.dbName;
            const dbName = dbNameToOpen || window.prompt('Enter database name', '');
            if (dbName) {
                const dbOptions = Object.assign(Object.assign(Object.assign({}, this.defaultDbOptions), dbOptionsToConnectImmediate), { dbName: dbName || this.defaultDbOptions.dbName });
                this.setState(({ swarmStoreMessagesDbOptionsList }) => ({
                    swarmStoreMessagesDbOptionsList: [...swarmStoreMessagesDbOptionsList, dbOptions],
                }));
            }
        });
        this.toggleDatabasesListVisible = () => {
            this.setState((state) => ({
                isDatabaseListVisible: !state.isDatabaseListVisible,
            }));
        };
        this._getOptionsForSwarmMessagesDatabaseConnectedWithoutDatabaseOptionsFabric = () => {
            const { connectionBridge, userId } = this.state;
            const { swarmMessagesDatabaseCacheOptions } = this.props;
            if (!connectionBridge) {
                throw new Error('A connection bridge instance is not exists in the state');
            }
            const { swarmMessageStore } = connectionBridge;
            if (!swarmMessageStore) {
                throw new Error('A connection bridge have no an active instance of the Swarm message store');
            }
            if (!userId) {
                throw new Error('User id should be defined');
            }
            return {
                cacheOptions: swarmMessagesDatabaseCacheOptions,
                swarmMessageStore,
                swarmMessagesCollector: this.getSwarmMessagesCollector(),
                user: {
                    userId,
                },
            };
        };
        this.getOptionsForSwarmMessagesDatabaseConnectedFabric = (dbsOptions) => {
            const options = this._getOptionsForSwarmMessagesDatabaseConnectedWithoutDatabaseOptionsFabric();
            return Object.assign(Object.assign({}, options), { dbOptions: Object.assign({}, dbsOptions) });
        };
        this.createDatabaseConnector = (dbOptions) => __awaiter(this, void 0, void 0, function* () {
            return yield swarmMessagesDatabaseConnectedFabricMain(this.getOptionsForSwarmMessagesDatabaseConnectedFabric(dbOptions));
        });
    }
    get defaultDbOptions() {
        const { dbo } = this.props;
        if (!dbo) {
            throw new Error('Ther is no options passed in the props');
        }
        return dbo;
    }
    get swarmMessageStore() {
        const { connectionBridge } = this.state;
        if (!connectionBridge) {
            throw new Error('There is no connection to the connection bridge instance');
        }
        const { swarmMessageStore } = connectionBridge;
        if (!swarmMessageStore) {
            throw new Error('There is no connection to a swarm message stor');
        }
        return swarmMessageStore;
    }
    get mainDatabaseOptions() {
        if (!this.props.dbo) {
            throw new Error('The main database options are not defined in the props');
        }
        return this.props.dbo;
    }
    get mainDatabaseName() {
        return this.mainDatabaseOptions.dbName;
    }
    renderConnectToDatabase() {
        return (<div>
        <h2>Database connection</h2>
        <button onClick={this.handleDatabaseRemove}>Remove the database</button>
      </div>);
    }
    renderLoadMessages() {
        return (<div>
        <button onClick={this.loadNextMessages}>Load next 10 messages</button>
      </div>);
    }
    renderConnectedState() {
        const { messagingSending, userId, dbRemoved, dbRemoving } = this.state;
        if (dbRemoved) {
            return <div onClick={this.connectToDb}>Connect to database</div>;
        }
        if (dbRemoving) {
            return <span>Database removing...</span>;
        }
        return (<div>
        <div>Is connected with user identity ${userId}</div>
        <button onClick={() => this.toggleMessagesSending()}>{messagingSending ? 'Stop' : 'Start'} messages sending</button>
        <button onClick={() => this.toggleMessagesSending(true)}>
          {messagingSending ? 'Stop' : 'Start'} private messages sending
        </button>
        {this.renderUserProfile()}
        
        {this.renderSwarmMessagesDatabasesList()}
        {this.renderConnectToDatabase()}
        {this.renderLoadMessages()}
      </div>);
    }
    componentDidMount() {
        const { userCredentialsToConnectImmediate } = this.props;
        if (userCredentialsToConnectImmediate) {
            void this.connectToSwarm(userCredentialsToConnectImmediate);
        }
    }
    render() {
        const { connectionBridge, isConnecting, error } = this.state;
        if (error) {
            return <span>Error: {error.message}</span>;
        }
        if (connectionBridge) {
            return this.renderConnectedState();
        }
        if (!connectionBridge && !isConnecting) {
            return (<div>
          {this.props.userCredentialsList.map((credentials) => (<button key={credentials.login} onClick={() => this.connectToSwarm(credentials)}>
              Connect cred {credentials.login}
            </button>))}
        </div>);
        }
        return <span>Connecting...</span>;
    }
    setListenersConnectionBridge(connectionBridge) {
        const swarmMessageStore = connectionBridge.swarmMessageStore;
        if (!swarmMessageStore) {
            throw new Error('Swarm message store insatnce is not exists in the connection bridge instance');
        }
        swarmMessageStore.addListener(ESwarmStoreEventNames.DATABASES_LIST_UPDATED, this.handleDatabasesListUpdate);
        swarmMessageStore.addListener(ESwarmMessageStoreEventNames.NEW_MESSAGE, this.handleMessage);
    }
    renderUserProfile() {
        const { userId, userProfileData } = this.state;
        return <UserProfile id={userId} profile={userProfileData}/>;
    }
    renderDatabasesList() {
        const { databasesList, connectionBridge, databaseOpeningStatus, isDatabaseListVisible } = this.state;
        const dbsOptions = databasesList === null || databasesList === void 0 ? void 0 : databasesList.options;
        const isDefaultDatabaseWasOpenedBeforeOrOpening = !databaseOpeningStatus && !(dbsOptions === null || dbsOptions === void 0 ? void 0 : dbsOptions[this.defaultDbOptions.dbName]);
        return (<div>
        <div>
          <h4 onClick={this.toggleDatabasesListVisible}>List of databases:</h4>
          <div style={{ display: isDatabaseListVisible ? 'initial' : 'none' }}>
            {!!databasesList &&
                !!dbsOptions &&
                Object.keys(dbsOptions).map((databaseName) => {
                    const databaseOptions = dbsOptions[databaseName];
                    const isOpened = databasesList.opened[databaseName];
                    const dbMessages = this.state.messagesReceived.get(databaseName);
                    return (<SwarmStoreDbComponent key={databaseName} databaseOptions={databaseOptions} isOpened={isOpened} connectionBridge={connectionBridge} messages={Array.from((dbMessages === null || dbMessages === void 0 ? void 0 : dbMessages.values()) || [])}/>);
                })}
          </div>
        </div>
        {!!isDefaultDatabaseWasOpenedBeforeOrOpening ? (<button onClick={() => this.handleOpenDatabase()}>Open default database</button>) : (<button onClick={this.handleOpenNewDatabase}>Open new database</button>)}
      </div>);
    }
    getSwarmMessagesCollector() {
        const { connectionBridge } = this.state;
        if (!connectionBridge) {
            throw new Error('There is no connection with connction bridge');
        }
        const swarmMessageStore = connectionBridge === null || connectionBridge === void 0 ? void 0 : connectionBridge.swarmMessageStore;
        if (!swarmMessageStore) {
            throw new Error('Swarm message store is not ready');
        }
        return createSwarmMessagesDatabaseMessagesCollectorInstance({
            swarmMessageStore,
        });
    }
    renderSwarmMessagesDatabasesList() {
        const { swarmStoreMessagesDbOptionsList, connectionBridge } = this.state;
        const { dbo } = this.props;
        if (!connectionBridge) {
            throw new Error('Connection bridge should be defined');
        }
        return (<div>
        <div>
          <h4 onClick={this.toggleDatabasesListVisible}>List of swarm messages databases:</h4>
          {swarmStoreMessagesDbOptionsList.map((dbsOptions) => {
                const { userId } = this.state;
                const createDatabaseConnector = this.createDatabaseConnector;
                if (!userId) {
                    throw new Error('User identity should not be empty');
                }
                return (<SwarmMessagesDatabaseComponent key={dbsOptions.dbName} userId={userId} databaseOptions={dbsOptions} connectionBridge={connectionBridge} isOpenImmediate={dbsOptions.dbName === (dbo === null || dbo === void 0 ? void 0 : dbo.dbName)} createDb={this.createDatabaseConnector}/>);
            })}
        </div>
        <button onClick={this.handleClickOpenNewSwarmStoreMessagesDatabase}>Open new swarm store database</button>
      </div>);
    }
}
//# sourceMappingURL=connect-to-swarm-with-dbo.jsx.map