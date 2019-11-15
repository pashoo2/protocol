/* global mocha */
import { lazyLoadScript } from 'utils/lazy-loading-utils/lazy-loading-utils';
import Mocha from 'mocha';
import chai from 'chai';
import chaiAsPromised from "chai-as-promised";

const MOCHA_CDN_URL = 'https://cdnjs.cloudflare.com/ajax/libs/mocha/6.2.1/mocha.min.js';

export async function initializeMocha() {
    const mochaNode = document.createElement('div');
    
    mochaNode.id = "mocha";
    document.body.prepend(mochaNode);
    try {
        await lazyLoadScript(MOCHA_CDN_URL);
    } catch(err) {
        console.error('Failed to load Mocha from cdn');
        return err;
    }

    const mochaSetupScript = document.createElement('script');

    mochaSetupScript.type = 'text/javascript';
    mochaSetupScript.className = "mocha-init";
    mochaSetupScript.innerHTML = `
        mocha.setup({
            ui: 'bdd',
            globals: ['globalThis']
        });
        mocha.checkLeaks();
    `;
    document.body.append(mochaSetupScript);
    chai.use(chaiAsPromised);
}

type TCallbackMochaRun = (failures: number) => void

export function runMocha(
    showErrorsOverlay: boolean = true,
    cb?: TCallbackMochaRun,
) {
    // it's necessary to disable
    // error overlay to run test
    // with mocha
    if (!showErrorsOverlay) {
        const hideErrorFrameStyle = document.createElement('style');

        hideErrorFrameStyle.type = 'text/css';
        hideErrorFrameStyle.innerHTML = `
            body > iframe {
                display: none;
            }
        `;
        document.head.appendChild(hideErrorFrameStyle);
    }
    mocha.run(cb);
}