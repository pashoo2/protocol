export type TSwarmMessageTimestampSerialized = number;

export interface ISwarmMessageTimestampValidationOptions {
  ttlSeconds?: number;
  minValue?: number;
  maxValue?: number;
  maxDiffErrorSeconds?: number;
}
