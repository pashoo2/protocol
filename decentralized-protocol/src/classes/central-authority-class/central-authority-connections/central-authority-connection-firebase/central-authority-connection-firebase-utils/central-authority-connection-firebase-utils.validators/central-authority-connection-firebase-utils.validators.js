import { validateBySchema } from "../../../../../../utils/validation-utils/validation-utils";
import { CA_AUTH_CONNECTION_FIREBASE_UTILS_VALIDATOR_SCHEME_CONNECTION_OPTIONS } from './central-authority-connection-firebase-utils.validators.const';
import validator from 'validator';
export const valiateCAAuthConnectionFirebaseUtilsConnetionConfiguration = (configuration) => {
    if (!validateBySchema(CA_AUTH_CONNECTION_FIREBASE_UTILS_VALIDATOR_SCHEME_CONNECTION_OPTIONS, configuration)) {
        return false;
    }
    return validator.isURL(configuration.databaseURL);
};
//# sourceMappingURL=central-authority-connection-firebase-utils.validators.js.map