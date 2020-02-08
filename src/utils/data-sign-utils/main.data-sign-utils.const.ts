if (!window.crypto) {
  window.CryptoKey = require('@trust/webcrypto/src/keys/CryptoKey');
  window.CryptoKeyPair = require('@trust/webcrypto/src/keys/CryptoKeyPair');
  (window as any).JsonWebKey = require('@trust/webcrypto/src/keys/JsonWebKey');
}

export const crypto = window.crypto || require('@trust/webcrypto');

export const cryptoModule = crypto.subtle;
