import { CAConnectionFirestoreUtilsCredentialsStrorage } from 'classes/central-authority-class/central-authority-connections/central-authority-connection-firebase/central-authority-connection-firebase-utils/central-authority-connection-firebase-utils.credentials-storage/central-authority-connection-firebase-utils.credentials-storage';
import { connectWithFirebase } from './central-authority-connection.utils.firebase';
import { generateCryptoCredentialsWithUserIdentityV2 } from 'classes/central-authority-class/central-authority-utils-common/central-authority-util-crypto-keys/central-authority-util-crypto-keys';
import {
  getUserIdentityByCryptoCredentials,
  compareCryptoCredentials,
  exportCryptoCredentialsToString,
  importCryptoCredentialsFromAString,
} from 'classes/central-authority-class/central-authority-utils-common/central-authority-utils-crypto-credentials/central-authority-utils-crypto-credentials';
import {
  CA_CONNECTION_FIREBASE_CONFIG,
  CA_CONNECTION_FIREBASE_CONFIG_WATCHA3,
  CA_CONNECTION_FIREBASE_USER_CREDENTIALS_ANOTHER,
} from './central-authority-connection.test.firebase.const';
import { ICAUserUniqueIdentifierMetadata } from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity.types';
import { TCentralAuthorityUserCryptoCredentials } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import { ICAConnectionSignUpCredentials } from 'classes/central-authority-class/central-authority-connections/central-authority-connections.types';

