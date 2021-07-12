import { __awaiter } from "tslib";
export function swarmStoreConnectorOrbitDBWithEntriesCountMixin(BaseClass) {
    return class SwarmStoreConnectorOrbitDBWithEntriesCount extends BaseClass {
        getCountEntriesLoaded(dbName) {
            return __awaiter(this, void 0, void 0, function* () {
                const connector = this.getDbConnectionExists(dbName);
                if (!connector) {
                    return new Error('Basic connector is not exists');
                }
                return connector.countEntriesLoaded;
            });
        }
        getCountEntriesAllExists(dbName) {
            return __awaiter(this, void 0, void 0, function* () {
                const connector = this.getDbConnectionExists(dbName);
                if (!connector) {
                    return new Error('Basic connector is not exists');
                }
                return connector.countEntriesAllExists;
            });
        }
    };
}
//# sourceMappingURL=swarm-store-connector-orbit-db-with-entries-count-mixin.js.map