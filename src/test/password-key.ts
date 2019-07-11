import { generatePasswordKeyAsString } from 'utils/password-utils/derive-key.password-utils';

export const testKeyGeneration = async () => {
  const passwordString = '123';
  const passwordKey = await generatePasswordKeyAsString(passwordString);
  console.log('passwordKey', passwordKey);

  const passwordStringAgain = '123';
  const passwordKeyAgain = await generatePasswordKeyAsString(
    passwordStringAgain
  );
  debugger;
  console.log('passwordKeyAgain', passwordKeyAgain);
  console.log('isEquals', passwordKeyAgain === passwordKey);
};

testKeyGeneration();
