export interface IDataCachingDecoratorDecoratedFunction<T, V> {
  (key: T): Promise<V>;
}
