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
import {
  ISwarmMessagesChannelsDescriptionsList,
  ISwarmMessagesChannelsListDescription,
} from '../../../../types/swarm-messages-channels-list.types';
import { ConstructorType } from '../../../../../../types/helper.types';
import {
  ISwarmMessageChannelDescriptionRaw,
  TSwarmMessagesChannelId,
  ISwarmMessagesChannelDescriptionWithMetadata,
} from '../../../../types/swarm-messages-channel.types';
import { TSwarmMessageConstructorBodyMessage } from '../../../../../swarm-message/swarm-message-constructor.types';
import { TSwarmStoreDatabaseEntityKey } from '../../../../../swarm-store-class/swarm-store-class.types';

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
): ConstructorType<ISwarmMessagesChannelsDescriptionsList<P, T, I>> {
  abstract class SwarmMessagesChannelsListVersionOne
    extends ClassSwarmMessagesChannelsListVersionOneOptionsSetUp
    implements ISwarmMessagesChannelsDescriptionsList<P, T, I> {
    public get description(): Readonly<ISwarmMessagesChannelsListDescription> {
      return this._getChannelsListDescription();
    }

    public async addChannel(channelDescriptionRaw: ISwarmMessageChannelDescriptionRaw<P, T, any, any>): Promise<void> {
      await this._validateChannelDescription(channelDescriptionRaw);
      await this._addChannelDescriptionRawInSwarmDatabase(channelDescriptionRaw);
    }

    public async removeChannelById(channelId: TSwarmMessagesChannelId): Promise<void> {
      await this._removeValueForDbKey(channelId as TSwarmStoreDatabaseEntityKey<P>);
    }

    public async getAllChannelsDescriptions(): Promise<ISwarmMessagesChannelDescriptionWithMetadata<P, T, I, any, any>[]> {
      return await this._readAllChannelsDescriptionsWithMeta();
    }

    public async getChannelDescriptionById(
      channelId: TSwarmMessagesChannelId
    ): Promise<ISwarmMessageChannelDescriptionRaw<P, T, any, any> | undefined> {
      return await this._readSwarmMessagesChannelDescriptionOrUndefinedForDbKey(channelId as TSwarmStoreDatabaseEntityKey<P>);
    }

    protected _createMessageBodyForChannelDescription(
      channelDescriptionRaw: ISwarmMessageChannelDescriptionRaw<P, T, any, any>
    ): TSwarmMessageConstructorBodyMessage {
      const messageTyp = this._createChannelDescriptionMessageTyp(channelDescriptionRaw);
      const messageIss = this._createChannelDescriptionMessageIssuer(channelDescriptionRaw);
      const messagePayload = this._serializeChannelDescriptionRaw(channelDescriptionRaw);

      return {
        typ: messageTyp,
        iss: messageIss,
        pld: messagePayload,
      };
    }

    protected async _addChannelDescriptionRawInSwarmDatabase(
      channelDescriptionRaw: ISwarmMessageChannelDescriptionRaw<P, T, any, any>
    ): Promise<void> {
      const swarmMessageWithChannelDescription = this._createMessageBodyForChannelDescription(channelDescriptionRaw);
      const keyInDatabaseForChannelDescription = this._getKeyInDatabaseForStoringChannelsListDescription(channelDescriptionRaw);
      await this._addSwarmMessageBodyInDatabase(keyInDatabaseForChannelDescription, swarmMessageWithChannelDescription);
    }

    protected async _getExistingChannelDescription(
      channelId: TSwarmMessagesChannelId
    ): Promise<ISwarmMessageChannelDescriptionRaw<P, T, any, any> | undefined> {
      return await this._readSwarmMessagesChannelDescriptionOrUndefinedForDbKey(channelId as TSwarmStoreDatabaseEntityKey<P>);
    }
  }

  // TODO - typescript issue https://github.com/microsoft/TypeScript/issues/22815
  // Abstract classes that implement interfaces shouldn't require method signatures
  return (SwarmMessagesChannelsListVersionOne as unknown) as ConstructorType<ISwarmMessagesChannelsDescriptionsList<P, T, I>>;
}
