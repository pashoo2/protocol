import { FileStorageClassProviderIPFS } from 'classes/filestorage-class/filestorage-class-providers/filestorage-class-provider-ipfs/filestorage-class-provider-ipfs';
import { ipfsUtilsConnectBasic } from 'utils/ipfs-utils/ipfs-utils';

export const connectToFileStore = async () => {
  const ipfs = await ipfsUtilsConnectBasic();
  const fileStoreProvider = new FileStorageClassProviderIPFS();

  await fileStoreProvider.connect({
    ipfs,
  });
  return fileStoreProvider;
};
