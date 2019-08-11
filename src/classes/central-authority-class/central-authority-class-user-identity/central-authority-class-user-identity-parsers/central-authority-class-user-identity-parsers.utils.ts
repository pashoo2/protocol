import { validateUserIdentity } from 'classes/central-authority-class/central-authority-validators/central-authority-validators-auth-credentials/central-authority-validators-auth-credentials';
import { TCentralAuthorityUserIdentity } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';

export function getIdentifierVersionByIdentityString(
  identityString: TCentralAuthorityUserIdentity
): Error | string {
  if (validateUserIdentity(identityString)) {
  }
  return new Error('The user identity is not valid');
}
