import { CAConnectionWithFirebase } from 'classes/central-authority-class/central-authority-connections/central-authority-connection-firebase/central-authority-connection-firebase';
import {
  CA_CONNECTION_FIREBASE_CONFIG,
  CA_CONNECTION_FIREBASE_CREDENTIALS,
} from './central-authority-connection.test.firebase.const';
import { ICAConnectionSignUpCredentials } from 'classes/central-authority-class/central-authority-connections/central-authority-connections.types';
import ErrorExtendedBaseClass from 'classes/basic-classes/error-extended-class-base/error-extended-class-base';
import { CA_CONNECTION_ERROR_ACCOUNT_NOT_VERIFIED_CODE } from 'classes/central-authority-class/central-authority-connections/central-authority-connections-const/central-authority-connections-const';

export const connectToFirebase = async (
  firebaseParams: typeof CA_CONNECTION_FIREBASE_CONFIG = CA_CONNECTION_FIREBASE_CONFIG
): Promise<Error | CAConnectionWithFirebase> => {
  const connectionFirebase = new CAConnectionWithFirebase();
  const connectionResult = await connectionFirebase.connect(firebaseParams);

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

export const aurhorizeWithCredentials = async (
  authCredentials: ICAConnectionSignUpCredentials,
  connectionFirebase: CAConnectionWithFirebase
): Promise<Error | CAConnectionWithFirebase> => {
  const authorizeResult = await connectionFirebase.authorize(authCredentials);

  if (
    authorizeResult instanceof ErrorExtendedBaseClass &&
    authorizeResult.code === CA_CONNECTION_ERROR_ACCOUNT_NOT_VERIFIED_CODE
  ) {
    alert('Please, veriy your email');
    return aurhorizeWithCredentials(authCredentials, connectionFirebase);
  }
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

export const connectAndAuthorizeInFirebase = async (
  authCredentials: ICAConnectionSignUpCredentials,
  firebaseParams?: typeof CA_CONNECTION_FIREBASE_CONFIG
): Promise<CAConnectionWithFirebase | Error> => {
  const connectionFirebase = await connectToFirebase(firebaseParams);

  if (connectionFirebase instanceof Error) {
    console.error(connectionFirebase);
    return connectionFirebase;
  }
  return aurhorizeWithCredentials(authCredentials, connectionFirebase);
};

/**
 * connect to firebase with credentials
 * defined
 */
export const connectWithFirebase = async (
  authCredentials: ICAConnectionSignUpCredentials = CA_CONNECTION_FIREBASE_CREDENTIALS,
  firebaseParams?: typeof CA_CONNECTION_FIREBASE_CONFIG
) => {
  console.warn('CA connection firebase test started');

  if (authCredentials instanceof Error) {
    return authCredentials;
  }

  const connectionFirebase = await connectAndAuthorizeInFirebase(
    authCredentials,
    firebaseParams
  );

  if (connectionFirebase instanceof Error) {
    console.error(connectionFirebase);
    return connectionFirebase;
  }

  return connectionFirebase;
};

export const deleteTheUserFromCA = async (
  connectionFirebase: CAConnectionWithFirebase,
  authCredentials: ICAConnectionSignUpCredentials
): Promise<boolean | Error> => {
  if (connectionFirebase instanceof CAConnectionWithFirebase) {
    const deleteResult = await connectionFirebase.delete(authCredentials);

    if (deleteResult instanceof Error) {
      console.error(deleteResult);
      return new Error('Failed to delete the user from the Firebase authority');
    }
    return true;
  }
  return new Error('The connection to the firebase is not valid');
};