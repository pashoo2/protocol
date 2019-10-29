/* global mocha */
/* global chai */
import { lazyLoadScript } from 'utils/lazy-loading-utils/lazy-loading-utils';
import Mocha from 'mocha';
import Chai from 'chai';

export async function initializeMochaChai() {
    const mochaNode = document.createElement('div');
    
    mochaNode.id = "mocha";
    document.body.prepend(mochaNode);
    try {
        await lazyLoadScript("https://unpkg.com/mocha/mocha.js");
    } catch(err) {
        console.error('Failed to load Mocha from cdn');
        return err;
    }
    try {
        await lazyLoadScript('https://unpkg.com/chai/chai.js');
    } catch(err) {
        console.error('Failed to load Chai from cdn');
        return err;
    }

    const mochaSetupScript = document.createElement('script');

    mochaSetupScript.type = 'text/javascript';
    mochaSetupScript.className = "mocha-init";
    mochaSetupScript.innerHTML = `
        mocha.setup('bdd');
        mocha.checkLeaks();
    `;
    document.body.append(mochaSetupScript);
}

type TCallbackMochaChaiRun = (failures: number) => void

export function runMochaChai(cb?: TCallbackMochaChaiRun) {
    // it's necessary to disable
    // error overlay to run test
    // with mocha
    const hideErrorFrameStyle = document.createElement('style');

    hideErrorFrameStyle.type = 'text/css';
    hideErrorFrameStyle.innerHTML = `
        body > iframe {
            display: none;
        }
    `;
    document.head.appendChild(hideErrorFrameStyle);
    mocha.run(cb);
}