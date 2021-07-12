import { TSecretStorageAuthOptionsCredentials } from '../secret-storage-class/secret-storage-class.types';
import { ISwarmMessageEncryptedCacheFabric, ISwarmMessageConstructorWithEncryptedCacheFabric } from './swarm-message-encrypted-cache.types';
import { TSwarmMessageConstructorOptions } from '../swarm-message/swarm-message-constructor.types';
export declare const getSwarmMessageEncryptedCacheFabric: (credentials: TSecretStorageAuthOptionsCredentials, dbNamePrefix?: string) => Promise<ISwarmMessageEncryptedCacheFabric>;
export declare const getSwarmMessageConstructorWithCacheFabric: (credentials: TSecretStorageAuthOptionsCredentials, constructorOptions: TSwarmMessageConstructorOptions, dbNamePrefix?: string) => Promise<ISwarmMessageConstructorWithEncryptedCacheFabric>;
//# sourceMappingURL=swarm-message-encrypted-cache.utils.d.ts.map