const runTestFirebaseCredentialsStorageVersion = async (
  firebaseCredentials: ICAConnectionSignUpCredentials,
  generateCryptoCredentialsWithUserIdentityFunc?: (
    identityMetadata: ICAUserUniqueIdentifierMetadata
  ) => Promise<TCentralAuthorityUserCryptoCredentials | Error>,
  firebaseConnectionOptions: typeof CA_CONNECTION_FIREBASE_CONFIG = CA_CONNECTION_FIREBASE_CONFIG
) => {
  console.warn('runTestFirebaseCredentialsStorage::start');
  let credentialsForInit;
  if (generateCryptoCredentialsWithUserIdentityFunc) {
    credentialsForInit = await generateCryptoCredentialsWithUserIdentityFunc({
      authorityProviderURI: firebaseConnectionOptions.databaseURL,
      userUniqueIdentifier:
        generateCryptoCredentialsWithUserIdentityFunc ===
        generateCryptoCredentialsWithUserIdentityV2
          ? firebaseCredentials.login
          : undefined,
    });
  }

  if (credentialsForInit instanceof Error) {
    console.error(credentialsForInit);
    console.error(
      'Failed to generate a credentials to initialize the new user'
    );
    return;
  }

  const firebaseConnection = await connectWithFirebase(
    {
      ...firebaseCredentials,
      cryptoCredentials: credentialsForInit,
    },
    firebaseConnectionOptions
  );

  if (firebaseConnection instanceof Error) {
    console.error(firebaseConnection);
    return new Error('Failed to connect with firebase');
  }

  const credetntialsStoreConnectionToFirebase = new CAConnectionFirestoreUtilsCredentialsStrorage(
    firebaseConnection
  );

  if (credetntialsStoreConnectionToFirebase.isConnected) {
    console.error('Database connection flag must be false');
    return;
  }

  const connectionResult = await credetntialsStoreConnectionToFirebase.connect();

  if (connectionResult instanceof Error) {
    console.error(connectionResult);
    console.error('Failed to connect to the database server');
    return;
  }
  if (!credetntialsStoreConnectionToFirebase.isConnected) {
    console.error(
      'Database connection flag must be true after connection method returns a success result'
    );
    return;
  }

  const credentialsForUser = await credetntialsStoreConnectionToFirebase.getCredentialsForTheCurrentUser();

  if (credentialsForUser instanceof Error) {
    console.error(credentialsForUser);
    console.error('Failed to get credentials for the current user');
    return;
  }
  if (credentialsForUser) {
    const credentialsFromLocalStorage = localStorage.getItem(
      `______test___firebase_acc___${firebaseCredentials.login}`
    );

    if (typeof credentialsFromLocalStorage === 'string') {
      const credentialsFromLocalStorageParsed = await importCryptoCredentialsFromAString(
        credentialsFromLocalStorage
      );

      if (
        credentialsFromLocalStorageParsed &&
        !(credentialsFromLocalStorageParsed instanceof Error)
      ) {
        if (
          (await compareCryptoCredentials(
            credentialsFromLocalStorageParsed,
            credentialsForUser
          )) !== true
        ) {
          console.error('compareCryptoCredentials returs the invalid result');
          return;
        }
      }
    } else {
      const credentialsSerialized = await exportCryptoCredentialsToString(
        credentialsForUser
      );

      if (credentialsSerialized instanceof Error) {
        console.error('Failed to serialize the credentials');
        return;
      }
      localStorage.setItem(
        `______test___firebase_acc___${firebaseCredentials.login}`,
        credentialsSerialized
      );
    }
  }

  const credentials = await (
    generateCryptoCredentialsWithUserIdentityFunc ||
    generateCryptoCredentialsWithUserIdentityV2
  )({
    authorityProviderURI: firebaseConnectionOptions.databaseURL,
    userUniqueIdentifier:
      generateCryptoCredentialsWithUserIdentityFunc ===
      generateCryptoCredentialsWithUserIdentityV2
        ? firebaseCredentials.login
        : !generateCryptoCredentialsWithUserIdentityFunc
        ? '123412'
        : undefined,
  });

  if (credentials instanceof Error) {
    console.error('Failed to generate crypto credentials');
    return;
  }
  if ((await compareCryptoCredentials(credentials, credentials)) !== true) {
    console.error('compareCryptoCredentials returs the invalid result');
    return;
  }

  const setCredentialsResult = await credetntialsStoreConnectionToFirebase.setUserCredentials(
    credentials
  );

  if (setCredentialsResult instanceof Error) {
    console.error(setCredentialsResult);
    console.error('Failed to set credentials');
    return;
  }
  if (
    credentialsForUser &&
    (await compareCryptoCredentials(
      setCredentialsResult,
      credentialsForUser
    )) !== true
  ) {
    console.error(
      'Credentials for the user created and stored once must be immputable anyway'
    );
    return;
  }

  if (!credentialsForUser) {
    const credentialsForUserAfterSetANewOne = await credetntialsStoreConnectionToFirebase.getCredentialsForTheCurrentUser();

    if (credentialsForUserAfterSetANewOne instanceof Error) {
      console.error(credentialsForUser);
      console.error('Failed to get credentials for the current user');
      return;
    }
    if (!credentialsForUserAfterSetANewOne) {
      console.error(
        'Credentials for the current must exists cause it was set before'
      );
      return;
    }
    if (
      (await compareCryptoCredentials(
        credentialsForUserAfterSetANewOne,
        credentialsForUserAfterSetANewOne
      )) !== true
    ) {
      console.error(
        'Credentials for the user created and stored once must be immputable anyway'
      );
      return;
    }
  }

  const userId = getUserIdentityByCryptoCredentials(setCredentialsResult);

  if (userId instanceof Error) {
    console.error(userId);
    console.error('Failed to get user id by crypto credentials');
    return;
  }

  const getCredentialsResult = await credetntialsStoreConnectionToFirebase.getUserCredentials(
    userId
  );

  if (!getCredentialsResult) {
    console.error(
      'There is no credentials stored before was found in the Firebsae database'
    );
    return;
  }
  if (getCredentialsResult instanceof Error) {
    console.error('Failed to read credentials from the Firebase database');
    return;
  }
  if (
    (await compareCryptoCredentials(
      setCredentialsResult,
      getCredentialsResult
    )) !== true
  ) {
    console.error(
      'Credentials for the user got by the user id must be immputable the same as the credentials set by the user on sign up flow'
    );
    return;
  }

  const firebaseConnectionNext = await connectWithFirebase({
    ...firebaseCredentials,
    cryptoCredentials: credentialsForInit,
  });

  if (!(firebaseConnectionNext instanceof Error)) {
    console.error(
      'The next attemp to connect under the same account must be failed'
    );
    return;
  }
  return true;
};

export const runTestFirebaseCredentialsStorage = async () => {
  // if (
  //   !(await runTestFirebaseCredentialsStorageVersion(
  //     {
  //       login: 'rehodip223@mailhub.pro',
  //       password: '123456',
  //     },
  //     generateCryptoCredentialsWithUserIdentityV1
  //   ))
  // ) {
  //   console.error('Failed test for user identity V1');
  //   return;
  // }
  // if (
  //   !(await runTestFirebaseCredentialsStorageVersion(
  //     {
  //       login: 'pefik89126@mailhub.pro',
  //       password: '123456',
  //     },
  //     generateCryptoCredentialsWithUserIdentityV2
  //   ))
  // ) {
  //   console.error('Failed test for user identity V2');
  //   return;
  // }
  if (
    !(await runTestFirebaseCredentialsStorageVersion(
      CA_CONNECTION_FIREBASE_USER_CREDENTIALS_ANOTHER,
      undefined,
      CA_CONNECTION_FIREBASE_CONFIG_WATCHA3
    ))
  ) {
    console.error('Failed test for user identity V2');
    return;
  }
  console.warn('runTestFirebaseCredentialsStorage::success');
};
