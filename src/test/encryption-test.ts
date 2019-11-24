import {
  generateKeyPair,
  encryptNative,
  decryptNative,
  exportKeyPairAsString,
  importKeyPairFromString,
  encryptToString,
  decryptFromString,
  encryptToTypedArray,
} from 'utils/encryption-utils';
import { calculateHash } from 'utils/hash-calculation-utils';

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

const testEncryption = async () => {
  const kPair = await generateKeyPair();

  if (kPair instanceof Error) {
    console.error(kPair);
  } else {
    /** THE FIRST USE-CASE */
    // console.log('export key pair', kPair);
    // const dataToChiper = '245';
    // const encryptedData = await encryptNative(
    //   kPair.publicKey,
    //   decode(btoa(dataToChiper))
    // );
    // if (encryptedData instanceof Error) {
    //   console.error(encryptedData);
    // } else {
    //   const decryptedData = await decryptNative(
    //     kPair.privateKey,
    //     decode(encode(encryptedData))
    //   );
    //   if (decryptedData instanceof Error) {
    //     console.error(decryptedData);
    //   } else {
    //     console.log('decrypted', atob(encode(decryptedData)));
    //   }
    //
    /** THE SECOND USE-CASE */
    // const exportedKeyPairString = await exportKeyPairAsString(kPair);
    // console.log(exportedKeyPairString);
    // const importedKeyPair = await importKeyPairFromString(
    //   exportedKeyPairString
    // );
    // if (importedKeyPair instanceof Error) {
    //   throw importedKeyPair;
    // }
    // const encryptedStringByExported = await encryptToString(
    //   importedKeyPair,
    //   'this is a long long text'
    // );
    // const encryptedStringByImported = await encryptToTypedArray(
    //   exportedKeyPairString,
    //   'this is a long long text'
    // );
    // console.log('encryptedStringByExported', encryptedStringByExported);
    // console.log('encryptedStringByImported', encryptedStringByImported);
    // if (!(encryptedStringByExported instanceof Error)) {
    //   const decrypted = await decryptFromString(
    //     importedKeyPair,
    //     encryptedStringByExported
    //   );
    //   if (!(decrypted instanceof Error)) {
    //     console.log('decrypted', decrypted);
    //   }
    // }
    /** HASH CALCULATION */
    // const hashStrOnce = await calculateHash({ d: 1 });
    // const hashStrTwice = await calculateHash({ d: 1 });
    // console.log(hashStrOnce);
    // console.log(hashStrTwice);
    // if (hashStrTwice !== hashStrOnce) {
    //   console.error(new Error('Hash of the same data does not matching'));
    // }
    /** HASH CALCULATION STRING */
    // const stringData =
    //   '"1233465)()09850MNLKADFNDSLKJGN%$%^$^#&#^@&*^)(&$#^&%*#%"';
    // const hashStrThird = await calculateHash(stringData);
    // const hashStrFourth = await calculateHash(stringData);
    // console.log(hashStrThird);
    // console.log(hashStrFourth);
    // if (hashStrThird !== hashStrFourth) {
    //   console.error(new Error('Hash of the same data does not matching'));
    // }
  }
};
// testEncryption();
