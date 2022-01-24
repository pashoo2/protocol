import { ISwarmMessageInstanceDecrypted, TSwarmMessageSerialized } from 'classes/swarm-message';
import {
  ISwarmMessagesChannelsListDescription,
  TSwarmMessagesChannelsListDbType,
  TSwarmMessagesChannelsListDBOWithGrantAccess,
} from 'classes/swarm-messages-channels';
import { ESwarmChannelsListVersion } from 'classes/swarm-messages-channels/swarm-messages-channels-classes/const/swarm-messages-channels-list-classes-params.const';
import { TSwarmStoreDatabaseOptions } from 'classes/swarm-store-class';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connectors.types';
import { CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT } from './configuration-database.const';

export const CONFIGURATION_DEFAULT_SWARM_CHANNELS_LIST_OPTIONS: ISwarmMessagesChannelsListDescription = {
  version: ESwarmChannelsListVersion.FIRST,
  id: '',
  name: 'channelsListName',
};

export const CONFIGURATION_DEFAULT_SWARM_CHANNELS_LIST_DATABASE_OPTIONS: TSwarmMessagesChannelsListDBOWithGrantAccess<
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
  grantAccess: function grantAccess(_arg: unknown): Promise<boolean> {
    return Promise.resolve(true);
  },
};
