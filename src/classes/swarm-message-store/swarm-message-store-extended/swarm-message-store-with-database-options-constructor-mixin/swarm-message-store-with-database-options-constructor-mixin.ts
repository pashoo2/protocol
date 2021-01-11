import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import {
  ISwarmStoreOptionsConnectorFabric,
  ISwarmStoreProviderOptions,
  TSwarmStoreConnectorConnectionOptions,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseType,
  ISwarmStoreConnector,
  ISwarmStoreConnectorBasic,
} from '../../../swarm-store-class/swarm-store-class.types';
import { TSwarmStoreDatabaseOptionsSerialized } from '../../../swarm-store-class/swarm-store-class.types';
import { ConstructorType } from 'types/helper.types';
import { TSwarmMessageSerialized, ISwarmMessageConstructor } from '../../../swarm-message/swarm-message-constructor.types';
import {
  TSwarmMessagesStoreGrantAccessCallback,
  ISwarmMessageStoreAccessControlOptions,
  ISwarmMessageStoreOptionsWithConnectorFabric,
} from '../../types/swarm-message-store.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../../swarm-message-encrypted-cache/swarm-messgae-encrypted-cache.types';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { ISwarmMessageStore } from '../../types/swarm-message-store.types';
import { ISwarmMessageStoreDatabaseOptionsWithMetaClass } from '../../swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-store-connector-db-options.types';
import { ISwarmMessageInstanceDecrypted } from '../../../swarm-message/swarm-message-constructor.types';

abstract class SwarmMessageStoreWithCreateDatabaseOptionsExtender<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>,
  CO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
  PO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, CO>,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, CO>,
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
  >
> {
  protected abstract _createDatabaseOptionsExtender(
    swarmMessageStoreOptions: O
  ): (dbOptions: DBO, swarmMessageConstructor: ISwarmMessageConstructor) => DBO;
}

export function getSwarmMessageStoreWithDatabaseOptionsConstructorExtended<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>,
  CO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
  PO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, CO>,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, CO>,
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
  BC extends ConstructorType<
    ISwarmMessageStore<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, MD, GAC, MCF, ACO, O> &
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
  >,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  SSDOC extends ISwarmMessageStoreDatabaseOptionsWithMetaClass<
    P,
    T,
    DbType,
    MD,
    CTX,
    DBO,
    DBOS,
    { swarmMessageStoreOptions: O; swarmMessageConstructor: ISwarmMessageConstructor }
  >
>(BaseClass: BC, SwarmStoreConnectorDatabaseOptionsConstructor: SSDOC): BC {
  return class SwarmStoreWithDatabaseOptionsConstructor extends BaseClass {
    protected _createDatabaseOptionsExtender(
      swarmMessageStoreOptions: O
    ): (dbOptions: DBO, swarmMessageConstructor: ISwarmMessageConstructor) => DBO {
      return (dbOptions: DBO, swarmMessageConstructor: ISwarmMessageConstructor): DBO => {
        const dbOptionsConstructed = new SwarmStoreConnectorDatabaseOptionsConstructor({
          options: dbOptions,
          meta: { swarmMessageStoreOptions, swarmMessageConstructor },
        });
        return dbOptionsConstructed.options;
      };
    }
  };
}
