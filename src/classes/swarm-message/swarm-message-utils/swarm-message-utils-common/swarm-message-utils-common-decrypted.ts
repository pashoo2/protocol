import { ISwarmMessageDecrypted } from '../../swarm-message-constructor.types';

export const whetherAllSwarmMessagesDecryptedAreEqual = (...messages: Array<ISwarmMessageDecrypted | undefined>): boolean => {
  const first = messages[0];

  if (messages.length === 1) {
    return true;
  }
  if (!first) {
    return false;
  }
  return !messages.some((message) => message?.sig !== first.sig);
};
