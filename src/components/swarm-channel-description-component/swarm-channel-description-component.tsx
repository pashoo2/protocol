import React from 'react';
import { ISwarmMessageChannelDescriptionRaw } from '../../classes/swarm-messages-channels/types/swarm-messages-channel-instance.types';
import { TSwarmMessageSerialized } from '../../classes/swarm-message/swarm-message-constructor.types';
import { ESwarmStoreConnector } from '../../classes/swarm-store-class/swarm-store-class.const';
import { TSwarmStoreDatabaseType, TSwarmStoreDatabaseOptions } from '../../classes/swarm-store-class/swarm-store-class.types';
import { BaseComponent } from '../base-component/base-component';
import { swarmChannelDescriptionComponentCreateFormFieldsDescriptionForChannelDescription } from './swarm-channel-description-component.utils';
import { IButtonProps, onFormValuesChange, IFormFieldsValues } from '../base-component/base-component.types';

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

const SUBMIT_CHANNEL_CHANGES_BUTTON_PROPS: IButtonProps = {
  title: 'Change channel description',
};

export class SwarmChannelDescriptionComponent<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>
> extends React.PureComponent<
  ISwarmChannelDescriptionComponentProps<P, T, DbType, DBO>,
  ISwarmChannelDescriptionComponentState<P, T, DbType, DBO>
> {
  public state: ISwarmChannelDescriptionComponentState<P, T, DbType, DBO> = {
    error: undefined,
    isPending: false,
    channelDescription: this.props.channelDescription,
  };

  private __baseComponent = new BaseComponent();

  public render(): React.ReactElement {
    const { isPending, error } = this.state;
    const errorElement = error && this.__baseComponent.renderError(error);
    const channelIsPendingComponent = isPending && this.__baseComponent.renderLabel({ label: 'Channel description is updating' });
    const channelDescriptionForm = this._renderChannelDescription();

    return (
      <div>
        {errorElement}
        {channelIsPendingComponent}
        {channelDescriptionForm}
      </div>
    );
  }

  protected _renderChannelDescription(): React.ReactElement {
    const { channelDescription } = this.state;
    const formFieldsDescription = swarmChannelDescriptionComponentCreateFormFieldsDescriptionForChannelDescription<
      P,
      T,
      DbType,
      DBO,
      typeof channelDescription
    >(channelDescription);
    const formProps = {
      formFields: formFieldsDescription,
      submitButton: SUBMIT_CHANNEL_CHANGES_BUTTON_PROPS,
    };
    return this.__baseComponent.renderForm(formProps, this.__onChannelDescriptionChange);
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

  private __onChannelDescriptionChange: onFormValuesChange = (values: IFormFieldsValues): void => {
    console.log(values);
    debugger;
    this.setState({
      channelDescription: {
        ...this.state.channelDescription,
        ...values,
      },
    });
  };
}
