import { FILE_STORAGE_SERVICE_STATUS, FILE_STORAGE_SERVICE_TYPE } from '../../filestorage-class.const';
import { IFileStorageClassProviderHTTPFileGetOptions, IFileStorageClassProviderHTTPFileAddOptions } from './filestorage-class-provider-http.types';
import { IFileStorageService, TFileStorageFileAddress } from '../../filestorage-class.types';
import { TFileStorageFile } from '../../filestorage-class.types';
export declare class FileStorageClassProviderHTTP implements IFileStorageService<FILE_STORAGE_SERVICE_TYPE.HTTP> {
    type: FILE_STORAGE_SERVICE_TYPE;
    readonly isSingleton = true;
    readonly identifier = "FILE_STORAGE_PROVIDER_HTTP_IDENTIFIER";
    get status(): FILE_STORAGE_SERVICE_STATUS;
    isFileServed(addr: TFileStorageFileAddress): boolean;
    connect(options: {}): Promise<string>;
    close(): Promise<void>;
    add: (filename: string, file: TFileStorageFile, options?: {}) => Promise<TFileStorageFileAddress>;
    get: (addr: TFileStorageFileAddress, options?: IFileStorageClassProviderHTTPFileGetOptions) => Promise<File>;
    download: (addr: TFileStorageFileAddress, options?: IFileStorageClassProviderHTTPFileAddOptions) => Promise<void>;
    protected isBlobAddr(addr: TFileStorageFileAddress): boolean;
    protected getFileURL(addr: TFileStorageFileAddress): string;
}
//# sourceMappingURL=filestorage-class-provider-http.d.ts.map