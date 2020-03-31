import { IPFS } from 'types/ipfs.types';
import { IFileStorageServiceFileAddOptions } from '../../filestorage-class.types';

export interface IFileStorageClassProviderIPFSOptions {
  ipfs: IPFS;
}

export interface IFileStorageClassProviderIPFSFileAddOptions
  extends IFileStorageServiceFileAddOptions {
  /**
   * hunking algorithm used to build ipfs DAGs. Available formats:
   * size-{size}
   * rabin
   * rabin-{avg}
   * rabin-{min}-{avg}-{max}
   */
  chunker?: string;
  /**
   * (integer, default 0): the CID version to use when storing the data (storage keys are based on the CID, including its version).
   */
  cidVersion?: number;
  /**
   * (boolean, default false): if true will use the trickle DAG format for DAG generation. Trickle definition from go-ipfs documentation.
   */
  trickle?: boolean;
  /**
   * adds a wrapping node around the content.
   */
  wrapWithDirectory?: boolean;
}
