import { generateCryptoCredentials } from 'classes/central-authority-class/central-authority-utils-common/central-authority-util-crypto-keys/central-authority-util-crypto-keys';

export const CA_CONNECTION_FIREBASE_CONFIG = {
  apiKey: 'AIzaSyCwmUlVklNmGZ0SD11NKT8gpvmZXbgbBRk',
  authDomain: 'protocol-f251b.firebaseapp.com',
  databaseURL: 'https://protocol-f251b.firebaseio.com',
  projectId: 'protocol-f251b',
  storageBucket: '',
  messagingSenderId: '275196342406',
  appId: '1:275196342406:web:40b79d671c50af57',
};

export const CA_CONNECTION_FIREBASE_USER_CREDENTIALS = {
  login: 'akulich.p@gmail.com',
  password: '123456',
};

export const CA_CONNECTION_FIREBASE_CREDENTIALS = (async () => {
  const cryptoCredentials = await generateCryptoCredentials();

  if (cryptoCredentials instanceof Error) {
    console.error(cryptoCredentials);
    return new Error('Failed to generate a crypto credentials for the user');
  }

  return {
    ...CA_CONNECTION_FIREBASE_USER_CREDENTIALS,
    cryptoCredentials,
  };
})();
