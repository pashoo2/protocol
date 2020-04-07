import { FileStorageClassProviderIPFS } from 'classes/filestorage-class/filestorage-class-providers/filestorage-class-provider-ipfs/filestorage-class-provider-ipfs';
import { ipfsUtilsConnectBasic } from 'utils/ipfs-utils/ipfs-utils';
import { IFileStorageService } from '../../classes/filestorage-class/filestorage-class.types';
import { FileStorageClassProviderHTTP } from '../../classes/filestorage-class/filestorage-class-providers/filestorage-class-provider-http/filestorage-class-provider-http';

export const connectToIPFSFileStore = async () => {
  const ipfs = await ipfsUtilsConnectBasic();
  const options = {
    ipfs,
  };
  const fileStoreProvider = new FileStorageClassProviderIPFS();

  await fileStoreProvider.connect(options);
  return fileStoreProvider;
};

export const connectToHTTPFileStore = async () => {
  const fileStoreProvider = new FileStorageClassProviderHTTP();

  await fileStoreProvider.connect({});
  return fileStoreProvider;
};
