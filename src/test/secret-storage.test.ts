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
  //should connect because authoirized before and credentials are stored
  const connectionResult = await secretStorageNewInstance.connect();

  if (connectionResult instanceof Error) {
    console.error(connectionResult);
    return connectionResult;
  }
  console.log('is new instance connected', connectionResult);
};

secretStorageTest();
