// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const checkIsStorageProviderInstance = (
  storageProviderInstance: any
): Error | boolean => {
  if (!storageProviderInstance || typeof storageProviderInstance !== 'object') {
    return new Error('Storage provider must be an object');
  }

  const { connect, get, set, disconnect } = storageProviderInstance;

  if (
    typeof connect !== 'function' ||
    typeof get !== 'function' ||
    typeof set !== 'function' ||
    typeof disconnect !== 'function'
  ) {
    return new Error(
      'The instance has a wrong implemntation of a StorageProvider interface'
    );
  }
  return true;
};
