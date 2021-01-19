import assert from 'assert';
import { IValidatorSwarmMessagesStoreGrantAccessCallback } from '../../../../../swarm-message-store/types/swarm-message-store-validation.types';
import { TSwrmMessagesChannelsListDBOWithGrantAccess } from '../../../../types/swarm-messages-channels-list.types';

export function validateSwamChannelsListDatabaseOptions(
  dbOptions: unknown
): dbOptions is TSwrmMessagesChannelsListDBOWithGrantAccess<any, any, any, any> {
  if (typeof dbOptions !== 'object') {
    throw new Error('Database options should be an object');
  }
  if (!dbOptions) {
    throw new Error('A database options should be defined');
  }

  const dbOptionsObj = dbOptions as Record<string, any>;

  assert(dbOptionsObj.dbName, 'A database name should not be provided in the options');
  assert(dbOptionsObj.dbType, 'A database type should not be provided in the options');
  return true;
}

export function getValidatorSwarmChannelsListDatabaseOptions(
  grantAccessCallbackValidator: IValidatorSwarmMessagesStoreGrantAccessCallback
): (dbOptions: unknown) => dbOptions is TSwrmMessagesChannelsListDBOWithGrantAccess<any, any, any, any> {
  return (dbOptions: unknown): dbOptions is TSwrmMessagesChannelsListDBOWithGrantAccess<any, any, any, any> => {
    if (!validateSwamChannelsListDatabaseOptions(dbOptions)) {
      throw new Error('The database options is not valid');
    }
    if (!grantAccessCallbackValidator(dbOptions.grantAccess)) {
      throw new Error('The grant access callback is not valid');
    }
    return true;
  };
}
