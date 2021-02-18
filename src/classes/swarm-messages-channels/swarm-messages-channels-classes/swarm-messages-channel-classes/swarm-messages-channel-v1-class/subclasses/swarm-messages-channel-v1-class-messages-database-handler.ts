import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../../../../swarm-message-encrypted-cache/swarm-messgae-encrypted-cache.types';
import { ESwarmStoreConnector, ESwarmStoreEventNames } from '../../../../../swarm-store-class/swarm-store-class.const';
import {
  ISwarmStoreConnector,
  ISwarmStoreConnectorBasic,
  ISwarmStoreOptionsConnectorFabric,
  ISwarmStoreProviderOptions,
  TSwarmStoreConnectorConnectionOptions,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseType,
} from '../../../../../swarm-store-class/swarm-store-class.types';
import {
  ISwarmMessageInstanceDecrypted,
  TSwarmMessageSerialized,
} from '../../../../../swarm-message/swarm-message-constructor.types';
import {
  ISwarmMessageStore,
  ISwarmMessageStoreAccessControlOptions,
  ISwarmMessageStoreOptionsWithConnectorFabric,
  TSwarmMessagesStoreGrantAccessCallback,
} from '../../../../../swarm-message-store/types/swarm-message-store.types';
import {
  ISwarmMessagesDatabaseConnector,
  ISwarmMessagesDatabaseCacheOptions,
  ISwarmMessagesDatabaseCache,
  ISwarmMessagesDatabaseConnectOptions,
} from '../../../../../swarm-messages-database/swarm-messages-database.types';
import { ISwarmMessagesDatabaseMessagesCollector } from '../../../../../swarm-messages-database/swarm-messages-database.messages-collector.types';
import { isDeepEqual } from '../../../../../../utils/common-utils/common-utils-equality';
import assert from 'assert';
import { SWARM_MESSAGES_CHANNEL_ENCRYPION } from '../../../../const/swarm-messages-channels-main.const';
import { isCryptoKeyDataEncryption } from '../../../../../../utils/encryption-keys-utils/encryption-keys-utils';
import { IQueuedEncrypyionClassBase } from '../../../../../basic-classes/queued-encryption-class-base/queued-encryption-class-base.types';
import {
  ISwarmMessagesChannelV1DatabaseHandlerConstructorOptions,
  ISwarmMessagesChannelV1DatabaseHandler,
} from '../types/swarm-messages-channel-v1-class-messages-database-handler.types';
import { getEventEmitterInstance, EventEmitter } from 'classes/basic-classes/event-emitter-class-base';
import { ISwarmMessageDatabaseEvents } from '../../../../../swarm-messages-database/swarm-messages-database.types';
import { createCancellablePromiseByNativePromise } from '../../../../../../utils/common-utils/commom-utils.promies';
import { IPromiseCancellable } from '../../../../../../types/promise.types';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { TSwarmStoreDatabaseEntityKey } from '../../../../../swarm-store-class/swarm-store-class.types';
import {
  stopForwardEvents,
  forwardEvents,
} from '../../../../../basic-classes/event-emitter-class-base/event-emitter-class-with-forwarding.utils';

/**
 * Helper class that helps in maintaining
 * a channel's swarm messages database.
 *
 * @export
 * @interface ISwarmMessagesChannelV1DatabaseHandler
 * @extends {(Pick<ISwarmMessagesChannel<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, GAC, MCF, ACO, O, SMS, MD>, 'addMessage' | 'deleteMessage' | 'collect' | 'collectWithMeta' | 'setPasswordForMessagesEncryption'>)}
 * @template P
 * @template T
 * @template DbType
 * @template DBO
 * @template ConnectorBasic
 * @template CO
 * @template PO
 * @template ConnectorMain
 * @template CFO
 * @template GAC
 * @template MCF
 * @template ACO
 * @template O
 * @template SMS
 * @template MD
 * @template SMSM
 * @template DCO
 * @template DCCRT
 * @template OPT
 */
