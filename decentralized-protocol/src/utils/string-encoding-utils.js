export function encodeArrayBufferToDOMString(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}
export function decodeDOMStringToArrayBuffer(str) {
    const buf = new ArrayBuffer(str.length * 2);
    const bufView = new Uint16Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}
//# sourceMappingURL=string-encoding-utils.js.map