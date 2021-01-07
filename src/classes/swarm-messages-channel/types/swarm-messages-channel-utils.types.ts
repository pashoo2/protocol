import {TSwarmMessageConstructorBodyMessage} from '../../swarm-message/swarm-message-constructor.types';
import {
    ESwarmStoreConnector,
    ESwarmStoreConnectorOrbitDbDatabaseType,
    TSwarmStoreDatabaseOptions,
} from '../../swarm-store-class';
import {TSwarmMessageSerialized,} from '../../swarm-message';
import {
    ISwarmMessageChannelDescriptionRaw,
    ISwarmMessagesChannelsDescriptionsListDescription,
} from './swarm-messages-channel.types';

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
export interface IGetSwarmMessageWithChannelDescriptionTypeByChannelListDescription<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DBO extends TSwarmStoreDatabaseOptions<P, T, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE>
> {
  (channelsListDescription: Readonly<ISwarmMessagesChannelsDescriptionsListDescription<P, T, DBO>>): Pick<
    TSwarmMessageConstructorBodyMessage,
    'typ'
  >['typ'];
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
export interface IGetSwarmMessageWithChannelDescriptionIssuerByChannelListDescription<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DBO extends TSwarmStoreDatabaseOptions<P, T, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE>
> {
  (channelsListDescription: Readonly<ISwarmMessagesChannelsDescriptionsListDescription<P, T, DBO>>): Pick<
    TSwarmMessageConstructorBodyMessage,
    'iss'
  >['iss'];
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
  (channelDescription: Readonly<ISwarmMessageChannelDescriptionRaw<P, T, any, any>>): Pick<
    TSwarmMessageConstructorBodyMessage,
    'iss'
  >['iss'];
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
  T extends TSwarmMessageSerialized,
  DBO extends TSwarmStoreDatabaseOptions<P, T, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE>
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
   * @type {Readonly<ISwarmMessagesChannelsDescriptionsListDescription<P, T, DBO>>}
   * @memberof IValidatorOfSwarmMessageWithChannelDescriptionArgument
   */
  channelsListDescription: Readonly<ISwarmMessagesChannelsDescriptionsListDescription<P, T, DBO>>;
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
  getIssuerForSwarmMessageWithChannelDescriptionByChannelsListDescription: IGetSwarmMessageWithChannelDescriptionIssuerByChannelListDescription<
    P,
    T,
    DBO
  >;
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
  getTypeForSwarmMessageWithChannelDescriptionByChannelsListDescription: IGetSwarmMessageWithChannelDescriptionTypeByChannelListDescription<
    P,
    T,
    DBO
  >;
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
  T extends TSwarmMessageSerialized,
  DBO extends TSwarmStoreDatabaseOptions<P, T, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE>
> {
  (argument: IBodyCreatorOfSwarmMessageWithChannelDescriptionArgument<P, T, DBO>): TSwarmMessageConstructorBodyMessage;
}
