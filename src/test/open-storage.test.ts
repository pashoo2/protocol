import { isEqualArrayBufferNative } from './../utils/typed-array-utils';
import { assert } from 'chai';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { STORAGE_PROVIDERS_NAME } from './../classes/storage-providers/storage-providers.const';
import { OpenStorage } from './../classes/open-storage/open-storage';
import { expect } from 'chai';

const configuration = {
  options: {
    dbName: 'database_1',
  },
  storageProviderName: STORAGE_PROVIDERS_NAME.LOCAL_FORAGE,
};
const configuration2 = {
  options: {
    dbName: 'database_2',
  },
  storageProviderName: STORAGE_PROVIDERS_NAME.LOCAL_FORAGE,
};

export function runTestOpenStorageTest() {
  describe('OpenStorage tests', async () => {
    const Context: any = {};

    it('constructor test', () => {
      expect(() => new OpenStorage()).to.not.throws();
    });
    it('connect method with no arguments should not throw', async () => {
      const openStorage = new OpenStorage();

      await expect(openStorage.connect()).to.eventually.not.to.be.an('error');
    });
    it('connect method with local forage provider should not throw', async () => {
      const openStorage = new OpenStorage();

      await expect(
        openStorage.connect(configuration)
      ).to.eventually.not.to.be.an('error');
      expect(openStorage.isActive).to.be.equal(true);
      expect(openStorage.isBufferSupported).to.be.equal(true);
      Context.openStorageConnection = openStorage;
    });
    describe('test open storage methods', async () => {
      const key = '!@#$%%^^&&*&()*)(,./';
      const value = '12323)_*$*#&$!_$#&*#(@&,.*/-*+"';
      const valueBuff = new TextEncoder().encode(value);
      const key2 = `!@#$%%^^&&*&()*)(,./fdsfjajkewpfjioghnd fvjjf ij iopfgerpi - 0i-0t9ui =049u `;
      const value2 =
        '12323)_*$*#&$!_$#&*#(@&,.*/-*+" dlmfs 43- fklgkf ----------------------------------';
      const value2Buff = new TextEncoder().encode(value2);

      it('set method with local forage provider should not return error', async () => {
        expect(Context.openStorageConnection).to.be.an.instanceof(OpenStorage);

        const openStorageConnection = Context.openStorageConnection as OpenStorage;

        await expect(
          openStorageConnection.set(key, value)
        ).to.not.eventually.be.an('Error');
        await expect(
          openStorageConnection.set(key2, value2)
        ).to.not.eventually.be.an('Error');
      });
      it('get method with local forage provider should return a values stored before', async () => {
        expect(Context.openStorageConnection).to.be.an.instanceof(OpenStorage);

        const openStorageConnection = Context.openStorageConnection as OpenStorage;

        await expect(openStorageConnection.get(key)).to.not.eventually.be.an(
          'Error'
        );
        assert(
          (await openStorageConnection.get(key)) === value,
          'the value stored previousely must be returned for the same key'
        );
        assert(
          (await openStorageConnection.get(key2)) === value2,
          'the value2 stored previousely must be returned for the same key'
        );
      });
      it('get method with local forage provider but another database name should not return a values stored before with another database name', async () => {
        const openStorageConnection = new OpenStorage();

        await expect(
          openStorageConnection.connect(configuration2)
        ).to.eventually.not.to.be.an('error');
        expect(openStorageConnection.isActive).to.be.equal(true);
        expect(openStorageConnection.isBufferSupported).to.be.equal(true);

        await expect(openStorageConnection.get(key)).to.not.eventually.be.an(
          'Error'
        );
        assert(
          (await openStorageConnection.get(key)) === undefined,
          'the value stored previousely must not return for the same key if a database name is different'
        );
        assert(
          (await openStorageConnection.get(key2)) === undefined,
          'the value2 stored previousely must not return for the same key if a database name is different'
        );
      });
      it('setUInt8Array method with local forage provider should not return error', async () => {
        expect(Context.openStorageConnection).to.be.an.instanceof(OpenStorage);

        const openStorageConnection = Context.openStorageConnection as OpenStorage;

        await expect(
          openStorageConnection.setUInt8Array(key, valueBuff)
        ).to.not.eventually.be.an('Error');
        await expect(
          openStorageConnection.setUInt8Array(key2, value2Buff)
        ).to.not.eventually.be.an('Error');
      });
      it('getUInt8Array method with local forage provider should return a values stored before', async () => {
        expect(Context.openStorageConnection).to.be.an.instanceof(OpenStorage);

        const openStorageConnection = Context.openStorageConnection as OpenStorage;

        await expect(
          openStorageConnection.getUInt8Array(key)
        ).to.not.eventually.be.an('Error');

        const valueForKey = await openStorageConnection.getUInt8Array(key);

        expect(valueForKey).not.to.be.an('Error');
        expect(valueForKey).not.to.be.equal(undefined);
        assert(
          isEqualArrayBufferNative(valueForKey as Uint8Array, valueBuff),
          'the value stored previousely must be returned for the same key'
        );

        const valueForKey2 = await openStorageConnection.getUInt8Array(key2);

        expect(valueForKey2).not.to.be.an('Error');
        expect(valueForKey2).not.to.be.equal(undefined);
        assert(
          isEqualArrayBufferNative(valueForKey2 as Uint8Array, value2Buff),
          'the value2 stored previousely must be returned for the same key'
        );
      });
      it('getUInt8Array method with local forage provider but another database name should not return a values stored before with another database name', async () => {
        const openStorageConnection = new OpenStorage();

        await expect(
          openStorageConnection.connect(configuration2)
        ).to.eventually.not.to.be.an('error');
        expect(openStorageConnection.isActive).to.be.equal(true);
        expect(openStorageConnection.isBufferSupported).to.be.equal(true);

        await expect(openStorageConnection.get(key)).to.not.eventually.be.an(
          'Error'
        );
        assert(
          (await openStorageConnection.getUInt8Array(key)) === undefined,
          'the value stored previousely must be not returned for the same key if a database name is different'
        );
        assert(
          (await openStorageConnection.getUInt8Array(key2)) === undefined,
          'the value2 stored previousely must not be returned for the same key if a database name is different'
        );
      });
      it('disconnect method with local forage provider should not throw and flags must be set to false', async () => {
        expect(Context.openStorageConnection).to.be.an.instanceof(OpenStorage);

        const openStorageConnection = Context.openStorageConnection as OpenStorage;

        await expect(
          openStorageConnection.disconnect()
        ).to.eventually.not.be.an('error');
        expect(openStorageConnection.isActive).to.be.equal(false);
        expect(openStorageConnection.isBufferSupported).to.be.equal(false);
      });
    });
  });
}
