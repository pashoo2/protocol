import { __awaiter } from "tslib";
import { generatePasswordKeyByPasswordString } from '@pashoo2/crypto-utilities';
import { QueuedEncryptionClassBase } from '../queued-encryption-class-base';
export function getQueuedEncryptionClassByPasswordStringAndSalt(passwordString, salt, queueOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const passwordKey = yield generatePasswordKeyByPasswordString(passwordString, salt);
        if (passwordKey instanceof Error) {
            throw passwordKey;
        }
        const encryptionQueue = new QueuedEncryptionClassBase({
            keys: {
                decryptKey: passwordKey,
                encryptKey: passwordKey,
            },
            queueOptions,
        });
        return encryptionQueue;
    });
}
//# sourceMappingURL=queued-encryption-class-base-fabric-by-password.js.map