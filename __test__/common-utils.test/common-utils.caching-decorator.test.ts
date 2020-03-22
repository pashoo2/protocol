import { dataCachingUtilsCachingDecorator as caching } from 'utils/data-cache-utils/data-cache-utils';
import { generateUUID } from 'utils/identity-utils/identity-utils';

const ITERATIONS_COUNT = 60000;
const CACHE_CAPACITY = 200;

export const runTestCachingDecorator = async () => {
  const values: { [k: string]: string } = {};

  let idx = 0;
  while (idx < ITERATIONS_COUNT) {
    values[generateUUID()] = generateUUID();
    idx += 1;
  }

  class CachingDecoratorTestClass {
    @caching(CACHE_CAPACITY)
    async getValue(key: string): Promise<string | undefined> {
      return (values as any)[key];
    }
  }

  const instance = new CachingDecoratorTestClass();
  let iteration = 0;

  idx = 0;
  const keysValues = Object.keys(values);
  let k;

  iteration += 1;
  console.log(`The iteration ${iteration}`);
  while (idx < keysValues.length) {
    k = keysValues[idx];
    if ((await instance.getValue(k)) !== values[k]) {
      console.error(`Value for the key '${k}' is not equals`);
      return;
    }
    idx += 1;
  }
  iteration += 1;
  console.log(`The iteration ${iteration}`);
  idx = Math.ceil(keysValues.length / 2);
  while (idx < keysValues.length) {
    k = keysValues[idx];
    if ((await instance.getValue(k)) !== values[k]) {
      console.error(`Value for the key '${k}' is not equals`);
      return;
    }
    idx += 1;
  }
  iteration += 1;
  console.log(`The iteration ${iteration}`);
  idx = Math.ceil(keysValues.length / 2 + keysValues.length / 4);
  while (idx < keysValues.length) {
    k = keysValues[idx];
    if ((await instance.getValue(k)) !== values[k]) {
      console.error(`Value for the key '${k}' is not equals`);
      return;
    }
    idx += 1;
  }
  iteration += 1;
  console.log(`The iteration ${iteration}`);
  idx = Math.ceil(keysValues.length / 3 + keysValues.length / 5);
  while (idx < keysValues.length) {
    k = keysValues[idx];
    if ((await instance.getValue(k)) !== values[k]) {
      console.error(`Value for the key '${k}' is not equals`);
      return;
    }
    idx += 1;
  }
  iteration += 1;
  console.log(`The iteration ${iteration}`);
  idx = keysValues.length;
  while (idx >= 0) {
    k = keysValues[idx];
    if ((await instance.getValue(k)) !== values[k]) {
      console.error(`Value for the key '${k}' is not equals`);
      return;
    }
    idx -= 1;
  }
  iteration += 1;
  console.log(`The iteration ${iteration}`);
  idx = Math.ceil(keysValues.length / 4 + keysValues.length / 3);
  while (idx >= 0) {
    k = keysValues[idx];
    if ((await instance.getValue(k)) !== values[k]) {
      console.error(`Value for the key '${k}' is not equals`);
      return;
    }
    idx -= 1;
  }
  iteration += 1;
  console.log(`The iteration ${iteration}`);
  idx = Math.ceil(keysValues.length / 4 + keysValues.length / 3);
  while (idx >= 0) {
    k = keysValues[idx];
    if ((await instance.getValue(k)) !== values[k]) {
      console.error(`Value for the key '${k}' is not equals`);
      return;
    }
    idx -= 1;
  }
  console.error('Test for caching decorator succeed');
};
