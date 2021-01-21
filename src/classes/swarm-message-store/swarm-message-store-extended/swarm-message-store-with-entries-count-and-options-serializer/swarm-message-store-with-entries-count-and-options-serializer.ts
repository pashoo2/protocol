import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import { TSwarmMessageSerialized } from '../../../swarm-message/swarm-message-constructor.types';
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
import {
  ISwarmStoreConnectorBasicWithEntriesCount,
  ISwarmStoreConnectorWithEntriesCount,
} from '../../../swarm-store-class/swarm-store-class-extended/swarm-store-class-with-entries-count/swarm-store-class-with-entries-count.types';
import { getClassSwarmMessageStoreWithEntriesCount as getClassSwarmMessageStoreWithEntriesCountAndConnector } from 'classes/swarm-message-store/swarm-message-store-extended/swarm-message-store-with-entries-count/swarm-message-store-with-entries-count';
import { extendClassSwarmStoreWithOptionsConstructor } from '../../../swarm-store-class/swarm-store-class-extended/swarm-store-class-with-options-constructor/swarm-store-class-with-options-constructor-mixin';
import { ISwarmStoreWithConnector } from '../../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageStoreWithEntriesCount } from '../../types/swarm-message-store.types';
import { ConstructorType } from '../../../../types/helper.types';
import { ISwarmMessageInstanceDecrypted } from '../../../swarm-message/swarm-message-constructor.types';
import { ISwarmStoreOptionsClassConstructor } from '../../../swarm-store-class/swarm-store-class.types';
import { SwarmMessageStoreWithCreateDatabaseOptionsExtender } from '../swarm-message-store-with-database-options-constructor-mixin/swarm-message-store-with-database-options-constructor-mixin';

export function getClassSwarmMessageStoreWithEntriesCountAndOptionsSerializer<
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
  E extends ISwarmMessageStoreEvents<P, T, DbType, DBO>,
  SSOC extends ISwarmStoreOptionsClassConstructor<P, T, DbType, DBO, ConnectorBasic, CO, O>
>(
  SwarmStoreOptionsClass: SSOC
): ConstructorType<
  ISwarmMessageStoreWithEntriesCount<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO, O> &
    ISwarmStoreWithConnector<P, T, DbType, DBO, ConnectorBasic, CO, ConnectorMain> &
    SwarmMessageStoreWithCreateDatabaseOptionsExtender<
      P,
      T,
      DbType,
      DBO,
      ConnectorBasic,
      CO,
      PO,
      ConnectorMain,
      CFO,
      MD,
      GAC,
      MCF,
      ACO,
      O
    >
> {
  const SwarmMessageStoreWithEntriesCountAndConnectorClass = getClassSwarmMessageStoreWithEntriesCountAndConnector<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    CFO,
    MD,
    GAC,
    MCF,
    ACO,
    O,
    E
  >();
  const ClassSwarmStoreWithOptionsConstructor = extendClassSwarmStoreWithOptionsConstructor<
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
    typeof SwarmMessageStoreWithEntriesCountAndConnectorClass,
    typeof SwarmStoreOptionsClass
  >(SwarmMessageStoreWithEntriesCountAndConnectorClass, SwarmStoreOptionsClass);
  return ClassSwarmStoreWithOptionsConstructor;
}
