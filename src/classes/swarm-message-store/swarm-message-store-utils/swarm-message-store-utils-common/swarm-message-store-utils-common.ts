import {
  ISwarmMessageDatabaseConstructors,
  TSwarmMessageStoreAccessControlGrantAccessCallback,
} from '../../swarm-message-store.types';
import { ISwarmStoreConnectorOrbitDBLogEntity } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db.types';
import { ISwarmStoreConnectorOrbitDbDatabaseOptions } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
import { TSwarmMessageSerialized } from '../../../swarm-message/swarm-message-constructor.types';
import { ISwarmStoreDatabaseBaseOptions } from '../../../swarm-store-class/swarm-store-class.types';
import { TCentralAuthorityUserIdentity } from '../../../central-authority-class/central-authority-class-types/central-authority-class-types-common';
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
    grantAccessCb:
      | TSwarmMessageStoreAccessControlGrantAccessCallback
      | undefined;
    isPublic: boolean | undefined;
    isUserCanWrite: boolean;
    currentUserId: TCentralAuthorityUserIdentity;
  },
  payload: ISwarmStoreConnectorOrbitDBLogEntity<TSwarmMessageSeriazlized>,
  userId: string
) {
  if (!payload.value) {
    return false;
  }

  const {
    dbName,
    messageConstructor,
    grantAccessCb,
    isPublic,
    isUserCanWrite,
    currentUserId,
  } = this;

  if ((isPublic || isUserCanWrite) && userId === currentUserId) {
    // TODO - may be it's necessary to parse a message and compare
    // the uid of the message to the currentUserId instead of the
    // userId === currentUserId
    return true;
  }

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
  dboptions: ISwarmStoreConnectorOrbitDbDatabaseOptions<
    TSwarmMessageSerialized
  > &
    ISwarmStoreDatabaseBaseOptions,
  messageConstructors: ISwarmMessageDatabaseConstructors,
  grantAccessCb: TSwarmMessageStoreAccessControlGrantAccessCallback | undefined,
  currentUserId: TCentralAuthorityUserIdentity
) => {
  const { dbName, isPublic, write } = dboptions;
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
    isPublic,
    isUserCanWrite: !!isPublic || (!!write && write.includes(currentUserId)),
    currentUserId,
  });
};
