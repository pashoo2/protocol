import { SwarmStoreConnectorOrbitDB } from '../../swarm-store-connector-orbit-db';
import { swarmStoreConnectorOrbitDBWithEntriesCountMixin } from './swarm-store-connector-orbit-db-with-entries-count-mixin';
export function swarmStoreConnectorOrbitDBWithEntriesCountConstructorFabric(BaseClass) {
    const ConstructorToUse = (BaseClass || SwarmStoreConnectorOrbitDB);
    return swarmStoreConnectorOrbitDBWithEntriesCountMixin(ConstructorToUse);
}
export function swarmStoreConnectorOrbitDBWithEntriesCountInstanceFabric(options, BaseClass) {
    const ConstructorToUse = swarmStoreConnectorOrbitDBWithEntriesCountConstructorFabric(BaseClass);
    return new ConstructorToUse(options);
}
//# sourceMappingURL=swarm-store-connector-orbit-db-with-entries-count-fabric.js.map