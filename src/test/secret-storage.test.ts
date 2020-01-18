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

  const secretStorageTwo = new SecretStorage();
  const loginTwo = 'paul1@mail.com';
  const passwordTwo = '494949494';
  const isAuthorizedTwo = await secretStorageTwo.authorize({
    login: loginTwo,
    password: passwordTwo,
  });

  if (isAuthorizedTwo instanceof Error) {
    console.error(isAuthorizedTwo);
    return isAuthorizedTwo;
  }
  console.log('isAuthorized', isAuthorized);

  const testValueTwo = '!';
  const setTestValueResultTwo = await secretStorageTwo.set(
    testValueKey,
    testValueTwo
  );

  if (setTestValueResultTwo instanceof Error) {
    console.error(setTestValueResultTwo);
    return new Error('Failed to set value by user two');
  }
  const getTestValueResultTwo = await secretStorageTwo.get(testValueKey);

  if (getTestValueResultTwo instanceof Error) {
    console.error(getTestValueResultTwo);
    return getTestValueResultTwo;
  }
  if (getTestValueResultTwo !== testValueTwo) {
    return new Error('There is a wrong value');
  }

  const getTestValueResultOne = await secretStorageNewInstance.get(
    testValueKey
  );

  if (getTestValueResultOne instanceof Error) {
    console.error(getTestValueResult);
    return getTestValueResult;
  }
  if (testValue !== getTestValueResultOne) {
    return new Error('Test value is not valid');
  }

  const unsetResult = await secretStorageNewInstance.unset(testValueKey);

  if (unsetResult instanceof Error) {
    console.error(unsetResult);
    return unsetResult;
  }

  const getTestValueResultOneNext = await secretStorage.get(testValueKey);

  if (getTestValueResultOneNext instanceof Error) {
    console.error(getTestValueResult);
    return getTestValueResult;
  }
  if (getTestValueResultOneNext) {
    return new Error('Test value must be unset');
  }
};
