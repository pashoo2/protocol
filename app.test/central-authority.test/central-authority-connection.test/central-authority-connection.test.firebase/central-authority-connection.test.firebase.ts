/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ICentralAuthorityUserProfile,
  TCentralAuthorityUserCryptoCredentials,
} from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import {
  connectWithFirebase,
  deleteTheUserFromCA,
} from './central-authority-connection.utils.firebase';
import {
  CA_CONNECTION_FIREBASE_USER_CREDENTIALS,
  CA_CONNECTION_FIREBASE_CONFIG,
} from './central-authority-connection.test.firebase.const';
import { checkIsValidCryptoCredentials } from 'classes/central-authority-class/central-authority-validators/central-authority-validators-crypto-keys/central-authority-validators-crypto-keys';
import CentralAuthorityIdentity from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity';
import {
  ICAConnectionUserAuthorizedResult,
  ICAConnectionSignUpCredentials,
} from 'classes/central-authority-class/central-authority-connections/central-authority-connections.types';
import { compareCryptoCredentials } from 'classes/central-authority-class/central-authority-utils-common/central-authority-utils-crypto-credentials/central-authority-utils-crypto-credentials';
import {
  generateCryptoCredentialsWithUserIdentityV1,
  generateCryptoCredentialsWithUserIdentityV2,
} from 'classes/central-authority-class/central-authority-utils-common/central-authority-util-crypto-keys/central-authority-util-crypto-keys';
import { ICAUserUniqueIdentifierMetadata } from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity.types';

const runTestCAConnectionFirebaseChangeEmailForVersion = async (
  firebaseCredentials: ICAConnectionSignUpCredentials,
  generateCryptoCredentialsWithUserIdentityFunc: (
    identityMetadata: ICAUserUniqueIdentifierMetadata
  ) => Promise<TCentralAuthorityUserCryptoCredentials | Error>
) => {
  const credentialsForInit = await generateCryptoCredentialsWithUserIdentityFunc(
    {
      authorityProviderURI: CA_CONNECTION_FIREBASE_CONFIG.databaseURL,
      userUniqueIdentifier:
        generateCryptoCredentialsWithUserIdentityFunc ===
        generateCryptoCredentialsWithUserIdentityV2
          ? firebaseCredentials.login
          : undefined,
    }
  );

  if (credentialsForInit instanceof Error) {
    console.error(credentialsForInit);
    console.error(
      'Failed to generate a credentials to initialize the new user'
    );
    return;
  }

  const credentials = {
    ...firebaseCredentials,
    cryptoCredentials: credentialsForInit,
  };
  const connectionFirebase = await connectWithFirebase(credentials);

  if (connectionFirebase instanceof Error) {
    console.error(connectionFirebase);
    return;
  }

  // TODO - it's necessary to use an email
  // which can be accessed
  const userProfileWithEmailTest = {
    name: `Test account ${Date.now()}`,
    email: 'cogej95883@mail1web.org',
  };
  const updateProfileWithEmailResult = await (connectionFirebase as any).setProfileData(
    userProfileWithEmailTest
  );

  if (updateProfileWithEmailResult instanceof Error) {
    console.error('Failed to set the profile (with a email) data');
    return;
  }
  if (userProfileWithEmailTest.name !== updateProfileWithEmailResult.name) {
    console.error('Name was not updated in the profile');
    return;
  }
  if (userProfileWithEmailTest.email !== updateProfileWithEmailResult.email) {
    console.error('The email was not updated in the profile');
    return;
  }
  if (connectionFirebase.isAuthorized) {
    console.error(
      'isAuthorized connection flag must be false on email value changed'
    );
    return;
  }
  return true;
};

