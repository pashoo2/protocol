import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import {
  TSwarmMessageSerialized,
  TSwarmMessageInstance,
  ISwarmMessageInstanceEncrypted,
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
import {
  ISwarmStoreConnectorBasicWithEntriesCount,
  ISwarmStoreConnectorWithEntriesCount,
} from '../../../swarm-store-class/swarm-store-class-extended/swarm-store-class-with-entries-count/swarm-store-class-with-entries-count.types';
import { getClassSwarmMessageStoreWithEntriesCount as getClassSwarmMessageStoreWithEntriesCountAndConnector } from 'classes/swarm-message-store/swarm-message-store-extended/swarm-message-store-with-entries-count/swarm-message-store-with-entries-count';
import { extendClassSwarmStoreWithOptionsConstructor } from '../../../swarm-store-class/swarm-store-class-extended/swarm-store-class-with-options-constructor/swarm-store-class-with-options-constructor-mixin';
import { ISwarmStoreOptionsClassConstructor, ISwarmStoreWithConnector } from '../../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageStoreWithEntriesCount } from '../../types/swarm-message-store.types';
import { ConstructorType } from '../../../../types/helper.types';
import { ISwarmMessageInstanceDecrypted } from '../../../swarm-message/swarm-message-constructor.types';

export function getClassSwarmMessageStoreWithEntriesCountAndOptionsSerializer<
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
>(
  SwarmStoreOptionsClass?: ISwarmStoreOptionsClassConstructor<P, ItemType, DbType, DBO, ConnectorBasic, CO>
): ConstructorType<
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
  const SwarmMessageStoreWithEntriesCountAndConnectorClass = getClassSwarmMessageStoreWithEntriesCountAndConnector<
    P,
    ItemType,
    DbType,
    DBO,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    CFO,
    I,
    GAC,
    MCF,
    ACO,
    O,
    E
  >();
  const ClassSwarmStoreWithOptionsConstructor = extendClassSwarmStoreWithOptionsConstructor<
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
    typeof SwarmMessageStoreWithEntriesCountAndConnectorClass
  >(SwarmMessageStoreWithEntriesCountAndConnectorClass, SwarmStoreOptionsClass);
  return ClassSwarmStoreWithOptionsConstructor;
}
