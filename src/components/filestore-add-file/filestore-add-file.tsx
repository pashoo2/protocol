import React, { MouseEvent } from 'react';
import { connectToHTTPFileStore } from './filestore-add-file.utils';
import { FILE_STORAGE_SERVICE_STATUS } from 'classes/filestorage-class';
import {
  downloadFile,
  downloadFileByUrl,
} from '../../utils/files-utils/files-utils-download';
import { IFileStorageService } from '../../classes/filestorage-class/filestorage-class.types';

export class FileStoreAddFile extends React.Component {
  protected fileStore: IFileStorageService | undefined;

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
      return (
        <>
          {this.renderFileDownload()}
          {this.renderFileUpload()}
        </>
      );
    }
    return <div>Not ready</div>;
  }

  protected async createFilestoreInstance() {
    this.fileStore = await connectToHTTPFileStore();
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
        console.dir(file);
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
        this.forceUpdate();
      }
    }
  };

  protected handleFileDownload = async (ev: MouseEvent<HTMLAnchorElement>) => {
    const { target } = ev;
    const { textContent } = target as HTMLAnchorElement;

    ev.preventDefault();
    if (textContent) {
      const file = await this.fileStore?.get(textContent);

      if (file) {
        downloadFile(file);
      }
    }
  };

  protected handleFileDownloadByURL = async () => {
    const inpEl = document.getElementById('fileDownload');
    const url = (inpEl as HTMLInputElement)?.value;

    if (url) {
      try {
        // TODO test with no-cors images
        const result = await this.fileStore?.get(`/${url}`);
        console.log(result);
        debugger;
        if (!(result instanceof File)) {
          throw new Error('Failed to get the file');
        }
        downloadFile(result);
      } catch (err) {
        debugger;
        console.error(err);
        downloadFileByUrl(url);
      }
      debugger;
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
