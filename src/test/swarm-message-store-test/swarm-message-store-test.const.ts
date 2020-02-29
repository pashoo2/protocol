import { ISwarmMessageStoreOptions } from '../../classes/swarm-message-store/swarm-message-store.types';
import { ESwarmStoreConnector } from '../../classes/swarm-store-class/swarm-store-class.const';

const SWARM_MESSAGE_STORE_TEST_OPTIONS_CREDENTIALS: ISwarmMessageStoreOptions<
  ESwarmStoreConnector.OrbitDB
>['credentials'] = {
  login: 'test_login',
  password: 'test_password_123456',
};

const SWARM_MESSAGE_STORE_TEST_OPTIONS_DATABASES: ISwarmMessageStoreOptions<
  ESwarmStoreConnector.OrbitDB
>['databases'] = [
  {
    dbName: 'database_test',
  },
];

export const SWARM_MESSAGE_STORE_TEST_OPTIONS_VALID: Omit<
  Omit<ISwarmMessageStoreOptions<ESwarmStoreConnector.OrbitDB>, 'userId'>,
  'messageConstructors'
> = {
  credentials: SWARM_MESSAGE_STORE_TEST_OPTIONS_CREDENTIALS,
  databases: SWARM_MESSAGE_STORE_TEST_OPTIONS_DATABASES,
  directory: 'dir',
  provider: ESwarmStoreConnector.OrbitDB,
  providerConnectionOptions: {},
};
