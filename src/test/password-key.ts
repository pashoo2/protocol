import {
  generatePasswordKeyAsString,
  importPasswordKeyFromString,
  exportPasswordKey,
} from 'utils/password-utils/derive-key.password-utils';

export const testKeyGeneration = async () => {
  const passwordString = '123';
  const passwordKey = await generatePasswordKeyAsString(passwordString);
  console.log('passwordKey', passwordKey);

  const passwordStringAgain = '123';
  const passwordKeyAgain = await generatePasswordKeyAsString(
    passwordStringAgain
  );

  console.log('passwordKeyAgain', passwordKeyAgain);
  console.log('isEquals', passwordKeyAgain === passwordKey);

  if (typeof passwordKeyAgain === 'string' && typeof passwordKey === 'string') {
    const resultedKeyImported = await importPasswordKeyFromString(passwordKey);
    const resultedKeyImportedAgain = await importPasswordKeyFromString(
      passwordKeyAgain
    );

    if (
      !(resultedKeyImported instanceof Error) &&
      !(resultedKeyImported instanceof Error)
    ) {
      const exportedImported = await exportPasswordKey(resultedKeyImported);
      const exportedAgainImported = await exportPasswordKey(
        resultedKeyImported
      );

      console.log('exportedImported', exportedImported);
      console.log('exportedAgainImported', exportedAgainImported);

      if (
        !(exportedImported instanceof Error) &&
        !(exportedAgainImported instanceof Error)
      ) {
        console.log('isEquals', exportedImported.k === exportedAgainImported.k);
      }
    }
  }
};

testKeyGeneration();
