import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../../../../swarm-message-encrypted-cache/swarm-message-encrypted-cache.types';
import { ESwarmStoreConnector } from '../../../../../swarm-store-class/swarm-store-class.const';
import { ISwarmStoreConnector, ISwarmStoreConnectorBasic, ISwarmStoreOptionsConnectorFabric, ISwarmStoreProviderOptions, TSwarmStoreConnectorConnectionOptions, TSwarmStoreDatabaseOptions, TSwarmStoreDatabaseType } from '../../../../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageInstanceDecrypted, TSwarmMessageSerialized } from '../../../../../swarm-message/swarm-message-constructor.types';
import { ISwarmMessageStore, ISwarmMessageStoreAccessControlOptions, ISwarmMessageStoreOptionsWithConnectorFabric, TSwarmMessagesStoreGrantAccessCallback } from '../../../../../swarm-message-store/types/swarm-message-store.types';
import { ISwarmMessagesDatabaseConnector, ISwarmMessagesDatabaseCacheOptions, ISwarmMessagesDatabaseCache, ISwarmMessagesDatabaseConnectOptions } from '../../../../../swarm-messages-database/swarm-messages-database.types';
import { ISwarmMessagesDatabaseMessagesCollector } from '../../../../../swarm-messages-database/swarm-messages-database.messages-collector.types';
import { SWARM_MESSAGES_CHANNEL_ENCRYPTION } from '../../../../const/swarm-messages-channels-main.const';
import { IQueuedEncryptionClassBase } from '../../../../../basic-classes/queued-encryption-class-base/queued-encryption-class-base.types';
import { ISwarmMessagesChannelV1DatabaseHandlerConstructorOptions, ISwarmMessagesChannelV1DatabaseHandler } from '../types/swarm-messages-channel-v1-class-messages-database-handler.types';
import { EventEmitter } from 'classes/basic-classes/event-emitter-class-base';
import { ISwarmMessageDatabaseEvents, TSwarmMessageDatabaseMessagesCached } from '../../../../../swarm-messages-database/swarm-messages-database.types';
import { IPromiseCancellable } from '../../../../../../types/promise.types';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { TSwarmStoreDatabaseEntityKey, TSwarmStoreDatabaseIteratorMethodArgument } from '../../../../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageStoreDeleteMessageArg, ISwarmMessageStoreMessagingRequestWithMetaResult } from '../../../../../swarm-message-store/types/swarm-message-store.types';
import { ISwarmMessageInstanceEncrypted } from '../../../../../swarm-message/swarm-message-constructor.types';
export declare class SwarmMessagesChannelV1DatabaseHandler<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>, ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>, CO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>, PO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, CO>, ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, CO>, CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain>, GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MD | T>, MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined, ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MD | T, GAC> | undefined, O extends ISwarmMessageStoreOptionsWithConnectorFabric<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO>, SMS extends ISwarmMessageStore<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO, O>, MD extends ISwarmMessageInstanceDecrypted, SMSM extends ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD>, DCO extends ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMSM>, DCCRT extends ISwarmMessagesDatabaseCache<P, T, DbType, DBO, MD, SMSM>, OPT extends ISwarmMessagesDatabaseConnectOptions<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, GAC, MCF, ACO, O, SMS, MD, SMSM, DCO, DCCRT>, CHE extends SWARM_MESSAGES_CHANNEL_ENCRYPTION = SWARM_MESSAGES_CHANNEL_ENCRYPTION.PUBLIC, COPTS extends ISwarmMessagesChannelV1DatabaseHandlerConstructorOptions<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, GAC, MCF, ACO, O, SMS, MD, SMSM, DCO, DCCRT, OPT, CHE> = ISwarmMessagesChannelV1DatabaseHandlerConstructorOptions<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, GAC, MCF, ACO, O, SMS, MD, SMSM, DCO, DCCRT, OPT, CHE>> implements ISwarmMessagesChannelV1DatabaseHandler<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, GAC, MCF, ACO, O, SMS, MD> {
    private ___options;
    get emitter(): EventEmitter<ISwarmMessageDatabaseEvents<P, T, DbType, DBO, MD>>;
    get isDatabaseReady(): boolean;
    get cachedMessages(): TSwarmMessageDatabaseMessagesCached<P, DbType, MD> | undefined;
    protected get _messagesEncryptionQueueOrUndefined(): IQueuedEncryptionClassBase | undefined;
    protected get _isPasswordEncryptedChannel(): boolean;
    private __actualSwarmMessagesDatabaseOptions;
    private readonly __emitter;
    private __hasDatabaseBeenDropped;
    private __swarmMessagesDatabaseConnectorConnectingPromise;
    private __actualSwarmMessagesDatabaseConnector;
    constructor(___options: COPTS);
    restartDatabaseConnectorInstanceWithDbOptions(databaseOptions: DBO): Promise<void>;
    close(): Promise<void>;
    dropDatabaseLocally(): Promise<void>;
    addMessage(message: Omit<MD['bdy'], 'iss'>, key: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE ? TSwarmStoreDatabaseEntityKey<P> : never): Promise<void>;
    deleteMessage(messageAddressOrKey: ISwarmMessageStoreDeleteMessageArg<P, DbType>): Promise<void>;
    collect(options: TSwarmStoreDatabaseIteratorMethodArgument<P, DbType>): Promise<Array<Error | MD>>;
    collectWithMeta(options: TSwarmStoreDatabaseIteratorMethodArgument<P, DbType>): Promise<Array<ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD> | undefined>>;
    protected _validateConstructorOptions(options: COPTS): void;
    protected _makeSureDatabseIsNotDropped(): void;
    protected _setDatabaseHasBeenDropped(): void;
    protected _whetherActualDatabaseConnectorHaveTheSameOptions(databaseOptions: DBO): boolean;
    protected _getActualSwarmMessagesDatabaseConnector(): ISwarmMessagesDatabaseConnector<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, GAC, MCF, ACO, O, SMS, MD, SMSM, DCO, DCCRT, OPT>;
    protected _setActualSwarmMessagesDatabaseConnector(databaseConenctor: ISwarmMessagesDatabaseConnector<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, GAC, MCF, ACO, O, SMS, MD, SMSM, DCO, DCCRT, OPT>): void;
    protected _setDatabaseActualOptions(databaseOptions: DBO): void;
    protected _unsetActualSwarmMessagesDatabaseConnector(): void;
    protected _unsetActualSwarmMessagesDatabaseOptions(): void;
    protected _createNewSwarmMessagesDatabaseConenctorByDatabaseOptions(databaseOptions: DBO): Promise<ISwarmMessagesDatabaseConnector<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, GAC, MCF, ACO, O, SMS, MD, SMSM, DCO, DCCRT, OPT>>;
    protected _createAndHandleActualSwarmMessagesDatabaseConenctor(databaseOptions: DBO): Promise<void>;
    protected _cancelPreviousDatabaseCreationPromise(): void;
    protected _unsetPreviousDatabaseCreationPromise(): void;
    protected _waitDatabaseCreationPromise(): Promise<void>;
    protected _createNewActualDatabaseConnectorAndSetCancellablePromise(databaseOptions: DBO): IPromiseCancellable<void, Error>;
    protected _startForwardingDatabaseConnectorEvents(swarmMessagesDatabaseConnector: ISwarmMessagesDatabaseConnector<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, GAC, MCF, ACO, O, SMS, MD, SMSM, DCO, DCCRT, OPT>): void;
    protected _handleDatabaseConnectorDatabaseClosed: () => Promise<void>;
    protected _handleDatabaseConnectorDatabaseDropped: () => Promise<void>;
    protected _startOrStopListeningDatabaseConnectorEvents(swarmMessagesDatabaseConnector: ISwarmMessagesDatabaseConnector<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, GAC, MCF, ACO, O, SMS, MD, SMSM, DCO, DCCRT, OPT>, isAddListeners: boolean): void;
    protected _startListeningDatabaseConnectorEvents(swarmMessagesDatabaseConnector: ISwarmMessagesDatabaseConnector<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, GAC, MCF, ACO, O, SMS, MD, SMSM, DCO, DCCRT, OPT>): void;
    protected _emitReadyEvent(): void;
    protected _emitReadyEventIfDatatbaseConnector(swarmMessagesDatabaseConnector: ISwarmMessagesDatabaseConnector<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, GAC, MCF, ACO, O, SMS, MD, SMSM, DCO, DCCRT, OPT>): void;
    protected _stopListeningDatabaseConnectorEvents(swarmMessagesDatabaseConnector: ISwarmMessagesDatabaseConnector<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, GAC, MCF, ACO, O, SMS, MD, SMSM, DCO, DCCRT, OPT>): void;
    protected _stopForwardingDatabaseConnectorEvents(swarmMessagesDatabaseConnector: ISwarmMessagesDatabaseConnector<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, GAC, MCF, ACO, O, SMS, MD, SMSM, DCO, DCCRT, OPT>): void;
    protected _closeAndUnsetActualInstanceOfDatabaseConnector(): Promise<void>;
    protected _close(): Promise<void>;
    protected __dropDatabaseLocally(): Promise<void>;
    protected _getActiveDatabaseConnector(): Promise<ISwarmMessagesDatabaseConnector<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, GAC, MCF, ACO, O, SMS, MD, SMSM, DCO, DCCRT, OPT>>;
    protected _getMessagesEncryptionQueue(): IQueuedEncryptionClassBase;
    protected _decryptMessageBodyIfEncryptedChannel(messageBody: MD['bdy']): Promise<MD['bdy']>;
    protected _encryptMessageBodyIfEncryptedChannel(messageBody: MD['bdy']): Promise<MD['bdy']>;
    protected _prepareSwarmMessageBodyBeforeSending(messageBodyWithoutIssuer: Omit<MD['bdy'], 'iss'>): Promise<MD['bdy']>;
    protected _whetherMessageDecryptedOrError(collectedResult: any): collectedResult is ISwarmMessageInstanceDecrypted | Error;
    private __replaceMessageEncryptedWithError;
    protected _replaceMessagesEncryptedWithErrors(resultCollected: Array<ISwarmMessageInstanceDecrypted | ISwarmMessageInstanceEncrypted | Error>): Array<ISwarmMessageInstanceDecrypted | Error>;
    protected _decryptSwarmMessageByPassword(swarmMessage: ISwarmMessageInstanceDecrypted): Promise<MD>;
    private __decryptPasswordEncryptedMessageCollectedOrReturnError;
    protected _decryptPasswordEncryptedMessagesCollected(swarmMessagesAndErrors: Array<ISwarmMessageInstanceDecrypted | Error>): Promise<Array<MD | Error>>;
    protected _decryptSwarmMessageWithMeta(swarmMessageWithMeta: ISwarmMessageStoreMessagingRequestWithMetaResult<P, ISwarmMessageInstanceDecrypted>): Promise<ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD>>;
    private __decryptPasswordEncryptedMessageWithMetaCollected;
    protected _decryptPasswordEncryptedMessagesCollectedWithMeta(collectMessagesWithMetaResult: Array<ISwarmMessageStoreMessagingRequestWithMetaResult<P, ISwarmMessageInstanceDecrypted> | undefined>): Promise<Array<ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD> | undefined>>;
}
//# sourceMappingURL=swarm-messages-channel-v1-class-messages-database-handler.d.ts.map