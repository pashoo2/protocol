import { ESwarmStoreConnector } from '../../../swarm-store-class.const';
import assert from 'assert';
import {
  TSwarmStoreValueTypes,
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreConnectorConnectionOptions,
  ISwarmStoreConnectorBasic,
  TSwarmStoreOptionsSerialized,
  ISwarmStoreOptions,
} from '../../../swarm-store-class.types';

export function validateSwarmStoreOptionsSerialized(optsSerialized: unknown): optsSerialized is TSwarmStoreOptionsSerialized {
  return typeof optsSerialized === 'string';
}

export function validateSwarmStoreOptions<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>
>(opts: unknown): opts is ISwarmStoreOptions<P, ItemType, DbType, DBO, ConnectorBasic, PO> {
  assert(opts, 'Swarm store options should be defined');

  const optionsToValidate = opts as ISwarmStoreOptions<P, ItemType, DbType, DBO, ConnectorBasic, PO>;

  assert(optionsToValidate.userId, 'User id should be defined in the options');
  assert(optionsToValidate.credentials, 'User credentials should be defined in the options');
  assert(optionsToValidate.databases, 'Databases list should be defined in the options');
  assert(optionsToValidate.provider, 'Connector to the swarm provider should be defined in the options');
  assert(optionsToValidate.directory, 'A directory for all databases should be defined in the options');
  assert(optionsToValidate.providerConnectionOptions, 'A swarm connection provider options should be defined in the options');
  return true;
}
