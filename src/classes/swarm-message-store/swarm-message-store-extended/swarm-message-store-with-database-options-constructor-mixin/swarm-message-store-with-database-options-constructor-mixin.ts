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
import {
  TSwarmMessageInstance,
  TSwarmMessageSerialized,
  ISwarmMessageConstructor,
} from '../../../swarm-message/swarm-message-constructor.types';
import {
  TSwarmMessagesStoreGrantAccessCallback,
  ISwarmMessageStoreAccessControlOptions,
  ISwarmMessageStoreOptionsWithConnectorFabric,
} from '../../types/swarm-message-store.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../../swarm-message-encrypted-cache/swarm-messgae-encrypted-cache.types';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { ISwarmMessageStore } from '../../types/swarm-message-store.types';
import { ISwarmMessageStoreDatabaseOptionsWithMetaClass } from '../../swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-store-connector-db-options.types';
import {
  ISwarmMessageInstanceEncrypted,
  ISwarmMessageInstanceDecrypted,
} from '../../../swarm-message/swarm-message-constructor.types';

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
  BC extends ConstructorType<
    ISwarmMessageStore<P, ItemType, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, I, GAC, MCF, ACO, O>
  >,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  SSDOC extends ISwarmMessageStoreDatabaseOptionsWithMetaClass<
    P,
    ItemType,
    DbType,
    I,
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
