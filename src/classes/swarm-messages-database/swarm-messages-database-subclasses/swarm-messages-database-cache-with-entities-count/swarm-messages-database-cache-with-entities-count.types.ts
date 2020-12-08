export interface ISwarmMessagesDatabaseCacheWithEntitiesCountOptions {
  /**
   * how many items to read from the store to decide
   * that all items were sucessfully read
   *
   * @type {number}
   * @memberof ISwarmMessagesDatabaseCacheWithEntitiesCountOptions
   */
  itemsToReadCountFault: number;
}
