import { ESwarmStoreConnector } from '../../../../swarm-store-class/swarm-store-class.const';
import { ISwarmStoreConnectorUtilsDatabaseOptionsValidators } from '../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import assert from 'assert';
import { ISwarmMessageInstanceDecrypted } from '../../../../swarm-message/swarm-message-constructor.types';
import { ISwarmStoreConnectorDatabaseAccessControlleGrantCallback } from '../../../../swarm-store-class/swarm-store-class.types';
import {
  TSwarmStoreValueTypes,
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseOptionsSerialized,
} from '../../../../swarm-store-class/swarm-store-class.types';

export class SwarmStoreConnectorDbOptionsValidators<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized
> implements ISwarmStoreConnectorUtilsDatabaseOptionsValidators<P, ItemType, DbType, DBO, DBOS> {
  isValidSerializedOptions(dbOptionsSerialized: unknown): dbOptionsSerialized is DBOS {
    assert(typeof dbOptionsSerialized === 'string', 'Database options serialized should be a string');
    return true;
  }

  isValidOptions(dbo: unknown): dbo is DBO {
    const dbOptionsToValidate = dbo as DBO;
    assert(dbOptionsToValidate, 'Database options should be defined');
    assert(typeof dbOptionsToValidate === 'object', 'Database options should be an object');
    assert(typeof dbOptionsToValidate.dbName === 'string', 'Database name should be defined in options');
    assert(
      typeof (dbOptionsToValidate as DBO &
        Required<ISwarmStoreConnectorDatabaseAccessControlleGrantCallback<P, ItemType, ISwarmMessageInstanceDecrypted>>)
        ?.grantAccess === 'function',
      'Grand access should be a function'
    );
    return true;
  }
}
