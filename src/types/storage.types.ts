export interface IStorageCommon {
  get(key: string): Promise<string | undefined | null | Error>;
  set(key: string, value: string | undefined | null): Promise<boolean | Error>;
}
