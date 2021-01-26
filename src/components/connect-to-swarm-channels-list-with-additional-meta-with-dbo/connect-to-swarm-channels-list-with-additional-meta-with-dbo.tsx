import React from 'react';
import {
  TSwarmMessageInstance,
  TSwarmMessageSerialized,
  ISwarmMessageInstanceEncrypted,
} from '../../classes/swarm-message/swarm-message-constructor.types';
import { ISwarmMessageInstanceDecrypted } from '../../classes/swarm-message/swarm-message-constructor.types';
import {
  TSwarmStoreDatabaseOptions,
  TSwarmStoreConnectorBasicFabric,
  TSwarmStoreConnectorConnectionOptions,
  ISwarmStoreProviderOptions,
} from '../../classes/swarm-store-class/swarm-store-class.types';
import {
  IConnectionBridgeOptionsDefault,
  ISwarmStoreDatabasesPersistentListFabric,
} from '../../classes/connection-bridge/types/connection-bridge.types';
import {
  ISwarmMessagesDatabaseCacheOptions,
  ISwarmMessagesDatabaseCache,
  ISwarmMessagesDatabaseCacheConstructor,
} from '../../classes/swarm-messages-database/swarm-messages-database.types';
import {
  ISwarmMessagesDatabaseMessagesCollectorWithStoreMeta,
  ISwarmMessagesStoreMeta,
} from '../../classes/swarm-messages-database/swarm-messages-database.messages-collector.types';
import { ISwarmMessageStore } from '../../classes/swarm-message-store/types/swarm-message-store.types';
import { P } from '../connect-to-swarm-with-dbo/connect-to-swarm-with-dbo';
import {
  ISwarmStoreConnectorBasicWithEntriesCount,
  ISwarmStoreConnectorWithEntriesCount,
} from '../../classes/swarm-store-class/swarm-store-class-extended/swarm-store-class-with-entries-count/swarm-store-class-with-entries-count.types';
import { getDatabaseConnectionByDatabaseOptionsFabric } from '../../classes/swarm-messages-channels/swarm-messages-channels-classes/swarm-messages-channels-list-classes/swarm-messages-channels-list-v1-class/swarm-messages-channels-list-v1-class/utils/swarm-messages-channels-list-v1-constructor-arguments-fabrics/swarm-messages-channels-list-v1-database-connection-fabric';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../classes/swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { ConnectToSwarmWithAdditionalMetaWithDBO } from '../connect-to-swarm-with-additional-meta-with-dbo';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { getSwarmMessagesChannelsListVersionOneInstanceWithDefaultParameters } from '../../classes/swarm-messages-channels/swarm-messages-channels-classes/swarm-messages-channels-list-classes/swarm-messages-channels-list-v1-class/swarm-messages-channels-list-v1-class/utils/swarm-messages-channels-list-v1-instance-fabrics/swarm-messages-channels-list-v1-instance-fabric-default';
import { ESwarmStoreConnector } from '../../classes/swarm-store-class/swarm-store-class.const';
import { TSwarmStoreDatabaseType } from '../../classes/swarm-store-class/swarm-store-class.types';
import { ISwarmMessageChannelDescriptionRaw } from '../../classes/swarm-messages-channels/types/swarm-messages-channel.types';
import { SWARM_MESSAGES_CHANNEL_ENCRYPION } from '../../classes/swarm-messages-channels/const/swarm-messages-channels-main.const';
import {
  ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric,
  ISwarmMessagesChannelsListDescription,
} from '../../classes/swarm-messages-channels/types/swarm-messages-channels-list.types';
import {
  TSwrmMessagesChannelsListDBOWithGrantAccess,
  ISwarmMessagesChannelsDescriptionsListConstructorArguments,
} from '../../classes/swarm-messages-channels/types/swarm-messages-channels-list.types';

type EXTPROPS = {
  description: ISwarmMessagesChannelsListDescription;
};
/**
 *
 *
 * @export
 * @class ConnectToSwarmAndCreateSwarmMessagesChannelsListWithAdditionalMetaWithDBO
 * @extends {ConnectToSwarmWithAdditionalMetaWithDBO<DbType, T, DBO, CD, ConnectorBasic, ConnectorMain, SMS, SSDPLF, CBO, MI, MD, SMSM, DCO, DCCRT, SMDCC>}
 * @template T
 * @template DbType
 * @template DBO
 * @template CD
 * @template ConnectorBasic
 * @template ConnectorMain
 * @template SMS
 * @template SSDPLF
 * @template CBO
 * @template MI
 * @template MD
 * @template SMSM
 * @template DCO
 * @template DCCRT
 * @template SMDCC
 */
