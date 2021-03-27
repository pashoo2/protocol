import assert from 'assert';
import { JSONSchema7 } from 'json-schema';
import { ESwarmStoreConnector } from 'classes/swarm-store-class/swarm-store-class.const';
import { ISwarmMessageInstanceDecrypted, TSwarmMessageSerialized } from 'classes/swarm-message/swarm-message-constructor.types';
import {
  ISwarmStoreConnector,
  ISwarmStoreConnectorBasic,
  ISwarmStoreOptionsConnectorFabric,
  ISwarmStoreProviderOptions,
  TSwarmStoreConnectorConnectionOptions,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseType,
} from 'classes/swarm-store-class/swarm-store-class.types';
import {
  ISwarmMessageStore,
  ISwarmMessageStoreAccessControlOptions,
  ISwarmMessageStoreOptionsWithConnectorFabric,
  TSwarmMessagesStoreGrantAccessCallback,
} from 'classes/swarm-message-store/types/swarm-message-store.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from 'classes/swarm-message-encrypted-cache/swarm-messgae-encrypted-cache.types';
import {
  ISwarmMessagesDatabaseCache,
  ISwarmMessagesDatabaseCacheOptions,
  ISwarmMessagesDatabaseConnectOptions,
} from 'classes/swarm-messages-database/swarm-messages-database.types';
import { ISwarmMessagesDatabaseMessagesCollector } from 'classes/swarm-messages-database/swarm-messages-database.messages-collector.types';
import { swarmMessagesChannelValidationDescriptionFormatV1 } from '../../../../swarm-messages-channels-utils/swarm-messages-channel-utils/swarm-messages-channel-validation-utils/swarm-messages-channel-validation-description-utils/swarm-messages-channel-validation-description-format-v1/swarm-messages-channel-validation-description-format-v1';
import { validateVerboseBySchemaWithVoidResult } from 'utils/validation-utils/validation-utils';
import swarmMessagesChannelDescriptionJSONSchema from '../../../../const/validation/swarm-messages-channel/swarm-messages-channel-description/schemas/swarm-message-channel-description-v1-format-schema.json';
import { SWARM_MESSAGES_CHANNEL_ENCRYPION } from '../../../../const/swarm-messages-channels-main.const';
import { TSwarmMessageUserIdentifierSerialized } from '../../../../../central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity-validators/central-authority-common-validator-user-identifier/central-authority-common-validator-user-identifier.types';
import {
  ISwarmMessagesDatabaseConnector,
  ISwarmMessageDatabaseEvents,
} from '../../../../../swarm-messages-database/swarm-messages-database.types';
import { getOptionsForChannelsListHandlerByContstructorOptions } from '../utils/swarm-messages-channel-v1-class-common.utils';
import {
  ISwarmMessageChannelDescriptionWithoutDatabaseOptionsRaw,
  ISwarmMessagesChannelConstructorUtils,
} from '../../../../types/swarm-messages-channel-instance.types';
import {
  TSwarmMessagesChannelId,
  ISwarmMessagesChannel,
  ISwarmMessagesChannelConstructorOptions,
  ISwarmMessageChannelDescriptionRaw,
} from '../../../../types/swarm-messages-channel-instance.types';
import { ISwarmMessagesChannelsDescriptionsList } from '../../../../types/swarm-messages-channels-list-instance.types';
import { ESwarmMessagesChannelsListEventName } from '../../../../types/swarm-messages-channels-list-events.types';
import { isDeepEqual } from '../../../../../../utils/common-utils/common-utils-equality';
import { ISwarmMessagesChannelV1ClassChannelsListHandlerConstructorOptions } from '../types/swarm-messages-channel-v1-class-channels-list-handler.types';
import { ISwarmMessagesChannelV1DatabaseHandlerConstructorOptions } from '../types/swarm-messages-channel-v1-class-messages-database-handler.types';
import { IQueuedEncryptionClassBase } from '../../../../../basic-classes/queued-encryption-class-base/queued-encryption-class-base.types';
import { ESwarmStoreEventNames } from '../../../../../swarm-store-class/swarm-store-class.const';
import { EventEmitter } from '../../../../../basic-classes/event-emitter-class-base/event-emitter-class-base';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { ISwarmMessagesChannelEvents } from '../../../../types/swarm-messages-channel-events.types';
import { SWARM_MESSAGES_CHANNEL_VERSION } from '../../../const/swarm-messages-channel-classes-params.const';
import {
  TSwarmStoreDatabaseEntityKey,
  TSwarmStoreDatabaseIteratorMethodArgument,
} from '../../../../../swarm-store-class/swarm-store-class.types';
import {
  ISwarmMessageStoreDeleteMessageArg,
  ISwarmMessageStoreMessagingRequestWithMetaResult,
} from '../../../../../swarm-message-store/types/swarm-message-store.types';
import {
  ISwarmMessagesChannelV1ClassChannelsListHandler,
  ISwarmMessagesChannelV1ClassChannelsListHandlerConstructor,
} from '../types/swarm-messages-channel-v1-class-channels-list-handler.types';
import {
  ISwarmMessagesChannelV1DatabaseHandler,
  ISwarmMessagesChannelV1DatabaseHandlerConstructor,
} from '../types/swarm-messages-channel-v1-class-messages-database-handler.types';
import {
  ISwarmMessagesChannelNotificationEmitter,
  ESwarmMessagesChannelEventName,
} from '../../../../types/swarm-messages-channel-events.types';

