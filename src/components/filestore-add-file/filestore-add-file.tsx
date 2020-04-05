import React from 'react';
import { connectToFileStore } from './filestore-add-file.utils';
import { FileStorageClassProviderIPFS } from 'classes/filestorage-class/filestorage-class-providers/filestorage-class-provider-ipfs/filestorage-class-provider-ipfs';
import { FILE_STORAGE_SERVICE_STATUS } from 'classes/filestorage-class';

export class FileStoreAddFile extends React.Component {
  protected fileStore: FileStorageClassProviderIPFS | undefined;

  protected loadingProgress: number | undefined = undefined;

  protected uploadedFiles: string[] = [];

  protected styles = {
    filesLoadedContainer: {
      paddingBottom: '10px',
    },
  };

  public componentDidMount() {
    this.createFilestoreInstance();
  }

  public render() {
    const { fileStore } = this;

    if (fileStore?.status === FILE_STORAGE_SERVICE_STATUS.READY) {
      return this.renderFileUpload();
    }
    return <div>Not ready</div>;
  }

  protected async createFilestoreInstance() {
    this.fileStore = await connectToFileStore();
    this.forceUpdate();
  }

  protected handleFileChosen = async (
    ev: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (this.loadingProgress != null) {
      return;
    }

    const { target } = ev;
    const { fileStore } = this;

    if (fileStore && target.files) {
      const file = target.files[0];

      this.loadingProgress = 0;
      try {
        const [loadedAddr] = await Promise.all([
          fileStore.add(file.name, file, {
            progress: (progress: number) => {
              this.loadingProgress = progress;
              this.forceUpdate();
            },
          }),
          Promise.resolve().then(() => {
            this.forceUpdate();
          }),
        ]);
        this.uploadedFiles.push(loadedAddr);
      } catch (err) {
        console.error(err);
      } finally {
        this.loadingProgress = undefined;
      }
    }
  };

  protected renderFilesLoadedList() {
    const { uploadedFiles } = this;

    return uploadedFiles.map((fileAddr) => (
      <div key={fileAddr}>{fileAddr}</div>
    ));
  }

  protected renderFileUpload() {
    if (this.loadingProgress != null) {
      return <div>Upload progress: {this.loadingProgress}</div>;
    }
    return (
      <div>
        <div style={this.styles.filesLoadedContainer}>
          {this.renderFilesLoadedList()}
        </div>
        <label htmlFor="fileUpload">File: </label>
        <input id="fileUpload" type="file" onChange={this.handleFileChosen} />
      </div>
    );
  }
}
