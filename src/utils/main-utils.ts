import sortKeys from 'sort-keys';
import { TMainDataTypes } from 'types/main.types';

export type TStringifyData = TMainDataTypes;

export const stringify = (data: TStringifyData): string | Error => {
  const dataType = typeof data;

  if (dataType === 'string') {
    return data as string;
  }
  if (dataType === 'number') {
    return String(data);
  }
  if (dataType === 'object') {
    try {
      // it's necessary to sort a keys of the object to give
      // the same strings for all objects with the same keys
      return JSON.stringify(
        sortKeys(data as { [key: string]: unknown }, { deep: true })
      );
    } catch (err) {
      return err;
    }
  }
  return new Error('Unknown data type');
};
