export type TSwarmMessagePayloadSerialized = string | number[] | Uint8Array | ArrayBuffer | SharedArrayBuffer;

export interface ISwarmMessagePayloadValidationOptions {
  payloadMaxLengthBytes: number;
  payloadMinLengthBytes: number;
}
