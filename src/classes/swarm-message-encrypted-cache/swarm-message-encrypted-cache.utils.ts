import { SwarmMessageEncryptedCache } from './swarm-messgae-encrypted-cache';
import { TSecretStorageAuthOptionsCredentials } from '../secret-storage-class/secret-storage-class.types';
import { SecretStorage } from '../secret-storage-class/secret-storage-class';
import { IISecretStorageOptions } from '../secret-storage-class/secret-storage-class.types';
import {
  ISwarmMessageEncryptedCacheFabric,
  ISwarmMessageConstructorWithEncryptedCacheFabric,
} from './swarm-message-encrypted-cache.types';
import { TSwarmMessageConstructorOptions } from '../swarm-message/swarm-message-constructor.types';
import { SwarmMessageConstructor } from '../swarm-message/swarm-message-constructor';
import { extend } from 'utils';

/**
 * This is utility to create a fabric for the SwarmMessageEncryptedCache
 * instances. It generates a crypto key by the credentials at once and
 * use it every time new SwarmMessageEncryptedCache generated.
 *
 * Fabric connect to the SwarmMessageEncryptedCache created instance
 * and returns it.
 *
 * @param credentials
 */
export const getSwarmMessageEncryptedCacheFabric = async (
  credentials: TSecretStorageAuthOptionsCredentials,
  dbNamePrefix?: string
): Promise<ISwarmMessageEncryptedCacheFabric> => {
  const secretStorage = new SecretStorage();
  const cryptoKey = await secretStorage.generateCryptoKey(credentials);

  if (cryptoKey instanceof Error) {
    throw cryptoKey;
  }
  return async (storageProviderOptions?: IISecretStorageOptions) => {
    const messageEncryptedCache = new SwarmMessageEncryptedCache();

    await messageEncryptedCache.connect({
      dbNamePrefix,
      storageProviderOptions,
      storageProviderAuthOptions: {
        key: cryptoKey,
      },
    });
    return messageEncryptedCache;
  };
};

/**
 * returns fabric produces swarm messge constructor
 * with encrypted cache support.
 *
 * @param credentials
 * @param constructorOptions
 * @param dbNamePrefix
 */
export const getSwarmMessageConstructorWithCacheFabric = async (
  credentials: TSecretStorageAuthOptionsCredentials,
  constructorOptions: TSwarmMessageConstructorOptions,
  dbNamePrefix?: string
): Promise<ISwarmMessageConstructorWithEncryptedCacheFabric> => {
  const encryptedCacheFabric = await getSwarmMessageEncryptedCacheFabric(credentials, dbNamePrefix);

  return async (
    swarmMessageConstructorOptions: Partial<TSwarmMessageConstructorOptions>,
    storageProviderOptions?: IISecretStorageOptions
  ) => {
    const encryptedCache =
      swarmMessageConstructorOptions.instances?.encryptedCache || (await encryptedCacheFabric(storageProviderOptions));
    const options = extend(swarmMessageConstructorOptions, {
      ...constructorOptions,
      instances: {
        ...constructorOptions.instances,
        encryptedCache,
      },
    });

    return new SwarmMessageConstructor(options);
  };
};
