import { ESwarmStoreConnector } from 'classes/swarm-store-class/swarm-store-class.const';
import { ISwarmMessageInstanceDecrypted, TSwarmMessageSerialized } from 'classes/swarm-message/swarm-message-constructor.types';
import {
  ISwarmStoreConnector,
  ISwarmStoreConnectorBasic,
  ISwarmStoreOptionsConnectorFabric,
  ISwarmStoreProviderOptions,
  TSwarmStoreConnectorConnectionOptions,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseType,
} from 'classes/swarm-store-class/swarm-store-class.types';
import {
  ISwarmMessageStore,
  ISwarmMessageStoreAccessControlOptions,
  ISwarmMessageStoreOptionsWithConnectorFabric,
  TSwarmMessagesStoreGrantAccessCallback,
} from 'classes/swarm-message-store/types/swarm-message-store.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from 'classes/swarm-message-encrypted-cache/swarm-messgae-encrypted-cache.types';
import { isDeepEqual } from 'utils/common-utils/common-utils-equality';
import { getEventEmitterInstance } from 'classes/basic-classes/event-emitter-class-base/event-emitter-class-base';
import { ESwarmMessagesChannelsListEventName } from '../../../../types/swarm-messages-channel-events.types';
import { TCentralAuthorityUserIdentity } from '../../../../../central-authority-class/central-authority-class-types/central-authority-class-types-common';
import {
  TSwarmMessagesChannelId,
  ISwarmMessageChannelDescriptionRaw,
} from '../../../../types/swarm-messages-channel-instance.types';
import { ISwarmMessagesChannelsDescriptionsList } from '../../../../types/swarm-messages-channels-list-instance.types';
import {
  ISwarmMessagesChannelV1ClassChannelsListHandler,
  ISwarmMessagesChannelV1ClassChannelsListHandlerConstructorOptions,
} from '../types/swarm-messages-channel-v1-class-channels-list-handler.types';
import {
  ISwarmMessagesChannelNotificationEmitter,
  ISwarmMessagesChannelsListEvents,
} from '../../../../types/swarm-messages-channel-events.types';

