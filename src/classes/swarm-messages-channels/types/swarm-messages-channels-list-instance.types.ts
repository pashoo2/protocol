import { SWARM_CHANNELS_LIST_VERSION } from './../swarm-messages-channels-classes/const/swarm-messages-channels-list-classes-params.const';
import {
  ESwarmStoreConnector,
  ESwarmStoreConnectorOrbitDbDatabaseType,
  TSwarmStoreDatabaseOptions,
} from '../../swarm-store-class';
import { ISwarmMessageInstanceDecrypted, TSwarmMessageSerialized } from '../../swarm-message';
import {
  ISwarmMessageChannelDescriptionRaw,
  TSwarmMessagesChannelId,
  ISwarmMessagesChannelDescriptionWithMetadata,
} from './swarm-messages-channel-instance.types';
import { ISwarmMessagesDatabaseConnector } from '../../swarm-messages-database';
import { ISerializer } from '../../../types/serialization.types';
import {
  ISwarmMessagesListDatabaseNameByDescriptionGenerator,
  IGetChannelIdByDatabaseKey,
} from './swarm-messages-channels-utils.types';
import {
  ISwarmMessagesStoreConnectorUtilsDbOptionsGrandAccessCallbackBound,
  TSwarmMessagesStoreGrantAccessCallback,
  ISwarmMessageStoreAccessControlOptions,
} from '../../swarm-message-store/types/swarm-message-store.types';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../swarm-message-encrypted-cache/swarm-messgae-encrypted-cache.types';
import { ISwarmMessagesDatabaseMessagesCollector } from '../../swarm-messages-database/swarm-messages-database.messages-collector.types';
import { JSONSchema7 } from 'json-schema';
import { ISwarmMessagesChannelsListNotificationEmitter } from './swarm-messages-channels-list-events.types';
import {
  ISwarmChannelsListClockSortedChannelsDescriptionsUpdatesCacheConstructorParams,
  ISwarmChannelsListClockSortedChannelsDescriptionsUpdatesCache,
} from './swarm-channels-list-clock-sorted-channels-descriptions-updates-cache.types';
import {
  ISwarmMessagesDatabaseCacheOptions,
  ISwarmMessagesDatabaseCache,
  ISwarmMessagesDatabaseConnectOptions,
} from '../../swarm-messages-database/swarm-messages-database.types';
import {
  ISwarmStoreProviderOptions,
  ISwarmStoreConnector,
  ISwarmStoreOptionsConnectorFabric,
} from '../../swarm-store-class/swarm-store-class.types';
import {
  ISwarmMessageStoreOptionsWithConnectorFabric,
  ISwarmMessageStore,
} from '../../swarm-message-store/types/swarm-message-store.types';
import {
  ISwarmStoreConnectorBasic,
  TSwarmStoreConnectorConnectionOptions,
} from '../../swarm-store-class/swarm-store-class.types';
import {
  IValidatorOfSwarmMessagesChannelsListDescription,
  ISwamChannelsListDatabaseOptionsValidator,
} from './swarm-messages-channels-validation.types';
import {
  ISwarmMessagesChannelDescriptionFormatValidator,
  IValidatorOfSwarmMessageWithChannelDescription,
} from './swarm-messages-channels-validation.types';
import {
  IGetDatabaseKeyForChannelDescription,
  IGetSwarmMessageWithChannelDescriptionIssuerByChannelListDescription,
  IGetSwarmMessageWithChannelDescriptionTypeByChannelListDescription,
} from './swarm-messages-channels-utils.types';

export type TSwarmMessagesChannelsListDbType = ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE;

export type TSwrmMessagesChannelsListDBOWithGrantAccess<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwarmStoreDatabaseOptions<P, T, TSwarmMessagesChannelsListDbType> = TSwarmStoreDatabaseOptions<
    P,
    T,
    TSwarmMessagesChannelsListDbType
  >
> = Omit<DBO, 'dbName' | 'dbType' | 'grantAccess' | 'preloadCount'> & {
  /**
   * Grant access callback supports for validation of a swarm messages decrypted
   *
   * @type {TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, T, ISwarmMessageInstanceDecrypted>}
   */
  grantAccess: ISwarmMessagesStoreConnectorUtilsDbOptionsGrandAccessCallbackBound<P, T, MD, CTX>;
};

