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
import { TSwarmMessageInstance, TSwarmMessageSerialized } from '../../../swarm-message/swarm-message-constructor.types';
import {
  TSwarmMessagesStoreGrantAccessCallback,
  ISwarmMessageStoreAccessControlOptions,
  ISwarmMessageStoreOptionsWithConnectorFabric,
} from '../../types/swarm-message-store.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../../swarm-message-encrypted-cache/swarm-messgae-encrypted-cache.types';
import { ISwarmDbOptionsGrandAccessCbCTX } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { ISwarmMessageStore } from '../../types/swarm-message-store.types';
import { ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorWithMetaConstructor } from '../../swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-store-connector-db-options.types';

export function getSwarmMessageStoreWithDatabaseOptionsConstructorExtended<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType, DBO>,
  CO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>,
  PO extends ISwarmStoreProviderOptions<P, ItemType, DbType, DBO, ConnectorBasic, CO>,
  ConnectorMain extends ISwarmStoreConnector<P, ItemType, DbType, DBO, ConnectorBasic, CO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, ItemType, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain>,
  MSI extends TSwarmMessageInstance | ItemType,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MSI>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, ItemType, MSI, GAC> | undefined,
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
    MSI,
    GAC,
    MCF,
    ACO
  >,
  BC extends ConstructorType<
    ISwarmMessageStore<P, ItemType, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, MSI, GAC, MCF, ACO, O>
  >,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized,
  CTX extends ISwarmDbOptionsGrandAccessCbCTX,
  SSDOC extends ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorWithMetaConstructor<
    P,
    ItemType,
    DbType,
    MSI,
    CTX,
    DBO,
    DBOS,
    { swarmMessageStoreOptions: O }
  >
>(BaseClass: BC, SwarmStoreConnectorDatabaseOptionsConstructor: SSDOC): BC {
  return class SwarmStoreWithDatabaseOptionsConstructor extends BaseClass {
    protected _createDatabaseOptionsExtender(swarmMessageStoreOptions: O): (dbOptions: DBO) => DBO {
      return (dbOptions: DBO): DBO => {
        const dbOptionsConstructed = new SwarmStoreConnectorDatabaseOptionsConstructor({
          options: dbOptions,
          meta: { swarmMessageStoreOptions },
        });
        return dbOptionsConstructed.options;
      };
    }
  };
}
