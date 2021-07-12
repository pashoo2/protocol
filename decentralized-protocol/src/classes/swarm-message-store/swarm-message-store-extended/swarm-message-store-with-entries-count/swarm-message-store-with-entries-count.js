import { SwarmMessageStore } from '../../swarm-message-store';
import { getClassSwarmStoreWithEntriesCount } from '../../../swarm-store-class/swarm-store-class-extended/swarm-store-class-with-entries-count';
export function getClassSwarmMessageStoreWithEntriesCount() {
    class SwarmMessageStoreConstructor extends SwarmMessageStore {
    }
    const Class = getClassSwarmStoreWithEntriesCount(SwarmMessageStoreConstructor);
    return Class;
}
//# sourceMappingURL=swarm-message-store-with-entries-count.js.map