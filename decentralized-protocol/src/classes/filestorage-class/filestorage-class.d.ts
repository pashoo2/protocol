import { FILE_STORAGE_SERVICE_TYPE } from './filestorage-class.const';
import { IFileStorageServiceConnectOptions, IFileStorageService } from './filestorage-class.types';
import { TFileStorageFileAddress, TFileStorageServiceFileGetOptions } from './filestorage-class.types';
import { TFileStorageServiceIdentifier, TFileStorageFile, TFileStorageServiceFileAddOptions } from './filestorage-class.types';
import { IFileStorage, TFileStorageServiceFileDownloadOptions } from './filestorage-class.types';
export declare class FileStorage<T extends FILE_STORAGE_SERVICE_TYPE> implements IFileStorage<T> {
    protected readonly services: Map<string, IFileStorageService<T>>;
    protected readonly servicesByTypes: Map<T, IFileStorageService<T>>;
    connect: (configurations: IFileStorageServiceConnectOptions<T>[]) => Promise<string[]>;
    close: (s: TFileStorageServiceIdentifier) => Promise<void>;
    add: (s: TFileStorageServiceIdentifier | T, filename: string, file: TFileStorageFile, options?: TFileStorageServiceFileAddOptions) => Promise<string>;
    get: (addr: TFileStorageFileAddress, options?: TFileStorageServiceFileGetOptions) => Promise<File>;
    download(addr: TFileStorageFileAddress, options?: TFileStorageServiceFileDownloadOptions): Promise<void>;
    protected getAddrWOPrefix(addr: TFileStorageFileAddress): string;
    protected addPrefixToFileAddress(addrWOPrefix: TFileStorageFileAddress): string;
    protected getServiceById(serviceId: TFileStorageServiceIdentifier): IFileStorageService<T>;
    protected getServiceByType(serviceType: T): IFileStorageService<T>;
    protected getServiceByTypeOrId(s: TFileStorageServiceIdentifier | T): IFileStorageService<T>;
    protected getServiceConstructorByType(type: FILE_STORAGE_SERVICE_TYPE): Promise<any>;
    protected getServiceByFileAddr(addr: TFileStorageFileAddress): IFileStorageService<T>;
    protected addService<ST extends T>(type: ST, service: IFileStorageService<ST>): void;
    protected removeService(service: IFileStorageService<T>): void;
    protected connectToService: (configuration: IFileStorageServiceConnectOptions<T>) => Promise<TFileStorageServiceIdentifier>;
}
//# sourceMappingURL=filestorage-class.d.ts.map