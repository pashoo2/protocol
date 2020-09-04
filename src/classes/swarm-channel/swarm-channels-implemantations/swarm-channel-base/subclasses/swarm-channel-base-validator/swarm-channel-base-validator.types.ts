import {
  ISwarmChannelDescriptionFieldsMain,
  ISwarmChannelLocalMeta,
  ISwarmChannelSharedMeta,
} from '../../../../swarm-channel.types';

export interface ISwarmChannelDescriptionFieldsBasePartial
  extends ISwarmChannelDescriptionFieldsMain {
  localMeta?: Partial<ISwarmChannelLocalMeta>;
  sharedMeta?: Partial<ISwarmChannelSharedMeta>;
}
