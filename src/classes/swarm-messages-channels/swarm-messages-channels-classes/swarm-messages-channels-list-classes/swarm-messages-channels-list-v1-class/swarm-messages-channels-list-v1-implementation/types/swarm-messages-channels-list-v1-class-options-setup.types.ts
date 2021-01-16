import { ESwarmStoreConnector } from '../../../../../../swarm-store-class/swarm-store-class.const';
import {
  TSwarmMessageSerialized,
  ISwarmMessageInstanceDecrypted,
} from '../../../../../../swarm-message/swarm-message-constructor.types';
import { TSwrmMessagesChannelsListDBOWithGrantAccess } from '../../../../../types/swarm-messages-channels-list.types';
import { ISwarmMessagesChannelsDescriptionsListConstructorArguments } from '../../../../../types/swarm-messages-channels-list.types';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';

export abstract class AbstactSwarmMessagesChannelsListVersionOneOptionsSetUp<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  I extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, I, CTX>,
  CARGS extends ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, I, CTX, DBO>
> {
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
