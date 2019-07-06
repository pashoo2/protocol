import React from 'react';
import {
  generateKeyPair,
  exportKeyPairAsString,
  importKeyPairFromString,
  encryptToString,
} from 'utils/encryption-utils';
import logo from './logo.svg';
import './App.css';

const test = async () => {
  const result = await generateKeyPair();

  if (result instanceof Error) {
    console.error(result);
  } else {
    console.log('export key pair', result);

    const exportedKeyPairString = await exportKeyPairAsString(result);

    console.log(exportedKeyPairString);

    const importedKeyPair = await importKeyPairFromString(
      exportedKeyPairString
    );

    if (importedKeyPair instanceof Error) {
      throw importedKeyPair;
    }

    const encryptedStringByExported = await encryptToString(
      exportedKeyPairString,
      '123'
    );
    const encryptedStringByImported = await encryptToString(
      importedKeyPair,
      '123'
    );

    console.log(encryptedStringByExported);
    console.log(encryptedStringByImported);
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
