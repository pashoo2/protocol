export function getSwarmMessageUniqueHash(swarmMessageDecrypted) {
    return swarmMessageDecrypted.sig;
}
export const ifSwarmMessagesDecryptedEqual = (...messages) => {
    const [firstMessage] = messages;
    const firstMessageUniqueHash = firstMessage && getSwarmMessageUniqueHash(firstMessage);
    if (messages.length === 1) {
        return true;
    }
    if (!firstMessageUniqueHash) {
        return false;
    }
    return !messages.some((message) => (message && getSwarmMessageUniqueHash(message)) !== firstMessageUniqueHash);
};
//# sourceMappingURL=swarm-message-utils-common-decrypted.js.map