import {
  generateKeyPair,
  exportKeyPairAsString,
  importKeyPairFromString,
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
  debugger;
};
testDataSigning();
