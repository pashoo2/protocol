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
import { TSwarmMessageUserIdentifierSerialized } from '../../../../../swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';
import { ISwarmMessagesDatabaseConnector } from '../../../../../swarm-messages-database/swarm-messages-database.types';
import { getOptionsForChannelsListHandlerByContstructorOptions } from '../utils/swarm-messages-channel-v1-class.utils';
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
import { ESwarmMessagesChannelsListEventName } from '../../../../types/swarm-messages-channel-events.types';
import { isDeepEqual } from '../../../../../../utils/common-utils/common-utils-equality';
import { ISwarmMessagesChannelV1ClassChannelsListHandlerConstructorOptions } from '../types/swarm-messages-channel-v1-class-channels-list-handler.types';
import { ISwarmMessagesChannelV1DatabaseHandlerConstructorOptions } from '../types/swarm-messages-channel-v1-class-messages-database-handler.types';
import { IQueuedEncryptionClassBase } from '../../../../../basic-classes/queued-encryption-class-base/queued-encryption-class-base.types';
import { ESwarmStoreEventNames } from '../../../../../swarm-store-class/swarm-store-class.const';
import {
  ISwarmMessagesChannelV1ClassChannelsListHandler,
  ISwarmMessagesChannelV1ClassChannelsListHandlerConstructor,
} from '../types/swarm-messages-channel-v1-class-channels-list-handler.types';
import {
  ISwarmMessagesChannelV1DatabaseHandler,
  ISwarmMessagesChannelV1DatabaseHandlerConstructor,
} from '../types/swarm-messages-channel-v1-class-messages-database-handler.types';

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

  public get version(): string {
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

  public async close(): Promise<void> {
    this._unsetAllListenersOfInstancesRelated();
    await this._closeChannelDatabaseHandlerInstance();
    this._resetState();
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
    const emitter = swarmMessagesChannelsListInstance.emitter;
    const methodName = isAddListeners ? 'addListener' : 'removeListener';

    emitter[methodName](
      ESwarmMessagesChannelsListEventName.CHANNEL_DESCRIPTION_UPDATE,
      this.handleChannelsListHandlerEventChannelDescriptionUpdate
    );
    emitter[methodName](
      ESwarmMessagesChannelsListEventName.CHANNEL_DESCRIPTION_REMOVED,
      this.__handleChannelsListHandlerEventChannelDescriptionRemoved
    );
  }

  protected _setChannelDescriptionActual(channelDescriptionUpdated: ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>) {
    this.__swarmMessagesChannelDescriptionActual = channelDescriptionUpdated as CHD;
  }

  protected _restartChannelDatabaseConnectorWithDatabaseHandler() {
    this._restartActualSwarmMessagesChannelDatabaseHandlerInstanceByActualChannelDescription();
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

    emitter[methodName](ESwarmStoreEventNames.CLOSE_DATABASE, this.__handleChannelDatabaseHandlerEventDatabaseClosed);
    emitter[methodName](ESwarmStoreEventNames.DROP_DATABASE, this.__handleChannelDatabaseHandlerEventDatabaseDropped);
  }

  protected _unsetAllListenersOfInstancesRelated(): void {
    this._setListenersSwarmMessagesChannelsListHandlerInstance(this.__swarmMessagesChannelsListHandlerInstance, false);
    this._setListenersSwarmMessagesChannelDatabaseHandlerInstance(this.__swarmMessagesChannelDatabaseHandlerInstance, false);
  }

  protected async _closeChannelDatabaseHandlerInstance(): Promise<void> {
    return await this.__swarmMessagesChannelDatabaseHandlerInstance.close();
  }

  protected _resetState(): void {
    this._unsetChannelMarkedAsRemoved();
    this._unsetChannelInactiveReasonError();
    this._unsetInstancesRelated();
  }

  private handleChannelsListHandlerEventChannelDescriptionUpdate = (
    channelDescriptionUpdated: ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>
  ) => {
    if (!isDeepEqual(channelDescriptionUpdated, this.__swarmMessagesChannelDescriptionActual)) {
      this._setChannelDescriptionActual(channelDescriptionUpdated);
      this._restartChannelDatabaseConnectorWithDatabaseHandler();
    }
    this._unsetChannelMarkedAsRemoved();
  };

  private __handleChannelsListHandlerEventChannelDescriptionRemoved = (): void => {
    this._setChannelInactiveReasonError(new Error('Channel description has been removed from the channels list'));
    this._setChannelMarkedAsRemoved();
  };

  private __handleChannelDatabaseHandlerEventDatabaseClosed = (): void => {
    this._setChannelInactiveReasonError(new Error('Channel database closed unexpectedly'));
  };

  private __handleChannelDatabaseHandlerEventDatabaseDropped = (): void => {
    this._setChannelInactiveReasonError(new Error('Channel database dropped unexpectedly'));
  };
}
