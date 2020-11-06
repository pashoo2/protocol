import { IFileStorageService } from './filestorage-class.types';
/**
 * status of a service
 *
 * @export
 * @enum {number}
 */
export enum FILE_STORAGE_SERVICE_STATUS {
  /**
   * ready to use
   */
  READY = 'READY',
  /**
   * connecting to the service
   */
  CONNECTING = 'CONNECTING',
  /**
   * not ready - may be disconnected or still not connected to
   */
  NOT_READY = 'NOT_READY',
  /**
   * fault on connecting or file uploading
   * and means that the service can't be used
   * anymore
   */
  ERROR = 'ERROR',
}

/**
 * service type
 *
 * @export
 * @enum {number}
 */
export enum FILE_STORAGE_SERVICE_TYPE {
  IPFS = 'IPFS',
  HTTP = 'HTTP',
  // will be added in the feature
  // AMAZONS3 = 'AMAZONS3',
  // AZUREBLOB = 'AZUREBLOB',
}

// implementations of the services.
// will be loaded only if required
export const FILE_STORAGE_SERVICES_IMPLEMENTATIONS: Record<
  FILE_STORAGE_SERVICE_TYPE,
  () => Promise<any> // Promise<new () => IFileStorageService<any>>
> = {
  [FILE_STORAGE_SERVICE_TYPE.IPFS]: () => import('./filestorage-class-providers/filestorage-class-provider-ipfs'),
  [FILE_STORAGE_SERVICE_TYPE.HTTP]: () => import('./filestorage-class-providers/filestorage-class-provider-http'),
};

export const FILE_STORAGE_SERVICE_PREFIX = '/file';

export const FILE_STORAGE_SERVICE_PREFIX_LENGTH = FILE_STORAGE_SERVICE_PREFIX.length;
