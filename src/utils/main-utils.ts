export const stryngify = (data: object | number | string): string | Error => {
  const dataType = typeof data;

  if (dataType === 'string') {
    return data as string;
  }
  if (dataType === 'number') {
    return String(data);
  }
  if (dataType === 'object') {
    try {
      return JSON.stringify(data);
    } catch (err) {
      return err;
    }
  }
  return new Error('Unknown data type');
};