export class ConnectToSwarmAndCreateSwarmMessagesChannelsListWithAdditionalMetaWithDBO<
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P> & ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  CD extends boolean,
  ConnectorBasic extends ISwarmStoreConnectorBasicWithEntriesCount<P, T, DbType, DBO>,
  ConnectorMain extends ISwarmStoreConnectorWithEntriesCount<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>
  >,
  SMS extends ISwarmMessageStore<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
    ISwarmStoreProviderOptions<
      P,
      T,
      DbType,
      DBO,
      ConnectorBasic,
      TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>
    >,
    ISwarmStoreConnectorWithEntriesCount<
      P,
      T,
      DbType,
      DBO,
      ConnectorBasic,
      TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>
    > &
      ConnectorMain,
    any,
    MI | T,
    any,
    any,
    any,
    any
  > &
    ConnectorMain,
  SSDPLF extends ISwarmStoreDatabasesPersistentListFabric<P, T, DbType, DBO, Record<DBO['dbName'], DBO>>,
  CBO extends IConnectionBridgeOptionsDefault<
    P,
    T,
    DbType,
    CD,
    TSwarmStoreDatabaseOptions<P, T, DbType>,
    MI | T,
    any,
    any,
    any,
    ConnectorBasic,
    TSwarmStoreConnectorBasicFabric<P, T, DbType, DBO, ConnectorBasic>,
    TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
    ISwarmStoreProviderOptions<
      P,
      T,
      DbType,
      DBO,
      ConnectorBasic,
      TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>
    >,
    ConnectorMain,
    any,
    any,
    SMS,
    SSDPLF
  >,
  MI extends TSwarmMessageInstance = TSwarmMessageInstance,
  MD extends ISwarmMessageInstanceDecrypted = Exclude<MI, ISwarmMessageInstanceEncrypted>,
  SMSM extends ISwarmMessagesDatabaseMessagesCollectorWithStoreMeta<
    P,
    T,
    DBO,
    DbType,
    MD,
    ISwarmMessagesStoreMeta
  > = ISwarmMessagesDatabaseMessagesCollectorWithStoreMeta<P, T, DBO, DbType, MD, ISwarmMessagesStoreMeta>,
  DCO extends ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMSM> = ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMSM>,
  DCCRT extends ISwarmMessagesDatabaseCache<P, T, DbType, DBO, MD, SMSM> = ISwarmMessagesDatabaseCache<
    P,
    T,
    DbType,
    DBO,
    MD,
    SMSM
  >,
  SMDCC extends ISwarmMessagesDatabaseCacheConstructor<
    P,
    T,
    DbType,
    DBO,
    MD,
    SMSM,
    DCO,
    DCCRT
  > = ISwarmMessagesDatabaseCacheConstructor<P, T, DbType, DBO, MD, SMSM, DCO, DCCRT>
  // TODO - use CBO instead of any
> extends ConnectToSwarmWithAdditionalMetaWithDBO<
  DbType,
  T,
  DBO,
  CD,
  ConnectorBasic,
  ConnectorMain,
  SMS,
  SSDPLF,
  CBO,
  MI,
  MD,
  SMSM,
  DCO,
  DCCRT,
  SMDCC
