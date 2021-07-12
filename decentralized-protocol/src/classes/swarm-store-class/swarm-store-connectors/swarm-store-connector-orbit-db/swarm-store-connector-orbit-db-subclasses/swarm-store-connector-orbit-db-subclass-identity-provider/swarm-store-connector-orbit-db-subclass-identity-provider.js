import { __awaiter } from "tslib";
import KeystoreClass from 'orbit-db-keystore';
import { IdentityProvider } from 'orbit-db-identity-provider';
import { SWARM_STORE_CONNECTOR_ORBITDB_SUBCLASS_IDENTITY_PROVIDER_TYPE } from './swarm-store-connector-orbit-db-subclass-identity-provider.const';
export class SwarmStoreConnectorOrbitDBSubclassIdentityProvider extends IdentityProvider {
    constructor(options = {}) {
        super(options);
        if (!options.keystore) {
            throw new Error('IdentityProvider.createIdentity requires options.keystore');
        }
        if (!options.signingKeystore) {
            options.signingKeystore = options.keystore;
        }
        this._keystore = options.signingKeystore;
    }
    static get type() {
        return SWARM_STORE_CONNECTOR_ORBITDB_SUBCLASS_IDENTITY_PROVIDER_TYPE;
    }
    static verifyIdentity(identity) {
        return __awaiter(this, void 0, void 0, function* () {
            const verifyResult = yield KeystoreClass.verify(identity.signatures.publicKey, identity.publicKey, identity.publicKey + identity.signatures.id);
            return verifyResult;
        });
    }
    getId(options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = options.id;
            if (!id) {
                throw new Error('id is required');
            }
            return id;
        });
    }
    signIdentity(data, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = options.id;
            if (!id) {
                throw new Error('id is required');
            }
            const { _keystore: keystore } = this;
            const key = yield keystore.getKey(id);
            if (!key) {
                throw new Error(`Signing key for '${id}' not found`);
            }
            const result = yield keystore.sign(key, data);
            return result;
        });
    }
}
//# sourceMappingURL=swarm-store-connector-orbit-db-subclass-identity-provider.js.map