import React from 'react';
import { cloneMap } from 'utils';

import { ESwarmStoreConnector } from '../../classes/swarm-store-class/swarm-store-class.const';
import {
  TSwarmMessageSerialized,
  ISwarmMessageInstanceDecrypted,
} from '../../classes/swarm-message/swarm-message-constructor.types';
import { ISwarmMessagesChannelsDescriptionsList } from '../../classes/swarm-messages-channels/types/swarm-messages-channels-list-instance.types';
import { ESwarmMessagesChannelsListEventName } from '../../classes/swarm-messages-channels/types/swarm-messages-channels-list-events.types';
import {
  ISwarmMessagesChannelDescriptionWithMetadata,
  ISwarmMessageChannelDescriptionRaw,
} from '../../classes/swarm-messages-channels/types/swarm-messages-channel-instance.types';
import { TSwarmMessagesChannelId } from '../../classes/swarm-messages-channels/types/swarm-messages-channel-instance.types';
import { SwarmChannelDescriptionComponent } from '../swarm-channel-description-component/swarm-channel-description-component';

export interface ISwarmMessagesChannelsListProps<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted
> {
  channelsList: ISwarmMessagesChannelsDescriptionsList<P, T, MD>;
  updateChannelDescription(channelDescription: ISwarmMessageChannelDescriptionRaw<P, T, any, any>): Promise<void>;
  renderOnChannelsListReady?: () => React.ReactNode;
  onChoseSwarmChannel?(swarmChannelDescription: ISwarmMessageChannelDescriptionRaw<P, T, any, any>): unknown;
}

export interface ISwarmMessagesChannelsListState<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted
> {
  channelsListInatance: ISwarmMessagesChannelsDescriptionsList<P, T, MD> | undefined;
  isChannelsListReady: boolean;
  isChannelsListClosed: boolean;
  channelsDescriptions: Readonly<Map<TSwarmMessagesChannelId, ISwarmMessageChannelDescriptionRaw<P, T, any, any> | Error>>;
  errorsList: Error[];
  isChannelsListByEventsOpened: boolean;
}

