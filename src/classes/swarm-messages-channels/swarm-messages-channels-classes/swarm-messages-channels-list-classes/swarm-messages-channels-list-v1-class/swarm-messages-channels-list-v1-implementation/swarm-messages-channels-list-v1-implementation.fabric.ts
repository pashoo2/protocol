import { ESwarmStoreConnector } from '../../../../../swarm-store-class/swarm-store-class.const';
import {
  TSwarmMessageSerialized,
  ISwarmMessageInstanceDecrypted,
} from '../../../../../swarm-message/swarm-message-constructor.types';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import {
  TSwrmMessagesChannelsListDBOWithGrantAccess,
  ISwarmMessagesChannelsDescriptionsListConstructorArguments,
} from '../../../../types/swarm-messages-channels-list.types';
import { IConstructorAbstractSwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandler } from './types/swarm-messages-channels-list-v1-class-db-connection-initializer-and-handler.types';
import { ISwarmMessagesChannelsDescriptionsList } from '../../../../types/swarm-messages-channels-list.types';
import { ConstructorType } from '../../../../../../types/helper.types';
import { ISwarmMessageChannelDescriptionRaw } from '../../../../types/swarm-messages-channel.types';
export function getSwarmMessagesChannelsListVersionOneClass<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  I extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, I, CTX>,
  CARGS extends ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, I, CTX, DBO>
>(
  ClassSwarmMessagesChannelsListVersionOneOptionsSetUp: IConstructorAbstractSwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandler<
    P,
    T,
    I,
    CTX,
    DBO,
    CARGS
  >
): ConstructorType<ISwarmMessagesChannelsDescriptionsList<P, T>> {
  abstract class SwarmMessagesChannelsListVersionOne
    extends ClassSwarmMessagesChannelsListVersionOneOptionsSetUp
    implements ISwarmMessagesChannelsDescriptionsList<P, T> {
    public async addChannel(channelDescriptionRaw: ISwarmMessageChannelDescriptionRaw<P, T, any, any>): Promise<void> {
      if (!this._validateChannelDescription(channelDescriptionRaw)) {
        throw new Error('The channel description is not ready');
      }

      const serializedChannelDescription = this._serializeChannelDescriptionRaw(channelDescriptionRaw);
      await this._setChannelDescriptionSerializedInSwarm(channelDescriptionRaw.id, serializedChannelDescription);
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
    protected _createChannelDescriptionMessageBodyRequiredPropsWithoutPayload(): Omit<
      TSwarmMessageConstructorBodyMessage,
      'pld'
    > {
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

  // TODO - typescript issue https://github.com/microsoft/TypeScript/issues/22815
  // Abstract classes that implement interfaces shouldn't require method signatures
  return (SwarmMessagesChannelsListVersionOne as unknown) as ConstructorType<ISwarmMessagesChannelsDescriptionsList<P, T>>;
}
