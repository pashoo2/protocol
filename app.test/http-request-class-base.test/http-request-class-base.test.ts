import { expect } from 'chai';
import HttpRequest from 'classes/basic-classes/http-request-class-base/http-request-class-base';
import { HTTP_REQUEST_MODE } from 'classes/basic-classes/http-request-class-base/http-request-class-base.const';
import { CONST_VALIDATION_VALUES_MESSAGING_MAX_ERROR_SECONDS } from 'const/const-validation-values/const-validation-values-messaging-date';

export function runTestHttpRequest() {
  describe('test HttpRequest class', async () => {
    it('check rejected cause CORS response from google.com', async () => {
      const req = new HttpRequest({
        url: 'http://google.com',
      });

      expect(req).to.be.an.instanceof(HttpRequest);
      await expect(req.send()).to.eventually.be.an('error');
    });

    it('check tuple response should return undefined from google.com', async () => {
      const req = new HttpRequest({
        url: 'google.com',
        mode: HTTP_REQUEST_MODE.NO_CORS,
      });

      expect(req).to.be.an.instanceof(HttpRequest);
      await expect(req.send()).to.eventually.be.equal(undefined);
    });

    it('check json response from http://worldclockapi.com/api/json/utc/now', async () => {
      const req = new HttpRequest({
        url: '/api/json/utc/now',
        baseUrl: 'worldclockapi.com',
      });

      expect(req).to.be.an.instanceof(HttpRequest);

      const res = await req.send();
      expect(res).to.have.property('currentDateTime');
    }).timeout(CONST_VALIDATION_VALUES_MESSAGING_MAX_ERROR_SECONDS * 1000);

    it('check json response from http://worldtimeapi.org/api/ip', async () => {
      const req = new HttpRequest({
        url: 'http://worldtimeapi.org/api/ip',
      });

      expect(req).to.be.an.instanceof(HttpRequest);

      const res = await req.send();
      expect(res).to.have.property('utc_datetime');
    }).timeout(CONST_VALIDATION_VALUES_MESSAGING_MAX_ERROR_SECONDS * 1000);

    it('check Image response from https://i.imgur.com/vObKmsP.png', async () => {
      const req = new HttpRequest({
        url: 'https://i.imgur.com/vObKmsP.png',
      });

      expect(req).to.be.an.instanceof(HttpRequest);

      const res = await req.send();

      expect(res).to.be.a('File');
      expect(res.type).to.be.equal('image/png');
      expect(() => console.log(URL.createObjectURL(res))).to.not.throw();
    }).timeout(CONST_VALIDATION_VALUES_MESSAGING_MAX_ERROR_SECONDS * 1000);
  });
}
