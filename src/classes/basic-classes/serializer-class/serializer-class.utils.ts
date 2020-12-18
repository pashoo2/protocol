import { IFunctionSerializer, IFunctionParser } from '../../../types/serialization.types';
import { TSimpleTypes } from '../../../types/common.types';
import {
  ISerializerClassReplacerCallback,
  ISerializerClassReviverCallback,
  ISerializerClassCheckerIsFunctionSerialized,
} from './serializer-class.types';

export function serializerClassUtilFunctionSerializer(fn: (...args: any[]) => any): string {
  const functionSerialized = fn.toString();
  if (functionSerialized === 'function () { [native code] }') {
    throw new Error('Function cannot be serialized');
  }
  return functionSerialized;
}

export function serializerClassUtilReplacerCallbackDefault(
  key: string,
  value: TSimpleTypes,
  functionSerializer: IFunctionSerializer
): any {
  if (typeof value === 'function') {
    return functionSerializer(value);
  }
  return value;
}

export function serializerClassUtilIsFunctionSerialziedDefault(value: any): boolean {
  return typeof value === 'string' && value.includes('function (');
}

export function serializerClassUtilFunctionParserDefault(functionSerialized: string): (...args: any[]) => any {
  // eslint-disable-next-line no-eval
  return eval(`(${functionSerialized})`);
}

export function serializerClassUtilReviverCallbackDefault(
  key: string,
  value: any,
  functionSerializedChecker: ISerializerClassCheckerIsFunctionSerialized,
  functionParser: IFunctionParser
): any {
  if (functionSerializedChecker(value)) {
    return functionParser(value);
  }
  return value;
}

export function serializerClassUtilCreateReplacerArgumentForJSONStringify(
  funcitonSerializer: IFunctionSerializer,
  replacerCallback: ISerializerClassReplacerCallback
): (this: any, key: string, value: any) => any {
  return (key: string, value: any) => {
    return replacerCallback(key, value, funcitonSerializer);
  };
}

export function serializerClassUtilCreateReviverArgumentForJSONParse(
  functionSerializedChecker: ISerializerClassCheckerIsFunctionSerialized,
  functionParser: IFunctionParser,
  reviverCallback: ISerializerClassReviverCallback
): (this: any, key: string, value: any) => any {
  return (key: string, value: any) => {
    return reviverCallback(key, value, functionSerializedChecker, functionParser);
  };
}
