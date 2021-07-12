import assert from 'assert';
import { ConnectionBridge } from '../../../connection-bridge';
export class ConnectionBridgeWithDBOClassEntriesCount extends ConnectionBridge {
    __getSwarmMessageStoreDatabaseGrandAccessBaseContextClassFabricFromOptions() {
        const { swarmMessageStoreDatabaseGrandAccessBaseContextClassFabric } = this._getStorageOptions();
        assert(swarmMessageStoreDatabaseGrandAccessBaseContextClassFabric, 'swarmMessageStoreDatabaseGrandAccessBaseContextClassFabric should be defined in the "storage" options');
        return swarmMessageStoreDatabaseGrandAccessBaseContextClassFabric;
    }
    __getOptionsForSwarmMessageStoreDatabaseOptionsClassFarbricOfFabric() {
        const activeSerializerInstance = this._getSerializer();
        return {
            serializer: activeSerializerInstance,
        };
    }
    __createSarmMessageStoreDatabaseOptionsClassFabric(swarmMessageStoreDatabaseOptionsClassFabricOfFabric, options) {
        return swarmMessageStoreDatabaseOptionsClassFabricOfFabric(options.serializer);
    }
    __crateAndGetSwarmMessageStoreDatabaseOptionsClassFabric() {
        const { swarmMessageStoreDatabaseOptionsClassFabricOfFabric } = this._getStorageOptions();
        assert(swarmMessageStoreDatabaseOptionsClassFabricOfFabric, 'swarmMessageStoreDatabaseOptionsClassFabric should be defined in the "storage" options');
        const optionsForDBOClassFabricOfFabric = this.__getOptionsForSwarmMessageStoreDatabaseOptionsClassFarbricOfFabric();
        return this.__createSarmMessageStoreDatabaseOptionsClassFabric(swarmMessageStoreDatabaseOptionsClassFabricOfFabric, optionsForDBOClassFabricOfFabric);
    }
    __getSwarmMessageStoreDBOGrandAccessCallbackFabricFromOptions() {
        const { swarmMessageStoreDBOGrandAccessCallbackFabric } = this._getStorageOptions();
        assert(swarmMessageStoreDBOGrandAccessCallbackFabric, 'swarmMessageStoreDBOGrandAccessCallbackFabric should be defined in the "storage" options');
        return swarmMessageStoreDBOGrandAccessCallbackFabric;
    }
    __getSwarmMessageStoreInstanceWithDBOClassFabricFromOptions() {
        const { swarmMessageStoreInstanceWithDBOClassFabric } = this._getStorageOptions();
        assert(swarmMessageStoreInstanceWithDBOClassFabric, 'swarmMessageStoreInstanceWithDBOClassFabric should be defined in the "storage" options');
        return swarmMessageStoreInstanceWithDBOClassFabric;
    }
    __createSwarmStoreGrandAccessCallbackBaseClassByCurrentOptions() {
        const swarmMessageStoreDatabaseGrandAccessBaseContextClassFabric = this.__getSwarmMessageStoreDatabaseGrandAccessBaseContextClassFabricFromOptions();
        const centralAuthorityConnection = this._getCentralAuthorityConnection();
        return swarmMessageStoreDatabaseGrandAccessBaseContextClassFabric({
            centralAuthority: centralAuthorityConnection,
            jsonSchemaValidator: this._getOptions().jsonSchemaValidator,
        });
    }
    _createAndGetSwarmMessageStoreInstanceWithDBOClassFabricOptions() {
        const swarmMessageStoreDBOGrandAccessCallbackFabric = this.__getSwarmMessageStoreDBOGrandAccessCallbackFabricFromOptions();
        const ContextBaseClass = this.__createSwarmStoreGrandAccessCallbackBaseClassByCurrentOptions();
        const databaseOptionsClassFabric = this.__crateAndGetSwarmMessageStoreDatabaseOptionsClassFabric();
        return {
            ContextBaseClass,
            swarmMessageStoreDBOGrandAccessCallbackFabric,
            databaseOptionsClassFabric,
        };
    }
    createSwarmMessageStoreInstance() {
        const { ContextBaseClass, swarmMessageStoreDBOGrandAccessCallbackFabric, databaseOptionsClassFabric } = this._createAndGetSwarmMessageStoreInstanceWithDBOClassFabricOptions();
        const swarmMessageStoreInstanceWithDBOClassFabric = this.__getSwarmMessageStoreInstanceWithDBOClassFabricFromOptions();
        return swarmMessageStoreInstanceWithDBOClassFabric(ContextBaseClass, swarmMessageStoreDBOGrandAccessCallbackFabric, databaseOptionsClassFabric);
    }
}
//# sourceMappingURL=connection-bridge-with-dbo-class.js.map