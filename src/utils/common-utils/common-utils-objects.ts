export const isNotEmptyObject = (o: any): o is object => {
  return !!o && typeof o === 'object' && !!Object.keys(o).length;
};

export const isEmptyObject = (o: any): boolean => {
  return !isNotEmptyObject(o);
};
