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

  const test3ProfileValid = {
    name: 'User Name',
    phone: '+79292239192',
    email: 'ggg@mail.com',
    photoURL:
      'https://camo.githubusercontent.com/e7a14b9a151d9b1d23a0d05dac1af86b0e972714/68747470733a2f2f692e696d6775722e636f6d2f4a497942744b572e706e67',
  };

  if (!validateUserProfileData(test3ProfileValid)) {
    console.error('The profile data 3 must be valid');
    return;
  }

  const testProfileEmailNotValid = {
    name: 'User Name',
    phone: '+79292239192',
    email: 'gggmail.com',
    photoURL:
      'https://camo.githubusercontent.com/e7a14b9a151d9b1d23a0d05dac1af86b0e972714/68747470733a2f2f692e696d6775722e636f6d2f4a497942744b572e706e67',
  };

  if (validateUserProfileData(testProfileEmailNotValid)) {
    console.error('The email in the profile data is not valid');
    return;
  }

  const testProfilePhotoUrlNotValid = {
    name: 'User Name',
    phone: '+79292239192',
    email: 'ggg@mail.com',
    photoURL:
      'camo.githubusercontent/e7a14b9a151d9b1d23a0d05dac1af86b0e972714/68747470733a2f2f692e696d6775722e636f6d2f4a497942744b572e706e67',
  };

  if (validateUserProfileData(testProfilePhotoUrlNotValid)) {
    console.error('The photo url in the profile data is not valid');
    return;
  }

  console.warn('test for CA user profiel data validation succeed');
};
