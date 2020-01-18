export const encodeForFirebaseKey = (s: string): string => {
  return s
    .replace(/\./g, '_P%ë5nN*')
    .replace(/$/g, '_D%5nNë*')
    .replace(/#/g, '_H%ë5Nn*')
    .replace(/\[/g, '_Oë5n%N*')
    .replace(/]/g, '_5nN*C%ë')
    .replace(/\//g, '*_S%ë5nN');
};

export const decodeFromFirebaseKey = (s: string): string => {
  return s
    .replace(/_P%ë5nN\*/g, '.')
    .replace(/_D%5nNë\*/g, '$')
    .replace(/_H%ë5Nn\*/g, '#')
    .replace(/_Oë5n%N\*/g, '[')
    .replace(/_5nN\*C%ë/g, ']')
    .replace(/\*_S%ë5nN/g, '/');
};
