import { ESwarmStoreConnector } from '../../../../../../swarm-store-class/swarm-store-class.const';
import {
  TSwarmMessageSerialized,
  ISwarmMessageInstanceDecrypted,
} from '../../../../../../swarm-message/swarm-message-constructor.types';
import { TSwrmMessagesChannelsListDBOWithGrantAccess } from '../../../../../types/swarm-messages-channels-list.types';
import { ISwarmMessagesChannelsDescriptionsListConstructorArguments } from '../../../../../types/swarm-messages-channels-list.types';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { ISwarmMessageChannelDescriptionRaw } from '../../../../../types/swarm-messages-channel.types';
import { TSwarmMessageConstructorBodyMessage } from '../../../../../../swarm-message/swarm-message-constructor.types';

export abstract class AbstactSwarmMessagesChannelsListVersionOneOptionsSetUp<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  I extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, I, CTX>,
  CARGS extends ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, I, CTX, DBO>
> {
  protected abstract readonly _connectorType: P;
  protected abstract readonly _serializer: CARGS['serializer'];

  protected abstract readonly _channelsListDescription: Readonly<CARGS['description']>;

  protected abstract readonly _connectionOptions: Readonly<CARGS['connectionOptions']>;

  protected abstract readonly _utilities: Readonly<CARGS['utilities']>;

  protected abstract readonly _validators: Readonly<CARGS['validators']>;

  protected abstract _getSerializer(): CARGS['serializer'];

  protected abstract _getChannelsListDescription(): Readonly<CARGS['description']>;

  protected abstract _getConnectionOptions(): Readonly<CARGS['connectionOptions']>;

  protected abstract _getUtilities(): Readonly<CARGS['utilities']>;

  protected abstract _getValidators(): Readonly<CARGS['validators']>;

  // TODO - move it into a separate class
  protected abstract _validateChannelDescription(
    channelDescriptionRaw: ISwarmMessageChannelDescriptionRaw<P, T, any, any>
  ): Promise<void>;

  // TODO - move it into a separate class
  protected abstract _serializeChannelDescriptionRaw(
    channelDescriptionRaw: ISwarmMessageChannelDescriptionRaw<P, T, any, any>
  ): string;

  // TODO - move it into a separate class
  protected abstract _deserializeChannelDescriptionRaw(
    channelDescriptionSerialized: string
  ): ISwarmMessageChannelDescriptionRaw<P, T, any, any>;

  // TODO - move it into a separate class
  protected abstract _createChannelDescriptionMessageTyp(
    channelDescriptionRaw: ISwarmMessageChannelDescriptionRaw<P, T, any, any>
  ): Pick<TSwarmMessageConstructorBodyMessage, 'typ'>['typ'];

  // TODO - move it into a separate class
  protected abstract _createChannelDescriptionMessageIssuer(
    channelDescriptionRaw: ISwarmMessageChannelDescriptionRaw<P, T, any, any>
  ): Pick<TSwarmMessageConstructorBodyMessage, 'iss'>['iss'];
}

export interface IConstructorAbstactSwarmMessagesChannelsListVersionOneOptionsSetUp<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  I extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, I, CTX>,
  CARGS extends ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, I, CTX, DBO>
> {
  new (args: CARGS): AbstactSwarmMessagesChannelsListVersionOneOptionsSetUp<P, T, I, CTX, DBO, CARGS>;
}
