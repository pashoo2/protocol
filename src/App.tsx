import React from 'react';
import logo from './logo.svg';
import './App.css';

import { runTestFirebaseConnectionDatabase } from 'test/central-authority.test/central-authority-connection.test/central-authority-connection.test.firebase/central-authority-connection.test.firebase.database';
import { runTestFirebaseCredentialsStorage } from 'test/central-authority.test/central-authority-connection.test/central-authority-connection.test.firebase/central-authority-connection.test.firebase.credentials-storage';
import { runTestCAIdentityWithAuthorityProviderGenerator } from 'test/central-authority.test/central-authority.test';
import {
  runTestCAConnectionFirebase,
  runTestCAConnectionFirebaseCryptoCredentialsGenerateByFirebaseAuthProvider,
} from 'test/central-authority.test/central-authority-connection.test/central-authority-connection.test';
import { runTestErrorExtended } from 'test/error-extended-class-test';
import { runTestSwarmConnection } from 'test/ipfs-swarm-connection.test/ipfs-swarm-connection.test';
import { runTestSwarmConnectionIPFS } from 'test/ipfs-swarm-connection.test/ipfs-swarm-connection-ipfs.test';
import { initializeMocha, runMocha } from 'test/mocha-chai-initialize';
import { runTestSwarmStoreOrbitDBConnection } from 'test/swarm-storage-orbit-db.test/swarm-storage-orbit-db.test';

// import { runCACredentialsIdentityStorageTest } from 'test/central-authority.test/central-authority-storage-identity-credentials.test';
// import { runTestCachingDecorator } from 'test/common-utils.test/common-utils.test';
// import { runTestCAIdentity } from 'test/central-authority.test/central-authority.test';
// import {
//   runTestKeys,
//   runTestsCredentialsStorage,
// } from 'test/central-authority.test/central-authority.test';
// import 'test/data-sign-test';
// import 'test/password-key.test';
// import { runTest } from 'test/safe-storage.test';
//import { runTest } from 'test/valiation-utils.test';
// import { runTest } from 'test/secret-storage.test';

// runTest();
// runTestsCredentialsStorage();
// runTestCAIdentity();
// runTestCachingDecorator();
// runCACredentialsIdentityStorageTest();

// runTestProfileValidation();
// runTestFirebaseCredentialsStorage();

// runTestErrorExtended();
// runTestCAConnectionFirebase();
// runTestCAConnectionFirebaseCryptoCredentialsGenerateByFirebaseAuthProvider();
// runTestFirebaseConnectionDatabase();
// runTestCAIdentityWithAuthorityProviderGenerator();
// runTestFirebaseCredentialsStorage();

// runTestSwarmConnectionIPFS();

const runTest = async () => {
  await initializeMocha();

  // runTestSwarmConnection();
  runTestSwarmStoreOrbitDBConnection();

  runMocha();
}

runTest();

const App: React.FC = () => {
  return null;
  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.tsx</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //   </div>
  // );
};

export default App;
