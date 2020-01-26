// the key is used to encrypt a data for the user with this public key, then the user must decrypt it by the private key
export const CA_SWARM_USER_CRYPTO_KEY_DATA_ENCRYPTION_PUBLIC_USAGES = [
  'encrypt',
];

export const CA_SWARM_USER_CRYPTO_KEY_DATA_ENCRYPTION_PRIVATE_USAGES = [
  'decrypt',
];

export const CA_SWARM_USER_CRYPTO_KEY_DATA_SIGN_PUBLIC_USAGES = ['verify'];

export const CA_SWARM_USER_CRYPTO_KEY_DATA_SIGN_PRIVATE_USAGES = ['sign'];
