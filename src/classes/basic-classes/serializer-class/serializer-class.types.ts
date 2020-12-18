import { IFunctionSerializer, IFunctionParser } from 'types/serialization.types';

/**
 * Should return a value can be serialized with JSON.stringify
 *
 * @export
 * @interface ISerializerClassReplacerCallback
 */
export interface ISerializerClassReplacerCallback {
  (key: string, value: any, functionSerializer: IFunctionSerializer): any;
}

/**
 * Should return true is string is a function serialized with .toStirng()
 *
 * @export
 * @interface ISerializerClassCheckerIsFunctionSerialized
 */
export interface ISerializerClassCheckerIsFunctionSerialized {
  (str: any): boolean;
}

/**
 * Used to parse a value stringified earlier
 *
 * @export
 * @interface ISerializerClassReviverCallback
 */
export interface ISerializerClassReviverCallback {
  (
    key: string,
    value: any,
    functionSerializedChecker: ISerializerClassCheckerIsFunctionSerialized,
    functionParser: IFunctionParser
  ): any;
}

export interface ISerializerClassConstructorOptions {
  /**
   * Will be used for functions serialiazation
   *
   * @type {IFunctionSerializer}
   * @memberof ISerializerClassConstructorOptions
   */
  functionSerializer?: IFunctionSerializer;
  /**
   * Will be used as a JSON.stringify second argyment
   * called "replacer".
   *
   * @type null
   * @memberof ISerializerClassConstructorOptions
   */
  replacer?: ISerializerClassReplacerCallback;
  /**
   * Will be used to define whether a stirng is a function
   * serialized.
   *
   * @type {ISerializerClassCheckerIsFunctionSerialized}
   * @memberof ISerializerClassConstructorOptions
   */
  functionSerializedChecker?: ISerializerClassCheckerIsFunctionSerialized;
  /**
   * Will be used to parse a function serialized
   *
   * @type {IFunctionParser}
   * @memberof ISerializerClassConstructorOptions
   */
  functionParser?: IFunctionParser;
  /**
   * Should return a value parsed, in JSON.parse reviver callback
   *
   * @type {ISerializerClassReviverCallback}
   * @memberof ISerializerClassConstructorOptions
   */
  reviver?: ISerializerClassReviverCallback;
}
