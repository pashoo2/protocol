import {
  ISwarmMessageInstanceDecrypted,
  TSwarmMessageConstructorBodyMessage,
  TSwarmMessageSerialized,
} from '../../swarm-message/swarm-message-constructor.types';
import { ESwarmStoreConnector, TSwarmStoreDatabaseOptions, TSwarmStoreDatabaseType } from '../../swarm-store-class';
import { ISwarmMessageChannelDescriptionRaw } from './swarm-messages-channel-instance.types';
import { ISwarmMessagesChannelsListDescription } from './swarm-messages-channels-list-instance.types';
import { TSwarmStoreDatabaseEntityKey } from '../../swarm-store-class/swarm-store-class.types';
import { TSwarmMessagesChannelId } from 'classes';

/**
 * Interface for utility which have to return type ("typ" property)
 * for messages with a channel description.
 *
 * @export
 * @interface IGetSwarmMessageWithChannelDescriptionTypeByChannelListDescription
 * @template P
 * @template T
 * @template DBO
 */
export interface IGetSwarmMessageWithChannelDescriptionTypeByChannelListDescription {
  (channelsListDescription: ISwarmMessagesChannelsListDescription): Pick<TSwarmMessageConstructorBodyMessage, 'typ'>['typ'];
}

/**
 * Interface for utility which have to return issuer ("iss" property)
 * for messages with a channel description.
 *
 * @export
 * @interface IGetSwarmMessageWithChannelDescriptionIssuerByChannelDescription
 * @template P
 * @template T
 * @template DBO
 */
export interface IGetSwarmMessageWithChannelDescriptionIssuerByChannelListDescription {
  (channelsListDescription: ISwarmMessagesChannelsListDescription): Pick<TSwarmMessageConstructorBodyMessage, 'iss'>['iss'];
}

/**
 * Interface for utility which have to return key in a swarm database
 * for a swarm messages channel description.
 *
 * @export
 * @interface IGetSwarmMessageWithChannelDescriptionIssuerByChannelDescription
 * @template P
 * @template T
 * @template DBO
 */
export interface IGetDatabaseKeyForChannelDescription<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized> {
  (channelDescription: Readonly<ISwarmMessageChannelDescriptionRaw<P, T, any, any>>): TSwarmStoreDatabaseEntityKey<P>;
}

/**
 * Returns swarm channel identity by a database KEY for a
 * channel description stored in the database, related to a
 * swarm messages channels list, where the swarm messages channel
 * desription is stored.
 *
 * @export
 * @interface IGetChannelIdByDatabaseKey
 * @template P
 */
export interface IGetChannelIdByDatabaseKey<P extends ESwarmStoreConnector> {
  (databaseKey: TSwarmStoreDatabaseEntityKey<P>): TSwarmMessagesChannelId;
}

/**
 * Arguments will be passed for the swarm message's body
 * creator to create a body of the message with a swarm messages
 * channel description.
 *
 * @export
 * @interface IBodyCreatorOfSwarmMessageWithChannelDescriptionArgument
 * @template P
 * @template T
 * @template DbType
 * @template DBO
 */
export interface IBodyCreatorOfSwarmMessageWithChannelDescriptionArgument<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized
> {
  /**
   * A description of a channel which should be wrapped with the swarm message.
   *
   * @type {(ISwarmMessageChannelDescriptionRaw<P, T, any, any> | undefined)}
   * @memberof IGrantAccessCallbackSwrmMessagesChannelsListArguments
   */
  channelDescription: Readonly<ISwarmMessageChannelDescriptionRaw<P, T, any, any>>;
  /**
   * Description of the channels list instance which uses this
   *
   * @type {ISwarmMessagesChannelsListDescription}
   * @memberof IValidatorOfSwarmMessageWithChannelDescriptionArgument
   */
  channelsListDescription: ISwarmMessagesChannelsListDescription;
  /**
   * This utility will be used by the channelDescriptionSwarmMessageValidator validator
   * and till swarm message with a channel description construction
   * to get issuer value for the message's body.
   *
   * @type {IGetSwarmMessageWithChannelDescriptionIssuerByChannelListDescription<
   *     P,
   *     T,
   *     DBO
   *   >}
   * @memberof ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtils
   */
  getIssuerForSwarmMessageWithChannelDescriptionByChannelsListDescription: IGetSwarmMessageWithChannelDescriptionIssuerByChannelListDescription;
  /**
   * This utility will be used by the channelDescriptionSwarmMessageValidator validator
   * and till swarm message with a channel description construction
   * to get issuer value for the message's body.
   *
   * @type {IGetSwarmMessageWithChannelDescriptionIssuerByChannelListDescription<
   *     P,
   *     T,
   *     DBO
   *   >}
   * @memberof ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtils
   */
  getTypeForSwarmMessageWithChannelDescriptionByChannelsListDescription: IGetSwarmMessageWithChannelDescriptionTypeByChannelListDescription;
}

/**
 * An utility which will be used by a swarm channels list
 * for creation of a swarm messages for a swarm channel description,
 * before sending it to the swarm.
 *
 * @export
 * @interface IBodyCreatorOfSwarmMessageWithChannelDescription
 * @template P
 * @template T
 * @template DbType
 * @template DBO
 */
export interface IBodyCreatorOfSwarmMessageWithChannelDescription<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized
> {
  (argument: IBodyCreatorOfSwarmMessageWithChannelDescriptionArgument<P, T>): TSwarmMessageConstructorBodyMessage;
}

/**
 * Generates a database name for a swarm channels list
 *
 * @export
 * @interface ISwarmMessagesListDatabaseNameByDescriptionGenerator
 */
export interface ISwarmMessagesListDatabaseNameByDescriptionGenerator {
  (swarmMessagesListDescription: ISwarmMessagesChannelsListDescription): string;
}

/**
 * Fabric that creates channel description by swarm message.
 *
 * @export
 * @interface IChannelDescriptionBySwarmMessageFabric
 * @template P
 * @template T
 * @template DbType
 * @template DBO
 * @template MD
 */
export interface IChannelDescriptionBySwarmMessageFabric<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  MD extends ISwarmMessageInstanceDecrypted
> {
  (swarmMessage: MD): Promise<ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>>;
}
