import { CentralAuthorityIdentityCredentialsStorage } from 'classes/central-authority-class/central-authority-storage-local/central-authority-storage-swarm-users-auth/central-authority-storage-swarm-users-identity-credentials/central-authority-storage-swarm-users-identity-credentials';
import { ISecretStoreCredentials } from 'classes/secret-storage-class/secret-storage-class.types';
import {
  CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME,
  CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME,
  CA_USER_IDENTITY_VERSION_PROP_NAME,
  CA_USER_IDENTITY_VERSIONS,
} from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity.const';
import { generateUUID } from 'utils/identity-utils/identity-utils';
import CentralAuthorityIdentity from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity';
import { generateKeyPairs } from 'classes/central-authority-class/central-authority-utils-common/central-authority-util-crypto-keys/central-authority-util-crypto-keys';
import {
  getUserIdentityByCryptoCredentials,
  getUserCredentialsByUserIdentityAndCryptoKeys,
  exportCryptoCredentialsToString,
  compareCryptoCredentials,
} from 'classes/central-authority-class/central-authority-utils-common/central-authority-utils-crypto-credentials/central-authority-utils-crypto-credentials';
import { ICAUserUniqueIdentifierDescriptionWithOptionalVersion } from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity.types';
import { TCentralAuthorityUserIdentity } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';

const runCACredentialsIdentityStorageTestForCredentials = async (
  storageInstance: CentralAuthorityIdentityCredentialsStorage,
  testIdentityDescription:
    | ICAUserUniqueIdentifierDescriptionWithOptionalVersion
    | TCentralAuthorityUserIdentity
): Promise<boolean | undefined> => {
  const caIdentityValueTest = new CentralAuthorityIdentity(
    testIdentityDescription
  );
  const identityTest = caIdentityValueTest.toString();
  const testKeyPairs = await generateKeyPairs();

  if (testKeyPairs instanceof Error) {
    console.error(testKeyPairs);
    console.error('Failed to generate key Pairs');
    return;
  }

  const setInStorageResult = await storageInstance.setCredentials(
    identityTest,
    testKeyPairs
  );
  const caCryptoCredentialsTestRead = await storageInstance.getCredentials(
    identityTest
  );

  if (setInStorageResult instanceof Error) {
    if (!(caCryptoCredentialsTestRead instanceof Error)) {
      console.error(
        'If the set in storage result was wrong, than get from the storage result must be also wrong'
      );
    }
    console.error(setInStorageResult);
    return;
  }
  if (caCryptoCredentialsTestRead instanceof Error) {
    console.error(caCryptoCredentialsTestRead);
    console.error('Failed to read the crypto credentials saved previosely');
    return;
  }
  if (!caCryptoCredentialsTestRead) {
    console.error(
      'The crypto credentials saved previousely have an empty value stored'
    );
    return;
  }

  const identityValue = getUserIdentityByCryptoCredentials(
    caCryptoCredentialsTestRead
  );

  if (identityValue instanceof Error) {
    console.error(identityValue);
    console.error('There is a broken identity value was stored');
    return;
  }
  if (identityValue !== identityTest) {
    console.error('The identity stored have a wrong value not same as stred');
    return;
  }

  const caCredentialsTest = getUserCredentialsByUserIdentityAndCryptoKeys(
    identityTest,
    testKeyPairs
  );

  if (caCredentialsTest instanceof Error) {
    console.error(caCredentialsTest);
    console.error(
      'Failed to create CACryproCredentials by the identity and test key pairs'
    );
    return;
  }

  const storeResultCaCryptoCredentials = await storageInstance.setCredentials(
    caCredentialsTest
  );

  if (storeResultCaCryptoCredentials instanceof Error) {
    console.error(storeResultCaCryptoCredentials);
    console.error('Failed to store the CACryptoCredentials format');
    return;
  }
  if (storeResultCaCryptoCredentials !== false) {
    console.error(
      'Crypto credentials for the same identity must not be rewritten'
    );
    return;
  }

  const caCryptoCredentialsExportedToStringTest = await exportCryptoCredentialsToString(
    caCredentialsTest
  );

  if (caCryptoCredentialsExportedToStringTest instanceof Error) {
    console.error(caCryptoCredentialsExportedToStringTest);
    console.error('Failed to export CACryptoCredentials to a string');
    return;
  }

  const storeResultCaCryptoCredentialsExportedToString = await storageInstance.setCredentials(
    caCryptoCredentialsExportedToStringTest
  );

  if (storeResultCaCryptoCredentialsExportedToString instanceof Error) {
    console.error(storeResultCaCryptoCredentialsExportedToString);
    console.error(
      'Failed to store the CACryptoCredentials exported to a string format'
    );
    return;
  }
  if (storeResultCaCryptoCredentialsExportedToString !== false) {
    console.error(
      'Crypto credentials (exported as string) for the same identity must not be rewritten'
    );
    return;
  }
  return true;
};

