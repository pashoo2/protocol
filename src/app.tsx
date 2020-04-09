import React from 'react';
import { FileStoreAddFile } from 'components/filestore-add-file/filestore-add-file';
import { ConnectToSwarm } from 'components/connect-to-swarm';

export class App extends React.Component {
  render() {
    // return <FileStoreAddFile />;
    return <ConnectToSwarm />;
  }
}

export default App;
