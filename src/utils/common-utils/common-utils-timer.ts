export const timeout = (timeoutMs: number, error?: Error) => (
  new Promise((res, rej) => {
    setTimeout(() => {
      rej(error || new Error('Time out'));
    }, timeoutMs);
  })
);

  export const delay = (delayMs: number) => (
    new Promise((res, rej) => {
      setTimeout(() => {
        res();
      }, delayMs);
    })
  )