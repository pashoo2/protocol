import { IFileStorageClassProviderIPFSOptions } from './filestorage-class-providers/filestorage-class-provider-ipfs';
import {
  IFileStorageClassProviderHTTPFileDownloadOptions,
  IFileStorageClassProviderHTTPOptions,
} from './filestorage-class-providers/filestorage-class-provider-http/filestorage-class-provider-http.types';
import { IFileStorageClassProviderIPFSFileDownloadOptions } from './filestorage-class-providers/filestorage-class-provider-ipfs/filestorage-class-provider-ipfs.types';
import { FILE_STORAGE_SERVICE_TYPE } from './filestorage-class.const';
import {
  IFileStorageClassProviderIPFSFileAddOptions,
  IFileStorageClassProviderIPFSFileGetOptions,
} from './filestorage-class-providers/filestorage-class-provider-ipfs/filestorage-class-provider-ipfs.types';
import {
  IFileStorageClassProviderHTTPFileGetOptions,
  IFileStorageClassProviderHTTPFileAddOptions,
} from './filestorage-class-providers/filestorage-class-provider-http/filestorage-class-provider-http.types';
import {
  FILE_STORAGE_SERVICE_TYPE as FileStorageServiceType,
  FILE_STORAGE_SERVICE_STATUS as FileStorageServiceStatus,
} from './filestorage-class.const';

export type TFileStorageServiceOptions<T extends FILE_STORAGE_SERVICE_TYPE> = T extends FILE_STORAGE_SERVICE_TYPE.IPFS
  ? IFileStorageClassProviderIPFSOptions
  : T extends FILE_STORAGE_SERVICE_TYPE.HTTP
  ? IFileStorageClassProviderHTTPOptions
  : never;

export type TFileStorageServiceFileAddOptions =
  | IFileStorageClassProviderIPFSFileAddOptions
  | IFileStorageClassProviderHTTPFileAddOptions;

export type TFileStorageServiceFileGetOptions =
  | IFileStorageClassProviderIPFSFileGetOptions
  | IFileStorageClassProviderHTTPFileGetOptions;

export type TFileStorageServiceFileDownloadOptions =
  | IFileStorageClassProviderHTTPFileDownloadOptions
  | IFileStorageClassProviderIPFSFileDownloadOptions;

export interface IFileStorageServiceFileAddCommonOptions {
  progress?: (progress: number) => any;
}

export type TFileStorageFile = ArrayBuffer | Buffer | Blob | File;

/**
 * multiaddr or address in the ipfs:
 * '/ipfs/QmXEmhrMpbVvTh61FNAxP9nU7ygVtyvZA8HZDUaqQCAb66',
 * '/ipfs/QmXEmhrMpbVvTh61FNAxP9nU7ygVtyvZA8HZDUaqQCAb66/a.txt'
 * or if http file:
 * '/http/server.com:3000/download/file.pdf',
 * '/https/upload.com/?d=f'
 */
export type TFileStorageFileAddress = string;

/**
 * unique identifier of the service connected to,
 * may be an url or another string
 */
export type TFileStorageServiceIdentifier = string;

