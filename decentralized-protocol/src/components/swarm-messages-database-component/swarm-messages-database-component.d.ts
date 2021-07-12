import React from 'react';
import { ESwarmStoreConnector } from '../../classes/swarm-store-class/swarm-store-class.const';
import { TSwarmStoreDatabaseEntityKey, TSwarmStoreDatabaseType } from '../../classes/swarm-store-class/swarm-store-class.types';
import { ISwarmMessagesDatabaseMessageDescription, ISwarmMessagesDatabaseDeleteMessageDescription } from './swarm-messages-database-component.types';
import { ISwarmMessageInstanceDecrypted, TSwarmMessageSerialized } from '../../classes/swarm-message/swarm-message-constructor.types';
import { ISwarmMessageStore } from '../../classes/swarm-message-store/types/swarm-message-store.types';
import { TSwarmMessageDatabaseMessagesCached, ISwarmMessagesDatabaseCacheOptions, ISwarmMessagesDatabaseCache } from '../../classes/swarm-messages-database/swarm-messages-database.types';
import { TSwarmMessageUserIdentifierSerialized } from '../../classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity-validators/central-authority-common-validator-user-identifier/central-authority-common-validator-user-identifier.types';
import { TSwarmStoreDatabaseOptions } from '../../classes/swarm-store-class/swarm-store-class.types';
import { IConnectionBridgeUnknown } from '../../classes/connection-bridge/types/connection-bridge.types';
import { ISwarmMessagesDatabaseConnector } from '../../classes/swarm-messages-database/swarm-messages-database.types';
import { ISwarmMessagesDatabaseMessagesCollector } from '../../classes/swarm-messages-database/swarm-messages-database.messages-collector.types';
declare type P = ESwarmStoreConnector.OrbitDB;
interface IProps<T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, CB extends IConnectionBridgeUnknown<P, T, DbType, any, DBO, MD | T>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>, MD extends ISwarmMessageInstanceDecrypted, SMSM extends ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD>, SMDC extends ISwarmMessagesDatabaseConnector<P, T, DbType, DBO, any, any, any, any, any, any, any, any, any, ISwarmMessageStore<P, T, DbType, DBO, any, any, any, any, any, MD | T, any, any, any, any>, MD, SMSM, any, any, any>> {
    userId: TSwarmMessageUserIdentifierSerialized;
    databaseOptions: DBO;
    connectionBridge?: CB;
    isOpenImmediate?: boolean;
    createDb: (databaseOptions: DBO) => Promise<SMDC>;
}
interface IState<T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>, MD extends ISwarmMessageInstanceDecrypted, SMSM extends ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD>, SMDC extends ISwarmMessagesDatabaseConnector<P, T, DbType, DBO, any, any, any, any, any, any, any, any, any, ISwarmMessageStore<P, T, DbType, DBO, any, any, any, any, any, MD | T, any, any, any, any>, MD, SMSM, any, any, any>> {
    messages: TSwarmMessageDatabaseMessagesCached<P, DbType, MD> | undefined;
    isOpening: boolean;
    isClosing: boolean;
    db?: SMDC;
}
export declare class SwarmMessagesDatabaseComponent<T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, CB extends IConnectionBridgeUnknown<P, T, DbType, any, DBO, MD | T>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType> = TSwarmStoreDatabaseOptions<P, T, DbType>, MD extends ISwarmMessageInstanceDecrypted = ISwarmMessageInstanceDecrypted, SMSM extends ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD> = ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD>, DCO extends ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMSM> = ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMSM>, DCCRT extends ISwarmMessagesDatabaseCache<P, T, DbType, DBO, MD, SMSM> = ISwarmMessagesDatabaseCache<P, T, DbType, DBO, MD, SMSM>, SMDC extends ISwarmMessagesDatabaseConnector<P, T, DbType, DBO, any, any, any, any, any, any, any, any, any, ISwarmMessageStore<P, T, DbType, DBO, any, any, any, any, any, MD | T, any, any, any, any>, MD, SMSM, any, any, any> = ISwarmMessagesDatabaseConnector<P, T, DbType, DBO, any, any, any, any, any, any, any, any, any, ISwarmMessageStore<P, T, DbType, DBO, any, any, any, any, any, MD | T, any, any, any, any>, MD, SMSM, any, any, any>> extends React.PureComponent<IProps<T, DbType, CB, DBO, MD, SMSM, SMDC>, IState<T, DbType, DBO, MD, SMSM, SMDC>> {
    state: IState<T, DbType, DBO, MD, SMSM, SMDC>;
    get isOpened(): boolean;
    get isUpdating(): boolean;
    get messagesCached(): TSwarmMessageDatabaseMessagesCached<P, DbType, MD> | undefined;
    queryDatabase: () => Promise<void>;
    queryDatabaseMessagesWithMeta: () => Promise<void>;
    onNewMessage: (message: ISwarmMessagesDatabaseMessageDescription<P>) => void;
    onMessageDelete: (deleteMessageDescription: ISwarmMessagesDatabaseDeleteMessageDescription<P>) => void;
    onMessagesCacheUpdated: (messages: TSwarmMessageDatabaseMessagesCached<P, DbType, MD> | undefined) => void;
    handleDbClose: () => Promise<void>;
    handleDbOpen: () => Promise<void>;
    handleDeleteMessage: (id: TSwarmStoreDatabaseEntityKey<P>, message: MD, key: TSwarmStoreDatabaseEntityKey<P> | undefined) => Promise<void>;
    protected sendSwarmMessage: () => Promise<void>;
    componentDidMount(): void;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=swarm-messages-database-component.d.ts.map