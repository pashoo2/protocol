export interface IDataCachingDecoratorDecoratedFunction<T, V> {
  (key: T, ...otherArguments: any[]): V;
}

export interface IDataCachingDecoratorCachedValue<V> {
  rating: number;
  value: V;
}