export const runCACredentialsIdentityStorageTest = async () => {
  console.warn('Storage identity test was started');

  const conectionCredentials: ISecretStoreCredentials = {
    password: '123456',
  };
  const storageInstance = new CentralAuthorityIdentityCredentialsStorage();
  const connectionResult = await storageInstance.connect(conectionCredentials);

  if (connectionResult instanceof Error) {
    console.error(connectionResult);
    console.error(new Error('Failed to connect to the storage'));
    return;
  }

  const testIdentityDescription = {
    [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]: 'https://google.com',
    [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]: generateUUID(),
    [CA_USER_IDENTITY_VERSION_PROP_NAME]: CA_USER_IDENTITY_VERSIONS['01'],
  };
  const resultFirst = await runCACredentialsIdentityStorageTestForCredentials(
    storageInstance,
    testIdentityDescription
  );

  if (resultFirst !== true) {
    console.error('Test for the first credentials was failed');
    return;
  }

  const testIdentityDescriptionSame = {
    ...testIdentityDescription,
    [CA_USER_IDENTITY_VERSION_PROP_NAME]: CA_USER_IDENTITY_VERSIONS['02'],
  };
  const caIdentityValue = new CentralAuthorityIdentity(testIdentityDescription);
  const caIdentityValueSame = new CentralAuthorityIdentity(
    testIdentityDescriptionSame
  );

  const resCredentialsValue = await storageInstance.getCredentials(
    caIdentityValue.toString()
  );

  if (resCredentialsValue instanceof Error) {
    console.error(resCredentialsValue);
    console.error('Failed to read credentials');
    return;
  }
  if (!resCredentialsValue) {
    console.error('Failed to read credentials which are stored before');
    return;
  }

  const resSameCredentialsValue = await storageInstance.getCredentials(
    caIdentityValueSame.toString()
  );

  if (resSameCredentialsValue instanceof Error) {
    console.error(resCredentialsValue);
    console.error('Failed to read credentials');
    return;
  }
  if (!resSameCredentialsValue) {
    console.error('Failed to read credentials which are stored before');
    return;
  }
  if (!compareCryptoCredentials(resCredentialsValue, resSameCredentialsValue)) {
    console.error(
      'A crypto credentials must be the same and independent from the CAIdentity version'
    );
    return;
  }
  if (
    resCredentialsValue.userIdentity === resSameCredentialsValue.userIdentity
  ) {
    console.error(
      'The user identity must not be the same cause the version is different'
    );
    return;
  }

  const testIdentityDescriptionTwo = {
    [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]:
      'https://google1.com',
    [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]: 'WWW@WWW.RU',
    [CA_USER_IDENTITY_VERSION_PROP_NAME]: CA_USER_IDENTITY_VERSIONS['02'],
  };
  const resultTwo = await runCACredentialsIdentityStorageTestForCredentials(
    storageInstance,
    testIdentityDescriptionTwo
  );

  if (resultTwo !== true) {
    console.error('Test for the second credentials was failed');
    return;
  }
  console.warn('Test for a wrong identity valie started');
  const testIdentityDescriptionWrongFormat = {
    [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]: '',
    [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]: generateUUID(),
  };
  const resultMustBeFailed = await runCACredentialsIdentityStorageTestForCredentials(
    storageInstance,
    testIdentityDescriptionWrongFormat
  );

  // undefined must be
  if (resultMustBeFailed) {
    console.error('Test for a wrong identity valie must failed');
    return;
  }
  console.warn('Test for a wrong identity value succeed');

  const storageDisconnectResult = await storageInstance.disconnect();

  if (storageDisconnectResult instanceof Error) {
    console.error(storageDisconnectResult);
    console.error('Failed to disconnect');
    return;
  }

  const caIdentityValueTest = new CentralAuthorityIdentity(
    testIdentityDescription
  );
  const identityTest = caIdentityValueTest.toString();

  if (!identityTest) {
    console.error(identityTest);
    console.error(
      'Failed to generate test identity string on disconnected storage test'
    );
    return;
  }

  const testKeyPairs = await generateKeyPairs();

  if (testKeyPairs instanceof Error) {
    console.error(testKeyPairs);
    console.error('Failed to generate key pairs on disconnected storage test');
    return;
  }

  const setCredentialsResultDisconnected = await storageInstance.setCredentials(
    identityTest,
    testKeyPairs
  );

  if (!(setCredentialsResultDisconnected instanceof Error)) {
    console.error(
      'Execution of the setCredentials method must failed on disconnected storage'
    );
    return;
  }

  const getCredentialsResultDisconnected = await storageInstance.getCredentials(
    identityTest
  );

  if (!(getCredentialsResultDisconnected instanceof Error)) {
    console.error(
      'Execution of the getCredentials method must failed on disconnected storage'
    );
    return;
  }
  console.warn('Storage identity test was succes');
};
