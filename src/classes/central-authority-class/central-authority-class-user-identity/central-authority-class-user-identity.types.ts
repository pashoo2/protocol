import { TCentralAuthorityUserCryptoCredentials } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import { CentralAuthorityIdentity } from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity';
import { TCentralAuthorityUserIdentity } from '../central-authority-class-types/central-authority-class-types';
import {
  CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME,
  CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME,
  CA_USER_IDENTITY_VERSION_PROP_NAME,
  CA_USER_IDENTITY_VERSIONS,
} from './central-authority-class-user-identity.const';
import { ownValueOf } from 'types/helper.types';

// url of the auth provider
export type TCAuthProviderIdentifier = string;

/**
 * this is unique identifier of the user on
 * the storage provider
 */
export type TCAuthProviderUserIdentifier = string;

export type TCAuthProviderUserIdentifierVersion = string;

export interface ICAUserIdentityDescription {
  [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]: TCAuthProviderIdentifier;
  [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]: TCAuthProviderUserIdentifier;
}

export interface ICAUserUniqueIdentifierDescription extends ICAUserIdentityDescription {
  [CA_USER_IDENTITY_VERSION_PROP_NAME]: TCAuthProviderUserIdentifierVersion;
}

/**
 *
 * This satring allows to uniquely identify the user
 * in the swarm.
 * The user register on a auth provider service which
 * gives the unique login for the user. Both of
 * the auth provider URL and the user id on it, gives the
 * unique identifier for the user, which can be used on
 * the swarm as the unique identity for the user.
 * The raw type ('object', 'string', 'number') of the
 * serialized identity is in the constant CA_USER_IDENTITY_TYPE
 * @export
 * @interface ICAUserUniqueIdentifierDescription
 */
export interface ICAUserUniqueIdentifierDescriptionWithOptionalVersion extends ICAUserIdentityDescription {
  [CA_USER_IDENTITY_VERSION_PROP_NAME]?: string;
}

export interface ICAUserUniqueIdentifierMetadata {
  [CA_USER_IDENTITY_VERSION_PROP_NAME]?: string;
  [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]?: string;
  [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]: TCAuthProviderIdentifier;
}

export type TUserIdentityVersion = ownValueOf<typeof CA_USER_IDENTITY_VERSIONS>;

export interface ICAIdentityCommonInstance {
  identityDescription: ICAUserUniqueIdentifierDescription | Error;
  identityDescritptionSerialized: TCentralAuthorityUserIdentity | Error;
  toString: () => TCentralAuthorityUserIdentity;
  // returns a unique string, may be used as a unique identifier in overall system
  id: string | Error;
  isValid?: boolean;
  version: TUserIdentityVersion | Error;
}

export type TCAUserIdentityRawTypes =
  | CentralAuthorityIdentity
  | TCentralAuthorityUserCryptoCredentials
  | TCentralAuthorityUserIdentity
  | ICAUserUniqueIdentifierDescriptionWithOptionalVersion;
