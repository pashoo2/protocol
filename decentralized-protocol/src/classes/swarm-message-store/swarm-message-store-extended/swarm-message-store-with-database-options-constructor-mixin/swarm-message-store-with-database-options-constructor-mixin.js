import { ConstructorType } from "../../../../types/helper.types";
export class SwarmMessageStoreWithCreateDatabaseOptionsExtender {
}
export function getSwarmMessageStoreWithDatabaseOptionsConstructorExtended(BaseClass, SwarmStoreConnectorDatabaseOptionsConstructor) {
    return class SwarmStoreWithDatabaseOptionsConstructor extends BaseClass {
        _createDatabaseOptionsExtender(swarmMessageStoreOptions) {
            return (dbOptions, swarmMessageConstructor) => {
                const dbOptionsConstructed = new SwarmStoreConnectorDatabaseOptionsConstructor({
                    options: dbOptions,
                    meta: { swarmMessageStoreOptions, swarmMessageConstructor },
                });
                return dbOptionsConstructed.options;
            };
        }
    };
}
//# sourceMappingURL=swarm-message-store-with-database-options-constructor-mixin.js.map