import { CAConnectionFirestoreUtilsCredentialsStrorage } from 'classes/central-authority-class/central-authority-connections/central-authority-connection-firebase/central-authority-connection-firebase-utils/central-authority-connection-firebase-utils.credentials-storage/central-authority-connection-firebase-utils.credentials-storage';
import { connectWithFirebase } from './central-authority-connection.test.firebase.utils';
import { generateCryptoCredentialsV1 } from 'classes/central-authority-class/central-authority-utils-common/central-authority-util-crypto-keys/central-authority-util-crypto-keys';
import {
  getUserIdentityByCryptoCredentials,
  compareCryptoCredentials,
} from 'classes/central-authority-class/central-authority-utils-common/central-authority-utils-crypto-credentials/central-authority-utils-crypto-credentials';

export const runTestFirebaseCredentialsStorage = async () => {
  console.warn('runTestFirebaseCredentialsStorage::start');
  const firebaseConnection = await connectWithFirebase();

  if (firebaseConnection instanceof Error) {
    console.error(firebaseConnection);
    return new Error('Failed to connect with firebase');
  }

  const credetntialsStoreConnectionToFirebase = new CAConnectionFirestoreUtilsCredentialsStrorage(
    firebaseConnection
  );

  if (credetntialsStoreConnectionToFirebase.isConnected) {
    console.error('Database connection flag must be false');
    return;
  }

  const connectionResult = await credetntialsStoreConnectionToFirebase.connect();

  if (connectionResult instanceof Error) {
    console.error(connectionResult);
    console.error('Failed to connect to the database server');
    return;
  }
  if (!credetntialsStoreConnectionToFirebase.isConnected) {
    console.error(
      'Database connection flag must be true after connection method returns a success result'
    );
    return;
  }

  const credentialsForUser = await credetntialsStoreConnectionToFirebase.getCredentialsForTheCurrentUser();

  if (credentialsForUser instanceof Error) {
    console.error(credentialsForUser);
    console.error('Failed to get credentials for the current user');
    return;
  }
  if (!credentialsForUser) {
    console.error('Credentials for the user must be auto generated on sign up');
    return;
  }

  const credentials = await generateCryptoCredentialsV1();

  if (credentials instanceof Error) {
    console.error('Failed to generate crypto credentials');
    return;
  }

  const setCredentialsResult = await credetntialsStoreConnectionToFirebase.setUserCredentials(
    credentials
  );

  if (setCredentialsResult instanceof Error) {
    console.error(setCredentialsResult);
    console.error('Failed to set credentials');
    return;
  }
  if (
    (await compareCryptoCredentials(
      setCredentialsResult,
      credentialsForUser
    )) !== true
  ) {
    console.error(
      'Credentials for the user created and stored once must be immputable anyway'
    );
    return;
  }

  const userId = getUserIdentityByCryptoCredentials(setCredentialsResult);

  if (userId instanceof Error) {
    console.error(userId);
    console.error('Failed to get user id by crypto credentials');
    return;
  }

  const getCredentialsResult = await credetntialsStoreConnectionToFirebase.getUserCredentials(
    userId
  );

  if (!getCredentialsResult) {
    console.error(
      'There is no credentials stored before was found in the Firebsae database'
    );
    return;
  }
  if (getCredentialsResult instanceof Error) {
    console.error('Failed to read credentials from the Firebase database');
    return;
  }
  if (
    (await compareCryptoCredentials(
      setCredentialsResult,
      credentialsForUser
    )) !== true
  ) {
    console.error(
      'Credentials for the user got by the user id must be immputable the same as the credentials set by the user on sign up flow'
    );
    return;
  }
  console.warn('runTestFirebaseCredentialsStorage::success');
};
