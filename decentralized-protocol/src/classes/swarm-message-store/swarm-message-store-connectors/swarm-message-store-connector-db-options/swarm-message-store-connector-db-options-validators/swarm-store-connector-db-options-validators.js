import assert from 'assert';
export class SwarmStoreConnectorDbOptionsValidators {
    isValidSerializedOptions(dbOptionsSerialized) {
        assert(typeof dbOptionsSerialized === 'string', 'Database options serialized should be a string');
        return true;
    }
    isValidOptions(dbo) {
        var _a;
        const dbOptionsToValidate = dbo;
        assert(dbOptionsToValidate, 'Database options should be defined');
        assert(typeof dbOptionsToValidate === 'object', 'Database options should be an object');
        assert(typeof dbOptionsToValidate.dbName === 'string', 'Database name should be defined in options');
        assert(typeof ((_a = dbOptionsToValidate) === null || _a === void 0 ? void 0 : _a.grantAccess) === 'function', 'Grand access should be a function');
        return true;
    }
}
//# sourceMappingURL=swarm-store-connector-db-options-validators.js.map