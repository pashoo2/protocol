import { expect } from 'chai';
import { normalizeUrl } from 'utils/common-utils/common-utils-url';

export const runTestCommonUtilsURL = () => {
  describe('Test common-utils-url', () => {
    describe('normalizeUrl function tets', () => {
      it('normalizeUrl should not throw', () => {
        expect(() => normalizeUrl(undefined as any)).to.not.throw();
        expect(() => normalizeUrl(0 as any)).to.not.throw();
        expect(() => normalizeUrl({} as any)).to.not.throw();
        expect(() => normalizeUrl('gg')).to.not.throw();
      });
      it('normalizeUrl protocol normalize', () => {
        expect(normalizeUrl('test.com')).to.equal('https://test.com');
        expect(normalizeUrl('www.test.com')).to.equal('https://test.com');
        expect(normalizeUrl('https://test.com')).to.equal('https://test.com');
        expect(normalizeUrl('http://test.com')).to.equal('http://test.com');
      });
      it('normalizeUrl sort query', () => {
        expect(normalizeUrl('https://www.test.com?b=2&a=1')).to.equal(
          'https://test.com/?a=1&b=2'
        );
        expect(normalizeUrl('http://www.test.com?2=2&1=1')).to.equal(
          'http://test.com/?1=1&2=2'
        );
      });
    });
  });
};
