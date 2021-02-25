import { ISwarmMessageChannelDescriptionRaw } from './swarm-messages-channel-instance.types';

export type TDatabaseOptionsTypeByChannelDescriptionRaw<
  T extends ISwarmMessageChannelDescriptionRaw<any, any, any, any>
> = T extends ISwarmMessageChannelDescriptionRaw<any, any, any, infer DBO> ? DBO : never;
