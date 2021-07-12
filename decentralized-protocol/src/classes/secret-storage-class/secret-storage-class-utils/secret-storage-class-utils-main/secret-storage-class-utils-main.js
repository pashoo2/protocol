export const checkIsStorageProviderInstance = (storageProviderInstance) => {
    if (!storageProviderInstance || typeof storageProviderInstance !== 'object') {
        return new Error('Storage provider must be an object');
    }
    const { connect, get, set, disconnect } = storageProviderInstance;
    if (typeof connect !== 'function' ||
        typeof get !== 'function' ||
        typeof set !== 'function' ||
        typeof disconnect !== 'function') {
        return new Error('The instance has a wrong implemntation of a StorageProvider interface');
    }
    return true;
};
export const validateCryptoKeyCredentials = (credentials) => {
    if (!credentials) {
        return new Error('validateCryptoKeyCredentials::Credentials must not be empty');
    }
    if (typeof credentials !== 'object') {
        return new Error('validateCryptoKeyCredentials::Credentials must be an object');
    }
    const { key } = credentials;
    if (!key) {
        return new Error('validateCryptoKeyCredentials::A Key must be provided to authorize');
    }
    if (key instanceof CryptoKey) {
        return;
    }
    return new Error('validateCryptoKeyCredentials::A Key must be ab instance of CryptoKey');
};
//# sourceMappingURL=secret-storage-class-utils-main.js.map