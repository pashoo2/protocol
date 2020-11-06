import { ISwarmMessageDecrypted } from '../../swarm-message-constructor.types';

export const whetherSwarmMessagesDecryptedAreEqual = (...messages: Array<ISwarmMessageDecrypted | undefined>): boolean => {
  const first = messages[0];
  return !first || messages.length === 1 || !messages.some((message) => message?.sig !== first.sig);
};
