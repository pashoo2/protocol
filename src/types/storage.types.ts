export interface IStorageCommon<V = string> {
  get(key: string): Promise<V | undefined | null | Error>;
  set(key: string, value: V | undefined | null): Promise<void | boolean | Error>;
}

export interface IStorage<V> extends IStorageCommon<V> {}
