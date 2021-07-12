export const isSecretStoreCredentials = (credentials) => {
    if (typeof credentials === 'object') {
        const { login, password } = credentials;
        return Boolean(typeof login === 'string' && typeof password === 'string' && login && password);
    }
    return false;
};
//# sourceMappingURL=secret-storage-class-utils-credentials.js.map