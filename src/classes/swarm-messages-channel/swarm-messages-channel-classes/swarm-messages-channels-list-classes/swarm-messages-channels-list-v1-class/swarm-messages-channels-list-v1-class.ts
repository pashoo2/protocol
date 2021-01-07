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
import { ESwarmStoreConnectorOrbitDbDatabaseType, EOrbitDbFeedStoreOperation } from '../../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import {
  ISwarmMessagesChannelsDescriptionsListConstructorArguments,
  ISwarmMessageChannelDescriptionRaw,
} from '../../../swarm-messages-channel.types';
import { createImmutableObjectClone } from '../../../../../utils/data-immutability-utils/data-immutability-key-value-structure-utils';
import { PromiseResolveType } from '../../../../../types/promise.types';
import { ISwarmMessagesChannelsDescriptionsList, TSwarmMessagesChannelId, IValidatorOfSwarmMessageWithChannelDescription } from '../../../swarm-messages-channel.types';
import { TSwarmStoreConnectorAccessConrotllerGrantAccessCallback, TSwarmStoreDatabaseEntryOperation } from '../../../../swarm-store-class/swarm-store-class.types';
import { TSwarmMessageUserIdentifierSerialized } from '../../../../swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';
import assert from 'assert';
import { isValidSwarmMessageDecryptedFormat } from '../../../../swarm-message-store/swarm-message-store-utils/swarm-message-store-validators/swarm-message-store-validator-swarm-message';

export class SwarmMessagesChannelsListVersionOne<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DBO extends TSwarmStoreDatabaseOptions<P, T, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE> & { grantAccess: TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, T, ISwarmMessageInstanceDecrypted> },
  DBOS extends TSwarmStoreDatabaseOptionsSerialized,
  CARGS extends ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, DBO, DBOS>
> implements ISwarmMessagesChannelsDescriptionsList<P, T, DBO> {
  public get description(): CARGS['description'] {
    return this._channelsListDescription;
  }

  protected readonly _channelDescriptionSwarmMessageValidator: IValidatorOfSwarmMessageWithChannelDescription<P, T, DBO>;

  protected readonly _channelsListDescription: CARGS['description'];

  protected readonly _serializer: CARGS['serializer'];

  protected readonly _swarmMessagesChannelDescriptionFormatValidator: CARGS['swarmMessagesChannelDescriptionFormatValidator'];

  protected readonly _swarmMessagesDatabasePending: ReturnType<CARGS['databaseConnectionFabric']>;

  constructor(constructorArguments: CARGS) {
    const {
      databaseConnectionFabric,
      serializer,
      description,
      swarmMessagesChannelDescriptionFormatValidator,
    } = constructorArguments;

    this._serializer = serializer;
    this._swarmMessagesChannelDescriptionFormatValidator = swarmMessagesChannelDescriptionFormatValidator;
    this._channelsListDescription = createImmutableObjectClone(description);
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

  protected _createGrandAccessCallbackForChannelsListDatabase(
    grandAccessCallbackFromDbOptions: DBO['grantAccess']
  ): TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, T, ISwarmMessageInstanceDecrypted> {
    // TODO - pass this function into the options
    
  }

  protected _extendChannelsListSwarmDatabaseOptionsWithGrandAccessCallback(
    dbOptions: DBO
  ): DBO & {
    grantAccess: TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, T, ISwarmMessageInstanceDecrypted>.
  } {

  }

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
    return this._channelsListDescription.version;
  }

  /**
   * Return an issuer of a message, which represents a swarm messages channel description
   *
   * @protected
   * @returns {Pick<TSwarmMessageConstructorBodyMessage, 'iss'>['iss']}
   * @memberof SwarmMessagesChannelsListVersionOne
   */
  protected _createChannelDescriptionMessageIssuer(): Pick<TSwarmMessageConstructorBodyMessage, 'iss'>['iss'] {
    return this._channelsListDescription.id;
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
