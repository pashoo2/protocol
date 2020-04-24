import { ESwarmStoreConnector } from 'classes/swarm-store-class/swarm-store-class.const';
import { ISwarmMessageBodyDeserialized } from '../../classes/swarm-message/swarm-message-constructor.types';

export const CONNECT_TO_SWARM_AUTH_CREDENTIALS_SESSION_STORAGE_KEY = 'key';

export const CONNECT_TO_SWARM_STORAGE_DEFAULT_MESSAGE_BODY: ISwarmMessageBodyDeserialized = {
  iss: 'test connection',
  typ: 1,
  pld: 'Hello',
  ts: 0,
};

export const CONNECT_TO_SWARM_AUTH_CREDENTIALS_1 = {
  login: 'lewey74533@provamail.com',
  password: 'qawsde1234',
};

export const CONNECT_TO_SWARM_AUTH_CREDENTIALS_USEDID_1 =
  '02https://watcha3-191815.firebaseio.com|nRCitpXVIwXsDPciNAovIP6I2hr1';

export const CONNECT_TO_SWARM_AUTH_CREDENTIALS_2 = {
  login: 'bopekar178@johnderasia.com',
  password: 'sdfwmfgjk12kH',
};

export const CONNECT_TO_SWARM_AUTH_CREDENTIALS_USEDID_2 =
  '02https://watcha3-191815.firebaseio.com|LS3zLYp9PFR4877Zes1IfawKIVN2';

export enum CONNECT_TO_SWARM_AUTH_PROVIDERS {
  FIREBASE_WATCHA = 'https://watcha3-191815.firebaseio.com',
  FIREBASE_PRTOCOL = 'https://protocol-f251b.firebaseio.com',
}

export const CONNECT_TO_SWARM_STORAGE_PROVIDER_DEFAULT =
  ESwarmStoreConnector.OrbitDB;

const CONNECT_TO_SWARM_DATABASE_PREFIX = 'chat/test';

export const CONNECT_TO_SWARM_DATABASE_MAIN_NAME = `${CONNECT_TO_SWARM_DATABASE_PREFIX}/database_main`;

export const CONNECT_TO_SWARM_DATABASE_MAIN = {
  dbName: CONNECT_TO_SWARM_DATABASE_MAIN_NAME,
  isPublic: true,
};

export const CONNECT_TO_SWARM_DATABASES_DEFAULT = [
  CONNECT_TO_SWARM_DATABASE_MAIN,
];

export const CONNECT_TO_SWARM_CONNECTION_OPTIONS = {
  storage: {
    provider: CONNECT_TO_SWARM_STORAGE_PROVIDER_DEFAULT,
    directory: CONNECT_TO_SWARM_DATABASE_PREFIX,
    databases: CONNECT_TO_SWARM_DATABASES_DEFAULT,
  },
  user: {
    profile: {},
  },
  auth: {
    providerUrl: CONNECT_TO_SWARM_AUTH_PROVIDERS.FIREBASE_WATCHA,
    // use session persistanse
    session: {},
  },
};
