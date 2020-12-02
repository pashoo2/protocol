import React from 'react';
import {
  TSwarmMessageInstance,
  TSwarmMessageSerialized,
  ISwarmMessageInstanceEncrypted,
} from '../../classes/swarm-message/swarm-message-constructor.types';
import { ISwarmMessageInstanceDecrypted } from '../../classes/swarm-message/swarm-message-constructor.types';
import {
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreConnectorBasicFabric,
  TSwarmStoreConnectorConnectionOptions,
  ISwarmStoreProviderOptions,
  ISwarmStoreConnector,
} from '../../classes/swarm-store-class/swarm-store-class.types';
import { IConnectionBridgeOptionsDefault } from '../../classes/connection-bridge/connection-bridge.types';
import {
  TConnectionBridgeOptionsAccessControlOptions,
  TConnectionBridgeOptionsSwarmMessageStoreOptionsWithConnectorFabric,
} from '../../classes/connection-bridge/connection-bridge.types-helpers';
import { TConnectionBridgeOptionsConnectorFabricOptions } from '../../classes/connection-bridge/connection-bridge.types-helpers';
import {
  TConnectionBridgeOptionsConnectorMain,
  TConnectionBridgeOptionsConstructorWithEncryptedCacheFabric,
  TConnectionBridgeOptionsGrandAccessCallback,
} from '../../classes/connection-bridge/connection-bridge.types-helpers';
import { TConnectionBridgeOptionsProviderOptions } from '../../classes/connection-bridge/connection-bridge.types-helpers';
import {
  ISwarmMessagesDatabaseCacheOptions,
  ISwarmMessagesDatabaseCache,
  ISwarmMessagesDatabaseCacheConstructor,
} from '../../classes/swarm-messages-database/swarm-messages-database.types';
import {
  TConnectionBridgeOptionsConnectorBasic,
  TConnectionBridgeOptionsConnectorConnectionOptions,
} from '../../classes/connection-bridge/connection-bridge.types-helpers';
import {
  ISwarmMessagesDatabaseMessagesCollectorWithStoreMeta,
  ISwarmMessagesStoreMeta,
} from '../../classes/swarm-messages-database/swarm-messages-database.messages-collector.types';
import { ConnectToSwarm, P } from '../connect-to-swarm/connect-to-swarm';
import { createSwarmMessagesDatabaseMessagesCollectorWithStoreMetaInstance } from '../../classes/swarm-messages-database/swarm-messages-database-subclasses/swarm-messages-database-messages-collector-with-store-meta/swarm-messages-database-messages-collector-with-store-meta';
import { ISwarmMessageStore } from '../../classes/swarm-message-store/swarm-message-store.types';
import {
  ISwarmStoreWithEntriesCount,
  ISwarmStoreConnectorBasicWithEntriesCount,
  ISwarmStoreConnectorWithEntriesCount,
} from '../../classes/swarm-store-class/swarm-store-class-extended/swarm-store-class-with-entries-count/swarm-store-class-with-entries-count.types';

