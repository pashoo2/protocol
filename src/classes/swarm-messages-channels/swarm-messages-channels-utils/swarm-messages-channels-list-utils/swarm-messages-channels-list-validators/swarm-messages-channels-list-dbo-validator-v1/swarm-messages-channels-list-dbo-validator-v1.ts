import { IValidatorSwarmMessagesStoreGrantAccessCallback } from '../../../../../swarm-message-store/types/swarm-message-store-validation.types';
import { TSwrmMessagesChannelsListDBOWithGrantAccess } from '../../../../types/swarm-messages-channels-list.types';
import assert from 'assert';
import { ISwamChannelsListDatabaseOptionsValidator } from '../../../../types/swarm-messages-channels-validation.types';

export function validateSwamChannelsListDatabaseOptions(
  dbOptions: unknown
): dbOptions is TSwrmMessagesChannelsListDBOWithGrantAccess<any, any> {
  if (typeof dbOptions !== 'object') {
    throw new Error('Database options should be an object');
  }
  if (!dbOptions) {
    throw new Error('A database options should be defined');
  }

  const dbOptionsObj = dbOptions as Record<string, any>;

  assert(dbOptionsObj.dbName, 'A database name should not be provided in the options');
  assert(dbOptionsObj.dbType, 'A database type should not be provided in the options');
  // TODO - create grant access function validator common and pass it in the params
  assert(dbOptionsObj.grantAccess, 'Grant access callback must be provided in the databse options');
  assert(typeof dbOptionsObj.grantAccess === 'function', 'Grant access callback should be a function');
  return true;
}

export function getValidatorSwarmChannelsListDatabaseOptions(
  grantAccessCallbackValidator: IValidatorSwarmMessagesStoreGrantAccessCallback
): (dbOptions: unknown) => dbOptions is TSwrmMessagesChannelsListDBOWithGrantAccess<any, any> {
  return (dbOptions: unknown): dbOptions is TSwrmMessagesChannelsListDBOWithGrantAccess<any, any> => {
    if (!validateSwamChannelsListDatabaseOptions(dbOptions)) {
      throw new Error('The database options is not valid');
    }
    if (!grantAccessCallbackValidator(dbOptions.grantAccess)) {
      throw new Error('The grant access callback is not valid');
    }
    return true;
  };
}

export function getSwamChannelsListDatabaseOptionsValidator(): ISwamChannelsListDatabaseOptionsValidator {
  return validateSwamChannelsListDatabaseOptions;
}
