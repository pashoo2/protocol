import { IConnectionBridge, IConnectionBridgeOptions, IConnectionBridgeOptionsAny } from '../connection-bridge.types';
import { ISerializer } from '../../../../types/serialization.types';
import {
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreConnectorBasicFabric,
  ISwarmStoreOptionsConnectorFabric,
} from '../../../swarm-store-class/swarm-store-class.types';
import { TSwarmMessageSerialized } from '../../../swarm-message/swarm-message-constructor.types';
import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import { TSwarmStoreConnectorConnectionOptions } from '../../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageStoreOptionsWithConnectorFabric } from 'classes/swarm-message-store/types/swarm-message-store.types';

import {
  ConnectorBasic,
  PO,
  ConnectorMain,
  MSI,
  GAC,
  MCF,
  ACO,
  SMS,
  SSDPLF,
} from './connection-bridge-storage-options.types.helpers';

export type TConnectionBridgeByOptions<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  CBO extends IConnectionBridgeOptionsAny<P, T, DbType, DBO, CD, SRLZR>,
  CD extends boolean = boolean,
  SRLZR extends ISerializer = ISerializer,
  SO extends CBO['storage'] = CBO['storage']
> = IConnectionBridge<
  P,
  T,
  DbType,
  DBO,
  ConnectorBasic<SO>,
  TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic<SO>>,
  PO<SO>,
  ConnectorMain<SO>,
  ISwarmStoreOptionsConnectorFabric<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic<SO>,
    TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic<SO>>,
    PO<SO>,
    ConnectorMain<SO>
  >,
  TSwarmStoreConnectorBasicFabric<P, T, DbType, DBO, ConnectorBasic<SO>>,
  MSI<SO>,
  GAC<SO>,
  MCF<SO>,
  ACO<SO>,
  ISwarmMessageStoreOptionsWithConnectorFabric<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic<SO>,
    TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic<SO>>,
    PO<SO>,
    ConnectorMain<SO>,
    ISwarmStoreOptionsConnectorFabric<
      P,
      T,
      DbType,
      DBO,
      ConnectorBasic<SO>,
      TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic<SO>>,
      PO<SO>,
      ConnectorMain<SO>
    >,
    MSI<SO>,
    GAC<SO>,
    MCF<SO>,
    ACO<SO>
  >,
  CD,
  CBO,
  SMS<SO>,
  SSDPLF<SO>,
  SRLZR
>;
