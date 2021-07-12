import { __awaiter } from "tslib";
import { SwarmMessageEncryptedCache } from './swarm-messgae-encrypted-cache';
import { SecretStorage } from '../secret-storage-class/secret-storage-class';
import { SwarmMessageConstructor } from '../swarm-message/swarm-message-constructor';
import { extend } from "../../utils";
export const getSwarmMessageEncryptedCacheFabric = (credentials, dbNamePrefix) => __awaiter(void 0, void 0, void 0, function* () {
    const secretStorage = new SecretStorage();
    const cryptoKey = yield secretStorage.generateCryptoKey(credentials);
    if (cryptoKey instanceof Error) {
        throw cryptoKey;
    }
    return (storageProviderOptions) => __awaiter(void 0, void 0, void 0, function* () {
        const messageEncryptedCache = new SwarmMessageEncryptedCache();
        yield messageEncryptedCache.connect({
            dbNamePrefix,
            storageProviderOptions,
            storageProviderAuthOptions: {
                key: cryptoKey,
            },
        });
        return messageEncryptedCache;
    });
});
export const getSwarmMessageConstructorWithCacheFabric = (credentials, constructorOptions, dbNamePrefix) => __awaiter(void 0, void 0, void 0, function* () {
    const encryptedCacheFabric = yield getSwarmMessageEncryptedCacheFabric(credentials, dbNamePrefix);
    return (swarmMessageConstructorOptions, storageProviderOptions) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const encryptedCache = ((_a = swarmMessageConstructorOptions.instances) === null || _a === void 0 ? void 0 : _a.encryptedCache) || (yield encryptedCacheFabric(storageProviderOptions));
        const options = extend(swarmMessageConstructorOptions, Object.assign(Object.assign({}, constructorOptions), { instances: Object.assign(Object.assign({}, constructorOptions.instances), { encryptedCache }) }));
        return new SwarmMessageConstructor(options);
    });
});
//# sourceMappingURL=swarm-message-encrypted-cache.utils.js.map