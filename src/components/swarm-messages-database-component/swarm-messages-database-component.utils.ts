import { SwarmMessagesDatabase } from '../../classes/swarm-messages-database/swarm-messages-database';
import { ESwarmStoreConnector } from '../../classes/swarm-store-class/swarm-store-class.const';
import { ISwarmMessagesDatabaseConnectOptions } from '../../classes/swarm-messages-database/swarm-messages-database.types';
import { ISwarmMessageInstanceDecrypted } from '../../classes/swarm-message/swarm-message-constructor.types';
import { ISwarmMessagesDatabaseMessageDescription } from './swarm-messages-database-component.types';
import { ESwarmMessageStoreEventNames } from '../../classes/swarm-message-store/swarm-message-store.const';

export const connectToDatabase = async <
  P extends ESwarmStoreConnector = ESwarmStoreConnector.OrbitDB
>(
  options: ISwarmMessagesDatabaseConnectOptions<P>
): Promise<SwarmMessagesDatabase<P>> => {
  const db = new SwarmMessagesDatabase<P>();

  await db.connect(options);
  return db;
};

export const setMessageListener = <T extends SwarmMessagesDatabase<any>>(
  db: T,
  messagesListener: (message: ISwarmMessagesDatabaseMessageDescription) => void
): void => {
  db.emitter.addListener(
    ESwarmMessageStoreEventNames.NEW_MESSAGE,
    (
      dbName: string,
      message: ISwarmMessageInstanceDecrypted,
      // the global unique address of the message in the swarm
      messageAddress: string,
      // for key-value store it will be the key
      key?: string
    ) => {
      debugger;
      messagesListener({
        message,
        id: messageAddress,
        key,
      });
    }
  );
};
