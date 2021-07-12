import { IFileStorageService, TFileStorageFileAddress } from '../../filestorage-class.types';
import { IFileStorageClassProviderIPFSOptions, IFileStorageClassProviderIPFSFileAddOptions } from './filestorage-class-provider-ipfs.types';
import { FILE_STORAGE_SERVICE_STATUS, FILE_STORAGE_SERVICE_TYPE } from '../../filestorage-class.const';
import { TFileStorageFile } from '../../filestorage-class.types';
import { IPFS, FileObject, IPFSFile } from 'types/ipfs.types';
import { UnixTime } from 'types/ipfs.types';
import { IFileStorageClassProviderIPFSFileGetOptions, IFileStorageClassProviderIPFSFileDownloadOptions } from './filestorage-class-provider-ipfs.types';
export declare class FileStorageClassProviderIPFS implements IFileStorageService<FILE_STORAGE_SERVICE_TYPE.IPFS> {
    type: FILE_STORAGE_SERVICE_TYPE;
    readonly isSingleton = true;
    readonly identifier = "IPFS";
    get status(): FILE_STORAGE_SERVICE_STATUS.READY | FILE_STORAGE_SERVICE_STATUS.NOT_READY | FILE_STORAGE_SERVICE_STATUS.ERROR;
    protected _rootPath: string;
    protected _ipfs?: IPFS;
    protected _error?: Error;
    isFileServed(addr: TFileStorageFileAddress): boolean;
    connect(options: IFileStorageClassProviderIPFSOptions): Promise<string>;
    close(): Promise<void>;
    add: (filename: string, file: TFileStorageFile, options?: IFileStorageClassProviderIPFSFileAddOptions) => Promise<TFileStorageFileAddress>;
    get: (addr: TFileStorageFileAddress, options?: IFileStorageClassProviderIPFSFileGetOptions) => Promise<File>;
    download: (addr: TFileStorageFileAddress, options?: IFileStorageClassProviderIPFSFileDownloadOptions) => Promise<void>;
    protected setOptions(options: IFileStorageClassProviderIPFSOptions): void;
    protected getFileObject(filename: string, file: TFileStorageFile): FileObject;
    protected getMultiaddr(file: IPFSFile): TFileStorageFileAddress;
    protected getFileDescription(addr: TFileStorageFileAddress): {
        cid: string;
        path: string;
    };
    protected getMSByUnix(unix?: UnixTime): number;
}
//# sourceMappingURL=filestorage-class-provider-ipfs.d.ts.map