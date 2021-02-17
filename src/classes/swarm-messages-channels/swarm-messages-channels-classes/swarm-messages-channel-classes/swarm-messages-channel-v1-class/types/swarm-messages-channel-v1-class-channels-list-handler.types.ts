import {
  ESwarmStoreConnector,
  ISwarmStoreConnector,
  ISwarmStoreConnectorBasic,
  ISwarmStoreOptionsConnectorFabric,
  ISwarmStoreProviderOptions,
  TSwarmStoreConnectorConnectionOptions,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseType,
} from '../../../../../swarm-store-class';
import { ISwarmMessageInstanceDecrypted, TSwarmMessageSerialized } from '../../../../../swarm-message';
import {
  ISwarmMessageStore,
  ISwarmMessageStoreAccessControlOptions,
  ISwarmMessageStoreOptionsWithConnectorFabric,
  TSwarmMessagesStoreGrantAccessCallback,
} from '../../../../../swarm-message-store';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../../../../swarm-message-encrypted-cache';
import {
  ISwarmMessageChannelDescriptionRaw,
  ISwarmMessagesChannel,
  ISwarmMessagesChannelsDescriptionsList,
} from '../../../../types';
import { TCentralAuthorityUserIdentity } from '../../../../../central-authority-class/central-authority-class-types';

/**
 * Class that is related to the channels description
 * updates handling made through a channels list
 * related.
 *
 * @export
 * @interface ISwarmMessagesChannelV1ClassChannelsListHandler
 * @extends {(Pick<ISwarmMessagesChannel<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, GAC, MCF, ACO, O, SMS, MD>, 'emitter' | 'updateChannelDescription' | 'id' | 'markedAsRemoved'>)}
 * @template P
 * @template T
 * @template DbType
 * @template DBO
 * @template ConnectorBasic
 * @template PO
 * @template CO
 * @template ConnectorMain
 * @template CFO
 * @template GAC
 * @template MCF
 * @template ACO
 * @template O
 * @template SMS
 * @template MD
 */
export interface ISwarmMessagesChannelV1ClassChannelsListHandler<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
  CO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, PO>,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, PO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain>,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MD | T>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MD | T, GAC> | undefined,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    PO,
    CO,
    ConnectorMain,
    CFO,
    MD | T,
    GAC,
    MCF,
    ACO
  >,
  SMS extends ISwarmMessageStore<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO, O>,
  MD extends ISwarmMessageInstanceDecrypted
> extends Pick<
    ISwarmMessagesChannel<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, GAC, MCF, ACO, O, SMS, MD>,
    'emitter' | 'updateChannelDescription' | 'id' | 'markedAsRemoved'
  > {
  /**
   * Channel description updated from the related channels list.
   *
   * @type {ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>}
   * @memberof ISwarmMessagesChannelV1ClassChannelsListHandler
   */
  readonly actualChannelDescription: ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>;

  /**
   * Synchronous process of adding this channel's description
   * to a channels list.
   * At first an existing channel description will be gotten
   * and verified for deep equality to the channel description
   * from the options.
   *
   * @type {Promise<void>}
   * @memberof ISwarmMessagesChannelV1ClassChannelsListHandler
   */
  readonly promiseChannelDescriptionUpdate: Promise<void>;

  /**
   * Delete the channel's description from the related channels list.
   *
   * @returns {Promise<void>}
   * @memberof ISwarmMessagesChannelV1ClassChannelsListHandler
   */
  dropChannelDescriptionFromList(): Promise<void>;
}

/**
 * Options which must be passed in a counstructor of a class for handlind operations
 * with a channel's description in the swarm messages list.
 *
 * @export
 * @interface ISwarmMessagesChannelV1ClassChannelsListHandlerConstructorOptions
 * @template P
 * @template T
 * @template DbType
 * @template DBO
 * @template MD
 */
export interface ISwarmMessagesChannelV1ClassChannelsListHandlerConstructorOptions<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  MD extends ISwarmMessageInstanceDecrypted
> {
  /**
   * An identity of the current user.
   *
   * @type {TCentralAuthorityUserIdentity}
   * @memberof ISwarmMessagesChannelV1ClassChannelsListHandlerConstructorOptions
   */
  currentUserId: TCentralAuthorityUserIdentity;
  /**
   * A description of the channel.
   *
   * @type {ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>}
   * @memberof ISwarmMessagesChannelV1ClassChannelsListHandlerConstructorOptions
   */
  channelDescription: ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>;
  /**
   * A channels list instance which is related to the channel.
   * It means that all updates and readings of the channel description
   * will be made throught this channels list.
   *
   * @type {ISwarmMessagesChannelsDescriptionsList<P, T, MD>}
   * @memberof ISwarmMessagesChannelV1ClassChannelsListHandlerConstructorOptions
   */
  chanelsListInstance: ISwarmMessagesChannelsDescriptionsList<P, T, MD>;
}

/**
 * Constructor of a handler of a channels list operations
 * and events for a swarm messages channel.
 *
 * @export
 * @interface ISwarmMessagesChannelV1ClassChannelsListHandlerConstructor
 * @template P
 * @template T
 * @template DbType
 * @template DBO
 * @template ConnectorBasic
 * @template PO
 * @template CO
 * @template ConnectorMain
 * @template CFO
 * @template GAC
 * @template MCF
 * @template ACO
 * @template O
 * @template SMS
 * @template MD
 */
export interface ISwarmMessagesChannelV1ClassChannelsListHandlerConstructor<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
  CO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, PO>,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, PO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain>,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MD | T>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MD | T, GAC> | undefined,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    PO,
    CO,
    ConnectorMain,
    CFO,
    MD | T,
    GAC,
    MCF,
    ACO
  >,
  SMS extends ISwarmMessageStore<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO, O>,
  MD extends ISwarmMessageInstanceDecrypted
> {
  new (
    options: ISwarmMessagesChannelV1ClassChannelsListHandlerConstructorOptions<P, T, DbType, DBO, MD>
  ): ISwarmMessagesChannelV1ClassChannelsListHandler<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    PO,
    CO,
    ConnectorMain,
    CFO,
    GAC,
    MCF,
    ACO,
    O,
    SMS,
    MD
  >;
}
