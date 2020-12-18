export interface ISerializableObject<T> {
  [key: string]: T;
}

export interface ISerializer<T = any> {
  stringify(o: T): string;
  parse(data: string): T;
}

export interface IFunctionSerializer {
  (fn: (...args: any[]) => any): string;
}

export interface IFunctionParser {
  (fnSerialized: string): (...args: any[]) => any;
}
