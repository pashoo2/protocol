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
import {
  FILE_STORAGE_PROVIDER_IPFS_FILE_UPLOAD_TIMEOUT_MS,
  FILE_STORAGE_PROVIDER_EVENTS,
} from './filestorage-class-provider-ipfs.const';
import { IPFS, FileObject, IPFSFile } from 'types/ipfs.types';
import BufferList from 'bl';
import TypedEmitter from 'typed-emitter';
import { TFileStorageEvents } from './filestorage-class-provider-ipfs.types';
import { EventEmitter } from 'events';
import { FILE_STORAGE_PROVIDER_ROOT_PATH_DEFAULT } from './filestorage-class-provider-ipfs.const';
import { timeout } from '../../../../utils/common-utils/common-utils-timer';

export class FileStorageClassProviderIPFS implements IFileStorageService {
  public type = FILE_STORAGE_PROVIDER_IPFS_TYPE;

  public readonly isSingleton = true;

  public readonly identifier = FILE_STORAGE_PROVIDER_IPFS_IDENTIFIER;

  public emitter = new EventEmitter() as TypedEmitter<TFileStorageEvents>;

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
    this.emitter.emit(FILE_STORAGE_PROVIDER_EVENTS.CONNECTING);
    try {
      this.setOptions(options);
      await this._ipfs?.ready;
    } catch (err) {
      console.log(err);
      this.emitter.emit(FILE_STORAGE_PROVIDER_EVENTS.CONENCTION_ERROR, err);
      throw err;
    }
    this.emitter.emit(FILE_STORAGE_PROVIDER_EVENTS.CONNECTED);
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

    assert(
      this.status === FILE_STORAGE_SERVICE_STATUS.READY,
      'Service is not ready to use'
    );
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
        chunker: `size-${fileSize}`, // only a one chunk must be
        rawLeaves: true,
        progress: (bytes: number) => {
          const percent = (bytes / fileSize!) * 100;

          if (progressCallback) {
            progressCallback(percent);
          }
          debugger;
          if (resolve && percent >= 100) {
            debugger;
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
      debugger;
      await pending;
      debugger;
    } catch (err) {
      debugger;
      console.error(err);
      throw err;
    }

    if (!files) {
      throw new Error('Failed to upload for an unknown reason');
    }
    if (files instanceof Error) {
      throw files;
    }
    debugger;
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
    this._rootPath =
      options.rootPath || FILE_STORAGE_PROVIDER_ROOT_PATH_DEFAULT;
  }

  protected getFileObject(
    filename: string,
    file: TFileStorageFile
  ): FileObject {
    const filePath = path.join('/', this._rootPath, filename);

    return {
      path: filePath,
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
