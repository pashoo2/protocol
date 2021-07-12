import { __awaiter } from "tslib";
import { checkIsError } from '../../../../utils/common-utils';
export function extendClassSwarmStoreWithEntriesCount(BaseClass) {
    return class SwarmStoreWithEntriesCount extends BaseClass {
        getCountEntriesLoaded(dbName) {
            return __awaiter(this, void 0, void 0, function* () {
                const connector = this.getConnectorOrError();
                if (checkIsError(connector)) {
                    return new Error('Connector is not exists');
                }
                return yield connector.getCountEntriesLoaded(dbName);
            });
        }
        getCountEntriesAllExists(dbName) {
            return __awaiter(this, void 0, void 0, function* () {
                const connector = this.getConnectorOrError();
                if (checkIsError(connector)) {
                    return new Error('Connector is not exists');
                }
                return yield connector.getCountEntriesAllExists(dbName);
            });
        }
    };
}
//# sourceMappingURL=swarm-store-class-with-entries-count-mixin.js.map