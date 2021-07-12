import { __awaiter } from "tslib";
import { EOrbitDbStoreOperation } from '../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { isValidSwarmMessageDecryptedFormat } from '../../../../swarm-message-store-utils/swarm-message-store-validators/swarm-message-store-validator-swarm-message';
export const getMessageConstructorForDatabase = (dbName, messageConstructors) => {
    if (!messageConstructors) {
        return;
    }
    const dbMessageConstructor = messageConstructors[dbName];
    if (dbMessageConstructor) {
        return dbMessageConstructor;
    }
    return messageConstructors.default;
};
function swarmMessageGrantValidatorWithCBContext(value, senderUserId, key, op, time, callbackContext) {
    return __awaiter(this, void 0, void 0, function* () {
        const { dbName, messageConstructor, grantAccessCb, isPublic, isUserCanWrite } = this;
        const isUserHasWriteOrDeletePermissions = isPublic || isUserCanWrite;
        if (!isUserHasWriteOrDeletePermissions) {
            return false;
        }
        let swarmMessage;
        if (op !== EOrbitDbStoreOperation.DELETE) {
            try {
                if (typeof value === 'string') {
                    swarmMessage = (yield messageConstructor.construct(value));
                }
                else {
                    if (isValidSwarmMessageDecryptedFormat(value)) {
                        swarmMessage = value;
                    }
                    return false;
                }
                if (swarmMessage.uid !== senderUserId) {
                    return false;
                }
            }
            catch (err) {
                console.error(err);
                return false;
            }
        }
        if (grantAccessCb) {
            const isAccessAllowed = yield grantAccessCb.call(callbackContext, swarmMessage !== null && swarmMessage !== void 0 ? swarmMessage : value, senderUserId, dbName, key, op, time);
            if (!isAccessAllowed) {
                return false;
            }
        }
        return true;
    });
}
function swarmMessageGrantValidator(value, senderUserId, key, op, time) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield swarmMessageGrantValidatorWithCBContext.call(this, value, senderUserId, key, op, time);
    });
}
export const getMessageValidator = (dbOptions, messageConstructor, grantAccessCb, currentUserId) => {
    const { dbName, isPublic, write } = dbOptions;
    if (!messageConstructor) {
        throw new Error(`There is no message constructor found for the ${dbName}`);
    }
    return swarmMessageGrantValidator.bind({
        messageConstructor,
        dbName,
        grantAccessCb,
        isPublic,
        isUserCanWrite: !!(write === null || write === void 0 ? void 0 : write.includes(currentUserId)),
        currentUserId,
    });
};
export const getMessageValidatorForGrandAccessCallbackBound = (grantAccessCb) => {
    function swarmMessageGrantValidatorWithSwarmMessageStoreContext(payload, senderUserId, key, op, time) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this) {
                throw new Error('swarmMessageGrantValidatorWithSwarmMessageStoreContext::Context is not available');
            }
            const { currentUserId, dbName, isPublicDb, swarmMessageConstructor, usersIdsWithWriteAccess } = this;
            const swarmMessageGrantValidatorContext = {
                dbName,
                currentUserId,
                isPublic: isPublicDb,
                isUserCanWrite: usersIdsWithWriteAccess.includes(senderUserId),
                messageConstructor: swarmMessageConstructor,
                grantAccessCb,
            };
            return yield swarmMessageGrantValidatorWithCBContext.call(swarmMessageGrantValidatorContext, payload, senderUserId, key, op, time, this);
        });
    }
    swarmMessageGrantValidatorWithSwarmMessageStoreContext.toString = () => {
        return grantAccessCb ? grantAccessCb.toString() : undefined;
    };
    return swarmMessageGrantValidatorWithSwarmMessageStoreContext;
};
//# sourceMappingURL=swarm-message-store-conector-db-options-grand-access-utils-common-grand-access-checker.js.map