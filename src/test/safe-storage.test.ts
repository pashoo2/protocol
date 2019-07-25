import { SafeStorage } from 'classes/safe-storage-class';
import { ESAFE_STORAGE_STORAGE_TYPE } from 'classes/safe-storage-class/safe-storage-class.const';

export const runTestAppendLogStorage = async () => {
  const safeStorageAppendLog = new SafeStorage({
    name: 'testStorage',
    credentials: {
      password: 'test_password',
    },
    storageType: ESAFE_STORAGE_STORAGE_TYPE.APPEND_LOG,
  });

  console.dir(safeStorageAppendLog);

  const connectionResult = await safeStorageAppendLog.connect();

  if (connectionResult instanceof Error) {
    console.error(connectionResult);
    return connectionResult;
  }
  console.dir(safeStorageAppendLog);

  const pushDataResult = await safeStorageAppendLog.set({ hello: new Date() });

  if (pushDataResult instanceof Error) {
    return pushDataResult;
  }

  const pushNewDataResult = await safeStorageAppendLog.set({
    newHello: new Date(),
  });

  if (pushNewDataResult instanceof Error) {
    return pushNewDataResult;
  }

  console.log('data was pushed in append log storage');
};

export const runTestKeyValueStorage = async () => {
  const safeStorage = new SafeStorage({
    name: 'testStorageKeyValue',
    credentials: {
      password: 'test_password_KV',
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

  const pushDataResult = await safeStorage.set(
    { hello: new Date() },
    `${new Date()}`
  );

  if (pushDataResult instanceof Error) {
    return pushDataResult;
  }

  const pushNewDataResult = await safeStorage.set(
    { hello: new Date() },
    `${new Date()}|||new`
  );

  if (pushNewDataResult instanceof Error) {
    return pushNewDataResult;
  }
  console.log('data was pushed in key value storage');
};

export const runTest = async () => {
  await runTestKeyValueStorage();
  // await Promise.all([runTestAppendLogStorage(), runTestKeyValueStorage()]);
};
