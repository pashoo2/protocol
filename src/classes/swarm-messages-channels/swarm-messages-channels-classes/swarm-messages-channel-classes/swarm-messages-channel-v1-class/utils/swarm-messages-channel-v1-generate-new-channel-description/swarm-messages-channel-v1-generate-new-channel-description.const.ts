import { TSwarmMessageChannelDatabaseOptions } from './../../../../../types/swarm-messages-channel-instance.types';
import { SWARM_MESSAGES_CHANNEL_VERSION } from './../../../../const/swarm-messages-channel-classes-params.const';
import { TSwarmStoreDatabaseOptions } from 'classes/swarm-store-class/index';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from './../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { TSwarmMessageSerialized } from 'classes/swarm-message/swarm-message-constructor.types';
import { ESwarmStoreConnector } from 'classes/swarm-store-class/swarm-store-class.const';
import { ISwarmMessageChannelDescriptionRaw } from 'classes/swarm-messages-channels/types/swarm-messages-channel-instance.types';
import { SWARM_MESSAGES_CHANNEL_ENCRYPTION } from 'classes/swarm-messages-channels/const/swarm-messages-channels-main.const';

export const SWARM_MESSAGES_CHANNEL_V1_GENERATE_NEW_PUBLIC_KEY_VALUE_CHANNEL_DESCRIPTION_DATABASE_OPTIONS_STUB: TSwarmMessageChannelDatabaseOptions<
  ESwarmStoreConnector.OrbitDB,
  TSwarmMessageSerialized,
  ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE,
  TSwarmStoreDatabaseOptions<
    ESwarmStoreConnector.OrbitDB,
    TSwarmMessageSerialized,
    ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
  >
> = {
  isPublic: true,
  write: [],
  // eslint-disable-next-line @typescript-eslint/require-await
  grantAccess: async function grantAccess() {
    return true;
  },
};

export const SWARM_MESSAGES_CHANNEL_V1_GENERATE_NEW_PUBLIC_KEY_VALUE_CHANNEL_DESCRIPTION_STUB: ISwarmMessageChannelDescriptionRaw<
  ESwarmStoreConnector.OrbitDB,
  TSwarmMessageSerialized,
  ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE,
  TSwarmStoreDatabaseOptions<
    ESwarmStoreConnector.OrbitDB,
    TSwarmMessageSerialized,
    ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
  >
> = {
  id: '',
  version: SWARM_MESSAGES_CHANNEL_VERSION.FIRST,
  name: '',
  description: '',
  tags: ['TestChannel'],
  dbType: ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE,
  messageEncryption: SWARM_MESSAGES_CHANNEL_ENCRYPTION.PUBLIC,
  admins: [],
  dbOptions: SWARM_MESSAGES_CHANNEL_V1_GENERATE_NEW_PUBLIC_KEY_VALUE_CHANNEL_DESCRIPTION_DATABASE_OPTIONS_STUB,
};
