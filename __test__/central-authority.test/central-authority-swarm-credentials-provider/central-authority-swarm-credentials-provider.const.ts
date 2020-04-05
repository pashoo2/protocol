import { decodeFromFirebaseKey } from 'utils/firebase-utils/firebase-utils';
export const CA_SWARM_CREDENTIALS_PROVIDER_TEST_OPTIONS = {
  connections: {},
  storageDb: 'test',
};

// TODO - this user must be exists in a swarm auth providers the pool is connected to
export const CA_SWARM_CREDENTIALS_PROVIDER_TEST_USERIDENTITY = decodeFromFirebaseKey(
  `02https://watcha3-191815.firebaseio.com|0skX1iXT0rQCl5FxGzISu9dUPg23`
);

export const CA_SWARM_CREDENTIALS_PROVIDER_TEST_USERIDENTITY_SECOND = decodeFromFirebaseKey(
  `02https:*_S%ë5nN*_S%ë5nNwatcha3-191815_P%ë5nN*firebaseio_P%ë5nN*com|rvKDri3CuySnPSmdIur0UFIrkwl2`
);
