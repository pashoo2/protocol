import { ESwarmStoreConnector } from '../../../../swarm-store-class/swarm-store-class.const';
import {
  TSwarmMessageSerialized,
  TSwarmMessageConstructorBodyMessage,
  ISwarmMessageInstanceDecrypted,
} from '../../../../swarm-message/swarm-message-constructor.types';
import {
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseOptionsSerialized,
} from '../../../../swarm-store-class/swarm-store-class.types';
import {
  ESwarmStoreConnectorOrbitDbDatabaseType,
  EOrbitDbFeedStoreOperation,
} from '../../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { ISwarmMessageChannelDescriptionRaw } from '../../../types/swarm-messages-channel.types';
import { createImmutableObjectClone } from '../../../../../utils/data-immutability-utils/data-immutability-key-value-structure-utils';
import { PromiseResolveType } from '../../../../../types/promise.types';
import { TSwarmMessagesChannelId } from '../../../types/swarm-messages-channel.types';
import { TSwarmStoreConnectorAccessConrotllerGrantAccessCallback } from '../../../../swarm-store-class/swarm-store-class.types';
import { IValidatorOfSwarmMessageWithChannelDescription } from '../../../types/swarm-messages-channels-validation.types';
import assert from 'assert';
import {
  ISwarmMessagesChannelsDescriptionsListConnectionOptions,
  TSwrmMessagesChannelsListDBOWithGrantAccess,
} from '../../../types/swarm-messages-channels-list.types';
import { isNativeFunction, isArrowFunction } from '../../../../../utils/common-utils/common-utils.functions';
import {
  ISwarmMessagesChannelsDescriptionsList,
  ISwarmMessagesChannelsDescriptionsListConstructorArguments,
} from '../../../types/swarm-messages-channels-list.types';

export class SwarmMessagesChannelsListVersionOne<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T>,
  CARGS extends ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, DBO>
