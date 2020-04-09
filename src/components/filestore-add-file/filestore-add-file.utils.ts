import { FileStorageClassProviderIPFS } from 'classes/filestorage-class/filestorage-class-providers/filestorage-class-provider-ipfs/filestorage-class-provider-ipfs';
import { ipfsUtilsConnectBasic } from 'utils/ipfs-utils/ipfs-utils';
import { IFileStorageService } from '../../classes/filestorage-class/filestorage-class.types';
import { FileStorageClassProviderHTTP } from '../../classes/filestorage-class/filestorage-class-providers/filestorage-class-provider-http/filestorage-class-provider-http';
import {
  FileStorage,
  FILE_STORAGE_SERVICE_TYPE,
} from 'classes/filestorage-class';

export const connectToFileStorage = async () => {
  const ipfs = await ipfsUtilsConnectBasic();
  const optionsIpfs = {
    ipfs,
  };
  const optionsHTTP = {};
  const fileStoreProvider = new FileStorage();

  await fileStoreProvider.connect([
    {
      type: FILE_STORAGE_SERVICE_TYPE.IPFS,
      options: optionsIpfs,
    },
    {
      type: FILE_STORAGE_SERVICE_TYPE.HTTP,
      options: optionsHTTP,
    },
  ]);
  return fileStoreProvider;
};
