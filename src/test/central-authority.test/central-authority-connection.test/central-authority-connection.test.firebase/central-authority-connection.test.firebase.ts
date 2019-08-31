import { CAConnectionWithFirebase } from 'classes/central-authority-class/central-authority-connections/central-authority-connection-firebase/central-authority-connection-firebase';
import { CA_CONNECTION_FIREBASE_CONFIG } from './central-authority-connection.test.firebase.const';
import { ICentralAuthorityUserProfile } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';

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

export const runTestCAConnectionFirebaseChangeEmail = async () => {
  const connectionFirebase = await connectToFirebase();

  if (connectionFirebase instanceof Error) {
    console.error(connectionFirebase);
    return;
  }

  const userProfileWithEmailTest = {
    name: 'Paul Test',
    email: 'akulich2paul@gmail.com',
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

  const connectionFirebase = await connectToFirebase();

  if (connectionFirebase instanceof Error) {
    console.error(connectionFirebase);
    return;
  }
  // TOOD - validator for an auth credentials
  // password must be a 6 characters at least
  const authCredentials = {
    login: 'akulich.p@gmail.com',
    password: '123456',
  };
  const authorizeResult = await connectionFirebase.authorize(authCredentials);

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
    return;
  }

  if (
    userProfileTestWOEmailAndPhoneNumber.photoURL !==
    updateProfileResult.photoURL
  ) {
    console.error('The photo URL was not updated in the profile');
    return;
  }
  if (userProfileTestWOEmailAndPhoneNumber.name !== updateProfileResult.name) {
    console.error('Name was not updated in the profile');
    return;
  }
};
