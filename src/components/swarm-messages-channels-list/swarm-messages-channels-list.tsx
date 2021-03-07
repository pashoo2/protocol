import React from 'react';
import { ESwarmStoreConnector } from '../../classes/swarm-store-class/swarm-store-class.const';
import {
  TSwarmMessageSerialized,
  ISwarmMessageInstanceDecrypted,
} from '../../classes/swarm-message/swarm-message-constructor.types';
import { SwarmMessagesChannelsListComponentBase } from './swarm-messages-channels-list-base-component';

export class SwarmMessagesChannelsListComponent<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted
> extends SwarmMessagesChannelsListComponentBase<P, T, MD> {}
