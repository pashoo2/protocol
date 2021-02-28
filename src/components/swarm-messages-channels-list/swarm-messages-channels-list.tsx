import React from 'react';
import { ESwarmStoreConnector } from '../../classes/swarm-store-class/swarm-store-class.const';
import {
  TSwarmMessageSerialized,
  ISwarmMessageInstanceDecrypted,
} from '../../classes/swarm-message/swarm-message-constructor.types';
import { ISwarmMessagesChannelsDescriptionsList } from '../../classes/swarm-messages-channels/types/swarm-messages-channels-list-instance.types';
import { ISwarmMessageChannelDescriptionRaw } from '../../classes/swarm-messages-channels/types/swarm-messages-channel-instance.types';
import { TSwarmMessagesChannelId } from '../../classes/swarm-messages-channels/types/swarm-messages-channel-instance.types';
import { SwarmMessagesChannelsListComponentBase } from './swarm-messages-channels-list-base-component';

export interface ISwarmMessagesChannelsListProps<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted
> {
  channelsList: ISwarmMessagesChannelsDescriptionsList<P, T, MD>;
}

export interface ISwarmMessagesChannelsListState<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted
> {
  channelsList: ISwarmMessagesChannelsDescriptionsList<P, T, MD> | undefined;
  isChannelsListReady: boolean;
  isChannelsListClosed: boolean;
  channelsDescriptions: Map<TSwarmMessagesChannelId, ISwarmMessageChannelDescriptionRaw<P, T, any, any>>;
  errorsList: Error[];
}

export class SwarmMessagesChannelsListComponent<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted,
  STATE extends ISwarmMessagesChannelsListState<P, T, MD> = ISwarmMessagesChannelsListState<P, T, MD>
> extends SwarmMessagesChannelsListComponentBase<P, T, MD, STATE> {}
