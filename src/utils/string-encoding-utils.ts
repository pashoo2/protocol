import { decode, encode } from 'base64-arraybuffer';

export const encodeArrayBufferToBase64 = (
  arrayBuffer: ArrayBuffer
): string | Error => {
  if (arrayBuffer instanceof ArrayBuffer) {
    try {
      return encode(arrayBuffer);
    } catch (err) {
      return err;
    }
  }
  return new Error('The argument must be an instanceof ArrayBuffer');
};

export const encodeArrayBufferToUTF8 = (
  arrayBuffer: ArrayBuffer
): string | Error => {
  const res = encodeArrayBufferToBase64(arrayBuffer);

  if (res instanceof Error) {
    return res;
  }
  return atob(res);
};

export const decodeStringBase64ToArrayBuffer = (
  stringBase64: string
): ArrayBuffer | Error => {
  if (typeof stringBase64 === 'string') {
    try {
      return decode(stringBase64);
    } catch (err) {
      return err;
    }
  }
  return new Error('The argument given must be a string');
};

export const decodeStringUTF8ToArrayBuffer = (
  stringUtf8: string
): ArrayBuffer | Error => {
  if (typeof stringUtf8 === 'string') {
    try {
      return decodeStringBase64ToArrayBuffer(btoa(stringUtf8));
    } catch (err) {
      return err;
    }
  }
  return new Error('The argument given must be a string');
};
