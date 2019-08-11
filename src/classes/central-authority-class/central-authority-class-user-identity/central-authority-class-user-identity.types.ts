import { TCentralAuthorityUserIdentity } from '../central-authority-class-types/central-authority-class-types';
import {
  CA_USER_IDENTITY_AUTH_PROVIDER_URI_PROP_NAME,
  CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME,
} from './central-authority-class-user-identity.const';

/**
 *
 * this is interface for description
 * of the user unique identity whithin
 * the server overall
 * @export
 * @interface ICAUserUniqueIdentifierDescription
 */

export interface ICAUserIdentityDescription {
  [CA_USER_IDENTITY_AUTH_PROVIDER_URI_PROP_NAME]: string;
  [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]: string;
}

export interface ICAUserUniqueIdentifierDescription
  extends ICAUserIdentityDescription {
  version: string;
}

export interface ICAIdentityCommon {
  userIdentity: ICAUserUniqueIdentifierDescription;
  toString: TCentralAuthorityUserIdentity | Error;
}

export interface ICAIdentity extends ICAIdentityCommon {
  new (userIdentity: TCentralAuthorityUserIdentity): void;
}

export interface ICAIdentity extends ICAIdentityCommon {
  new (identityDescription: ICAUserIdentityDescription): void;
}
