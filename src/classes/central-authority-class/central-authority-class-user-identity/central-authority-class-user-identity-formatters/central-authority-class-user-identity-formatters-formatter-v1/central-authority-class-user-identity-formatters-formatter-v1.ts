import { normalizeUrl } from 'utils/common-utils/common-utils-url';
import { ICAUserUniqueIdentifierDescription } from '../../central-authority-class-user-identity.types';
import { TCentralAuthorityUserIdentity } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import {
  CA_USER_IDENTITY_VERSION_PROP_NAME,
  CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME,
  CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME,
} from '../../central-authority-class-user-identity.const';
import { validateUserIdentityDescriptionVersion } from '../../central-authority-class-user-identity-validators/central-authority-class-user-identity-validators.utils';

export const formatterV1 = (userIdentityDescription: ICAUserUniqueIdentifierDescription): TCentralAuthorityUserIdentity | Error => {
  const { [CA_USER_IDENTITY_VERSION_PROP_NAME]: version } = userIdentityDescription;
  const validationResult = validateUserIdentityDescriptionVersion(version, userIdentityDescription);

  if (validationResult instanceof Error) {
    return validationResult;
  }

  const {
    [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]: authProviderURI,
    [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]: userUniqueIdentifier,
  } = userIdentityDescription;
  const normalizedAuthProviderUrl = normalizeUrl(authProviderURI);

  if (normalizedAuthProviderUrl instanceof Error) {
    return normalizedAuthProviderUrl;
  }
  return `${version}${normalizedAuthProviderUrl}${userUniqueIdentifier}`;
};

export default formatterV1;
