import {
  ISwarmMessageDatabaseConstructors,
  TSwarmMessageStoreAccessControlGrantAccessCallback,
} from '../../swarm-message-store.types';
import { ISwarmStoreConnectorOrbitDBLogEntity } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db.types';
import { TSwarmMessageSeriazlized } from '../../../swarm-message/swarm-message-constructor.types';

export const getMessageConstructorForDatabase = (
  dbName: string,
  messageConstructors: ISwarmMessageDatabaseConstructors
) => {
  if (!messageConstructors) {
    return;
  }

  const dbMessageConstructor = messageConstructors[dbName];

  if (dbMessageConstructor) {
    return dbMessageConstructor;
  }
  return messageConstructors.default;
};

export const getMessageValidator = (
  dbName: string,
  messageConstructors: ISwarmMessageDatabaseConstructors,
  grantAccessCb?: TSwarmMessageStoreAccessControlGrantAccessCallback
) => {
  const messageConstructor = getMessageConstructorForDatabase(
    dbName,
    messageConstructors
  );

  if (!messageConstructor) {
    throw new Error(`There is no message contructor found for the ${dbName}`);
  }
  return async (
    payload: ISwarmStoreConnectorOrbitDBLogEntity<TSwarmMessageSeriazlized>,
    userId: string
  ) => {
    if (!payload.value) {
      return false;
    }

    const messageSerialized = payload.value;

    try {
      const swarmMessage = await messageConstructor.construct(
        messageSerialized
      );

      if (swarmMessage.uid !== userId) {
        return false;
      }
      if (grantAccessCb) {
        return grantAccessCb(swarmMessage, userId, dbName);
      }
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };
};
