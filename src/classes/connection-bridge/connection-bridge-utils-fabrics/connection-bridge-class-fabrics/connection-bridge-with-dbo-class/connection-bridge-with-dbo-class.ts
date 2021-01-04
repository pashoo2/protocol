import assert from 'assert';
import { ESwarmStoreConnector } from '../../../../swarm-store-class/swarm-store-class.const';
import {
  TSwarmMessageSerialized,
  TSwarmMessageInstance,
  ISwarmMessageConstructor,
} from '../../../../swarm-message/swarm-message-constructor.types';
import {
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreConnectorConnectionOptions,
  ISwarmStoreProviderOptions,
  ISwarmStoreOptionsConnectorFabric,
  TSwarmStoreConnectorBasicFabric,
} from '../../../../swarm-store-class/swarm-store-class.types';
import {
  TSwarmMessagesStoreGrantAccessCallback,
  ISwarmMessageStoreAccessControlOptions,
  ISwarmMessageStoreOptionsWithConnectorFabric,
} from '../../../../swarm-message-store/types/swarm-message-store.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../../../swarm-message-encrypted-cache/swarm-messgae-encrypted-cache.types';
import { ConstructorType } from '../../../../../types/helper.types';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import {
  TSwarmStoreDatabaseOptionsSerialized,
  ISwarmStoreDatabaseBaseOptions,
} from '../../../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabric } from '../../../../swarm-message-store/types/swarm-message-store-db-options.types';
import {
  ISwarmStoreWithConnector,
  TSwarmStoreOptionsOfDatabasesKnownList,
} from '../../../../swarm-store-class/swarm-store-class.types';
import {
  ISwarmMessageStoreWithEntriesCount,
  ISwarmMessageStoreEvents,
} from '../../../../swarm-message-store/types/swarm-message-store.types';
import { TConnectionBridgeCFODefault, TNativeConnectionType } from '../../../types/connection-bridge.types';
import { ConnectionBridge } from '../../../connection-bridge';
import { IConnectionBridgeWithDatabaseOptionsClassAndDBListPeristentStorageAndSwarmMessageCountOptions } from './connection-bridge-with-dbo-class-fabric.types';
import {
  ISwarmStoreConnectorBasicWithEntriesCount,
  ISwarmStoreConnectorWithEntriesCount,
} from '../../../../swarm-store-class/swarm-store-class-extended/swarm-store-class-with-entries-count/swarm-store-class-with-entries-count.types';
import { ISwarmStoreDatabasesPersistentListFabric } from '../../../types/connection-bridge.types';
import { ISwarmMessageStoreConnectorDbOptionsClassFabric } from '../../../types/connection-bridge-swarm-fabrics.types';
import { ISerializer } from '../../../../../types/serialization.types';
import { ISwarmMessageInstanceEncrypted } from '../../../../swarm-message/swarm-message-constructor.types';

