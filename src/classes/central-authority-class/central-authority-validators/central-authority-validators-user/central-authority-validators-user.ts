import { ICentralAuthorityUserProfile } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import { validateBySchema } from 'utils/validation-utils/validation-utils';
import { CA_VALIDATORS_USER_PROFILE_SCHEME } from './central-authority-validators-user.schemes';

export const validateUserProfileData = (
  profileData: any
): profileData is ICentralAuthorityUserProfile => {
  return validateBySchema(CA_VALIDATORS_USER_PROFILE_SCHEME, profileData);
};