> {
  public async componentDidMount() {
    await this._connectToSwarmAndCreateSwarmMessagesChannelsList();
  }

  public render() {
    return <div>Swarm messages channels list</div>;
  }

  protected _getOptionsForConstructorArgumentsFabric<
    CF extends ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric<
      P,
      T,
      MD,
      ISwarmStoreDBOGrandAccessCallbackBaseContext,
      DBCL
    >,
    DBCL extends TSwrmMessagesChannelsListDBOWithGrantAccess<
      P,
      T,
      MD,
      ISwarmStoreDBOGrandAccessCallbackBaseContext,
      DBO
    > = TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, ISwarmStoreDBOGrandAccessCallbackBaseContext, DBO>
  >(): Pick<
    ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, MD, ISwarmStoreDBOGrandAccessCallbackBaseContext, DBCL, CF>,
    'description'
  > &
    Pick<
      ISwarmMessagesChannelsDescriptionsListConstructorArguments<
        P,
        T,
        MD,
        ISwarmStoreDBOGrandAccessCallbackBaseContext,
        DBCL,
        CF
      >,
      'description' | 'connectionOptions'
    > {
    const description = {
      version: '1',
      id: 'eff9f522-3a63-46f7-8d5f-ad76765c3779',
      name: 'channelsList',
    };
    const { dbo, connectionBridgeOptions } = this.props;
    const { serializer, jsonSchemaValidator } = connectionBridgeOptions;
    // TODO --
    debugger;
    return {
      description,
      connectionOptions: {
        connectorType: ESwarmStoreConnector.OrbitDB,
        dbOptions: (dbo as unknown) as DBCL, // TODO - avoid type cast as unknown
      },
      utilities: {
        serializer,
      },
      validators: {
        jsonSchemaValidator,
      },
    };
  }

  protected _getDatabaseConnectorFabricForChannnelsList() {
    // TODO - make fabrics of options for creating database connectors options, options for connection bridge
    const optionsForDatabaseConnectionFabric = this._getOptionsForSwarmMessagesDatabaseConnectedWithoutDatabaseOptionsFabric();
    const dbConnectorByDbOptionsFabric = getDatabaseConnectionByDatabaseOptionsFabric<
      P,
      T,
      MD,
      ISwarmStoreDBOGrandAccessCallbackBaseContext,
      TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, ISwarmStoreDBOGrandAccessCallbackBaseContext, DBO>
    >(optionsForDatabaseConnectionFabric);
    return dbConnectorByDbOptionsFabric;
  }

  protected _createSwarmMessagesChannelsList() {
    const connectorFabric = this._getDatabaseConnectorFabricForChannnelsList();
    const optionsForConstructorArgumentsFabric = this._getOptionsForConstructorArgumentsFabric<typeof connectorFabric>();
    const swarmMessageChannelsList = getSwarmMessagesChannelsListVersionOneInstanceWithDefaultParameters<
      P,
      T,
      MD,
      ISwarmStoreDBOGrandAccessCallbackBaseContext,
      TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, ISwarmStoreDBOGrandAccessCallbackBaseContext, DBO>,
      typeof connectorFabric,
      typeof optionsForConstructorArgumentsFabric
    >(connectorFabric, optionsForConstructorArgumentsFabric);
    return swarmMessageChannelsList;
  }

  protected async _connectToSwarmAndCreateSwarmMessagesChannelsList() {
    const { userCredentialsToConnectImmediate } = this.props;
    if (userCredentialsToConnectImmediate) {
      await this.connectToSwarm(userCredentialsToConnectImmediate);
      const channelsListInstance = this._createSwarmMessagesChannelsList();
      const { connectionBridge } = this.state;
      if (!connectionBridge) {
        throw new Error('A connection bridge instance is not initialized');
      }
      const currentUserId = connectionBridge.centralAuthorityConnection?.getUserIdentity();
      if (!currentUserId) {
        throw new Error('An identity of the current user should be provided');
      }
      if (currentUserId instanceof Error) {
        throw currentUserId;
      }
      const swarmMessageChannelDescription: ISwarmMessageChannelDescriptionRaw<
        P,
        TSwarmMessageSerialized,
        ESwarmStoreConnectorOrbitDbDatabaseType.FEED,
        TSwarmStoreDatabaseOptions<P, TSwarmMessageSerialized, ESwarmStoreConnectorOrbitDbDatabaseType.FEED>
      > = {
        id: '40accad4-7941-41aa-95db-7954e80a73b8',
        dbType: ESwarmStoreConnectorOrbitDbDatabaseType.FEED,
        version: '1',
        tags: ['test', 'swarm_channel'],
        name: 'test swarm channel',
        admins: [currentUserId],
        description: 'This is a swarm channel for test purposes',
        messageEncryption: SWARM_MESSAGES_CHANNEL_ENCRYPION.PUBLIC,
        dbOptions: {
          write: [currentUserId],
          grantAccess: async () => {
            debugger;
            return true;
          },
        },
      };
      debugger;
      await channelsListInstance.addChannel(swarmMessageChannelDescription);
    }
  }
}
