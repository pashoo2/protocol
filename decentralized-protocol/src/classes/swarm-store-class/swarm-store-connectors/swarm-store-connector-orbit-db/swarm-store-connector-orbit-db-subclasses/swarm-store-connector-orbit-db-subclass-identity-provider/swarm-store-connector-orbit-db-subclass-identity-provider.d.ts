import { Keystore } from 'orbit-db-keystore';
import { IdentityProvider, IdentityProviderOptions, IdentityAsJson } from 'orbit-db-identity-provider';
export declare class SwarmStoreConnectorOrbitDBSubclassIdentityProvider extends IdentityProvider {
    static get type(): string;
    static verifyIdentity(identity: IdentityAsJson): Promise<boolean>;
    protected _keystore?: Keystore;
    constructor(options?: IdentityProviderOptions);
    getId(options?: IdentityProviderOptions): Promise<string>;
    signIdentity(data: any, options?: IdentityProviderOptions): Promise<string>;
}
//# sourceMappingURL=swarm-store-connector-orbit-db-subclass-identity-provider.d.ts.map