import { IPFS } from 'types/ipfs.types';
import { IFileStorageServiceFileAddCommonOptions } from '../../filestorage-class.types';
export interface IFileStorageClassProviderIPFSOptions {
    ipfs: IPFS;
    rootPath?: string;
}
export interface IFileStorageClassProviderIPFSFileAddOptions extends IFileStorageServiceFileAddCommonOptions {
    chunker?: string;
    cidVersion?: number;
    trickle?: boolean;
    wrapWithDirectory?: boolean;
}
export interface IFileStorageClassProviderIPFSFileGetOptions {
}
export interface IFileStorageClassProviderIPFSFileDownloadOptions extends IFileStorageClassProviderIPFSFileGetOptions {
}
//# sourceMappingURL=filestorage-class-provider-ipfs.types.d.ts.map