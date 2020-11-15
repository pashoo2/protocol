import { ISecretStoreCredentials, TSecretStorageAuthorizazionOptions } from '../../secret-storage-class.types';

export const isSecretStoreCredentials = (
  credentials: TSecretStorageAuthorizazionOptions
): credentials is ISecretStoreCredentials => {
  if (typeof credentials === 'object') {
    const { login, password } = credentials as ISecretStoreCredentials;
    return Boolean(typeof login === 'string' && typeof password === 'string' && login && password);
  }
  return false;
};
