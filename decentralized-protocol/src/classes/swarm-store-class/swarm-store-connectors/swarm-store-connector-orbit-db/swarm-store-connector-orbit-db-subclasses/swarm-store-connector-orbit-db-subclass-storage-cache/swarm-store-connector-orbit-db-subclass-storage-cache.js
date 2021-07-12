import { __awaiter } from "tslib";
import { SwarmStoreConnectorOrbitDBSubclassStoreToSecretStorageAdapter } from '../swarm-store-connector-orbit-db-subclasses-cache/swarm-store-connector-orbit-db-subclass-store-to-secret-storage-adapter/swarm-store-connector-orbit-db-subclass-store-to-secret-storage-adapter';
export class SwarmStoreConnectorOrbitDBSubclassStorageCache extends SwarmStoreConnectorOrbitDBSubclassStoreToSecretStorageAdapter {
    set(k, v) {
        const _super = Object.create(null, {
            put: { get: () => super.put }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof k !== 'string') {
                throw new Error('Key must be a string');
            }
            return yield _super.put.call(this, k, v);
        });
    }
}
//# sourceMappingURL=swarm-store-connector-orbit-db-subclass-storage-cache.js.map