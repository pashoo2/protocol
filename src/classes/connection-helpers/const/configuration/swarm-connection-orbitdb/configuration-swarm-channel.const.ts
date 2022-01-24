import { CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT } from 'classes/connection-helpers/const/configuration/swarm-connection-orbitdb/configuration-database.const';
import { TSwarmMessageSerialized } from 'classes/swarm-message';
import { ISwarmMessageChannelDescriptionRaw } from 'classes/swarm-messages-channels';
import { SWARM_MESSAGES_CHANNEL_ENCRYPTION } from 'classes/swarm-messages-channels/const/swarm-messages-channels-main.const';
import { SWARM_MESSAGES_CHANNEL_VERSION } from 'classes/swarm-messages-channels/swarm-messages-channels-classes/const/swarm-messages-channel-classes-params.const';
import { ESwarmStoreConnectorOrbitDbDatabaseType, TSwarmStoreDatabaseOptions } from 'classes/swarm-store-class';

export const CONFIGURATION_DEFAULT_SWARM_CHANNEL_OPTIONS: ISwarmMessageChannelDescriptionRaw<
  typeof CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT,
  TSwarmMessageSerialized,
  ESwarmStoreConnectorOrbitDbDatabaseType.FEED,
  TSwarmStoreDatabaseOptions<
    typeof CONFIGURATION_DEFAULT_DATABASE_CONNECTOR_DEFAULT,
    TSwarmMessageSerialized,
    ESwarmStoreConnectorOrbitDbDatabaseType.FEED
  >
> = {
  id: '',
  dbType: ESwarmStoreConnectorOrbitDbDatabaseType.FEED,
  version: SWARM_MESSAGES_CHANNEL_VERSION.FIRST,
  tags: [],
  name: '',
  admins: [],
  description: 'This is a swarm channel for test purposes',
  messageEncryption: SWARM_MESSAGES_CHANNEL_ENCRYPTION.PUBLIC,
  dbOptions: {
    write: [],
    grantAccess: function grantAccess(_arg: unknown): Promise<boolean> {
      return Promise.resolve(true);
    },
  },
};
