import { SafeStorage } from 'classes/safe-storage-class';
import { ESAFE_STORAGE_STORAGE_TYPE } from 'classes/safe-storage-class/safe-storage-class.const';

export const runTest = async () => {
  const safeStorage = new SafeStorage({
    name: 'testStorage',
    credentials: {
      password: 'test_password',
    },
    storageType: ESAFE_STORAGE_STORAGE_TYPE.KEY_VALUE,
  });

  console.dir(safeStorage);

  const connectionResult = await safeStorage.connect();

  if (connectionResult instanceof Error) {
    console.error(connectionResult);
    return connectionResult;
  }
  console.dir(safeStorage);
};