export interface IFileStorageService<T extends FILE_STORAGE_SERVICE_TYPE> {
  /**
   * the current status of the service
   *
   * @type {FileStorageServiceStatus}
   * @memberof IFileStorageService
   */
  status: FileStorageServiceStatus;
  /**
   * type of the service
   *
   * @type {FileStorageServiceType}
   * @memberof IFileStorageService
   */
  type: FileStorageServiceType;
  /**
   * unique name of the service, maybe url
   *
   * @type {TFileStorageServiceIdentifier}
   * @memberof IFileStorageService
   */
  identifier: TFileStorageServiceIdentifier;
  /**
   * is only the one implementation is allowed
   *
   * @type {boolean}
   * @memberof IFileStorageService
   */
  isSingleton: boolean;
  /**
   * initialize connection with the service
   *
   * @param {TFileStorageServiceOptions} options
   * @returns {Promise<TFileStorageServiceIdentifier>}
   * @memberof IFileStorageService
   */
  connect(options: TFileStorageServiceOptions<T>): Promise<TFileStorageServiceIdentifier>;
  /**
   * close connection to the service
   *
   * @returns {Promise<void>}
   * @memberof IFileStorageService
   */
  close(): Promise<void>;
  /**
   * check whether a file with the address
   * is served by the service.
   *
   * @param {TFileStorageFileAddress} addr
   * @returns {boolean}
   * @memberof IFileStorageService
   */
  isFileServed(addr: TFileStorageFileAddress): boolean;
  /**
   * add the file to the service
   *
   * @param {string} filename - filename, e.g. 'file.txt'
   * @param {TFileStorageFile} file - file content
   * @param {object} [undefined] options - options, not required, specific for the service
   * @returns {Promise<TFileStorageFileAddress>} - returns an address of the file added,
   * which can be used to access the file
   * @throws
   * @memberof IFileStorageService
   */
  add(
    filename: string,
    file: TFileStorageFile,
    options?: IFileStorageServiceFileAddCommonOptions
  ): Promise<TFileStorageFileAddress>;
  /**
   * get the file
   * TODO - add download progress callback
   * @param {TFileStorageFileAddress} addr - address of the file
   * @param {object} [undefined] options - options, not required, specific for the service
   * @returns {Promise<File>} - returns file itself
   * @memberof IFileStorageService
   * @throws
   */
  get(addr: TFileStorageFileAddress, options?: TFileStorageServiceFileGetOptions): Promise<File>;
  /**
   * download the file, do net necessary
   * to read it's content
   * @param {TFileStorageFileAddress} addr
   * @param {TFileStorageServiceFileDownloadOptions} [options]
   * @returns {Promise<void>}
   * @memberof IFileStorageService
   */
  download(addr: TFileStorageFileAddress, options?: TFileStorageServiceFileDownloadOptions): Promise<void>;
}

export interface IFileStorageServiceConnectOptions<T extends FILE_STORAGE_SERVICE_TYPE> {
  /**
   * type of the service provider
   *
   * @type {FileStorageServiceType}
   * @memberof IFileStorageServiceConnectOptions
   */
  type: FileStorageServiceType;
  /**
   * options used be the service provider to
   * connect to the service
   *
   * @type {TFileStorageServiceOptions}
   * @memberof IFileStorageServiceConnectOptions
   */
  options: TFileStorageServiceOptions<T>;
}

export interface IFileStorage<T extends FILE_STORAGE_SERVICE_TYPE> {
  /**
   * connect to the file upload service
   *
   * @param {IFileStorageServiceConnectOptions} options
   * @returns {Promise<TFileStorageServiceIdentifier>}
   * @memberof IFileStorage
   */
  connect(configurations: IFileStorageServiceConnectOptions<T>[]): Promise<TFileStorageServiceIdentifier[]>;
  /**
   * close the existing connection with the service
   * have the identifier provided
   *
   * @param {TFileStorageServiceIdentifier} service - service identifier
   * @returns {Promise<void>}
   * @memberof IFileStorage
   */
  close(serviceId: TFileStorageServiceIdentifier): Promise<void>;
  /**
   * add the file to the service
   *
   * @param {TFileStorageServiceIdentifier} service - service identifier connected to,
   * on which to upload the file
   * @param {string} filename - filename, e.g. 'file.txt'
   * @param {TFileStorageFile} file - file content
   * @param {object} [undefined] options - options, not required, specific for the service
   * @returns {Promise<TFileStorageFileAddress>} - returns an address of the file added,
   * which can be used to access the file
   * @throws
   * @memberof IFileStorage
   */
  add(
    service: TFileStorageServiceIdentifier | T,
    filename: string,
    file: TFileStorageFile,
    options?: TFileStorageServiceFileAddOptions
  ): Promise<TFileStorageFileAddress>;
  /**
   * get the file from the service
   *
   * @param {TFileStorageFileAddress} addr - address of the file
   * @param {object} [TFileStorageServiceIdentifier] service - service identifier connected to,
   * from which to download the file. If the identifier is not provided, then
   * it will be identified by a services connected to by the address provided.
   * @param {object} [undefined] options - options, not required, specific for the service
   * @returns {Promise<File>} - returns file donwloaded from the service
   * @memberof IFileStorage
   * @throws
   */
  get(addr: TFileStorageFileAddress, options?: TFileStorageServiceFileGetOptions): Promise<File>;
  /**
   * download the file, do net necessary
   * to read it's content
   *
   * @param {TFileStorageFileAddress} addr - file address supported by services
   * connected to
   * @param {TFileStorageServiceFileDownloadOptions} [options] - options which used
   * by the service to download the file
   * @returns {Promise<void>}
   * @memberof IFileStorage
   */
  download(addr: TFileStorageFileAddress, options?: TFileStorageServiceFileDownloadOptions): Promise<void>;
}
