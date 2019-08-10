import {
  CA_USER_IDENTITY_TYPE,
  CA_USER_IDENTITY_MIN_LENGTH,
} from 'classes/central-authority-class/central-authority-class-const/central-authority-class-const';
import { TCentralAuthorityUserIdentity } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';

export const validateUserIdentity = (
  v: any
): v is TCentralAuthorityUserIdentity => {
  return (
    typeof v === CA_USER_IDENTITY_TYPE &&
    v.length === CA_USER_IDENTITY_MIN_LENGTH
  );
};
