import { generateKeyPair, exportKeyPairAsString } from 'utils/data-sign-utils';

const testDataSigning = async () => {
  const keyPair = await generateKeyPair();

  if (keyPair instanceof Error) {
    console.error(keyPair);
    return;
  }
  console.log(keyPair);

  const exportedKeyPair = await exportKeyPairAsString(keyPair);

  if (exportedKeyPair instanceof Error) {
    console.error(exportedKeyPair);
    return;
  }
};
testDataSigning();
