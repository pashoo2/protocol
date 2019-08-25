import { CAConnectionWithFirebase } from 'classes/central-authority-class/central-authority-connections/central-authority-connection-firebase/central-authority-connection-firebase';
import { CA_CONNECTION_FIREBASE_CONFIG } from './central-authority-connection.test.firebase.const';

export const runTestCAConnectionFirebase = async () => {
  console.warn('CA connection firebase test started');

  const connectionFirebase = new CAConnectionWithFirebase();
  const connectionResult = await connectionFirebase.connect(
    CA_CONNECTION_FIREBASE_CONFIG
  );

  if (connectionResult instanceof Error) {
    console.error(connectionResult);
    console.error(new Error('Failed connection to the firebase app account'));
    return;
  }
  if (!connectionFirebase.isConnected) {
    console.error(
      'isConnected status flag must be truthly on connection succeed'
    );
    return;
  }

  // TOOD - validator for an auth credentials
  // password must be a 6 characters at least
  const authCredentials = {
    login: 'akulich.p@gmail.com',
    password: '123456',
  };
  const authorizeResult = await connectionFirebase.authorize(authCredentials);
  debugger;
  if (authorizeResult instanceof Error) {
    console.error(authorizeResult);
    console.error('Failed to sign up to the firebase app');
    return;
  }
  if (!connectionFirebase.isAuthorized) {
    console.error(
      'isAuthorized connection flag must be truthly on authorization succeed'
    );
    return;
  }
  debugger;
  console.warn('CA connection firebase test succeed');
};
