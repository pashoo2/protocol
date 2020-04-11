import React, { MouseEvent } from 'react';
import { FILE_STORAGE_SERVICE_STATUS } from 'classes/filestorage-class';
import {
  downloadFile,
  downloadFileByUrl,
} from '../../utils/files-utils/files-utils-download';
import { IFileStorage } from '../../classes/filestorage-class/filestorage-class.types';
import { FILE_STORAGE_SERVICE_TYPE } from '../../classes/filestorage-class/filestorage-class.const';
import { connectToFileStorage } from './filestore-add-file.utils';

export class FileStoreAddFile extends React.Component {
  protected fileStorage:
    | IFileStorage<
        FILE_STORAGE_SERVICE_TYPE.HTTP | FILE_STORAGE_SERVICE_TYPE.IPFS
      >
    | undefined;

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
    const { fileStorage: fileStore } = this;

    if (!fileStore) {
      return <div>Not ready</div>;
    }
    return (
      <>
        {this.renderFileDownload()}
        {this.renderFileUpload()}
      </>
    );
  }

  protected async createFilestoreInstance() {
    this.fileStorage = await connectToFileStorage();
    this.forceUpdate();
  }

  protected handleFileChosen = async (
    ev: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (this.loadingProgress != null) {
      return;
    }

    const { target } = ev;
    const { fileStorage: fileStore } = this;

    if (fileStore && target.files) {
      const file = target.files[0];

      this.loadingProgress = 0;
      try {
        console.dir(file);
        const [loadedAddr] = await Promise.all([
          fileStore.add(FILE_STORAGE_SERVICE_TYPE.IPFS, file.name, file, {
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
        this.forceUpdate();
      }
    }
  };

  protected handleFileDownload = async (ev: MouseEvent<HTMLAnchorElement>) => {
    const { target } = ev;
    const { textContent } = target as HTMLAnchorElement;

    ev.preventDefault();
    if (textContent) {
      await this.fileStorage?.download(textContent);
    }
  };

  protected handleFileDownloadByURL = async () => {
    const inpEl = document.getElementById('fileDownload');
    const url = (inpEl as HTMLInputElement)?.value;

    if (url) {
      try {
        const result = await this.fileStorage?.get(`/file/${url}`);

        if (!(result instanceof File)) {
          throw new Error('Failed to get the file');
        }
        downloadFile(result);
      } catch (err) {
        console.error(err);
      }
    }
  };

  protected renderFilesLoadedList() {
    const { uploadedFiles } = this;

    return uploadedFiles.map((fileAddr, idx) => (
      <div key={fileAddr}>
        <pre>{idx}. </pre>
        <a
          href="#"
          role="button"
          data-name={fileAddr}
          onClick={this.handleFileDownload}
        >
          {fileAddr}
        </a>
      </div>
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

  protected renderFileDownload() {
    return (
      <div>
        <label htmlFor="fileUpload">Url: </label>
        <input id="fileDownload" type="text" />
        <button onClick={this.handleFileDownloadByURL}>Download</button>
      </div>
    );
  }
}
