import { SecretStorage } from 'classes/secret-storage-class';

const secretStorageTest = async () => {
  const secretStorage = new SecretStorage();
  const password = '494949494';
  const isAuthorized = await secretStorage.authorize({
    password,
  });

  if (isAuthorized instanceof Error) {
    console.error(isAuthorized);
    return isAuthorized;
  }
  console.log('isAuthorized', isAuthorized);

  const secretStorageNewInstance = new SecretStorage();
  //should connect because authoirized before and credentials are stored (e.g. in the session storage)
  const connectionResult = await secretStorageNewInstance.connect();

  if (connectionResult instanceof Error) {
    console.error(connectionResult);
    return connectionResult;
  }
  console.log('is new instance connected', connectionResult);

  const testValue = 'testy value for the secret storage';
  const testValueKey = 'test_value';
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
  console.log('getTestValueResult', getTestValueResult);
  console.log('is valid', testValue === getTestValueResult);
};

secretStorageTest();
