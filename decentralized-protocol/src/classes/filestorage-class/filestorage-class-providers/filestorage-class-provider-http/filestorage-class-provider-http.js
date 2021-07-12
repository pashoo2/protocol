import { __awaiter } from "tslib";
import { FILE_STORAGE_SERVICE_STATUS } from '../../filestorage-class.const';
import { HttpRequest, HTTP_REQUEST_MODE } from "../../../basic-classes/http-request-class-base";
import { FILE_STORAGE_PROVIDER_HTTP_TYPE, FILE_STORAGE_PROVIDER_HTTP_IDENTIFIER } from './filestorage-class-provider-http.const';
import { downloadFileByUrl } from "../../../../utils/files-utils";
export class FileStorageClassProviderHTTP {
    constructor() {
        this.type = FILE_STORAGE_PROVIDER_HTTP_TYPE;
        this.isSingleton = true;
        this.identifier = FILE_STORAGE_PROVIDER_HTTP_IDENTIFIER;
        this.add = (filename, file, options) => __awaiter(this, void 0, void 0, function* () {
            throw new Error('The HTTP provider does not supports files uploading');
        });
        this.get = (addr, options) => __awaiter(this, void 0, void 0, function* () {
            const urlNormalized = this.getFileURL(addr);
            const req = new HttpRequest(Object.assign(Object.assign({ credentials: 'include', mode: HTTP_REQUEST_MODE.CORS }, options), { url: urlNormalized }));
            const result = yield req.send();
            if (!(result instanceof File)) {
                throw new Error('Failed to get the file from the network');
            }
            return result;
        });
        this.download = (addr, options) => __awaiter(this, void 0, void 0, function* () {
            const urlNormalized = this.getFileURL(addr);
            downloadFileByUrl(urlNormalized);
        });
    }
    get status() {
        return FILE_STORAGE_SERVICE_STATUS.READY;
    }
    isFileServed(addr) {
        return addr.startsWith('/http') || this.isBlobAddr(addr);
    }
    connect(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return FILE_STORAGE_PROVIDER_HTTP_IDENTIFIER;
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    isBlobAddr(addr) {
        return addr.startsWith('/data:');
    }
    getFileURL(addr) {
        if (this.isBlobAddr(addr)) {
            return addr.slice(1);
        }
        const isHttps = addr.startsWith('/https');
        const protocol = isHttps ? 'https://' : 'http://';
        const addrWithoutPrefix = (isHttps ? addr.slice(6) : addr.slice(5)).replace(/^\W+/, '');
        const resultedUrl = `${protocol}${addrWithoutPrefix}`;
        return String(new URL(resultedUrl));
    }
}
//# sourceMappingURL=filestorage-class-provider-http.js.map