import { __awaiter } from "tslib";
import React from 'react';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { CONNECT_TO_SWARM_STORAGE_DEFAULT_MESSAGE_BODY } from '../const/connect-to-swarm.const';
import { ESwarmStoreConnectorOrbitDbDatabaseIteratorOption } from '../../classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
import { MessageComponent } from '../message-component/message-component';
import { setMessageListener } from './swarm-messages-database-component.utils';
import { setMessageDeleteListener, setCacheUpdateListener } from './swarm-messages-database-component.utils';
import { isValidSwarmMessageDecryptedFormat } from '../../classes/swarm-message-store/swarm-message-store-utils/swarm-message-store-validators/swarm-message-store-validator-swarm-message';
export class SwarmMessagesDatabaseComponent extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            messages: undefined,
            isOpening: false,
            isClosing: false,
            db: undefined,
        };
        this.queryDatabase = () => __awaiter(this, void 0, void 0, function* () {
            const { db } = this.state;
            if (db) {
                const result = yield db.collect({
                    [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.limit]: -1,
                });
                console.log(result);
            }
        });
        this.queryDatabaseMessagesWithMeta = () => __awaiter(this, void 0, void 0, function* () {
            const { db } = this.state;
            if (db) {
                const result = yield db.collectWithMeta({
                    [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.limit]: -1,
                });
                console.log(result);
            }
        });
        this.onNewMessage = (message) => {
            console.log('New message', message);
        };
        this.onMessageDelete = (deleteMessageDescription) => {
            console.log('Message removed', deleteMessageDescription);
        };
        this.onMessagesCacheUpdated = (messages) => {
            console.log('Cache updated', messages);
            this.setState({
                messages,
            });
            if (this.state.messages === messages) {
                this.forceUpdate();
            }
        };
        this.handleDbClose = () => __awaiter(this, void 0, void 0, function* () {
            const { connectionBridge } = this.props;
            const { isClosing, db } = this.state;
            if (connectionBridge && db && this.isOpened && !isClosing) {
                try {
                    this.setState({ isClosing: true });
                    yield db.close();
                    this.setState({ db: undefined });
                }
                catch (err) {
                    console.error(err);
                }
                finally {
                    this.setState({ isClosing: false });
                }
            }
        });
        this.handleDbOpen = () => __awaiter(this, void 0, void 0, function* () {
            const { isOpening } = this.state;
            if (!this.isOpened && !isOpening) {
                try {
                    this.setState({ isOpening: true });
                    const db = yield this.props.createDb(this.props.databaseOptions);
                    setMessageListener(db, this.onNewMessage);
                    setMessageDeleteListener(db, this.onMessageDelete);
                    setCacheUpdateListener(db, this.onMessagesCacheUpdated);
                    this.setState({ db });
                }
                catch (err) {
                    console.error(err);
                }
                finally {
                    this.setState({ isOpening: false });
                }
            }
        });
        this.handleDeleteMessage = (id, message, key) => __awaiter(this, void 0, void 0, function* () {
            const { db } = this.state;
            let removeArg;
            if (this.isOpened && (db === null || db === void 0 ? void 0 : db.isReady)) {
                const { dbType } = db;
                if (dbType === ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE) {
                    if (!key) {
                        throw new Error('For key-value database type a key must be provided to delete a message');
                    }
                    removeArg = key;
                }
                else if (db.dbType === ESwarmStoreConnectorOrbitDbDatabaseType.FEED) {
                    removeArg = id;
                }
                else {
                    removeArg = message;
                }
                return yield db.deleteMessage(removeArg);
            }
        });
        this.sendSwarmMessage = () => __awaiter(this, void 0, void 0, function* () {
            const { databaseOptions } = this.props;
            const { db } = this.state;
            try {
                if (this.isOpened && db) {
                    if (!databaseOptions.isPublic) {
                        alert('It is not a public database');
                        return;
                    }
                    let key;
                    if (databaseOptions.dbType === ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE) {
                        key = prompt('Key for the message', '') || undefined;
                        if (!key) {
                            return;
                        }
                    }
                    while (true) {
                        yield db.addMessage(Object.assign(Object.assign({}, CONNECT_TO_SWARM_STORAGE_DEFAULT_MESSAGE_BODY), { pld: String(new Date()) || '' }), key);
                        yield new Promise((res) => setTimeout(res, 300));
                    }
                }
            }
            catch (err) {
                console.error(err);
                alert(err.message);
            }
        });
    }
    get isOpened() {
        const { isOpening, isClosing, db } = this.state;
        return !isOpening && !isClosing && !!db;
    }
    get isUpdating() {
        var _a;
        return !!((_a = this.state.db) === null || _a === void 0 ? void 0 : _a.whetherMessagesListUpdateInProgress);
    }
    get messagesCached() {
        var _a;
        return (_a = this.state.db) === null || _a === void 0 ? void 0 : _a.cachedMessages;
    }
    componentDidMount() {
        const { isOpenImmediate } = this.props;
        if (isOpenImmediate) {
            void this.handleDbOpen();
        }
    }
    render() {
        const { isOpening, isClosing } = this.state;
        const { databaseOptions } = this.props;
        const { isOpened, isUpdating } = this;
        const { dbName, isPublic } = databaseOptions;
        const { messages } = this.state;
        return (<div style={{ border: '1px solid black' }}>
        Database: {dbName}, {isOpened ? 'opened' : 'closed'}, {isPublic ? 'is public' : ''}, {isOpening && 'is opening'},{' '}
        {isClosing && 'is closing'};
        <br />
        {isOpened ? <button onClick={this.handleDbClose}>Close</button> : <button onClick={this.handleDbOpen}>Open</button>}
        <br />
        {isOpened && <button onClick={this.sendSwarmMessage}>Send message</button>}
        {isUpdating && <div>Updating...</div>}
        <div>
          Messages:
          {messages &&
                Array.from(messages.entries()).map(([keyInStore, messageWithMeta], idx) => {
                    const { messageAddress, dbName: messageDbName, message } = messageWithMeta;
                    let messageId = '';
                    if (message instanceof Error) {
                        return <div>Error: {message.message}</div>;
                    }
                    try {
                        if (!isValidSwarmMessageDecryptedFormat(message)) {
                            return <div>Message has an invalid format</div>;
                        }
                    }
                    catch (err) {
                        return <div>Error message format: {err.message}</div>;
                    }
                    if (messageAddress instanceof Error) {
                        messageId = messageAddress.message;
                    }
                    else if (messageAddress) {
                        messageId = messageAddress;
                    }
                    return (<>
                  {idx}
                  <MessageComponent key={keyInStore} dbName={messageDbName || dbName} id={messageId} k={keyInStore} message={message} deleteMessage={this.handleDeleteMessage}/>
                </>);
                })}
        </div>
      </div>);
    }
}
//# sourceMappingURL=swarm-messages-database-component.jsx.map