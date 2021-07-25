import { ISwarmMessageInstanceDecrypted, TSwarmMessageSerialized } from 'classes/swarm-message';
import {
  ISwarmMessagesChannelsListDescription,
  TSwarmMessagesChannelsListDbType,
  TSwrmMessagesChannelsListDBOWithGrantAccess,
} from 'classes/swarm-messages-channels';
import { SWARM_CHANNELS_LIST_VERSION } from 'classes/swarm-messages-channels/swarm-messages-channels-classes/const/swarm-messages-channels-list-classes-params.const';
import { TSwarmStoreDatabaseOptions } from 'classes/swarm-store-class';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT } from './configuration-database.const';

export const CONFIGURATION_DEFAULT_SWARM_CHANNELS_LIST_OPTIONS: ISwarmMessagesChannelsListDescription = {
  version: SWARM_CHANNELS_LIST_VERSION.FIRST,
  id: '',
  name: 'channelsListName',
};

export const CONFIGURATION_DEFAULT_SWARM_CHANNELS_LIST_DATABASE_OPTIONS: TSwrmMessagesChannelsListDBOWithGrantAccess<
  typeof CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT,
  TSwarmMessageSerialized,
  ISwarmMessageInstanceDecrypted,
  ISwarmStoreDBOGrandAccessCallbackBaseContext,
  TSwarmStoreDatabaseOptions<
    typeof CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT,
    TSwarmMessageSerialized,
    TSwarmMessagesChannelsListDbType
  >
> = {
  isPublic: true,
  /* 
        TODO - to make it a private you should add "write: ['userAllowedToWrite1', ..., 'userAllowedToWriteN']", 
    */
  grantAccess: function grantAccess(): Promise<boolean> {
    return Promise.resolve(true);
  },
};
