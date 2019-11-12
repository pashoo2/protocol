import KeystoreClass, { Keystore } from 'orbit-db-keystore';
import { IdentityProvider, IdentityProviderOptions, IdentityAsJson } from 'orbit-db-identity-provider';
import { SWARM_STORE_CONNECTOR_ORBITDB_SUBCLASS_IDENTITY_PROVIDER_TYPE } from './swarm-store-connector-orbit-db-subclass-identity-provider.const';

export class SwarmStoreConnectorOrbitDBSubclassIdentityProvider extends IdentityProvider {
    /**
     * return name of the identity provider
     *
     * @readonly
     * @static
     * @type {string}
     * @memberof SwarmStoreConnectorOrbitDBSubclassIdentityProvider
     */
    public static get type(): string {
        return SWARM_STORE_CONNECTOR_ORBITDB_SUBCLASS_IDENTITY_PROVIDER_TYPE;
    };

    /**
     * Verify that identity was signed by the ID
     *
     * @static
     * @param {IdentityAsJson} identity
     * @returns {Promise<boolean>}
     * @memberof SwarmStoreConnectorOrbitDBSubclassIdentityProvider
     */
    public static async verifyIdentity(
        identity: IdentityAsJson,
    ): Promise<boolean> {
        const verifyResult = await KeystoreClass.verify(
            identity.signatures.publicKey,
            identity.publicKey,
            identity.publicKey + identity.signatures.id
        );
        
        return verifyResult;
    }

    protected _keystore?: Keystore;

    constructor (options: IdentityProviderOptions = {}) {
        super(options);
        if (!options.keystore) {
          throw new Error('IdentityProvider.createIdentity requires options.keystore');
        }
        if (!options.signingKeystore) {
          options.signingKeystore = options.keystore;
        }
        this._keystore = options.signingKeystore;
    }

    /**
     * return identifier of external id (eg. a public key)
     *
     * @param {IdentityProviderOptions} [options={}]
     * @returns {Promise<string>}
     * @memberof SwarmStoreConnectorOrbitDBSubclassIdentityProvider
     * @throws Error
     */
    async getId (options: IdentityProviderOptions = {}): Promise<string> {
        const id = options.id;

        if (!id) {
          throw new Error('id is required');
        }   
        return id;
    }

    /**
     * return a signature of data (signature of the OrbtiDB public key)
     *
     * @param {*} data
     * @param {IdentityProviderOptions} [options={}]
     * @returns {Promise<any>}
     * @memberof SwarmStoreConnectorOrbitDBSubclassIdentityProvider
     * @throws Error
     */
    async signIdentity (data: any, options: IdentityProviderOptions = {}): Promise<string> {
        const id = options.id;

        if (!id) {
          throw new Error('id is required');
        }

        const { _keystore: keystore } = this;
        const key = await keystore!.getKey(id);

        if (!key) {
          throw new Error(`Signing key for '${id}' not found`);
        }
        
        const result = await (keystore! as any).sign(key, data);

        return result;
      }
}