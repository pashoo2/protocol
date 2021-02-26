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
import {
  ISwarmMessagesChannelsListNotificationEmitter,
  ISwarmMessagesChannelsListEvents,
} from '../../../../types/swarm-messages-channels-list-events.types';
import {
  getEventEmitterInstance,
  EventEmitter,
} from '../../../../../basic-classes/event-emitter-class-base/event-emitter-class-base';
import { ESwarmMessagesChannelsListEventName } from '../../../../types/swarm-messages-channels-list-events.types';
import {
  forwardEvents,
  stopForwardEvents,
} from '../../../../../basic-classes/event-emitter-class-base/event-emitter-class-with-forwarding.utils';

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
    public get description(): Readonly<ISwarmMessagesChannelsListDescription> {
      return this._getChannelsListDescription();
    }

    public get emitter(): ISwarmMessagesChannelsListNotificationEmitter<P, any> {
      return this.__emitterChannelsList;
    }

    private __emitterChannelsList = getEventEmitterInstance<ISwarmMessagesChannelsListEvents<P, any>>();

    constructor(args: CARGS) {
      super(args);
      this._startEventsForwarding();
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

    public async close(): Promise<void> {
      this._stopEventsForwarding();
      await this._closeDatabase();
      this._emitChannelsListEvent(ESwarmMessagesChannelsListEventName.CHANNELS_LIST_DATABASE_CLOSED);
      // reset options only after the event emitted to allow read it for event handlers
      this.__resetOptionsSetup();
    }

    public async drop(): Promise<void> {
      this._stopEventsForwarding();
      await this._dropDatabase();
      this._emitChannelsListEvent(ESwarmMessagesChannelsListEventName.CHANNELS_LIST_DATABASE_CLOSED);
      // reset options only after the event emitted to allow read it for event handlers
      this.__resetOptionsSetup();
    }

    protected _emitChannelsListEvent<E extends ESwarmMessagesChannelsListEventName>(
      eventName: E,
      ...args: Parameters<ISwarmMessagesChannelsListEvents<P, any>[E]>
    ): void {
      // TODO - resolve cast to any
      (this.__emitterChannelsList as EventEmitter<ISwarmMessagesChannelsListEvents<P, any>>).emit(eventName, ...args);
    }

    protected _startEventsForwarding() {
      forwardEvents(this._emitterDatabaseHandler, this.__emitterChannelsList);
    }

    protected _stopEventsForwarding() {
      stopForwardEvents(this._emitterDatabaseHandler, this.__emitterChannelsList);
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