export class SwarmMessagesChannelV1ClassChannelsListHandler<
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
> implements
    ISwarmMessagesChannelV1ClassChannelsListHandler<
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
    > {
  public get emitter(): ISwarmMessagesChannelNotificationEmitter<P, DbType> {
    return this.__emitter;
  }

  public get id(): TSwarmMessagesChannelId {
    return this.__actualChannelDescription.id;
  }

  public get actualChannelDescription(): ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO> {
    return this.__actualChannelDescription;
  }

  public get promiseChannelDescriptionUpdate(): Promise<void> {
    return this.__channelDescriptionUpdatePromise;
  }

  public get markedAsRemoved(): boolean {
    return this.__channelMarkedAsRemoved;
  }

  protected get _whetherUserIsChannelAdmin(): boolean {
    return this.__actualChannelDescription.admins.includes(this.__currentUserId);
  }

  private __emitter = getEventEmitterInstance<ISwarmMessagesChannelsListEvents<P, DbType>>();

  /**
   * Asynchronous process of adding this channel's description
   * to a channels list.
   * At first an existing channel description will be gotten
   * and verified for deep equality to the channel description
   * from the options.
   *
   * @private
   * @type {Promise<void>}
   * @memberof SwarmMessagesChannelV1Class
   */
  private __channelDescriptionUpdatePromise: Promise<void>;

  /**
   * Channel have been marked as removed. But the status can be
   * changed by anothor admin user.
   *
   * @private
   * @type {boolean}
   * @memberof SwarmMessagesChannelV1ClassChannelsListHandler
   */
  private __channelMarkedAsRemoved: boolean = true;

  private __actualChannelDescription: ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>;

  private get __chanelsListInstance(): ISwarmMessagesChannelsDescriptionsList<P, T, MD> {
    return this.__options.chanelsListInstance;
  }

  private get __currentUserId(): TCentralAuthorityUserIdentity {
    return this.__options.currentUserId;
  }

  constructor(
    private readonly __options: ISwarmMessagesChannelV1ClassChannelsListHandlerConstructorOptions<P, T, DbType, DBO, MD>
  ) {
    const { channelDescription, chanelsListInstance } = __options;

    this.__actualChannelDescription = channelDescription;
    this.__channelDescriptionUpdatePromise = this._createPromiseAddChannelDescriptionToTheChannelsList(
      channelDescription,
      chanelsListInstance
    );
    this._subscribeOnChannelDescriptionUpdates(chanelsListInstance);
  }

  public async updateChannelDescription(
    channelRawDescription: Readonly<ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>>
  ): Promise<void> {
    await this._whetherUserCanEditChannelDescription();
    if (!this._isTwoChannelsDescriptionsEqual(channelRawDescription, this.__actualChannelDescription)) {
      await this._updateChannelDescriptionInChannelsList(channelRawDescription);
    }
  }

  public async dropChannelDescriptionFromList(): Promise<void> {
    await this._whetherUserCanEditChannelDescription();
    await this._dropChannelDescriptionFromTheChannelsList();
  }

  protected async _whetherUserCanEditChannelDescription(): Promise<void> {
    await this.__channelDescriptionUpdatePromise;
    if (this.__channelMarkedAsRemoved) {
      throw new Error('Channel marked as removed, so it is not allowed any changes');
    }
    if (!this._whetherUserIsChannelAdmin) {
      throw new Error('Only admin of the channel can edit a description of the channel');
    }
  }

  protected _subscribeOnChannelDescriptionUpdates(
    swarmMessagesChannelsListInstance: ISwarmMessagesChannelsDescriptionsList<P, T, MD>
  ) {
    this.__subscribeOrUnsubscribeFromChannelDescriptionUpdates(swarmMessagesChannelsListInstance, true);
  }

  protected _unsubscribeOnChannelDescriptionUpdates(
    swarmMessagesChannelsListInstance: ISwarmMessagesChannelsDescriptionsList<P, T, MD>
  ) {
    this.__subscribeOrUnsubscribeFromChannelDescriptionUpdates(swarmMessagesChannelsListInstance, false);
  }

  protected async _updateChannelDescriptionInChannelsList(
    swarmChannelDescription: ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>
  ): Promise<void> {
    await this.__chanelsListInstance.upsertChannel(swarmChannelDescription);
  }

  protected async _dropChannelDescriptionFromTheChannelsList(): Promise<void> {
    await this.__chanelsListInstance.removeChannelById(this.id);
  }

  protected _isTwoChannelsDescriptionsEqual(
    firstChannelDescription: ISwarmMessageChannelDescriptionRaw<P, T, any, any>,
    secondChannelDescription: ISwarmMessageChannelDescriptionRaw<P, T, any, any>
  ): boolean {
    return isDeepEqual(firstChannelDescription, secondChannelDescription);
  }

  protected async _readChannelDescriptionFromChannelsList(
    id: TSwarmMessagesChannelId,
    swarmMessagesChannelsListInstance: ISwarmMessagesChannelsDescriptionsList<P, T, MD>
  ): Promise<ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO> | undefined> {
    return await swarmMessagesChannelsListInstance.getChannelDescriptionById(id);
  }

  /**
   * Get a description of the channel by it's identity from the channels list
   * provided in the constructor options and if there is no any description
   * in the list then add description passed in constructor into the channels list.
   *
   * @protected
   * @returns {Promise<void>}
   * @memberof SwarmMessagesChannelV1Class
   */
  protected async _createPromiseAddChannelDescriptionToTheChannelsList(
    swarmChannelDescriptionFromOptions: ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>,
    swarmMessagesChannelsListInstance: ISwarmMessagesChannelsDescriptionsList<P, T, MD>
  ): Promise<void> {
    const channelDescriptionFromChannelsList = await this._readChannelDescriptionFromChannelsList(
      swarmChannelDescriptionFromOptions.id,
      swarmMessagesChannelsListInstance
    );

    if (!channelDescriptionFromChannelsList) {
      await this._updateChannelDescriptionInChannelsList(swarmChannelDescriptionFromOptions);
    } else {
      this._setActualChannelDescription(channelDescriptionFromChannelsList);
    }
  }

  protected async _readActualChannelDescriptionFromCurrentChannelsList(): Promise<
    ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO> | undefined
  > {
    return await this._readChannelDescriptionFromChannelsList(this.id, this.__chanelsListInstance);
  }

  protected _setActualChannelDescription(channelDescription: ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>): void {
    this.__actualChannelDescription = channelDescription;
  }

  protected _emitChannelUpdatedDescription(channelDescription: ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>): void {
    this.__emitter.emit(ESwarmMessagesChannelsListEventName.CHANNEL_DESCRIPTION_UPDATE, channelDescription);
  }

  protected _emitChannelDescriptionRemoved(channelId: TSwarmMessagesChannelId): void {
    this.__emitter.emit(ESwarmMessagesChannelsListEventName.CHANNEL_DESCRIPTION_REMOVED);
  }

  protected async _updateThisInstanceChannelDescription(): Promise<void> {
    const actualChannelDescription = await this._readActualChannelDescriptionFromCurrentChannelsList();

    if (actualChannelDescription) {
      this._setActualChannelDescription(actualChannelDescription);
    }
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  protected _handleChannelDescriptionUpdateListener = (
    channelDescription: ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>
  ): void => {
    if (channelDescription.id === this.id) {
      // if incoming description is not an updated description of the channel
      return;
    }
    if (
      !this.__channelDescriptionUpdatePromise &&
      this._isTwoChannelsDescriptionsEqual(this.__actualChannelDescription, channelDescription)
    ) {
      this._setChannelDescriptionUpdatePromise(this._updateThisInstanceChannelDescription());
      this._unsetChannelRemovedMark();
      this._emitChannelUpdatedDescription(this.__actualChannelDescription);
    }
  };

  protected _setChannelRemovedMark(): void {
    this.__channelMarkedAsRemoved = true;
  }

  protected _unsetChannelRemovedMark(): void {
    this.__channelMarkedAsRemoved = false;
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  protected _handleChannelDescriptionDeleteListener = async (channelDeletedId: TSwarmMessagesChannelId): Promise<void> => {
    if (channelDeletedId !== this.id || this.markedAsRemoved) {
      // if incoming description is not an updated description of the channel
      return;
    }

    const actualChannelDescription = await this._readActualChannelDescriptionFromCurrentChannelsList();

    if (!actualChannelDescription) {
      this._emitChannelDescriptionRemoved(this.id);
      /**
       * in the upper scope handler of this event should unsubscribes
       * from all channel database updates
       * */
      this._setChannelRemovedMark();
    }
  };

  protected _setChannelDescriptionUpdatePromise(channelDescriptionUpdatePromise: Promise<void>): void {
    this.__channelDescriptionUpdatePromise = channelDescriptionUpdatePromise;
  }

  private __subscribeOrUnsubscribeFromChannelDescriptionUpdates(
    swarmMessagesChannelsListInstance: ISwarmMessagesChannelsDescriptionsList<P, T, MD>,
    ifSubscription: boolean = true
  ) {
    const methodName = ifSubscription ? 'addListener' : 'removeListener';
    const channelEmitter = swarmMessagesChannelsListInstance.emitter;

    channelEmitter[methodName](
      ESwarmMessagesChannelsListEventName.CHANNEL_DESCRIPTION_UPDATE,
      this._handleChannelDescriptionUpdateListener
    );
    channelEmitter[methodName](
      ESwarmMessagesChannelsListEventName.CHANNEL_DESCRIPTION_REMOVED,
      this._handleChannelDescriptionDeleteListener
    );
  }
}
