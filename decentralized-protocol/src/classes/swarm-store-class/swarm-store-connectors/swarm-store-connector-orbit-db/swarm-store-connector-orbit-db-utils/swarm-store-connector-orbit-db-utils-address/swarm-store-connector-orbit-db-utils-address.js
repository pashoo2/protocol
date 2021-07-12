import { __awaiter } from "tslib";
import { relative } from 'path';
import OrbitDbAddress from 'orbit-db/src/orbit-db-address';
import assert from 'assert';
import { calculateHash } from '@pashoo2/crypto-utilities';
import { SWARM_STORE_CONNECTOR_ORITDB_UTILS_ADDRESS_FULL_PATH_HASH_CALC_METHOD } from './swarm-store-connector-orbit-db-utils-address.const';
import { SWARM_STORE_CONNECTOR_ORITDB_UTILS_ADDRESS_DIRECTORY_HASH_CALC_METHOD, SWARM_STORE_CONNECTOR_ORITDB_UTILS_ADDRESS_USER_ID_HASH_CALC_METHOD, SWARM_STORE_CONNECTOR_ORITDB_UTILS_ADDRESS_DBNAME_HASH_CALC_METHOD, SWARM_STORE_CONNECTOR_ORITDB_UTILS_ADDRESS_ORBITDB_PATH_PREFIX, } from './swarm-store-connector-orbit-db-utils-address.const';
export function checkIfPathStartedWithSlash(path) {
    return path.startsWith('/') || path.startsWith('\\');
}
export function addStartSlash(path) {
    if (checkIfPathStartedWithSlash(path)) {
        return path;
    }
    if (path.includes('\\') && !path.includes('/')) {
        return `\\${path}`;
    }
    return `/${path}`;
}
export function removeDuplicateOrbitDBPrefixInPath(path) {
    if (path.indexOf(SWARM_STORE_CONNECTOR_ORITDB_UTILS_ADDRESS_ORBITDB_PATH_PREFIX) !==
        path.lastIndexOf(SWARM_STORE_CONNECTOR_ORITDB_UTILS_ADDRESS_ORBITDB_PATH_PREFIX)) {
        const pathWithoutPrefixDuplication = relative(SWARM_STORE_CONNECTOR_ORITDB_UTILS_ADDRESS_ORBITDB_PATH_PREFIX, path);
        return checkIfPathStartedWithSlash(path) ? addStartSlash(pathWithoutPrefixDuplication) : pathWithoutPrefixDuplication;
    }
    return path;
}
export function swarmStoreConnectorOrbitDbUtilsAddressJoinPathParts(...parts) {
    return removeDuplicateOrbitDBPrefixInPath(OrbitDbAddress.join(...parts));
}
export function swarmStoreConnectorOrbitDbUtilsAddresGetAddressPartForPathPart(pathPart, alg) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield calculateHash(pathPart, alg);
        if (result instanceof Error) {
            console.error(result);
            throw new Error(result.message);
        }
        return result;
    });
}
export function swarmStoreConnectorOrbitDbUtilsAddresGetHashPathFull(fullPath) {
    return __awaiter(this, void 0, void 0, function* () {
        assert(typeof fullPath === 'string', 'Full path should be a string');
        return yield swarmStoreConnectorOrbitDbUtilsAddresGetAddressPartForPathPart(fullPath, SWARM_STORE_CONNECTOR_ORITDB_UTILS_ADDRESS_FULL_PATH_HASH_CALC_METHOD);
    });
}
export function swarmStoreConnectorOrbitDbUtilsAddresGetAddressPartForUserId(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        assert(typeof userId === 'string', 'User id should be a string');
        return yield swarmStoreConnectorOrbitDbUtilsAddresGetAddressPartForPathPart(userId, SWARM_STORE_CONNECTOR_ORITDB_UTILS_ADDRESS_USER_ID_HASH_CALC_METHOD);
    });
}
export function swarmStoreConnectorOrbitDbUtilsAddresGetAddressPartForDirectory(directory) {
    return __awaiter(this, void 0, void 0, function* () {
        assert(typeof directory === 'string', 'Directory shoult be a string');
        return yield swarmStoreConnectorOrbitDbUtilsAddresGetAddressPartForPathPart(directory, SWARM_STORE_CONNECTOR_ORITDB_UTILS_ADDRESS_DIRECTORY_HASH_CALC_METHOD);
    });
}
export function swarmStoreConnectorOrbitDbUtilsAddresGetAddressPartForDb(dbName) {
    return __awaiter(this, void 0, void 0, function* () {
        assert(typeof dbName === 'string', 'Database name shoult be a string');
        return yield swarmStoreConnectorOrbitDbUtilsAddresGetAddressPartForPathPart(dbName, SWARM_STORE_CONNECTOR_ORITDB_UTILS_ADDRESS_DBNAME_HASH_CALC_METHOD);
    });
}
export function swarmStoreConnectorOrbitDbUtilsAddressCreateRootPath(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { directory, userId } = options;
        const directoryHash = yield swarmStoreConnectorOrbitDbUtilsAddresGetAddressPartForDirectory(directory);
        const userIdHash = yield swarmStoreConnectorOrbitDbUtilsAddresGetAddressPartForUserId(userId);
        return swarmStoreConnectorOrbitDbUtilsAddressJoinPathParts(directoryHash, userIdHash);
    });
}
export function swarmStoreConnectorOrbitDbUtilsAddressGetValidPath(path) {
    return swarmStoreConnectorOrbitDbUtilsAddressJoinPathParts(path);
}
export function swarmStoreConnectorOrbitDbUtilsAddressGetDBNameByAddress(path) {
    try {
        return OrbitDbAddress.parseAddress(swarmStoreConnectorOrbitDbUtilsAddressGetValidPath(path)).path;
    }
    catch (err) {
        console.error('Cant parse the path', err);
    }
}
export function swarmStoreConnectorOrbitDbUtilsAddressCreateOrbitDbAddressByDatabaseName(rootPath, dbName) {
    return __awaiter(this, void 0, void 0, function* () {
        const dbNamePathPart = yield swarmStoreConnectorOrbitDbUtilsAddresGetAddressPartForDb(dbName);
        return swarmStoreConnectorOrbitDbUtilsAddressJoinPathParts(rootPath, dbNamePathPart);
    });
}
//# sourceMappingURL=swarm-store-connector-orbit-db-utils-address.js.map