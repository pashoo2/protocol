import CAConnectionWithFirebaseUtilDatabase from 'classes/central-authority-class/central-authority-connections/central-authority-connection-firebase/central-authority-connection-firebase-utils/central-authority-connection-firebase-utils.database/central-authority-connection-firebase-utils.database';
import { connectWithFirebase } from './central-authority-connection.test.firebase.utils';

export const runTestFirebaseConnectionDatabase = async () => {
  console.warn('runTestFirebaseConnectionDatabase::start');

  const firebaseConnection = await connectWithFirebase();

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
  console.warn('runTestFirebaseConnectionDatabase::success');
};
