import {
  ISwarmMessageDatabaseConstructors,
  ISwarmMessageStoreAccessControlGrantAccessCallback,
} from '../../../../types/swarm-message-store.types';
import { TSwarmStoreDatabaseEntryOperation } from '../../../../../swarm-store-class/swarm-store-class.types';
import { TCentralAuthorityUserIdentity } from '../../../../../central-authority-class/central-authority-class-types/central-authority-class-types-common';
import { ESwarmStoreConnector } from '../../../../../swarm-store-class/swarm-store-class.const';
import { EOrbitDbFeedStoreOperation } from '../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { TSwarmStoreConnectorAccessConrotllerGrantAccessCallback } from '../../../../../swarm-store-class/swarm-store-class.types';
import {
  TSwarmMessageInstance,
  ISwarmMessageInstanceDecrypted,
} from '../../../../../swarm-message/swarm-message-constructor.types';
import {
  TSwarmStoreDatabaseEntityKey,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseType,
} from '../../../../../swarm-store-class/swarm-store-class.types';
import { TSwarmMessagesStoreGrantAccessCallback } from '../../../../types/swarm-message-store.types';
import {
  TSwarmMessageSerialized,
  ISwarmMessageConstructor,
  ISwarmMessageInstanceEncrypted,
} from '../../../../../swarm-message/swarm-message-constructor.types';
import { isValidSwarmMessageDecryptedFormat } from '../../../../swarm-message-store-utils/swarm-message-store-validators/swarm-message-store-validator-swarm-message';
import {
  ISwarmMessageGrantValidatorContext,
  IGetMessageValidatorUnboundFabricReturnedSwarmMessageGrantValidatorFunctionContext,
} from './swarm-message-store-conector-db-options-grand-access-utils-common-grand-access-checker.types';

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

async function swarmMessageGrantValidatorWithCBContext<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  I extends ISwarmMessageInstanceDecrypted,
  CB extends
    | ISwarmMessageStoreAccessControlGrantAccessCallback<P, T>
    | ISwarmMessageStoreAccessControlGrantAccessCallback<P, I>
    | undefined,
  CTX extends any | never
>(
  this: ISwarmMessageGrantValidatorContext<P, T, I, CB>,
  value: T | I | string,
  senderUserId: TCentralAuthorityUserIdentity,
  key?: TSwarmStoreDatabaseEntityKey<P>,
  op?: TSwarmStoreDatabaseEntryOperation<P>,
  callbackContext?: CTX
): Promise<boolean> {
  const { dbName, messageConstructor, grantAccessCb, isPublic, isUserCanWrite, currentUserId } = this;
  const isUserHasWriteOrDeletePermissions = isPublic || isUserCanWrite;

  if (!isUserHasWriteOrDeletePermissions) {
    return false;
  }
  if (isUserHasWriteOrDeletePermissions && senderUserId === currentUserId) {
    // TODO - may be it's necessary to parse a message and compare
    // the uid of the message to the currentUserId instead of the
    // userId === currentUserId
    return true;
  }

  let swarmMessage: undefined | I;

  // DELETE message have no value or contains a hash of a message deleted
  if (op !== EOrbitDbFeedStoreOperation.DELETE) {
    try {
      if (typeof value === 'string') {
        swarmMessage = (await messageConstructor.construct(value)) as I;
      } else {
        // is swarm message decrypted
        if (isValidSwarmMessageDecryptedFormat(value)) {
          swarmMessage = value;
        }
        return false;
      }
      // if an identifier of the user who constructed the message
      // is not the same with the user who sent it, do not allow
      // the operation
      if (swarmMessage.uid !== senderUserId) {
        return false;
      }
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
  if (grantAccessCb) {
    return await (grantAccessCb as ISwarmMessageStoreAccessControlGrantAccessCallback<P, I, any>).call(
      callbackContext,
      swarmMessage ?? value,
      senderUserId,
      dbName,
      key,
      op
    );
  }
  return true;
}

async function swarmMessageGrantValidator<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  I extends TSwarmMessageInstance,
  CB extends
    | ISwarmMessageStoreAccessControlGrantAccessCallback<P, T>
    | ISwarmMessageStoreAccessControlGrantAccessCallback<P, I>
    | undefined
>(
  this: ISwarmMessageGrantValidatorContext<P, T, I, CB>,
  value: T,
  senderUserId: TCentralAuthorityUserIdentity,
  key?: TSwarmStoreDatabaseEntityKey<P>,
  op?: TSwarmStoreDatabaseEntryOperation<P>
): Promise<boolean> {
  return await swarmMessageGrantValidatorWithCBContext.call(this, value, senderUserId, key, op);
}

export const getMessageValidator = <
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  MSI extends TSwarmMessageInstance | T,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, Exclude<MSI, ISwarmMessageInstanceEncrypted>>,
  SMC extends ISwarmMessageConstructor
>(
  dboptions: DBO,
  messageConstructor: SMC,
  grantAccessCb: GAC | undefined,
  currentUserId: TCentralAuthorityUserIdentity
): TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, T, Exclude<Exclude<MSI, ISwarmMessageInstanceEncrypted>, T>> => {
  const { dbName, isPublic, write } = dboptions;

  if (!messageConstructor) {
    throw new Error(`There is no message contructor found for the ${dbName}`);
  }
  return (swarmMessageGrantValidator as TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<
    P,
    T,
    Exclude<Exclude<MSI, ISwarmMessageInstanceEncrypted>, T>
  >).bind({
    messageConstructor,
    dbName,
    grantAccessCb,
    isPublic,
    isUserCanWrite: !!write?.includes(currentUserId),
    currentUserId,
  });
};

export const getMessageValidatorForGrandAccessCallbackBound = <
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  I extends ISwarmMessageInstanceDecrypted,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, I | T>,
  SMC extends ISwarmMessageConstructor
>(
  grantAccessCb: GAC | undefined
): TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, T, I> => {
  async function swarmMessageGrantValidatorWithSwarmMessageStoreContext(
    this: IGetMessageValidatorUnboundFabricReturnedSwarmMessageGrantValidatorFunctionContext<SMC>,
    payload: T,
    senderUserId: TCentralAuthorityUserIdentity,
    key?: TSwarmStoreDatabaseEntityKey<P>,
    op?: TSwarmStoreDatabaseEntryOperation<P>
  ): ReturnType<TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, T, I>> {
    const { currentUserId, dbName, isPublicDb, swarmMessageConstructor, usersIdsWithWriteAccess } = this;

    const swarmMessageGrantValidatorContext: ISwarmMessageGrantValidatorContext<P, T, I, GAC> = {
      dbName,
      currentUserId,
      isPublic: isPublicDb,
      isUserCanWrite: usersIdsWithWriteAccess.includes(senderUserId),
      messageConstructor: swarmMessageConstructor,
      grantAccessCb,
    };
    return await swarmMessageGrantValidatorWithCBContext.call(
      swarmMessageGrantValidatorContext,
      payload,
      senderUserId,
      key,
      op,
      this
    );
  }
  return swarmMessageGrantValidatorWithSwarmMessageStoreContext as TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<
    P,
    T,
    I
  >;
};
