import {
  SALT_GENERATION_UTILS_SALT_MAX_LENGTH_BYTES,
  SALT_GENERATION_UTILS_SALT_MIN_LENGTH_BYTES,
} from '../utils/encryption-utils/salt-utils.const';
import {
  generateSalt,
  generateSaltString,
} from '../utils/encryption-utils/salt-utils';
import {
  generatePasswordKeyAsString,
  importPasswordKeyFromString,
} from 'utils/password-utils/derive-key.password-utils';
import {
  encryptDataToString,
  encryptDataWithPassword,
} from 'utils/password-utils/encrypt.password-utils';
import {
  decryptDataWithKey,
  decryptDataByPassword,
} from 'utils/password-utils/decrypt.password-utils';

export const testKeyGeneration = async () => {
  /**
   * test key generation from a password
   */
  // const passwordString = '123';
  // const passwordKey = await generatePasswordKeyAsString(passwordString);
  // console.log('passwordKey', passwordKey);
  // const passwordStringAgain = '123';
  // const passwordKeyAgain = await generatePasswordKeyAsString(
  //   passwordStringAgain
  // );
  // console.log('passwordKeyAgain', passwordKeyAgain);
  // console.log('isEquals', passwordKeyAgain === passwordKey);
  // if (typeof passwordKeyAgain === 'string' && typeof passwordKey === 'string') {
  //   const resultedKeyImported = await importPasswordKeyFromString(passwordKey);
  //   const resultedKeyImportedAgain = await importPasswordKeyFromString(
  //     passwordKeyAgain
  //   );
  //   if (
  //     !(resultedKeyImported instanceof Error) &&
  //     !(resultedKeyImported instanceof Error)
  //   ) {
  //     const exportedImported = await exportPasswordKey(resultedKeyImported);
  //     const exportedAgainImported = await exportPasswordKey(
  //       resultedKeyImported
  //     );
  //     console.log('exportedImported', exportedImported);
  //     console.log('exportedAgainImported', exportedAgainImported);
  //     if (
  //       !(exportedImported instanceof Error) &&
  //       !(exportedAgainImported instanceof Error)
  //     ) {
  //       console.log('isEquals', exportedImported.k === exportedAgainImported.k);
  //     }
  //   }
  // }
  const passwordString = '12345678';
  const saltGenerated = generateSalt(
    SALT_GENERATION_UTILS_SALT_MAX_LENGTH_BYTES
  );

  if (saltGenerated instanceof Error) {
    console.error(saltGenerated);
    return new Error('Failed to generate a valid salt');
  }

  const passwordKey = await generatePasswordKeyAsString(
    passwordString,
    saltGenerated
  );

  if (passwordKey instanceof Error) {
    console.error(passwordKey);
    console.error('Failed to generate a valid password key string');
    return;
  }

  const passwordKeyImported = await importPasswordKeyFromString(passwordKey);

  if (passwordKeyImported instanceof Error) {
    console.error(passwordKeyImported);
    console.error('Failed to import key from the string');
    return;
  }

  const data = 'test_string';
  const chipher = await encryptDataToString(passwordKey, data);

  if (chipher instanceof Error) {
    console.error(chipher);
    return chipher;
  }
  console.log('chipher', chipher);
  const decrypted = await decryptDataWithKey(passwordKeyImported, chipher);

  if (decrypted instanceof Error) {
    console.error(decrypted);
    return decrypted;
  }
  console.log('decrypted', decrypted);
  if (decrypted !== data) {
    console.error(new Error('The data decrypted is not valid'));
    return;
  }

  const dataTest = '~!@#$%^^(&^())*(&*(^!)&)*^#&^)&*(^#@#(*^:"}{[]\\*-F|';
  const pwd = 'pwd_test';
  const saltGeneratedMinLenght = generateSaltString(
    SALT_GENERATION_UTILS_SALT_MIN_LENGTH_BYTES
  );

  if (saltGeneratedMinLenght instanceof Error) {
    console.error(saltGeneratedMinLenght);
    console.error(new Error('Failed to generate salt with a min byte length'));
    return;
  }

  const encrypted = await encryptDataWithPassword(
    pwd,
    saltGeneratedMinLenght,
    dataTest
  );

  if (encrypted instanceof Error) {
    console.error(encrypted);
    return encrypted;
  }

  const decryptedPwd = await decryptDataByPassword(
    pwd,
    saltGeneratedMinLenght,
    encrypted
  );

  if (decryptedPwd instanceof Error) {
    console.error(decryptedPwd);
    return decryptedPwd;
  }
  console.log('decryptedPwd', decryptedPwd);
  if (decryptedPwd !== dataTest) {
    console.error(new Error('The data decrypted second params is not valid'));
    return;
  }
};

testKeyGeneration();
