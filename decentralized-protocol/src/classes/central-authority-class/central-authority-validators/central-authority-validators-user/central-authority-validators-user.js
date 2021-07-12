import { ICentralAuthorityUserProfile } from "../../central-authority-class-types/central-authority-class-types";
import { validateBySchema } from "../../../../utils/validation-utils/validation-utils";
import { CA_VALIDATORS_USER_PROFILE_SCHEME } from './central-authority-validators-user.schemes';
export const validateUserProfileData = (profileData) => {
    return validateBySchema(CA_VALIDATORS_USER_PROFILE_SCHEME, profileData);
};
//# sourceMappingURL=central-authority-validators-user.js.map