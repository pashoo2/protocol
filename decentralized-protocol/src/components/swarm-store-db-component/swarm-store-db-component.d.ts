import React from 'react';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { IMessageDescription } from '../connect-to-swarm/connect-to-swarm';
import { IConnectionBridgeUnknown } from '../../classes/connection-bridge/types/connection-bridge.types';
import { ESwarmStoreConnector } from '../../classes/swarm-store-class/swarm-store-class.const';
import { TSwarmStoreDatabaseType, TSwarmStoreDatabaseOptions } from '../../classes/swarm-store-class/swarm-store-class.types';
import { TSwarmMessageSerialized, TSwarmMessageInstance, ISwarmMessageBodyDeserialized } from '../../classes/swarm-message/swarm-message-constructor.types';
interface IProps<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, CD extends boolean = true, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType> = TSwarmStoreDatabaseOptions<P, T, DbType>, MSI extends TSwarmMessageInstance | T = TSwarmMessageInstance | T> {
    databaseOptions: DBO;
    isOpened: boolean;
    connectionBridge?: IConnectionBridgeUnknown<P, T, DbType, CD, DBO, MSI>;
    messages: IMessageDescription<P>[];
}
export declare class SwarmStoreDbComponent<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType> = TSwarmStoreDatabaseOptions<P, T, DbType>, CD extends boolean = boolean, MSI extends TSwarmMessageInstance | T = TSwarmMessageInstance | T> extends React.PureComponent<IProps<P, T, DbType, CD, DBO, MSI>> {
    state: {
        isOpening: boolean;
        isClosing: boolean;
    };
    protected get connectionBridgeStorageOrUndefined(): Required<IProps<P, T, DbType, CD, DBO, MSI>>['connectionBridge']['swarmMessageStore'];
    handleDbClose: () => Promise<void>;
    handleDbOpen: () => Promise<void>;
    protected isKeyValueDatabase(connectionBridge: any): connectionBridge is IConnectionBridgeUnknown<P, T, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE, CD, any, MSI>;
    protected createSwarmMessageBody(): ISwarmMessageBodyDeserialized;
    protected sendSwarmMessage: () => Promise<void>;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=swarm-store-db-component.d.ts.map