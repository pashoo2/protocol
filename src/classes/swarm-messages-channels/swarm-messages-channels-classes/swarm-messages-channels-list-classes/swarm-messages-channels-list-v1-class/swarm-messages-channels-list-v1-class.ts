import { ESwarmStoreConnector } from '../../../../swarm-store-class/swarm-store-class.const';
import {
  TSwarmMessageSerialized,
  TSwarmMessageConstructorBodyMessage,
  ISwarmMessageInstanceDecrypted,
} from '../../../../swarm-message/swarm-message-constructor.types';
import { ISwarmMessageChannelDescriptionRaw } from '../../../types/swarm-messages-channel.types';
import { PromiseResolveType } from '../../../../../types/promise.types';
import { TSwarmMessagesChannelId } from '../../../types/swarm-messages-channel.types';
import {
  TSwarmStoreConnectorAccessConrotllerGrantAccessCallback,
  TSwarmStoreDatabaseOptions,
} from '../../../../swarm-store-class/swarm-store-class.types';
import { TSwrmMessagesChannelsListDBOWithGrantAccess } from '../../../types/swarm-messages-channels-list.types';
import { SwarmMessagesChannelsListVersionOneInitializer } from './swarm-messages-channels-list-v1-class-initializer';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { DeepReadonly } from 'ts-essentials';
import {
  ISwarmMessagesChannelsDescriptionsList,
  ISwarmMessagesChannelsDescriptionsListConstructorArguments,
} from '../../../types/swarm-messages-channels-list.types';

export class SwarmMessagesChannelsListVersionOne<
    P extends ESwarmStoreConnector,
    T extends TSwarmMessageSerialized,
    DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T>,
    CARGS extends ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, DBO>
  >
  extends SwarmMessagesChannelsListVersionOneInitializer<P, T, DBO, CARGS>
  implements ISwarmMessagesChannelsDescriptionsList<P, T> {
  public get description(): DeepReadonly<CARGS['description']> {
    return this._getChannelsListDescription();
  }

  constructor(constructorArguments: CARGS) {
    super(constructorArguments);
    // TODO - create database options and connect to it
    this._swarmMessagesDatabasePending = databaseConnectionFabric(description.dbOptions);
  }

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

  protected _getGrantAccessCallbackForChannelsListDatabase() {
    const { dbOptions } = this._getConnectionOptions();
    const { grantAccess } = dbOptions;
    return () => {};
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
