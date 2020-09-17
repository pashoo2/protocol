import {
  ISwarmMessageDatabaseConstructors,
  TSwarmMessageStoreAccessControlGrantAccessCallback,
} from '../../swarm-message-store.types';
import { ISwarmStoreConnectorOrbitDbDatabaseOptions } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
import {
  ISwarmStoreDatabaseBaseOptions,
  TSwarmStoreDatabaseEntryOperation,
} from '../../../swarm-store-class/swarm-store-class.types';
import { TCentralAuthorityUserIdentity } from '../../../central-authority-class/central-authority-class-types/central-authority-class-types-common';
import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import { EOrbitDbFeedStoreOperation } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { TSwarmStoreConnectorOrbitDbAccessConrotllerGrantAccessCallback } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-access-controller/swarm-store-connector-orbit-db-subclass-access-controller.types';
import { TSwarmStoreValueTypes } from '../../../swarm-store-class/swarm-store-class.types';
import {
  TSwarmMessageSerialized,
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

async function swarmMessageGrantValidator<P extends ESwarmStoreConnector>(
  this: {
    dbName: string;
    messageConstructor: ISwarmMessageConstructor;
    grantAccessCb:
      | TSwarmMessageStoreAccessControlGrantAccessCallback<P>
      | undefined;
    isPublic: boolean | undefined;
    isUserCanWrite: boolean;
    currentUserId: TCentralAuthorityUserIdentity;
  },
  value: TSwarmMessageSerialized,
  userId: string,
  key?: string,
  op?: TSwarmStoreDatabaseEntryOperation<P>
) {
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
  if (op === EOrbitDbFeedStoreOperation.DELETE && !value) {
    return true;
  } else if (!value) {
    return false;
  }

  try {
    const swarmMessage = await messageConstructor.construct(value);

    if (swarmMessage.uid !== userId) {
      return false;
    }
    if (grantAccessCb) {
      return grantAccessCb(swarmMessage, userId, dbName, key, op);
    }
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export const getMessageValidator = <
  P extends ESwarmStoreConnector,
  T extends TSwarmStoreValueTypes<P>
>(
  dboptions: ISwarmStoreConnectorOrbitDbDatabaseOptions<
    TSwarmMessageSerialized
  > &
    ISwarmStoreDatabaseBaseOptions,
  messageConstructors: ISwarmMessageDatabaseConstructors,
  grantAccessCb:
    | TSwarmMessageStoreAccessControlGrantAccessCallback<P>
    | undefined,
  currentUserId: TCentralAuthorityUserIdentity
): TSwarmStoreConnectorOrbitDbAccessConrotllerGrantAccessCallback<P, T> => {
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
