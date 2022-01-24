import { IValidatorSwarmMessagesStoreGrantAccessCallback } from '../../../../../swarm-message-store/types/swarm-message-store-validation.types';
import { TSwarmMessagesChannelsListDBOWithGrantAccess } from '../../../../types/swarm-messages-channels-list-instance.types';

export function validateSwamChannelsListDatabaseOptions(
  dbOptions: unknown
): dbOptions is TSwarmMessagesChannelsListDBOWithGrantAccess<any, any, any, any> {
  if (typeof dbOptions !== 'object') {
    throw new Error('Database options should be an object');
  }
  if (!dbOptions) {
    throw new Error('A database options should be defined');
  }

  const dbOptionsObj = dbOptions as Record<string, any>;

  if (dbOptionsObj.dbName) {
    console.warn('A database name should not be provided in the options');
  }
  if (dbOptionsObj.dbType) {
    console.warn('A database type should not be provided in the options');
  }
  return true;
}

export function getValidatorSwarmChannelsListDatabaseOptions(
  grantAccessCallbackValidator: IValidatorSwarmMessagesStoreGrantAccessCallback
): (dbOptions: unknown) => dbOptions is TSwarmMessagesChannelsListDBOWithGrantAccess<any, any, any, any> {
  return (dbOptions: unknown): dbOptions is TSwarmMessagesChannelsListDBOWithGrantAccess<any, any, any, any> => {
    if (!validateSwamChannelsListDatabaseOptions(dbOptions)) {
      throw new Error('The database options is not valid');
    }
    if (!grantAccessCallbackValidator(dbOptions.grantAccess)) {
      throw new Error('The grant access callback is not valid');
    }
    return true;
  };
}
