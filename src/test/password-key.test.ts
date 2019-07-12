import {
  generatePasswordKeyAsString,
  importPasswordKeyFromString,
  exportPasswordKey,
} from 'utils/password-utils/derive-key.password-utils';
import {
  encryptDataToArrayBuffer,
  encryptDataToString,
  encryptDataWithPassword,
} from 'utils/password-utils/encrypt.password-utils';
import {
  decryptDataWithKeyNative,
  decryptDataWithKey,
  decryptDataByPassword,
} from 'utils/password-utils/decrypt.password-utils';

const testKeyGeneration = async () => {
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
  const passwordKey = await generatePasswordKeyAsString(passwordString);

  if (passwordKey instanceof Error) {
    console.error(passwordKey);
    return passwordKey;
  }

  const data = 'test_string';
  const chipher = await encryptDataToString(passwordKey, data);

  debugger;
  if (chipher instanceof Error) {
    console.error(chipher);
    return chipher;
  }
  console.log('chipher', chipher);
  const decrypted = await decryptDataWithKey(passwordKey, chipher);

  if (decrypted instanceof Error) {
    console.error(decrypted);
    return decrypted;
  }
  console.log('decrypted', decrypted);
  console.log('is valid', decrypted === data);

  const dataTest = 'test string fo password';
  const pwd = 'pwd_test';
  const encrypted = await encryptDataWithPassword(pwd, dataTest);

  if (encrypted instanceof Error) {
    console.error(encrypted);
    return encrypted;
  }

  const decryptedPwd = await decryptDataByPassword(pwd, encrypted);

  if (decryptedPwd instanceof Error) {
    console.error(decryptedPwd);
    return decryptedPwd;
  }
  console.log('decryptedPwd', decryptedPwd);
  console.log('is valid', decryptedPwd === dataTest);
};

testKeyGeneration();
