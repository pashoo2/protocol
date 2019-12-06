import {
  dataValidatorUtilURL,
  dataValidatorUtilSafeLogin,
} from 'utils/data-validators-utils/data-validators-utils';
import {
  CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME,
  CA_USER_IDENTITY_VERSION_PROP_NAME,
  CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME,
  CA_USER_IDENTITY_VERSION_CHARACTERS_COUNT,
} from '../../central-authority-class-user-identity.const';
import { ICAUserUniqueIdentifierDescription } from '../../central-authority-class-user-identity.types';

export const validatorV2 = (
  v: any
): v is ICAUserUniqueIdentifierDescription => {
  if (v && typeof v === 'object') {
    const {
      [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]: userUniqueIdentifier,
      [CA_USER_IDENTITY_VERSION_PROP_NAME]: version,
      [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]: authProviderURI,
    } = v;

    if (
      typeof version !== 'string' ||
      version.length !== CA_USER_IDENTITY_VERSION_CHARACTERS_COUNT
    ) {
      return false;
    }
    if (!dataValidatorUtilURL(authProviderURI)) {
      console.warn(
        `The auth provider's uri ${authProviderURI} have a wrong format`
      );
      return false;
    }
    if (!dataValidatorUtilSafeLogin(userUniqueIdentifier)) {
      console.warn(
        `The user unique identifier ${userUniqueIdentifier} have a format different from the user login safe format`
      );
      return false;
    }
    return true;
  }
  console.warn('The URI must be an object');
  return false;
};

export default validatorV2;
