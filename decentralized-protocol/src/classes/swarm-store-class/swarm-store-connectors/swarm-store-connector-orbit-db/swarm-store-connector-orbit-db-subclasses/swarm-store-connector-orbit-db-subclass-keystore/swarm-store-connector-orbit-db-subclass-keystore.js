import KeystoreClass from 'orbit-db-keystore';
import { extendsOptionsWithStore } from './swarm-store-connector-orbit-db-subclass-keystore.utils';
export class SwarmStorageConnectorOrbitDBSublassKeyStore extends KeystoreClass {
    constructor(options) {
        const optionsWithSecretStore = extendsOptionsWithStore(options);
        super(optionsWithSecretStore);
    }
}
//# sourceMappingURL=swarm-store-connector-orbit-db-subclass-keystore.js.map