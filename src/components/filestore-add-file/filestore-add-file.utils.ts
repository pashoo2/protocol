import { FileStorage, FILE_STORAGE_SERVICE_TYPE } from '@pashoo2/filestorage';
import { ipfsUtilsConnectBasic } from 'utils/ipfs-utils/ipfs-utils';

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
