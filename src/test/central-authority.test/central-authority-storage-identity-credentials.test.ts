import { CentralAuthorityIdentityCredentialsStorage } from 'classes/central-authority-class/central-authority-storage/central-authority-storage-identity-credentials/central-authority-storage-identity-credentials';
import { TSecretStoreCredentials } from 'classes/secret-storage-class/secret-storage-class.types';
import {
  CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME,
  CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME,
} from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity.const';
import { generateUUID } from 'utils/identity-utils/identity-utils';
import CentralAuthorityIdentity from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity';
import { generateKeyPairs } from 'classes/central-authority-class/central-authority-utils-common/central-authority-util-crypto-keys/central-authority-util-crypto-keys';
import { getUserIdentityByCryptoCredentials } from 'classes/central-authority-class/central-authority-utils-common/central-authority-utils-crypto-credentials/central-authority-utils-crypto-credentials';
import { ICAUserUniqueIdentifierDescriptionWithOptionalVersion } from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity.types';
import { TCentralAuthorityUserIdentity } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';

const runCACredentialsIdentityStorageTestForCredentials = async (
  storageInstance: CentralAuthorityIdentityCredentialsStorage,
  testIdentityDescription: ICAUserUniqueIdentifierDescriptionWithOptionalVersion | TCentralAuthorityUserIdentity,
  ): Promise<boolean | undefined> => {
  const caIdentityValueTest = new CentralAuthorityIdentity(
    testIdentityDescription
  );
  const identityTest = caIdentityValueTest.toString();
    
  if (!identityTest) {
    console.error(identityTest);
    console.error('Failed to generate test identity string');
    return;
  }

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

  if (setInStorageResult instanceof Error) {
    console.error(setInStorageResult);
    return setInStorageResult;
  }

  const caCryptoCredentialsTestRead = await storageInstance.getCredentials(identityTest);

  if (caCryptoCredentialsTestRead instanceof Error) {
    console.error(caCryptoCredentialsTestRead);
    console.error('Failed to read the crypto credentials saved previosely');
    return;
  }
  if (!caCryptoCredentialsTestRead) {
    console.error('The crypto credentials saved previousely have an empty value stored');
    return;
  }

  const identityValue = getUserIdentityByCryptoCredentials(caCryptoCredentialsTestRead);

  if (identityValue instanceof Error) {
    console.error(identityValue);
    console.error('There is a broken identity value was stored');
    return;
  }
  if (identityValue !== identityTest) {
    console.error('The identity stored have a wrong value not same as stred');
    return;
  }

  return true;
};

export const runCACredentialsIdentityStorageTest = async () => {
  const conectionCredentials: TSecretStoreCredentials = {
    password: '11234',
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
  };
  const resultFirst = await runCACredentialsIdentityStorageTestForCredentials(
    storageInstance,
    testIdentityDescription
  );

  if (resultFirst !== true) {
    console.error('Test for the first credentials was failed');
    return;
  }
  console.warn('Storage identity test was succes');
};
