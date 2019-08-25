import { validateUserProfileData } from 'classes/central-authority-class/central-authority-validators/central-authority-validators-user/central-authority-validators-user';

export * from './central-authority-connection.test.firebase';

export const runTestProfileValidation = () => {
  console.warn('test for CA user profiel data validation started');
  const test1ProfileValid = {
    name: '1',
  };

  if (!validateUserProfileData(test1ProfileValid)) {
    console.error('The profile data 1 must be valid');
    return;
  }

  const test2ProfileValid = {
    phone: '+79292239192',
  };

  if (!validateUserProfileData(test2ProfileValid)) {
    console.error('The profile data 2 must be valid');
    return;
  }
  console.warn('test for CA user profiel data validation succeed');
};
