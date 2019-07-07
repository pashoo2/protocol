import { decode, encode } from 'base64-arraybuffer';

export const encodeArrayBufferToBase64 = (
  arrayBuffer: ArrayBuffer
): string | Error => {
  if (arrayBuffer instanceof ArrayBuffer) {
    try {
      return atob(encode(arrayBuffer));
    } catch (err) {
      return err;
    }
  }
  return new Error('The argument must be an instanceof ArrayBuffer');
};

export const decodeStringBase64ToArrayBuffer = (
  stringBase64: string
): ArrayBuffer | Error => {
  if (typeof stringBase64 === 'string') {
    try {
      return decode(btoa(stringBase64));
    } catch (err) {
      return err;
    }
  }
  return new Error('The argument given must be a string');
};
