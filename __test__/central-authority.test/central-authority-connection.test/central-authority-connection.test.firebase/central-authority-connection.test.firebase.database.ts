/* eslint-disable @typescript-eslint/no-explicit-any */
import CAConnectionWithFirebaseUtilDatabase from 'classes/central-authority-class/central-authority-connections/central-authority-connection-firebase/central-authority-connection-firebase-utils/central-authority-connection-firebase-utils.database/central-authority-connection-firebase-utils.database';
import { connectWithFirebase } from './central-authority-connection.utils.firebase';
import { CA_CONNECTION_FIREBASE_UTILS_STORAGE_CREDENTIALS_KEY_PREFIX } from 'classes/central-authority-class/central-authority-connections/central-authority-connection-firebase/central-authority-connection-firebase-utils/central-authority-connection-firebase-utils.credentials-storage/central-authority-connection-firebase-utils.credentials-storage.const';
import { generateUUID } from 'utils/identity-utils/identity-utils';

const connectToFirebase = async (): Promise<CAConnectionWithFirebaseUtilDatabase | void> => {
  // TODO - replace the credentials with the existing
  const login = 'i2ga8r+7mc075w0nc9ns@sharklasers.com';
  const password = '123456';
  const firebaseConnection = await connectWithFirebase({
    login,
    password,
  });

  if (firebaseConnection instanceof Error) {
    console.error(firebaseConnection);
    console.error(new Error('Failed to connect with firebase'));
    return;
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
  return databaseConnectionToFirebase;
};

export const runTestFirebaseConnectionDatabase = async () => {
  console.warn('runTestFirebaseConnectionDatabase::start');
  const databaseConnectionToFirebase = await connectToFirebase();

  if (!databaseConnectionToFirebase) {
    return;
  }

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

  const readValueResult = await databaseConnectionToFirebase.getValue(testKey);

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

  const disconnectResult = await databaseConnectionToFirebase.disconnect();

  if (disconnectResult instanceof Error) {
    console.error(disconnectResult);
    console.error('An error has occured on disconnect from the database');
    return;
  }
  if (databaseConnectionToFirebase.isConnected) {
    console.error(
      'isConnected must be false after disconnected from the database'
    );
    return;
  }

  const databaseConnectionToFirebaseAfterDisconnection = await connectToFirebase();

  if (!databaseConnectionToFirebaseAfterDisconnection) {
    console.error(
      'It must be alllowed to create a new instance of the connection after disconnected from the Firebase'
    );
    return;
  }

  const readValueResultAfterReconnect = await databaseConnectionToFirebaseAfterDisconnection.getValue(
    testKey
  );

  if (readValueResultAfterReconnect instanceof Error) {
    console.error(readValueResultAfterReconnect);
    console.error('Failed to read a data from the database');
    return;
  }
  if (
    !readValueResultAfterReconnect ||
    typeof readValueResultAfterReconnect !== 'object'
  ) {
    console.error('Value is empty or have a wrong format');
    return;
  }
  if ((readValueResultAfterReconnect as any).testData !== testData.testData) {
    console.error(
      'The data read from the Firebase Realtime Database have a wrong format'
    );
    return;
  }

  const newInstanceDisconnectResult = await databaseConnectionToFirebaseAfterDisconnection.disconnect();

  if (newInstanceDisconnectResult instanceof Error) {
    console.error(newInstanceDisconnectResult);
    return;
  }

  const newInstanceConnectResult = await databaseConnectionToFirebaseAfterDisconnection.connect();

  if (!(newInstanceConnectResult instanceof Error)) {
    console.error(
      'It\'s not allowed to reconnect to the Firebase by calling of the "connect" method'
    );
    return;
  }
};
