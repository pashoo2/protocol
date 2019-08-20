import { TCentralAuthorityUserIdentity } from '../central-authority-class-types/central-authority-class-types';
import {
  CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME,
  CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME,
  CA_USER_IDENTITY_VERSION_PROP_NAME,
} from './central-authority-class-user-identity.const';

/**
 *
 * this is interface for description
 * of the user unique identity whithin
 * the server overall
 * @export
 * @interface ICAUserUniqueIdentifierDescription
 */

export type TCAuthProviderIdentifier = string;

export type TCAuthProviderUserIdentifier = string;

export interface ICAUserIdentityDescription {
  [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]: TCAuthProviderIdentifier;
  [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]: TCAuthProviderUserIdentifier;
}

export interface ICAUserUniqueIdentifierDescription
  extends ICAUserIdentityDescription {
  [CA_USER_IDENTITY_VERSION_PROP_NAME]: string;
}

export interface ICAUserUniqueIdentifierDescriptionWithOptionalVersion
  extends ICAUserIdentityDescription {
  [CA_USER_IDENTITY_VERSION_PROP_NAME]?: string;
}

export interface ICAIdentityCommon {
  identityDescription: ICAUserUniqueIdentifierDescription | Error;
  identityDescritptionSerialized: TCentralAuthorityUserIdentity | Error;
  toString: () => TCentralAuthorityUserIdentity;
  // returns a unique string, may be used as a unique identifier in overall system
  id: string | Error;
}
