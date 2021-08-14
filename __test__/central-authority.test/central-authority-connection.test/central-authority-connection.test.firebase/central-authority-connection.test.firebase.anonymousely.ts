import {
  CA_CONNECTION_FIREBASE_CONFIG,
  CA_CONNECTION_FIREBASE_CONFIG_WATCHA3,
} from './central-authority-connection.test.firebase.const';
import CAConnectionWithFirebase from 'classes/central-authority-class/central-authority-connections/central-authority-connection-firebase';
import { CA_CONNECTION_STATUS } from 'classes/central-authority-class/central-authority-connections/central-authority-connections-const/central-authority-connections-const';
import { connectWithFirebase } from './central-authority-connection.utils.firebase';
import { compareCryptoCredentials } from 'classes/central-authority-class/central-authority-utils-common/central-authority-utils-crypto-credentials/central-authority-utils-crypto-credentials';

const connectToFirebaseAnonymously = async (
  firebaseParams: typeof CA_CONNECTION_FIREBASE_CONFIG = CA_CONNECTION_FIREBASE_CONFIG
): Promise<Error | CAConnectionWithFirebase> => {
  const connectionFirebase = new CAConnectionWithFirebase();
  const connectionResult = await connectionFirebase.connect(firebaseParams);

  if (connectionResult instanceof Error) {
    console.error(connectionResult);
    return new Error('Failed connection to the firebase app account');
  }
  if (connectionFirebase.status !== CA_CONNECTION_STATUS.CONNECTED) {
    return new Error('CONNECTED status must be set on connection succeed');
  }
  return connectionFirebase;
};

export const runTestForFirebaseConfig = async (
  firebaseParams: typeof CA_CONNECTION_FIREBASE_CONFIG = CA_CONNECTION_FIREBASE_CONFIG
) => {
  console.warn('test runTestConnectToFirebaseAnonymously is started');
  const connectionToFirebase = await connectWithFirebase(
    {
      login: 'yaxida4519@email1.pro',
      password: '123456',
    },
    firebaseParams
  );

  if (connectionToFirebase instanceof Error) {
    return connectionToFirebase;
  }

  const userCryptoCredentials = connectionToFirebase.cryptoCredentials;
  const disconnectResult = await connectionToFirebase.disconnect();

  if (!userCryptoCredentials) {
    return new Error('The user crypto credentials are empty');
  }
  if (disconnectResult instanceof Error) {
    return disconnectResult;
  }

  const connectAnonymously = await connectToFirebaseAnonymously(firebaseParams);

  if (connectAnonymously instanceof Error) {
    return connectAnonymously;
  }

  const userCredentials = await connectAnonymously.getUserCredentials(userCryptoCredentials.userIdentity);

  if (userCredentials instanceof Error) {
    return userCredentials;
  }
  if (!userCredentials) {
    return new Error('User crypto credentials must be returned even if the user is not authorized');
  }
  if (!compareCryptoCredentials(userCryptoCredentials, userCredentials)) {
    return new Error('User crypto credentials must be the same with the credentials when the user is authorized');
  }

  const anonymouslyDisconnect = await connectAnonymously.disconnect();

  if (anonymouslyDisconnect instanceof Error) {
    return anonymouslyDisconnect;
  }
};

export const runTestConnectToFirebaseAnonymously = async () => {
  const resTestFirebaseV1 = await runTestForFirebaseConfig(CA_CONNECTION_FIREBASE_CONFIG);

  if (resTestFirebaseV1 instanceof Error) {
    return resTestFirebaseV1;
  }

  const resTestFirebaseV2 = await runTestForFirebaseConfig(CA_CONNECTION_FIREBASE_CONFIG_WATCHA3);

  if (resTestFirebaseV2 instanceof Error) {
    return resTestFirebaseV2;
  }

  console.warn('test runTestConnectToFirebaseAnonymously was succeed');
};
