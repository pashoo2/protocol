export const timeout = (timeoutMs: number, error?: Error): Promise<Error> =>
  new Promise((res, rej) => {
    setTimeout(() => {
      rej(error || new Error('Time out'));
    }, timeoutMs);
  });

export const delay = (delayMs: number): Promise<void> =>
  new Promise((res, rej) => {
    setTimeout(() => {
      res();
    }, delayMs);
  });
