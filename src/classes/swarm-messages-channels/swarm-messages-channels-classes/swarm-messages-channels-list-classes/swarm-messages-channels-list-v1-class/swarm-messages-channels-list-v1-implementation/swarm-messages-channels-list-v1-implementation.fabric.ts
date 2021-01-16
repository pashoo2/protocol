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
import { ISwarmMessageChannelDescriptionRaw, TSwarmMessagesChannelId } from '../../../../types/swarm-messages-channel.types';
import { TSwarmMessageConstructorBodyMessage } from '../../../../../swarm-message/swarm-message-constructor.types';

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
      await this._validateChannelDescription(channelDescriptionRaw);

      await this._setChannelDescriptionSerializedInSwarm(channelDescriptionRaw.id, serializedChannelDescription);
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

    protected _createSwarmMessageRawForChannelDescriptionSerialized(
      channelDescriptionRaw: ISwarmMessageChannelDescriptionRaw<P, T, any, any>
    ) {
      const messageTyp = this._createChannelDescriptionMessageTyp(channelDescriptionRaw);
      const messageIss = this._createChannelDescriptionMessageIssuer(channelDescriptionRaw);
      const messagePayload = this._serializeChannelDescriptionRaw(channelDescriptionRaw);

      return {
        typ: messageTyp,
        iss: messageIss,
        payload: messagePayload,
      };
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
