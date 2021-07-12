import { __awaiter } from "tslib";
import { FILE_STORAGE_SERVICES_IMPLEMENTATIONS } from './filestorage-class.const';
import assert from 'assert';
import path from 'path';
import { FILE_STORAGE_SERVICE_PREFIX, FILE_STORAGE_SERVICE_PREFIX_LENGTH } from './filestorage-class.const';
export class FileStorage {
    constructor() {
        this.services = new Map();
        this.servicesByTypes = new Map();
        this.connect = (configurations) => __awaiter(this, void 0, void 0, function* () {
            return Promise.all(configurations.map(this.connectToService));
        });
        this.close = (s) => __awaiter(this, void 0, void 0, function* () {
            const service = this.getServiceByTypeOrId(s);
            if (!service) {
                throw new Error(`Service with the given identifier = "${s}" was not found`);
            }
            return this.removeService(service);
        });
        this.add = (s, filename, file, options) => __awaiter(this, void 0, void 0, function* () {
            const service = this.getServiceByTypeOrId(s);
            if (!service) {
                throw new Error(`Service with the given identifier or type = "${s}" was not found`);
            }
            return this.addPrefixToFileAddress(yield service.add(filename, file, options));
        });
        this.get = (addr, options) => __awaiter(this, void 0, void 0, function* () {
            const addrWOPrefix = this.getAddrWOPrefix(addr);
            const service = this.getServiceByFileAddr(addrWOPrefix);
            if (!service) {
                throw new Error(`A file with the address "${addr}" is not supported`);
            }
            return service.get(addrWOPrefix, options);
        });
        this.connectToService = (configuration) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            assert(configuration, 'Service configuration was not provided');
            const { type, options } = configuration;
            assert(type, 'Service type must be defined');
            assert(options, `Options for the service "${type}" must be defined`);
            const ServiceConstuctor = yield this.getServiceConstructorByType(configuration.type);
            const service = new ((_a = ServiceConstuctor.default) !== null && _a !== void 0 ? _a : ServiceConstuctor)();
            yield service.connect(options);
            this.addService(type, service);
            return service.identifier;
        });
    }
    download(addr, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const addrWOPrefix = this.getAddrWOPrefix(addr);
            const service = this.getServiceByFileAddr(addrWOPrefix);
            if (!service) {
                throw new Error(`A file with the address "${addr}" is not supported`);
            }
            return service.download(addrWOPrefix, options);
        });
    }
    getAddrWOPrefix(addr) {
        if (!addr.startsWith(FILE_STORAGE_SERVICE_PREFIX)) {
            throw new Error(`Uknown address ${addr}`);
        }
        return addr.slice(FILE_STORAGE_SERVICE_PREFIX_LENGTH);
    }
    addPrefixToFileAddress(addrWOPrefix) {
        if (typeof addrWOPrefix !== 'string') {
            throw new Error('The result is not a valid file address');
        }
        return path.join(FILE_STORAGE_SERVICE_PREFIX, addrWOPrefix);
    }
    getServiceById(serviceId) {
        return this.services.get(serviceId);
    }
    getServiceByType(serviceType) {
        return this.servicesByTypes.get(serviceType);
    }
    getServiceByTypeOrId(s) {
        return this.getServiceById(s) || this.getServiceByType(s);
    }
    getServiceConstructorByType(type) {
        const constructorGetter = FILE_STORAGE_SERVICES_IMPLEMENTATIONS[type];
        return constructorGetter();
    }
    getServiceByFileAddr(addr) {
        for (const sevice of this.services.values()) {
            if (sevice.isFileServed(addr)) {
                return sevice;
            }
        }
    }
    addService(type, service) {
        this.services.set(service.identifier, service);
        this.servicesByTypes.set(type, service);
    }
    removeService(service) {
        this.services.delete(service.identifier);
        this.servicesByTypes.delete(service.type);
    }
}
//# sourceMappingURL=filestorage-class.js.map