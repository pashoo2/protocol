import {
  IFileStorageService,
  TFileStorageFileAddress,
} from '../../filestorage-class.types';
import {
  IFileStorageClassProviderIPFSOptions,
  IFileStorageClassProviderIPFSFileAddOptions,
} from './filestorage-class-provider-ipfs.types';
import {
  FILE_STORAGE_PROVIDER_IPFS_IDENTIFIER,
  FILE_STORAGE_PROVIDER_IPFS_TYPE,
} from './filestorage-class-provider-ipfs.const';
import { FILE_STORAGE_SERVICE_STATUS } from '../../filestorage-class.const';
import { TFileStorageFile } from '../../filestorage-class.types';
import { extend } from 'utils';
import { getFileSize } from 'utils/files-utils';
import assert from 'assert';
import path from 'path';
import { FILE_STORAGE_PROVIDER_IPFS_FILE_UPLOAD_TIMEOUT_MS } from './filestorage-class-provider-ipfs.const';
import { IPFS, FileObject, IPFSFile } from 'types/ipfs.types';
import BufferList from 'bl';

export class FileStorageClassProviderIPFS implements IFileStorageService {
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

  protected _ipfs?: IPFS;

  protected _error?: Error;

  public isFileServed(addr: TFileStorageFileAddress): boolean {
    return addr.startsWith('/ipfs');
  }

  public async connect(options: IFileStorageClassProviderIPFSOptions) {
    this.setOptions(options);
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
    const fileSize = getFileSize(file);

    assert(
      this.status === FILE_STORAGE_SERVICE_STATUS.READY,
      'Service is not ready to use'
    );
    assert(fileSize, 'Failed to get a size of the file');

    const progressCallback = options?.progressCallback;
    const files = await new Promise<IPFSFile[]>(async (res, rej) => {
      let result: IPFSFile[];
      const timeout = setTimeout(
        rej,
        FILE_STORAGE_PROVIDER_IPFS_FILE_UPLOAD_TIMEOUT_MS
      );
      const opts = extend(options || {}, {
        chunker: `size-${fileSize}`, // only a one chunk must be
        rawLeaves: true,
        progress: (bytes: number) => {
          const percent = bytes / fileSize!;

          if (progressCallback) {
            progressCallback(percent);
          }
          if (percent >= 100) {
            clearTimeout(timeout);
            res(result);
          }
        },
      });

      try {
        const res = await this._ipfs?.files.add(
          this.getFileObject(filename, file),
          opts
        );

        if (!res) {
          throw new Error('The result is empty');
        }
        result = res;
      } catch (err) {
        console.error(err);
        rej(err);
      }
    });

    return this.getMultiaddr(files[0]);
  };

  public async get(addr: TFileStorageFileAddress, options?: {}): Promise<File> {
    assert(
      this.status === FILE_STORAGE_SERVICE_STATUS.READY,
      'Service is not ready to use'
    );
    assert(this.isFileServed(addr), 'The file is not supported by the service');

    const ipfs = this._ipfs;
    const fileDesc = this.getFileDescription(addr);
    const filesOrChunks = await ipfs!.files.get(addr);
    const content = new BufferList();
    let fileBlob: ArrayBuffer;

    if (!filesOrChunks) {
      throw new Error('Failed to read the file');
    }
    if (filesOrChunks instanceof Array) {
      const chunksLen = filesOrChunks.length;
      let idx = 0;

      while (idx < chunksLen) {
        content.append(filesOrChunks[idx++].content);
      }
    } else {
      if (!filesOrChunks.content) {
        throw new Error("Failed to read the file's content");
      }
      if (filesOrChunks.content instanceof Blob) {
        return new File([filesOrChunks.content], fileDesc.path);
      } else if (typeof filesOrChunks.content === 'string') {
        content.append(filesOrChunks.content);
      }
      throw new Error('Unknown content type');
    }

    const buff = content.slice();
    const fileArrayBuff = buff.buffer.slice(
      buff.byteOffset,
      buff.byteOffset + buff.byteLength
    );

    return new File([fileArrayBuff], fileDesc.path);
  }

  protected setOptions(options: IFileStorageClassProviderIPFSOptions) {
    assert(options.ipfs, 'An instance of IPFS must be provided in the options');
    this._ipfs = options.ipfs;
  }

  protected getFileObject(
    filename: string,
    file: TFileStorageFile
  ): FileObject {
    return {
      path: path.join('/', filename),
      content: file,
    };
  }

  protected getMultiaddr(file: IPFSFile): TFileStorageFileAddress {
    return path.join('/ipfs/', file.hash, file.path);
  }

  protected getFileDescription(addr: TFileStorageFileAddress) {
    const [prefix, cid, path] = addr.split('/');

    assert(cid, 'Failed to get CID by the address');
    assert(path, 'Failed to get file path by the address');
    return {
      cid,
      path,
    };
  }
}
