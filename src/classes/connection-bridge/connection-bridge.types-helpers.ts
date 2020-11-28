import {
  ISwarmStoreConnector,
  ISwarmStoreConnectorBasic,
  ISwarmStoreOptionsConnectorFabric,
  ISwarmStoreProviderOptions,
  TSwarmStoreConnectorBasicFabric,
  TSwarmStoreConnectorConnectionOptions,
} from '../swarm-store-class';
import { ISwarmMessageStoreAccessControlOptions, TSwarmMessagesStoreGrantAccessCallback } from '../swarm-message-store';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../swarm-messgae-encrypted-cache';
import { IConnectionBridgeOptions } from './connection-bridge.types';

export type TConnectionBridgeOptionsConnectorBasic<
  T extends IConnectionBridgeOptions<
    any,
    any,
    any,
    any,
    ISwarmStoreConnectorBasic<any, any, any, any>,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >
> = T extends IConnectionBridgeOptions<any, any, any, any, infer CB, any, any, any, any, any, any, any, any, any, any>
  ? CB
  : never;
export type TConnectionBridgeOptionsConnectorConnectionOptions<
  T extends IConnectionBridgeOptions<
    any,
    any,
    any,
    any,
    ISwarmStoreConnectorBasic<any, any, any, any>,
    TSwarmStoreConnectorConnectionOptions<any, any, any, any, any>,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >
> = T extends IConnectionBridgeOptions<any, any, any, any, any, infer CO, any, any, any, any, any, any, any, any, any>
  ? CO
  : never;
export type TConnectionBridgeOptionsProviderOptions<
  T extends IConnectionBridgeOptions<
    any,
    any,
    any,
    any,
    ISwarmStoreConnectorBasic<any, any, any, any>,
    TSwarmStoreConnectorConnectionOptions<any, any, any, any, any>,
    ISwarmStoreProviderOptions<any, any, any, any, any, any>,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >
> = T extends IConnectionBridgeOptions<any, any, any, any, any, any, infer PO, any, any, any, any, any, any, any, any>
  ? PO
  : never;
export type TConnectionBridgeOptionsConnectorMain<
  T extends IConnectionBridgeOptions<
    any,
    any,
    any,
    any,
    ISwarmStoreConnectorBasic<any, any, any, any>,
    TSwarmStoreConnectorConnectionOptions<any, any, any, any, any>,
    ISwarmStoreProviderOptions<any, any, any, any, any, any>,
    ISwarmStoreConnector<any, any, any, any, any, any>,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >
> = T extends IConnectionBridgeOptions<any, any, any, any, any, any, any, infer ConnectorMain, any, any, any, any, any, any, any>
  ? ConnectorMain
  : never;
export type TConnectionBridgeOptionsSwarmMessageInstance<
  T extends IConnectionBridgeOptions<
    any,
    any,
    any,
    any,
    ISwarmStoreConnectorBasic<any, any, any, any>,
    TSwarmStoreConnectorConnectionOptions<any, any, any, any, any>,
    ISwarmStoreProviderOptions<any, any, any, any, any, any>,
    ISwarmStoreConnector<any, any, any, any, any, any>,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >
> = T extends IConnectionBridgeOptions<any, any, any, any, any, any, any, any, infer MSI, any, any, any, any, any, any>
  ? MSI
  : never;
export type TConnectionBridgeOptionsGrandAccessCallback<
  T extends IConnectionBridgeOptions<
    any,
    any,
    any,
    any,
    ISwarmStoreConnectorBasic<any, any, any, any>,
    TSwarmStoreConnectorConnectionOptions<any, any, any, any, any>,
    ISwarmStoreProviderOptions<any, any, any, any, any, any>,
    ISwarmStoreConnector<any, any, any, any, any, any>,
    any,
    TSwarmMessagesStoreGrantAccessCallback<any, any>,
    any,
    any,
    any,
    any,
    any
  >
> = T extends IConnectionBridgeOptions<any, any, any, any, any, any, any, any, any, infer GAC, any, any, any, any, any>
  ? GAC
  : never;
export type TConnectionBridgeOptionsConstructorWithEncryptedCacheFabric<
  T extends IConnectionBridgeOptions<
    any,
    any,
    any,
    any,
    ISwarmStoreConnectorBasic<any, any, any, any>,
    TSwarmStoreConnectorConnectionOptions<any, any, any, any, any>,
    ISwarmStoreProviderOptions<any, any, any, any, any, any>,
    ISwarmStoreConnector<any, any, any, any, any, any>,
    any,
    TSwarmMessagesStoreGrantAccessCallback<any, any>,
    ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
    any,
    any,
    any,
    any
  >
> = T extends IConnectionBridgeOptions<any, any, any, any, any, any, any, any, any, any, infer MCF, any, any, any, any>
  ? MCF
  : never;
export type TConnectionBridgeOptionsAccessControlOptions<
  T extends IConnectionBridgeOptions<
    any,
    any,
    any,
    any,
    ISwarmStoreConnectorBasic<any, any, any, any>,
    TSwarmStoreConnectorConnectionOptions<any, any, any, any, any>,
    ISwarmStoreProviderOptions<any, any, any, any, any, any>,
    ISwarmStoreConnector<any, any, any, any, any, any>,
    any,
    TSwarmMessagesStoreGrantAccessCallback<any, any>,
    ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
    ISwarmMessageStoreAccessControlOptions<any, any, any, any> | undefined,
    any,
    any,
    any
  >
> = T extends IConnectionBridgeOptions<any, any, any, any, any, any, any, any, any, any, any, infer ACO, any, any, any>
  ? ACO
  : never;
export type TConnectionBridgeOptionsConnectorFabricOptions<
  T extends IConnectionBridgeOptions<
    any,
    any,
    any,
    any,
    ISwarmStoreConnectorBasic<any, any, any, any>,
    TSwarmStoreConnectorConnectionOptions<any, any, any, any, any>,
    ISwarmStoreProviderOptions<any, any, any, any, any, any>,
    ISwarmStoreConnector<any, any, any, any, any, any>,
    any,
    TSwarmMessagesStoreGrantAccessCallback<any, any>,
    ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
    ISwarmMessageStoreAccessControlOptions<any, any, any, any> | undefined,
    ISwarmStoreOptionsConnectorFabric<any, any, any, any, any, any, any, any> | undefined,
    any,
    any
  >
> = T extends IConnectionBridgeOptions<any, any, any, any, any, any, any, any, any, any, any, any, infer CFO, any, any>
  ? NonNullable<CFO>
  : never;
export type TConnectionBridgeOptionsConnectorBasicFabric<
  T extends IConnectionBridgeOptions<
    any,
    any,
    any,
    any,
    ISwarmStoreConnectorBasic<any, any, any, any>,
    TSwarmStoreConnectorConnectionOptions<any, any, any, any, any>,
    ISwarmStoreProviderOptions<any, any, any, any, any, any>,
    ISwarmStoreConnector<any, any, any, any, any, any>,
    any,
    TSwarmMessagesStoreGrantAccessCallback<any, any>,
    ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
    ISwarmMessageStoreAccessControlOptions<any, any, any, any> | undefined,
    ISwarmStoreOptionsConnectorFabric<any, any, any, any, any, any, any, any> | undefined,
    TSwarmStoreConnectorBasicFabric<any, any, any, any, any> | undefined,
    any
  >
> = T extends IConnectionBridgeOptions<any, any, any, any, any, any, any, any, any, any, any, any, any, infer CBFO, any>
  ? CBFO
  : never;
