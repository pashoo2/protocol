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
};

secretStorageTest();