export class ConnectionBridgeWithDBOClassEntriesCount<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  MSI extends TSwarmMessageInstance | T,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  DBOE extends DBO & ISwarmStoreDatabaseBaseOptions & { provider: P },
  DBOS extends TSwarmStoreDatabaseOptionsSerialized,
  SMC extends ISwarmMessageConstructor,
  ConnectorBasic extends ISwarmStoreConnectorBasicWithEntriesCount<P, T, DbType, DBOE>,
  CO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBOE, ConnectorBasic>,
  PO extends ISwarmStoreProviderOptions<P, T, DbType, DBOE, ConnectorBasic, CO>,
  ConnectorMain extends ISwarmStoreConnectorWithEntriesCount<P, T, DbType, DBOE, ConnectorBasic, CO>,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, Exclude<MSI, ISwarmMessageInstanceEncrypted>>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, Exclude<MSI, ISwarmMessageInstanceEncrypted>, GAC>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBOE, ConnectorBasic, CO, PO, ConnectorMain>,
  CFOD extends TConnectionBridgeCFODefault<P, T, DbType, DBOE, ConnectorBasic, CO, PO, ConnectorMain, CFO>,
  CBFO extends TSwarmStoreConnectorBasicFabric<P, T, DbType, DBOE, ConnectorBasic>,
  CD extends boolean,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<
    P,
    T,
    DbType,
    DBOE,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    CFOD,
    MSI,
    GAC,
    MCF,
    ACO
  >,
  CBO extends IConnectionBridgeWithDatabaseOptionsClassAndDBListPeristentStorageAndSwarmMessageCountOptions<
    P,
    T,
    DbType,
    MSI,
    CTX,
    DBO,
    DBOE,
    DBOS,
    SMC,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    GAC,
    MCF,
    ACO,
    CFO,
    CFOD,
    CBFO,
    CD,
    O,
    SMS,
    SSDPLF,
    CTXC,
    SMSDBOGACF,
    DBOCF,
    SRLZR,
    DBOCFF
  >,
  SMS extends ISwarmMessageStoreWithEntriesCount<
    P,
    T,
    DbType,
    DBOE,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    CFOD,
    MSI,
    GAC,
    MCF,
    ACO,
    O
  > &
    ISwarmStoreWithConnector<P, T, DbType, DBOE, ConnectorBasic, CO, ConnectorMain>,
  SSDPLF extends ISwarmStoreDatabasesPersistentListFabric<P, T, DbType, DBOE, Record<DBOE['dbName'], DBOE>>,
  CTXC extends ConstructorType<CTX>,
  SMSDBOGACF extends ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabric<SMC, CTXC>,
  DBOCF extends ISwarmMessageStoreConnectorDbOptionsClassFabric<
    P,
    T,
    DbType,
    Exclude<Exclude<MSI, ISwarmMessageInstanceEncrypted>, T>,
    CTX,
    DBOE,
    DBOS,
    SMC,
    CTXC,
    SMSDBOGACF
  >,
  DBOCFF extends (serializer: SRLZR) => DBOCF,
  E extends ISwarmMessageStoreEvents<P, T, DbType, DBOE> = ISwarmMessageStoreEvents<P, T, DbType, DBOE>,
  DBL extends TSwarmStoreOptionsOfDatabasesKnownList<P, T, DbType, DBOE> = TSwarmStoreOptionsOfDatabasesKnownList<
    P,
    T,
    DbType,
    DBOE
  >,
  NC extends TNativeConnectionType<P> = TNativeConnectionType<P>,
  SRLZR extends ISerializer = ISerializer
> extends ConnectionBridge<
  P,
  T,
  DbType,
  DBOE,
  ConnectorBasic,
  CO,
  PO,
  ConnectorMain,
  CFO,
  CBFO,
  MSI,
  GAC,
  MCF,
  ACO,
  O,
  CD,
  CBO,
  SMS,
  E,
  DBL,
  NC,
  SSDPLF
