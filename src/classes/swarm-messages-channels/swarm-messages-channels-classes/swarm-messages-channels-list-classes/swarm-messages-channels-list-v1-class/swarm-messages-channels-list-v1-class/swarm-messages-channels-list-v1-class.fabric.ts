import { ESwarmStoreConnector } from '../../../../../swarm-store-class/swarm-store-class.const';
import {
  TSwarmMessageSerialized,
  ISwarmMessageInstanceDecrypted,
} from '../../../../../swarm-message/swarm-message-constructor.types';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import {
  TSwrmMessagesChannelsListDBOWithGrantAccess,
  ISwarmMessagesChannelsDescriptionsListConstructorArguments,
} from '../../../../types/swarm-messages-channels-list-instance.types';
import { IConstructorAbstractSwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandler } from './types/swarm-messages-channels-list-v1-class-db-connection-initializer-and-handler.types';
import {
  ISwarmMessagesChannelsDescriptionsList,
  ISwarmMessagesChannelsListDescription,
} from '../../../../types/swarm-messages-channels-list-instance.types';
import { ConstructorType } from '../../../../../../types/helper.types';
import {
  ISwarmMessageChannelDescriptionRaw,
  TSwarmMessagesChannelId,
  ISwarmMessagesChannelDescriptionWithMetadata,
} from '../../../../types/swarm-messages-channel-instance.types';
import { TSwarmMessageConstructorBodyMessage } from '../../../../../swarm-message/swarm-message-constructor.types';
import { TSwarmStoreDatabaseEntityKey } from '../../../../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric } from '../../../../types/swarm-messages-channels-list-instance.types';
import { ISwarmMessagesChannelNotificationEmitter } from '../../../../types/swarm-messages-channel-events.types';

export function getSwarmMessagesChannelsListVersionOneClass<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>,
  CF extends ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric<P, T, MD, CTX, DBO>,
  CARGS extends ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, MD, CTX, DBO, CF>
>(
  ClassSwarmMessagesChannelsListVersionOneOptionsSetUp: IConstructorAbstractSwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandler<
    P,
    T,
    MD,
    CTX,
    DBO,
    CF,
    CARGS
  >
): ConstructorType<ISwarmMessagesChannelsDescriptionsList<P, T, MD>> {
  abstract class SwarmMessagesChannelsListVersionOne
    extends ClassSwarmMessagesChannelsListVersionOneOptionsSetUp
    implements ISwarmMessagesChannelsDescriptionsList<P, T, MD> {
    readonly emitter: ISwarmMessagesChannelNotificationEmitter<P, any>;

    public get description(): Readonly<ISwarmMessagesChannelsListDescription> {
      return this._getChannelsListDescription();
    }

    public async upsertChannel(channelDescriptionRaw: ISwarmMessageChannelDescriptionRaw<P, T, any, any>): Promise<void> {
      await this._validateChannelDescriptionFormat(channelDescriptionRaw);
      await this._addChannelDescriptionRawInSwarmDatabase(channelDescriptionRaw);
    }

    public async removeChannelById(channelId: TSwarmMessagesChannelId): Promise<void> {
      await this._removeValueForDbKey(channelId as TSwarmStoreDatabaseEntityKey<P>);
    }

    public async getAllChannelsDescriptions(): Promise<ISwarmMessagesChannelDescriptionWithMetadata<P, T, MD, any, any>[]> {
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
      const messageTyp = this._createChannelDescriptionMessageTyp();
      const messageIss = this._createChannelDescriptionMessageIssuer();
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
  return (SwarmMessagesChannelsListVersionOne as unknown) as ConstructorType<ISwarmMessagesChannelsDescriptionsList<P, T, MD>>;
}
