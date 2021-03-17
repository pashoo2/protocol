import React from 'react';
import { ISwarmMessageChannelDescriptionRaw } from '../../classes/swarm-messages-channels/types/swarm-messages-channel-instance.types';
import { TSwarmMessageSerialized } from '../../classes/swarm-message/swarm-message-constructor.types';
import { ESwarmStoreConnector } from '../../classes/swarm-store-class/swarm-store-class.const';
import { TSwarmStoreDatabaseType, TSwarmStoreDatabaseOptions } from '../../classes/swarm-store-class/swarm-store-class.types';

export interface ISwarmChannelDescriptionComponentProps<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>
> {
  channelDescription: ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>;
  updateChannelDescription(channelDescription: ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>): Promise<void>;
}

export interface ISwarmChannelDescriptionComponentState<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>
> {
  error: Error | undefined;
  isPending: boolean;
  channelDescription: ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>;
}

export class SwarmChannelDescriptionComponent<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>
> extends React.PureComponent<ISwarmChannelDescriptionComponentProps<P, T, DbType, DBO>> {
  public state = {
    error: undefined,
    isPending: false,
    channelDescription: this.props.channelDescription,
  };

  public render() {
    const { isPending } = this.state;

    if (isPending) {
      return <div>Channel is updating</div>;
    }
  }

  protected _renderError(): React.ReactElement {
    const { error } = this.state;

    return (
      error && (
        <div>
          <h4>Error:</h4>
          <p>{error.message}</p>
        </div>
      )
    );
  }

  protected _renderLabel(label: string): React.ReactElement {
    return <p>{label}</p>;
  }

  protected _renderInputField(
    name: string,
    value: string,
    onChange: (name: string, value: string) => unknown
  ): React.ReactElement {}

  protected _renderChannelDescription(): React.ReactElement {
    const { channelDescription } = this.state;
  }

  protected async __updateChannelDescription(): Promise<void> {
    try {
      const { channelDescription } = this.state;
      this.setState({
        isPending: true,
      });
      await this.props.updateChannelDescription(channelDescription);
    } catch (error) {
      this.setState({
        error,
      });
    } finally {
      this.setState({
        isPending: false,
      });
    }
  }
}
