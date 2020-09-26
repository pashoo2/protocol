import { ConstructorType } from 'types/helper.types';

export const isConstructor = (v: any): v is ConstructorType<any> => {
  return (
    typeof v === 'function' &&
    typeof v.prototype?.constructor?.name === 'string'
  );
};
