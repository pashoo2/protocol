import LZString from 'lz-string';

export const compressString = (value: string): string | Error => {
  try {
    return LZString.compressToUTF16(value);
  } catch (err) {
    console.error(err);
    return new Error('Failed to compress string to UTF-16 encoded string');
  }
};

export const decompressString = (value: string): string | Error => {
  try {
    return LZString.decompressFromUTF16(value);
  } catch (err) {
    console.error(err);
    return new Error('Failed to decompress string to UTF-16 encoded string');
  }
};
