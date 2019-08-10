import { generateKeyPairs } from 'classes/central-authority-class/central-authority-utils-common/central-authority-util-crypto-keys/central-authority-util-crypto-keys';
import { runTestForKeyPairs } from './central-aurhority.keys.common.test';

export const runTestKeys = async () => {
  console.warn('Central authority keys tests start');

  const keyPairs = await generateKeyPairs();
  return runTestForKeyPairs(keyPairs);
};
