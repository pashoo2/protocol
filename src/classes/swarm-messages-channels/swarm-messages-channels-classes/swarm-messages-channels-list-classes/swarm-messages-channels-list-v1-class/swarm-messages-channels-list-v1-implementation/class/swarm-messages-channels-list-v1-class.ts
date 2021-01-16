import { ESwarmStoreConnector } from '../../../../../../swarm-store-class/swarm-store-class.const';
import {
  TSwarmMessageSerialized,
  TSwarmMessageConstructorBodyMessage,
  ISwarmMessageInstanceDecrypted,
} from '../../../../../../swarm-message/swarm-message-constructor.types';
import { ISwarmMessageChannelDescriptionRaw } from '../../../../../types/swarm-messages-channel.types';
import { PromiseResolveType } from '../../../../../../../types/promise.types';
import { TSwarmMessagesChannelId } from '../../../../../types/swarm-messages-channel.types';
import {
  TSwarmStoreConnectorAccessConrotllerGrantAccessCallback,
  TSwarmStoreDatabaseOptions,
} from '../../../../../../swarm-store-class/swarm-store-class.types';
import { TSwrmMessagesChannelsListDBOWithGrantAccess } from '../../../../../types/swarm-messages-channels-list.types';
import { SwarmMessagesChannelsListVersionOneOptionsSetUp } from '../subclasses/swarm-messages-channels-list-v1-class-options-setup/swarm-messages-channels-list-v1-class-options-setup';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { TSwarmStoreDatabaseEntryOperation } from '../../../../../../swarm-store-class/swarm-store-class.types';
import { TSwarmMessageUserIdentifierSerialized } from '../../../../../../swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';
import { IValidatorOfSwarmMessageWithChannelDescriptionArgument } from '../../../../../types/swarm-messages-channels-validation.types';
import { ESwarmStoreConnectorOrbitDbDatabaseIteratorOption } from '../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
import {
  ISwarmMessagesChannelsListV1GrantAccessConstantArguments,
  ISwarmMessagesChannelsListV1GrantAccessVariableArguments,
} from './swarm-messages-channels-list-v1-implementation.types';
import {
  ISwarmMessagesChannelsDescriptionsList,
  ISwarmMessagesChannelsDescriptionsListConstructorArguments,
} from '../../../../../types/swarm-messages-channels-list.types';

// TODO - remove when the fabric will be ready

