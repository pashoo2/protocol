import React from 'react';

import { getSwarmMessagesChannelV1InstanveWithDefaults } from '../../classes/swarm-messages-channels';
import { TSwarmMessageSerialized } from '../../classes/swarm-message/swarm-message-constructor.types';
import { ISwarmMessageInstanceDecrypted } from '../../classes/swarm-message/swarm-message-constructor.types';
import { TSwarmStoreDatabaseOptions, TSwarmStoreDatabaseType } from '../../classes/swarm-store-class/swarm-store-class.types';
import { IConnectionBridgeOptionsDefault } from '../../classes/connection-bridge/types/connection-bridge.types';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { ISwarmMessageChannelDescriptionRaw } from '../../classes/swarm-messages-channels/types/swarm-messages-channel-instance.types';
import { ISwarmMessagesChannelsDescriptionsList } from '../../classes/swarm-messages-channels/types/swarm-messages-channels-list-instance.types';
import { ConnectToSwarmAndCreateSwarmMessagesChannelsListWithAdditionalMetaWithDBO } from '../connect-to-swarm-channels-list-with-additional-meta-with-dbo';
import { P } from '../connect-to-swarm-with-dbo/connect-to-swarm-with-dbo';
import { TDatabaseOptionsTypeByChannelDescriptionRaw } from '../../classes/swarm-messages-channels/types/swarm-messages-channel-instance.helpers.types';
import { ESwarmMessagesChannelEventName } from '../../classes/swarm-messages-channels/types/swarm-messages-channel-events.types';

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
export class ConnectToSwarmAndCreateSwarmMessagesChannelsListWithChannelInstanceSupport<
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
> extends ConnectToSwarmAndCreateSwarmMessagesChannelsListWithAdditionalMetaWithDBO<DbType, DBO, CBO, CD, MD, T> {
  public render() {
    const renderResult = super.render();
    const { isChannelReady, swarmMessagesChannelInstance } = this.state as any;
    return (
      <div>
        {renderResult}
        <br />
        {Boolean(swarmMessagesChannelInstance) ? 'Swarm messages channel is exists' : 'Channel is not exists'}
        <br />
        {isChannelReady ? 'channel database is ready' : 'channel database is not ready'}
      </div>
    );
  }

  protected async _onChannelAdded(
    channelsListInstance: ISwarmMessagesChannelsDescriptionsList<P, T, MD>,
    swarmMessageChannelDescription: ISwarmMessageChannelDescriptionRaw<
      P,
      T,
      TSwarmStoreDatabaseType<P>,
      TSwarmStoreDatabaseOptions<P, TSwarmMessageSerialized, TSwarmStoreDatabaseType<P>>
    >
  ): Promise<void> {
    try {
      const connectionBridge = this.state.connectionBridge;

      if (!connectionBridge) {
        throw new Error('Connection bridge instance is not ready to be used');
      }

      const swarmMessageStore = connectionBridge.swarmMessageStore;
      const optionsForChannelFabric = this._getOptionsForSwarmMessagesChannelV1FabricByChannelsListInstanceAndChannelDescription(
        channelsListInstance,
        swarmMessageChannelDescription
      );
      const swarmMessagesChannelInstance = await getSwarmMessagesChannelV1InstanveWithDefaults<
        P,
        T,
        typeof swarmMessageChannelDescription['dbType'],
        TDatabaseOptionsTypeByChannelDescriptionRaw<typeof swarmMessageChannelDescription>,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        any,
        typeof swarmMessageStore,
        MD,
        any,
        any,
        any,
        any,
        typeof swarmMessageChannelDescription
      >((optionsForChannelFabric as unknown) as any);

      const isChannelReady = swarmMessagesChannelInstance.isReady;

      if (!isChannelReady) {
        swarmMessagesChannelInstance.emitterChannelState.once(ESwarmMessagesChannelEventName.CHANNEL_OPEN, () => {
          this.setState({
            isChannelReady: true,
          });
        });
      }

      this.setState({
        swarmMessagesChannelInstance,
        isChannelReady,
      });
    } catch (err) {
      console.error(err);
      alert(`The error has occurred: ${err.message}`);
    }
  }
}