const runTestCAConnectionFirebaseForVersion = async (
  firebaseCredentials: ICAConnectionSignUpCredentials,
  generateCryptoCredentialsWithUserIdentityFunc: (
    identityMetadata: ICAUserUniqueIdentifierMetadata
  ) => Promise<TCentralAuthorityUserCryptoCredentials | Error>
) => {
  console.warn('CA connection firebase test started');
  const credentialsForInit = await generateCryptoCredentialsWithUserIdentityFunc(
    {
      authorityProviderURI: CA_CONNECTION_FIREBASE_CONFIG.databaseURL,
      userUniqueIdentifier:
        generateCryptoCredentialsWithUserIdentityFunc ===
        generateCryptoCredentialsWithUserIdentityV2
          ? firebaseCredentials.login
          : undefined,
    }
  );

  if (credentialsForInit instanceof Error) {
    console.error(credentialsForInit);
    console.error(
      'Failed to generate a credentials to initialize the new user'
    );
    return;
  }

  const credentials = {
    ...firebaseCredentials,
    cryptoCredentials: credentialsForInit,
  };
  const connectionFirebase = await connectWithFirebase(credentials);

  if (connectionFirebase instanceof Error) {
    console.error(connectionFirebase);
    return;
  }
  console.warn('CA connection firebase test succeed');

  //check profile update result
  const userProfileTestWOEmailAndPhoneNumber: Partial<ICentralAuthorityUserProfile> = {
    name: 'Paul',
    photoURL:
      'https://cdn.dribbble.com/users/199982/screenshots/4044699/furkan-avatar-dribbble.png',
  };
  const updateProfileResult = await (connectionFirebase as any).setProfileData(
    userProfileTestWOEmailAndPhoneNumber
  );

  if (updateProfileResult instanceof Error) {
    console.error('Failed tp set the profile (without a email) data');
    return deleteTheUserFromCA(connectionFirebase, credentials);
  }
  if (
    userProfileTestWOEmailAndPhoneNumber.photoURL !==
    updateProfileResult.photoURL
  ) {
    console.error('The photo URL was not updated in the profile');
    return deleteTheUserFromCA(connectionFirebase, credentials);
  }
  if (userProfileTestWOEmailAndPhoneNumber.name !== updateProfileResult.name) {
    console.error('Name was not updated in the profile');
    return deleteTheUserFromCA(connectionFirebase, credentials);
  }

  const deleteTheUserResult = await deleteTheUserFromCA(
    connectionFirebase,
    credentials
  );

  if (deleteTheUserResult instanceof Error) {
    console.error(deleteTheUserResult);
    return new Error('Failed to delete the user from the Firebase authority');
  }
  return true;
};

export const runTestCAConnectionFirebase = async () => {
  // TODO - to run full test it's necessary to change
  // the credentials to a new
  const credentialsTest1 = {
    login: 'xamali6554@mail-help.net',
    password: '123456',
  };
  const resultTestVersion1 = await runTestCAConnectionFirebaseForVersion(
    credentialsTest1,
    generateCryptoCredentialsWithUserIdentityV1
  );

  if (resultTestVersion1 !== true) {
    console.warn('CA connection firebase for the identity V1 test failed');
    return;
  }
  console.warn('CA connection firebase for the identity V1 test success');
  const credentialsTest1EmailChange = {
    login: 'hogano8384@swift-mail.net',
    password: '123456',
  };
  const resultTestVersion1EmailChange = await runTestCAConnectionFirebaseChangeEmailForVersion(
    credentialsTest1EmailChange,
    generateCryptoCredentialsWithUserIdentityV1
  );

  if (resultTestVersion1EmailChange !== true) {
    console.warn(
      'CA connection firebase for the identity V1 email change test failed'
    );
    return;
  }
  console.warn(
    'CA connection firebase for the identity V1 email change test succeed'
  );
  const credentialsTest2 = {
    login: 'sisarar105@mail-help.net',
    password: '123456',
  };
  const resultTestVersion2 = await runTestCAConnectionFirebaseForVersion(
    credentialsTest2,
    generateCryptoCredentialsWithUserIdentityV2
  );

  if (resultTestVersion2 !== true) {
    console.warn('CA connection firebase for the identity V2 test failed');
    return;
  }
  const credentialsTest2EmailChange = {
    login: 'lodajab497@max-mail.org',
    password: '123456',
  };
  const resultTestVersion2EmailChange = await runTestCAConnectionFirebaseChangeEmailForVersion(
    credentialsTest2EmailChange,
    generateCryptoCredentialsWithUserIdentityV2
  );

  if (resultTestVersion2EmailChange !== true) {
    console.warn(
      'CA connection firebase for the identity V1 email change test failed'
    );
    return;
  }
  console.warn(
    'CA connection firebase for the identity V1 email change test succeed'
  );
  console.warn('CA connection firebase for the identity V2 test success');
};

export const runTestCAConnectionFirebaseCryptoCredentialsGenerateByFirebaseAuthProvider = async () => {
  console.error('runTestCAConnectionFirebaseWithoutCryptoCredentials::start');
  const connectionFirebase = await connectWithFirebase();

  if (connectionFirebase instanceof Error) {
    return new Error('Failed to sign up to the firebase app');
  }
  if (!connectionFirebase.isAuthorized) {
    return new Error(
      'isAuthorized connection flag must be truthly on authorization succeed'
    );
  }
  const {
    cryptoCredentials: cryptoCredentialsGenerated,
  } = connectionFirebase.authResult as ICAConnectionUserAuthorizedResult;
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
  if (
    (await compareCryptoCredentials(
      cryptoCredentialsFromAuthorization,
      cryptoCredentialsGenerated
    )) !== true
  ) {
    console.error(
      'Crypto credentials returned after success authorization must be same as provided (if not stored before)'
    );
    return;
  }
  console.warn('runTestCAConnectionFirebaseWithoutCryptoCredentials::success');
};
