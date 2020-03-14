import {
  dataSignGenerateKeyPair,
  dataSignExportKeyPairAsString,
  dataSignImportKeyPairFromString,
  signToString,
  verifyData,
} from 'utils/data-sign-utils';
import { calculateHash } from 'utils/hash-calculation-utils';

const testDataSigning = async () => {
  const keyPair = await dataSignGenerateKeyPair();

  if (keyPair instanceof Error) {
    console.error(keyPair);
    return;
  }
  console.log('keyPair', keyPair);

  const exportedKeyPair = await dataSignExportKeyPairAsString(keyPair);

  if (exportedKeyPair instanceof Error) {
    console.error(exportedKeyPair);
    return;
  }
  console.log('exportedKeyPair', exportedKeyPair);

  const keyPairImported = await dataSignImportKeyPairFromString(
    exportedKeyPair
  );

  if (keyPairImported instanceof Error) {
    console.error(keyPairImported);
    return keyPairImported;
  }
  console.log('keyPairImported', keyPairImported);

  const exportedKeyPairByImported = await dataSignExportKeyPairAsString(
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

  const data = { d: 1 };
  const signString = await signToString(keyPairImported.privateKey, data);

  if (signString instanceof Error) {
    console.error(signString);
    return;
  }

  console.log('signString', signString);

  const dataTwice = await calculateHash('2222');

  if (dataTwice instanceof Error) {
    console.error(dataTwice);
    return dataTwice;
  }

  const signStringTwice = await signToString(
    keyPairImported.privateKey,
    dataTwice
  );

  if (signStringTwice instanceof Error) {
    console.error(signStringTwice);
    return;
  }

  console.log('signStringTwice', signStringTwice);

  const isValid = await verifyData(keyPairImported, data, signString);

  if (isValid instanceof Error) {
    console.error(isValid);
    return isValid;
  }
  console.log('isValid', isValid);

  const isValidTwice = await verifyData(
    keyPairImported,
    dataTwice,
    signStringTwice
  );

  if (isValidTwice instanceof Error) {
    console.error(isValidTwice);
    return isValidTwice;
  }
  console.log('isValidTwice', isValidTwice);
};
testDataSigning();
