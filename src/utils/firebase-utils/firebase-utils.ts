export const encodeForFirebaseKey = (s: string): string => {
  s = s
    .replace(/\./g, '_P%ë5nN*')
    .replace(/$/g, '_D%5nNë*')
    .replace(/#/g, '_H%ë5Nn*')
    .replace(/\[/g, '_Oë5n%N*')
    .replace(/]/g, '_5nN*C%ë')
    .replace(/\//g, '*_S%ë5nN');
  return s;
};

export const decodeFromFirebaseKey = (s: string): string => {
  s = s
    .replace('_P%ë5nN*', '.')
    .replace('_D%5nNë*', '$')
    .replace('_H%ë5Nn*', '#')
    .replace('_Oë5n%N*', '[')
    .replace('_5nN*C%ë', ']')
    .replace('*_S%ë5nN', '/');

  return s;
};