> {
  protected __getSwarmMessageStoreDatabaseGrandAccessBaseContextClassFabricFromOptions(): CBO['storage']['swarmMessageStoreDatabaseGrandAccessBaseContextClassFabric'] {
    const { swarmMessageStoreDatabaseGrandAccessBaseContextClassFabric } = this._getStorageOptions();
    assert(
      swarmMessageStoreDatabaseGrandAccessBaseContextClassFabric,
      'swarmMessageStoreDatabaseGrandAccessBaseContextClassFabric should be defined in the "storage" options'
    );
    return swarmMessageStoreDatabaseGrandAccessBaseContextClassFabric;
  }

  protected __getOptionsForSwarmMessageStoreDatabaseOptionsClassFarbricOfFabric(): {
    serializer: SRLZR;
  } {
    const activeSerializerInstance = this._getSerializer() as SRLZR;

    return {
      serializer: activeSerializerInstance,
    };
  }

  protected __createSarmMessageStoreDatabaseOptionsClassFabric<SMSDBOCFF extends (serializer: SRLZR) => DBOCF>(
    swarmMessageStoreDatabaseOptionsClassFabricOfFabric: SMSDBOCFF,
    options: {
      serializer: SRLZR;
    }
  ): DBOCF {
    return swarmMessageStoreDatabaseOptionsClassFabricOfFabric(options.serializer);
  }

  protected __crateAndGetSwarmMessageStoreDatabaseOptionsClassFabric(): ReturnType<
    CBO['storage']['swarmMessageStoreDatabaseOptionsClassFabricOfFabric']
  > {
    const { swarmMessageStoreDatabaseOptionsClassFabricOfFabric } = this._getStorageOptions();
    assert(
      swarmMessageStoreDatabaseOptionsClassFabricOfFabric,
      'swarmMessageStoreDatabaseOptionsClassFabric should be defined in the "storage" options'
    );
    const optionsForDBOClassFabricOfFabric = this.__getOptionsForSwarmMessageStoreDatabaseOptionsClassFarbricOfFabric();

    return this.__createSarmMessageStoreDatabaseOptionsClassFabric(
      swarmMessageStoreDatabaseOptionsClassFabricOfFabric,
      optionsForDBOClassFabricOfFabric
    ) as ReturnType<CBO['storage']['swarmMessageStoreDatabaseOptionsClassFabricOfFabric']>;
  }

  protected __getSwarmMessageStoreDBOGrandAccessCallbackFabricFromOptions(): CBO['storage']['swarmMessageStoreDBOGrandAccessCallbackFabric'] {
    const { swarmMessageStoreDBOGrandAccessCallbackFabric } = this._getStorageOptions();
    assert(
      swarmMessageStoreDBOGrandAccessCallbackFabric,
      'swarmMessageStoreDBOGrandAccessCallbackFabric should be defined in the "storage" options'
    );
    return swarmMessageStoreDBOGrandAccessCallbackFabric;
  }

  protected __getSwarmMessageStoreInstanceWithDBOClassFabricFromOptions(): CBO['storage']['swarmMessageStoreInstanceWithDBOClassFabric'] {
    const { swarmMessageStoreInstanceWithDBOClassFabric } = this._getStorageOptions();
    assert(
      swarmMessageStoreInstanceWithDBOClassFabric,
      'swarmMessageStoreInstanceWithDBOClassFabric should be defined in the "storage" options'
    );
    return swarmMessageStoreInstanceWithDBOClassFabric;
  }

  protected __createSwarmStoreGrandAccessCallbackBaseClassByCurrentOptions(): CTXC {
    const swarmMessageStoreDatabaseGrandAccessBaseContextClassFabric = this.__getSwarmMessageStoreDatabaseGrandAccessBaseContextClassFabricFromOptions();
    const centralAuthorityConnection = this._getCentralAuthorityConnection();
    return swarmMessageStoreDatabaseGrandAccessBaseContextClassFabric({
      centralAuthority: centralAuthorityConnection,
    });
  }

  protected _createAndGetSwarmMessageStoreInstanceWithDBOClassFabricOptions(): {
    ContextBaseClass: CTXC;
    swarmMessageStoreDBOGrandAccessCallbackFabric: SMSDBOGACF;
    databaseOptionsClassFabric: DBOCF;
  } {
    const swarmMessageStoreDBOGrandAccessCallbackFabric = this.__getSwarmMessageStoreDBOGrandAccessCallbackFabricFromOptions();
    const ContextBaseClass = this.__createSwarmStoreGrandAccessCallbackBaseClassByCurrentOptions();
    const databaseOptionsClassFabric = this.__crateAndGetSwarmMessageStoreDatabaseOptionsClassFabric();
    return {
      ContextBaseClass,
      swarmMessageStoreDBOGrandAccessCallbackFabric,
      databaseOptionsClassFabric,
    };
  }

  protected createSwarmMessageStoreInstance(): SMS {
    const {
      ContextBaseClass,
      swarmMessageStoreDBOGrandAccessCallbackFabric,
      databaseOptionsClassFabric,
    } = this._createAndGetSwarmMessageStoreInstanceWithDBOClassFabricOptions();
    const swarmMessageStoreInstanceWithDBOClassFabric = this.__getSwarmMessageStoreInstanceWithDBOClassFabricFromOptions();

    return swarmMessageStoreInstanceWithDBOClassFabric(
      ContextBaseClass,
      swarmMessageStoreDBOGrandAccessCallbackFabric,
      databaseOptionsClassFabric
    );
  }
}
