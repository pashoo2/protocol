import { CentralAuthority } from '../../src/classes/central-authority-class/central-authority-class';
import { CA_CLASS_OPTIONS_VALID_NO_PROFILE } from '__test__/central-authority.test/central-authority-class.test/central-authority-class.test.const.shared';
import { SwarmMessageConstructor } from '../../src/classes/swarm-message/swarm-message-constructor';

export const createMessageConstructor = async (): Promise<SwarmMessageConstructor> => {
  const caConnection = new CentralAuthority();
  const result = await caConnection.connect(CA_CLASS_OPTIONS_VALID_NO_PROFILE);

  if (result instanceof Error) {
    throw result;
  }
  return new SwarmMessageConstructor({
    caConnection,
  });
};
