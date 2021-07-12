import { ESwarmStoreConnector } from "../../swarm-store-class/swarm-store-class.const";
import { ISwarmMessageInstanceDecrypted, TSwarmMessageSerialized } from "../../swarm-message/swarm-message-constructor.types";
import { ISwarmStoreConnector, ISwarmStoreConnectorBasic, ISwarmStoreOptionsConnectorFabric, ISwarmStoreProviderOptions, TSwarmStoreConnectorConnectionOptions, TSwarmStoreDatabaseOptions, TSwarmStoreDatabaseType, } from "../../swarm-store-class/swarm-store-class.types";
import { TSwarmMessageUserIdentifierSerialized } from "../../central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity-validators/central-authority-common-validator-user-identifier/central-authority-common-validator-user-identifier.types";
import { ISwarmMessageStore, ISwarmMessageStoreAccessControlOptions, ISwarmMessageStoreOptionsWithConnectorFabric, TSwarmMessagesStoreGrantAccessCallback, } from "../../swarm-message-store/types/swarm-message-store.types";
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from "../../swarm-message-encrypted-cache/swarm-message-encrypted-cache.types";
import { ISwarmMessagesDatabaseCache, ISwarmMessagesDatabaseCacheOptions, ISwarmMessagesDatabaseConnectOptions, } from "../../swarm-messages-database/swarm-messages-database.types";
import { ISwarmMessagesDatabaseMessagesCollector } from "../../swarm-messages-database/swarm-messages-database.messages-collector.types";
import { TTypedEmitter } from "../../basic-classes/event-emitter-class-base/event-emitter-class-base.types";
//# sourceMappingURL=swarm-messages-channel-instance.types.js.map