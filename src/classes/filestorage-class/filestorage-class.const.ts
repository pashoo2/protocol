import { FileStorageClassProviderIPFS } from './filestorage-class-providers/filestorage-class-provider-ipfs/filestorage-class-provider-ipfs';
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
  AMAZONS3 = 'AMAZONS3',
  AZUREBLOB = 'AZUREBLOB',
}

export const FILE_STORAGE_SERVICES_IMPLEMENTATIONS = {
  [FILE_STORAGE_SERVICE_TYPE.IPFS]: FileStorageClassProviderIPFS,
};
