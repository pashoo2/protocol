import { whetherTwoMapsSimilar } from './common-utils-maps';

describe('Common utilities for maps', () => {
  describe('whetherTwoMapsSimilar', () => {
    it('Should return true for empty maps', () => {
      expect(whetherTwoMapsSimilar(new Map(), new Map())).toBe(true);
    });

    it('Should return true for maps with undefiled and null', () => {
      const firstMap = new Map();
      const secondMap = new Map();
      const key = 'key';

      firstMap.set(key, undefined);
      secondMap.set(key, undefined);
      expect(whetherTwoMapsSimilar(firstMap, secondMap)).toBe(true);

      firstMap.set(key, null);
      secondMap.set(key, null);
      expect(whetherTwoMapsSimilar(firstMap, secondMap)).toBe(true);

      firstMap.set(key, null);
      secondMap.set(key, undefined);
      expect(whetherTwoMapsSimilar(firstMap, secondMap)).toBe(true);
    });

    it('Should return false for maps with undefiled or null and zero', () => {
      const firstMap = new Map();
      const secondMap = new Map();
      const key = 'key';

      firstMap.set(key, undefined);
      secondMap.set(key, 0);
      expect(whetherTwoMapsSimilar(firstMap, secondMap)).toBe(false);

      firstMap.set(key, null);
      secondMap.set(key, 0);
      expect(whetherTwoMapsSimilar(firstMap, secondMap)).toBe(false);
    });

    it('Should return true for maps with same strings', () => {
      const firstMap = new Map();
      const secondMap = new Map();
      let key = 'key';
      let value = 'value' as unknown;

      firstMap.set(key, value);
      secondMap.set(key, value);
      expect(whetherTwoMapsSimilar(firstMap, secondMap)).toBe(true);

      key = 'key1';
      value = 1;
      firstMap.set(key, value);
      secondMap.set(key, value);
      expect(whetherTwoMapsSimilar(firstMap, secondMap)).toBe(true);

      key = 'key2';
      value = {};
      firstMap.set(key, value);
      secondMap.set(key, value);
      expect(whetherTwoMapsSimilar(firstMap, secondMap)).toBe(true);

      key = 'key3';
      value = NaN;
      firstMap.set(key, value);
      secondMap.set(key, value);
      expect(whetherTwoMapsSimilar(firstMap, secondMap)).toBe(true);

      key = 'key4';
      value = Infinity;
      firstMap.set(key, value);
      secondMap.set(key, value);
      expect(whetherTwoMapsSimilar(firstMap, secondMap)).toBe(true);

      key = 'key5';
      value = new Error();
      firstMap.set(key, value);
      secondMap.set(key, value);
      expect(whetherTwoMapsSimilar(firstMap, secondMap)).toBe(true);
    });

    it('Should return false for maps with string and number similar', () => {
      const firstMap = new Map();
      const secondMap = new Map();
      let key = 'key';
      let valueString = '';
      let valueNumeric = 0;

      firstMap.set(key, valueString);
      secondMap.set(key, valueNumeric);
      expect(whetherTwoMapsSimilar(firstMap, secondMap)).toBe(false);

      key = 'key1';
      valueString = '0';
      valueNumeric = 0;

      firstMap.set(key, valueString);
      secondMap.set(key, valueNumeric);
      expect(whetherTwoMapsSimilar(firstMap, secondMap)).toBe(false);

      key = 'key2';
      valueString = '100';
      valueNumeric = 100;

      firstMap.set(key, valueString);
      secondMap.set(key, valueNumeric);
      expect(whetherTwoMapsSimilar(firstMap, secondMap)).toBe(false);

      key = 'key3';
      valueString = '100.11';
      valueNumeric = 100.11;

      firstMap.set(key, valueString);
      secondMap.set(key, valueNumeric);
      expect(whetherTwoMapsSimilar(firstMap, secondMap)).toBe(false);
    });

    it('Should return true for maps which contains different keys but keys which are not presented in one of them equals to null or undefined', () => {
      const firstMapValues = { key1: 'key2', key2: 100, key3: new Error(), key4: null, key5: NaN };
      const secondMapValues = { ...firstMapValues, key6: null, key7: undefined };
      const firstMap = new Map(Object.entries(firstMapValues));
      const secondMap = new Map(Object.entries(secondMapValues));

      expect(whetherTwoMapsSimilar(firstMap, secondMap)).toBe(true);
    });

    it('Should return false for maps which contains different keys but keys which are not presented in one of them equals to NaN', () => {
      const firstMapValues = { key1: 'key2', key2: 100, key3: new Error(), key4: null, key5: NaN };
      const secondMapValues = { ...firstMapValues, key6: NaN };
      const firstMap = new Map(Object.entries(firstMapValues));
      const secondMap = new Map(Object.entries(secondMapValues));

      expect(whetherTwoMapsSimilar(firstMap, secondMap)).toBe(false);
    });

    it('Should not call comparator callback if the map has different values', () => {
      const comparator = jest.fn();
      const commonMapValues = { key1: 'key2', key2: 100, key3: new Error(), key4: null, key5: NaN };
      const firstMapValues = { ...commonMapValues, key6: 9, key8: '1' };
      const secondMapValues = { ...commonMapValues, key6: NaN, key7: null, key8: 0, key9: undefined, key10: '2' };
      const firstMap = new Map(Object.entries(firstMapValues));
      const secondMap = new Map(Object.entries(secondMapValues));

      whetherTwoMapsSimilar(firstMap, secondMap, comparator);
      expect(comparator).toBeCalledTimes(0);
    });

    it('Should call comparator callback for each key both of the Maps that have not a similar values', () => {
      const comparator = jest.fn(() => true);
      const commonMapValues = { key1: 'key2', key2: 100, key3: new Error(), key4: null, key5: NaN };
      const firstMapValues = { ...commonMapValues, key6: 0, key8: '' };
      const secondMapValues = { ...commonMapValues, key6: NaN, key7: null, key8: 0, key9: undefined, key10: '' };
      const firstMap = new Map(Object.entries(firstMapValues));
      const secondMap = new Map(Object.entries(secondMapValues));

      whetherTwoMapsSimilar(firstMap, secondMap, comparator);
      expect(comparator).toBeCalledWith(firstMapValues['key6'], secondMapValues['key6'], 'key6');
      expect(comparator).toBeCalledWith(firstMapValues['key8'], secondMapValues['key8'], 'key8');
      expect(comparator).toBeCalledWith(undefined, secondMapValues['key10'], 'key10');
      expect(comparator).toBeCalledTimes(3);
    });

    it('Should interrupt execution if the comparator callback returns false', () => {
      const comparator = jest.fn(() => false);
      const commonMapValues = { key1: 'key2', key2: 100, key3: new Error(), key4: null, key5: NaN };
      const firstMapValues = { ...commonMapValues, key6: 0, key8: '' };
      const secondMapValues = { ...commonMapValues, key6: NaN, key7: null, key8: 0, key9: undefined, key10: '' };
      const firstMap = new Map(Object.entries(firstMapValues));
      const secondMap = new Map(Object.entries(secondMapValues));

      whetherTwoMapsSimilar(firstMap, secondMap, comparator);
      expect(comparator).toBeCalledTimes(1);
    });
  });
});
