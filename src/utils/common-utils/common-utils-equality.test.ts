import { isDeepEqual } from './common-utils-equality';

describe('common-utils-equality', () => {
  describe('isDeepEqual', () => {
    describe('Compare objects', () => {
      describe('equals', () => {
        test('Emmpty objects - without keys should be equal', () => {
          expect(isDeepEqual({}, {})).toBe(true);
        });
        test('Objects contains simple type values should be equals', () => {
          expect(
            isDeepEqual(
              {
                a: 1,
                b: 'b',
                c: undefined,
                d: null,
              },
              {
                c: undefined,
                a: 1,
                d: null,
                b: 'b',
              }
            )
          ).toBe(true);
        });
        test('objects contains non-simple types values should be equal', () => {
          expect(
            isDeepEqual(
              {
                a: 1,
                b: 'b',
                c: {
                  ca: 1,
                  cb: 'cb',
                },
                d: {
                  da: {
                    daa: {
                      daaa: [],
                    },
                    dab: {
                      daba: {},
                      dabb: 1,
                    },
                  },
                  db: {},
                },
              },
              {
                c: {
                  cb: 'cb',
                  ca: 1,
                },
                a: 1,
                b: 'b',
                d: {
                  db: {},
                  da: {
                    dab: {
                      dabb: 1,
                      daba: {},
                    },
                    daa: {
                      daaa: [],
                    },
                  },
                },
              }
            )
          ).toBe(true);
        });
        test('objects contains functions with equal body must be equal', () => {
          expect(
            isDeepEqual(
              {
                a: 1,
                b: 'b',
                c: {
                  ca: function (caFunctionArgument1: unknown, caFunctionArgument2: unknown) {
                    const caConst = 'caConst';
                    if (caFunctionArgument1 === caFunctionArgument2) {
                      return true;
                    }
                    return caConst === 'caConst';
                  },
                  cb: 'cb',
                },
                d: {
                  da: {
                    daa: {
                      daaa: [],
                    },
                    dab: {
                      daba: (v: number) => {
                        if (window) {
                          return false;
                        }
                        return Math.floor(v);
                      },
                      dabb: 1,
                    },
                  },
                  db: {},
                },
              },
              {
                c: {
                  cb: 'cb',
                  ca: function (caFunctionArgument1: unknown, caFunctionArgument2: unknown) {
                    const caConst = 'caConst';
                    if (caFunctionArgument1 === caFunctionArgument2) {
                      return true;
                    }
                    return caConst === 'caConst';
                  },
                },
                a: 1,
                b: 'b',
                d: {
                  db: {},
                  da: {
                    dab: {
                      dabb: 1,
                      daba: (v: number) => {
                        if (window) {
                          return false;
                        }
                        return Math.floor(v);
                      },
                    },
                    daa: {
                      daaa: [],
                    },
                  },
                },
              }
            )
          ).toBe(true);
        });
      });
      describe('not equals', () => {
        test('Objects contains different simple type values should be equals', () => {
          expect(
            isDeepEqual(
              {
                a: 1,
                b: 'ba',
                c: undefined,
                d: null,
              },
              {
                c: undefined,
                a: 1,
                d: null,
                b: 'b',
              }
            )
          ).toBe(false);
        });
        test('objects contains non-simple types different values should be not equal', () => {
          expect(
            isDeepEqual(
              {
                a: 1,
                b: 'b',
                c: {
                  ca: 1,
                  cb: 'cb',
                },
                d: {
                  da: {
                    daa: {
                      daaa: [1],
                    },
                    dab: {
                      daba: {},
                      dabb: 1,
                    },
                  },
                  db: {},
                },
              },
              {
                c: {
                  cb: 'cb',
                  ca: 1,
                },
                a: 1,
                b: 'b',
                d: {
                  db: {},
                  da: {
                    dab: {
                      dabb: 1,
                      daba: {},
                    },
                    daa: {
                      daaa: [2, 1],
                    },
                  },
                },
              }
            )
          ).toBe(false);
        });
        test('objects contains functions with non equal body must be non equal', () => {
          expect(
            isDeepEqual(
              {
                a: 1,
                b: 'b',
                c: {
                  ca: function (caFunctionArgument1: unknown, caFunctionArgument2: unknown) {
                    const caConst = 'caConst';
                    if (caFunctionArgument1 === caFunctionArgument2) {
                      return false;
                    }
                    return caConst === 'caConst';
                  },
                  cb: 'cb',
                },
                d: {
                  da: {
                    daa: {
                      daaa: [],
                    },
                    dab: {
                      daba: (v: number) => {
                        if (window) {
                          return false;
                        }
                        return Math.floor(v);
                      },
                      dabb: 1,
                    },
                  },
                  db: {},
                },
              },
              {
                c: {
                  cb: 'cb',
                  ca: function (caFunctionArgument1: unknown, caFunctionArgument2: unknown) {
                    const caConst = 'caConst';
                    if (caFunctionArgument1 === caFunctionArgument2) {
                      return true;
                    }
                    return caConst === 'caConst';
                  },
                },
                a: 1,
                b: 'b',
                d: {
                  db: {},
                  da: {
                    dab: {
                      dabb: 1,
                      daba: (v: number) => {
                        if (window) {
                          return false;
                        }
                        return Math.floor(v);
                      },
                    },
                    daa: {
                      daaa: [],
                    },
                  },
                },
              }
            )
          ).toBe(false);
        });
      });
    });
    describe('Compare arrays', () => {
      describe('equal', () => {
        test('two empty arrays must be equal', () => {
          expect(isDeepEqual([], [])).toBe(true);
        });
        test('two arrays with simple types equal values must be equal', () => {
          expect(isDeepEqual([1, '2', '', 0, null, undefined], [null, '2', 1, '', 0, undefined])).toBe(true);
        });
        test('two arrays contains functions with a same body must be equal', () => {
          expect(
            isDeepEqual(
              [
                function (this: unknown, a: unknown, b: unknown) {
                  if (a === b) {
                    return this && (this as any).b === 'b';
                  }
                  return Math.floor(1) === Number('ff');
                },
                () => {
                  return typeof window === 'function' && (window as any).console;
                },
              ],
              [
                () => {
                  return typeof window === 'function' && (window as any).console;
                },
                function (this: unknown, a: unknown, b: unknown) {
                  if (a === b) {
                    return this && (this as any).b === 'b';
                  }
                  return Math.floor(1) === Number('ff');
                },
              ]
            )
          ).toBe(true);
        });
        test('arrays contains a non simple same values must be equals', () => {
          expect(
            isDeepEqual(
              [
                1,
                {
                  db: {},
                  da: {
                    dab: {
                      dabb: 1,
                      daba: (v: number) => {
                        if (window) {
                          return false;
                        }
                        return Math.floor(v);
                      },
                    },
                    daa: {
                      daaa: [2, { a: 'a' }],
                    },
                  },
                },
                '3',
                { 4: ['4', '44'] },
              ],
              [
                { 4: ['4', '44'] },
                1,
                {
                  da: {
                    dab: {
                      daba: (v: number) => {
                        if (window) {
                          return false;
                        }
                        return Math.floor(v);
                      },
                      dabb: 1,
                    },
                    daa: {
                      daaa: [{ a: 'a' }, 2],
                    },
                  },
                  db: {},
                },
                '3',
              ]
            )
          ).toBe(true);
        });
      });
      describe('not equal', () => {
        test('two arrays with different length must not be equal', () => {
          expect(isDeepEqual([1, 1], [1])).toBe(false);
        });
        test('two arrays with simple types different values must not be equal', () => {
          expect(isDeepEqual([1, '2', '', '0', null, undefined], [null, '2', 1, '', 0, undefined])).toBe(false);
        });
        test('two arrays contains different functions must not be equal', () => {
          expect(
            isDeepEqual(
              [
                function (this: unknown, a: unknown, b: unknown) {
                  if (a !== b) {
                    return this && (this as any).b === 'b';
                  }
                  return Math.floor(1) === Number('ff');
                },
                () => {
                  return typeof window === 'function' && (window as any).console;
                },
              ],
              [
                () => {
                  return typeof window === 'function' && (window as any).console;
                },
                function (this: unknown, a: unknown, b: unknown) {
                  if (a === b) {
                    return this && (this as any).b === 'b';
                  }
                  return Math.floor(1) === Number('ff');
                },
              ]
            )
          ).toBe(false);
        });
        test('arrays contains a non simple values different must not be equal', () => {
          expect(
            isDeepEqual(
              [
                1,
                {
                  db: {},
                  da: {
                    dab: {
                      dabb: 1,
                      daba: (v: number) => {
                        if (window) {
                          return false;
                        }
                        return Math.floor(v);
                      },
                    },
                    daa: {
                      daaa: [2, { a: 'a' }],
                    },
                  },
                },
                '3',
                { 4: ['4', '44'] },
              ],
              [
                { 4: ['4', '44'] },
                1,
                {
                  da: {
                    dab: {
                      daba: (v: number) => {
                        if (window) {
                          return false;
                        }
                        return Math.floor(v);
                      },
                      dabb: 1,
                    },
                    daa: {
                      daaa: [{ a: 'a' }, 2],
                    },
                  },
                  db: {},
                },
                '4',
              ]
            )
          ).toBe(false);
        });
      });
    });
  });
});