/**
 * Constructor of a swarm messages channel.
 *
 * @export
 * @interface ISwarmMessagesChannelConstructor
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
export class SwarmMessagesChannelV1Class<
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
  >,
  CHD extends ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO> = ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>
> implements ISwarmMessagesChannel<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, GAC, MCF, ACO, O, SMS, MD> {
  public get id(): TSwarmMessagesChannelId {
    return this._swarmMessagesChannelDescriptionWODatabaseOptions.id;
  }

  public get version(): SWARM_MESSAGES_CHANNEL_VERSION {
    return this._swarmMessagesChannelDescriptionWODatabaseOptions.version;
  }

  public get name(): string {
    return this._swarmMessagesChannelDescriptionWODatabaseOptions.name;
  }

  public get description(): string {
    return this._swarmMessagesChannelDescriptionWODatabaseOptions.description;
  }

  public get tags(): string[] {
    return this._swarmMessagesChannelDescriptionWODatabaseOptions.tags;
  }

  public get dbType(): DbType {
    return this._swarmMessagesChannelDescriptionWODatabaseOptions.dbType;
  }

  public get messageEncryption(): SWARM_MESSAGES_CHANNEL_ENCRYPION {
    return this._swarmMessagesChannelDescriptionWODatabaseOptions.messageEncryption;
  }

  public get admins(): Array<TSwarmMessageUserIdentifierSerialized> {
    return this._swarmMessagesChannelDescriptionWODatabaseOptions.admins;
  }

  public get channelInactiveReasonError(): Error | undefined {
    return this.__channelInactiveReasonError;
  }

  public get emitterChannelState(): ISwarmMessagesChannelNotificationEmitter<P, T, DbType> {
    return this.__swarmMessagesChannelsListHandlerInstance.emitter;
  }

  public get emitterChannelMessagesDatabase(): EventEmitter<ISwarmMessageDatabaseEvents<P, T, DbType, DBO, MD>> {
    return this.__swarmMessagesChannelDatabaseHandlerInstance.emitter;
  }

  public get markedAsRemoved(): boolean {
    return this.__markedAsRemoved;
  }

  public get isReady(): boolean {
    return (
      !this.__isClosed &&
      !this.__markedAsRemoved &&
      this._whetherChannelIsActive &&
      Boolean(this.__swarmMessagesChannelDatabaseHandlerInstance.isDatabaseReady)
    );
  }

  protected get _swarmMessagesChannelDescriptionWODatabaseOptions(): ISwarmMessageChannelDescriptionWithoutDatabaseOptionsRaw<
    P,
    DbType
  > {
    return this._swarmMessagesChannelDescriptionActual;
  }

  protected get _swarmMessagesChannelDescriptionActual(): CHD {
    return this.__swarmMessagesChannelDescriptionActual;
  }

  protected get _constructorOptionsUtils(): ISwarmMessagesChannelConstructorUtils<
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
    return this.__options.utils;
  }

  /**
   * Whether the channel is active or not.
   *
   * @readonly
   * @protected
   * @type {boolean}
   * @memberof SwarmMessagesChannelV1Class
   */
  protected get _whetherChannelIsActive(): boolean {
    return !this.__channelInactiveReasonError;
  }

  protected get _actualSwarmMessagesIssuer(): string {
    const { getSwarmMessageIssuerByChannelDescription } = this._constructorOptionsUtils;
    const messagesIssuer = getSwarmMessageIssuerByChannelDescription(this.__swarmMessagesChannelDescriptionActual);

    if (!messagesIssuer) {
      throw new Error('An issuer for swarm messages which sent throught the channel is not defined');
    }
    return messagesIssuer;
  }
  // TODO - !!!! handle database close events coming from a messages database handler instance.

  // TODO - listen for the close event in the Channel class itself
  // and set channel as inactive

  protected _initializationPromise:
    | Promise<
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
      >
    | undefined;

  /**
   * This channel's descriptions is gotten from the options
   * and the updated from the channel's list.
   *
   * @private
   * @type {ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>}
   * @memberof SwarmMessagesChannelV1Class
   */
  private __swarmMessagesChannelDescriptionActual: CHD;

  /**
   * If the channel is inactive the reason should be
   * set as an error.
   *
   * @private
   * @type {(Error | undefined)}
   * @memberof SwarmMessagesChannelV1Class
   */
  private __channelInactiveReasonError: Error | undefined;

  /**
   * Whether channel marked as removed
   *
   * @private
   * @type {boolean}
   * @memberof SwarmMessagesChannelV1Class
   */
  private __markedAsRemoved: boolean = false;

  /**
   * Whether the channel has been closed before
   *
   * @private
   * @type {boolean}
   * @memberof SwarmMessagesChannelV1Class
   */
  private __isClosed: boolean = false;

  private __swarmMessagesChannelsListHandlerInstance: ISwarmMessagesChannelV1ClassChannelsListHandler<
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
  >;

  private __swarmMessagesChannelDatabaseHandlerInstance: ISwarmMessagesChannelV1DatabaseHandler<
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
  >;

  constructor(
    private __options: ISwarmMessagesChannelConstructorOptions<
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
      OPT,
      CHD
    >,
    private __swarmMessagesChannelV1ClassChannelsListHandlerConstructor: ISwarmMessagesChannelV1ClassChannelsListHandlerConstructor<
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
    >,
    private __swarmMessagesChannelV1DatabaseHandlerConstructor: ISwarmMessagesChannelV1DatabaseHandlerConstructor<
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
      OPT,
      CHD['messageEncryption']
    >
  ) {
    this._validateOptions(__options);
    this.__swarmMessagesChannelDescriptionActual = __options.swarmMessagesChannelDescription;

    const swarmMessagesChannelsListHandler = this._createSwarmMessagesChannelsListHandlerInstance();

    this.__swarmMessagesChannelsListHandlerInstance = swarmMessagesChannelsListHandler;
    this._setListenersSwarmMessagesChannelsListHandlerInstance(swarmMessagesChannelsListHandler);

    const swarmMessagesChannelDatabaseHandler = this._createSwarmMessagesChannelDatabaseHandler();

    this.__swarmMessagesChannelDatabaseHandlerInstance = swarmMessagesChannelDatabaseHandler;
    this._setListenersSwarmMessagesChannelDatabaseHandlerInstance(swarmMessagesChannelDatabaseHandler);
  }

  public async addMessage(
    message: Omit<MD['bdy'], 'iss'>,
    key: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE ? TSwarmStoreDatabaseEntityKey<P> : undefined
  ): Promise<void> {
    await this._getActiveSwarmMessagesChannelDatabaseHandlerInstance().addMessage(message, key);
  }

  public async deleteMessage(messageAddressOrKey: ISwarmMessageStoreDeleteMessageArg<P, DbType>): Promise<void> {
    await this._getActiveSwarmMessagesChannelDatabaseHandlerInstance().deleteMessage(messageAddressOrKey);
  }

  public async collect(options: TSwarmStoreDatabaseIteratorMethodArgument<P, DbType>): Promise<Array<Error | MD>> {
    const collectedMessagesResult = await this._getActiveSwarmMessagesChannelDatabaseHandlerInstance().collect(options);
    return collectedMessagesResult;
  }

  public async collectWithMeta(
    options: TSwarmStoreDatabaseIteratorMethodArgument<P, DbType>
  ): Promise<Array<ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD> | undefined>> {
    const swarmMessagesWithMetaCollected = await this._getActiveSwarmMessagesChannelDatabaseHandlerInstance().collectWithMeta(
      options
    );
    return swarmMessagesWithMetaCollected;
  }

  public async updateChannelDescription(
    channelRawDescription: Readonly<ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>>
  ): Promise<void> {
    this._verifyChannelIsReadyForChannelListOperations();
    await this._getActiveSwarmMessagesChannelsListHandlerInstance().updateChannelDescription(channelRawDescription);
  }

  public async close(): Promise<void> {
    if (this.__isClosed) {
      return;
    }
    this._setChannelClosed();
    this._unsetAllListenersOfInstancesRelated();
    await this._closeChannelDatabaseHandlerInstance();
    this.__emitChannelClosed();
    // reset state after the event will be emitted to allow for the event
    // handlers to read the channel's state
    this._resetState();
  }

  public async deleteLocally(): Promise<void> {
    this._unsetListenersSwarmMessagesChannelDatabaseHandlerInstance();

    const activeSwarmMessagesChannelDatabaseHandlerInstance = this._getActiveSwarmMessagesChannelDatabaseHandlerInstance();

    try {
      await activeSwarmMessagesChannelDatabaseHandlerInstance.dropDatabaseLocally();
    } finally {
      await this.close();
    }
  }

  public async dropDescriptionAndDeleteRemotely(): Promise<void> {
    this._unsetAllListenersOfInstancesRelated();

    const activeSwarmMessagesChannelDatabaseHandlerInstance = this._getActiveSwarmMessagesChannelDatabaseHandlerInstance();
    const activeSwarmMessagesChannelsListHandlerInstance = this._getActiveSwarmMessagesChannelsListHandlerInstance();

    try {
      await activeSwarmMessagesChannelsListHandlerInstance.dropChannelDescriptionFromList();
      await activeSwarmMessagesChannelDatabaseHandlerInstance.dropDatabaseLocally();
    } finally {
      await this.close();
    }
  }

  protected _validateSwarmMessagesChannelsListInstance(
    swarmMessagesChannelsListInstance: ISwarmMessagesChannelsDescriptionsList<P, T, MD>
  ): void {
    assert(swarmMessagesChannelsListInstance, 'swarmMessagesChannelsListInstance must not be empty');
    assert(typeof swarmMessagesChannelsListInstance === 'object', 'swarmMessagesChannelsListInstance must be an object');
    // validate methods of the instance which will be used
    assert(
      typeof swarmMessagesChannelsListInstance.upsertChannel === 'function',
      'swarmMessagesChannelsListInstance have an unknown implementation because the method "upsertChannel" is not a function'
    );
    assert(
      typeof swarmMessagesChannelsListInstance.removeChannelById === 'function',
      'swarmMessagesChannelsListInstance have an unknown implementation because the method "removeChannelById" is not a function'
    );
  }

  protected _validateSwarmChannelDescription(
    swarmMessagesChannelDescription: ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>
  ): void {
    validateVerboseBySchemaWithVoidResult(
      swarmMessagesChannelDescriptionJSONSchema as JSONSchema7,
      swarmMessagesChannelDescription
    );
    swarmMessagesChannelValidationDescriptionFormatV1(swarmMessagesChannelDescription);
  }

  protected _validateOptions(
    options: ISwarmMessagesChannelConstructorOptions<
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
    assert(options, 'Options must be provided');
    assert(typeof options === 'object', 'Options must be an object');

    const {
      swarmMessagesChannelDescription,
      swarmMessagesChannelsListInstance,
      passwordEncryptedChannelEncryptionQueue,
    } = options;

    this._validateSwarmMessagesChannelsListInstance(swarmMessagesChannelsListInstance);
    this._validateSwarmChannelDescription(swarmMessagesChannelDescription);

    if (swarmMessagesChannelDescription.messageEncryption === SWARM_MESSAGES_CHANNEL_ENCRYPION.PASSWORD) {
      assert(
        passwordEncryptedChannelEncryptionQueue,
        'Encryption queue must be provided in constructor options for channel with password encryption'
      );
    }
  }

  protected _getOptionsForSwarmMessagesChannelsListConstructor(): ISwarmMessagesChannelV1ClassChannelsListHandlerConstructorOptions<
    P,
    T,
    DbType,
    DBO,
    MD
  > {
    return getOptionsForChannelsListHandlerByContstructorOptions<
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
    >(this.__options);
  }

  protected _createSwarmMessagesChannelsListHandlerInstance(): ISwarmMessagesChannelV1ClassChannelsListHandler<
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
    const SwarmMessagesChannelV1ClassChannelsListHandlerConstructor = this
      .__swarmMessagesChannelV1ClassChannelsListHandlerConstructor;
    const constructorOptions = this._getOptionsForSwarmMessagesChannelsListConstructor();
    const swarmMessagesChannelsListInstance = new SwarmMessagesChannelV1ClassChannelsListHandlerConstructor(constructorOptions);

    return swarmMessagesChannelsListInstance;
  }

  protected _setChannelInactiveReasonError(channelInactivityResonError: Error): void {
    this.__channelInactiveReasonError = channelInactivityResonError;
  }

  protected _unsetChannelInactiveReasonError(): void {
    this.__channelInactiveReasonError = undefined;
  }

  protected _setChannelClosed(): void {
    this.__isClosed = true;
  }

  protected _setChannelMarkedAsRemoved(): void {
    this.__markedAsRemoved = true;
  }

  protected _unsetChannelMarkedAsRemoved(): void {
    this.__markedAsRemoved = false;
  }

  protected _unsetInstancesRelated(): void {
    (this as any).__swarmMessagesChannelsListHandlerInstance = undefined;
    (this as any).__swarmMessagesChannelDatabaseHandlerInstance = undefined;
  }

  protected _setListenersSwarmMessagesChannelsListHandlerInstance(
    swarmMessagesChannelsListInstance: ISwarmMessagesChannelV1ClassChannelsListHandler<
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
    >,
    isAddListeners: boolean = true
  ): void {
    const emitter = swarmMessagesChannelsListInstance.emitter as EventEmitter<ISwarmMessagesChannelEvents<P, T, DbType>>;
    const methodName = isAddListeners ? 'addListener' : 'removeListener';

    emitter[methodName as 'addListener'](
      ESwarmMessagesChannelsListEventName.CHANNEL_DESCRIPTION_UPDATE,
      this.handleChannelsListHandlerEventChannelDescriptionUpdate
    );
    emitter[methodName as 'addListener'](
      ESwarmMessagesChannelsListEventName.CHANNEL_DESCRIPTION_REMOVED,
      this.__handleChannelsListHandlerEventChannelDescriptionRemoved
    );
  }

  protected _setChannelDescriptionActual(channelDescriptionUpdated: ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>) {
    this.__swarmMessagesChannelDescriptionActual = channelDescriptionUpdated as CHD;
  }

  protected async _restartActualSwarmMessagesChannelDatabaseHandlerInstanceByActualChannelDescription(): Promise<void> {
    const swarmMessagesChannelDatabaseHandlerActive = this._getActiveSwarmMessagesChannelDatabaseHandlerInstance();
    const channelDatabaseOptionsActual = this._getChannelDatabaseOptionsByChannelDescriptionActual();

    await swarmMessagesChannelDatabaseHandlerActive.restartDatabaseConnectorInstanceWithDbOptions(channelDatabaseOptionsActual);
  }

  protected async _restartChannelDatabaseConnectorWithDatabaseHandler(): Promise<void> {
    await this._restartActualSwarmMessagesChannelDatabaseHandlerInstanceByActualChannelDescription();
  }

  protected _getChannelDatabaseOptionsByChannelDescriptionActual(): DBO {
    const { swarmMessagesChannelDescription } = this.__options;
    const { getDatabaseNameByChannelDescription } = this._constructorOptionsUtils;
    const channelDatabaseOptionsPartial = this._swarmMessagesChannelDescriptionActual.dbOptions;
    const dbName = getDatabaseNameByChannelDescription(swarmMessagesChannelDescription);

    return {
      dbName,
      dbType: swarmMessagesChannelDescription.dbType,
      ...channelDatabaseOptionsPartial,
    } as DBO;
  }

  protected _getMessagesEncryptionQueueOrUndefinedIfChannelNotEncryptedByPassword(
    messageEncryption: CHD['messageEncryption']
  ): CHD['messageEncryption'] extends SWARM_MESSAGES_CHANNEL_ENCRYPION.PASSWORD ? IQueuedEncryptionClassBase : undefined {
    if (messageEncryption === SWARM_MESSAGES_CHANNEL_ENCRYPION.PASSWORD) {
      const { passwordEncryptedChannelEncryptionQueue } = this.__options;
      if (!passwordEncryptedChannelEncryptionQueue) {
        throw new Error('An encryption queue instance should be set');
      }
      return passwordEncryptedChannelEncryptionQueue;
    }
    return undefined as CHD['messageEncryption'] extends SWARM_MESSAGES_CHANNEL_ENCRYPION.PASSWORD
      ? IQueuedEncryptionClassBase
      : undefined;
  }

  protected _getOptionsForChannelDatabaseHandlerConstructor(): ISwarmMessagesChannelV1DatabaseHandlerConstructorOptions<
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
    OPT,
    CHD['messageEncryption']
  > {
    const messagesIssuer = this._actualSwarmMessagesIssuer;
    const messageEncryptionType: CHD['messageEncryption'] = this._swarmMessagesChannelDescriptionActual.messageEncryption;
    const databaseOptions = this._getChannelDatabaseOptionsByChannelDescriptionActual();
    const messagesEncryptionQueue = this._getMessagesEncryptionQueueOrUndefinedIfChannelNotEncryptedByPassword(
      messageEncryptionType
    );
    const swarmMessagesDatabaseConnectorInstanceByDBOFabric = this.__options.utils
      .swarmMessagesDatabaseConnectorInstanceByDBOFabric;
    return {
      databaseOptions,
      messagesEncryptionQueue,
      messageEncryptionType,
      messagesIssuer,
      swarmMessagesDatabaseConnectorInstanceByDBOFabric,
    };
  }

  protected _createSwarmMessagesChannelDatabaseHandler(): ISwarmMessagesChannelV1DatabaseHandler<
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
    const ChannelDatabaseHandlerConstructor = this.__swarmMessagesChannelV1DatabaseHandlerConstructor;
    const constructorOptions = this._getOptionsForChannelDatabaseHandlerConstructor();
    const channelDatabaseHandlerInstance = new ChannelDatabaseHandlerConstructor(constructorOptions);
    return channelDatabaseHandlerInstance;
  }

  protected _setListenersSwarmMessagesChannelDatabaseHandlerInstance(
    swarmMessagesChannelDatabaseHandlerInstance: ISwarmMessagesChannelV1DatabaseHandler<
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
    >,
    isAddListeners: boolean = true
  ): void {
    const emitter = swarmMessagesChannelDatabaseHandlerInstance.emitter;
    const methodName = isAddListeners ? 'addListener' : 'removeListener';

    emitter[methodName](ESwarmStoreEventNames.READY, this.__handleChannelDatabaseHandlerEventDatabaseReady);
    emitter[methodName](ESwarmStoreEventNames.CLOSE_DATABASE, this.__handleChannelDatabaseHandlerEventDatabaseClosed);
    emitter[methodName](ESwarmStoreEventNames.DROP_DATABASE, this.__handleChannelDatabaseHandlerEventDatabaseDropped);
  }

  protected _unsetListenersSwarmMessagesChannelDatabaseHandlerInstance() {
    this._setListenersSwarmMessagesChannelDatabaseHandlerInstance(this.__swarmMessagesChannelDatabaseHandlerInstance, false);
  }

  protected _unsetListenersSwarmMessagesChannelsListHandlerInstance() {
    this._setListenersSwarmMessagesChannelsListHandlerInstance(this.__swarmMessagesChannelsListHandlerInstance, false);
  }

  protected _unsetAllListenersOfInstancesRelated(): void {
    this._unsetListenersSwarmMessagesChannelsListHandlerInstance();
    this._unsetListenersSwarmMessagesChannelDatabaseHandlerInstance();
  }

  protected async _closeChannelDatabaseHandlerInstance(): Promise<void> {
    return await this.__swarmMessagesChannelDatabaseHandlerInstance.close();
  }

  protected _resetState(): void {
    this._unsetChannelMarkedAsRemoved();
    this._unsetChannelInactiveReasonError();
    this._unsetInstancesRelated();
  }

  protected _verifyChannelIsNotClosed(): void {
    assert(!this.__isClosed, 'The channel has already been closed');
  }

  protected _verifyChannelIsReadyForMessaging(): void {
    this._verifyChannelIsNotClosed();
    assert(!this.__markedAsRemoved, 'The channel has already been marked as removed');
  }

  protected _verifyChannelIsReadyForChannelListOperations(): void {
    this._verifyChannelIsNotClosed();
    if (this.__markedAsRemoved) {
      // TODO - might be better to prohibit channel description updates if the channel has alreadybeen closed
      console.warn('The channel is closed, better not to update its description');
    }
  }

  protected _getActiveSwarmMessagesChannelDatabaseHandlerInstance(): ISwarmMessagesChannelV1DatabaseHandler<
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
    this._verifyChannelIsReadyForMessaging();
    return this.__swarmMessagesChannelDatabaseHandlerInstance;
  }

  protected async __closeChannelWithReasonError(error: Error): Promise<void> {
    this._setChannelInactiveReasonError(new Error('Channel database dropped unexpectedly'));
    this.__emitChannelClosed();
    await this.close();
  }

  protected _getActiveSwarmMessagesChannelsListHandlerInstance(): ISwarmMessagesChannelV1ClassChannelsListHandler<
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
    this._verifyChannelIsReadyForChannelListOperations();
    return this.__swarmMessagesChannelsListHandlerInstance;
  }

  private __emitChannelOpened(): void {
    (this.emitterChannelState as EventEmitter<ISwarmMessagesChannelEvents<P, T, DbType>>).emit(
      ESwarmMessagesChannelEventName.CHANNEL_OPEN,
      this.id
    );
  }

  private __emitChannelClosed(): void {
    (this.emitterChannelState as EventEmitter<ISwarmMessagesChannelEvents<P, T, DbType>>).emit(
      ESwarmMessagesChannelEventName.CHANNEL_CLOSED,
      this.id
    );
  }

  private handleChannelsListHandlerEventChannelDescriptionUpdate = async (
    channelDescriptionUpdated: ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>
  ): Promise<void> => {
    if (!isDeepEqual(channelDescriptionUpdated, this.__swarmMessagesChannelDescriptionActual)) {
      this._setChannelDescriptionActual(channelDescriptionUpdated);
      try {
        await this._restartChannelDatabaseConnectorWithDatabaseHandler();
      } catch (err) {
        this._setChannelInactiveReasonError(err);
        return;
      }
    }
    this._unsetChannelMarkedAsRemoved();
  };

  private __handleChannelsListHandlerEventChannelDescriptionRemoved = (): void => {
    this._setChannelInactiveReasonError(new Error('Channel description has been removed from the channels list'));
    this._setChannelMarkedAsRemoved();
    this.__emitChannelClosed();
  };

  private __handleChannelDatabaseHandlerEventDatabaseReady = (): void => {
    if (this.isReady) {
      this.__emitChannelOpened();
    }
  };

  private __handleChannelDatabaseHandlerEventDatabaseClosed = async (): Promise<void> => {
    try {
      await this.__closeChannelWithReasonError(new Error('Channel database closed unexpectedly'));
    } catch (err) {
      console.error('__handleChannelDatabaseHandlerEventDatabaseClosed', err);
      throw err;
    }
  };

  private __handleChannelDatabaseHandlerEventDatabaseDropped = async (): Promise<void> => {
    try {
      await this.__closeChannelWithReasonError(new Error('Channel database dropped unexpectedly'));
    } catch (err) {
      console.error('__handleChannelDatabaseHandlerEventDatabaseDropped', err);
      throw err;
    }
  };
}
