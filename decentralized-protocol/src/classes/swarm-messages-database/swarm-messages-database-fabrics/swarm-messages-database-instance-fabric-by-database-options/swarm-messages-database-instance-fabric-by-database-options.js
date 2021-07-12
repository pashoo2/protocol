import { swarmMessagesDatabaseConnectedFabricMain } from '../swarm-messages-database-intstance-fabric-main';
export function getSwarmMessagesDatabaseConnectedInstanceFabricByDatabaseOptions(options, SwarmMessagesDatabaseClassBase) {
    return function swarmMessagesDatabaseConnectedInstanceFabricByDatabaseOptions(dbo) {
        return swarmMessagesDatabaseConnectedFabricMain(Object.assign(Object.assign({}, options), { dbOptions: dbo }), SwarmMessagesDatabaseClassBase);
    };
}
//# sourceMappingURL=swarm-messages-database-instance-fabric-by-database-options.js.map