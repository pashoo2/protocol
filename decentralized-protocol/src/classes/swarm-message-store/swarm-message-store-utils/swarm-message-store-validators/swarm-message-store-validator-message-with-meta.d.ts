import { ISwarmMessageStoreMessageWithMeta } from '../../types/swarm-message-store.types';
import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import { TSwarmMessageSerialized, ISwarmMessageInstanceDecrypted } from '../../../swarm-message/swarm-message-constructor.types';
export declare function validateSwarmMessageWithMeta<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, MD extends ISwarmMessageInstanceDecrypted>(swarmMessageWithMeta: any): swarmMessageWithMeta is ISwarmMessageStoreMessageWithMeta<P, MD>;
//# sourceMappingURL=swarm-message-store-validator-message-with-meta.d.ts.map