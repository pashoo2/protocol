import { expect } from 'chai';
import HttpRequest from 'classes/basic-classes/http-request-class-base/http-request-class-base';

export function runTestHttpRequest() {
    describe('test HttpRequest class', async () => {
        it('check a response from google.com', async () => {
            const req = new HttpRequest({});

            expect(req).to.be.an.instanceof(HttpRequest);
        })
    });
}