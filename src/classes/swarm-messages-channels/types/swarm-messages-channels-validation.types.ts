import { JSONSchema7 } from 'json-schema';
import { TSwarmMessageUserIdentifierSerialized } from '../../swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';
import {
  ESwarmStoreConnector,
  TSwarmStoreDatabaseEntryOperation,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseType,
} from '../../swarm-store-class';
import { ISwarmMessageInstanceDecrypted, TSwarmMessageSerialized } from '../../swarm-message';
import { ISwarmStoreDBOGrandAccessCallbackBaseContextMethods } from '../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { ISwarmMessageChannelDescriptionRaw } from './swarm-messages-channel.types';
import {
  IGetDatabaseKeyForChannelDescription,
  IGetSwarmMessageWithChannelDescriptionIssuerByChannelListDescription,
  IGetSwarmMessageWithChannelDescriptionTypeByChannelListDescription,
} from './swarm-messages-channels-utils.types';
import {
  ISwarmMessagesChannelsDescriptionsListConnectionOptions,
  ISwarmMessagesChannelsListDescription,
  TSwrmMessagesChannelsListDBOWithGrantAccess,
} from './swarm-messages-channels-list.types';

/**
 * Context for various validation functions
 *
 * @export
 * @interface ISwarmMessagesChannelValidationContext
 */
export interface ISwarmMessagesChannelValidationContext
  extends Pick<ISwarmStoreDBOGrandAccessCallbackBaseContextMethods, 'isUserValid'> {}

/**
 * Validate the swarm messages channel description format
 *
 * @export
 * @interface ISwarmMessagesChannelDescriptionFormatValidator
 * @template P
 * @template T
 * @template DbType
 * @template DBO
 * @throws
 */
export interface ISwarmMessagesChannelDescriptionFormatValidator<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>
> {
  (
    this: ISwarmMessagesChannelValidationContext,
    channelDescription: ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>
  ): Promise<void>;
}

/**
 * Arguments which will be passed for the grant access callback
 * during swarm message with a swarm messages channel's description validation
 *
 * @export
 * @interface IValidatorOfSwarmMessageWithChannelDescriptionArgument
 * @template P
 * @template T
 * @template DbType
 * @template DBO
 */
export interface IValidatorOfSwarmMessageWithChannelDescriptionArgument<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T>
> {
  /**
   * If operation is DELETE, then it should be a hash of the message deleted.
   * Otherwise it should be swarm message deserialized and decrypted.
   *
   * @type {(T | ISwarmMessageInstanceDecrypted)}
   * @memberof IGrantAccessCallbackSwrmMessagesChannelsListArguments
   */
  messageOrHash: T | ISwarmMessageInstanceDecrypted;
  /**
   * Who is a sender of the message
   *
   * @type {TSwarmMessageUserIdentifierSerialized}
   * @memberof IGrantAccessCallbackSwrmMessagesChannelsListArguments
   */
  senderUserId: TSwarmMessageUserIdentifierSerialized;
  /**
   * Message's key in the swarm channels list database.
   *
   * @type {(string | undefined)}
   * @memberof IGrantAccessCallbackSwrmMessagesChannelsListArguments
   */
  keyInDb: string | undefined;
  /**
   * Which operation performs by the message - remove the key from the database
   * or update/add a new message with a channel description.
   *
   * @type {TSwarmStoreDatabaseEntryOperation<P>}
   * @memberof IGrantAccessCallbackSwrmMessagesChannelsListArguments
   */
  operationInDb: TSwarmStoreDatabaseEntryOperation<P>;
  /**
   * A description of the channel which is already exists in the
   * channels list swarm database cache (!!! only in the cache).
   *
   * @type {(ISwarmMessageChannelDescriptionRaw<P, T, any, any> | undefined)}
   * @memberof IGrantAccessCallbackSwrmMessagesChannelsListArguments
   */
  channelExistingDescription: Readonly<ISwarmMessageChannelDescriptionRaw<P, T, any, any>> | undefined;
  /**
   * Description of the channels list instance which uses this
   *
   * @type {ISwarmMessagesChannelsListDescription}
   * @memberof IValidatorOfSwarmMessageWithChannelDescriptionArgument
   */
  channelsListDescription: ISwarmMessagesChannelsListDescription;
  /**
   * Grant access callback which provided in the options
   * for the channel's list database
   *
   * @type {DBO['grantAccess']}
   * @memberof IGrantAccessCallbackSwrmMessagesChannelsListArguments
   */
  grandAccessCallbackFromDbOptions: NonNullable<DBO['grantAccess']>;
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
  /**
   * It will be used to validate the database key of the swarm message with a channel description.
   *
   * @type {IGetDatabaseKeyForChannelDescription<P, T>}
   * @memberof IValidatorOfSwarmMessageWithChannelDescriptionArgument
   */

  getDatabaseKeyForChannelDescription: IGetDatabaseKeyForChannelDescription<P, T>;
  /**
   * Validator for a swarm messages channel format.
   *
   * @type {ISwarmMessagesChannelDescriptionFormatValidator<P, T, any, DBO>}
   * @memberof IValidatorOfSwarmMessageWithChannelDescriptionArgument
   */
  channelDescriptionFormatValidator: ISwarmMessagesChannelDescriptionFormatValidator<P, T, any, DBO>;
}

/**
 * Callback will be called for validation of a swarm message
 * with a swarm messages channel's description validation
 *
 * @export
 * @interface IValidatorOfSwarmMessageWithChannelDescription
 * @template P
 * @template T
 * @template DbType
 * @template DBO
 * @throws
 */
export interface IValidatorOfSwarmMessageWithChannelDescription<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T>
> {
  (
    /** context will be passed from the database, but should contatain specific for swarm channel validators methods */
    this: ISwarmMessagesChannelValidationContext,
    /** argument will be passed from the swarm messages channels list instance */
    agument: IValidatorOfSwarmMessageWithChannelDescriptionArgument<P, T, DBO>
  ): Promise<void>;
}

/**
 * Validate swarm messages channels list description
 *
 * @export
 * @interface IValidatorOfSwarmMessagesChannelsListDescription
 * @throws
 */
export interface IValidatorOfSwarmMessagesChannelsListDescription {
  (swarmMessagesListDescription: ISwarmMessagesChannelsListDescription): void;
}
