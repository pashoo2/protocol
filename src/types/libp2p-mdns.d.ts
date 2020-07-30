/** Declaration file generated by dts-gen */
/* eslint-disable */

declare module 'libp2p-mdns' {
  export = libp2p_mdns;

  class libp2p_mdns {
    constructor(...args: any[]);

    start(...args: any[]): void;

    stop(...args: any[]): void;

    static defaultMaxListeners: number;

    static init(): void;

    static listenerCount(emitter: any, type: any): any;

    static once(emitter: any, name: any): any;

    static tag: string;

    static usingDomains: boolean;
  }

  namespace libp2p_mdns {
    class EventEmitter {
      constructor();

      addListener(type: any, listener: any): any;

      emit(type: any, args: any): any;

      eventNames(): any;

      getMaxListeners(): any;

      listenerCount(type: any): any;

      listeners(type: any): any;

      off(type: any, listener: any): any;

      on(type: any, listener: any): any;

      once(type: any, listener: any): any;

      prependListener(type: any, listener: any): any;

      prependOnceListener(type: any, listener: any): any;

      rawListeners(type: any): any;

      removeAllListeners(type: any, ...args: any[]): any;

      removeListener(type: any, listener: any): any;

      setMaxListeners(n: any): any;

      static EventEmitter: any;

      static defaultMaxListeners: number;

      static init(): void;

      static listenerCount(emitter: any, type: any): any;

      static once(emitter: any, name: any): any;

      static usingDomains: boolean;
    }
  }
}