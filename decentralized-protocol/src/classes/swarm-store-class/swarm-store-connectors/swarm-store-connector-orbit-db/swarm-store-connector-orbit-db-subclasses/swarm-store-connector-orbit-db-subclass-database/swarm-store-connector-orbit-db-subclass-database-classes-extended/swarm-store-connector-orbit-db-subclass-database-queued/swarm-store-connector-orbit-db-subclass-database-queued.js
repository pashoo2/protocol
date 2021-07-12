import { __awaiter } from "tslib";
import { SwarmStoreConnectorOrbitDBDatabase } from '../../swarm-store-connector-orbit-db-subclass-database';
import { ArgumentTypes } from "../../../../../../../../types/helper.types";
import { asyncQueueConcurrentMixinDefault, IAsyncQueueConcurrentWithAutoExecution, } from "../../../../../../../basic-classes/async-queue-class-base";
import { SWARM_STORE_CONNECTOR_ORBIT_DB_SUBCLASS_DATABASE_QUEUED_CRUD_OPERATIONS_TIMEOUTS_MS, SWARM_STORE_CONNECTOR_ORBIT_DB_SUBCLASS_DATABASE_QUEUED_OPERATIONS_DEFAULT_TIMEOUT_MS, } from './swarm-store-connector-orbit-db-subclass-database-queued.const';
export class SwarmStoreConnectorOrbitDBDatabaseQueued extends asyncQueueConcurrentMixinDefault(SwarmStoreConnectorOrbitDBDatabase, SWARM_STORE_CONNECTOR_ORBIT_DB_SUBCLASS_DATABASE_QUEUED_OPERATIONS_DEFAULT_TIMEOUT_MS) {
    constructor() {
        super(...arguments);
        this.connect = (...args) => __awaiter(this, void 0, void 0, function* () {
            yield this._rejectAllPendingOperationsOnDbOpen();
            return yield super.connect(...args);
        });
        this.close = (...args) => __awaiter(this, void 0, void 0, function* () {
            yield this._rejectAllPendingOperationsOnDbClose();
            return yield super.close(...args);
        });
        this.drop = (...args) => __awaiter(this, void 0, void 0, function* () {
            yield this._rejectAllPendingOperationsOnDbDrop();
            return yield super.drop(...args);
        });
        this.load = (...args) => __awaiter(this, void 0, void 0, function* () {
            return yield this._runAsJob(() => super.load(...args), 'load');
        });
        this.add = (...args) => __awaiter(this, void 0, void 0, function* () {
            return yield this._runAsJob(() => super.add(...args), 'add', SWARM_STORE_CONNECTOR_ORBIT_DB_SUBCLASS_DATABASE_QUEUED_CRUD_OPERATIONS_TIMEOUTS_MS.ADD);
        });
        this.get = (...args) => __awaiter(this, void 0, void 0, function* () {
            return yield this._runAsJob(() => super.get(...args), 'get', SWARM_STORE_CONNECTOR_ORBIT_DB_SUBCLASS_DATABASE_QUEUED_CRUD_OPERATIONS_TIMEOUTS_MS.GET);
        });
        this.remove = (...args) => __awaiter(this, void 0, void 0, function* () {
            return yield this._runAsJob(() => super.remove(...args), 'remove', SWARM_STORE_CONNECTOR_ORBIT_DB_SUBCLASS_DATABASE_QUEUED_CRUD_OPERATIONS_TIMEOUTS_MS.REMOVE);
        });
        this.iterator = (...args) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if ((_a = args[0]) === null || _a === void 0 ? void 0 : _a.fromCache) {
                return yield super.iterator(...args);
            }
            return yield this._runAsJob(() => super.iterator(...args), 'iterator', SWARM_STORE_CONNECTOR_ORBIT_DB_SUBCLASS_DATABASE_QUEUED_CRUD_OPERATIONS_TIMEOUTS_MS.ITERATE);
        });
    }
    _rejectAllPendingOperationsOnDbClose() {
        return this._rejectAllPendingOperations(new Error('Database closed'));
    }
    _rejectAllPendingOperationsOnDbOpen() {
        return this._rejectAllPendingOperations(new Error('Database opened again'));
    }
    _rejectAllPendingOperationsOnDbDrop() {
        return this._rejectAllPendingOperations(new Error('Database dropped'));
    }
}
//# sourceMappingURL=swarm-store-connector-orbit-db-subclass-database-queued.js.map