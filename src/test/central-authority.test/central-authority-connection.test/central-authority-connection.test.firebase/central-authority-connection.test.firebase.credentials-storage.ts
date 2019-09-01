import { CAConnectionFirestoreUtilsCredentialsStrorage } from 'classes/central-authority-class/central-authority-connections/central-authority-connection-firebase/central-authority-connection-firebase-utils/central-authority-connection-firebase-utils.credentials-storage/central-authority-connection-firebase-utils.credentials-storage';
import { connectWithFirebase } from './central-authority-connection.test.firebase.utils';
import { generateCryptoCredentials } from 'classes/central-authority-class/central-authority-utils-common/central-authority-util-crypto-keys/central-authority-util-crypto-keys';

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

  const credentials = await generateCryptoCredentials();

  if (credentials instanceof Error) {
    console.error('Failed to generate crypto credentials');
    return;
  }
  debugger;
  const setCredentialsResult = await credetntialsStoreConnectionToFirebase.setUserCredentials(
    credentials
  );

  if (setCredentialsResult instanceof Error) {
    console.error(setCredentialsResult);
    console.error('Failed to set credentials');
    return;
  }
  debugger;
  console.warn('runTestFirebaseCredentialsStorage::success');
};
