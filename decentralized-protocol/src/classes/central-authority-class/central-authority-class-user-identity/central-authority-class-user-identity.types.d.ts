import { TCentralAuthorityUserCryptoCredentials } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import { CentralAuthorityIdentity } from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity';
import { TCentralAuthorityUserIdentity } from '../central-authority-class-types/central-authority-class-types';
import { CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME, CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME, CA_USER_IDENTITY_VERSION_PROP_NAME, CA_USER_IDENTITY_VERSIONS } from './central-authority-class-user-identity.const';
import { ownValueOf } from 'types/helper.types';
export declare type TCAuthProviderIdentifier = string;
export declare type TCAuthProviderUserIdentifier = string;
export declare type TCAuthProviderUserIdentifierVersion = string;
export interface ICAUserIdentityDescription {
    [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]: TCAuthProviderIdentifier;
    [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]: TCAuthProviderUserIdentifier;
}
export interface ICAUserUniqueIdentifierDescription extends ICAUserIdentityDescription {
    [CA_USER_IDENTITY_VERSION_PROP_NAME]: TCAuthProviderUserIdentifierVersion;
}
export interface ICAUserUniqueIdentifierDescriptionWithOptionalVersion extends ICAUserIdentityDescription {
    [CA_USER_IDENTITY_VERSION_PROP_NAME]?: string;
}
export interface ICAUserUniqueIdentifierMetadata {
    [CA_USER_IDENTITY_VERSION_PROP_NAME]?: string;
    [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]?: string;
    [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]: TCAuthProviderIdentifier;
}
export declare type TUserIdentityVersion = ownValueOf<typeof CA_USER_IDENTITY_VERSIONS>;
export interface ICAIdentityCommonInstance {
    identityDescription: ICAUserUniqueIdentifierDescription | Error;
    identityDescritptionSerialized: TCentralAuthorityUserIdentity | Error;
    toString: () => TCentralAuthorityUserIdentity;
    id: string | Error;
    isValid?: boolean;
    version: TUserIdentityVersion | Error;
}
export declare type TCAUserIdentityRawTypes = CentralAuthorityIdentity | TCentralAuthorityUserCryptoCredentials | TCentralAuthorityUserIdentity | ICAUserUniqueIdentifierDescriptionWithOptionalVersion;
//# sourceMappingURL=central-authority-class-user-identity.types.d.ts.map