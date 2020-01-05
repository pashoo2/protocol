import { SecretStorage } from 'classes/secret-storage-class';

export const runTestSecretStorage = async () => {
  const secretStorage = new SecretStorage();
  const login = 'paul@mail.com';
  const password = '494949494';
  const isAuthorized = await secretStorage.authorize({
    login,
    password,
  });

  if (isAuthorized instanceof Error) {
    console.error(isAuthorized);
    return isAuthorized;
  }
  console.log('isAuthorized', isAuthorized);

  const secretStorageNewInstance = new SecretStorage();
  // should connect because authoirized before and credentials are stored (e.g. in the session storage)
  const connectionResult = await secretStorageNewInstance.connect();

  if (connectionResult instanceof Error) {
    console.error(connectionResult);
    return connectionResult;
  }
  console.log('is new instance connected', connectionResult);

  const testValue = `@#$%^&*()_//?<>+-={}[];:'",.`;
  const testValueKey = testValue;
  const setTestValueResult = await secretStorage.set(testValueKey, testValue);

  if (setTestValueResult instanceof Error) {
    console.error(setTestValueResult);
    return setTestValueResult;
  }
  console.log('setTestValueResult', setTestValueResult);

  const getTestValueResult = await secretStorageNewInstance.get(testValueKey);

  if (getTestValueResult instanceof Error) {
    console.error(getTestValueResult);
    return getTestValueResult;
  }
  if (testValue !== getTestValueResult) {
    return new Error('Test value is not valid');
  }
  console.log('getTestValueResult', getTestValueResult);
};
