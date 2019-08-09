import { generateKeyPairs } from 'classes/central-authority-class/central-authority-utils/central-authority-util-crypto-keys/central-authority-util-crypto-keys-generate';

export const runTestKeys = async () => {
  const keyPairs = await generateKeyPairs();

  console.dir(keyPairs);
  debugger;
};
