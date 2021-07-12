import { __awaiter } from "tslib";
import React from 'react';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { CONNECT_TO_SWARM_STORAGE_DEFAULT_MESSAGE_BODY } from '../const/connect-to-swarm.const';
import { MessageComponent } from '../message-component/message-component';
export class SwarmStoreDbComponent extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            isOpening: false,
            isClosing: false,
        };
        this.handleDbClose = () => __awaiter(this, void 0, void 0, function* () {
            const { connectionBridgeStorageOrUndefined } = this;
            const { databaseOptions, isOpened } = this.props;
            const { isClosing } = this.state;
            if (connectionBridgeStorageOrUndefined && isOpened && !isClosing) {
                try {
                    this.setState({ isClosing: true });
                    yield connectionBridgeStorageOrUndefined.closeDatabase(databaseOptions.dbName);
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
            const { connectionBridgeStorageOrUndefined } = this;
            const { databaseOptions, isOpened } = this.props;
            const { isOpening } = this.state;
            if (connectionBridgeStorageOrUndefined && !isOpened && !isOpening) {
                try {
                    this.setState({ isOpening: true });
                    yield (connectionBridgeStorageOrUndefined === null || connectionBridgeStorageOrUndefined === void 0 ? void 0 : connectionBridgeStorageOrUndefined.openDatabase(Object.assign(Object.assign({}, databaseOptions), { grantAccess: (...args) => __awaiter(this, void 0, void 0, function* () {
                            console.log(...args);
                            return true;
                        }) })));
                }
                catch (err) {
                    console.error(err);
                }
                finally {
                    this.setState({ isOpening: false });
                }
            }
        });
        this.sendSwarmMessage = () => __awaiter(this, void 0, void 0, function* () {
            const { connectionBridgeStorageOrUndefined } = this;
            const { connectionBridge, databaseOptions, isOpened } = this.props;
            try {
                if (isOpened && connectionBridge && connectionBridgeStorageOrUndefined) {
                    if (!databaseOptions.isPublic) {
                        alert('It is not a public database');
                        return;
                    }
                    let key;
                    const { connectionBridge } = this.props;
                    if (this.isKeyValueDatabase(connectionBridge)) {
                        key = (prompt('Key for the message', '') || undefined);
                        if (!key) {
                            throw new Error('Key should be defined for key value store');
                        }
                    }
                    yield connectionBridgeStorageOrUndefined.addMessage(databaseOptions.dbName, this.createSwarmMessageBody(), key);
                }
            }
            catch (err) {
                console.error(err);
                alert(err.message);
            }
        });
    }
    get connectionBridgeStorageOrUndefined() {
        var _a;
        return (_a = this.props.connectionBridge) === null || _a === void 0 ? void 0 : _a.swarmMessageStore;
    }
    isKeyValueDatabase(connectionBridge) {
        const { databaseOptions } = this.props;
        return !!connectionBridge && databaseOptions.dbType === ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE;
    }
    createSwarmMessageBody() {
        const messagePayload = prompt('Message', '');
        return Object.assign(Object.assign({}, CONNECT_TO_SWARM_STORAGE_DEFAULT_MESSAGE_BODY), { pld: messagePayload || '' });
    }
    render() {
        const { isOpening, isClosing } = this.state;
        const { databaseOptions, isOpened, messages } = this.props;
        const { dbName, isPublic } = databaseOptions;
        return (<div style={{ border: '1px solid black' }}>
        Database: {dbName}, {isOpened ? 'opened' : 'closed'}, {isPublic ? 'is public' : ''}, {isOpening && 'is opening'},{' '}
        {isClosing && 'is closing'};
        <br />
        {isOpened ? <button onClick={this.handleDbClose}>Close</button> : <button onClick={this.handleDbOpen}>Open</button>}
        <br />
        {isOpened && <button onClick={this.sendSwarmMessage}>Send message</button>}
        <div>
          Messages:
          {messages.map((message, idx) => {
                return (<>
                {idx + 1}
                <MessageComponent key={message.id} dbName={dbName} id={message.id} k={message.key} message={message.message}/>
              </>);
            })}
        </div>
      </div>);
    }
}
//# sourceMappingURL=swarm-store-db-component.jsx.map