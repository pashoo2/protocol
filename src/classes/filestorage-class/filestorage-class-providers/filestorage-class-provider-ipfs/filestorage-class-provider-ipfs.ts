import { IFileStorageService, TFileStorageFileAddress } from '../../filestorage-class.types';
import {
  IFileStorageClassProviderIPFSOptions,
  IFileStorageClassProviderIPFSFileAddOptions,
} from './filestorage-class-provider-ipfs.types';
import { FILE_STORAGE_PROVIDER_IPFS_IDENTIFIER, FILE_STORAGE_PROVIDER_IPFS_TYPE } from './filestorage-class-provider-ipfs.const';
import { FILE_STORAGE_SERVICE_STATUS, FILE_STORAGE_SERVICE_TYPE } from '../../filestorage-class.const';
import { TFileStorageFile } from '../../filestorage-class.types';
import { extend } from 'utils';
import { getFileSize } from 'utils/files-utils';
import assert from 'assert';
import path from 'path';
import { FILE_STORAGE_PROVIDER_IPFS_FILE_UPLOAD_TIMEOUT_MS } from './filestorage-class-provider-ipfs.const';
import { IPFS, FileObject, IPFSFile } from 'types/ipfs.types';
import BufferList from 'bl';
import { FILE_STORAGE_PROVIDER_ROOT_PATH_DEFAULT } from './filestorage-class-provider-ipfs.const';
import { timeout } from 'utils';
import { UnixTime } from 'types/ipfs.types';
import { downloadFile } from '../../../../utils/files-utils/files-utils-download';
import {
  IFileStorageClassProviderIPFSFileGetOptions,
  IFileStorageClassProviderIPFSFileDownloadOptions,
} from './filestorage-class-provider-ipfs.types';

export class FileStorageClassProviderIPFS implements IFileStorageService<FILE_STORAGE_SERVICE_TYPE.IPFS> {
  public type = FILE_STORAGE_PROVIDER_IPFS_TYPE;

  public readonly isSingleton = true;

  public readonly identifier = FILE_STORAGE_PROVIDER_IPFS_IDENTIFIER;

  public get status() {
    const { _ipfs: ipfs } = this;

    if (!ipfs || !ipfs.isOnline()) {
      return FILE_STORAGE_SERVICE_STATUS.NOT_READY;
    }
    if (!ipfs.files || this._error) {
      return FILE_STORAGE_SERVICE_STATUS.ERROR;
    }
    return FILE_STORAGE_SERVICE_STATUS.READY;
  }

  /**
   * this is the prefix for path
   * of each file uploaded
   *
   * @protected
   * @type {string}
   * @memberof FileStorageClassProviderIPFS
   */
  protected _rootPath: string = FILE_STORAGE_PROVIDER_ROOT_PATH_DEFAULT;

  protected _ipfs?: IPFS;

  protected _error?: Error;

  public isFileServed(addr: TFileStorageFileAddress): boolean {
    return addr.startsWith('/ipfs');
  }

  public async connect(options: IFileStorageClassProviderIPFSOptions) {
    try {
      this.setOptions(options);
      await this._ipfs?.ready;
    } catch (err) {
      console.log(err);
      throw err;
    }
    return FILE_STORAGE_PROVIDER_IPFS_IDENTIFIER;
  }

  public async close() {
    this._ipfs = undefined;
  }