> implements ISwarmMessagesChannelsDescriptionsList<P, T> {
  public get description(): CARGS['description'] {
    return this._channelsListDescription;
  }

  protected readonly _channelsListDescription: CARGS['description'];

  protected readonly _connectionOptions: CARGS['connectionOptions'];

  protected readonly _serializer: CARGS['serializer'];

  protected readonly _utilities: CARGS['utilities'];

  protected readonly _validators: CARGS['validators'];

  constructor(constructorArguments: CARGS) {
    const {
      databaseConnectionFabric,
      serializer,
      description,
      swarmMessagesChannelDescriptionFormatValidator,
    } = constructorArguments;

    this._serializer = serializer;
    this._swarmMessagesChannelDescriptionFormatValidator = swarmMessagesChannelDescriptionFormatValidator;
    this._connectionOptions = createImmutableObjectClone(description);
    this._swarmMessagesDatabasePending = databaseConnectionFabric(description.dbOptions) as ReturnType<
      CARGS['databaseConnectionFabric']
    >;
  }

  public async addChannel(channelDescriptionRaw: ISwarmMessageChannelDescriptionRaw<P, T, any, any>): Promise<void> {
    if (!this._validateChannelDescription(channelDescriptionRaw)) {
      throw new Error('The channel description is not ready');
    }

    const serializedChannelDescription = this._serializeChannelDescriptionRaw(channelDescriptionRaw);
    await this._setChannelDescriptionSerializedInSwarm(channelDescriptionRaw.id, serializedChannelDescription);
  }

  // TODO - move validation in another class or util

  protected _validateConstructorArgumentsConnectionOptionsDbOptions(dbOptions: DBO): void {
    assert((dbOptions as unknown).dbName, 'A database name should not be provided in the options');
    assert((dbOptions as unknown).dbType, 'A database type should not be provided in the options');
    // TODO - create grant access function validator common and pass it in the params
    assert(dbOptions.grantAccess, 'Grant access callback must be provided in the databse options');
    assert(typeof dbOptions.grantAccess === 'function', 'Grant access callback should be a function');
    assert(dbOptions.grantAccess.name === 'function', 'Grant access callback should have a name');
    assert(dbOptions.grantAccess.length >= 3, 'Grant access callback should handle at leas 3 params');
    assert(!isNativeFunction(dbOptions.grantAccess), 'Grant access callback should not be a native function');
    assert(!isArrowFunction(dbOptions.grantAccess), 'Grant access callback should not be an arrow function function');
  }

  protected _validateConstructorArgumentsConnectionOptions(
    connectionOptions: Readonly<ISwarmMessagesChannelsDescriptionsListConnectionOptions<P, T, DBO>>
  ): void {
    assert(connectionOptions, 'Conection options should be provided');
    assert(connectionOptions.connectorType, 'Connector type is not provided');
    assert(connectionOptions.dbOptions, 'A database options must be provided');
    this._validateConstructorArgumentsConnectionOptionsDbOptions(connectionOptions.dbOptions);
  }

  protected _validateConstructorArguments(constructorArguments: CARGS): void {
    assert(constructorArguments, 'Constructor arguments must be provided');

    const { serializer, connectionOptions } = constructorArguments;

    assert(serializer, 'A serializer must be provided in arguments');
    assert(connectionOptions, '');
  }

  protected _createGrandAccessCallbackForChannelsListDatabase(
    grandAccessCallbackFromDbOptions: DBO['grantAccess']
  ): TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, T, ISwarmMessageInstanceDecrypted> {
    // TODO - pass this function into the options
  }

  protected _extendChannelsListSwarmDatabaseOptionsWithGrandAccessCallback(
    dbOptions: DBO
  ): DBO & {
    grantAccess: TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, T, ISwarmMessageInstanceDecrypted>;
  } {}

  protected async _getSwarmMessagesKeyValueDatabase(): Promise<
    PromiseResolveType<ReturnType<CARGS['databaseConnectionFabric']>>
  > {
    return (await this._swarmMessagesDatabasePending) as PromiseResolveType<ReturnType<CARGS['databaseConnectionFabric']>>;
  }

  protected _validateChannelDescription(channelDescriptionRaw: ISwarmMessageChannelDescriptionRaw<P, T, any, any>): boolean {
    return this._swarmMessagesChannelDescriptionFormatValidator(channelDescriptionRaw);
  }

  protected _serializeChannelDescriptionRaw(channelDescriptionRaw: ISwarmMessageChannelDescriptionRaw<P, T, any, any>): string {
    return this._serializer.stringify(channelDescriptionRaw.dbOptions);
  }

  /**
   * Returns type of a message, which represents a swarm messages channel description
   *
   * @protected
   * @returns {Pick<TSwarmMessageConstructorBodyMessage, 'typ'>['typ']}
   * @memberof SwarmMessagesChannelsListVersionOne
   */
  protected _createChannelDescriptionMessageTyp(): Pick<TSwarmMessageConstructorBodyMessage, 'typ'>['typ'] {
    return this._connectionOptions.version;
  }

  /**
   * Return an issuer of a message, which represents a swarm messages channel description
   *
   * @protected
   * @returns {Pick<TSwarmMessageConstructorBodyMessage, 'iss'>['iss']}
   * @memberof SwarmMessagesChannelsListVersionOne
   */
  protected _createChannelDescriptionMessageIssuer(): Pick<TSwarmMessageConstructorBodyMessage, 'iss'>['iss'] {
    return this._connectionOptions.id;
  }

  /**
   * Returns swarm message's channel description type and issuer
   * params
   *
   * @protected
   * @returns {Omit<TSwarmMessageConstructorBodyMessage, 'pld'>}
   * @memberof SwarmMessagesChannelsListVersionOne
   */
  protected _createChannelDescriptionMessageBodyRequiredPropsWithoutPayload(): Omit<TSwarmMessageConstructorBodyMessage, 'pld'> {
    return {
      typ: this._createChannelDescriptionMessageTyp(),
      iss: this._createChannelDescriptionMessageIssuer(),
    };
  }

  protected _createChannelDescriptionMessageBody(channelDescriptionSerialized: string): TSwarmMessageConstructorBodyMessage {
    const channelDescriptionMessageBodyWithoutPayload = this._createChannelDescriptionMessageBodyRequiredPropsWithoutPayload();
    return {
      ...channelDescriptionMessageBodyWithoutPayload,
      pld: channelDescriptionSerialized,
    };
  }

  protected _getKeyInDatabaseForMessagesChannelId(channelId: TSwarmMessagesChannelId): string {
    return channelId;
  }

  protected async _setChannelDescriptionSerializedInSwarm(
    channelId: TSwarmMessagesChannelId,
    channelDescriptionSerialized: string
  ): Promise<void> {
    const keyValueDatabase = await this._getSwarmMessagesKeyValueDatabase();
    const swarmMessageWithChannelDescription = this._createChannelDescriptionMessageBody(channelDescriptionSerialized);
    const keyInDatabaseForChannelDescription = this._getKeyInDatabaseForMessagesChannelId(channelId);
    await keyValueDatabase.addMessage(swarmMessageWithChannelDescription, keyInDatabaseForChannelDescription);
  }
}
