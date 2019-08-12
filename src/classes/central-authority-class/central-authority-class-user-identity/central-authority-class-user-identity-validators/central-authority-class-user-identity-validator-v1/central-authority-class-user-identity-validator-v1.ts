import {
  dataValidatorUtilURI,
  dataValidatorUtilUUIDV4,
} from 'utils/data-validators-utils/data-validators-utils';
import {
  CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME,
  CA_USER_IDENTIT_VERSION_PROP_NAME,
  CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME,
} from '../../central-authority-class-user-identity.const';
import { CA_USER_IDENTITY_PARSER_VERSION_CHARACTERS_COUNT } from '../../central-authority-class-user-identity-parsers/central-authority-class-user-identity-parsers.const';
import { ICAUserUniqueIdentifierDescription } from '../../central-authority-class-user-identity.types';

export default (v: any): v is ICAUserUniqueIdentifierDescription => {
  if (v && typeof v === 'object') {
    const {
      [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]: userUniqueIdentifier,
      [CA_USER_IDENTIT_VERSION_PROP_NAME]: version,
      [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]: authProviderURI,
    } = v;

    if (
      typeof version !== 'string' ||
      version.length === CA_USER_IDENTITY_PARSER_VERSION_CHARACTERS_COUNT
    ) {
      return false;
    }
    if (dataValidatorUtilURI(authProviderURI)) {
      console.warn(
        `The auth provider's uri ${authProviderURI} have a wrong format`
      );
      return false;
    }
    if (dataValidatorUtilUUIDV4(userUniqueIdentifier)) {
      console.warn(
        `The auth provider's uri ${authProviderURI} have a wrong format`
      );
      return false;
    }
  }
  console.warn('The URI must be an object');
  return false;
};
