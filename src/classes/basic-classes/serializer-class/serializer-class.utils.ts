import { IFunctionParser, IFunctionSerializer } from '../../../types/serialization.types';
import { TSimpleTypes } from '../../../types/common.types';
import { isNativeFunction } from 'utils/common-utils/common-utils.functions';
import {
  ISerializerClassCheckerIsFunctionSerialized,
  ISerializerClassReplacerCallback,
  ISerializerClassReviverCallback,
} from './serializer-class.types';
import { isNonArrowFunctionStringified, isArrowFunctionStringified } from '../../../utils/common-utils/common-utils.functions';

export function serializerClassUtilFunctionSerializer(fn: (...args: any[]) => any): string {
  if (isNativeFunction(fn)) {
    throw new Error('Function cannot be serialized');
  }
  const functionSerialized = fn.toString();
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
  if (typeof value !== 'string') {
    return false;
  }
  const valueTrimmed = value.trim();
  const isFunctionAnyTypeStringified = isNonArrowFunctionStringified(valueTrimmed) || isArrowFunctionStringified(valueTrimmed);
  return isFunctionAnyTypeStringified;
}

export function serializerClassUtilFunctionParserDefault(functionSerialized: string): (...args: any[]) => any {
  // eslint-disable-next-line no-eval
  try {
    // TODO - ReDoS attacks and make it create function in a sandbox
    const funcitonCreatedFromString = eval(`(${functionSerialized})`);
    if (!funcitonCreatedFromString) {
      throw new Error('Failed to create function by it body');
    }
    return funcitonCreatedFromString;
  } catch (err) {
    throw new Error(`Faild parse the function ${functionSerialized}`);
  }
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
