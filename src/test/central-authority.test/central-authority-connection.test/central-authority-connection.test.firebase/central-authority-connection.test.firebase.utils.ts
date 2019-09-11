import { CAConnectionWithFirebase } from 'classes/central-authority-class/central-authority-connections/central-authority-connection-firebase/central-authority-connection-firebase';
import {
  CA_CONNECTION_FIREBASE_CONFIG,
  CA_CONNECTION_FIREBASE_CREDENTIALS,
} from './central-authority-connection.test.firebase.const';
import { ICentralAuthorityUserProfile } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import { ICAConnectionSignUpCredentials } from 'classes/central-authority-class/central-authority-connections/central-authority-connections.types';
import { generateCryptoCredentials } from 'classes/central-authority-class/central-authority-utils-common/central-authority-util-crypto-keys/central-authority-util-crypto-keys';

export const connectToFirebase = async (): Promise<
  Error | CAConnectionWithFirebase
> => {
  const connectionFirebase = new CAConnectionWithFirebase();
  const connectionResult = await connectionFirebase.connect(
    CA_CONNECTION_FIREBASE_CONFIG
  );

  if (connectionResult instanceof Error) {
    console.error(connectionResult);
    return new Error('Failed connection to the firebase app account');
  }
  if (!connectionFirebase.isConnected) {
    return new Error(
      'isConnected status flag must be truthly on connection succeed'
    );
  }
  return connectionFirebase;
};

export const connectAndAuthorizeInFirebase = async (
  authCredentials: ICAConnectionSignUpCredentials
): Promise<CAConnectionWithFirebase | Error> => {
  const connectionFirebase = await connectToFirebase();

  if (connectionFirebase instanceof Error) {
    console.error(connectionFirebase);
    return connectionFirebase;
  }

  const authorizeResult = await connectionFirebase.authorize(authCredentials);
  debugger;
  if (authorizeResult instanceof Error) {
    return new Error('Failed to sign up to the firebase app');
  }
  if (!connectionFirebase.isAuthorized) {
    return new Error(
      'isAuthorized connection flag must be truthly on authorization succeed'
    );
  }
  return connectionFirebase;
};

/**
 * connect to firebase with credentials
 * defined
 */
export const connectWithFirebase = async () => {
  console.warn('CA connection firebase test started');
  const authCredentials = CA_CONNECTION_FIREBASE_CREDENTIALS;

  if (authCredentials instanceof Error) {
    return authCredentials;
  }

  const connectionFirebase = await connectAndAuthorizeInFirebase(
    authCredentials
  );

  if (connectionFirebase instanceof Error) {
    console.error(connectionFirebase);
    return connectionFirebase;
  }

  return connectionFirebase;
};

export const deleteTheUserFromCA = async (
  connectionFirebase: CAConnectionWithFirebase
): Promise<boolean | Error> => {
  if (connectionFirebase instanceof CAConnectionWithFirebase) {
    const deleteResult = await connectionFirebase.delete();

    if (deleteResult instanceof Error) {
      console.error(deleteResult);
      return new Error('Failed to delete the user from the Firebase authority');
    }
    return true;
  }
  return new Error('The connection to the firebase is not valid');
};
