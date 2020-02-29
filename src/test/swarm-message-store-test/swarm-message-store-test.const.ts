import { ISwarmMessageStoreOptions } from '../../classes/swarm-message-store/swarm-message-store.types';
import { ESwarmStoreConnector } from '../../classes/swarm-store-class/swarm-store-class.const';

const SWARM_MESSAGE_STORE_TEST_OPTIONS_CREDENTIALS: ISwarmMessageStoreOptions<
  ESwarmStoreConnector.OrbitDB
>['credentials'] = {};

const SWARM_MESSAGE_STORE_TEST_OPTIONS_DATABASES: ISwarmMessageStoreOptions<
  ESwarmStoreConnector.OrbitDB
>['databases'] = {};

const SWARM_MESSAGE_STORE_TEST_OPTIONS_MESSAGE_CONSTRUCTORS: ISwarmMessageStoreOptions<
  ESwarmStoreConnector.OrbitDB
>['messageConstructors'] = {};

export const SWARM_MESSAGE_STORE_TEST_OPTIONS_VALID: ISwarmMessageStoreOptions<ESwarmStoreConnector.OrbitDB> = {
  credentials: SWARM_MESSAGE_STORE_TEST_OPTIONS_CREDENTIALS,
  databases: SWARM_MESSAGE_STORE_TEST_OPTIONS_DATABASES,
  directory: 'dir',
  messageConstructors: SWARM_MESSAGE_STORE_TEST_OPTIONS_MESSAGE_CONSTRUCTORS,
  provider: ESwarmStoreConnector.OrbitDB,
};
