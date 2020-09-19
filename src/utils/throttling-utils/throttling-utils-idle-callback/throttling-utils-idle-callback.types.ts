export interface RequestIdleCallbackArgument {
  didTimeout?: boolean;
  timeRemaining?(): number;
}

export interface RequestIdleCallbackOptions {
  timeout?: number;
}

export type RequestIdleCallbackId = number;

export interface RequestIdleCallback {
  (
    cb: (deadline: RequestIdleCallbackArgument) => any,
    options?: RequestIdleCallbackOptions
  ): RequestIdleCallbackId;
}

export interface CancelRequestIdleCallback {
  (id: RequestIdleCallbackId): void;
}
