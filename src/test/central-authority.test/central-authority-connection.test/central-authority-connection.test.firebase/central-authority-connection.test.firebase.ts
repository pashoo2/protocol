import { ICentralAuthorityUserProfile } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import {
  connectToFirebase,
  connectWithFirebase,
  deleteTheUserFromCA,
} from './central-authority-connection.test.firebase.utils';

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
