import {
  ISwarmMessageDatabaseConstructors,
  TSwarmMessageStoreAccessControlGrantAccessCallback,
} from '../../swarm-message-store.types';
import { ISwarmStoreConnectorOrbitDBLogEntity } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db.types';
import {
  TSwarmMessageSeriazlized,
  ISwarmMessageConstructor,
} from '../../../swarm-message/swarm-message-constructor.types';

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

async function swarmMessageGrantValidator(
  this: {
    dbName: string;
    messageConstructor: ISwarmMessageConstructor;
    grantAccessCb?: TSwarmMessageStoreAccessControlGrantAccessCallback;
  },
  payload: ISwarmStoreConnectorOrbitDBLogEntity<TSwarmMessageSeriazlized>,
  userId: string
) {
  debugger;
  if (!payload.value) {
    return false;
  }

  const { dbName, messageConstructor, grantAccessCb } = this;
  const messageSerialized = payload.value;

  try {
    const swarmMessage = await messageConstructor.construct(messageSerialized);

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
}

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
  return swarmMessageGrantValidator.bind({
    messageConstructor,
    dbName,
    grantAccessCb,
  });
};
