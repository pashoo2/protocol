import React from 'react';
import logo from './logo.svg';
import './App.css';

import { runTestFirebaseConnectionDatabase } from 'src/__test__/central-authority.test/central-authority-connection.test/central-authority-connection.test.firebase/central-authority-connection.test.firebase.database';
import { runTestFirebaseCredentialsStorage } from 'src/__test__/central-authority.test/central-authority-connection.test/central-authority-connection.test.firebase/central-authority-connection.test.firebase.credentials-storage';
import {
  runTestCAIdentityWithAuthorityProviderGeneratorV1,
  runTestCAIdentityV1,
} from 'src/__test__/central-authority.test/central-authority.test';
import {
  runTestCAConnectionFirebase,
  runTestCAConnectionFirebaseCryptoCredentialsGenerateByFirebaseAuthProvider,
} from 'src/__test__/central-authority.test/central-authority-connection.test/central-authority-connection.test';
import { runTestErrorExtended } from 'src/__test__/error-extended-class-test';
import { runTestSwarmConnection } from 'src/__test__/ipfs-swarm-connection.test/ipfs-swarm-connection.test';
import { runTestSwarmConnectionIPFS } from 'src/__test__/ipfs-swarm-connection.test/ipfs-swarm-connection-ipfs.test';
import { initializeMocha, runMocha } from 'src/__test__/mocha-chai-initialize';
import { runTestSwarmStoreOrbitDBConnection } from 'src/__test__/swarm-storage-orbit-db.test/swarm-storage-orbit-db.test';
import { runTestValidateMessagingTimestampsTest } from 'src/__test__/validation-messaging.test/validate-messaging-timestamps-test';
import { runTestHttpRequest } from 'src/__test__/http-request-class-base.test/http-request-class-base.test';
import { runTestPseudoNtpClass } from 'src/__test__/pseudo-ntp-class.test/pseudo-ntp-class.test';
import { runTestClientTimeSynced } from 'src/__test__/common-utils-date-time-synced.test';
import { runSwarmMessageFieldsValidator } from 'src/__test__/validation-messaging.test/swarm-message.test/swarm-message.fields-validator.test';
import { runTestCAIdentityV2 } from 'src/__test__/central-authority-identity.test/central-authority-identity-v2.test';
import { runCACredentialsIdentityStorageTest } from 'src/__test__/central-authority.test/central-authority-storage-identity-credentials.test';
import { runTestCAConnectionsUtilsValidators } from 'src/__test__/central-authority.test/central-authority-connection.test/central-authority-connections-utils.validators.test';
import { runTestCommonUtilsURL } from 'src/__test__/common-utils.test/common-utils-url.test';
import { runTestCAConnectionsPoolTest } from 'src/__test__/central-authority.test/central-authority-connection.test/central-authority-connections-pool.test/central-authority-connections-pool.test';
import { runTestCASwarmCredentilsProvider } from 'src/__test__/central-authority.test/central-authority-swarm-credentials-provider';

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
import { runTestSaltUtils } from './salt-generation-utils.test/salt-generation-utils.test';
import { testKeyGeneration } from 'src/__test__/password-key.test';
import { runTestSecretStorage } from 'src/__test__/secret-storage.test';
import { runTestEncryptionKeysUtils } from 'src/__test__/encryption-keys-utils.test';
import { runTestAuthorityStorageCurrentUser } from 'src/__test__/central-authority.test/central-authority-storage-current-user-credentials.test';
import { runTestCentralAuthorityUtils } from 'src/__test__/central-authority.test/central-authority-utils.test';
import { runTestOpenStorageTest } from 'src/__test__/open-storage.test';
import { runTestCentralAuthority } from './central-authority.test/central-authority-class.test/central-authority-class.test';
import { runSwarmMessageConstructorTests } from './swarrm-message-constructor.test/swarrm-message-constructor.test';
import { runSwarmMessageStoreTest } from './swarm-message-store-test/swarm-message-store-test.test';
import { runConnectionBridgeTests } from './connection-bridge.test/connection-bridge.test';

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
  // runTestSwarmStoreOrbitDBConnection();
  // runTestValidateMessagingTimestampsTest();
  // runTestHttpRequest();
  // runTestClientTimeSynced();
  // runSwarmMessageFieldsValidator();
  // runTestFirebaseCredentialsStorage();
  // runTestCAConnectionsUtilsValidators();
  // runTestCAConnectionsPoolTest();
  // runTestAuthorityStorageCurrentUser();
  // runTestOpenStorageTest();
  // runCACredentialsIdentityStorageTest();
  // runTestCASwarmCredentilsProvider();
  // runTestCentralAuthorityUtils(); // TODO - necessary to test urls comparation
  // runTestCentralAuthority();
  // runSwarmMessageConstructorTests();
  // runSwarmMessageStoreTest();
  runConnectionBridgeTests();
  runMocha();
};

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
