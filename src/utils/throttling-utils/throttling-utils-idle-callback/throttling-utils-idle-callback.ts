import { THROTTLING_UTILS_IDLE_CALLBACK_TIMEOUT_DEFAULT_MS } from './throttling-utils-idle-callback.const';
import {
  RequestIdleCallback,
  CancelRequestIdleCallback,
  RequestIdleCallbackArgument,
} from './throttling-utils-idle-callback.types';

export const getRequestIdleCallback = (): RequestIdleCallback =>
  (window as any).requestIdleCallback ||
  function(cb) {
    return setTimeout(function() {
      const start = Date.now();
      cb({
        didTimeout: false,
        timeRemaining: function() {
          return Math.max(0, 50 - (Date.now() - start));
        },
      });
    }, 1);
  };

export const getCancelRequestIdleCallback = (): CancelRequestIdleCallback =>
  (window as any).cancelIdleCallback ||
  function(id: number) {
    clearTimeout(id);
  };

export const resolveOnIdleCallback = (
  timeoutMs: number = THROTTLING_UTILS_IDLE_CALLBACK_TIMEOUT_DEFAULT_MS
): Promise<{
  timeRemaining: number;
  didTimeout: boolean;
}> =>
  new Promise((res) => {
    const requestIdleCallback = getRequestIdleCallback();
    const idleCallback = requestIdleCallback(
      (e: RequestIdleCallbackArgument) => {
        const timeRemaining = Number(e.timeRemaining && e.timeRemaining());
        res({
          timeRemaining,
          didTimeout: !!e.didTimeout,
        });
        getCancelRequestIdleCallback()(idleCallback);
      },
      { timeout: timeoutMs }
    );
  });
