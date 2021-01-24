import { ISwarmMessagesStoreMeta } from '../../swarm-messages-database.messages-collector.types';
import {
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreConnectorConnectionOptions,
} from '../../../swarm-store-class/swarm-store-class.types';
import { TSwarmMessageSerialized } from '../../../swarm-message/swarm-message-constructor.types';
import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import { ISwarmMessageStoreWithEntriesCount } from '../../../swarm-message-store/types/swarm-message-store.types';
import {
  ISwarmStoreConnectorBasicWithEntriesCount,
  ISwarmStoreConnectorWithEntriesCount,
} from '../../../swarm-store-class/swarm-store-class-extended/swarm-store-class-with-entries-count/swarm-store-class-with-entries-count.types';

/**
 * Returns meta information with a count of entries
 * which are stored in the swarn message store.
 *
 * @export
 * @template P
 * @template DbType
 * @template T
 * @template DBO
 * @template ConnectorBasic
 * @template ConnectorMain
 * @template SMS
 * @param {SMS} swarmMessageStore
 * @param {DBO['dbName']} dbName
 * @returns {Promise<ISwarmMessagesStoreMeta>}
 */
export async function getSwarmMessageStoreMeta<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>,
  T extends TSwarmMessageSerialized,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasicWithEntriesCount<P, T, DbType, DBO>,
  ConnectorMain extends ISwarmStoreConnectorWithEntriesCount<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>
  >,
  SMS extends ISwarmMessageStoreWithEntriesCount<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    any,
    any,
    ConnectorMain,
    any,
    any,
    any,
    any,
    any,
    any
  >
>(swarmMessageStore: SMS, dbName: DBO['dbName']): Promise<ISwarmMessagesStoreMeta> {
  const messagesAllStoredCount = await swarmMessageStore.getCountEntriesAllExists(dbName);

  if (messagesAllStoredCount instanceof Error) {
    throw messagesAllStoredCount;
  }
  return {
    messagesStoredCount: messagesAllStoredCount,
  };
}
