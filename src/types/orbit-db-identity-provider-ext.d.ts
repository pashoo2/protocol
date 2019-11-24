type TIdentityProvider = import('orbit-db-identity-provider').IdentityProvider;

declare module 'orbit-db-identity-provider/src/orbit-db-identity-provider' {
  class OrbitDBIdentityProvider implements TIdentityProvider {}

  export = OrbitDBIdentityProvider;
}
