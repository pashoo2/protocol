export const concatStrings = (delimeter: string, ...strings: string[]): string => {
  const stringsCount = strings.length;
  let stringPart = '';
  let idx = 1;
  let resultedString = strings[0];

  for (; idx < stringsCount; idx += 1) {
    stringPart = strings[idx];
    resultedString = `${strings}${stringPart.endsWith(delimeter) || stringPart.startsWith(delimeter) ? '' : ''}${stringPart}`;
  }
  return resultedString;
};
