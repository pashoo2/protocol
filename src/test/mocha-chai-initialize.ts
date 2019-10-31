/* global mocha */
import { lazyLoadScript } from 'utils/lazy-loading-utils/lazy-loading-utils';
import Mocha from 'mocha';
import chai from 'chai';
import chaiAsPromised from "chai-as-promised";

export async function initializeMocha() {
    const mochaNode = document.createElement('div');
    
    mochaNode.id = "mocha";
    document.body.prepend(mochaNode);
    try {
        await lazyLoadScript("https://unpkg.com/mocha/mocha.js");
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

export function runMocha(showErrorsOverlay: boolean = true, cb?: TCallbackMochaRun) {
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