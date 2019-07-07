export const isCryptoKeyPair = (key: any): key is CryptoKeyPair => {
  return (
    typeof key === 'object' &&
    key.publicKey instanceof CryptoKey &&
    key.privateKey instanceof CryptoKey
  );
};
