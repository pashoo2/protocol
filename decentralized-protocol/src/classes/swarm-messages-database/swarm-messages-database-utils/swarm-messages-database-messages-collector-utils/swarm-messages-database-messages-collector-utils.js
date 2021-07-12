import { __awaiter } from "tslib";
export function getSwarmMessageStoreMeta(swarmMessageStore, dbName) {
    return __awaiter(this, void 0, void 0, function* () {
        const messagesAllStoredCount = yield swarmMessageStore.getCountEntriesAllExists(dbName);
        if (messagesAllStoredCount instanceof Error) {
            throw messagesAllStoredCount;
        }
        return {
            messagesStoredCount: messagesAllStoredCount,
        };
    });
}
//# sourceMappingURL=swarm-messages-database-messages-collector-utils.js.map