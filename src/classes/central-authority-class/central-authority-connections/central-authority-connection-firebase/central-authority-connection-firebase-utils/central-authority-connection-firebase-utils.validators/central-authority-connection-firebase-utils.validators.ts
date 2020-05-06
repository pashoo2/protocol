import { validateBySchema } from 'utils/validation-utils/validation-utils';
import { ICAConnectionConfigurationFirebase } from '../../central-authority-connection-firebase.types.configuration';
import { CA_AUTH_CONNECTION_FIREBASE_UTILS_VALIDATOR_SCHEME_CONNECTION_OPTIONS } from './central-authority-connection-firebase-utils.validators.const';
import validator from 'validator';

export const valiateCAAuthConnectionFirebaseUtilsConnetionConfiguration = (
  configuration: any
): configuration is ICAConnectionConfigurationFirebase => {
  if (
    !validateBySchema(
      CA_AUTH_CONNECTION_FIREBASE_UTILS_VALIDATOR_SCHEME_CONNECTION_OPTIONS,
      configuration
    )
  ) {
    return false;
  }
  return validator.isURL(configuration.databaseURL);
};
