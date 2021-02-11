import React from 'react';
import { TSwarmMessageSerialized } from '../../classes/swarm-message/swarm-message-constructor.types';
import { ISwarmMessageInstanceDecrypted } from '../../classes/swarm-message/swarm-message-constructor.types';
import { TSwarmStoreDatabaseOptions } from '../../classes/swarm-store-class/swarm-store-class.types';
import { IConnectionBridgeOptionsDefault } from '../../classes/connection-bridge/types/connection-bridge.types';
import { P } from '../connect-to-swarm-with-dbo/connect-to-swarm-with-dbo';
import { getDatabaseConnectionByDatabaseOptionsFabric } from '../../classes/swarm-messages-channels/swarm-messages-channels-classes/swarm-messages-channels-list-classes/swarm-messages-channels-list-v1-class/swarm-messages-channels-list-v1-class/utils/swarm-messages-channels-list-v1-constructor-arguments-fabrics/swarm-messages-channels-list-v1-database-connection-fabric';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../classes/swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { ConnectToSwarmWithAdditionalMetaWithDBO } from '../connect-to-swarm-with-additional-meta-with-dbo';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { getSwarmMessagesChannelsListVersionOneInstanceWithDefaultParameters } from '../../classes/swarm-messages-channels/swarm-messages-channels-classes/swarm-messages-channels-list-classes/swarm-messages-channels-list-v1-class/swarm-messages-channels-list-v1-class/utils/swarm-messages-channels-list-v1-instance-fabrics/swarm-messages-channels-list-v1-instance-fabric-default';
import { ESwarmStoreConnector } from '../../classes/swarm-store-class/swarm-store-class.const';
import { ISwarmMessageChannelDescriptionRaw } from '../../classes/swarm-messages-channels/types/swarm-messages-channel.types';
import { SWARM_MESSAGES_CHANNEL_ENCRYPION } from '../../classes/swarm-messages-channels/const/swarm-messages-channels-main.const';
import { TSwrmMessagesChannelsListDBOWithGrantAccess } from '../../classes/swarm-messages-channels/types/swarm-messages-channels-list.types';
import {
  ISwarmMessagesDatabaseCacheOptions,
  ISwarmMessagesDatabaseCache,
} from '../../classes/swarm-messages-database/swarm-messages-database.types';
import {
  ISwarmMessagesDatabaseMessagesCollectorWithStoreMeta,
  ISwarmMessagesStoreMeta,
} from '../../classes/swarm-messages-database/swarm-messages-database.messages-collector.types';
import {
  TConnectionBridgeOptionsSwarmMessageStoreInstance,
  TSwarmStoreDatabasesPersistentListFabric,
} from '../../classes/connection-bridge/types/connection-bridge.types-helpers/connection-bridge-options.types-helpers';
import {
  TConnectionBridgeOptionsConnectorBasic,
  TConnectionBridgeOptionsConnectorMain,
} from '../../classes/connection-bridge/types/connection-bridge.types-helpers/connection-bridge-options.types-helpers';

/**
 * Swarm messages channels list
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
  DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE | ESwarmStoreConnectorOrbitDbDatabaseType.FEED,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  CBO extends IConnectionBridgeOptionsDefault<
    P,
    T,
    DbType,
    CD,
    DBO,
    MD,
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
  >,
  CD extends boolean = boolean,
  MD extends ISwarmMessageInstanceDecrypted = ISwarmMessageInstanceDecrypted,
  T extends TSwarmMessageSerialized = TSwarmMessageSerialized
> extends ConnectToSwarmWithAdditionalMetaWithDBO<
  DbType,
  T,
  DBO,
  CD,
  TConnectionBridgeOptionsConnectorBasic<CBO>,
  TConnectionBridgeOptionsConnectorMain<CBO>,
  TConnectionBridgeOptionsSwarmMessageStoreInstance<CBO>,
  TSwarmStoreDatabasesPersistentListFabric<CBO>,
  CBO,
  MD,
  MD,
  ISwarmMessagesDatabaseMessagesCollectorWithStoreMeta<P, T, DBO, DbType, MD, ISwarmMessagesStoreMeta>,
  ISwarmMessagesDatabaseCacheOptions<
    P,
    DbType,
    MD,
    ISwarmMessagesDatabaseMessagesCollectorWithStoreMeta<P, T, DBO, DbType, MD, ISwarmMessagesStoreMeta>
  >,
  ISwarmMessagesDatabaseCache<
    P,
    T,
    DbType,
    DBO,
    MD,
    ISwarmMessagesDatabaseMessagesCollectorWithStoreMeta<P, T, DBO, DbType, MD, ISwarmMessagesStoreMeta>
  >
> {
  public async componentDidMount() {
    await this._connectToSwarmAndCreateSwarmMessagesChannelsList();
  }

  public render() {
    return <div>Swarm messages channels list</div>;
  }

  protected _getOptionsForConstructorArgumentsFabric(): Parameters<
    typeof getSwarmMessagesChannelsListVersionOneInstanceWithDefaultParameters
  >[1] {
    const description = {
      version: '1',
      id: 'eff9f522-3a63-46f7-8d5f-ad76765c3779',
      name: 'channelsList',
    };
    const { dbo, connectionBridgeOptions } = this.props;
    const { serializer, jsonSchemaValidator } = connectionBridgeOptions as CBO;
    return {
      description,
      connectionOptions: {
        connectorType: ESwarmStoreConnector.OrbitDB,
        dbOptions: dbo,
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
      TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, ISwarmStoreDBOGrandAccessCallbackBaseContext>
    >(optionsForDatabaseConnectionFabric);
    return dbConnectorByDbOptionsFabric;
  }

  protected _createSwarmMessagesChannelsList() {
    const connectorFabric = this._getDatabaseConnectorFabricForChannnelsList();
    const optionsForConstructorArgumentsFabric = this._getOptionsForConstructorArgumentsFabric();
    const swarmMessageChannelsList = getSwarmMessagesChannelsListVersionOneInstanceWithDefaultParameters<
      P,
      T,
      MD,
      ISwarmStoreDBOGrandAccessCallbackBaseContext,
      TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, ISwarmStoreDBOGrandAccessCallbackBaseContext>,
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
          grantAccess: async function grantAccess(): Promise<boolean> {
            debugger;
            return true;
          },
        },
      };
      try {
        let existingChannels = await channelsListInstance.getAllChannelsDescriptions();
        await channelsListInstance.upsertChannel(swarmMessageChannelDescription);
        debugger;
        const swarmMessagesChannelListDescription = await channelsListInstance.getChannelDescriptionById(
          swarmMessageChannelDescription.id
        );
        debugger;
        existingChannels = await channelsListInstance.getAllChannelsDescriptions();
        debugger;
        alert('done');
      } catch (err) {
        console.error(err);
        debugger;
      }
    }
  }
}
