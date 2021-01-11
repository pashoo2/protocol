import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import { TSwarmMessageSerialized, ISwarmMessageInstanceDecrypted } from '../../../swarm-message/swarm-message-constructor.types';
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
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasicWithEntriesCount<P, T, DbType, DBO>,
  CO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
  PO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, CO>,
  ConnectorMain extends ISwarmStoreConnectorWithEntriesCount<P, T, DbType, DBO, ConnectorBasic, CO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain>,
  MD extends ISwarmMessageInstanceDecrypted,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MD | T>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MD | T, GAC> | undefined,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    CFO,
    MD | T,
    GAC,
    MCF,
    ACO
  >,
  E extends ISwarmMessageStoreEvents<P, T, DbType, DBO>
>(): ConstructorType<
  ISwarmMessageStoreWithEntriesCount<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO, O> &
    ISwarmStoreWithConnector<P, T, DbType, DBO, ConnectorBasic, CO, ConnectorMain>
> {
  class SwarmMessageStoreConstructor extends SwarmMessageStore<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    CFO,
    MD | T,
    GAC,
    MCF,
    ACO,
    O,
    E
  > {}
  return getClassSwarmStoreWithEntriesCount<
    P,
    T,
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
    ISwarmMessageStoreWithEntriesCount<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO, O> &
      ISwarmStoreWithConnector<P, T, DbType, DBO, ConnectorBasic, CO, ConnectorMain>
  >;
}
