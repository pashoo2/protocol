import React from 'react';
import { ISwarmMessageChannelDescriptionRaw } from '../../classes/swarm-messages-channels/types/swarm-messages-channel-instance.types';
import { TSwarmMessageSerialized } from '../../classes/swarm-message/swarm-message-constructor.types';
import { ESwarmStoreConnector } from '../../classes/swarm-store-class/swarm-store-class.const';
import { TSwarmStoreDatabaseType, TSwarmStoreDatabaseOptions } from '../../classes/swarm-store-class/swarm-store-class.types';
import { BaseComponent } from '../base-component/base-component';
import { swarmChannelDescriptionComponentCreateFormFieldsDescriptionForChannelDescription } from './swarm-channel-description-component.utils';
import { IButtonProps, onFormValuesChange, IFormFieldsValues } from '../base-component/base-component.types';
import { createFunctionFromSerializedFunction } from '../../utils/common-utils/common-utils.functions';

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
  isEditChannelDesctiptionMode: boolean;
  channelDescription: ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>;
  /**
   * Channel description edited
   *
   * @type {ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>}
   * @memberof ISwarmChannelDescriptionComponentProps
   */
  channelDescriptionEdited: ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO> | undefined;
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
    isEditChannelDesctiptionMode: false,
    channelDescription: this.props.channelDescription,
    channelDescriptionEdited: undefined,
  };

  private __baseComponent = new BaseComponent();

  private get __channelDescriptionEdited(): ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO> {
    const { channelDescriptionEdited } = this.state;
    if (!channelDescriptionEdited) {
      throw new Error('Channel description is not edited');
    }
    return channelDescriptionEdited;
  }

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

  protected _renderChannelDescriptionEditForm(): React.ReactElement {
    const { channelDescriptionEdited } = this.state;

    if (!channelDescriptionEdited) {
      return <p>Channel description is not ready to be edited</p>;
    }

    const formFieldsDescription = swarmChannelDescriptionComponentCreateFormFieldsDescriptionForChannelDescription<
      P,
      T,
      DbType,
      DBO,
      typeof channelDescriptionEdited
    >(channelDescriptionEdited);
    const formProps = {
      formFields: formFieldsDescription,
      submitButton: {
        ...SUBMIT_CHANNEL_CHANGES_BUTTON_PROPS,
        onClick: this.__handlePressUpdateChannelDescription,
      },
    };
    return this.__baseComponent.renderForm(formProps, this.__onChannelDescriptionChange);
  }

  protected _renderChannelDescriptionMainInfo(): React.ReactElement {
    const { channelDescription } = this.state;
    return (
      <div>
        <p>Name: {channelDescription.name}</p>
        <p>Version: {channelDescription.version}</p>
        <p>Id: {channelDescription.id}</p>
      </div>
    );
  }

  protected _renderButtonEnableEditMode(): React.ReactElement {
    const { isPending, isEditChannelDesctiptionMode } = this.state;
    const handleEnableEditMode = () => {
      this.setState((state) => {
        return {
          isEditChannelDesctiptionMode: !state.isEditChannelDesctiptionMode,
          channelDescriptionEdited: { ...state.channelDescription },
        };
      });
    };
    return (
      <button disabled={isPending} onClick={handleEnableEditMode}>
        {isEditChannelDesctiptionMode ? 'Readonly' : 'Edit'} form
      </button>
    );
  }

  protected _renderChannelDescription(): React.ReactElement {
    const { isEditChannelDesctiptionMode } = this.state;

    return (
      <div>
        {this._renderButtonEnableEditMode()}
        <hr />
        {isEditChannelDesctiptionMode ? this._renderChannelDescriptionEditForm() : this._renderChannelDescriptionMainInfo()}
      </div>
    );
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
      channelDescriptionEdited: {
        ...this.__channelDescriptionEdited,
        ...values,
      },
    });
  };

  private __getNewChannelDescription() {
    const channelDescriptionEdited = this.__channelDescriptionEdited;
    const { dbOptions } = channelDescriptionEdited;
    const { grantAccess } = dbOptions;

    if (typeof grantAccess === 'string') {
      return {
        ...channelDescriptionEdited,
        dbOptions: {
          ...channelDescriptionEdited.dbOptions,
          grantAccess: createFunctionFromSerializedFunction(grantAccess),
        },
      };
    }
    return channelDescriptionEdited;
  }

  private __handlePressUpdateChannelDescription = async (ev: React.SyntheticEvent) => {
    debugger;
    ev.preventDefault();
    const { updateChannelDescription } = this.props;
    const channelDescriptionEdited = this.__getNewChannelDescription();
    const pendingUpdateChannelDescriptionPromise = updateChannelDescription(channelDescriptionEdited);
    // TODO - dbOptions is empty
    this.setState({
      isPending: true,
    });
    try {
      await pendingUpdateChannelDescriptionPromise;
    } catch (err) {
      alert(err.message);
    } finally {
      this.setState({
        isPending: false,
      });
    }
  };
}
