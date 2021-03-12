import { isDeepEqual, whetherValuesSimilar, whetherValuesNotShallowSimilar } from './common-utils-equality';

describe('common-utils-equality', () => {
  describe('whetherValuesSimilar', () => {
    it('Should return true for NaN values', () => {
      expect(whetherValuesSimilar(NaN, NaN)).toBe(true);
    });

    it('Should return true for null and undefined values', () => {
      expect(whetherValuesSimilar(null, null)).toBe(true);
      expect(whetherValuesSimilar(undefined, undefined)).toBe(true);
      expect(whetherValuesSimilar(undefined, null)).toBe(true);
    });

    it('Should return true for same values', () => {
      let value1 = 0 as unknown;
      let value2 = 0 as unknown;
      expect(whetherValuesSimilar(value1, value2)).toBe(true);

      value1 = 1;
      value2 = 1;
      expect(whetherValuesSimilar(value1, value2)).toBe(true);

      value1 = -1;
      value2 = -1;
      expect(whetherValuesSimilar(value1, value2)).toBe(true);

      value1 = Infinity;
      value2 = Infinity;
      expect(whetherValuesSimilar(value1, value2)).toBe(true);

      value1 = -Infinity;
      value2 = -Infinity;
      expect(whetherValuesSimilar(value1, value2)).toBe(true);

      value1 = '';
      value2 = '';
      expect(whetherValuesSimilar(value1, value2)).toBe(true);

      value1 = 'string';
      value2 = 'string';
      expect(whetherValuesSimilar(value1, value2)).toBe(true);

      value1 = {};
      value2 = value1;
      expect(whetherValuesSimilar(value1, value2)).toBe(true);

      value1 = new Error();
      value2 = value1;
      expect(whetherValuesSimilar(value1, value2)).toBe(true);

      value1 = [];
      value2 = value1;
      expect(whetherValuesSimilar(value1, value2)).toBe(true);

      expect(whetherValuesSimilar(window, window)).toBe(true);
      expect(whetherValuesSimilar(document, document)).toBe(true);
    });

    it('Should return false for different values', () => {
      expect(whetherValuesSimilar({}, {})).toBe(false);
      expect(whetherValuesSimilar([], [])).toBe(false);
      expect(whetherValuesSimilar(new Error(), new Error())).toBe(false);
      expect(whetherValuesSimilar(new Map(), new Map())).toBe(false);
    });

    it('Should return false for null, undefined compared to zero, empty stirng or NaN', () => {
      expect(whetherValuesSimilar(null, 0)).toBe(false);
      expect(whetherValuesSimilar(undefined, 0)).toBe(false);

      expect(whetherValuesSimilar(null, '')).toBe(false);
      expect(whetherValuesSimilar(undefined, '')).toBe(false);

      expect(whetherValuesSimilar(null, NaN)).toBe(false);
      expect(whetherValuesSimilar(undefined, NaN)).toBe(false);
    });

    it('Should return false for zero, empty stirng or NaN in comparition to each other', () => {
      expect(whetherValuesSimilar('', 0)).toBe(false);
      expect(whetherValuesSimilar('', NaN)).toBe(false);
      expect(whetherValuesSimilar(0, NaN)).toBe(false);
    });
  });

  describe('whetherValuesNotShallowSimilar', () => {
    it('Should return false for NaN values', () => {
      expect(whetherValuesNotShallowSimilar(NaN, NaN)).toBe(false);
    });

    it('Should return false for null and undefined values', () => {
      expect(whetherValuesNotShallowSimilar(null, null)).toBe(false);
      expect(whetherValuesNotShallowSimilar(undefined, undefined)).toBe(false);
      expect(whetherValuesNotShallowSimilar(undefined, null)).toBe(false);
    });

    it('Should return false for same values', () => {
      let value1 = 0 as unknown;
      let value2 = 0 as unknown;
      expect(whetherValuesNotShallowSimilar(value1, value2)).toBe(false);

      value1 = 1;
      value2 = 1;
      expect(whetherValuesNotShallowSimilar(value1, value2)).toBe(false);

      value1 = -1;
      value2 = -1;
      expect(whetherValuesNotShallowSimilar(value1, value2)).toBe(false);

      value1 = Infinity;
      value2 = Infinity;
      expect(whetherValuesNotShallowSimilar(value1, value2)).toBe(false);

      value1 = -Infinity;
      value2 = -Infinity;
      expect(whetherValuesNotShallowSimilar(value1, value2)).toBe(false);

      value1 = '';
      value2 = '';
      expect(whetherValuesNotShallowSimilar(value1, value2)).toBe(false);

      value1 = 'string';
      value2 = 'string';
      expect(whetherValuesNotShallowSimilar(value1, value2)).toBe(false);

      value1 = {};
      value2 = value1;
      expect(whetherValuesNotShallowSimilar(value1, value2)).toBe(false);

      value1 = new Error();
      value2 = value1;
      expect(whetherValuesNotShallowSimilar(value1, value2)).toBe(false);

      value1 = [];
      value2 = value1;
      expect(whetherValuesNotShallowSimilar(value1, value2)).toBe(false);

      expect(whetherValuesNotShallowSimilar(window, window)).toBe(false);
      expect(whetherValuesNotShallowSimilar(document, document)).toBe(false);
    });

    it('Should return false for different values but which can be simillar by deep comparsion', () => {
      expect(whetherValuesNotShallowSimilar({}, {})).toBe(false);
      expect(whetherValuesNotShallowSimilar([], [])).toBe(false);
      expect(whetherValuesNotShallowSimilar(new Error(), new Error())).toBe(false);
      expect(whetherValuesNotShallowSimilar(new Map(), new Map())).toBe(false);
    });

    it('Should return false for null, undefined compared to zero, empty stirng or NaN', () => {
      expect(whetherValuesNotShallowSimilar(null, 0)).toBe(false);
      expect(whetherValuesNotShallowSimilar(undefined, 0)).toBe(false);

      expect(whetherValuesNotShallowSimilar(null, '')).toBe(false);
      expect(whetherValuesNotShallowSimilar(undefined, '')).toBe(false);

      expect(whetherValuesNotShallowSimilar(null, NaN)).toBe(false);
      expect(whetherValuesNotShallowSimilar(undefined, NaN)).toBe(false);
    });

    it('Should return false for zero, empty stirng or NaN in comparition to each other', () => {
      expect(whetherValuesNotShallowSimilar('', 0)).toBe(false);
      expect(whetherValuesNotShallowSimilar('', NaN)).toBe(false);
      expect(whetherValuesNotShallowSimilar(0, NaN)).toBe(false);
    });
  });

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
