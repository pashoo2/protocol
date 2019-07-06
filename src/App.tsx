import React from 'react';
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
import { decode, encode } from 'base64-arraybuffer';
import logo from './logo.svg';
import './App.css';

function arrayBufferToBase64(buffer: ArrayBuffer) {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

const test = async () => {
  const kPair = await generateKeyPair();

  if (kPair instanceof Error) {
    console.error(kPair);
  } else {
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
    // }
    const exportedKeyPairString = await exportKeyPairAsString(kPair);
    console.log(exportedKeyPairString);
    const importedKeyPair = await importKeyPairFromString(
      exportedKeyPairString
    );
    if (importedKeyPair instanceof Error) {
      throw importedKeyPair;
    }
    const encryptedStringByExported = await encryptToString(
      importedKeyPair,
      'this is a long long text'
    );
    const encryptedStringByImported = await encryptToTypedArray(
      exportedKeyPairString,
      'this is a long long text'
    );
    console.log('encryptedStringByExported', encryptedStringByExported);
    console.log('encryptedStringByImported', encryptedStringByImported);
    if (!(encryptedStringByExported instanceof Error)) {
      const decrypted = await decryptFromString(
        importedKeyPair,
        encryptedStringByExported
      );
      if (!(decrypted instanceof Error)) {
        console.log('decrypted', decrypted);
      }
    }
  }
};
test();

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
};

export default App;
