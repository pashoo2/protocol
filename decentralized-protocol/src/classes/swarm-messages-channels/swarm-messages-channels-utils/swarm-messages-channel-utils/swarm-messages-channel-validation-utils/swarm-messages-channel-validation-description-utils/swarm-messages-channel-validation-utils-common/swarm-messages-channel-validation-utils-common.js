import { __awaiter } from "tslib";
export const validateUsersList = (usersIdsList, isValidUserId) => __awaiter(void 0, void 0, void 0, function* () {
    let currentlyValidatingUserIdentity;
    let currentlyValidatingUserIdx = 0;
    while ((currentlyValidatingUserIdentity = usersIdsList[currentlyValidatingUserIdx])) {
        if (!(yield isValidUserId(currentlyValidatingUserIdentity))) {
            throw new Error(`The user idenity is not valid: ${currentlyValidatingUserIdentity}`);
        }
        currentlyValidatingUserIdx += 1;
    }
});
//# sourceMappingURL=swarm-messages-channel-validation-utils-common.js.map