import {
  ISwarmMessageDatabaseConstructors,
  ISwarmMessageStoreAccessControlGrantAccessCallback,
} from '../../../../types/swarm-message-store.types';
import { TSwarmStoreDatabaseEntryOperation } from '../../../../../swarm-store-class/swarm-store-class.types';
import { TCentralAuthorityUserIdentity } from '../../../../../central-authority-class/central-authority-class-types/central-authority-class-types-common';
import { ESwarmStoreConnector } from '../../../../../swarm-store-class/swarm-store-class.const';
import { EOrbitDbFeedStoreOperation } from '../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { TSwarmStoreConnectorAccessConrotllerGrantAccessCallback } from '../../../../../swarm-store-class/swarm-store-class.types';
import { TSwarmMessageInstance } from '../../../../../swarm-message/swarm-message-constructor.types';
import {
  TSwarmStoreDatabaseEntityKey,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseType,
} from '../../../../../swarm-store-class/swarm-store-class.types';
import { TSwarmMessagesStoreGrantAccessCallback } from '../../../../types/swarm-message-store.types';
import { TSwarmMessageSerialized, ISwarmMessageConstructor } from '../../../../../swarm-message/swarm-message-constructor.types';

export const getMessageConstructorForDatabase = <SMC extends ISwarmMessageConstructor>(
  dbName: string,
  messageConstructors: ISwarmMessageDatabaseConstructors<SMC>
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

async function swarmMessageGrantValidator<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  I extends TSwarmMessageInstance,
  CB extends
    | ISwarmMessageStoreAccessControlGrantAccessCallback<P, T>
    | ISwarmMessageStoreAccessControlGrantAccessCallback<P, I>
    | undefined
>(
  this: {
    dbName: string;
    messageConstructor: ISwarmMessageConstructor;
    grantAccessCb: CB;
    isPublic: boolean | undefined;
    isUserCanWrite: boolean;
    currentUserId: TCentralAuthorityUserIdentity;
  },
  value: T,
  userId: TCentralAuthorityUserIdentity,
  key?: TSwarmStoreDatabaseEntityKey<P>,
  op?: TSwarmStoreDatabaseEntryOperation<P>
) {
  const { dbName, messageConstructor, grantAccessCb, isPublic, isUserCanWrite, currentUserId } = this;
  const isUserHasWriteOrDeletePermissions = isPublic || isUserCanWrite;

  if (isUserHasWriteOrDeletePermissions && userId === currentUserId) {
    // TODO - may be it's necessary to parse a message and compare
    // the uid of the message to the currentUserId instead of the
    // userId === currentUserId
    return true;
  }

  // DELETE message have no value or contains a hash of a message deleted
  if (op === EOrbitDbFeedStoreOperation.DELETE) {
    return isUserHasWriteOrDeletePermissions;
  }

  try {
    const swarmMessage = await messageConstructor.construct(value);

    if (swarmMessage.uid !== userId) {
      return false;
    }
    if (grantAccessCb) {
      return await (grantAccessCb as ISwarmMessageStoreAccessControlGrantAccessCallback<P, I, any>)(
        (swarmMessage as unknown) as I,
        userId,
        dbName,
        key,
        op
      );
    }
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export const getMessageValidator = <
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  MSI extends TSwarmMessageInstance | T,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MSI>,
  SMC extends ISwarmMessageConstructor
>(
  dboptions: DBO,
  messageConstructor: SMC,
  grantAccessCb: GAC | undefined,
  currentUserId: TCentralAuthorityUserIdentity
): TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, T, MSI> => {
  const { dbName, isPublic, write } = dboptions;

  if (!messageConstructor) {
    throw new Error(`There is no message contructor found for the ${dbName}`);
  }
  return (swarmMessageGrantValidator as TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, T, MSI>).bind({
    messageConstructor,
    dbName,
    grantAccessCb,
    isPublic,
    isUserCanWrite: !!isPublic || (!!write && write.includes(currentUserId)),
    currentUserId,
  });
};

async function swarmMessageGrantValidatorWithGrandAccessCallbackParam<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  I extends TSwarmMessageInstance,
  CB extends
    | ISwarmMessageStoreAccessControlGrantAccessCallback<P, T>
    | ISwarmMessageStoreAccessControlGrantAccessCallback<P, I>
    | undefined
>(
  this: {
    dbName: string;
    messageConstructor: ISwarmMessageConstructor;
    isPublic: boolean | undefined;
    isUserCanWrite: boolean;
    currentUserId: TCentralAuthorityUserIdentity;
  },
  grantAccessCb: CB,
  value: T,
  userId: TCentralAuthorityUserIdentity,
  key?: TSwarmStoreDatabaseEntityKey<P>,
  op?: TSwarmStoreDatabaseEntryOperation<P>
) {
  const { dbName, messageConstructor, isPublic, isUserCanWrite, currentUserId } = this;
  const isUserHasWriteOrDeletePermissions = isPublic || isUserCanWrite;

  if (isUserHasWriteOrDeletePermissions && userId === currentUserId) {
    // TODO - may be it's necessary to parse a message and compare
    // the uid of the message to the currentUserId instead of the
    // userId === currentUserId
    return true;
  }

  // DELETE message have no value or contains a hash of a message deleted
  if (op === EOrbitDbFeedStoreOperation.DELETE) {
    return isUserHasWriteOrDeletePermissions;
  }

  try {
    const swarmMessage = await messageConstructor.construct(value);

    if (swarmMessage.uid !== userId) {
      return false;
    }
    if (grantAccessCb) {
      return await (grantAccessCb as ISwarmMessageStoreAccessControlGrantAccessCallback<P, I, any>).call(
        this,
        (swarmMessage as unknown) as I,
        userId,
        dbName,
        key,
        op
      );
    }
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export const getMessageValidatorUnbound = <
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  MSI extends TSwarmMessageInstance | T,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MSI>,
  SMC extends ISwarmMessageConstructor
>(
  dboptions: DBO,
  messageConstructor: SMC,
  grantAccessCb: GAC | undefined,
  currentUserId: TCentralAuthorityUserIdentity
): TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, T, MSI> => {
  function swarmMessageGrantValidator(
    this: {
      dbName: string;
      messageConstructor: SMC;
      isPublic: boolean | undefined;
      isUserCanWrite: boolean;
      currentUserId: TCentralAuthorityUserIdentity;
    },
    value: T,
    userId: TCentralAuthorityUserIdentity,
    key?: TSwarmStoreDatabaseEntityKey<P>,
    op?: TSwarmStoreDatabaseEntryOperation<P>
  ): ReturnType<TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, T, MSI>> {
    return swarmMessageGrantValidatorWithGrandAccessCallbackParam.call(this, grantAccessCb, value, userId, key, op);
  }
  return swarmMessageGrantValidator as TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, T, MSI>;
};