  public add = async (
    filename: string,
    file: TFileStorageFile,
    options?: IFileStorageClassProviderIPFSFileAddOptions
  ): Promise<TFileStorageFileAddress> => {
    const ipfs = this._ipfs;
    const fileSize = getFileSize(file);

    assert(this.status === FILE_STORAGE_SERVICE_STATUS.READY, 'Service is not ready to use');
    assert(fileSize, 'Failed to get a size of the file');
    let files: IPFSFile[] | Error | undefined;
    const progressCallback = options?.progress;
    let resolve: undefined | Function;
    const pending = new Promise((res, rej) => {
      resolve = res;
    });
    const opts = extend(
      options || {},
      {
        pin: false,
        cidVersion: 1,
        progress: (bytes: number) => {
          const percent = (bytes / fileSize) * 100;

          if (progressCallback) {
            progressCallback(percent);
          }
          if (resolve && percent >= 100) {
            resolve();
          }
        },
      },
      true
    );

    try {
      files = await Promise.race([
        ipfs?.add(this.getFileObject(filename, file), opts),
        timeout(FILE_STORAGE_PROVIDER_IPFS_FILE_UPLOAD_TIMEOUT_MS),
      ]);
      await pending;
    } catch (err) {
      console.error(err);
      throw err;
    }

    if (!files) {
      throw new Error('Failed to upload for an unknown reason');
    }
    if (files instanceof Error) {
      throw files;
    }
    return this.getMultiaddr(files[0]);
  };

  public get = async (addr: TFileStorageFileAddress, options?: IFileStorageClassProviderIPFSFileGetOptions): Promise<File> => {
    assert(this.status === FILE_STORAGE_SERVICE_STATUS.READY, 'Service is not ready to use');
    assert(this.isFileServed(addr), 'The file is not supported by the service');

    const ipfs = this._ipfs;
    const fileDesc = this.getFileDescription(addr);
    const filesOrChunks = await ipfs.get(fileDesc.cid);
    const content = new BufferList();
    let lastModified = 0;
    let fileBlob: ArrayBuffer | Blob[];

    if (!filesOrChunks) {
      throw new Error('Failed to read the file');
    }
    if (filesOrChunks instanceof Array) {
      const chunksLen = filesOrChunks.length;
      let idx = 0;

      while (idx < chunksLen) {
        const chunk = filesOrChunks[idx++];
        content.append(chunk.content);
        lastModified = this.getMSByUnix(chunk.mtime);
      }
      const buff = content.slice();
      fileBlob = buff.buffer.slice(buff.byteOffset, buff.byteOffset + buff.byteLength);
    } else {
      if (!filesOrChunks.content) {
        throw new Error("Failed to read the file's content");
      }
      if (filesOrChunks.content instanceof Blob) {
        fileBlob = [filesOrChunks.content];
        if (filesOrChunks.mtime) {
          lastModified = this.getMSByUnix(filesOrChunks.mtime);
        }
      } else if (typeof filesOrChunks.content === 'string') {
        content.append(filesOrChunks.content);
      }
      throw new Error('Unknown content type');
    }
    return new File([fileBlob], fileDesc.path, {
      lastModified: lastModified ? lastModified : undefined,
    });
  };

  public download = async (addr: TFileStorageFileAddress, options?: IFileStorageClassProviderIPFSFileDownloadOptions) => {
    const file = await this.get(addr, options);

    downloadFile(file);
  };

  protected setOptions(options: IFileStorageClassProviderIPFSOptions) {
    assert(options.ipfs, 'An instance of IPFS must be provided in the options');
    this._ipfs = options.ipfs;
    this._rootPath = options.rootPath || FILE_STORAGE_PROVIDER_ROOT_PATH_DEFAULT;
  }

  protected getFileObject(filename: string, file: TFileStorageFile): FileObject {
    const filePath = path.join('/', this._rootPath, filename);

    return {
      path: filePath,
      content: file,
      mtime: file instanceof File ? new Date(file.lastModified) : undefined,
    };
  }

  protected getMultiaddr(file: IPFSFile): TFileStorageFileAddress {
    return path.join('/ipfs/', file.hash, file.path);
  }

  protected getFileDescription(addr: TFileStorageFileAddress) {
    const [nothing, prefix, cid, path] = addr.split('/');

    assert(cid, 'Failed to get CID by the address');
    assert(path, 'Failed to get file path by the address');
    return {
      cid,
      path,
    };
  }

  protected getMSByUnix(unix?: UnixTime): number {
    return unix && unix.secs ? unix.secs : Date.now();
  }
}
