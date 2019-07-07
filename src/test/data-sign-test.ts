import {
  generateKeyPair,
  exportKeyPairAsString,
  importKeyPairFromString,
  signToString,
} from 'utils/data-sign-utils';

const testDataSigning = async () => {
  const keyPair = await generateKeyPair();

  if (keyPair instanceof Error) {
    console.error(keyPair);
    return;
  }
  console.log('keyPair', keyPair);

  const exportedKeyPair = await exportKeyPairAsString(keyPair);

  if (exportedKeyPair instanceof Error) {
    console.error(exportedKeyPair);
    return;
  }
  console.log('exportedKeyPair', exportedKeyPair);

  const keyPairImported = await importKeyPairFromString(exportedKeyPair);

  if (keyPairImported instanceof Error) {
    console.error(keyPairImported);
    return keyPairImported;
  }
  console.log('keyPairImported', keyPairImported);

  const exportedKeyPairByImported = await exportKeyPairAsString(
    keyPairImported
  );

  if (exportedKeyPairByImported instanceof Error) {
    console.error(exportedKeyPairByImported);
    return;
  }
  console.log('exportedKeyPairByImported', exportedKeyPairByImported);
  console.log(
    'exportedKeyPairByImported === exportedKeyPair',
    exportedKeyPairByImported === exportedKeyPair
  );

  const signString = await signToString(keyPairImported.privateKey, { d: 1 });

  if (signString instanceof Error) {
    console.error(signString);
    return;
  }

  console.log('signString', signString);

  const signStringTwice = await signToString(keyPairImported.privateKey, {
    d: 1,
  });

  if (signStringTwice instanceof Error) {
    console.error(signStringTwice);
    return;
  }

  console.log('signStringTwice', signStringTwice);
};
testDataSigning();
