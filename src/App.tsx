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
import logo from './logo.svg';
import './App.css';

const test = async () => {
  const kPair = await generateKeyPair();

  if (kPair instanceof Error) {
    console.error(kPair);
  } else {
    console.log('export key pair', kPair);
    const dataToChiper = '123';
    const textEncoder = new TextEncoder();
    const encryptedData = await encryptNative(
      kPair.publicKey,
      textEncoder.encode(dataToChiper)
    );
    debugger;
    if (encryptedData instanceof Error) {
      console.error(encryptedData);
    } else {
      const textDecoder = new TextDecoder(textEncoder.encoding);
      const decryptedData = await decryptNative(
        kPair.privateKey,
        textEncoder.encode(textDecoder.decode(encryptedData))
      );
      debugger;
      if (decryptedData instanceof Error) {
        console.error(decryptedData);
      } else {
        console.log('decrypted', textDecoder.decode(decryptedData));
      }
    }
    // TODO:
    // const exportedKeyPairString = await exportKeyPairAsString(kPair);
    // console.log(exportedKeyPairString);
    // const importedKeyPair = await importKeyPairFromString(
    //   exportedKeyPairString
    // );
    // if (importedKeyPair instanceof Error) {
    //   throw importedKeyPair;
    // }
    // const encryptedStringByExported = await encryptToString(
    //   kPair.publicKey,
    //   '123'
    // );
    // debugger;
    // const encryptedStringByImported = await encryptToTypedArray(
    //   kPair.publicKey,
    //   '123'
    // );
    // console.log('encryptedStringByExported', encryptedStringByExported);
    // console.log('encryptedStringByImported', encryptedStringByImported);
    // if (!(encryptedStringByExported instanceof Error)) {
    //   const textEncoder = new TextEncoder();
    //   const decrypted = await decryptNative(
    //     kPair.privateKey,
    //     textEncoder.encode(encryptedStringByExported)
    //   );
    //   debugger;
    //   console.log('decrypted', decrypted);
    // }
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
