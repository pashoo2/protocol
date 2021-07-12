import { getClassSwarmMessageStoreWithEntriesCount as getClassSwarmMessageStoreWithEntriesCountAndConnector } from "../swarm-message-store-with-entries-count/swarm-message-store-with-entries-count";
import { extendClassSwarmStoreWithOptionsConstructor } from '../../../swarm-store-class/swarm-store-class-extended/swarm-store-class-with-options-constructor/swarm-store-class-with-options-constructor-mixin';
export function getClassSwarmMessageStoreWithEntriesCountAndOptionsSerializer(SwarmStoreOptionsClass) {
    const SwarmMessageStoreWithEntriesCountAndConnectorClass = getClassSwarmMessageStoreWithEntriesCountAndConnector();
    const ClassSwarmStoreWithOptionsConstructor = extendClassSwarmStoreWithOptionsConstructor(SwarmMessageStoreWithEntriesCountAndConnectorClass, SwarmStoreOptionsClass);
    return ClassSwarmStoreWithOptionsConstructor;
}
//# sourceMappingURL=swarm-message-store-with-entries-count-and-options-serializer.js.map