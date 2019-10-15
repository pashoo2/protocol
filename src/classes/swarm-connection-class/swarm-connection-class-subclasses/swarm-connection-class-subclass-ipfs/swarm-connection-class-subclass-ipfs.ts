/* global window.Ipfs */
import { ISwarmConnectionSubclass } from 'classes/swarm-connection-class/swarm-connection-class.types';
import {
  SWARM_CONNECTION_SUBCLASS_IPFS_CDN_SCRIPT_URL,
  SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DEFALT,
} from './swarm-connection-class-subclass-ipfs.const';
import { lazyLoadScript } from 'utils/lazy-loading-utils/lazy-loading-utils';
import { TIPFSPubsubMessage } from './swarm-connection-class-subclass-ipfs.types';

export class SwarmConnectionSubclassIPFS implements ISwarmConnectionSubclass {
  protected async preloadScriptFromCDN(): Promise<Error | boolean> {
    const scriptLoading = await lazyLoadScript(
      SWARM_CONNECTION_SUBCLASS_IPFS_CDN_SCRIPT_URL
    );

    if (scriptLoading instanceof Error) {
      console.error(
        `Failed to load the IPFS main script from the source ${SWARM_CONNECTION_SUBCLASS_IPFS_CDN_SCRIPT_URL}`
      );
      return scriptLoading;
    }
    if (!(window as any).Ipfs) {
      return new Error(
        'There is no IPFS was found on the window global variable'
      );
    }

    const { Ipfs } = window as any;
    const connection = await Ipfs.create(
      SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DEFALT
    );

    console.warn('IPFS node config');
    console.warn(SWARM_CONNECTION_SUBCLASS_IPFS_CONFIG_DEFALT);
    await connection.ready;

    const topic = 'topic--1111---11';
    const Buffer = Ipfs.Buffer;
    const nodeId = connection._peerInfo.id._idB58String;
    const msg = new Buffer.from('bannana');
    connection.pubsub.subscribe(
      topic,
      (message: TIPFSPubsubMessage): void => {
        if (message.from !== nodeId) {
          console.warn(message);
        }
      },
      {
        discover: true,
      },
      (err?: Error) => {
        if (err) {
          console.error(err);
        } else {
          console.warn('Connected to pubsub');
        }
      }
    );
    setInterval(() => {
      connection.pubsub.publish(topic, msg, (err?: Error) => {
        if (err) {
          return console.error(`failed to publish to ${topic}`, err);
        }
        // msg was broadcasted
        console.log(`published to ${topic}`);
      });
    }, 500);

    debugger;
    return true;
  }

  public async connect(): Promise<boolean | Error> {
    const scriptLoadingResult = await this.preloadScriptFromCDN();

    if (scriptLoadingResult instanceof Error) {
      console.error(scriptLoadingResult);
      return new Error('Failed to preload the IPFS library');
    }
    return true;
  }
}
