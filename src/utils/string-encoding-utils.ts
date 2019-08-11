/**
 * The sulutions is right from the article
 * https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
 */

export function encodeArrayBufferToDOMString(buf: ArrayBuffer) {
  return String.fromCharCode.apply(null, new Uint16Array(buf) as any);
}
export function decodeDOMStringToArrayBuffer(str: string) {
  var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}
