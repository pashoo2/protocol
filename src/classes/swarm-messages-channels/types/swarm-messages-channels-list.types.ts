import {
  ESwarmStoreConnector,
  ESwarmStoreConnectorOrbitDbDatabaseType,
  TSwarmStoreConnectorAccessConrotllerGrantAccessCallback,
  TSwarmStoreDatabaseOptions,
} from '../../swarm-store-class';
import { ISwarmMessageInstanceDecrypted, TSwarmMessageSerialized } from '../../swarm-message';
import { ISwarmMessageChannelDescriptionRaw, TSwarmMessagesChannelId } from './swarm-messages-channel.types';
import { ISwarmMessagesDatabaseConnector } from '../../swarm-messages-database';
import { ISerializer } from '../../../types/serialization.types';
import { ISwarmMessagesListDatabaseNameByDescriptionGenerator } from './swarm-messages-channels-utils.types';
import { IValidatorOfSwarmMessagesChannelsListDescription } from './swarm-messages-channels-validation.types';
import {
  ISwarmMessagesChannelDescriptionFormatValidator,
  IValidatorOfSwarmMessageWithChannelDescription,
} from './swarm-messages-channels-validation.types';
import {
  IBodyCreatorOfSwarmMessageWithChannelDescription,
  IGetDatabaseKeyForChannelDescription,
  IGetSwarmMessageWithChannelDescriptionIssuerByChannelListDescription,
  IGetSwarmMessageWithChannelDescriptionTypeByChannelListDescription,
} from './swarm-messages-channels-utils.types';

export type TSwrmMessagesChannelsListDBOWithGrantAccess<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized> = Omit<
  TSwarmStoreDatabaseOptions<P, T, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE>,
  'dbName' | 'dbType'
> & {
  /**
   * Grant access callback supports for validation of a swarm messages decrypted
   *
   * @type {TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, T, ISwarmMessageInstanceDecrypted>}
   */
  grantAccess: TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, T, ISwarmMessageInstanceDecrypted>;
};

/**
 * Description of a colleation of a swarm messages channels.
 *
 * @export
 * @interface ISwarmMessagesChannelsListDescription
 */
export interface ISwarmMessagesChannelsListDescription {
  /**
   * version of the description
   *
   * @type {string}
   * @memberof ISwarmMessagesChannelsListDescription
   */
  version: string;
  /**
   * Identifier
   *
   * @type {string}
   * @memberof ISwarmMessagesChannelsListDescription
   */
  id: string;
  /**
   * Name of the channels list
   */
  name: string;
}

/**
 * Options for establishing connection to a swarm messages channels descriptions list
 * through the swarm connector specified
 *
 * @export
 * @interface ISwarmMessagesChannelsDescriptionsListConnectionOptions
 */
export interface ISwarmMessagesChannelsDescriptionsListConnectionOptions<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T>
> {
  /**
   * Connector type used for the list
   *
   * @type {P}
   * @memberof ISwarmMessagesChannelsListDescription
   */
  connectorType: P;
  /**
   * Options for a swarm database which is used for storing list of channels descriptions
   *
   * @type {DBO}
   * @memberof ISwarmMessagesChannelsListDescription
   */
  dbOptions: DBO;
}

/**
 * Implementation of the channels descriptions list.
 *
 * @export
 * @interface ISwarmMessagesChannelsDescriptionsList
 * @template P
 * @template T
 * @template DBO
 */
export interface ISwarmMessagesChannelsDescriptionsList<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized> {
  /**
   * Description of the swarm messages channel list
   *
   * @type {ISwarmMessagesChannelsListDescription}
   * @memberof ISwarmMessagesChannelsDescriptionsList
   */
  readonly description: Readonly<ISwarmMessagesChannelsListDescription>;

  /**
   * Add new channel in the list by it's description
   *
   * @param {ISwarmMessageChannelDescriptionRaw<P, T, any, any>} channelDescriptionRaw
   * @returns {Promise<void>}
   * @memberof ISwarmMessagesChannelsDescriptionsList
   */
  addChannel(channelDescriptionRaw: ISwarmMessageChannelDescriptionRaw<P, T, any, any>): Promise<void>;

  /**
   * Remove channel description from the list by it's identity
   *
   * @param {TSwarmMessagesChannelId} channelId
   * @returns {Promise<void>}
   * @memberof ISwarmMessagesChannelsDescriptionsList
   */
  removeChannelById(channelId: TSwarmMessagesChannelId): Promise<void>;

  /**
   * Update channel's description by channel's identifier
   *
   * @param {TSwarmMessagesChannelId} channelId
   * @param {Omit<ISwarmMessageChannelDescriptionRaw<P, T, any, any>, 'id'>} channelDescriptionRaw
   * @returns {Promise<void>}
   * @memberof ISwarmMessagesChannelsDescriptionsList
   */
  updateChannelDescriptionById(
    channelId: TSwarmMessagesChannelId,
    channelDescriptionRaw: Omit<ISwarmMessageChannelDescriptionRaw<P, T, any, any>, 'id'>
  ): Promise<void>;

  /**
   * Get description of the channel by it's identifier
   *
   * @param {TSwarmMessagesChannelId} channelId
   * @returns {(Promise<ISwarmMessageChannelDescriptionRaw<P, T, any, any> | undefined>)}
   * @memberof ISwarmMessagesChannelsDescriptionsList
   */
  getChannelDescriptionById(
    channelId: TSwarmMessagesChannelId
  ): Promise<ISwarmMessageChannelDescriptionRaw<P, T, any, any> | undefined>;