export class ConnectToSwarmWithAdditionalMeta<
  DbType extends TSwarmStoreDatabaseType<P>,
  T extends TSwarmMessageSerialized,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  CD extends boolean,
  ConnectorBasic extends ISwarmStoreConnectorBasicWithEntriesCount<P, T, DbType, DBO>,
  ConnectorMain extends ISwarmStoreWithEntriesCount<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
    ISwarmStoreProviderOptions<
      P,
      T,
      DbType,
      DBO,
      ConnectorBasic,
      TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>
    >,
    ISwarmStoreConnectorWithEntriesCount<
      P,
      T,
      DbType,
      DBO,
      ConnectorBasic,
      TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>
    >,
    any,
    any
  >,
  SMS extends ISwarmMessageStore<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
    ISwarmStoreProviderOptions<
      P,
      T,
      DbType,
      DBO,
      ConnectorBasic,
      TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>
    >,
    ISwarmStoreConnectorWithEntriesCount<
      P,
      T,
      DbType,
      DBO,
      ConnectorBasic,
      TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>
    >,
    any,
    MI | T,
    any,
    any,
    any,
    any
  > &
    ConnectorMain,
  CBO extends IConnectionBridgeOptionsDefault<
    P,
    T,
    DbType,
    CD,
    DBO,
    MI | T,
    any,
    any,
    any,
    ConnectorBasic,
    TSwarmStoreConnectorBasicFabric<P, T, DbType, DBO, ConnectorBasic>,
    TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
    ISwarmStoreProviderOptions<
      P,
      T,
      DbType,
      DBO,
      ConnectorBasic,
      TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>
    >,
    SMS
  >,
  MI extends TSwarmMessageInstance = TSwarmMessageInstance,
  MD extends ISwarmMessageInstanceDecrypted = Exclude<MI, ISwarmMessageInstanceEncrypted>,
  SMSM extends ISwarmMessagesDatabaseMessagesCollectorWithStoreMeta<
    P,
    T,
    DBO,
    DbType,
    MD,
    ISwarmMessagesStoreMeta
  > = ISwarmMessagesDatabaseMessagesCollectorWithStoreMeta<P, T, DBO, DbType, MD, ISwarmMessagesStoreMeta>,
  DCO extends ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMSM> = ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMSM>,
  DCCRT extends ISwarmMessagesDatabaseCache<P, T, DbType, DBO, MD, SMSM> = ISwarmMessagesDatabaseCache<
    P,
    T,
    DbType,
    DBO,
    MD,
    SMSM
  >,
  SMDCC extends ISwarmMessagesDatabaseCacheConstructor<
    P,
    T,
    DbType,
    DBO,
    MD,
    SMSM,
    DCO,
    DCCRT
  > = ISwarmMessagesDatabaseCacheConstructor<P, T, DbType, DBO, MD, SMSM, DCO, DCCRT>
  // TODO - use CBO instead of any
> extends ConnectToSwarm<DbType, T, DBO, CD, any, MI, MD, SMSM, DCO, DCCRT, SMDCC> {
  protected getSwarmMessagesCollector(): SMSM {
    const { connectionBridge } = this.state;

    if (!connectionBridge) {
      throw new Error('There is no connection with connction bridge');
    }

    const swarmMessageStore = connectionBridge?.swarmMessageStore as SMS;

    if (!swarmMessageStore) {
      throw new Error('Swarm message store is not ready');
    }
    return createSwarmMessagesDatabaseMessagesCollectorWithStoreMetaInstance<
      P,
      T,
      DbType,
      DBO,
      TConnectionBridgeOptionsConnectorBasic<CBO>,
      TConnectionBridgeOptionsConnectorConnectionOptions<CBO>,
      TConnectionBridgeOptionsProviderOptions<CBO>,
      TConnectionBridgeOptionsConnectorMain<CBO>,
      TConnectionBridgeOptionsConnectorFabricOptions<CBO>,
      MI | T,
      TConnectionBridgeOptionsGrandAccessCallback<CBO>,
      TConnectionBridgeOptionsConstructorWithEncryptedCacheFabric<CBO>,
      TConnectionBridgeOptionsAccessControlOptions<CBO>,
      TConnectionBridgeOptionsSwarmMessageStoreOptionsWithConnectorFabric<CBO>,
      any,
      MD,
      ISwarmMessagesStoreMeta
    >({
      swarmMessageStore,
      getSwarmMessageStoreMeta: async (swarmMessageStore: SMS, dbName: DBO['dbName']): Promise<ISwarmMessagesStoreMeta> => {
        const messagesStoredCount = await swarmMessageStore.getCountEntriesAllExists(dbName);

        if (messagesStoredCount instanceof Error) {
          throw messagesStoredCount;
        }
        return {
          messagesStoredCount,
        };
      },
    }) as SMSM;
  }
}
