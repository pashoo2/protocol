export interface IDataCachingDecoratorDecoratedFunction<T, V> {
  (key: T): Promise<V>;
}

export interface IDataCachingDecoratorCachedValue<V> {
  rating: number;
  value: V;
}
