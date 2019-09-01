import CAConnectionWithFirebaseUtilDatabase from 'classes/central-authority-class/central-authority-connections/central-authority-connection-firebase/central-authority-connection-firebase-utils/central-authority-connection-firebase-utils.database/central-authority-connection-firebase-utils.database';
import { connectWithFirebase } from './central-authority-connection.test.firebase.utils';
import { CA_CONNECTION_FIREBASE_UTILS_STORAGE_CREDENTIALS_KEY_PREFIX } from 'classes/central-authority-class/central-authority-connections/central-authority-connection-firebase/central-authority-connection-firebase-utils/central-authority-connection-firebase-utils.credentials-storage/central-authority-connection-firebase-utils.credentials-storage.const';
import { generateUUID } from 'utils/identity-utils/identity-utils';

export const runTestFirebaseConnectionDatabase = async () => {
  console.warn('runTestFirebaseConnectionDatabase::start');

  const firebaseConnection = await connectWithFirebase();
  debugger;
  if (firebaseConnection instanceof Error) {
    console.error(firebaseConnection);
    return new Error('Failed to connect with firebase');
  }

  const databaseConnectionToFirebase = new CAConnectionWithFirebaseUtilDatabase();

  if (databaseConnectionToFirebase.isConnected) {
    console.error('Database connection flag must be false');
    return;
  }

  const connectionResult = await databaseConnectionToFirebase.connect();

  if (connectionResult instanceof Error) {
    console.error(connectionResult);
    console.error('Failed to connect to the database server');
    return;
  }
  if (!databaseConnectionToFirebase.isConnected) {
    console.error(
      'Database connection flag must be true after connection method returns a success result'
    );
    return;
  }
  debugger;
  const randomUUID = generateUUID();
  const testKey = `${CA_CONNECTION_FIREBASE_UTILS_STORAGE_CREDENTIALS_KEY_PREFIX}${randomUUID}`;
  const testData = {
    testData: 'testData',
  };
  const setValueResult = await databaseConnectionToFirebase.setValue(
    testKey,
    testData
  );

  if (setValueResult instanceof Error) {
    console.error(setValueResult);
    return setValueResult;
  }
  debugger;
  const readValueResult = await databaseConnectionToFirebase.getValue(testKey);
  debugger;
  if (readValueResult instanceof Error) {
    console.error(readValueResult);
    console.error('Failed to read a data from the database');
    return;
  }
  if (!readValueResult || typeof readValueResult !== 'object') {
    console.error('Value is empty or have a wrong format');
    return;
  }
  if ((readValueResult as any).testData !== testData.testData) {
    console.error(
      'The data read from the Firebase Realtime Database have a wrong format'
    );
    return;
  }
  console.warn('runTestFirebaseConnectionDatabase::success');
};
