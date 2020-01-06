import { expect } from 'chai';
import { CentralAuthorityStorageCurrentUserCredentials } from './../classes/central-authority-class/central-authority-storage-local/central-authority-storage-current-user-auth/central-authority-storage-current-user-credentials/central-authority-storage-current-user-credentials';

const credentials1 = {
  login: 'test1',
  password: '123456',
};
const credentials2 = {
  login: 'test2',
  password: 'abcdefg',
};

export const runTestAuthorityStorageCurrentUser = () => {
  describe('Test of the class CentralAuthorityStorageCurrentUserCredentials', () => {
    it('Check constructor', async () => {
      expect(
        () => new CentralAuthorityStorageCurrentUserCredentials()
      ).not.to.throw();
    });
    it('Check connect not to throw', async () => {
      const caStorage = new CentralAuthorityStorageCurrentUserCredentials();

      await expect(
        caStorage.connect({
          credentials: credentials1,
        })
      ).not.to.eventually.throw();
    });
    describe('Check ', async () => {
      let connection: CentralAuthorityStorageCurrentUserCredentials;

      beforeEach(async () => {
        connection = new CentralAuthorityStorageCurrentUserCredentials();

        connection.connect({
          credentials: credentials1,
        });
      });

      it('Check set credentials in storage', async () => {});
      it('Check get credentials from storage', async () => {});
      it('Check get credentials from storage by another account', async () => {});
      it('Check unset credentials in storage', async () => {});
    });
  });
};
