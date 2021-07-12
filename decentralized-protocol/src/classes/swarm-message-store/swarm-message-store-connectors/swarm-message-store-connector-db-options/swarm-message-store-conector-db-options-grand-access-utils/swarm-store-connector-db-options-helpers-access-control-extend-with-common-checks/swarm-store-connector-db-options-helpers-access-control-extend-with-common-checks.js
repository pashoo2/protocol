import assert from 'assert';
import { ESwarmStoreConnector, } from '../../../../../swarm-store-class';
function getExtendedDBOptionsWithAccessControlOrbitDB(dbOptions, allowAccessForUsers, grantAccessCallback) {
    return Object.assign(Object.assign({ write: allowAccessForUsers, provider: ESwarmStoreConnector.OrbitDB }, dbOptions), { grantAccess: grantAccessCallback });
}
function swarmMessageStoreUtilsExtendOrbitDbDatabaseOptionsWithAccessControlOrbitDB(options, dbOptions, messageConstructor, allowAccessForUsers, grantAccessCallback, swarmMessageValidatorFabric) {
    const grantAccessCallbackExtendedWithMessageValidation = swarmMessageValidatorFabric(dbOptions, messageConstructor, grantAccessCallback, options.userId);
    grantAccessCallbackExtendedWithMessageValidation.toString =
        (grantAccessCallback === null || grantAccessCallback === void 0 ? void 0 : grantAccessCallback.toString.bind(grantAccessCallback)) || (() => '');
    return getExtendedDBOptionsWithAccessControlOrbitDB(dbOptions, allowAccessForUsers, grantAccessCallbackExtendedWithMessageValidation);
}
function swarmMessageStoreUtilsCreateSwarmMessageGrandAccessCommonAndExtendOrbitDbDatabaseOptionsWithAdditionalSwarmMessageAccessControl(dbOptions, allowAccessForUsers, grantAccessCallback, swarmMessageValidatorFabric) {
    const grantAccessCallbackExtendedWithMessageValidation = swarmMessageValidatorFabric(grantAccessCallback);
    return getExtendedDBOptionsWithAccessControlOrbitDB(dbOptions, allowAccessForUsers, grantAccessCallbackExtendedWithMessageValidation);
}
export const returnGACAndUsersWithWriteAccessForOrbitDbDatabase = (swarmMessageStoreOptions, dbOptions) => {
    var _a;
    const { accessControl: swarmMessageStoreOptionsAccessControl } = swarmMessageStoreOptions;
    let grantAccessCallback = swarmMessageStoreOptionsAccessControl === null || swarmMessageStoreOptionsAccessControl === void 0 ? void 0 : swarmMessageStoreOptionsAccessControl.grantAccess;
    if (typeof dbOptions.grantAccess === 'function') {
        grantAccessCallback = dbOptions.grantAccess;
    }
    const allowAccessForUsers = (_a = dbOptions.write) !== null && _a !== void 0 ? _a : swarmMessageStoreOptionsAccessControl === null || swarmMessageStoreOptionsAccessControl === void 0 ? void 0 : swarmMessageStoreOptionsAccessControl.allowAccessFor;
    if (!grantAccessCallback) {
        throw new Error('"Grant access" callback function must be provided');
    }
    if (grantAccessCallback.length >= 3 && grantAccessCallback.length <= 5) {
        console.warn('"Grant access" callback must be a function which accepts a 3 arguments');
    }
    if (allowAccessForUsers) {
        assert(allowAccessForUsers instanceof Array, 'Users list for which access is uncinditionally granted for must be a function');
        allowAccessForUsers.forEach((userId) => assert(typeof userId === 'string', 'The user identity must be a string'));
    }
    return {
        grantAccessCallback,
        allowAccessForUsers,
    };
};
export const createSwarmMessageStoreUtilsExtenderOrbitDBDatabaseOptionsWithAccessControl = (swarmMessageStoreOptions, swarmMessageValidatorFabric) => (dbOptions, messageConstructor) => {
    const { grantAccessCallback, allowAccessForUsers } = returnGACAndUsersWithWriteAccessForOrbitDbDatabase(swarmMessageStoreOptions, dbOptions);
    return swarmMessageStoreUtilsExtendOrbitDbDatabaseOptionsWithAccessControlOrbitDB(swarmMessageStoreOptions, dbOptions, messageConstructor, allowAccessForUsers, grantAccessCallback, swarmMessageValidatorFabric);
};
export const createSwarmMessageStoreUtilsExtenderOrbitDBDatabaseOptionsWithAccessControlAndGrandAccessCallbackBoundToContext = (swarmMessageStoreOptions, swarmMessageValidatorFabricForGrandAccessCallbackBoundToContext) => (dbOptions) => {
    const { grantAccessCallback, allowAccessForUsers } = returnGACAndUsersWithWriteAccessForOrbitDbDatabase(swarmMessageStoreOptions, dbOptions);
    return swarmMessageStoreUtilsCreateSwarmMessageGrandAccessCommonAndExtendOrbitDbDatabaseOptionsWithAdditionalSwarmMessageAccessControl(dbOptions, allowAccessForUsers, grantAccessCallback, swarmMessageValidatorFabricForGrandAccessCallbackBoundToContext);
};
//# sourceMappingURL=swarm-store-connector-db-options-helpers-access-control-extend-with-common-checks.js.map