export class SwarmMessagesChannelV1DatabaseHandler<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>,
  CO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
  PO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, CO>,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, CO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain>,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MD | T>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MD | T, GAC> | undefined,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    CFO,
    MD | T,
    GAC,
    MCF,
    ACO
  >,
  SMS extends ISwarmMessageStore<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO, O>,
  MD extends ISwarmMessageInstanceDecrypted,
  SMSM extends ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD>,
  DCO extends ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMSM>,
  DCCRT extends ISwarmMessagesDatabaseCache<P, T, DbType, DBO, MD, SMSM>,
  OPT extends ISwarmMessagesDatabaseConnectOptions<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    CFO,
    GAC,
    MCF,
    ACO,
    O,
    SMS,
    MD,
    SMSM,
    DCO,
    DCCRT
  >
> implements
    ISwarmMessagesChannelV1DatabaseHandler<
      P,
      T,
      DbType,
      DBO,
      ConnectorBasic,
      CO,
      PO,
      ConnectorMain,
      CFO,
      GAC,
      MCF,
      ACO,
      O,
      SMS,
      MD,
      SMSM,
      DCO,
      DCCRT,
      OPT
    > {
  /**
   * Emitter that emits events related to the database connector.
   *
   * @readonly
   * @memberof SwarmMessagesChannelV1DatabaseHandler
   */
  public get emitter(): EventEmitter<ISwarmMessageDatabaseEvents<P, T, DbType, DBO, MD>> {
    return this.__emitter;
  }

  /**
   * An instance which used for encryption of swarm messages body.
   *
   * @readonly
   * @protected
   * @type {(IQueuedEncrypyionClassBase | undefined)}
   * @memberof SwarmMessagesChannelV1DatabaseHandler
   */
  protected get _messagesEncryptionQueueOrUndefined(): IQueuedEncrypyionClassBase | undefined {
    return this.___options.messagesEncryptionQueue;
  }

  protected get _isPasswordEncryptedChannel(): boolean {
    return this.___options.messageEncryptionType === SWARM_MESSAGES_CHANNEL_ENCRYPION.PASSWORD;
  }

  /**
   * A database options used to construct the
   * "actualSwarmMessagesDatabaseConnector" instance.
   *
   * @private
   * @type {DBO}
   * @memberof SwarmMessagesChannelV1DatabaseHandler
   */
  private __actualSwarmMessagesDatabaseOptions: DBO | undefined;

  private readonly __emitter = getEventEmitterInstance<ISwarmMessageDatabaseEvents<P, T, DbType, DBO, MD>>();

  /**
   * Database has been dropped at all
   * and can't be used anymore.
   *
   * @private
   * @type {boolean}
   * @memberof SwarmMessagesChannelV1DatabaseHandler
   */
  private __hasDatabaseBeenDropped: boolean = false;

  /**
   * Promise which represents a previuos connection
   * to a swarm messages database.
   *
   * @private
   * @type {Promise<void>}
   * @memberof SwarmMessagesChannelV1DatabaseHandler
   */
  private __swarmMessagesDatabaseConnectorConnectingPromise: IPromiseCancellable<void, Error> | undefined;

  /**
   * Connector instance to use.
   *
   * @private
   * @type {ISwarmMessagesDatabaseConnector<
   *     P,
   *     T,
   *     DbType,
   *     DBO,
   *     ConnectorBasic,
   *     CO,
   *     PO,
   *     ConnectorMain,
   *     CFO,
   *     GAC,
   *     MCF,
   *     ACO,
   *     O,
   *     SMS,
   *     MD,
   *     SMSM,
   *     DCO,
   *     DCCRT,
   *     OPT
   *   >}
   * @memberof SwarmMessagesChannelV1DatabaseHandler
   */
  private __actualSwarmMessagesDatabaseConnector:
    | ISwarmMessagesDatabaseConnector<
        P,
        T,
        DbType,
        DBO,
        ConnectorBasic,
        CO,
        PO,
        ConnectorMain,
        CFO,
        GAC,
        MCF,
        ACO,
        O,
        SMS,
        MD,
        SMSM,
        DCO,
        DCCRT,
        OPT
      >
    | undefined;

  constructor(
    private ___options: ISwarmMessagesChannelV1DatabaseHandlerConstructorOptions<
      P,
      T,
      DbType,
      DBO,
      ConnectorBasic,
      CO,
      PO,
      ConnectorMain,
      CFO,
      GAC,
      MCF,
      ACO,
      O,
      SMS,
      MD,
      SMSM,
      DCO,
      DCCRT,
      OPT
    >
  ) {
    this._validateConstructorOptions(___options);
    this.__swarmMessagesDatabaseConnectorConnectingPromise = this._createNewActualDatabaseConnectorAndSetCancellablePromise(
      ___options.databaseOptions
    );
  }

  /**
   * Create new swarm messages database connector instance
   * for future usage in such operations as "addMessage", removeMessage"
   * and so on.
   *
   * @param {DBO} databaseOptions
   * @returns {Promise<
   *     ISwarmMessagesDatabaseConnector<
   *       P,
   *       T,
   *       DbType,
   *       DBO,
   *       ConnectorBasic,
   *       CO,
   *       PO,
   *       ConnectorMain,
   *       CFO,
   *       GAC,
   *       MCF,
   *       ACO,
   *       O,
   *       SMS,
   *       MD,
   *       SMSM,
   *       DCO,
   *       DCCRT,
   *       OPT
   *     >
   *   >}
   * @memberof ISwarmMessagesChannelV1DatabaseHandler
   */
  public async restartDatabaseConnectorInstanceWithDbOptions(databaseOptions: DBO): Promise<void> {
    this._makeSureDatabseIsNotDropped();
    if (this._whetherActualDatabaseConnectorHaveTheSameOptions(databaseOptions)) {
      return await this._waitDatabaseCreationPromise();
    }

    let errorOccuredOnClosingPreviousDatabaseConenctor: Error | undefined;

    try {
      this._unsetActualSwarmMessagesDatabaseOptions();
      this._cancelPreviousDatabaseCreationPromise();
      await this._closeAndUnsetActualInstanceOfDatabaseConnector();
    } catch (err) {
      errorOccuredOnClosingPreviousDatabaseConenctor = new Error(
        `Failed to close the previous instance of database connector. ${err.message}`
      );
    }
    await this._createNewActualDatabaseConnectorAndSetCancellablePromise(databaseOptions);
    if (errorOccuredOnClosingPreviousDatabaseConenctor) {
      throw errorOccuredOnClosingPreviousDatabaseConenctor;
    }
  }

  async addMessage(
    message: Omit<MD['bdy'], 'iss'>,
    key: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE ? TSwarmStoreDatabaseEntityKey<P> : undefined
  ): Promise<void> {
    const databaseConnector = await this._getActiveDatabaseConnector();
    const swarmMessageBody = await this._prepareSwarmMessageBodyBeforeSending(message);
    await databaseConnector.addMessage(swarmMessageBody, key);
  }

  protected _validateConstructorOptions(
    options: ISwarmMessagesChannelV1DatabaseHandlerConstructorOptions<
      P,
      T,
      DbType,
      DBO,
      ConnectorBasic,
      CO,
      PO,
      ConnectorMain,
      CFO,
      GAC,
      MCF,
      ACO,
      O,
      SMS,
      MD,
      SMSM,
      DCO,
      DCCRT,
      OPT
    >
  ): void {
    assert(options, 'Options must be provided for constructor');
    assert(typeof options === 'object', 'Constructor options must be an object');
    if (options.messageEncryptionType === SWARM_MESSAGES_CHANNEL_ENCRYPION.PASSWORD) {
      assert(
        isCryptoKeyDataEncryption(options.messagesEncryptionQueue),
        'A messagesEncryptionQueue must be provided in options for the channel, because it uses a password encryption'
      );
    }
    assert(
      typeof options.messagesIssuer === 'string',
      'A swarm message issuer string should be provided in the constructor options'
    );
    assert(
      typeof options.swarmMessagesDatabaseConnectorInstanceByDBOFabric === 'function',
      'Database connector instance fabric must be provided in the constructor options swarmMessagesDatabaseConnectorInstanceByDBOFabric'
    );
    assert(options.databaseOptions, 'A database options must be provided for creation of the database');
    assert(typeof options.databaseOptions === 'object', 'A database options must be an object');
  }

  protected _makeSureDatabseIsNotDropped(): void {
    if (this.__hasDatabaseBeenDropped) {
      throw new Error(
        'Database for the channel has been dropped, therefore the swam messages channel cannot be used for performing any operations'
      );
    }
  }

  protected _setDatabaseHasBeenDropped(): void {
    this.__hasDatabaseBeenDropped = true;
  }

  protected _whetherActualDatabaseConnectorHaveTheSameOptions(databaseOptions: DBO): boolean {
    const actualSwarmMessagesDatabaseConnector = this.__actualSwarmMessagesDatabaseConnector;

    if (
      actualSwarmMessagesDatabaseConnector &&
      this.__actualSwarmMessagesDatabaseOptions &&
      isDeepEqual(databaseOptions, this.__actualSwarmMessagesDatabaseOptions)
    ) {
      return false;
    }
    return true;
  }

  protected _getActualSwarmMessagesDatabaseConnector(): ISwarmMessagesDatabaseConnector<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    CFO,
    GAC,
    MCF,
    ACO,
    O,
    SMS,
    MD,
    SMSM,
    DCO,
    DCCRT,
    OPT
  > {
    const actualSwarmMessagesDatabaseConnector = this.__actualSwarmMessagesDatabaseConnector;
    if (!actualSwarmMessagesDatabaseConnector) {
      throw new Error('Database connector instance ');
    }
    return actualSwarmMessagesDatabaseConnector;
  }

  protected _setActualSwarmMessagesDatabaseConnector(
    databaseConenctor: ISwarmMessagesDatabaseConnector<
      P,
      T,
      DbType,
      DBO,
      ConnectorBasic,
      CO,
      PO,
      ConnectorMain,
      CFO,
      GAC,
      MCF,
      ACO,
      O,
      SMS,
      MD,
      SMSM,
      DCO,
      DCCRT,
      OPT
    >
  ): void {
    this.__actualSwarmMessagesDatabaseConnector = databaseConenctor;
  }

  protected _setDatabaseActualOptions(databaseOptions: DBO): void {
    this.__actualSwarmMessagesDatabaseOptions = databaseOptions;
  }

  protected _unsetActualSwarmMessagesDatabaseConnector(): void {
    this.__actualSwarmMessagesDatabaseConnector = undefined;
  }

  protected _unsetActualSwarmMessagesDatabaseOptions() {
    this.__actualSwarmMessagesDatabaseOptions = undefined;
  }

  protected async _createNewSwarmMessagesDatabaseConenctorByDatabaseOptions(
    databaseOptions: DBO
  ): Promise<
    ISwarmMessagesDatabaseConnector<
      P,
      T,
      DbType,
      DBO,
      ConnectorBasic,
      CO,
      PO,
      ConnectorMain,
      CFO,
      GAC,
      MCF,
      ACO,
      O,
      SMS,
      MD,
      SMSM,
      DCO,
      DCCRT,
      OPT
    >
  > {
    return await this.___options.swarmMessagesDatabaseConnectorInstanceByDBOFabric(databaseOptions);
  }

  protected async _createAndHandleActualSwarmMessagesDatabaseConenctor(databaseOptions: DBO): Promise<void> {
    this._setDatabaseActualOptions(databaseOptions);

    const newDatabaseConnector = await this._createNewSwarmMessagesDatabaseConenctorByDatabaseOptions(databaseOptions);

    this._setActualSwarmMessagesDatabaseConnector(newDatabaseConnector);
    this._startForwardingDatabaseConnectorEvents(newDatabaseConnector);
    this._startListeningDatabaseConnectorEvents(newDatabaseConnector);
  }

  protected _cancelPreviousDatabaseCreationPromise(): void {
    this.__swarmMessagesDatabaseConnectorConnectingPromise?.cancel();
    this._unsetPreviousDatabaseCreationPromise();
  }

  protected _unsetPreviousDatabaseCreationPromise(): void {
    this.__swarmMessagesDatabaseConnectorConnectingPromise = undefined;
  }

  protected async _waitDatabaseCreationPromise(): Promise<void> {
    const result = await this.__swarmMessagesDatabaseConnectorConnectingPromise;
    if (result instanceof Error) {
      throw result;
    }
  }

  protected _createNewActualDatabaseConnectorAndSetCancellablePromise(databaseOptions: DBO): IPromiseCancellable<void, Error> {
    const creationOfNewDatabaseConnectorInstanceCancellablePromise = createCancellablePromiseByNativePromise(
      this._createAndHandleActualSwarmMessagesDatabaseConenctor(databaseOptions)
    );

    this.__swarmMessagesDatabaseConnectorConnectingPromise = creationOfNewDatabaseConnectorInstanceCancellablePromise;
    return creationOfNewDatabaseConnectorInstanceCancellablePromise;
  }

  protected _startForwardingDatabaseConnectorEvents(
    swarmMessagesDatabaseConnector: ISwarmMessagesDatabaseConnector<
      P,
      T,
      DbType,
      DBO,
      ConnectorBasic,
      CO,
      PO,
      ConnectorMain,
      CFO,
      GAC,
      MCF,
      ACO,
      O,
      SMS,
      MD,
      SMSM,
      DCO,
      DCCRT,
      OPT
    >
  ): void {
    forwardEvents(swarmMessagesDatabaseConnector.emitter, this.__emitter);
  }

  protected _handleDatabaseConnectorDatabaseClosed = async (): Promise<void> => {
    console.log('Database for the channel was suddenly closed');
    await this._close();
  };

  protected _handleDatabaseConnectorDatabaseDropped = async (): Promise<void> => {
    console.log('Database for the channel was suddenly dropped');
    this._setDatabaseHasBeenDropped();
    await this._close();
  };

  protected _startOrStopListeningDatabaseConnectorEvents(
    swarmMessagesDatabaseConnector: ISwarmMessagesDatabaseConnector<
      P,
      T,
      DbType,
      DBO,
      ConnectorBasic,
      CO,
      PO,
      ConnectorMain,
      CFO,
      GAC,
      MCF,
      ACO,
      O,
      SMS,
      MD,
      SMSM,
      DCO,
      DCCRT,
      OPT
    >,
    isAddListeners: boolean
  ) {
    const methodName = isAddListeners ? 'addListener' : 'removeListener';
    const { emitter } = swarmMessagesDatabaseConnector;

    emitter[methodName as 'addListener'](ESwarmStoreEventNames.CLOSE_DATABASE, this._handleDatabaseConnectorDatabaseClosed);
    emitter[methodName as 'addListener'](ESwarmStoreEventNames.DROP_DATABASE, this._handleDatabaseConnectorDatabaseDropped);
  }

  protected _startListeningDatabaseConnectorEvents(
    swarmMessagesDatabaseConnector: ISwarmMessagesDatabaseConnector<
      P,
      T,
      DbType,
      DBO,
      ConnectorBasic,
      CO,
      PO,
      ConnectorMain,
      CFO,
      GAC,
      MCF,
      ACO,
      O,
      SMS,
      MD,
      SMSM,
      DCO,
      DCCRT,
      OPT
    >
  ) {
    this._startOrStopListeningDatabaseConnectorEvents(swarmMessagesDatabaseConnector, true);
  }

  protected _stopListeningDatabaseConnectorEvents(
    swarmMessagesDatabaseConnector: ISwarmMessagesDatabaseConnector<
      P,
      T,
      DbType,
      DBO,
      ConnectorBasic,
      CO,
      PO,
      ConnectorMain,
      CFO,
      GAC,
      MCF,
      ACO,
      O,
      SMS,
      MD,
      SMSM,
      DCO,
      DCCRT,
      OPT
    >
  ) {
    this._startOrStopListeningDatabaseConnectorEvents(swarmMessagesDatabaseConnector, false);
  }

  protected _stopForwardingDatabaseConnectorEvents(
    swarmMessagesDatabaseConnector: ISwarmMessagesDatabaseConnector<
      P,
      T,
      DbType,
      DBO,
      ConnectorBasic,
      CO,
      PO,
      ConnectorMain,
      CFO,
      GAC,
      MCF,
      ACO,
      O,
      SMS,
      MD,
      SMSM,
      DCO,
      DCCRT,
      OPT
    >
  ): void {
    this._stopListeningDatabaseConnectorEvents(swarmMessagesDatabaseConnector);
    stopForwardEvents(swarmMessagesDatabaseConnector.emitter, this.__emitter);
  }

  protected async _closeAndUnsetActualInstanceOfDatabaseConnector(): Promise<void> {
    const actualSwarmMessagesDatabaseConnector = this.__actualSwarmMessagesDatabaseConnector;

    if (actualSwarmMessagesDatabaseConnector) {
      this._unsetActualSwarmMessagesDatabaseConnector();
      this._stopForwardingDatabaseConnectorEvents(actualSwarmMessagesDatabaseConnector);
      await actualSwarmMessagesDatabaseConnector.close();
    }
  }

  protected async _close(): Promise<void> {
    this._cancelPreviousDatabaseCreationPromise();
    this._unsetActualSwarmMessagesDatabaseOptions();
    await this._closeAndUnsetActualInstanceOfDatabaseConnector();
  }

  protected async _getActiveDatabaseConnector(): Promise<
    ISwarmMessagesDatabaseConnector<
      P,
      T,
      DbType,
      DBO,
      ConnectorBasic,
      CO,
      PO,
      ConnectorMain,
      CFO,
      GAC,
      MCF,
      ACO,
      O,
      SMS,
      MD,
      SMSM,
      DCO,
      DCCRT,
      OPT
    >
  > {
    this._makeSureDatabseIsNotDropped();
    await this._waitDatabaseCreationPromise();
    return this._getActualSwarmMessagesDatabaseConnector();
  }

  protected _getMessagesEncryptionQueue(): IQueuedEncrypyionClassBase {
    const { messagesEncryptionQueue } = this.___options;
    if (!messagesEncryptionQueue) {
      throw new Error('An encryption queue is not exists');
    }
    return messagesEncryptionQueue;
  }

  protected async _decryptMessageBodyIfEncryptedChannel(messageBody: MD['bdy']): Promise<MD['bdy']> {
    const decryptedMessagePayload = await this._getMessagesEncryptionQueue().decryptData(messageBody.pld);
    return {
      ...messageBody,
      pld: decryptedMessagePayload,
    };
  }

  protected async _encryptMessageBodyIfEncryptedChannel(messageBody: MD['bdy']): Promise<MD['bdy']> {
    const encryptedMessagePayload = await this._getMessagesEncryptionQueue().encryptData(messageBody.pld);
    return {
      ...messageBody,
      pld: encryptedMessagePayload,
    };
  }

  protected async _prepareSwarmMessageBodyBeforeSending(messageBodyWithoutIssuer: Omit<MD['bdy'], 'iss'>): Promise<MD['bdy']> {
    const messageIssuer = this.___options.messagesIssuer;
    const messageBodyWithIssuer: MD['bdy'] = {
      ...messageBodyWithoutIssuer,
      iss: messageIssuer,
    };
    if (this._isPasswordEncryptedChannel) {
      return await this._encryptMessageBodyIfEncryptedChannel(messageBodyWithIssuer);
    }
    return messageBodyWithIssuer;
  }
}
