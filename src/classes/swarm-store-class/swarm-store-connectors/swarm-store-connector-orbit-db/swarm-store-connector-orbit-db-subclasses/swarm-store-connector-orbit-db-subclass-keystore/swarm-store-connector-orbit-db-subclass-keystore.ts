import KeystoreClass, { IOrbitDBKeystoreOptionsForSecretStorage } from 'orbit-db-keystore';
import { extendsOptionsWithStore } from './swarm-store-connector-orbit-db-subclass-keystore.utils';

/**
 *  this is the OrbitDB keystore, but with 
 *  the custom store implemented by the
 *  SecretStorage class
 * 
 * @export
 * @class SwarmStorageConnectorOrbitDBSublassKeyStore
 * @extends {OrbitDBKeystore}
 * @throws
 */
export class SwarmStorageConnectorOrbitDBSublassKeyStore extends KeystoreClass {
    constructor(options: IOrbitDBKeystoreOptionsForSecretStorage) {
        const optionsWithSecretStore = extendsOptionsWithStore(options);
        super(optionsWithSecretStore);
    }
}