import { ISwarmMessageDecrypted } from '../../swarm-message-constructor.types';

export function getSwarmMessageUniqueHash(swarmMessageDecrypted: ISwarmMessageDecrypted): string {
  return swarmMessageDecrypted.sig;
}

export const ifSwarmMessagesDecryptedEqual = (...messages: Array<ISwarmMessageDecrypted | undefined>): boolean => {
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
