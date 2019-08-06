import { ownValueOf } from 'types/helper.types';

export type TStatusClassBaseOptions<TStatus extends object> = {
  errorStatus: ownValueOf<TStatus>;
  initialStatus?: ownValueOf<TStatus>;
  instanceName: string;
};
