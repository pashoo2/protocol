/// <reference types="node" />
import { IFileStorageClassProviderIPFSOptions } from './filestorage-class-providers/filestorage-class-provider-ipfs';
import { IFileStorageClassProviderHTTPFileDownloadOptions, IFileStorageClassProviderHTTPOptions } from './filestorage-class-providers/filestorage-class-provider-http/filestorage-class-provider-http.types';
import { IFileStorageClassProviderIPFSFileDownloadOptions } from './filestorage-class-providers/filestorage-class-provider-ipfs/filestorage-class-provider-ipfs.types';
import { FILE_STORAGE_SERVICE_TYPE } from './filestorage-class.const';
import { IFileStorageClassProviderIPFSFileAddOptions, IFileStorageClassProviderIPFSFileGetOptions } from './filestorage-class-providers/filestorage-class-provider-ipfs/filestorage-class-provider-ipfs.types';
import { IFileStorageClassProviderHTTPFileGetOptions, IFileStorageClassProviderHTTPFileAddOptions } from './filestorage-class-providers/filestorage-class-provider-http/filestorage-class-provider-http.types';
import { FILE_STORAGE_SERVICE_TYPE as FileStorageServiceType, FILE_STORAGE_SERVICE_STATUS as FileStorageServiceStatus } from './filestorage-class.const';
export declare type TFileStorageServiceOptions<T extends FILE_STORAGE_SERVICE_TYPE> = T extends FILE_STORAGE_SERVICE_TYPE.IPFS ? IFileStorageClassProviderIPFSOptions : T extends FILE_STORAGE_SERVICE_TYPE.HTTP ? IFileStorageClassProviderHTTPOptions : never;
export declare type TFileStorageServiceFileAddOptions = IFileStorageClassProviderIPFSFileAddOptions | IFileStorageClassProviderHTTPFileAddOptions;
export declare type TFileStorageServiceFileGetOptions = IFileStorageClassProviderIPFSFileGetOptions | IFileStorageClassProviderHTTPFileGetOptions;
export declare type TFileStorageServiceFileDownloadOptions = IFileStorageClassProviderHTTPFileDownloadOptions | IFileStorageClassProviderIPFSFileDownloadOptions;
export interface IFileStorageServiceFileAddCommonOptions {
    progress?: (progress: number) => any;
}
export declare type TFileStorageFile = ArrayBuffer | Buffer | Blob | File;
export declare type TFileStorageFileAddress = string;
export declare type TFileStorageServiceIdentifier = string;
export interface IFileStorageService<T extends FILE_STORAGE_SERVICE_TYPE> {
    status: FileStorageServiceStatus;
    type: FileStorageServiceType;
    identifier: TFileStorageServiceIdentifier;
    isSingleton: boolean;
    connect(options: TFileStorageServiceOptions<T>): Promise<TFileStorageServiceIdentifier>;
    close(): Promise<void>;
    isFileServed(addr: TFileStorageFileAddress): boolean;
    add(filename: string, file: TFileStorageFile, options?: IFileStorageServiceFileAddCommonOptions): Promise<TFileStorageFileAddress>;
    get(addr: TFileStorageFileAddress, options?: TFileStorageServiceFileGetOptions): Promise<File>;
    download(addr: TFileStorageFileAddress, options?: TFileStorageServiceFileDownloadOptions): Promise<void>;
}
export interface IFileStorageServiceConnectOptions<T extends FILE_STORAGE_SERVICE_TYPE> {
    type: FileStorageServiceType;
    options: TFileStorageServiceOptions<T>;
}
export interface IFileStorage<T extends FILE_STORAGE_SERVICE_TYPE> {
    connect(configurations: IFileStorageServiceConnectOptions<T>[]): Promise<TFileStorageServiceIdentifier[]>;
    close(serviceId: TFileStorageServiceIdentifier): Promise<void>;
    add(service: TFileStorageServiceIdentifier | T, filename: string, file: TFileStorageFile, options?: TFileStorageServiceFileAddOptions): Promise<TFileStorageFileAddress>;
    get(addr: TFileStorageFileAddress, options?: TFileStorageServiceFileGetOptions): Promise<File>;
    download(addr: TFileStorageFileAddress, options?: TFileStorageServiceFileDownloadOptions): Promise<void>;
}
//# sourceMappingURL=filestorage-class.types.d.ts.map