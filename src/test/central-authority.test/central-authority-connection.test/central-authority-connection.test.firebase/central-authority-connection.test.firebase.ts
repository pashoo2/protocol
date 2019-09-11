import { ICentralAuthorityUserProfile } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import {
  connectToFirebase,
  connectWithFirebase,
  deleteTheUserFromCA,
} from './central-authority-connection.test.firebase.utils';
import {
  CA_CONNECTION_FIREBASE_USER_CREDENTIALS,
  CA_CONNECTION_FIREBASE_CONFIG,
} from './central-authority-connection.test.firebase.const';
import { checkIsValidCryptoCredentials } from 'classes/central-authority-class/central-authority-validators/central-authority-validators-crypto-keys/central-authority-validators-crypto-keys';
import CentralAuthorityIdentity from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity';

export const runTestCAConnectionFirebaseChangeEmail = async () => {
  const connectionFirebase = await connectToFirebase();

  if (connectionFirebase instanceof Error) {
    console.error(connectionFirebase);
    return;
  }

  const userProfileWithEmailTest = {
    name: 'Paul Test',
    email: 'sofer@mail-desk.net',
  };

  const updateProfileWithEmailResult = await connectionFirebase.setProfileData(
    userProfileWithEmailTest
  );

  if (updateProfileWithEmailResult instanceof Error) {
    console.error('Failed to set the profile (with a email) data');
    return;
  }
  if (updateProfileWithEmailResult.name !== updateProfileWithEmailResult.name) {
    console.error('Name was not updated in the profile');
    return;
  }
  if (
    updateProfileWithEmailResult.email !== updateProfileWithEmailResult.email
  ) {
    console.error('The email was not updated in the profile');
    return;
  }
  if (connectionFirebase.isAuthorized) {
    console.error(
      'isAuthorized connection flag must be false on email value changed'
    );
    return;
  }
};

export const runTestCAConnectionFirebase = async () => {
  console.warn('CA connection firebase test started');
  const connectionFirebase = await connectWithFirebase();

  if (connectionFirebase instanceof Error) {
    console.error(connectionFirebase);
    return;
  }

  console.warn('CA connection firebase test succeed');

  //check profile update result
  const userProfileTestWOEmailAndPhoneNumber: Partial<
    ICentralAuthorityUserProfile
  > = {
    name: 'Paul',
    photoURL:
      'https://cdn.dribbble.com/users/199982/screenshots/4044699/furkan-avatar-dribbble.png',
  };
  const updateProfileResult = await connectionFirebase.setProfileData(
    userProfileTestWOEmailAndPhoneNumber
  );

  if (updateProfileResult instanceof Error) {
    console.error('Failed tp set the profile (without a email) data');
    return deleteTheUserFromCA(connectionFirebase);
  }

  if (
    userProfileTestWOEmailAndPhoneNumber.photoURL !==
    updateProfileResult.photoURL
  ) {
    console.error('The photo URL was not updated in the profile');
    return deleteTheUserFromCA(connectionFirebase);
  }
  if (userProfileTestWOEmailAndPhoneNumber.name !== updateProfileResult.name) {
    console.error('Name was not updated in the profile');
    return deleteTheUserFromCA(connectionFirebase);
  }

  const deleteTheUserResult = await deleteTheUserFromCA(connectionFirebase);

  if (deleteTheUserResult instanceof Error) {
    console.error(deleteTheUserResult);
    return new Error('Failed to delete the user from the Firebase authority');
  }
  console.warn('CA connection firebase test success');
};

export const runTestCAConnectionFirebaseCryptoCredentialsGenerateByFirebaseAuthProvider = async () => {
  console.error('runTestCAConnectionFirebaseWithoutCryptoCredentials::start');
  const connectionFirebase = await connectToFirebase();

  if (connectionFirebase instanceof Error) {
    console.error(connectionFirebase);
    return connectionFirebase;
  }

  const authorizeResult = await connectionFirebase.authorize(
    CA_CONNECTION_FIREBASE_USER_CREDENTIALS
  );

  if (authorizeResult instanceof Error) {
    return new Error('Failed to sign up to the firebase app');
  }
  if (!connectionFirebase.isAuthorized) {
    return new Error(
      'isAuthorized connection flag must be truthly on authorization succeed'
    );
  }

  const { cryptoCredentials: cryptoCredentialsGenerated } = authorizeResult;

  if (!checkIsValidCryptoCredentials(cryptoCredentialsGenerated)) {
    console.error(
      'Invalida crypto credentials generated by Firebase CA connection'
    );
    return;
  }

  const userIdentityByCryptoCredentials = new CentralAuthorityIdentity(
    cryptoCredentialsGenerated
  );

  if (!userIdentityByCryptoCredentials.isValid) {
    console.error('The crypto credentials generated is not valid');
    return;
  }

  const {
    identityDescription: userIdentityDescription,
  } = userIdentityByCryptoCredentials;

  if (userIdentityDescription instanceof Error) {
    console.error(userIdentityDescription);
    console.error('Failed to parse the identity generated');
    return;
  }

  const { authorityProviderURI } = userIdentityDescription;

  if (authorityProviderURI !== CA_CONNECTION_FIREBASE_CONFIG.databaseURL) {
    console.error(
      'The url of the Firebase authority provider from generated identity is not valid'
    );
    return;
  }

  const signOutResult = await connectionFirebase.signOut();

  if (signOutResult instanceof Error) {
    console.error(signOutResult);
    console.error('Failed to sign out');
    return;
  }

  const authorizeResultWithCredentialsGenerated = await connectionFirebase.authorize(
    {
      ...CA_CONNECTION_FIREBASE_USER_CREDENTIALS,
      cryptoCredentials: cryptoCredentialsGenerated,
    }
  );

  if (authorizeResultWithCredentialsGenerated instanceof Error) {
    return new Error('Failed to sign up to the firebase app');
  }
  if (!connectionFirebase.isAuthorized) {
    return new Error(
      'isAuthorized connection flag must be truthly on authorization succeed'
    );
  }

  const {
    cryptoCredentials: cryptoCredentialsFromAuthorization,
  } = authorizeResultWithCredentialsGenerated;

  if (cryptoCredentialsFromAuthorization !== cryptoCredentialsGenerated) {
    console.error(
      'Crypto credentials returned after success authorization must be same as provided (if not stored before)'
    );
    return;
  }
  console.warn('runTestCAConnectionFirebaseWithoutCryptoCredentials::success');
};
