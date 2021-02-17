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
      MD
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

  private __hasDatabaseBeenDropped: boolean = false;

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
    this._validateDatabseIsNotDropped();

    const actualSwarmMessagesDatabaseConnector = this.__actualSwarmMessagesDatabaseConnector;

    if (
      actualSwarmMessagesDatabaseConnector &&
      this.__actualSwarmMessagesDatabaseOptions &&
      isDeepEqual(databaseOptions, this.__actualSwarmMessagesDatabaseOptions)
    ) {
      return;
    }
    if (actualSwarmMessagesDatabaseConnector) {
      // TODO - maybe it should be wrapped in try catch block to make it dont afftect creation of a new connector
      await this._closeAndUnsetActualInstanceOfDatabaseConnector(actualSwarmMessagesDatabaseConnector);
    }
    await this._createAndSetNewActualSwarmMessagesDatabaseConenctor(databaseOptions);
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
  }

  protected _validateDatabseIsNotDropped(): void {
    if (this.__hasDatabaseBeenDropped) {
      throw new Error(
        'Database for the channel has been dropped, therefore the swam messages channel cannot be used for performing any operations'
      );
    }
  }

  protected _setDatabaseHasBeenDropped(): void {
    this.__hasDatabaseBeenDropped = true;
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

  protected _unsetActualSwarmMessagesDatabaseConnector(): void {
    this.__actualSwarmMessagesDatabaseConnector = undefined;
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

  protected async _createAndSetNewActualSwarmMessagesDatabaseConenctor(databaseOptions: DBO): Promise<void> {
    const newDatabaseConnector = await this._createNewSwarmMessagesDatabaseConenctorByDatabaseOptions(databaseOptions);

    this._setActualSwarmMessagesDatabaseConnector(newDatabaseConnector);
    this._startForwardingDatabaseConnectorEvents(newDatabaseConnector);
    this._startListeningDatabaseConnectorEvents(newDatabaseConnector);
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
    // TODO - listen for the close event in the Channel class itself
    // and set channel as inactive
    await this._close();
  };

  protected _handleDatabaseConnectorDatabaseDropped = async (): Promise<void> => {
    console.log('Database for the channel was suddenly dropped');
    // TODO - listen for the close event in the Channel class itself
    // and set channel as inactive
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

  protected async _closeAndUnsetActualInstanceOfDatabaseConnector(
    actualSwarmMessagesDatabaseConnector: ISwarmMessagesDatabaseConnector<
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
  ): Promise<void> {
    this._stopForwardingDatabaseConnectorEvents(actualSwarmMessagesDatabaseConnector);
    await actualSwarmMessagesDatabaseConnector.close();
    if (this.__actualSwarmMessagesDatabaseConnector === actualSwarmMessagesDatabaseConnector) {
      this._unsetActualSwarmMessagesDatabaseConnector();
    }
  }

  protected async _close(): Promise<void> {
    const actualDatabseConnector = this.__actualSwarmMessagesDatabaseConnector;
    if (actualDatabseConnector) {
      await this._closeAndUnsetActualInstanceOfDatabaseConnector(actualDatabseConnector);
    }
  }
}
