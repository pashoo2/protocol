import { expect, assert } from 'chai';
import { SwarmStoreConnectorOrbitDB } from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db';
import { SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE } from './swarm-storage-orbit-db.test.const';
import { SWARM_CONNECTION_OPTIONS } from 'test/ipfs-swarm-connection.test/ipfs-swarm-connection.const';
import { SwarmConnection } from 'classes/swarm-connection-class/swarm-connection-class';
import { IPFS } from 'types/ipfs.types';
import ipfs from 'ipfs';

export const runTestSwarmStoreOrbitDBConnection = async () => {
    describe('swarm connection:: ipfs', () => {
        let ipfsConnection: IPFS | undefined;

        beforeEach(async function () {
            this.timeout(60000);
            const swarmConnection = new SwarmConnection();

            expect(swarmConnection).to.be.an.instanceof(SwarmConnection);
            await assert.becomes(swarmConnection.connect(SWARM_CONNECTION_OPTIONS), true, '');
            expect(swarmConnection.isConnected).to.equal(true);

            ipfsConnection = swarmConnection.getNativeConnection();

            expect(ipfsConnection).to.be.an.instanceof(ipfs);
        });


        it('create swarm store OrbitDB connector', async () => {
            expect(ipfsConnection).to.be.an.instanceof(ipfs);

            const connection = new SwarmStoreConnectorOrbitDB(SWARM_STORE_CONNECTOR_TEST_CONNECTION_OPTIONS_ONE_DATABASE);

            expect(connection).to.be.an.instanceof(SwarmStoreConnectorOrbitDB);
            expect(connection.connect).to.be.a('function');
            await expect(connection.connect({
                ipfs: ipfsConnection!,
            })).to.be.not.eventually.an.instanceof(Error);
            debugger;
        }).timeout(60000);
    })
};