export type DBOFULL<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>
> = TSwarmStoreDatabaseOptions<P, T, TSwarmMessagesChannelsListDbType> &
  DBO & {
    // a name of the database
    dbName: string;
    // a
    dbType: TSwarmMessagesChannelsListDbType;
    /**
     * Grant access callback supports for validation of a swarm messages decrypted
     *
     * @type {TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, T, ISwarmMessageInstanceDecrypted>}
     */
    grantAccess: ISwarmMessagesStoreConnectorUtilsDbOptionsGrandAccessCallbackBound<P, T, MD, CTX>;
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
  version: SWARM_CHANNELS_LIST_VERSION;
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
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>
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
 * Fabric for creation of an instance of the
 * SwarmChannelsListClockSortedChannelsDescriptionsUpdatesCache.
 *
 * @export
 * @interface ISwarmChannelsListClockSortedChannelsDescriptionsUpdatesCacheFabric
 * @template P
 * @template T
 * @template MD
 */
export interface ISwarmChannelsListClockSortedChannelsDescriptionsUpdatesCacheFabric<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBOL extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>,
  DBO extends DBOFULL<P, T, MD, CTX, DBOL> = DBOFULL<P, T, MD, CTX, DBOL>
> {
  (
    params: ISwarmChannelsListClockSortedChannelsDescriptionsUpdatesCacheConstructorParams<
      P,
      T,
      ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE,
      DBO,
      MD
    >
  ): ISwarmChannelsListClockSortedChannelsDescriptionsUpdatesCache<
    P,
    T,
    ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE,
    DBO,
    MD
  >;
}

/**
 * Implementation of the channels descriptions list.
 *
 * WARNING! Database operation 'DELETE' means that the key
 * is removed from the database at all at that moment of time.
 *
 * @export
 * @interface ISwarmMessagesChannelsDescriptionsList
 * @template P
 * @template T
 * @template DBO
 */
export interface ISwarmMessagesChannelsDescriptionsList<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted
> {
  /**
   * Description of the swarm messages channel list
   *
   * @type {ISwarmMessagesChannelsListDescription}
   * @memberof ISwarmMessagesChannelsDescriptionsList
   */
  readonly description: Readonly<ISwarmMessagesChannelsListDescription>;

  /**
   * Event emitter which notifies about operations performed
   * into the list.
   *
   * @type {ISwarmMessagesChannelsListEmitter<P, any>}
   * @memberof ISwarmMessagesChannelsDescriptionsList
   */
  readonly emitter: ISwarmMessagesChannelsListNotificationEmitter<P, T, any>;

  /**
   * Whether the channels database has opened and the channels list
   * is ready to be used.
   *
   * @type {boolean}
   * @memberof ISwarmMessagesChannelsDescriptionsList
   */
  readonly isReady: boolean;

  /**
   * Immutable channels decriptions map cached and read only.
   * Because the map is immutable an updates of the list
   * can be lisened with event "ESwarmMessagesChannelsListEventName.CHANNELS_CACHE_UPDATED".
   *
   * @type {(Readonly<
   *     Map<TSwarmMessagesChannelId, ISwarmMessageChannelDescriptionRaw<P, T, any, any> | Error>
   *   >)}
   * @memberof ISwarmMessagesChannelsDescriptionsList
   */
  readonly swarmChannelsDescriptionsCachedMap: Readonly<
    Map<TSwarmMessagesChannelId, ISwarmMessageChannelDescriptionRaw<P, T, any, any> | Error>
  >;

  /**
   * Add a new channel byt it's description in the channels list by it's description
   * or update a description of the existing one.
   *
   * @param {ISwarmMessageChannelDescriptionRaw<P, T, any, any>} channelDescriptionRaw
   * @returns {Promise<void>}
   * @memberof ISwarmMessagesChannelsDescriptionsList
   */
  upsertChannel(channelDescriptionRaw: ISwarmMessageChannelDescriptionRaw<P, T, any, any>): Promise<void>;

  /**
   * Remove channel description from the list by it's identity
   *
   * @param {TSwarmMessagesChannelId} channelId
   * @returns {Promise<void>}
   * @memberof ISwarmMessagesChannelsDescriptionsList
   */
  removeChannelById(channelId: TSwarmMessagesChannelId): Promise<void>;

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
   * @returns {Promise<ISwarmMessagesChannelDescriptionWithMetadata<P, T, MD, any, any>>}
   * @memberof ISwarmMessagesChannelsDescriptionsList
   */
  getAllChannelsDescriptions(): Promise<ISwarmMessagesChannelDescriptionWithMetadata<P, T, MD, any, any>[]>;

  /**
   * Close channel.
   *
   * @returns {Promise<void>}
   * @memberof ISwarmMessagesChannelsDescriptionsList
   */
  close(): Promise<void>;

  /**
   * Drop channels list database locally.
   *
   * @returns {Promise<void>}
   * @memberof ISwarmMessagesChannelsDescriptionsList
   */
  drop(): Promise<void>;
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
export interface ISwarmMessagesChannelsDescriptionsListConstructorArgumentsValidators<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>
> {
  /**
   * Validates a value by a json jsonSchema
   * passed in props.
   *
   * @param {JSONSchema7} jsonSchema
   * @param {*} valueToValidate
   * @returns {Promise<void>}
   * @memberof ISwarmMessagesChannelsDescriptionsListConstructorArgumentsValidators
   */
  jsonSchemaValidator(jsonSchema: JSONSchema7, valueToValidate: any): Promise<void>;
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
  channelDescriptionSwarmMessageValidator: IValidatorOfSwarmMessageWithChannelDescription<P, T, MD, CTX, DBO>;
  /**
   * Validator of a description of a swarm channels list.
   *
   * @type {IValidatorOfSwarmMessagesChannelsListDescription}
   * @memberof ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtils
   */
  channelsListDescriptionValidator: IValidatorOfSwarmMessagesChannelsListDescription;
  /**
   * Validator of a database options which is used as a swarm database
   * for handling swarm channels list.
   *
   * @param {unknown} dbOptions
   * @returns {dbOptions is TSwrmMessagesChannelsListDBOWithGrantAccess<any, any>}
   * @memberof ISwarmMessagesChannelsDescriptionsListConstructorArgumentsValidators
   */
  swamChannelsListDatabaseOptionsValidator: ISwamChannelsListDatabaseOptionsValidator;
}

/**
 * Utilities used by the swarm messages channels list instance
 *
 * @exportviolators will be towed
 * @interface ISwarmMessagesChannelsDescriptionsListConstructorArguments
 * @template P
 * @template T
 * @template DBO
 */
export interface ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtils<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>,
  CF extends ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric<P, T, MD, CTX, DBO>
> {
  /**
   * Used for channels descriptions serialization
   *
   * @type {ISerializer}
   * @memberof ISwarmMessagesChannelsDescriptionsListConstructorArguments
   */
  serializer: ISerializer;
  /**
   * Fabric which creates a connection to the swarm messages database by a database options
   *
   * @memberof ISwarmMessagesChannelsDescriptionsListConstructorArguments
   */
  databaseConnectionFabric: CF;
  /**
   * Generator of a database name by the swarm channels list description.
   *
   * @type {ISwarmMessagesListDatabaseNameByDescriptionGenerator}
   * @memberof ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtils
   */
  databaseNameGenerator: ISwarmMessagesListDatabaseNameByDescriptionGenerator;
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
   * to get type value for the message's body.
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
   * Returns swarm channel identity by a database KEY for a
   * channel description stored in the database, related to a
   * swarm messages channels list, where the swarm messages channel
   * desription is stored.
   *
   * @type {IGetChannelIdByDatabaseKey<P>}
   * @memberof ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtils
   */
  getChannelIdByDatabaseKey: IGetChannelIdByDatabaseKey<P>;

  /**
   * Fabric creates a cached history of swarm channel description updates.
   */
  getSwarmChannelsListClockSortedChannelsDescriptionsUpdatesCache: ISwarmChannelsListClockSortedChannelsDescriptionsUpdatesCacheFabric<
    P,
    T,
    MD,
    CTX,
    DBO
  >;
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
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>,
  CF extends ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric<P, T, MD, CTX, DBO>
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
  connectionOptions: Readonly<ISwarmMessagesChannelsDescriptionsListConnectionOptions<P, T, MD, CTX, DBO>>;

  /**
   * Utilities used by the swarm messages channels list instance constucted
   * by the constructor.
   *
   * @memberof ISwarmMessagesChannelsDescriptionsListConstructorArguments
   */
  utilities: ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtils<P, T, MD, CTX, DBO, CF>;
  /**
   * Validators used for validate various options or params
   *
   * @type {ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtils<P, T, DBO>}
   * @memberof ISwarmMessagesChannelsDescriptionsListConstructorArguments
   */
  validators: ISwarmMessagesChannelsDescriptionsListConstructorArgumentsValidators<P, T, MD, CTX, DBO>;
}

export interface ISwarmMessagesChannelsDescriptionsListConstructor<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>,
  CF extends ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric<P, T, MD, CTX, DBO>
> {
  new (
    constructorArguments: ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, MD, CTX, DBO, CF>
  ): ISwarmMessagesChannelsDescriptionsList<P, T, MD>;
}

export interface ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>,
  DBOF extends DBOFULL<P, T, MD, CTX, DBO> = DBOFULL<P, T, MD, CTX, DBO>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined = undefined,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MD | T> = TSwarmMessagesStoreGrantAccessCallback<P, MD | T>,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MD | T, GAC> | undefined = undefined,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, TSwarmMessagesChannelsListDbType, DBOF> = ISwarmStoreConnectorBasic<
    P,
    T,
    TSwarmMessagesChannelsListDbType,
    DBOF
  >,
  CO extends TSwarmStoreConnectorConnectionOptions<
    P,
    T,
    TSwarmMessagesChannelsListDbType,
    DBOF,
    ConnectorBasic
  > = TSwarmStoreConnectorConnectionOptions<P, T, TSwarmMessagesChannelsListDbType, DBOF, ConnectorBasic>,
  PO extends ISwarmStoreProviderOptions<
    P,
    T,
    TSwarmMessagesChannelsListDbType,
    DBOF,
    ConnectorBasic,
    CO
  > = ISwarmStoreProviderOptions<P, T, TSwarmMessagesChannelsListDbType, DBOF, ConnectorBasic, CO>,
  ConnectorMain extends ISwarmStoreConnector<
    P,
    T,
    TSwarmMessagesChannelsListDbType,
    DBOF,
    ConnectorBasic,
    CO
  > = ISwarmStoreConnector<P, T, TSwarmMessagesChannelsListDbType, DBOF, ConnectorBasic, CO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<
    P,
    T,
    TSwarmMessagesChannelsListDbType,
    DBOF,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain
  > = ISwarmStoreOptionsConnectorFabric<P, T, TSwarmMessagesChannelsListDbType, DBOF, ConnectorBasic, CO, PO, ConnectorMain>,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<
    P,
    T,
    TSwarmMessagesChannelsListDbType,
    DBOF,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    CFO,
    MD | T,
    GAC,
    MCF,
    ACO
  > = ISwarmMessageStoreOptionsWithConnectorFabric<
    P,
    T,
    TSwarmMessagesChannelsListDbType,
    DBOF,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    CFO,
    MD | T,
    GAC,
    MCF,
    ACO
  >,
  SMS extends ISwarmMessageStore<
    P,
    T,
    TSwarmMessagesChannelsListDbType,
    DBOF,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    CFO,
    MD | T,
    GAC,
    MCF,
    ACO,
    O
  > = ISwarmMessageStore<
    P,
    T,
    TSwarmMessagesChannelsListDbType,
    DBOF,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    CFO,
    MD | T,
    GAC,
    MCF,
    ACO,
    O
  >,
  SMSM extends ISwarmMessagesDatabaseMessagesCollector<
    P,
    TSwarmMessagesChannelsListDbType,
    MD
  > = ISwarmMessagesDatabaseMessagesCollector<P, TSwarmMessagesChannelsListDbType, MD>,
  DCO extends ISwarmMessagesDatabaseCacheOptions<
    P,
    TSwarmMessagesChannelsListDbType,
    MD,
    SMSM
  > = ISwarmMessagesDatabaseCacheOptions<P, TSwarmMessagesChannelsListDbType, MD, SMSM>,
  DCCRT extends ISwarmMessagesDatabaseCache<P, T, TSwarmMessagesChannelsListDbType, DBOF, MD, SMSM> = ISwarmMessagesDatabaseCache<
    P,
    T,
    TSwarmMessagesChannelsListDbType,
    DBOF,
    MD,
    SMSM
  >,
  OPT extends ISwarmMessagesDatabaseConnectOptions<
    P,
    T,
    TSwarmMessagesChannelsListDbType,
    DBOF,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    CFO,
    GAC,
    MCF,
    ACO,
    O,
    SMS,
    MD,
    SMSM,
    DCO,
    DCCRT
  > = ISwarmMessagesDatabaseConnectOptions<
    P,
    T,
    TSwarmMessagesChannelsListDbType,
    DBOF,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    CFO,
    GAC,
    MCF,
    ACO,
    O,
    SMS,
    MD,
    SMSM,
    DCO,
    DCCRT
  >
> {
  /**
   * Fabric which creates a connection to the swarm messages database by a database options
   *
   * @memberof ISwarmMessagesChannelsDescriptionsListConstructorArguments
   */
  (dbo: DBOF): Promise<
    ISwarmMessagesDatabaseConnector<
      P,
      T,
      TSwarmMessagesChannelsListDbType,
      DBOF,
      ConnectorBasic,
      CO,
      PO,
      ConnectorMain,
      CFO,
      GAC,
      MCF,
      ACO,
      O,
      SMS,
      MD,
      SMSM,
      DCO,
      DCCRT,
      OPT
    >
  >;
}
