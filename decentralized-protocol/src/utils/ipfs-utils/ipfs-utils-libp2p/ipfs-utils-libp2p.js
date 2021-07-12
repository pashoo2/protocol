import * as Libp2p from 'libp2p';
import * as KadDHT from 'libp2p-kad-dht';
import * as TCP from 'libp2p-tcp';
import * as WS from 'libp2p-websockets';
import * as SPDY from 'libp2p-spdy';
import * as MPLEX from 'pull-mplex';
import * as SECIO from 'libp2p-secio';
import * as WRTCStar from 'libp2p-webrtc-star';
import * as Bootstrap from 'libp2p-bootstrap';
import * as PubSubGossip from 'libp2p-gossipsub';
import DelegatedPeerRouter from 'libp2p-delegated-peer-routing';
import DelegatedContentRouter from 'libp2p-delegated-content-routing';
import multiaddr from 'multiaddr';
import { DELEGATE_CONTENT_ROUTER, DELEGATE_PEER_ROUTER, WEB_RTC_STAR_SERVER } from './ipfs-utils-libp2p.const';
const upgrader = {
    upgradeInbound: (maConn) => maConn,
    upgradeOutbound: (maConn) => maConn,
};
export const getLibPeerToPeer = (opts) => {
    const peerInfo = opts.peerInfo;
    const peerBook = opts.peerBook;
    const bootstrapList = opts.config.Bootstrap;
    peerInfo.multiaddrs.add(multiaddr(`/ip4/${WEB_RTC_STAR_SERVER.host}/tcp/${WEB_RTC_STAR_SERVER.port}/ws/p2p-webrtc-star`));
    const delegatePeerRouter = new DelegatedPeerRouter(DELEGATE_PEER_ROUTER);
    const delegateContentRouter = new DelegatedContentRouter(peerInfo.id, DELEGATE_CONTENT_ROUTER);
    return new Libp2p({
        peerInfo,
        peerBook,
        switch: {
            denyTTL: 2 * 60 * 1e3,
            denyAttempts: 5,
            maxParallelDials: 100,
            maxColdCalls: 25,
            dialTimeout: 20e3,
        },
        connectionManager: {
            minPeers: 25,
            maxPeers: 100,
            pollInterval: 5000,
        },
        modules: {
            transport: [
                TCP,
                WS,
                WRTCStar,
            ],
            peerDiscovery: [Bootstrap],
            streamMuxer: [MPLEX, SPDY],
            connEncryption: [SECIO],
            dht: KadDHT,
            pubsub: PubSubGossip,
            contentRouting: [delegateContentRouter],
            peerRouting: [delegatePeerRouter],
        },
        config: {
            peerDiscovery: {
                autoDial: true,
                bootstrap: {
                    list: bootstrapList,
                },
                webRTCStar: {
                    enabled: true,
                },
            },
            transport: {
                WebRTCStar: {
                    interval: 1000,
                    enabled: true,
                    id: peerInfo.id,
                    upgrader,
                },
            },
            relay: {
                enabled: true,
                hop: {
                    enabled: true,
                    active: true,
                },
            },
            dht: {
                enabled: true,
                kBucketSize: 20,
                concurrency: 5,
                randomWalk: {
                    queriesPerPeriod: 2,
                    enabled: true,
                    interval: 10e3,
                    timeout: 2e3,
                },
            },
            pubsub: {
                enabled: true,
                emitSelf: true,
                signMessages: false,
                strictSigning: false,
            },
        },
    }, peerInfo);
};
//# sourceMappingURL=ipfs-utils-libp2p.js.map