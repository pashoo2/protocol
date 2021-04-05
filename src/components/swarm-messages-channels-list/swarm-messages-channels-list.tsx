import React from 'react';
import { ESwarmStoreConnector } from 'classes/swarm-store-class/swarm-store-class.const';
import { TSwarmMessageSerialized, ISwarmMessageInstanceDecrypted } from 'classes/swarm-message/swarm-message-constructor.types';
import { ISwarmMessageChannelDescriptionRaw } from 'classes/swarm-messages-channels/types/swarm-messages-channel-instance.types';
import { swarmMessagesChannelV1GenerateNewSwarmChannelDescription } from '../../classes/swarm-messages-channels/swarm-messages-channels-classes/swarm-messages-channel-classes/swarm-messages-channel-v1-class/utils/swarm-messages-channel-v1-generate-new-channel-description/swarm-messages-channel-v1-generate-new-channel-description';
import { TCentralAuthorityUserIdentity } from '../../classes/central-authority-class/central-authority-class-types/central-authority-class-types-common';
import {
  SwarmMessagesChannelsListComponentBase,
  ISwarmMessagesChannelsListProps,
} from './swarm-messages-channels-list-base-component';
import { SwarmChannelDescriptionComponent } from '../swarm-channel-description-component/swarm-channel-description-component';

export interface ISwarmMessagesChannelsListComponentProps<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted
> extends Omit<ISwarmMessagesChannelsListProps<P, T, MD>, 'updateChannelDescription'> {
  currentUserId: TCentralAuthorityUserIdentity;
  onChoseSwarmChannel?(swarmChannelDescription: ISwarmMessageChannelDescriptionRaw<P, T, any, any>): unknown;
}

interface ISwarmMessagesChannelsListComponentState<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted
> {
  newChannelDescription: ISwarmMessageChannelDescriptionRaw<P, T, any, any> | undefined;
  ifNewChannelSaving: boolean;
  newChannelSavingError: Error | undefined;
}

export class SwarmMessagesChannelsListComponent<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted
> extends React.PureComponent<
  ISwarmMessagesChannelsListComponentProps<P, T, MD>,
  ISwarmMessagesChannelsListComponentState<P, T, MD>
> {
  public state: ISwarmMessagesChannelsListComponentState<P, T, MD> = {
    newChannelDescription: undefined,
    ifNewChannelSaving: false,
    newChannelSavingError: undefined,
  };

  public render(): React.ReactElement {
    const props = this.props;
    const { newChannelDescription } = this.state;

    if (newChannelDescription) {
      return this.__renderComponentsOnChannelReady();
    }
    return (
      <SwarmMessagesChannelsListComponentBase
        {...props}
        updateChannelDescription={this.__upsertChannelDescription}
        renderOnChannelsListReady={this.__renderAddNewChannelButton}
      />
    );
  }

  private __renderComponentsOnChannelReady(): React.ReactElement {
    return (
      <div>
        {this.__renderError()}
        {this.__renderNewChannelDescription()}
      </div>
    );
  }

  private __renderError(): React.ReactNode {
    const { newChannelSavingError } = this.state;
    return newChannelSavingError && <span>{newChannelSavingError.message}</span>;
  }

  private __renderNewChannelDescription(): React.ReactNode {
    const { newChannelDescription } = this.state;
    if (!newChannelDescription) {
      return null;
    }
    return (
      <SwarmChannelDescriptionComponent
        allFieldsEditable
        editChannelButtonLabel="Save into the list"
        channelDescription={newChannelDescription}
        updateChannelDescription={this.__saveChannelDescription}
      />
    );
  }

  private __renderAddNewChannelButton = (): React.ReactNode => {
    const { newChannelDescription } = this.state;
    if (newChannelDescription) {
      return null;
    }
    return <button onClick={this.__createNewChannelDescription}>Add new swarm channel</button>;
  };

  private __getNewSwarmChannelDescription(): ISwarmMessageChannelDescriptionRaw<P, T, any, any> {
    const { currentUserId } = this.props;
    const newSwarmMessagesChannelDescriptionRaw = swarmMessagesChannelV1GenerateNewSwarmChannelDescription({
      admins: [currentUserId],
      dbOptions: {
        write: [currentUserId],
      },
    });
    return newSwarmMessagesChannelDescriptionRaw;
  }

  private __createNewChannelDescription = (): void => {
    const newChannelDescription = this.__getNewSwarmChannelDescription();
    this.setState({
      newChannelDescription,
    });
  };

  private __upsertChannelDescription = async (
    channelDescription: ISwarmMessageChannelDescriptionRaw<P, T, any, any>
  ): Promise<void> => {
    const { channelsList } = this.props;
    await channelsList.upsertChannel(channelDescription);
  };

  private __saveChannelDescription = async (
    channelDescription: ISwarmMessageChannelDescriptionRaw<P, T, any, any>
  ): Promise<void> => {
    this.setState({ ifNewChannelSaving: true, newChannelSavingError: undefined });
    try {
      await this.__upsertChannelDescription(channelDescription);
      this.setState({ newChannelDescription: undefined });
    } catch (err) {
      console.error(err);
      this.setState({ newChannelSavingError: err });
    } finally {
      this.setState({ ifNewChannelSaving: false });
    }
  };
}
