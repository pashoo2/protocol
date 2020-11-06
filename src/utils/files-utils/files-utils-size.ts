export const getBlobSize = (o: Blob): number => o.size;

export const getFileObjectSize = (o: File): number => o.size;

export const getArrayBufSize = (o: ArrayBuffer): number => o.byteLength;

export const getBufferSize = (o: Buffer): number => o.byteLength;

export const getFileSize = (o: File | Blob | ArrayBuffer | Buffer): number | undefined => {
  if (o instanceof File) {
    return getFileObjectSize(o);
  }
  if (o instanceof Blob) {
    return getBlobSize(o);
  }
  if (o instanceof Buffer) {
    return getBufferSize(o);
  }
  if (o instanceof ArrayBuffer) {
    return getArrayBufSize(o);
  }
  return undefined;
};
