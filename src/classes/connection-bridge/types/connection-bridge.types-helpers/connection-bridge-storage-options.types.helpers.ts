import {
  IConnectionBridgeStorageOptions,
  IConnectionBridgeOptions,
  IConnectionBridgeOptionsUser,
} from '../connection-bridge.types';
import { ISerializer } from '../../../../types/serialization.types';
import {
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreConnectorBasicFabric,
} from '../../../swarm-store-class/swarm-store-class.types';
import { TSwarmMessageSerialized } from '../../../swarm-message/swarm-message-constructor.types';
import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import { TSwarmStoreConnectorConnectionOptions } from '../../../swarm-store-class/swarm-store-class.types';
import { IConnectionBridgeOptionsAuth, TNativeConnectionOptions } from '../connection-bridge.types';
import { JSONSchema7 } from 'json-schema';

/*
 Generic looks like:

 IConnectionBridgeStorageOptions<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    MSI,
    GAC,
    MCF,
    ACO,
    CFO,
    CBFO,
    O,
    SMS,
    SSDPLF
  >
*/

export type DbType<
  CBSO extends IConnectionBridgeStorageOptions<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
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
> = CBSO extends IConnectionBridgeStorageOptions<
  any,
  any,
  infer DbType,
  any,
  any,
  any,
  any,
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
  ? DbType
  : never;

export type DBO<
  CBSO extends IConnectionBridgeStorageOptions<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
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
> = CBSO extends IConnectionBridgeStorageOptions<
  any,
  any,
  any,
  infer DBO,
  any,
  any,
  any,
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
  ? DBO
  : never;

export type ConnectorBasic<
  CBSO extends IConnectionBridgeStorageOptions<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
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
> = CBSO extends IConnectionBridgeStorageOptions<
  any,
  any,
  any,
  any,
  infer ConnectorBasic,
  any,
  any,
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
  ? ConnectorBasic
  : never;

export type CO<
  CBSO extends IConnectionBridgeStorageOptions<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
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
> = CBSO extends IConnectionBridgeStorageOptions<
  any,
  any,
  any,
  any,
  any,
  infer CO,
  any,
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
  ? CO
  : never;

export type PO<
  CBSO extends IConnectionBridgeStorageOptions<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
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
> = CBSO extends IConnectionBridgeStorageOptions<
  any,
  any,
  any,
  any,
  any,
  any,
  infer PO,
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
  ? PO
  : never;

export type ConnectorMain<
  CBSO extends IConnectionBridgeStorageOptions<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
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
> = CBSO extends IConnectionBridgeStorageOptions<
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  infer ConnectorMain,
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
  ? ConnectorMain
  : never;

export type MSI<
  CBSO extends IConnectionBridgeStorageOptions<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
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
> = CBSO extends IConnectionBridgeStorageOptions<
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  infer MSI,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
>
  ? MSI
  : never;

export type GAC<
  CBSO extends IConnectionBridgeStorageOptions<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
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
> = CBSO extends IConnectionBridgeStorageOptions<
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  infer GAC,
  any,
  any,
  any,
  any,
  any,
  any,
  any
>
  ? GAC
  : never;

export type MCF<
  CBSO extends IConnectionBridgeStorageOptions<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
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
> = CBSO extends IConnectionBridgeStorageOptions<
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  infer MCF,
  any,
  any,
  any,
  any,
  any,
  any
>
  ? MCF
  : never;

export type ACO<
  CBSO extends IConnectionBridgeStorageOptions<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
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
> = CBSO extends IConnectionBridgeStorageOptions<
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  infer ACO,
  any,
  any,
  any,
  any,
  any
>
  ? ACO
  : never;

export type CFO<
  CBSO extends IConnectionBridgeStorageOptions<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
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
> = CBSO extends IConnectionBridgeStorageOptions<
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  infer CFO,
  any,
  any,
  any,
  any
>
  ? CFO
  : never;

export type CBFO<
  CBSO extends IConnectionBridgeStorageOptions<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
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
> = CBSO extends IConnectionBridgeStorageOptions<
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  infer CBFO,
  any,
  any,
  any
>
  ? CBFO
  : never;

export type O<
  CBSO extends IConnectionBridgeStorageOptions<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
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
> = CBSO extends IConnectionBridgeStorageOptions<
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  infer O,
  any,
  any
>
  ? O
  : never;

export type SMS<
  CBSO extends IConnectionBridgeStorageOptions<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
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
> = CBSO extends IConnectionBridgeStorageOptions<
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  infer SMS,
  any
>
  ? SMS
  : never;

export type SSDPLF<
  CBSO extends IConnectionBridgeStorageOptions<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
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
> = CBSO extends IConnectionBridgeStorageOptions<
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  infer SSDPLF
>
  ? SSDPLF
  : never;

export interface IConnectionBridgeOptionsByStorageOptions<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  CD extends boolean,
  SRLZR extends ISerializer,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  SO extends IConnectionBridgeStorageOptions<P, T, DbType, DBO, any, any, any, any, any, any, any, any, any, any, any, any, any>
> extends IConnectionBridgeOptions<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic<SO>,
    TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic<SO>>,
    PO<SO>,
    ConnectorMain<SO>,
    MSI<SO>,
    GAC<SO>,
    MCF<SO>,
    ACO<SO>,
    CFO<SO>,
    TSwarmStoreConnectorBasicFabric<P, T, DbType, DBO, ConnectorBasic<SO>>,
    CD,
    O<SO>,
    SMS<SO>,
    SSDPLF<SO>,
    SRLZR
  > {
  swarmStoreConnectorType: P;
  user: IConnectionBridgeOptionsUser;
  auth: IConnectionBridgeOptionsAuth<CD>;
  /**
   * this is options for a swarm databases user will be
   * used to store a data.
   *
   * @type {ISwarmMessageStoreOptions<P>}
   * @memberof IConnectionBridgeOptions
   */
  storage: SO;
  /**
   * specify options for the swarm connection native provider
   *
   * @memberof IConnectionBridgeOptions
   */
  nativeConnection: TNativeConnectionOptions<P>;
  /**
   * This serializer will be used for parsing/serialization of an various objects
   * to a string.
   *
   * @type {ISerializer}
   * @memberof IConnectionBridgeStorageOptions
   */
  serializer: SRLZR;

  /**
   * This is utility for validation of values
   * by the json schema.
   *
   * @memberof IConnectionBridgeOptions
   */
  jsonSchemaValidator: (jsonSchema: JSONSchema7, valueToValidate: any) => Promise<void>;
}
