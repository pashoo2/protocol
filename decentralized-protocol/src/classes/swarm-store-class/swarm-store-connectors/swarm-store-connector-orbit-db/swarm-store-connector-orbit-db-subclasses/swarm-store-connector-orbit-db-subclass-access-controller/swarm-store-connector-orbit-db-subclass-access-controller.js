import { __awaiter } from "tslib";
import OrbitDBAccessController from 'orbit-db-access-controllers/src/orbitdb-access-controller';
import { SWARM_STORE_CONNECTOR_ORBITDB_SUBCLASS_ACCESS_CONTROLLER_LOG_PREFIX, SWARM_STORE_CONNECTOR_ORBITDB_SUBCLASS_ACCESS_CONTROLLER_TYPE, } from './swarm-store-connector-orbit-db-subclass-access-controller.const';
export function getControllerAddressByOptions(options) {
    return options.address || options.name || 'default-access-controller';
}
export class SwarmStoreConnectorOrbitDBSubclassAccessController extends OrbitDBAccessController {
    constructor(orbitdb, __options = {}) {
        super(orbitdb, __options);
        this.__options = __options;
        this.__isPublic = false;
        this.__setOptions(__options);
    }
    static get type() {
        return SWARM_STORE_CONNECTOR_ORBITDB_SUBCLASS_ACCESS_CONTROLLER_TYPE;
    }
    static create(orbitdb, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const ac = new SwarmStoreConnectorOrbitDBSubclassAccessController(orbitdb, options);
            yield ac.load(getControllerAddressByOptions(options));
            if (options.write && !options.address) {
                yield Promise.all(options.write.map((e) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        yield ac.grant('write', e);
                    }
                    catch (err) {
                        console.error(err);
                    }
                })));
            }
            return ac;
        });
    }
    grant(capability, key) {
        const _super = Object.create(null, {
            grant: { get: () => super.grant }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.grant.call(this, capability, key);
        });
    }
    canAppend(entry, identityProvider) {
        const _super = Object.create(null, {
            canAppend: { get: () => super.canAppend }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!_super.canAppend.call(this, entry, identityProvider)) {
                    return false;
                }
                if (!this.__validateEntryFormat(entry)) {
                    console.warn(`${SWARM_STORE_CONNECTOR_ORBITDB_SUBCLASS_ACCESS_CONTROLLER_LOG_PREFIX}::entry have an unknown format`);
                    return false;
                }
                const { __options, __isPublic: _isPublic } = this;
                if (_isPublic) {
                    return yield this.__verifyAccess(entry);
                }
                if (!__options) {
                    return false;
                }
                const { identity } = entry;
                const { id: userPerformedActionOnEntryId } = identity;
                const { write: accessListForUsers } = __options;
                if (accessListForUsers &&
                    userPerformedActionOnEntryId !== '*' &&
                    accessListForUsers.includes(userPerformedActionOnEntryId)) {
                    return yield this.__verifyAccess(entry);
                }
                return false;
            }
            catch (err) {
                console.error(err);
                return false;
            }
        });
    }
    __validateEntryFormat(entry) {
        if (!entry || typeof entry !== 'object') {
            return false;
        }
        const { identity, payload } = entry;
        const { id } = identity;
        if (!id) {
            return false;
        }
        if (payload === undefined) {
            return false;
        }
        return true;
    }
    __verifyAccess(entry) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { identity, payload, clock } = entry;
                const { value, key, op } = payload;
                const { id: userId } = identity;
                const { __grantAccessCallback } = this;
                if (typeof __grantAccessCallback === 'function') {
                    return yield __grantAccessCallback(value, userId, key, op, clock.time);
                }
                return true;
            }
            catch (err) {
                console.error(new Error('SwarmStoreConnectorOrbitDbAccessController::__verifyAccess::throw'));
                console.error(err);
                return false;
            }
        });
    }
    __setOptions(options) {
        if (options) {
            const { write, grantAccess } = options;
            if (write instanceof Array) {
                if (write.includes('*')) {
                    this.__isPublic = true;
                }
            }
            else {
                console.warn(`${SWARM_STORE_CONNECTOR_ORBITDB_SUBCLASS_ACCESS_CONTROLLER_LOG_PREFIX}::Noone have access on the database`);
            }
            if (typeof grantAccess === 'function') {
                if (grantAccess.length < 2) {
                    console.warn(`${SWARM_STORE_CONNECTOR_ORBITDB_SUBCLASS_ACCESS_CONTROLLER_LOG_PREFIX}::A grant access callback must receives at least 2 arguments generally, but receives ${grantAccess.length}`);
                }
                this.__grantAccessCallback = grantAccess;
            }
            this.__options = options;
        }
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const options = this.__options;
            if (!options) {
                throw new Error('Options are not defined for the access controller');
            }
            return {
                address: getControllerAddressByOptions(options),
            };
        });
    }
}
//# sourceMappingURL=swarm-store-connector-orbit-db-subclass-access-controller.js.map