export class SwarmMessagesChannelsListComponentBase<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted
> extends React.PureComponent<ISwarmMessagesChannelsListProps<P, T, MD>, ISwarmMessagesChannelsListState<P, T, MD>> {
  public state: ISwarmMessagesChannelsListState<P, T, MD> = {
    channelsListInatance: undefined,
    isChannelsListReady: false,
    isChannelsListClosed: false,
    isChannelsListByEventsOpened: false,
    channelsDescriptions: new Map<TSwarmMessagesChannelId, ISwarmMessageChannelDescriptionRaw<P, T, any, any> | Error>(),
    errorsList: [] as Error[],
  };

  constructor(props: ISwarmMessagesChannelsListProps<P, T, MD>) {
    super(props);
    this._onChannelsListClosed = this._onChannelsListClosed.bind(this);
    this._onChannelsListReady = this._onChannelsListReady.bind(this);
    this._onChannelDescriptionUpdate = this._onChannelDescriptionUpdate.bind(this);
    this._onChannelDescriptionRemoved = this._onChannelDescriptionRemoved.bind(this);
    this._onChannelsListCachedUpdated = this._onChannelsListCachedUpdated.bind(this);
    this._renderChannelDescriptionOrError = this._renderChannelDescriptionOrError.bind(this);
  }

  public componentDidMount() {
    this._setCurrentChannelsListByProps();
  }

  public componentWillUnmount() {
    this._unsetChannelsListEventsListeners();
  }

  public componentDidUpdate(
    prevProps: ISwarmMessagesChannelsListProps<P, T, MD>,
    { channelsListInatance: prevChannelsListInstance }: ISwarmMessagesChannelsListState<P, T, MD>
  ) {
    const { channelsListInatance } = this.state;
    if (channelsListInatance && prevChannelsListInstance !== channelsListInatance) {
      this._setChannelsListEventsListeners();
    }
  }

  public render() {
    const { channelsListInatance: channelsList, isChannelsListByEventsOpened } = this.state;
    if (!channelsList) {
      return 'Channels list is not ready';
    }
    return (
      <div>
        {this._renderChannelsListState()}
        {this._renderPropOnChannelsListReady()}
        <hr />
        Channels list cached:
        <div>{this.renderChannelsDescriptionsCachedInChannelsListInstance()}</div>
        <hr />
        Channels list by channel description update events:
        <div>
          <button
            onClick={() => this.setState((state) => ({ isChannelsListByEventsOpened: !state.isChannelsListByEventsOpened }))}
          >
            Toggle list visibility
          </button>
          {isChannelsListByEventsOpened && this._renderChannelsDescriptions()}
        </div>
      </div>
    );
  }

  protected _renderChannelsListDescription(): React.ReactElement | null {
    const { channelsListInatance } = this.state;

    if (!channelsListInatance) {
      return null;
    }

    const { description } = channelsListInatance;
    const { version, id, name } = description;

    return (
      <section>
        <p>Id: {id}</p>
        <p>Version: {version}</p>
        <p>Name: {name}</p>
      </section>
    );
  }

  protected _renderChannelsListState(): React.ReactElement {
    const { channelsListInatance: channelsList, isChannelsListReady, isChannelsListClosed } = this.state;
    if (!channelsList) {
      return <p>Channels list is not exists</p>;
    }
    return (
      <div>
        <h3>Channels list state</h3>
        <p>{isChannelsListReady ? '' : 'not '}ready to use</p>
        <p>{isChannelsListClosed ? 'closed' : 'not closed'}</p>
        <details>{this._renderChannelsListDescription()}</details>
      </div>
    );
  }

  protected _renderPropOnChannelsListReady(): React.ReactNode {
    const { isChannelsListReady, isChannelsListClosed } = this.state;
    const { renderOnChannelsListReady } = this.props;

    if (renderOnChannelsListReady && isChannelsListReady && !isChannelsListClosed) {
      return renderOnChannelsListReady();
    }
    return null;
  }

  protected _renderChannelDescription(
    channelDescription: ISwarmMessageChannelDescriptionRaw<P, T, any, any>
  ): React.ReactElement {
    const { updateChannelDescription, onChoseSwarmChannel } = this.props;
    return (
      <div>
        {onChoseSwarmChannel ? <button onClick={() => onChoseSwarmChannel(channelDescription)}>Open</button> : null}
        <SwarmChannelDescriptionComponent
          showEditButton
          channelDescription={channelDescription}
          updateChannelDescription={updateChannelDescription}
        />
      </div>
    );
  }

  protected _renderChannelDescriptionError(channelDescriptionError: Error): React.ReactElement {
    return <>Error: {channelDescriptionError.message}</>;
  }

  protected _renderChannelDescriptionOrError(
    channelDescription: ISwarmMessageChannelDescriptionRaw<P, T, any, any> | Error,
    channelId: TSwarmMessagesChannelId
  ): React.ReactElement {
    const channelDescriptionLayout =
      channelDescription instanceof Error
        ? this._renderChannelDescriptionError(channelDescription)
        : this._renderChannelDescription(channelDescription);

    return (
      <div key={channelId}>
        Channel {channelId}:<br />
        {channelDescriptionLayout}
      </div>
    );
  }

  protected _renderChannelsDescriptions(): React.ReactElement {
    const { channelsDescriptions } = this.state;
    // eslint-disable-next-line @typescript-eslint/unbound-method
    return (
      <div>
        {[...channelsDescriptions.entries()].map(([channelId, channelDescriptionOrError]) =>
          this._renderChannelDescriptionOrError(channelDescriptionOrError, channelId)
        )}
      </div>
    );
  }

  protected renderChannelsDescriptionsCachedInChannelsListInstance(): React.ReactElement {
    const channelsDescriptionsMapCached = (this.state as any).channelsListCached as
      | Readonly<Map<TSwarmMessagesChannelId, ISwarmMessageChannelDescriptionRaw<P, T, any, any> | Error>>
      | undefined;

    if (!channelsDescriptionsMapCached) {
      return <p>No channels in cached list</p>;
    }
    return (
      <div>
        {[...channelsDescriptionsMapCached.entries()].map(([channelId, channelDescription]) => {
          if (channelDescription instanceof Error) {
            return (
              <p>
                Failed to load a channel with id {channelId} because of the error ${channelDescription.message}{' '}
              </p>
            );
          }
          return this._renderChannelDescriptionOrError(channelDescription, channelId);
        })}
      </div>
    );
  }

  protected _getHandledChannelsList(): ISwarmMessagesChannelsDescriptionsList<P, T, MD> {
    const { channelsListInatance: channelsList } = this.state;
    if (!channelsList) {
      throw new Error('Channels list is not exists in the component state');
    }
    return channelsList as unknown as ISwarmMessagesChannelsDescriptionsList<P, T, MD>;
  }

  protected _setCurrentChannelsListByProps(): void {
    const { channelsList } = this.props;

    if (!channelsList) {
      throw new Error('There is no active instance of swarm messages channels list');
    }
    this.setState({
      channelsListInatance: channelsList,
      isChannelsListReady: channelsList.isReady,
      channelsDescriptions: cloneMap(channelsList.swarmChannelsDescriptionsCachedMap),
    });
  }

  protected _addChannelDescriptionInMap(
    channelDescriptionRawOrError: ISwarmMessageChannelDescriptionRaw<P, T, any, any> | Error,
    channelsDescriptionsMap: Map<TSwarmMessagesChannelId, ISwarmMessageChannelDescriptionRaw<P, T, any, any> | Error>
  ): void {
    if (channelDescriptionRawOrError instanceof Error) {
      throw channelDescriptionRawOrError;
    }
    channelsDescriptionsMap.set(channelDescriptionRawOrError.id, channelDescriptionRawOrError);
  }

  protected _createCopyOfExistisngChannelsDescriptionsMap(): Map<
    TSwarmMessagesChannelId,
    ISwarmMessageChannelDescriptionRaw<P, T, any, any> | Error
  > {
    return cloneMap(this.state.channelsDescriptions);
  }

  protected _setChannelsDescriptions(
    channelsDescriptions: Map<TSwarmMessagesChannelId, ISwarmMessageChannelDescriptionRaw<P, T, any, any> | Error>
  ): void {
    this.setState({
      channelsDescriptions,
    });
  }

  protected _updateChannelDescriptionInDescriptionsList(
    channelDescriptionRaw: ISwarmMessageChannelDescriptionRaw<P, T, any, any>
  ): void {
    const copyOfChannelsList = this._createCopyOfExistisngChannelsDescriptionsMap();
    this._addChannelDescriptionInMap(channelDescriptionRaw, copyOfChannelsList);
    this._setChannelsDescriptions(copyOfChannelsList);
  }

  protected _updateChannelsDescriptionsMapByDescriptionsRawArray(
    channelsDescriptionsRaw: ISwarmMessageChannelDescriptionRaw<P, T, any, any>[],
    channelsDescriptionsMap: Map<TSwarmMessagesChannelId, ISwarmMessageChannelDescriptionRaw<P, T, any, any>>
  ): void {
    channelsDescriptionsRaw.forEach((channelDescription) =>
      this._addChannelDescriptionInMap(channelDescription, channelsDescriptionsMap)
    );
  }

  protected _setErrorsList(errorsList: Error[]): void {
    this.setState({
      errorsList,
    });
  }

  protected _addErrorsIntoTheErrorsList(errors: Error[]): void {
    const errorsListCopy = [...this.state.errorsList];
    errorsListCopy.push(...errors);
    this._setErrorsList(errorsListCopy);
  }

  protected _updateChannelsDescriptionsMapByDescriptionsWithMetaArray(
    channelsDescriptionsWithMeta: ISwarmMessagesChannelDescriptionWithMetadata<P, T, MD, any, any>[],
    channelsDescriptionsMap: Map<TSwarmMessagesChannelId, ISwarmMessageChannelDescriptionRaw<P, T, any, any> | Error>
  ): void {
    const errorsOccuredTillUpdating = [] as Error[];
    channelsDescriptionsWithMeta.forEach((channelDescriptionWithMeta): void => {
      const { channelDescription } = channelDescriptionWithMeta;

      try {
        this._addChannelDescriptionInMap(channelDescription, channelsDescriptionsMap);
      } catch (err) {
        const { messageAddress, key } = channelDescriptionWithMeta;
        errorsOccuredTillUpdating.push(
          new Error(
            `The error occurred for a channel description under the key "${key}" and message address ${messageAddress}: ${err.message}`
          )
        );
      }
    });
    this._addErrorsIntoTheErrorsList(errorsOccuredTillUpdating);
  }

  protected async _updateChannelsDescriptionsInState() {
    const channelsList = this._getHandledChannelsList();
    const channelsDescriptions = await channelsList.getAllChannelsDescriptions();
    const existingChannelsDescriptionsMapCopy = this._createCopyOfExistisngChannelsDescriptionsMap();

    this._updateChannelsDescriptionsMapByDescriptionsWithMetaArray(channelsDescriptions, existingChannelsDescriptionsMapCopy);
    this._setChannelsDescriptions(existingChannelsDescriptionsMapCopy);
  }

  protected _removeChannelIdFromTheList(
    channelId: TSwarmMessagesChannelId,
    channelsDescriptionsMap: Map<TSwarmMessagesChannelId, ISwarmMessageChannelDescriptionRaw<P, T, any, any> | Error>
  ): void {
    channelsDescriptionsMap.delete(channelId);
  }

  protected _removeChannelDescriptionFromTheListById(channelId: TSwarmMessagesChannelId): void {
    const existingChannelsDescriptionsMapCopy = this._createCopyOfExistisngChannelsDescriptionsMap();
    this._removeChannelIdFromTheList(channelId, existingChannelsDescriptionsMapCopy);
    this._setChannelsDescriptions(existingChannelsDescriptionsMapCopy);
  }

  protected _onChannelDescriptionUpdate(
    channelDescriptionUpdatadOrNew: ISwarmMessageChannelDescriptionRaw<P, T, any, any>
  ): void {
    this._updateChannelDescriptionInDescriptionsList(channelDescriptionUpdatadOrNew);
  }

  protected _onChannelDescriptionRemoved(channelRemovedId: TSwarmMessagesChannelId): void {
    console.log('_onChannelDescriptionRemoved', channelRemovedId);
    this._removeChannelDescriptionFromTheListById(channelRemovedId);
  }

  protected _onChannelsListClosed(): void {
    this.setState({
      isChannelsListReady: false,
      isChannelsListClosed: true,
    });
  }

  protected async _onChannelsListReady(): Promise<void> {
    this.setState({
      isChannelsListReady: true,
      isChannelsListClosed: false,
    });
    try {
      if (process.env.NODE_ENV === 'development') debugger;
      void (await this._updateChannelsDescriptionsInState());
    } catch (err) {
      this._addErrorsIntoTheErrorsList([
        new Error(`onChannelsListReady: failed to update channels descriptions: ${err.message}`),
      ]);
    }
  }

  protected _onChannelsListCachedUpdated(
    channelsListCached: Readonly<Map<TSwarmMessagesChannelId, ISwarmMessageChannelDescriptionRaw<P, T, any, any> | Error>>
  ): void {
    console.log('_onChannelsListCachedUpdated');
    console.dir([...channelsListCached.values()].map((v) => ({ ...v })));
    console.trace();
    this.setState({
      channelsListCached,
    } as any);
  }

  protected _setChannelsListEventsListeners(): void {
    this.__setOrUnsetChannelsListEventsListeners('addListener');
  }

  protected _unsetChannelsListEventsListeners(): void {
    this.__setOrUnsetChannelsListEventsListeners('removeListener');
  }

  private __setOrUnsetChannelsListEventsListeners(operation: 'addListener' | 'removeListener'): void {
    const channelsList = this._getHandledChannelsList();
    const channelsListEmitter = channelsList.emitter;

    // TODO - seems channel events are not emitted

    channelsListEmitter[operation as 'addListener'](
      ESwarmMessagesChannelsListEventName.CHANNEL_DESCRIPTION_UPDATE,
      // eslint-disable-next-line @typescript-eslint/unbound-method
      this._onChannelDescriptionUpdate
    );
    channelsListEmitter[operation as 'addListener'](
      ESwarmMessagesChannelsListEventName.CHANNEL_DESCRIPTION_REMOVED,
      // eslint-disable-next-line @typescript-eslint/unbound-method
      this._onChannelDescriptionRemoved
    );
    channelsListEmitter[operation as 'addListener'](
      ESwarmMessagesChannelsListEventName.CHANNELS_LIST_READY,
      // eslint-disable-next-line @typescript-eslint/unbound-method
      this._onChannelsListReady
    );
    channelsListEmitter[operation as 'addListener'](
      ESwarmMessagesChannelsListEventName.CHANNELS_LIST_CLOSED,
      // eslint-disable-next-line @typescript-eslint/unbound-method
      this._onChannelsListClosed
    );
    channelsListEmitter[operation as 'addListener'](
      ESwarmMessagesChannelsListEventName.CHANNELS_CACHE_UPDATED,
      // eslint-disable-next-line @typescript-eslint/unbound-method
      this._onChannelsListCachedUpdated
    );
  }
}
