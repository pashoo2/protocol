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
import {
  ISwarmMessagesChannelConstructorOptionsValidators,
  TSwarmMessagesChannelId,
} from '../../../types/swarm-messages-channel.types';
import assert from 'assert';
import { ISwarmMessagesChannelsDescriptionsList } from '../../../types/swarm-messages-channels-list.types';
import { swarmMessagesChannelValidationDescriptionFormatV1 } from '../../../swarm-messages-channels-utils/swarm-messages-channel-utils/swarm-messages-channel-validation-utils/swarm-messages-channel-validation-description-utils/swarm-messages-channel-validation-description-format-v1/swarm-messages-channel-validation-description-format-v1';
import { validateVerboseBySchemaWithVoidResult } from 'utils/validation-utils/validation-utils';
import {
  ISwarmMessagesChannelConstructorOptions,
  ISwarmMessagesChannel,
  ISwarmMessageChannelDescriptionRaw,
} from '../../../types/swarm-messages-channel.types';
import swarmMessagesChannelDescriptionJSONSchema from '../../../const/validation/swarm-messages-channel/swarm-messages-channel-description/schemas/swarm-message-channel-description-v1-format-schema.json';
import { JSONSchema7 } from 'json-schema';
import { ISwarmMessageChannelDescriptionWithoutDatabaseOptionsRaw } from '../../../types/swarm-messages-channel.types';
import { SWARM_MESSAGES_CHANNEL_ENCRYPION } from '../../../const/swarm-messages-channels-main.const';
import { TSwarmMessageUserIdentifierSerialized } from '../../../../swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';
import { isDeepEqual } from '../../../../../utils/common-utils/common-utils-equality';

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
 * @template PO
 * @template CO
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
  PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
  CO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, PO>,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, PO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain>,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MD | T>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MD | T, GAC> | undefined,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    PO,
    CO,
    ConnectorMain,
    CFO,
    MD | T,
    GAC,
    MCF,
    ACO
  >,
  SMS extends ISwarmMessageStore<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO, O>,
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
    PO,
    CO,
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
> {
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

  protected get _swarmMessagesChannelDescriptionWODatabaseOptions(): ISwarmMessageChannelDescriptionWithoutDatabaseOptionsRaw<
    P,
    DbType
  > {
    return this._swarmMessagesChannelDescription;
  }

  protected get _swarmMessagesChannelDescription(): ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO> {
    return this.__options.swarmMessagesChannelDescription;
  }

  protected get _databaseOptionsPartial(): Pick<DBO, 'isPublic' | 'grantAccess' | 'write'> {
    return this.__options.swarmMessagesChannelDescription.dbOptions;
  }

  protected get _chanelsListInstance(): ISwarmMessagesChannelsDescriptionsList<P, T, MD> {
    return this.__options.swarmMessagesChannelsListInstance;
  }

  protected get _addChannelToTheListPromise(): Promise<void> {
    return this.__addChannelToTheListPromise;
  }

  /**
   * Synchronous process of adding this channel's description
   * to a channels list.
   * At first an existing channel description will be gotten
   * and verified for deep equality to the channel description
   * from the options.
   *
   * @private
   * @type {Promise<void>}
   * @memberof SwarmMessagesChannelV1Class
   */
  private readonly __addChannelToTheListPromise: Promise<void>;

  constructor(
    private __options: ISwarmMessagesChannelConstructorOptions<
      P,
      T,
      DbType,
      DBO,
      ConnectorBasic,
      PO,
      CO,
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
  ): ISwarmMessagesChannel<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, GAC, MCF, ACO, O, SMS, MD> {
    this._validateOptions(__options);
    this.__addChannelToTheListPromise = this._createPromiseAddChannelDescriptionToTheChannelsList();
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

  protected _validateValidatorsOption(validators: ISwarmMessagesChannelConstructorOptionsValidators<P, T, DbType, DBO>): void {
    assert(validators, 'Validators must be an object');
    assert(typeof validators.jsonSchemaValidator === 'function', 'jsonSchemaValidator validator should be a function');
    assert(
      typeof validators.swarmMessagesChannelDescriptionFormatValidator === 'function',
      'swarmMessagesChannelDescriptionFormatValidator must be a function'
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
      PO,
      CO,
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

    const { swarmMessagesChannelDescription, swarmMessagesChannelsListInstance, validators } = options;

    this._validateSwarmMessagesChannelsListInstance(swarmMessagesChannelsListInstance);
    this._validateValidatorsOption(validators);
    this._validateSwarmChannelDescription(swarmMessagesChannelDescription);
  }

  protected async _validateChannelDescriptionWithValidatorFromOptions(
    channelDescriptionRaw: ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>,
    validators: ISwarmMessagesChannelConstructorOptionsValidators<P, T, DbType, DBO>
  ): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { jsonSchemaValidator, swarmMessagesChannelDescriptionFormatValidator } = validators;

    await swarmMessagesChannelDescriptionFormatValidator(channelDescriptionRaw, jsonSchemaValidator);
  }

  protected async _updateChannelDescriptionInChannelsList(
    swarmChannelDescriptionFromOptions: ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>
  ): Promise<void> {
    await this._chanelsListInstance.upsertChannel(swarmChannelDescriptionFromOptions);
  }

  /**
   * Get a description of the channel by it's identity from the channels list
   * provided in the constructor options and compares it with a description from the options.
   * If a difference will be found, then the description in channels list will be updated by
   * the description from the constructor options.
   *
   * @protected
   * @returns {Promise<void>}
   * @memberof SwarmMessagesChannelV1Class
   */
  protected async _createPromiseAddChannelDescriptionToTheChannelsList(): Promise<void> {
    const channelDescriptionFromChannelsList = await this._chanelsListInstance.getChannelDescriptionById(this.id);
    const swarmChannelDescriptionFromOptions = this._swarmMessagesChannelDescription;

    if (!isDeepEqual(channelDescriptionFromChannelsList, swarmChannelDescriptionFromOptions)) {
      await this._updateChannelDescriptionInChannelsList(swarmChannelDescriptionFromOptions);
    }
  }
}