  /**
   * Get all known channels descriptions and identifiers
   *
   * @returns {Record<TSwarmMessagesChannelId, ISwarmMessageChannelDescriptionRaw<P, T, any, any>>}
   * @memberof ISwarmMessagesChannelsDescriptionsList
   */
  getAllChannelsDescriptions(): Promise<Record<TSwarmMessagesChannelId, ISwarmMessageChannelDescriptionRaw<P, T, any, any>>>;
}

export interface ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T>
> {
  /**
   * Fabric which creates a connection to the swarm messages database by a database options
   *
   * @memberof ISwarmMessagesChannelsDescriptionsListConstructorArguments
   */
  (dbo: DBO): Promise<
    ISwarmMessagesDatabaseConnector<
      P,
      T,
      ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE,
      DBO,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any
    >
  >;
}

/**
 * Utilities used by the swarm messages channels list instance
 *
 * @export
 * @interface ISwarmMessagesChannelsDescriptionsListConstructorArguments
 * @template P
 * @template T
 * @template DBO
 */
export interface ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtils<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T>
> {
  /**
   * Validator of channel description format
   *
   * @type {ISwarmMessagesChannelDescriptionFormatValidator<P, T, any, any>}
   * @memberof ISwarmMessagesChannelsDescriptionsListConstructorArguments
   */
  swarmMessagesChannelDescriptionFormatValidator: ISwarmMessagesChannelDescriptionFormatValidator<P, T, any, any>;
  /**
   * Validator of a swarm messages wich contains description of a swarm messages channel
   * or DELETE operation of a swarm messages channel.
   *
   * @type {IValidatorOfSwarmMessageWithChannelDescription<P, T, DBO>}
   * @memberof ISwarmMessagesChannelsDescriptionsListConstructorArguments
   */
  channelDescriptionSwarmMessageValidator: IValidatorOfSwarmMessageWithChannelDescription<P, T, DBO>;
  /**
   * Validator of a description of a swarm channels list.
   *
   * @type {IValidatorOfSwarmMessagesChannelsListDescription}
   * @memberof ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtils
   */
  channelsListDescriptionValidator: IValidatorOfSwarmMessagesChannelsListDescription;
}

/**
 * Utilities used by the swarm messages channels list instance
 *
 * @export
 * @interface ISwarmMessagesChannelsDescriptionsListConstructorArguments
 * @template P
 * @template T
 * @template DBO
 */
export interface ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtils<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T>
> {
  /**
   * Generator of a database name by the swarm channels list description.
   *
   * @type {ISwarmMessagesListDatabaseNameByDescriptionGenerator}
   * @memberof ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtils
   */
  databaseNameGenerator: ISwarmMessagesListDatabaseNameByDescriptionGenerator;
  /**
   * Fabric which creates a connection to the swarm messages database by a database options
   *
   * @memberof ISwarmMessagesChannelsDescriptionsListConstructorArguments
   */
  databaseConnectionFabric: ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric<P, T, DBO>;
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
  getIssuerForSwarmMessageWithChannelDescriptionByChannelDescription: IGetSwarmMessageWithChannelDescriptionIssuerByChannelListDescription;
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
  getTypeForSwarmMessageWithChannelDescriptionByChannelDescription: IGetSwarmMessageWithChannelDescriptionTypeByChannelListDescription;
  /**
   * Interface for utility which have to return key in a swarm database
   * for a swarm messages channel description.
   *
   * @type {IGetDatabaseKeyForChannelDescription<P, T>}
   * @memberof ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtils
   */
  getDatabaseKeyForChannelDescription: IGetDatabaseKeyForChannelDescription<P, T>;
  /**
   * This utility will be used for creation of a swarm message body with a channel
   * description.
   */
  createSwarmMessageBodyForChannelDescription: IBodyCreatorOfSwarmMessageWithChannelDescription<P, T, DBO>;
}

/**
 * Arguments for the swarm messages channels descriptions list constructor
 *
 * @export
 * @interface ISwarmMessagesChannelsDescriptionsListConstructorArguments
 * @template P
 * @template T
 * @template DBO
 */
export interface ISwarmMessagesChannelsDescriptionsListConstructorArguments<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T>
> {
  /**
   * Description of the channels list
   *
   * @type {ISwarmMessagesChannelsListDescription}
   * @memberof ISwarmMessagesChannelsDescriptionsListConstructorArguments
   */
  description: ISwarmMessagesChannelsListDescription;
  /**
   * Connection to the list should be established through the swarm connector
   * with the options specified.
   *
   * @type {Readonly<ISwarmMessagesChannelsDescriptionsListConnectionOptions<P, T, DBO>>}
   * @memberof ISwarmMessagesChannelsDescriptionsListConstructorArguments
   */
  connectionOptions: Readonly<ISwarmMessagesChannelsDescriptionsListConnectionOptions<P, T, DBO>>;
  /**
   * Used for channels descriptions serialization
   *
   * @type {ISerializer}
   * @memberof ISwarmMessagesChannelsDescriptionsListConstructorArguments
   */
  serializer: ISerializer;

  /**
   * Utilities used by the swarm messages channels list instance constucted
   * by the constructor.
   *
   * @memberof ISwarmMessagesChannelsDescriptionsListConstructorArguments
   */
  utilities: ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtils<P, T, DBO>;
  /**
   * Validators used for validate various options or params
   *
   * @type {ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtils<P, T, DBO>}
   * @memberof ISwarmMessagesChannelsDescriptionsListConstructorArguments
   */
  validators: ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtils<P, T, DBO>;
}

export interface ISwarmMessagesChannelsDescriptionsListConstructor<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T>
> {
  new (
    constructorArguments: ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, DBO>
  ): ISwarmMessagesChannelsDescriptionsList<P, T>;
}
