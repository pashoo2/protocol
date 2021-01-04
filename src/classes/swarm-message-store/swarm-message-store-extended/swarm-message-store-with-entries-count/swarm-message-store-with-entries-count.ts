import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import {
  TSwarmMessageSerialized,
  TSwarmMessageInstance,
  ISwarmMessageInstanceDecrypted,
} from '../../../swarm-message/swarm-message-constructor.types';
import {
  TSwarmStoreDatabaseType,
  TSwarmStoreConnectorConnectionOptions,
  TSwarmStoreDatabaseOptions,
  ISwarmStoreProviderOptions,
  ISwarmStoreOptionsConnectorFabric,
} from '../../../swarm-store-class/swarm-store-class.types';
import {
  TSwarmMessagesStoreGrantAccessCallback,
  ISwarmMessageStoreAccessControlOptions,
  ISwarmMessageStoreOptionsWithConnectorFabric,
  ISwarmMessageStoreEvents,
} from '../../types/swarm-message-store.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../../swarm-message-encrypted-cache/swarm-messgae-encrypted-cache.types';
import { SwarmMessageStore } from '../../swarm-message-store';
import { getClassSwarmStoreWithEntriesCount } from '../../../swarm-store-class/swarm-store-class-extended/swarm-store-class-with-entries-count';
import { ISwarmMessageStoreWithEntriesCount } from '../../types/swarm-message-store.types';
import { ConstructorType } from '../../../../types/helper.types';
import { ISwarmStoreWithConnector } from '../../../swarm-store-class/swarm-store-class.types';
import {
  ISwarmStoreConnectorBasicWithEntriesCount,
  ISwarmStoreConnectorWithEntriesCount,
} from '../../../swarm-store-class/swarm-store-class-extended/swarm-store-class-with-entries-count/swarm-store-class-with-entries-count.types';

export function getClassSwarmMessageStoreWithEntriesCount<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasicWithEntriesCount<P, ItemType, DbType, DBO>,
  CO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>,
  PO extends ISwarmStoreProviderOptions<P, ItemType, DbType, DBO, ConnectorBasic, CO>,
  ConnectorMain extends ISwarmStoreConnectorWithEntriesCount<P, ItemType, DbType, DBO, ConnectorBasic, CO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, ItemType, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain>,
  I extends ISwarmMessageInstanceDecrypted,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, I | ItemType>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, ItemType, I | ItemType, GAC> | undefined,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<
    P,
    ItemType,
    DbType,
    DBO,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    CFO,
    I | ItemType,
    GAC,
    MCF,
    ACO
  >,
  E extends ISwarmMessageStoreEvents<P, ItemType, DbType, DBO>
>(): ConstructorType<
  ISwarmMessageStoreWithEntriesCount<
    P,
    ItemType,
    DbType,
    DBO,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    CFO,
    I | ItemType,
    GAC,
    MCF,
    ACO,
    O
  > &
    ISwarmStoreWithConnector<P, ItemType, DbType, DBO, ConnectorBasic, CO, ConnectorMain>
> {
  class SwarmMessageStoreConstructor extends SwarmMessageStore<
    P,
    ItemType,
    DbType,
    DBO,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    CFO,
    I | ItemType,
    GAC,
    MCF,
    ACO,
    O,
    E
  > {}
  return getClassSwarmStoreWithEntriesCount<
    P,
    ItemType,
    DbType,
    DBO,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    CFO,
    O,
    typeof SwarmMessageStoreConstructor
  >(SwarmMessageStoreConstructor) as ConstructorType<
    ISwarmMessageStoreWithEntriesCount<
      P,
      ItemType,
      DbType,
      DBO,
      ConnectorBasic,
      CO,
      PO,
      ConnectorMain,
      CFO,
      I | ItemType,
      GAC,
      MCF,
      ACO,
      O
    > &
      ISwarmStoreWithConnector<P, ItemType, DbType, DBO, ConnectorBasic, CO, ConnectorMain>
  >;
}
