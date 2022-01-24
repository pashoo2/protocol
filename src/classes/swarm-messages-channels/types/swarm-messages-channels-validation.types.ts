import { TSwarmMessageUserIdentifierSerialized } from '../../central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity-validators/central-authority-common-validator-user-identifier/central-authority-common-validator-user-identifier.types';
import {
  ESwarmStoreConnector,
  TSwarmStoreDatabaseEntryOperation,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseType,
} from '../../swarm-store-class';
import { ISwarmMessageInstanceDecrypted, TSwarmMessageSerialized } from '../../swarm-message';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../swarm-store-class/swarm-store-connectors/swarm-store-connectors.types';
import { ISwarmMessageChannelDescriptionRaw } from './swarm-messages-channel-instance.types';
import { JSONSchema7 } from 'json-schema';
import { TSwarmStoreDatabaseEntityKey } from '../../swarm-store-class/swarm-store-class.types';
import {
  IGetDatabaseKeyForChannelDescription,
  IGetSwarmMessageWithChannelDescriptionIssuerByChannelListDescription,
  IGetSwarmMessageWithChannelDescriptionTypeByChannelListDescription,
} from './swarm-messages-channels-utils.types';
import {
  ISwarmMessagesChannelsListDescription,
  TSwarmMessagesChannelsListDBOWithGrantAccess,
} from './swarm-messages-channels-list-instance.types';

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
    channelDescription: ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>,
    jsonSchemaValidator: (jsonSchema: JSONSchema7, valueToValidate: any) => Promise<void>
  ): Promise<void>;
}

/**
 *Parse the swarm message channel serialized
 *
 * @export
 * @interface ISwarmMessagesChannelDescriptionParser
 * @template P
 * @template T
 * @template DbType
 * @template DBO
 */
export interface ISwarmMessagesChannelDescriptionParser<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>
> {
  (channelDescriptionSerialized: string):
    | Promise<ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>>
    | ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>;
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
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwarmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>
> {
  (
    /** context will be passed from the database, but should contatain specific for swarm channel validators methods */
    this: CTX,
    /** argument will be passed from the swarm messages channels list instance */
    argument: IValidatorOfSwarmMessageWithChannelDescriptionArgument<P, T, MD, CTX, DBO>
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
  (swarmMessagesChannelsListDescription: ISwarmMessagesChannelsListDescription): void;
}

/**
 * Validate database options which is used for connection
 * to the swarm database related to this swarm channels list.
 *
 * @export
 * @interface ISwamChannelsListDatabaseOptionsValidator
 */
export interface ISwamChannelsListDatabaseOptionsValidator {
  (dbOptions: unknown): dbOptions is TSwarmMessagesChannelsListDBOWithGrantAccess<any, any, any, any>;
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
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwarmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>
> {
  /**
   * if the databse is not ready it can not return an existing channel description
   * therefore there should no be any validations related to the existing channel
   * description. And it means that it's not neccessary to validate users
   * because all the message have been exists and all of them are not new
   *
   * @type {boolean}
   * @memberof IValidatorOfSwarmMessageWithChannelDescriptionArgument
   */
  isDatabaseReady: boolean;
  /**
   * If operation is DELETE, then it should be a hash of the message deleted.
   * Otherwise it should be swarm message deserialized and decrypted.
   *
   * @type {(T | MD)}
   * @memberof IGrantAccessCallbackSwrmMessagesChannelsListArguments
   */
  messageOrHash: T | MD;
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
  keyInDb: TSwarmStoreDatabaseEntityKey<P> | undefined;
  /**
   * Which operation performs by the message - remove the key from the database
   * or update/add a new message with a channel description.
   *
   * @type {TSwarmStoreDatabaseEntryOperation<P>}
   * @memberof IGrantAccessCallbackSwrmMessagesChannelsListArguments
   */
  operationInDb: TSwarmStoreDatabaseEntryOperation<P>;
  /**
   * Time when was the entry added.
   *
   * @type {number}
   * @memberof IValidatorOfSwarmMessageWithChannelDescriptionArgument
   */
  timeEntryAdded: number;
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
  channelDescriptionFormatValidator: ISwarmMessagesChannelDescriptionFormatValidator<
    P,
    T,
    any,
    TSwarmStoreDatabaseOptions<P, T, any>
  >;
  /**
   * Used for parsing the channel description to validate it's format
   *
   * @type {ISwarmMessagesChannelDescriptionParser<P, T, any, TSwarmStoreDatabaseOptions<P, T, any>>}
   * @memberof IValidatorOfSwarmMessageWithChannelDescriptionArgument
   */
  parseChannelDescription: ISwarmMessagesChannelDescriptionParser<P, T, any, any>;
}
