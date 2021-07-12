import assert from 'assert';
export function createSwarmMessageStoreDBOWithOptionsExtenderFabric(BaseClass, databaseOptionsExtenderFabric) {
    assert(databaseOptionsExtenderFabric, 'Opions extender fabric is not provided');
    assert(typeof databaseOptionsExtenderFabric === 'function', 'Options extender fabric should be a function');
    class SwarmMessageStoreDBOWithExtendedGrandAccessClass {
        constructor(params) {
            const { meta, options: dbOptions } = params;
            const { swarmMessageConstructor, swarmMessageStoreOptions } = meta;
            const optionsExtender = this.__createdOptionsExtender(swarmMessageStoreOptions);
            const dbOptionsExtended = this.__extendDatabaseOptions(dbOptions, swarmMessageConstructor, optionsExtender);
            const paramsWithExtendedDbOptions = Object.assign(Object.assign({}, params), { options: dbOptionsExtended });
            const dboClassInstance = new BaseClass(paramsWithExtendedDbOptions);
            return dboClassInstance;
        }
        __createdOptionsExtender(swarmMessageStoreOptions) {
            return databaseOptionsExtenderFabric(swarmMessageStoreOptions);
        }
        __extendDatabaseOptions(dbOptions, swarmMessageConstructor, optionsExtender) {
            const dbOptionsCopy = Object.assign({}, dbOptions);
            return optionsExtender(dbOptionsCopy, swarmMessageConstructor);
        }
    }
    return SwarmMessageStoreDBOWithExtendedGrandAccessClass;
}
//# sourceMappingURL=swarm-message-store-connector-db-options-with-options-extender-class-fabric.js.map