export class SwarmMessagesChannelsListVersionOne<
    P extends ESwarmStoreConnector,
    T extends TSwarmMessageSerialized,
    I extends ISwarmMessageInstanceDecrypted,
    CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
    DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, I, CTX>,
    CARGS extends ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, I, CTX, DBO>
  >
  extends SwarmMessagesChannelsListVersionOneOptionsSetUp<P, T, I, CTX, DBO, CARGS>
  implements ISwarmMessagesChannelsDescriptionsList<P, T> {
  public get description(): Readonly<CARGS['description']> {
    return this._getChannelsListDescription();
  }

  protected _swarmMessagesKeyValueDatabaseConnection:
    | PromiseResolveType<ReturnType<CARGS['utilities']['databaseConnectionFabric']>>
    | undefined;

  public async addChannel(channelDescriptionRaw: ISwarmMessageChannelDescriptionRaw<P, T, any, any>): Promise<void> {
    if (!this._validateChannelDescription(channelDescriptionRaw)) {
      throw new Error('The channel description is not ready');
    }

    const serializedChannelDescription = this._serializeChannelDescriptionRaw(channelDescriptionRaw);
    await this._setChannelDescriptionSerializedInSwarm(channelDescriptionRaw.id, serializedChannelDescription);
  }

  protected _getChannelsListDatabaseName(): string {
    const channelListDescription = this._getChannelsListDescription();
    const { databaseNameGenerator } = this._getUtilities();

    return databaseNameGenerator(channelListDescription);
  }

  protected _getConstantArgumentsForGrantAccessCallbackValidator(): ISwarmMessagesChannelsListV1GrantAccessConstantArguments<
    P,
    T,
    I,
    CTX,
    DBO
  > {
    const channelsListDescription = this._getChannelsListDescription();
    const {
      dbOptions: { grantAccess },
    } = this._getConnectionOptions();
    const {
      getDatabaseKeyForChannelDescription,
      getTypeForSwarmMessageWithChannelDescriptionByChannelDescription,
      getIssuerForSwarmMessageWithChannelDescriptionByChannelDescription,
    } = this._getUtilities();
    const { swarmMessagesChannelDescriptionFormatValidator } = this._getValidators();

    return {
      channelsListDescription,
      grandAccessCallbackFromDbOptions: grantAccess as NonNullable<DBO['grantAccess']>,
      getIssuerForSwarmMessageWithChannelDescriptionByChannelsListDescription: getIssuerForSwarmMessageWithChannelDescriptionByChannelDescription,
      getTypeForSwarmMessageWithChannelDescriptionByChannelsListDescription: getTypeForSwarmMessageWithChannelDescriptionByChannelDescription,
      getDatabaseKeyForChannelDescription,
      channelDescriptionFormatValidator: swarmMessagesChannelDescriptionFormatValidator,
    };
  }

  protected _getSwarmMessagesKeyValueDatabaseConnection(): PromiseResolveType<
    ReturnType<CARGS['utilities']['databaseConnectionFabric']>
  > {
    const swarmMessagesKeyValueDatabaseConnection = this._swarmMessagesKeyValueDatabaseConnection;
    if (!swarmMessagesKeyValueDatabaseConnection) {
      throw new Error('There is no an active connection with the swarm messages databse');
    }
    return swarmMessagesKeyValueDatabaseConnection;
  }

  protected async _readValueForDbKey(dbbKey: string): Promise<ISwarmMessageChannelDescriptionRaw<P, T, any, any> | undefined> {
    const dbConnection = this._getSwarmMessagesKeyValueDatabaseConnection();
    const messageForTheKey = await dbConnection.collectWithMeta({
      [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.eq]: dbbKey,
      [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.limit]: 1,
    });
    // TODO
    return messageForTheKey;
  }

  protected async _getExistingChannelDescriptionByMessageKey(
    dbbKey: string
  ): Promise<IValidatorOfSwarmMessageWithChannelDescriptionArgument<P, T, I, CTX, DBO>['channelExistingDescription']> {
    return await this._readValueForDbKey(dbbKey);
  }

  protected _getVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidator({
    payload,
    userId,
    key,
    operation,
  }: {
    payload: T | I;
    userId: TSwarmMessageUserIdentifierSerialized;
    // key of the value
    key?: string;
    // operation which is processed (like delete, add or something else)
    operation?: TSwarmStoreDatabaseEntryOperation<P>;
  }): Omit<Required<ISwarmMessagesChannelsListV1GrantAccessVariableArguments<P, T, I, CTX, DBO>>, 'channelExistingDescription'> {
    if (!key) {
      throw new Error('A key must be provided for swarm messages channel description');
    }
    if (!operation) {
      throw new Error('A database operation must be provided for any changing of swarm messages channel description');
    }
    return {
      keyInDb: key,
      messageOrHash: payload,
      operationInDb: operation,
      senderUserId: userId,
    };
  }

  protected _getArgumentsForSwarmMessageWithChannelDescriptionValidator(
    constantArguments: ISwarmMessagesChannelsListV1GrantAccessConstantArguments<P, T, I, CTX, DBO>,
    variableArguments: ISwarmMessagesChannelsListV1GrantAccessVariableArguments<P, T, I, CTX, DBO>,
    channelExistingDescription: IValidatorOfSwarmMessageWithChannelDescriptionArgument<
      P,
      T,
      I,
      CTX,
      DBO
    >['channelExistingDescription']
  ): IValidatorOfSwarmMessageWithChannelDescriptionArgument<P, T, I, CTX, DBO> {
    return {
      ...constantArguments,
      ...variableArguments,
      channelExistingDescription,
    };
  }

  protected _createGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidator(
    constantArguments: ISwarmMessagesChannelsListV1GrantAccessConstantArguments<P, T, I, CTX, DBO>,
    channelDescriptionSwarmMessageValidator: CARGS['validators']['channelDescriptionSwarmMessageValidator']
  ): DBO['grantAccess'] {
    return function channelsListGrantAccessCallbackFunction(
      this: CTX,
      payload: T | I,
      userId: TSwarmMessageUserIdentifierSerialized,
      // key of the value
      key?: string,
      // operation which is processed (like delete, add or something else)
      operation?: TSwarmStoreDatabaseEntryOperation<P>
    ): Promise<boolean> {
      const variableArguments = this._getVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidator({
        payload,
        userId,
        key,
        operation,
      });
      const swarmMessagesChannelExistingDescription = await this._getExistingChannelDescriptionByMessageKey(key);
      const argumentsForChannelDescriptionSwarmMessageValidator = this._getArgumentsForSwarmMessageWithChannelDescriptionValidator(
        constantArguments,
        variableArguments,
        swarmMessagesChannelExistingDescription
      );
      return await channelDescriptionSwarmMessageValidator.call(this, argumentsForChannelDescriptionSwarmMessageValidator);
    } as DBO['grantAccess'];
  }

  protected _getGrantAccessCallbackForChannelsListDatabase(): DBO['grantAccess'] {
    const { channelDescriptionSwarmMessageValidator } = this._getValidators();
    const argumentsConstant = this._getConstantArgumentsForGrantAccessCallbackValidator();
    return this._createGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidator(
      argumentsConstant,
      channelDescriptionSwarmMessageValidator
    );
  }

  /**
   * Should create options for connection to the database
   *
   * @protected
   * @returns {TSwarmStoreDatabaseOptions<P, T, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE>}
   * @memberof SwarmMessagesChannelsListVersionOne
   */
  protected _getChannelsListDatabaseOptions(): TSwarmStoreDatabaseOptions<
    P,
    T,
    ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
  > {
    const databaseName = this._getChannelsListDatabaseName();
    const { dbOptions, connectorType } = this._getConnectionOptions();
    return {
      ...dbOptions,
      dbType: connectorType,
      dbName: databaseName,
    };
  }

  protected _createConnectionToDatabase(): void {
    const;
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

  protected _getKeyInDatabaseForStoringChannelsListDescription(channelId: TSwarmMessagesChannelId): string {
    return channelId;
  }

  protected async _setChannelDescriptionSerializedInSwarm(
    channelId: TSwarmMessagesChannelId,
    channelDescriptionSerialized: string
  ): Promise<void> {
    const keyValueDatabase = await this._getSwarmMessagesKeyValueDatabase();
    const swarmMessageWithChannelDescription = this._createChannelDescriptionMessageBody(channelDescriptionSerialized);
    const keyInDatabaseForChannelDescription = this._getKeyInDatabaseForStoringChannelsListDescription(channelId);
    await keyValueDatabase.addMessage(swarmMessageWithChannelDescription, keyInDatabaseForChannelDescription);
  }
}
