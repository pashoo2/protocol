import { __awaiter } from "tslib";
import { FILE_STORAGE_PROVIDER_IPFS_IDENTIFIER, FILE_STORAGE_PROVIDER_IPFS_TYPE } from './filestorage-class-provider-ipfs.const';
import { FILE_STORAGE_SERVICE_STATUS } from '../../filestorage-class.const';
import { extend } from "../../../../utils";
import { getFileSize } from "../../../../utils/files-utils";
import assert from 'assert';
import path from 'path';
import { FILE_STORAGE_PROVIDER_IPFS_FILE_UPLOAD_TIMEOUT_MS } from './filestorage-class-provider-ipfs.const';
import BufferList from 'bl';
import { FILE_STORAGE_PROVIDER_ROOT_PATH_DEFAULT } from './filestorage-class-provider-ipfs.const';
import { timeout } from "../../../../utils";
import { downloadFile } from "../../../../utils/files-utils";
export class FileStorageClassProviderIPFS {
    constructor() {
        this.type = FILE_STORAGE_PROVIDER_IPFS_TYPE;
        this.isSingleton = true;
        this.identifier = FILE_STORAGE_PROVIDER_IPFS_IDENTIFIER;
        this._rootPath = FILE_STORAGE_PROVIDER_ROOT_PATH_DEFAULT;
        this.add = (filename, file, options) => __awaiter(this, void 0, void 0, function* () {
            const ipfs = this._ipfs;
            const fileSize = getFileSize(file);
            assert(this.status === FILE_STORAGE_SERVICE_STATUS.READY, 'Service is not ready to use');
            assert(fileSize, 'Failed to get a size of the file');
            let files;
            const progressCallback = options === null || options === void 0 ? void 0 : options.progress;
            let resolve;
            const pending = new Promise((res, rej) => {
                resolve = res;
            });
            const opts = extend(options || {}, {
                pin: false,
                cidVersion: 1,
                progress: (bytes) => {
                    const percent = (bytes / fileSize) * 100;
                    if (progressCallback) {
                        progressCallback(percent);
                    }
                    if (resolve && percent >= 100) {
                        resolve();
                    }
                },
            }, true);
            try {
                files = yield Promise.race([
                    ipfs === null || ipfs === void 0 ? void 0 : ipfs.add(this.getFileObject(filename, file), opts),
                    timeout(FILE_STORAGE_PROVIDER_IPFS_FILE_UPLOAD_TIMEOUT_MS),
                ]);
                yield pending;
            }
            catch (err) {
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
        });
        this.get = (addr, options) => __awaiter(this, void 0, void 0, function* () {
            assert(this.status === FILE_STORAGE_SERVICE_STATUS.READY, 'Service is not ready to use');
            assert(this.isFileServed(addr), 'The file is not supported by the service');
            const ipfs = this._ipfs;
            const fileDesc = this.getFileDescription(addr);
            const filesOrChunks = yield ipfs.get(fileDesc.cid);
            const content = new BufferList();
            let lastModified = 0;
            let fileBlob;
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
            }
            else {
                if (!filesOrChunks.content) {
                    throw new Error("Failed to read the file's content");
                }
                if (filesOrChunks.content instanceof Blob) {
                    fileBlob = [filesOrChunks.content];
                    if (filesOrChunks.mtime) {
                        lastModified = this.getMSByUnix(filesOrChunks.mtime);
                    }
                }
                else if (typeof filesOrChunks.content === 'string') {
                    content.append(filesOrChunks.content);
                }
                throw new Error('Unknown content type');
            }
            return new File([fileBlob], fileDesc.path, {
                lastModified: lastModified ? lastModified : undefined,
            });
        });
        this.download = (addr, options) => __awaiter(this, void 0, void 0, function* () {
            const file = yield this.get(addr, options);
            downloadFile(file);
        });
    }
    get status() {
        const { _ipfs: ipfs } = this;
        if (!ipfs || !ipfs.isOnline()) {
            return FILE_STORAGE_SERVICE_STATUS.NOT_READY;
        }
        if (!ipfs.files || this._error) {
            return FILE_STORAGE_SERVICE_STATUS.ERROR;
        }
        return FILE_STORAGE_SERVICE_STATUS.READY;
    }
    isFileServed(addr) {
        return addr.startsWith('/ipfs');
    }
    connect(options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.setOptions(options);
                yield ((_a = this._ipfs) === null || _a === void 0 ? void 0 : _a.ready);
            }
            catch (err) {
                console.log(err);
                throw err;
            }
            return FILE_STORAGE_PROVIDER_IPFS_IDENTIFIER;
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            this._ipfs = undefined;
        });
    }
    setOptions(options) {
        assert(options.ipfs, 'An instance of IPFS must be provided in the options');
        this._ipfs = options.ipfs;
        this._rootPath = options.rootPath || FILE_STORAGE_PROVIDER_ROOT_PATH_DEFAULT;
    }
    getFileObject(filename, file) {
        const filePath = path.join('/', this._rootPath, filename);
        return {
            path: filePath,
            content: file,
            mtime: file instanceof File ? new Date(file.lastModified) : undefined,
        };
    }
    getMultiaddr(file) {
        return path.join('/ipfs/', file.hash, file.path);
    }
    getFileDescription(addr) {
        const [nothing, prefix, cid, path] = addr.split('/');
        assert(cid, 'Failed to get CID by the address');
        assert(path, 'Failed to get file path by the address');
        return {
            cid,
            path,
        };
    }
    getMSByUnix(unix) {
        return unix && unix.secs ? unix.secs : Date.now();
    }
}
//# sourceMappingURL=filestorage-class-provider-ipfs.js.map