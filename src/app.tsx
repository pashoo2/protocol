import React from 'react';
import { FileStoreAddFile } from 'components/filestore-add-file/filestore-add-file';
import { ConnectToSwarm } from 'components/connect-to-swarm';
import { SensitiveDataStorage } from 'components/sensitive-data-storage';

export class App extends React.Component {
  render() {
    // return <FileStoreAddFile />;
    // return <SensitiveDataStorage />;
    return <ConnectToSwarm />;
  }
}

export default App;
